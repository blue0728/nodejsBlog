/**
 * 文件上传
 */

var formidable = require('formidable'),
    crypto = require('crypto'),            //nodeJs 加密模块
    fs = require('fs'),
    gm = require('gm'),
    User = require('../../modles/user.js');
imageMagick = gm.subClass({imageMagick: true});


module.exports = function (app) {
    var picUpload = '../public';                        //上传目录
    var pathTemp = '/temp/';                            //临时目录
    var pathAvatar = '/avatar/';                        //头像目录
    var pathUploadImg = '/upload/images/';                     //上传文章图片路径
    var maxSize = 1024 * 1024 * 4;                     //4M

    /*上传头像*/
    app.post('/uploadPic', function (req, res) {

        var fileName = req.headers['x-file-name'];       //文件名称
        var fileNameArr = fileName.split('.');
        var extName = fileNameArr[fileNameArr.length - 1]; //后缀名
        var fileLength = req.headers['content-length'];

        if (extName != 'jpg' && extName != 'jepg' && extName != 'png' && extName != 'gif') {
            return res.json({status: 'error', msg: '只能上传jpg、jepg、png、gif文件'});
        }

        if (fileLength > maxSize) {
            return res.json({status: 'error', msg: '文件尺寸过大'});
        }

        var form = new formidable.IncomingForm();
        form.uploadDir = picUpload + pathTemp;

        form.parse(req, function (err, fields, files) {

            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }

            //生成密码 MD5 加密值
            var md5 = crypto.createHash('md5'),
                name = md5.update(req.session.user.name).digest('hex');

            var avatarName = name + (new Date()).getTime() + '.' + extName;

            var newPath = picUpload + pathAvatar + avatarName;

            imageMagick(files.file.path).resize(300, 300).autoOrient().write(newPath, function (err) {  //自动裁剪为300
                if (err) {
                    return res.json({status: 'error', msg: err.toString()});
                }
                fs.unlink(files.file.path);                                         //删除临时文件
                return res.json({status: 'success', msg: '上传成功', path: pathAvatar + avatarName, filename: avatarName});
            });
        });

    });
    /*裁剪头像 需安装imagemagick*/
    app.post('/savePic', function (req, res) {
        var fileName = req.body.filename,
            x1 = req.body.x1, //左上角横坐标
            y1 = req.body.y1, //左上角纵坐标
            x2 = req.body.x2, //右下角横坐标
            y2 = req.body.y2, //右下角纵坐标
            _w = x2 - x1,
            _y = y2 - y1;
        var fileNameArr = fileName.split('.');
        var extName = fileNameArr[fileNameArr.length - 1]; //后缀名
        var name = fileNameArr[fileNameArr.length - 2];//文件名不带后缀名

        var path = picUpload + pathAvatar + name + '.' + extName;                                   //文件路径
        var savePath = pathAvatar + name + '150X150.' + extName;                                    //存储路径 150 * 150

        console.log(savePath)

        imageMagick(path).crop(_w, _y, x1, y1).resize(150, 150).autoOrient().write(picUpload + savePath, function (err) {             //裁剪完成后覆盖掉源文件

            if (err) {
                return res.json({status: 'error', msg: '保存失败'});
            }

            User.updateInfo(req.session.user._id, {face: savePath}, function (err) {

                if (err) {
                    return res.json({status: 'error', msg: err.toString()});
                }

                return res.json({status: 'success', msg: '上传成功', url: savePath});

            })
        });

    });

    /*上传图片*/
    app.post('/uploadPic/bigPic', function (req, res) {
        var fileName = req.query.Filedata;       //文件名称
        var fileNameArr = fileName.split('.');
        var extName = fileNameArr[fileNameArr.length - 1]; //后缀名
        var fileLength = req.headers['content-length'];

        if (extName != 'jpg' && extName != 'jepg' && extName != 'png' && extName != 'gif') {
            return res.json({status: 'error', msg: '只能上传jpg、jepg、png、gif文件'});
        }

        if (fileLength > maxSize) {
            return res.json({status: 'error', msg: '文件尺寸过大'});
        }

        var form = new formidable.IncomingForm();
        form.uploadDir = picUpload + pathTemp;

        form.parse(req, function (err, fields, files) {

            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }

            //生成密码 MD5 加密值
            var md5 = crypto.createHash('md5'),
                name = md5.update(req.session.user.name).digest('hex');

            var avatarName = name + (new Date()).getTime() + '.' + extName;

            var newPath = picUpload + pathUploadImg + avatarName;

            imageMagick(files.file.path).resize(800, 600, '>').autoOrient().write(newPath, function (err) {  //自动裁剪为300
                if (err) {
                    return res.json({status: 'error', msg: err});
                }
                fs.unlink(files.file.path);                                         //删除临时文件
                return res.json({
                    status: 'success',
                    msg: '上传成功',
                    path: pathUploadImg + avatarName,
                    filename: avatarName,
                    sourcefile: fileName
                });
            });
        });

    });


    /*上传图片form模式*/
    app.post('/upPic', function (req, res) {
        var form = new formidable.IncomingForm();

        form.uploadDir = picUpload + pathTemp;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.encoding = 'utf-8';

        form.parse(req, function (err, fields, files) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            var extName = '';  //后缀名


            switch (fields.type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }

            if (extName.length == 0) {
                return res.json({status: 'error', msg: '只支持png和jpg格式图片'});
            }



            //生成密码 MD5 加密值
            var md5 = crypto.createHash('md5'),
                name = md5.update(req.session.user.name).digest('hex');

            var avatarName = name + (new Date()).getTime() + '.' + extName;

            var newPath = picUpload + pathUploadImg + avatarName;

            fs.renameSync(files.file.path, newPath);  //重命名

            return res.json({
                status: 'success',
                msg: '上传成功',
                path: pathUploadImg + avatarName,
                filename: avatarName
            });
        })

    });
};

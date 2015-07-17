/**
 * Created by serge on 2015/7/17.
 *
 * 基于百度WebUploader 0.1.5进行修改 by serge
 * 支持require方式调用，二次封装
 *
 * @html 结构
 * ----------------------------------------------------
 * <div id="filePicker">选择图片</div>
 * <div id="fileList" class="uploader-list"></div>
 * ---------------------------------------------------
 *
 * @parms 参数与webuploader之一，可以覆盖默认参数
 * @parms onsuccess onError 成功和失败回调，返回服务器端接口结果
 * @parms picList 列表jq对象
 *
 * @demo 调用方法
 * ---------------------------------------------
 * new uploadpic({
 *    pick: $('#filePicker'),   //按钮
 *    picList: $('#fileList'),  //列表
 *    onSuccess: function (response) {
 *        //todo 回调
 *    },
 *    onError: function (response) {
 *       //todo 回调
 *    }
 * });
 *-----------------------------------------------
 *
 */
define(['webuploader', 'css!./webuploader'], function (webuploader) {
    function UploadPic(options) {
        this.options = options;
        this.webuploader = webuploader;
        this.creat();
    }

    var setting = {
        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: '/js/modules/uploadpic/Uploader.swf',

        // 文件接收服务端。
        server: '/upPic',

        //关闭日志
        disableWidgets: 'log',

        //上传文件数量，文件大小
        fileNumLimit: 0,
        fileSingleSizeLimit: 1024 * 1024,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/!*'
        },
        picList: $('#list'),
        onsuccess: null,
        onError: null
    }

    UploadPic.prototype = {

        creat: function () {

            var that = this;
            if (!webuploader.Uploader.support()) {
                alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
                throw new Error('WebUploader does not support the browser you are using.');
            }

            var opt = $.extend({}, setting, that.options);

            var $list = opt.picList;

            // 初始化Web Uploader
            var WebUploader = that.webuploader;

            var uploader = new WebUploader.Uploader(opt);

            // 当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                var $li = $(
                        '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<div class="uploader-dele"><a href="javascript:;"></a></div/>' +
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                        '</div>'
                    ),
                    $img = $li.find('img');

                // $list为容器jQuery实例
                $list.append($li);

                $li.on('click', '.uploader-dele a', function () {
                    uploader.removeFile(file, true);
                    $li.remove();
                });


                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                // thumbnailWidth x thumbnailHeight 为 100 x 100
                uploader.makeThumb(file, function (error, src) {
                    if (error) {
                        $img.replaceWith('<span class="uploader-noimg">不能预览</span>');
                        return;
                    }

                    $img.attr('src', src);
                }, 100, 100);
            });

            // 文件上传过程中创建进度条实时显示。
            uploader.on('uploadProgress', function (file, percentage) {
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');

                // 避免重复创建
                if (!$percent.length) {
                    $percent = $('<p class="progress"><span></span></p>')
                        .appendTo($li)
                        .find('span');
                }

                $percent.css('width', percentage * 100 + '%');
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on('uploadSuccess', function (file, response) {

                if (response.status == 'success') {
                    $('#' + file.id).append('<div class="upload-state-done"></div>');

                    opt.onSuccess && opt.onSuccess(response);//上传成功回调函数

                } else {
                    var $li = $('#' + file.id),
                        $error = $li.find('div.error');

                    // 避免重复创建
                    if (!$error.length) {
                        $error = $('<div class="error"></div>').appendTo($li);
                    }

                    $error.text('上传失败');

                    opt.onError && opt.onError(response);//上传失败回调函数
                }


            });

            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function (file, reason) {
                var $li = $('#' + file.id),
                    $error = $li.find('div.error');

                // 避免重复创建
                if (!$error.length) {
                    $error = $('<div class="error"></div>').appendTo($li);
                }

                $error.text('上传失败');
            });

            // 完成上传完了，成功或者失败，先删除进度条。
            uploader.on('uploadComplete', function (file) {
                $('#' + file.id).find('.progress').remove();
            });

            uploader.onError = function (code) {
                alert('Eroor: ' + code);
            };
        }

    }

    return UploadPic
})
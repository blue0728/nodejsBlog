/**
 * 用户中心路由
 */
var crypto = require('crypto'),  //nodeJs 加密模块
    User = require('../../modles/user.js'),
    request = require('request');

module.exports = function (app) {

    app.get('/user', function (req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        User.get(req.session.user.name, function (err, user) {

            var userInfo = {};

            if (err) {
                userInfo = {};
            }

            userInfo = user;

            if (userInfo.face != '') {
                userInfo.head = userInfo.face;
            } else {
                userInfo.head = userInfo.avatar;
            }

            res.render('admin/user', {
                title: '我的资料',
                user: userInfo
            });
        })

    })

    app.post('/user/update', function (req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        var sessionPwd = req.session.user.password;

        var id = req.session.user._id,
            oldPwd = req.body.oldPwd,
            newPwd = req.body.newPwd,
            newPwd_pre = req.body.newPwd_pre,
            email = req.body.email;
        var userInfo = {};
        var msg = '';

        if (oldPwd != '') {
            //生成密码 MD5 加密值
            var md5 = crypto.createHash('md5'),
                Md5oldPwd = md5.update(oldPwd).digest('hex');

            if (Md5oldPwd != sessionPwd) {
                return res.json({status: 'error', msg: '原密码错误'});
            }

            if (newPwd == '' || newPwd_pre == '') {
                return res.json({status: 'error', msg: '新密码/确认密码不能为空'});
            }

            if (newPwd != newPwd_pre) {
                return res.json({status: 'error', msg: '新密码/确认密码不一致'});
            }

            var md5 = crypto.createHash('md5'),
                Md5newPwd = md5.update(newPwd).digest('hex');

            userInfo = {
                password: Md5newPwd,
                email: email
            }

            req.session.user = null;  //修改密码后 清楚session 重新登录

            msg = '修改成功，请重新登录';

        } else {
            userInfo = {
                email: email
            }

            msg = '修改成功';
        }

        User.updateInfo(id, userInfo, function (err) {

            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }

            return res.json({status: 'success', msg: msg});

        })

    })
}
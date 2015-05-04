/**
 * 用户登录注册退出路由控制
 */
var crypto = require('crypto'),  //nodeJs 加密模块
    User = require('../modles/user.js'); //引入用户登录函数

module.exports = function (app) {
    /*注册*/
    app.get('/reg', function (req, res) {
        if (req.session.user) {
            return res.redirect('/');
        }
        res.render('reg', {
            title: '注册',
            user: req.session.user
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body.password_re,
            email = req.body.email;

        //检测输入信息完整
        if (name == '' || password == '' || password_re == '') {

            return res.json({status: 'error', msg: '请输入完整的注册信息'});
        }

        //检测用户两次输入密码是否一致
        if (password_re != password) {
            return res.json({status: 'error', msg: '两次输入密码不一致'});
        }

        //生成密码 MD5 加密值
        var md5 = crypto.createHash('md5'),
            password = md5.update(password).digest('hex');
        var newUser = new User({
            name: name,
            password: password,
            email: email
        })

        //检查用户名是否存在
        User.get(newUser.name, function (err, user) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            if (user) {
                return res.json({status: 'error', msg: '用户已存在'});
            }

            //如果用户不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    return res.json({status: 'error', msg: err.toString()});
                }
                req.session.user = user; //用户信息存入 session
                return res.json({status: 'success', msg: '注册成功'});
            })

        })
    });

    /*登录*/
    app.get('/login', function (req, res) {
        if (req.session.user) {
            return res.redirect('/'); //跳转到首页
        }

        res.render('login', {
            title: '首页',
            user: req.session.user
        });
    });
    app.post('/login', function (req, res) {
        //加密 md5 密码值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function (err, user) {
            if (user && user.password == password) {
                //用户名密码匹配正确后,用户信息写入session
                req.session.user = user;
                return res.json({status: 'success', msg: '登录成功'});
            } else {
                return res.json({status: 'error', msg: '用户名/密码错误'});
            }
        })
    });

    /*退出*/
    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');//登出成功后跳转到主页
    });
}
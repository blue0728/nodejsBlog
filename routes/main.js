/**
 * 主文件入口路由
 */

var Users = require('./users'),                  //登录注册退出
    Post = require('./admin/post'),             //文章发表、编辑、删除
    User = require('./admin/user'),             //用户中心
    Upload = require('./admin/upload'),         //上传文件
    Index = require('./index'),                  //首页
    up = require('./upload'),                  //首页
    Splider = require('./splider');                 //爬虫

module.exports = function (app) {
    Users(app);
    Index(app);
    Post(app);
    User(app);
    Upload(app);
    Splider(app);
    up(app);
    /*404*/
    //app.use(function (req, res, next) {
    //    res.render('404', {
    //        title: '404页',
    //        user: req.session.user
    //    });
    //});
    /*500*/
    //app.use(function (error, req, res, next) {
    //    res.status(500);
    //    res.render('500', {
    //        title: '500页',
    //        user: req.session.user,
    //        error: error
    //    });
    //});
}



/**
 * 后台文章管理路由控制
 */
var Post = require('../../modles/post.js');
var marked = require('marked');             //markdown 解析
module.exports = function (app) {

    /*发表*/
    app.get('/user/post/', function (req, res) {

        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('admin/post', {
            title: '发表',
            user: req.session.user,
            post: []
        });
    });
    app.post('/user/post/', function (req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        var currentUser = req.session.user.name,
            _title = req.body.title,
            _post = req.body.post,
            _summary = removeHTMLTag(marked(req.body.post)).substr(0, 200);

        if (_title == '' || _post == '') {
            return res.json({status: 'error', msg: '标题/正文不能为空'});
        }

        var post = new Post(currentUser, _title, _post, _summary);

        post.save(function (err) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            return res.json({status: 'success', msg: '添加成功'});
        });
    });

    /*修改文章*/
    app.get('/user/edit/:id', function (req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        var _id = req.params.id;
        if (_id.length != 24) {
            res.render('admin/post', {
                title: '编辑页',
                user: req.session.user,
                post: null
            });
        } else {
            Post.getArticle(_id, function (err, post) {
                if (err) {
                    post = {};
                }
                res.render('admin/post', {
                    title: '编辑页',
                    user: req.session.user,
                    post: post
                });
            })
        }
    });
    app.post('/user/edit', function (req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        var _id = req.body.id,
            _title = req.body.title,
            _post = req.body.post,
            _summary = removeHTMLTag(marked(req.body.post)).substr(0, 200);

        if (_title == '' || _post == '') {
            return res.json({status: 'error', msg: '标题/正文不能为空'});
        }

        Post.updateArticle(_id, _title, _post, _summary, function (err) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            return res.json({status: 'success', msg: '添加成功'});
        });
    });

    /*我的文章*/
    app.get('/user/list', function (req, res) {

        if (!req.session.user) {
            return res.redirect('/login');
        }
        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.getUserAll(req.session.user.name, page, function (err, posts, pages) {
            if (err) {
                posts = [];
            }
            res.render('admin/list', {
                title: '我的文章',
                user: req.session.user || '',
                posts: posts,
                pages: pages
            });
        })
    });

    /*回收站*/
    app.get('/user/recycle', function (req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.getUserAllRecycle(req.session.user.name, page, function (err, posts, pages) {
            if (err) {
                posts = [];
            }
            res.render('admin/list', {
                title: '回收站',
                user: req.session.user || '',
                posts: posts,
                pages: pages
            });
        })

    })

    /*删除*/
    app.post('/user/dele', function (req, res) {

        if (!req.session.user) {
            return res.json({status: 'success', msg: '用户未登录'});
        }

        Post.remove(req.body.id, function (err) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            return res.json({status: 'success', msg: '删除成功'});
        })
    })

    /*撤销删除*/
    app.post('/user/undo', function (req, res) {

        if (!req.session.user) {
            return res.json({status: 'success', msg: '用户未登录'});
        }

        Post.undoRemove(req.body.id, function (err) {
            if (err) {
                return res.json({status: 'error', msg: err.toString()});
            }
            return res.json({status: 'success', msg: '删除成功'});
        })
    })

    /*格式化html*/
    function removeHTMLTag(str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, ''); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, ''); //去除多余空行
        str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
        return str;
    }
}

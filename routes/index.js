/**
 * 前台路由控制
 */
var crypto = require('crypto'),//nodeJs 加密模块
    xss = require('xss'),
    marked = require('marked'),
    async = require('async'),
    Post = require('../modles/post.js'),      //文章函数
    Comment = require('../modles/comment.js'); //引入用户评论函数

module.exports = function (app) {
    /*首页*/
    app.get('/', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;

        Post.getAll(page, function (err, posts, pages) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: posts,
                pages: pages
            });
        })
    });

    /*文章详情页*/
    app.get('/p/:id', function (req, res) {
        var _id = req.params.id;

        /*获取文章详情*/
        function getArticle(cb) {
            Post.getArticle(_id, function (err, post) {
                post.post = xss(marked(post.post));
                cb(err, post);
            })
        }

        /*获取评论列表*/
        function getComment(cb) {
            var page = req.query.p ? parseInt(req.query.p) : 1;
            Comment.get(_id, page, function (err, comments, pages) {
                if (err) {
                    comments = [];
                }
                cb(err, comments, pages)
            });
        }

        /*async.parallel 同步执行每个函数 结果返回依次添加进数组，*/
        async.parallel([getArticle, getComment], function (err, result) {
            if (err) {
                result = [];
            }
            var comments = result[1][0],
                pages = result[1][1];

            for (var i = 0, len = comments.length; i < len; i++) {
                comments[i]['content'] = xss(marked(comments[i]['content']));
            }

            res.render('article', {
                title: '详情页',
                user: req.session.user || '',
                post: result[0],
                comments: comments,
                pages: pages
            });
        });
    });

    /*用户文章列表页*/
    app.get('/post/:user', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.getUserAll(req.params.user, page, function (err, posts, pages) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '列表页',
                user: req.session.user || '',
                posts: posts,
                pages: pages
            });
        })
    });

    /*搜索*/
    app.get('/search/', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;

        Post.getAll(page, function (err, posts, pages) {
            if (err) {
                posts = [];
            }
            res.render('search', {
                title: '搜索页',
                user: req.session.user,
                posts: posts,
                pages: pages
            });
        })
    });

    app.get('/search/:q', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        var keyword = req.params.q ? req.params.q : '';
        Post.search(keyword, page, function (err, posts, pages) {
            if (err) {
                posts = [];
            }
            res.render('search', {
                title: '搜索页',
                user: req.session.user || '',
                posts: posts,
                pages: pages
            });
        });
    });

    /*文章详情页评论*/
    app.post('/comment', function (req, res) {

            if (req.body.id == '') {
                return res.json({status: 'error', msg: '文章ID不存在'});
            }

            if (req.body.content == '') {
                return res.json({status: 'error', msg: '请填写完整评论信息'});
            }

            var newComment = new Comment({
                postId: req.body.postId,
                userId: req.session.user._id,
                userName: req.session.user.name,
                userFace: req.session.user.face,
                userAvatar: req.session.user.avatar,
                userEmail: req.session.user.email,
                content: req.body.content,
                replyId: '',
                replyUserName: ''

            });
            newComment.save(function (err) {
                if (err) {
                    return res.json({status: 'error', msg: err.toString()});
                }

                return res.json({status: 'success', msg: '评论成功'})
            })
        }
    )

    /*回复评论*/
    app.post('/comment/reply', function (req, res) {

            if (req.body.id == '') {
                return res.json({status: 'error', msg: '文章ID不存在'});
            }

            if (req.body.content == '') {
                return res.json({status: 'error', msg: '请填写完整评论信息'});
            }

            var newComment = new Comment({
                postId: req.body.postId,
                userId: req.session.user._id,
                userName: req.session.user.name,
                userFace: req.session.user.face,
                userAvatar: req.session.user.avatar,
                userEmail: req.session.user.email,
                content: req.body.content,
                replyId: req.body.replyId,
                replyUserName: req.body.replyUserName
            });
            newComment.save(function (err) {
                if (err) {
                    return res.json({status: 'error', msg: err.toString()});
                }

                return res.json({status: 'success', msg: '评论成功'})
            })
        }
    )
}
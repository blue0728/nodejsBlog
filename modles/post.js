/**
 * Created by Administrator on 2015/3/30 0030.
 */
var mongoose = require('./db');
var Schema = mongoose.Schema;
var pageNum = 10, navNum = 5;  //pageNum 每页条数  navNum页码显示数量

var PostSchema = new Schema({
    name: String,
    title: String,
    time: {},
    post: String,
    summary: String,
    isShow: Boolean
});

var postModel = mongoose.model('posts', PostSchema, 'posts');

function Post(name, title, post, summary) {
    this.name = name;
    this.title = title;
    this.post = post;
    this.summary = summary
};

module.exports = Post;
/*新增文章*/
Post.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post,
        summary: this.summary,
        isShow: true
    };

    var newPost = new postModel(post);
    newPost.save(function (err, post) {
        if (err) {
            return callback(err);
        }
        callback(null, post);
    })

}

/*获取所有文章列表*/
Post.getAll = function (page, callback) {
    postModel.count({isShow: true}, function (err, total) {
        var query = postModel.find({isShow: true});
        query.limit(pageNum)
            .skip((page - 1) * pageNum)
            .sort({'_id': -1})
            .exec(function (err, docs) {
                var nums = 0;
                if (total % pageNum == 0) {
                    nums = total / pageNum;
                } else {
                    nums = Math.ceil(total / pageNum);
                }
                var pages = {
                    current: page,
                    total: nums,
                    navnum: navNum
                }
                if (err) {
                    return callback(err);
                }
                callback(null, docs, pages);
            })
    })
}

/*获取用户正常文章列表*/
Post.getUserAll = function (name, page, callback) {
    postModel.count({name: name, isShow: true}, function (err, total) {
        var query = postModel.find({name: name, isShow: true});
        query.limit(pageNum)
            .skip((page - 1) * pageNum)
            .sort({'_id': -1})
            .exec(function (err, docs) {
                var nums = 0;
                if (total % pageNum == 0) {
                    nums = total / pageNum;
                } else {
                    nums = Math.ceil(total / pageNum);
                }
                var pages = {
                    current: page,
                    total: nums,
                    navnum: navNum
                }
                if (err) {
                    return callback(err);
                }
                callback(null, docs, pages);
            })
    });
}

/*获取用户回收站文章列表*/
Post.getUserAllRecycle = function (name, page, callback) {
    postModel.count({name: name, isShow: false}, function (err, total) {
        var query = postModel.find({name: name, isShow: false});
        query.limit(pageNum)
            .skip((page - 1) * pageNum)
            .sort({'_id': -1})
            .exec(function (err, docs) {
                var nums = 0;
                if (total % pageNum == 0) {
                    nums = total / pageNum;
                } else {
                    nums = Math.ceil(total / pageNum);
                }
                var pages = {
                    current: page,
                    total: nums,
                    navnum: navNum
                }
                if (err) {
                    return callback(err);
                }
                callback(null, docs, pages);
            })
    });
}

/*获取文章详情*/
Post.getArticle = function (id, callback) {

    postModel.findById(id, function (err, doc) {
        if (err) {
            return callback(err);
        }
        callback(null, doc);
    });
}

/*编辑文章详情*/
Post.updateArticle = function (id, title, post, summary, callback) {
    postModel.findByIdAndUpdate(id, {$set: {post: post, title: title, summary: summary, isShow: true}}, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        }
    )
}

/*删除文章(软删除)*/
Post.remove = function (id, callback) {

    postModel.findByIdAndUpdate(id, {$set: {isShow: false}}, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        }
    )
};

/*撤销删除*/
Post.undoRemove

/*搜索文章*/
Post.search = function (keyword, page, callback) {
    var pattern = new RegExp(keyword, 'i');

    var condition = {'title': pattern,'isShow': true};

    postModel.count(condition, function (err, total) {
        var query = postModel.find(condition);

        query.limit(pageNum)
            .skip((page - 1) * pageNum)
            .sort({'_id': -1})
            .exec(function (err, docs) {
                var nums = 0;
                if (total % pageNum == 0) {
                    nums = total / pageNum;
                } else {
                    nums = Math.ceil(total / pageNum);
                }
                var pages = {
                    current: page,
                    total: nums,
                    navnum: navNum
                }
                if (err) {
                    return callback(err);
                }
                callback(null, docs, pages);
            })
    });
}
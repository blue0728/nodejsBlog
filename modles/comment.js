/**
 * Created by Administrator on 2015/4/3 0003.
 */
var mongoose = require('./db');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var async = require('async');  //异步控制
var pageNum = 10, navNum = 5;  //pageNum 每页条数  navNum页码显示数量

var CommentsSchema = new Schema({
    postId: String,
    userId: String,
    userName: String,
    userFace: String,
    userAvatar: String,
    userEmail: String,
    content: String,
    replyId: String,
    replyUserName: String,
    time: {}
});

var commentsModel = mongoose.model('comments', CommentsSchema, 'comments');

function Comments(com) {
    this.postId = com.postId;
    this.userId = com.userId;
    this.userName = com.userName;
    this.userFace = com.userFace;
    this.userAvatar = com.userAvatar;
    this.userEmail = com.userEmail;
    this.content = com.content;
    this.replyId = com.replyId;
    this.replyUserName = com.replyUserName;
};

module.exports = Comments;

Comments.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    var comment = {
        postId: this.postId,
        userId: this.userId,
        userName: this.userName,
        userFace: this.userFace,
        userAvatar: this.userAvatar,
        userEmail: this.userEmail,
        content: this.content,
        replyId: this.replyId,
        replyUserName: this.replyUserName,
        time: time

    };

    var newComment = new commentsModel(comment);
    newComment.save(function (err, post) {
        if (err) {
            return callback(err);
        }
        callback(null, post);
    })
}

Comments.findById = function(id,callback){
    commentsModel.findById(id, function (err, comment) {
        if(err){
            return callback(err);
        }
        callback(null,comment);
    });
}

Comments.get = function (postId, page, callback) {

    /*总条数*/
    function counts(cb) {
        commentsModel.count({postId: postId}, function (err, total) {
            cb(err, total);
        });
    }

    /*评论 分页*/
    function comments(total, cb) {
        var query = commentsModel.find({postId: postId});
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
                cb(err, docs, pages);
            })
    }

    /*异步*/
    async.waterfall([counts, comments], function (err, docs, pages) {
        callback(err, docs, pages);
    });
}


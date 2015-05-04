/**
 * Created by Administrator on 2015/4/7 0007.
 */
require(['tip', 'markdown'], function (tip, markdown) {
    var $btn = $('#com-btn'),
        _postId = $('#postId').val(),
        $comment_list = $('#comment_list'),
        reply = {};

    var M = new markdown({
        element: document.getElementById('com_text'),
        status: null
    });

    /*评论*/
    $btn.on('click', function () {
        var _this = $(this),
            _text = $.trim(M.value());

        if (_text == '') {
            tip.warn('请填写评论信息');
            return;
        }

        if (_this.find('img').length > 0) {
            return;
        }

        _this.html('<img src="/images/loading.gif"/>发表评论');

        $.ajax({
            url: '/comment',
            type: 'post',
            dataType: 'json',
            data: {
                postId: _postId,
                content: _text
            },
            success: function (data) {
                if (data.status == 'success') {
                    location.href = location.href;
                } else {
                    _this.html('发表评论');
                    tip.warn(data.msg);
                }
            },
            error: function (xhr) {
                _this.html('发表评论');
                tip.warn('服务器忙' + xhr.status);
            }
        })
    })

    /*回复评论*/
    $comment_list.on('click', 'a.reply-user', function () {
        var _this = $(this),
            _replyId = _this.data('replyid'),
            $replyBox = $('#reply-box-' + _replyId);
        if (_this.hasClass('show')) {
            $replyBox.slideUp();
            _this.removeClass('show').addClass('hide');
            return;
        }
        if (_this.hasClass('hide')) {
            $replyBox.slideDown();
            _this.removeClass('hide').addClass('show');
            return;
        }
        reply[_replyId] = new markdown({
            element: document.getElementById('comment-text-' + _replyId),
            status: null
        });
        _this.addClass('show');
        $replyBox.slideDown();

    }).on('click', 'a.cancel', function () {
        var _this = $(this),
            _id = _this.data('replyid'),
            $replyBox = $('#reply-box-' + _id);
        $replyBox.slideUp();
        _this.closest('.comment_li').find('.reply-user').removeClass('show').addClass('hide');

    }).on('click', '.reply-btn', function () {
        var _this = $(this),
            _replyId = _this.data('replyid'),
            _replyUserName = _this.data('replyname'),
            $replyBox = $('#reply-box-' + _replyId);
        var _text = $.trim(reply[_replyId].value());

        if (_text == '') {
            tip.warn('请填写评论信息');
            return;
        }

        if (_this.find('img').length > 0) {
            return;
        }

        _this.html('<img src="/images/loading.gif"/>回复评论');

        $.ajax({
            url: '/comment/reply',
            type: 'post',
            dataType: 'json',
            data: {
                postId: _postId,
                replyId: _replyId,
                replyUserName: _replyUserName,
                content: _text
            },
            success: function (data) {
                if (data.status == 'success') {

                    $replyBox.slideUp();
                    _this.closest('.comment_li').find('.reply-user').removeClass('show').addClass('hide');

                    location.href = location.href;

                } else {
                    _this.html('回复评论');
                    tip.warn(data.msg);
                }
            },
            error: function (xhr) {
                _this.html('回复评论');
                tip.warn('服务器忙' + xhr.status);
            }
        })


    });
})
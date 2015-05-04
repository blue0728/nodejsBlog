/**
 * Created by Administrator on 2015/4/7 0007.
 */
require(['tip', 'markdown'], function (tip,markdown) {
    var $post = $('#post'),
        $title = $('#title'),
        $btn = $('#sub-btn'),
        K = null;

    K = new markdown({
        element: document.getElementById('post'),
        status: null
    });

    $btn.on('click', function () {
        var _this = $(this),
            _post = $.trim(K.value()),
            _title = $.trim($title.val()),
            _id = _this.data('id'),
            _url = '',
            _html = '';

        if (_post == '' || _title == '') {
            tip.warn('文章标题/内容不能为空');
            return;
        }

        var parms = {
            title: _title,
            post: _post
        };

        if (_id) {
            parms.id = _id;
            _url = '/user/edit';
            _html = '修改文章';
        } else {
            _url = '/user/post';
            _html = '发表文章';
        }

        if (_this.find('img').length > 0) {
            return;
        }

        _this.html('<img src="/images/loading.gif"/>' + _html);

        $.ajax({
            url: _url,
            type: 'post',
            dataType: 'json',
            data: parms,
            success: function (data) {
                if (data.status == 'success') {
                    location.href = location.href;
                } else {
                    _this.html(_html);
                    tip.warn(data.msg);
                }
            },
            error: function (xhr) {
                _this.html(_html);
                tip.warn('服务器忙' + xhr.status);
            }
        })

    });
})

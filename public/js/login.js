/**
 * Created by Administrator on 2015/4/7 0007.
 */
require(['tip'],function(tip){
    var $username = $('#username'),
        $password = $('#password'),
        $btn = $('#btn-sub');
    $btn.on('click', function () {
        var _this = $(this),
            _name = $username.val(),
            _pwd = $password.val();
        if (_name == '' || _pwd == '') {
            tip.warn('请填写用户名/密码');
            return;
        }

        if(_this.find('img').length > 0){
            return;
        }

        _this.html('<img src="/images/loading.gif"/>登录')

        $.ajax({
            url: '/login',
            type: 'post',
            dataType: 'json',
            data: {
                name: _name,
                password: _pwd
            },
            success: function (data) {
                if (data.status == 'success') {
                    location.href = '/';
                } else {
                    _this.html('登录');
                    tip.warn(data.msg)
                }
            },
            error: function (xhr) {
                _this.html('登录');
                tip.warn('服务器忙' + xhr.status);
            }
        })
    });

    $('#username,#password,#btn-sub').on('keypress', function (e) {
        if(e.keyCode == 13){
            $btn.trigger('click');
        }
    })
})
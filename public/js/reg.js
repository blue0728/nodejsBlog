/**
 * Created by Administrator on 2015/4/7 0007.
 */
require(['tip'], function (tip) {
    var $username = $('#username'),
        $password = $('#password'),
        $password_re = $('#password-repeat'),
        $email = $('#email'),
        $btn = $('#btn-sub');
    $btn.on('click', function () {
        var _this = $(this),
            _name = $username.val(),
            _pwd = $password.val(),
            _pwd_re = $password_re.val(),
            _email = $email.val();
        if (_name == '' || _pwd == '' || _pwd_re == '' || _email == '') {
            tip.warn('请输入完整的注册信息');
            return;
        }

        if (_pwd != _pwd_re) {
            tip.warn('两次输入密码不一致');
            return;
        }

        if(_this.find('img').length > 0){
            return;
        }

        _this.html('<img src="/images/loading.gif"/>注册');

        $.ajax({
            url: '/reg',
            type: 'post',
            dataType: 'json',
            data: {
                name: _name,
                password: _pwd,
                password_re: _pwd_re,
                email: _email
            },
            success: function (data) {
                if (data.status == 'success') {
                    tip.success('注册成功！',null,function(){
                        location.href = '/';
                    })
                } else {
                    _this.html('注册');
                    tip.warn(data.msg);
                }
            },
            error: function (xhr) {
                _this.html('注册');
                tip.warn('服务器忙' + xhr.status)
            }
        })
    })
})
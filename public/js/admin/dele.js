/**
 * Created by Administrator on 2015/4/7 0007.
 */
require(['tip'], function (tip) {
    var $list = $('#list');

    $list.on('click', 'a.dele', function () {
        var _this = $(this),
            _id = _this.data('id');
        tip.confirm('确认删除这篇文章？', function () {
            $.ajax({
                url: '/user/dele',
                type: 'post',
                dataType: 'json',
                data: {id: _id},
                success: function (data) {
                    if (data.status == 'success') {
                        _this.closest('li').hide(300, function () {
                            $(this).remove();

                            if($list.find('li').length == 0){
                                location.href = location.href;
                            }
                        });
                    } else {
                        tip.warn(data.msg);
                    }
                },
                error: function (xhr) {
                    tip.warn('服务器忙' + xhr.status);
                }
            })
        })
    }).on('click', 'a.undo', function () {
        var _this = $(this),
            _id = _this.data('id');
        tip.confirm('确认撤销删除这篇文章？', function () {
            $.ajax({
                url: '/user/undo',
                type: 'post',
                dataType: 'json',
                data: {id: _id},
                success: function (data) {
                    if (data.status == 'success') {
                        _this.closest('li').hide(300, function () {
                            $(this).remove();
                            if($list.find('li').length == 0){
                                location.href = location.href;
                            }
                        });
                    } else {
                        tip.warn(data.msg);
                    }
                },
                error: function (xhr) {
                    tip.warn('服务器忙' + xhr.status);
                }
            })
        })
    })
})
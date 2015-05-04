/**
 * Created by Administrator on 2015/4/9 0009.
 */
require(['tip', 'dialog'], function (tip, dialog) {
    var $avatar = $('#avatar'),
        $upload = $('#upload'),
        $photo = $('#avatar img');
    $avatar.on('mouseenter', function () {
        $upload.show();
    }).on('mouseleave', function () {
        $upload.hide();
    });

    /** 修改头像 **/
    $upload.on('click', function () {
        var $this = $(this),
            html = '<div class="avatar_form cle_f">' +
                '<table><tr><td>' +
                '<div class="avatar_demo_pic" id="avatar_demo_pic"></div>' +
                '<div id="uploadphoto_btn"></div>' +
                '</td>' +
                '<td class="r">' +
                '<div class="avatar_tip">您上传的头像会自动生成150x150的尺寸，<br>请注意头像是否清晰，尽量选择近脸照片</div>' +
                '<p>预览：</p>' +
                '<div class="avatar_preview"><img src="/images/kong.gif" id="avatar_preview" /></div>' +
                '<input type="hidden" id="filename_old" />' +
                '<input type="hidden" id="x1" />' +
                '<input type="hidden" id="y1" />' +
                '<input type="hidden" id="x2" />' +
                '<input type="hidden" id="y2" />' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>';
        var photo_dialog = dialog({
            title: "修改头像",
            content: html,
            onshow: function () {
                createUploader();
            },
            ok: function () {
                var $x1 = $.trim($("#x1").val()); //得到选中区域左上角横坐标
                var $y1 = $.trim($("#y1").val()); //得到选中区域左上角纵坐标
                var $x2 = $.trim($("#x2").val()); //得到选中区域右下角横坐标
                var $y2 = $.trim($("#y2").val()); //得到选中区域右下角纵坐标
                if ($x1 == "" || $y1 == "" || $x2 == "" || $y2 == "") {
                    return false;
                }
                var params = {
                    'x1': $x1,
                    'y1': $y1,
                    'x2': $x2,
                    'y2': $y2,
                    'filename': $("#filename_old").val()
                }
                $.ajax({
                    url: '/savePic',
                    //url: 'json.html',
                    type: 'post',
                    data: params,
                    dataType: "json",
                    success: function (result) {
                        if (result.status == 'success') {
                            $photo.attr('src', result.url);
                        } else {
                            tip.warn("服务器忙，请稍后再试");
                        }
                    },
                    error: function (xhr) {
                        tip.warn("服务器忙，请稍后再试。(" + xhr.status + ")");
                    }
                });
            },
            cancelValue: '取消',
            cancel: function () {
            }
        });
        photo_dialog.showModal();
    });

    var $oldPwd = $('#oldpwd'),
        $newPwd = $('#newpwd'),
        $newPwd_pre = $('#newpwd-pre'),
        $email = $('#email'),
        $btn = $('#sub-btn');

    $btn.on('click', function () {
        var _this = $(this),
            _oldPwd = $oldPwd.val(),
            _newPwd = $.trim($newPwd.val()),
            _newPwd_pre = $.trim($newPwd_pre.val()),
            _email = $email.val();

        if (_oldPwd != '') {

            if (_newPwd == '' || _newPwd_pre == '') {
                tip.warn('新密码/确认密码不能为空');
                return;
            }
            if (_newPwd != _newPwd_pre) {
                tip.warn('新密码/确认密码不一致');
                return;
            }
        }

        if (_this.find('img').length > 0) {
            return;
        }

        _this.html('<img src="/images/loading.gif"/>修改资料');

        $.ajax({
            url: '/user/update',
            type: 'post',
            dataType: 'json',
            data: {oldPwd: _oldPwd, newPwd: _newPwd, newPwd_pre: _newPwd_pre, email: _email},
            success: function (data) {
                if (data.status == 'success') {
                    tip.success(data.msg, null, function () {
                        location.href = location.href;
                    });
                } else {
                    _this.html('修改资料');
                    tip.warn(data.msg);
                }
            },
            error: function (xhr) {
                _this.html('修改资料');
                tip.warn('服务器忙' + xhr.status);
            }
        })
    });

    // 初始化上传头像
    function createUploader() {
        require(['upload'], function (upload) {
            var uploader = new upload({
                element: document.getElementById('uploadphoto_btn'),
                action: '/uploadPic',
                //action: 'json.html',
                onComplete: function (id, fileName, json) {
                    if (json.status == 'success') {
                        uploadAvatarPicture(json.path, json.filename);
                    } else {
                        tip.warn('图片上传失败，请稍后再试。')
                    }
                }
            });
        })
    }

    //上传后显示头像
    function uploadAvatarPicture(pic_url, filename) {
        $('#avatar_demo_pic').html('<img id="avatar_demo" src="' + pic_url + '" />');
        $("#avatar_preview").attr("src", pic_url);
        $("#filename_old").val(filename);

        var loadimg = new Image();
        loadimg.src = pic_url;

        require(['imagesloaded', 'jcrop'], function (imagesLoaded, jcrop) {
            imagesLoaded($(loadimg), function () {
                var width = loadimg.width;
                var height = loadimg.height;
                var select = [],
                    x = 0,
                    y = 0;
                if (width <= 300 && width > height) {
                    x = width / 2 - (height - 20) / 2;
                    y = width - x;
                    select = [x, 10, y, height - 10];
                } else if (height <= 300 && width <= height) {
                    x = height / 2 - (width - 20) / 2;
                    y = height - x;
                    select = [10, x, width - 10, y];
                } else {
                    select = [10, 10, 290, 290];
                }
                $('#avatar_demo').Jcrop({
                    onChange: showPreview, //当选择区域变化的时候，执行对应的回调函数
                    onSelect: showPreview, //当选中区域的时候，执行对应的回调函数
                    aspectRatio: 1, //选中区域宽高比为1，即选中区域为正方形
                    bgColor: "#666", //裁剪时背景颜色设为灰色
                    bgOpacity: 0.1, //透明度设为0.1
                    allowResize: true, //不允许改变选中区域的大小
                    setSelect: select //初始化选中区域
                });
            });
        });
    }

    function showPreview(c) {
        if (parseInt(c.w) > 0) {
            preview_avatar(c);
            $("#x1").val(c.x);
            $("#y1").val(c.y);
            $("#x2").val(c.x2);
            $("#y2").val(c.y2);
        }
    }

    function preview_avatar(c) {
        var rx = 150 / c.w,
            ry = 150 / c.h,
            $demo = $("#avatar_demo"),
            width_old = $demo.width(),
            height_old = $demo.height();

        $('#avatar_preview').css({
            width: Math.round(rx * width_old) + 'px',
            height: Math.round(ry * height_old) + 'px',
            marginLeft: '-' + Math.round(rx * c.x) + 'px',
            marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
    }

})
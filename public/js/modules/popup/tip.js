/*
 ** 提示弹窗
 */

define(['dialog'], function (dialog) {

    var Tip = {
        dialog: dialog,

        // 成功
        success: function (html, time, callback) {
            var _dg = null;
            var times = time || 2;
            var html = '<div class="tip_success"><i class="iconfont">&#xe61f;</i>' + html + '</div>';

            _dg = this.dialog({
                id: 'success',
                skin: 'dialog_tip',
                content: html
            }).show();

            setTimeout(function () {
                _dg.close().remove();
                callback && callback();
            }, times * 1000);
        },

        // 警告
        warn: function (html, callback) {
            var _dg = null;
            var html = '<div class="tip_warn"><i class="iconfont">&#xe617;</i>' + html + '</div>';
            _dg = this.dialog({
                id: 'warn',
                skin: 'dialog_tip',
                content: html,
                ok: function () {
                    callback && callback();
                }
            }).show();
        },

        // ok
        ok: function (html, callback) {
            var _dg = null;
            var html = '<div class="tip_ok"><i class="iconfont">&#xe61f;</i>' + html + '</div>';
            _dg = this.dialog({
                id: 'ok',
                skin: 'dialog_tip',
                content: html,
                ok: function () {
                    callback && callback();
                }
            }).show();
        },

        // 确认
        confirm: function (html, callback) {
            var _dg = null;
            var html = '<div class="tip_confirm"><i class="iconfont">&#xe621;</i>' + html + '</div>';
            _dg = this.dialog({
                id: 'confirm',
                skin: 'dialog_tip',
                content: html,
                ok: function () {
                    callback && callback();
                },
                cancel: true
            }).show();
        }
    }

    return Tip;
});

/**
 * Created by Administrator on 2015/4/7 0007.
 */
require([], function () {
    var $search_btn = $('#search_btn'),
        $keyword = $('#keyword');

    $search_btn.on('click', function () {
        location.href = '/search/' + $keyword.val();
    });

    $keyword.on('keypress', function (e) {
        if(e.keyCode == 13){
            $search_btn.trigger('click');
        }
    })
})

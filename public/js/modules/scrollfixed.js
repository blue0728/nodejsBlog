/*
** 滚动页面，dom元素悬浮顶部
** $elem：jquery元素
*/
define(function(){
    var scrollFixed = function($elem) {
        var $this = $elem,
            $window = $(window),
            fixed = null,
            _height = $this.height(),
            _top = $this.offset().top;

        if(LIZI.check.isIE6){
            return;
        }

        fixed = function (){
            var _sTop = $window.scrollTop();
            if(_sTop > _top){
                if($this.hasClass('fixed')){
                    return;
                }
                $this.addClass('fixed');
            }else{
                $this.removeClass('fixed');
            }
        };

        $window.on('scroll', fixed);
    }

    return scrollFixed;
});
/*
** 生成分页
** current:当前页
** total:分页总数
** navnum: 分页显示数,默认显示8条
*/
define(function(){
    var pagenav = function(current, total, navnum){
        var _html = '';
        var a = [];
        var i = t = 0;

        if(total<2){
            return '';
        }

        navnum = navnum || 8;

        if(current == 1){
            a[0] = '<span class="currentStep">1</span>';
        }else{
            a[0] = '<a href="javascript:;" class="step" data-page="'+(current-1)+'">上一页</a><a href="javascript:;" class="step" data-page="1">1</a>';
        }
        
        if (total <= (navnum+1)) {
            // 直接显示完全
            for (i = 2; i < total; i++) {
                setPageList(i);
            }
        }else {
            if (current < navnum) {
                // 当前页在前面
                for (i = 2; i <= navnum; i++) {
                    setPageList(i);
                }
                a.push('<span class="step">..</span>');
            } else if (current > (total-navnum)) {
                // 当前页在后面
                a.push('<span class="step">..</span>');
                i = total - navnum + 1;
                for (; i < total; i++) {
                    setPageList(i);
                }
            } else { 
                //当前页在中间部分
                a.push('<span class="step">..</span>');
                t = Math.floor(navnum/2);
                i = current - t;
                for (; i < current+(navnum-t); i++) {
                    setPageList(i);
                }
                a.push('<span class="step">..</span>');
            }
        }
        a.push('<a href="javascript:;" class="step" data-page="'+total+'">'+total+'</a>');

        if(current != total){
            a.push('<a href="javascript:;" class="step" data-page="'+(current+1)+'">下一页</a>');
        }

        function setPageList(p) {
            if(current == p){
                a.push('<span class="currentStep">'+p+'</span>');
            }else{
                a.push('<a href="javascript:;" class="step" data-page="'+p+'">'+p+'</a>');
            }
        }

        _html = '<div class="pagenav">'+a.join('')+'</div>';
        return _html;
    };

    return pagenav;
});
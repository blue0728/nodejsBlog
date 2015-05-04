/*
** timedown
** 倒计时 模块
*/ 

define(function(){
    function timedown(myoptions){
        var defaults = {
                elem: null,
                //结束时间，毫秒或者以下格式：
                endTime: 60000,
                // endTime: '2014-12-08 00:00:00',
                onlySec: false,
                endFunc: function(){}
            };
        var options = $.extend(defaults, myoptions);

        var $timer = options.elem;

        var _remain = 0, setTime = null, gotime = null;

        var dateReg = /^(\d{4})-(\d{1,2})(\d{1,2})$/;

        if($timer === null || $timer.length == 0){
            throw new Error('倒计时绑定的元素获取不到');
            return;
        }  

        _remain = options.endTime;

        if(dateReg.test(_remain)){
            _remain = (new Date(_remain)).getTime() - (new Date().getTime());
        }

        _remain = parseInt(_remain/1000);

        setTime = function(){
            var TIME;
            if(_remain < 0){
                clearInterval(gotime);
                options.endFunc();
            }else{
                TIME = timeJson(_remain);

                if(options.onlySec){
                    $timer.html('<i class="iconfont">&#x3a;</i><span class="s">剩余时间：</span><em>'+TIME.secs+'</em><span>秒</span>');
                }else{
                    $timer.html('<i class="iconfont">&#x3a;</i><span class="s">剩余时间：</span><em>'+TIME.days+'</em><span>天</span><em>'+TIME.hours+'</em><span>时</span><em>'+TIME.mins+'</em><span>分</span><em>'+TIME.secs+'</em><span>秒</span>');
                }

                _remain --;
            };
        };
        gotime = setInterval(setTime, 1000);
        setTime();
        return gotime;
    }

    function timeJson(times) {
        var oTime = {};
        oTime.secs = Math.floor(times % 60);
        oTime.mins = Math.floor(times / 60 % 60);
        oTime.hours = Math.floor(times / 60 / 60);
        oTime.days = 0;

        if(oTime.hours > 23){
            oTime.days = Math.floor(oTime.hours/24);
            oTime.hours = oTime.hours - oTime.days*24;
        }
        if(oTime.secs<10){
            oTime.secs = '0' + oTime.secs;
        }
        if(oTime.mins<10){
            oTime.mins = '0' + oTime.mins;
        }
        if(oTime.hours<10){
            oTime.hours = '0' + oTime.hours;
        }
        if(oTime.days<10){
            oTime.days = '0' + oTime.days;
        }
        return oTime;
    }

    return timedown;
});
    
/**
 * 省市区联动触发事件
 * @modifier: shaop@lizi.com
 * @update: 2015-01-06 16:00
*/
define(function(){

    var switchAreaInit = function ($elem, idAry) {
        var $province = $elem.find('select[name=province]');
        var $city = $elem.find('select[name=city]');
        var $area = $elem.find('select[name=area]');

        // 初始化地址
        var idAry = idAry || ['0','0','0'];

        $province.val(idAry[0]);
        switchArea($province, $city, idAry[1], function(){
            switchArea($city, $area, idAry[2]);
        });

        $province.change(function(){
            switchArea($province, $city, '0', function(){
                switchArea($city, $area, '0');
            });
        });

        $city.change(function(){
            switchArea($city, $area, '0');
        });
    }

    // 省市区联动事件
    function switchArea($parent, $child, child_id, fn){
        var pid = $parent.val();
        if(pid == 0){
            $child.empty().append('<option value="0">--请选择--</option>');
            fn && fn();
            return;
        }
        $.ajax({
            url:"/address/findAddress",
            // url:"cityjson.html",
            type:'post',
            data: {id : pid},
            dataType: 'json',
            success:function(data){
                var options = '<option value="0">--请选择--</option>';
                if(data.status == 'SUCCESS'){
                    var areaObj = data.data;
                    $.each(areaObj,function(i){
                        var _this = areaObj[i];
                        if(_this.id == child_id){
                            options += '<option value="'+_this.id+'" selected="selected">'+_this.name+'</option>';  
                        }else{
                            options += '<option value="'+_this.id+'" >'+_this.name+'</option>'; 
                        }
                    });
                    $child.empty().append(options);
                    fn && fn();
                }
            }
        });
    }

    return switchAreaInit;

});
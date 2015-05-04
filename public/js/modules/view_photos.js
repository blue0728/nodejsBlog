/*
** 点击小图，查看大图
*/
define(['imagesloaded'], function(imagesloaded){

    function viewPhotos($elem){
        $elem.on('click','li',function(){
            var _this = $(this),
                _src = _this.data('src'),
                $view = _this.parent('ul').next('.viewer');

            if(_src == undefined){
                return false;
            }

            if(_this.hasClass('current')){
                _this.removeClass('current');
                $view.hide().off();
            }else{
                _this.addClass('current').siblings('li').removeClass('current');
                $view.off().on('click', function(){
                    _this.trigger('click');
                });

                var Img = new Image();
                Img.src = _src;

                imagesloaded($(Img), function(){
                    if($view.find('img').length>0){
                        $view.show().find('img').css({width:Img.width,height:Img.height}).attr('src',_src);
                    }else{
                        $view.show().html('<img src="'+_src+'" style="width:'+Img.width+'px; height:'+Img.height+'px;" />');
                    }
                });
            }
        }); 
    }

    return viewPhotos;
    
});
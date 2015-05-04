/*
** 图片完成加载，然后回调
** 比如：异步插入一张图片，JS获取图片的宽高等信息
*/
define(function(){

    function imagesLoaded($images, callback) {
        var len = $images.length,
            blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        function imgLoaded(event) {
            if (--len <= 0 && event.target.src !== blank) {
                setTimeout(function(){
                    callback && callback();
                },0);
                $images.off('load error', imgLoaded);
            }
        }
        if (!len) {
            callback && callback();
        }
        $images.on('load error', imgLoaded).each(function() {
            if (this.complete || this.complete === undefined) {
                var src = this.src;
                this.src = blank;
                this.src = src;
            }
        });
        
    }

    return imagesLoaded;
});
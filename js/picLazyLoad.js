/**
 * Zepto picLazyLoad Plugin
 * 西门 http://ons.me/484.html
 * 20140517 v1.0
 */
;(function($){
    $.fn.picLazyLoad = function(settings){
        var $this = $(this),
            _winScrollTop = 0,
            _winHeight = $(window).height();

        settings = $.extend({
            threshold: 0, // 提前高度加载
            placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',
            attr : 'data-original'
        }, settings||{});

        // 执行懒加载图片
        lazyLoadPic();

        // 滚动触发换图
        $(window).on('scroll',function(){
            _winScrollTop = $(window).scrollTop();
            lazyLoadPic();
        });

        // 懒加载图片
        function lazyLoadPic(){
            $this.each(function(){
                var $self = $(this);
                // 如果是img
                if($self.is('img')){
                    if($self.attr(settings.attr)){
                        var _offsetTop = $self.offset().top;
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            $self.attr('src',$self.attr(settings.attr));
                            $self.removeAttr(settings.attr);
                        }
                    }
                // 如果是背景图
                }else{
                    if($self.attr(settings.attr)){
                        // 默认占位图片
                        if($self.css('background-image') == 'none'){
                            $self.css('background-image','url('+settings.placeholder+')');
                        }
                        var _offsetTop = $self.offset().top;
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            $self.css('background-image','url('+$self.attr(settings.attr)+')');
                            $self.removeAttr(settings.attr);
                        }
                    }
                }
            });
        }
    }
})(Zepto);
// 执行
$(function(){
    $("img[data-src]").picLazyLoad({
        attr : 'data-src',
        threshold : 465,
        placeholder : 'images/blank.png'
    });
});
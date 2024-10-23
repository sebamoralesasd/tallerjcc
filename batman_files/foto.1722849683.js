function createShareUrl(platform, text, url, hashtags, via) {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const encodedHashtags = encodeURIComponent(hashtags);
    const encodedVia = encodeURIComponent(via);

    let shareUrl = "";

    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}&via=${encodedVia}`;
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    } else {
        throw new Error("Platform not allowed. Use 'twitter' o 'facebook'.");
    }

    return shareUrl;
}



$(document).ready(function(){
    var movieId = $('.rate-movie-box').data('movie-id'),
    tcCommon = TranslateContext.getInstance(commonTextsJs),
    actual = 0,
    next = 0,
    prev = 0;

    if(typeof movieId == 'undefined' || movieId == null)
        movieId = $('.moviecard-section-container').data('movie-id');

    $(document).on( "keyup", function( event ) {
        event.preventDefault();
        if( event.which == 39 ){
            $("#cboxNext2").trigger('click');
        }

        if( event.which == 37){
            $("#cboxPrevious2").trigger('click');
        }
    })

    $('.see-trailer').on('click', function(e){
        e.preventDefault();

        if( $('.no-video').length == 0)
        {
            let clientWidth = $(window).width() * 0.90;

            var myindex = 1;
            $.post( pageUrl('movies.ajax.php'), ({action: 'getFirstVideo', movieId: movieId, maxWidth: clientWidth}), function(data){
                if( data.result == 0 )
                {
                    /*
                    dailymotion
                    .createPlayer("dailymotionwrapper", {
                        video: "x84sh87",
                    })
                    .then((player) => console.log(player))
                    .catch((e) => console.error(e));
                    */

                    //var iframeTemplate = $('#dailymotionwrapper')[0].outerHTML;
                    //$('#dailymotionwrapper').remove();

                    var windowWidth = parseInt($(window).width()) - 200;
                    var windowHeight = parseInt($(window).height()) - 200;

                    if(data.width > 0)
                        windowWidth = data.width;

                    if(data.height > 0)
                        windowHeight = data.height;               

                    $.colorbox({ 
                        html: data.video,
                        open: true,
                        transition:"elastic",
                        previous: '',
                        next: '',
                        fastIframe: false,
                        scalePhotos: true,
                        maxWidth: '95%',
                        maxHeight: '95%',
                        width: windowWidth,
                        height: '100%',
                        title: data.moreVideosUrl,
                        onComplete: function(){
                            $(".cboxPhoto").click(function(){
                                $.colorbox.close();
                            });

                            $('#cboxOverlay').bind('click', function(e){
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            });

                            $('#cboxLoadedContent').css('overflow', 'unset')

                        },
                        onClosed: function(){
                            //$.colorbox.remove();
                        }
                    });

                    myindex = 0;

                }
            })
        }
    })

    $('#cboxTitle').on('click', '.see-trailer-pop', function(e){
        $('.see-trailer').trigger('click');
    })

    $('#movie-main-image-container .lightbox, .moviecard-section-container .float-left').on('click', function(e){

        if( !$(e.target).is('.fas') ){

        if( $('.lightbox').length == 1 && $('#movie-main-image-container').data('length') != 1)
        {
            e.preventDefault();

            $.post(pageUrl('movies.ajax.php'), ({action: 'getImagesUrl', movieId: movieId}), function(data){

                actual = 0;
                prev = data.urls.length - 1; //los arrays en js empiezan en cero
                next = next + 1;

                //fix if only one image
                if( data.urls.length == 1 )
                    $('#movie-main-image-container').attr('data-length', 1);

                for( i = 1; i < data.urls.length; i++ ) {
                    var desc = '';

                    if( data.urls[i].desc != null && data.urls[i].desc != '')
                        desc = '<div><strong>' + tcCommon.t('desc') + ':</strong> ' + data.urls[i].desc + '</div>';

                    var img = $('<img />',
                                 { class: 'mygallery',
                                   src: '/images/empty.gif',
                                   width: 300,
                                   title: '<div><strong>' +  tcCommon.t('type') +  ':</strong> '
                                            + data.urls[i].typeDesc + '</div>'
                                            + '<div><strong>' + tcCommon.t('country') + ':</strong> '
                                            + data.urls[i].country + '</div>' + desc
                                 }).appendTo('#movie-main-image-container').wrap('<a href="/images/empty.gif" class="lightbox hidden"></a>');
                }

                $('.lightbox').colorbox({
                    open: true,
                    rel: '.lightbox',
                    transition:"elastic",
                    previous: '',
                    next: '',
                    fastIframe: false,
                    scalePhotos: true,
                    maxWidth: '95%',
                    maxHeight: '95%',
                    arrowKey: false,
                    onComplete: function(){
                        $(".cboxPhoto").click(function(){
                            $.colorbox.close();
                        });

                        $('#cboxOverlay').bind('click', function(e){
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            e.stopPropagation();
                          return false;
                        });

                        if( $(this).find('img').prop('title').length > 0 )
                            $("#cboxTitle").css('background-color', '#FFF').html( $(this).find('img').prop('title') );
                        else if( $(this).find('.see-trailer').length > 0  )
                            $("#cboxTitle").css('background-color', '#FFF').html( '<span><a class="see-trailer-pop" href="#">'+ tcCommon.t('See trailer') +'</a></span>' );

                        var src = $('.cboxPhoto').attr('src');

                        $('#cboxContent').find('#cboxCurrent').html('<a href="' + createShareUrl('facebook', 'share', src)  + '" target="_BLANK" rel="noopener noreferrer"><i style="font-size: 20px;" class="fa-brands fa-facebook"></i></a>&nbsp;<a href="' + createShareUrl('twitter', 'share', src, 'Filmaffinity', 'Filmaffinity')  +'" title="Comp&aacute;rtelo en Twitter" target="_BLANK" rel="noopener noreferrer"><i style="font-size: 20px;" class="fa-brands fa-x-twitter"></i></a>');
                        $('#cboxContent').find('#cboxCurrent').css('display', 'block');

                        if( data.urls.length > 1 ){
                            $('#cboxContent').find('.cboxPhoto').before('<a id="cboxPrevious2" href="#"><img src="/images/imghovnav_prev.png"></a>');
                            $('#cboxContent').find('.cboxPhoto').before('<a id="cboxNext2" href="#"><img src="/images/imghovnav_next.png"></a>');
                        }

                        $("#cboxNext2").click(function(event){
                            event.preventDefault();
                            actual = actual + 1;

                            if(prev + 1 >= data.urls.length)
                                prev = 0;
                            else
                                prev = prev + 1;

                            next = next + 1;

                            if( $.colorbox.element().is(':last-child') ){
                                $ele = $('.cboxElement').eq(0);
                                actual = 0;
                            } else {
                                $ele = $.colorbox.element().next();
                            }

                            $ele.attr('href', data.urls[actual].url);

                            $.colorbox.next();
                        });

                        $("#cboxPrevious2").click(function(event){
                            event.preventDefault();
                            actual = actual - 1;
                            if(actual <  0)
                                actual = data.urls.length - 1;

                            if(next <  0)
                                next = data.urls.length - 1;

                            next = next - 1;
                            prev = prev - 1;

                            if( $.colorbox.element().is(':first-child') ){
                                $ele = $('.cboxElement').eq(actual);
                            } else {
                                $ele = $.colorbox.element().prev();
                            }

                            $ele.attr('href', data.urls[actual].url);

                            $.colorbox.prev();
                        });

                        var height = $('.cboxPhoto').height();
                        var windowHeight = $(window).height();

                        var windowWidth = $(window).width();
                        var photoWidth = $('.cboxPhoto').width();

                        if(photoWidth > windowWidth)
                        {
                            $("#cboxNext2").css('position', 'fixed');
                            $("#cboxNext2").css('right', '20px');

                            $("#cboxPrevious2").css('position', 'fixed');
                            $("#cboxPrevious2").css('left', '20px');
                        }

                        if(height > windowHeight)
                        {
                            $("#cboxPrevious2").css('padding-top', (windowHeight / 2) - 213);
                            $("#cboxNext2").css('padding-top', (windowHeight / 2) - 213);
                        }
                        else
                        {
                            $("#cboxPrevious2").css('padding-top', (height / 2) - 213);
                            $("#cboxNext2").css('padding-top', (height / 2) - 213);
                        }
                    },
                    onOpen: function(){
                            var title = $('.lightbox').data('t');
                            var dat_t = $('.lightbox').attr('title');

                            $('.lightbox').attr('title', title);
                            $('.lightbox').data('t', dat_t);

                            $('object').css({'visibility':'hidden'});
                    },
                    onClosed: function(){
                            var title = $('.lightbox').data('t');
                            var dat_t = $('.lightbox').attr('title');

                            actual = 0;
                            prev = data.urls.length - 1; //los arrays en js empiezan en cero
                            next = 1;

                            $('.lightbox').attr('title', title);
                            $('.lightbox').data('t', dat_t);

                            $('object').css({'visibility':'inherit'});
                        }
                    });
                })
            }
        } //if
    })
});

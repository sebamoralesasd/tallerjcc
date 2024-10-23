$(function(){

    if( $('#show-msg').length == 0)
        $('#user-nick').css({marginRight : '5px'});

    $(window).scroll(function(){
        var window_offset = $('#header-bottom').offset().top - $(window).scrollTop() - 15;

        if( window_offset <= 0 )
        {
            $('.top-wrapper').css( {paddingTop: '6px', height: '40px'} );
            $('#header-top .top-wrapper #logo-container img').css({'transition': 'transform 0.3s ease-out', 'transform': 'scale(.7, .7)', 'transform-origin': 'left top'})
            $('#logo-container .logo-siteloc').css({'transition': 'transform 0.3s ease-out', 'transform': 'translateY(-14px) translateX(-46px)', 'font-size': '10px'});
            $('#topsearch .advsearch').hide();
            if( $('#topsearch-ac').length > 0)
                $('#topsearch-ac').find('.advsearch').hide();
            $('#header-top .top-wrapper .fa-menu').css({'transition': 'transform 0.3s ease-out', 'margin-top': '7px'});
        }
        else
        {
            $('.top-wrapper').css( {paddingTop: '10px', height: '56px'} );
            $('#header-top .top-wrapper #logo-container img').css({'transition': 'transform 0.3s ease-out', 'transform': 'scale(1, 1)', 'transform-origin': 'left top'})
            $('#logo-container .logo-siteloc').css({'transition': 'transform 0.3s ease-out', 'transform': 'translateY(0px) translateX(0px)', 'font-size': '13px'});
            $('#header-top .top-wrapper .fa-menu').css({'transition': 'transform 0.3s ease-out', 'margin-top': '10px'});
            $('#header-top').css( {height: '56px'} );
            $('#topsearch .advsearch').show();
            if( $('#topsearch-ac').length > 0)
                $('#topsearch-ac').find('.advsearch').show();
        }

        if( $('#top-search-input').length > 0 )
            $('.t-s').css({left : $('#top-search-input').offset().left });

        if( window_offset <= -100 )
        {
           $('#header-top').css({ height: '46px'} );
        }
    });

    $('#user-nick').on('click', function(e){
        e.preventDefault();

        $('.adv-no-styles').css({'position': 'relative', 'z-index' : '99'})

        if( $('.user-menu-wr').hasClass('moving') )
        {
            return false;
        }
        else
        {
            $('.user-menu-wr').addClass('moving');

            if( $(this).hasClass('clicked')  )
            {
                $('.user-menu-wr').toggle(0, function(){
                    $('#user-nick').removeClass('clicked');
                    $('#show-msg').css('visibility', 'inherit');
                    $('.user-menu-wr').removeClass('moving');
                });

                $('.adv-no-styles').css({'position': 'inherit', 'z-index' : '0'})
            }
            else
            {
                $('#show-msg').css('visibility', 'hidden');
                $('#user-nick').addClass('clicked');
                $('.user-menu-wr').toggle(0, function(){
                    $('.user-menu-wr').removeClass('moving');
                });
            }
        }
    })

    $('.moving').on('click', function(e){
        return false;
    })


    $(document).click(function(event) {
        if(!$(event.target).closest('#user-nick').length) {
            if( $('.user-menu-wr').is(":visible") ) {
                $('.user-menu-wr').hide();
                $('#user-nick').removeClass('clicked');
                $('#show-msg').css('visibility', 'inherit');
                $('.adv-no-styles').css({'position': 'inherit', 'z-index' : '0'})
            }
        }
    })
})

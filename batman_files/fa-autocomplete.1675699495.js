$(function(){

    const minCharsSearch = 2;
    var tcTexts = TranslateContext.getInstance(commonTextsJs);

    function renderAutocomplete(item){

        if( $('#top-search-input-2').val().length >= minCharsSearch ){

            var li = '<li>' + item.label + '</li>';

            if( $(item.label).hasClass('movie-card-acf') ){
                $('.main-search-template .top-search-wrapper .title-ac-wrapper').append( $(li).hide().show() );
                $('.main-search-template .top-search-wrapper .sep-title').show();
                $('.main-search-template .top-search-wrapper .see-all.see-title').show();
            } else if( $(item.label).hasClass('name-ac') ){
                $('.main-search-template .top-search-wrapper .name-ac-wrapper').append( $(li).hide().show()  );
                $('.main-search-template .top-search-wrapper .sep-name').show();
                $('.main-search-template .top-search-wrapper .see-all.see-name').show();
            } else if( $(item.label).hasClass('theater-ac') ){
                $('.main-search-template .top-search-wrapper .theaters-ac-wrapper').append( $(li).hide().show()  );
                $('.main-search-template .top-search-wrapper .sep-theaters').show();
                $('.main-search-template .top-search-wrapper .see-all.see-theaters').show();
            }

            if( $('.title-ac-wrapper li').length == 0 ){
                $('.main-search-template .top-search-wrapper .sep-title').hide();
                $('.main-search-template .top-search-wrapper .see-all.see-title').hide();
            }

            if( $('.name-ac-wrapper li').length == 0 ){
                $('.main-search-template .top-search-wrapper .sep-name').hide();
                $('.main-search-template .top-search-wrapper .see-all.see-name').hide();
            }

            if( $('.theaters-ac-wrapper li').length == 0 ){
                $('.main-search-template .top-search-wrapper .sep-theaters').hide();
                $('.main-search-template .top-search-wrapper .see-all.see-theaters').hide();
            }

            //$('.main-search-template .search-input').focus();
            //$('.main-search-template').fadeIn();
            showAutocomplete();
        }
    }

    function showAutocomplete(){
        $('.main-search-template').fadeIn();
        $('body').addClass('sm-open');
        $('.main-search-template .o-container').removeClass('animate__fadeOutUpBig').addClass('animate__fadeInDownBig');
    }

    function hideAutocomplete(){
        $('.main-search-template .o-container').removeClass('animate__fadeInDownBig').addClass('animate__fadeOutUpBig');
        $('.clear-search').hide();
        $('.main-search-template').hide();
        $('body').removeClass('sm-open');
    }

    var optionsAutocomplete2 = {

        url: function(term) {
            $('.top-search-wrapper .st-wrapper').show();
            $('#topsearch-ac .s-load').css('visibility', 'unset');
            return pageUrl("search-ac2.ajax.php?action=searchTerm")
        },

        adjustWidth: false,

        getValue: "value",

        ajaxSettings: {
            dataType: "json",
            method: "POST",
            data: {
                dataType: "json"
            },
            beforeSend: function(){
                console.log( $('#top-search-input-2').val() );
                if( $('#top-search-input-2').val().length >= minCharsSearch && $('.main-search-template .top-search-wrapper li').length == 0){
                    $('.top-search-wrapper .st-wrapper').show();
                    $('#topsearch-ac .s-load').css('visibility', 'unset');
                    showAutocomplete();
                }
            },
            complete: function( result ){

                $('.main-search-template .top-search-wrapper .sep-title b').text('');
                $('.main-search-template .top-search-wrapper .sep-name b').text('');
                $('.main-search-template .top-search-wrapper .sep-theaters b').text('');
                $('.top-search-wrapper .no-results').remove();
                $('.sticky-search-wrapper').show();

                    $('.top-search-wrapper .st-wrapper').hide();
                    $('#topsearch-ac .s-load').css('visibility', 'hidden');

                    if( result.responseJSON.totalMovies == 0){
                        $('.see-title').hide();
                        $('.sticky-search-wrapper').find('.pills-movies span').text('0');
                    } else if(result.responseJSON.totalMovies <= 999){
                        $('.sep-title b').append('<small>ver ' + result.responseJSON.totalMovies + ' más</small>');
                        $('.sticky-search-wrapper').find('.pills-movies span').text('[ ' + result.responseJSON.totalMovies + ' ]');
                    } else {
                        $('.sep-title b').append('<small>ver todo</small>');
                        $('.sticky-search-wrapper').find('.pills-movies span').text('+ 999');
                    }
                        //$('.sep-title b').append('+ 999');

                    if( result.responseJSON.totalNames == 0){
                        $('.sep-name').hide();
                        $('.see-name').hide();
                        $('.sticky-search-wrapper').find('.pills-names span').text('0');
                    } else if( result.responseJSON.totalNames <= 999) {
                        $('.sep-name b').append(result.responseJSON.totalNames);
                        $('.sticky-search-wrapper').find('.pills-names span').text('[ ' + result.responseJSON.totalNames + ' ]');
                    } else {
                        $('.sticky-search-wrapper').find('.pills-names span').text('+ 999');
                        $('.sep-name b').append('+ 999');
                    }

                    if( result.responseJSON.totalTheaters == 0 ) {
                        $('.sep-theaters').hide();
                        $('.see-theaters').hide();
                        $('.sticky-search-wrapper').find('.pills-theaters span').text('0');
                    } else if( result.responseJSON.totalTheaters <= 999 ) {
                        $('.sep-theaters b').append(result.responseJSON.totalTheaters);
                        $('.sticky-search-wrapper').find('.pills-theaters span').text('[ ' + result.responseJSON.totalTheaters + ' ]');
                    } else {
                        $('.sep-theaters b').append('+ 999');
                        $('.sticky-search-wrapper').find('.pills-theates span').text('+999');
                    }

                    if( result.responseJSON.totalMovies == 0 && result.responseJSON.totalNames == 0 && result.responseJSON.totalTheaters == 0){
                        if( $('.top-search-wrapper .no-results').length <= 0){
                            $('.top-search-wrapper').append('<div class="no-results">' + tcTexts.t('No results found for the entered term')  + '<div class="adv-search-nr"></div></div>');
                            $('.sticky-search-wrapper').hide();
                        }
                    } else {
                        $('.top-search-wrapper .no-results').remove();
                        $('.sticky-search-wrapper').show();
                    }

                    $('.main-search-template .top-search-wrapper li').remove();

                    //result.responseJSON
                    $.each(result.responseJSON, function(type, value){
                        switch( type ){
                            case 'movies':
                                $.each(value, function(val, val_info){
                                    renderAutocomplete(val_info);
                                })
                                $('.separator.sep-title a').attr('href', pageUrl('search.php?stype=title&stext=' + $("#top-search-input-2").val() ) );
                                $('.sticky-search-wrapper').find('.pills-movies').attr('href', pageUrl('search.php?stype=title&stext=' + $("#top-search-input-2").val() ) );
                                $('.see-all.see-title a').attr('href', pageUrl('search.php?stype=title&stext=' + $("#top-search-input-2").val() ) );
                            break;
                            case 'names':
                                $.each(value, function(val, val_info){
                                    renderAutocomplete(val_info);
                                })
                                $('.separator.sep-name a').attr('href', pageUrl('search.php?stype=name&stext=' + $("#top-search-input-2").val() ) );
                                $('.sticky-search-wrapper').find('.pills-names').attr('href', pageUrl('search.php?stype=name&stext=' + $("#top-search-input-2").val() ) );
                                $('.see-all.see-name a').attr('href', pageUrl('search.php?stype=name&stext=' + $("#top-search-input-2").val() ) );
                            break;

                            case 'theaters':
                                $.each(value, function(val, val_info){
                                    renderAutocomplete(val_info);
                                })
                                $('.separator.sep-theater a').attr('href', pageUrl('search.php?stype=theater&stext=' + $("#top-search-input-2").val() ) );
                                $('.sticky-search-wrapper').find('.pills-theaters').attr('href', pageUrl('search.php?stype=theater&stext=' + $("#top-search-input-2").val() ) );
                                $('.see-all.see-theater a').attr('href', pageUrl('search.php?stype=theater&stext=' + $("#top-search-input-2").val() ) );
                            break;
                            default:

                            break;
                        }
                    })
            }
        },

        listLocation: "results",

        categories: [
            {
                listLocation: "movies",
                header: "-- Movies --",
                maxNumberOfElements: 9,
            },
            {
                listLocation: "names",
                header: "-- Names --",
                maxNumberOfElements: 6,
            },
            {
                listLocation: "theaters",
                header: "-- Theaters --",
                maxNumberOfElements: 4,
            },
        ],

        preparePostData: function(data) {
            data.term = $("#top-search-input-2").val();
            return data;
        },

        minCharNumber: 2,

        template: {
            type: "custom",
            method: function(value, item){
                if( $('#top-search-input-2').val().length >= minCharsSearch ){
                    showAutocomplete();
                }
//              renderAutocomplete(value, item);
            },
        },

        requestDelay: 500,

        list: {
            maxNumberOfElements: 16,
            onChooseEvent : function() {
                var itemSelected = $("#top-search-input-2").getSelectedItemData(),
                    url = '';

                if(typeof $(itemSelected.label).attr('data-movie-id') !== 'undefined'){
                    url = pageUrl("film" + parseInt($(itemSelected.label).attr('data-movie-id')) + ".html");
                }else if( typeof $(itemSelected.label).attr('data-name-id')  !== 'undefined'){
                    url = pageUrl("name.php?name-id=" + parseInt($(itemSelected.label).attr('data-name-id')));
                } else if( typeof $(itemSelected.label).attr('data-theater-id')  !== 'undefined'){
                    url = pageUrl("theater-showtimes.php?id=" + parseInt($(itemSelected.label).attr('data-theater-id')));
                } else {
                    url = pageUrl("search.php?stext=" + $('.search-input').val() + "&stype=all" );
                }

                window.location.href = url;

                //$(".search-input").val(itemSelected.value);
            },

            onSelectItemEvent: function(){
                var itemSelected = $("#top-search-input-2").getSelectedItemData();
                //$("#top-search-input-2").val(itemSelected.value);


                if( $(itemSelected.label).hasClass('movie-card-acf') ){
                    $('.top-search-wrapper ul li div').removeClass('select hover');
                    $('.movie-card-acf[data-movie-id="' + itemSelected.id + '"]').addClass("select hover");
                } else if( $(itemSelected.label).hasClass('name-ac') ) {
                    $('.top-search-wrapper ul li div').removeClass('select hover');
                    $('.name-ac[data-name-id="' + itemSelected.id + '"]').addClass("select hover");
                 } else if( $(itemSelected.label).hasClass('theater-ac') ) {
                     $('.top-search-wrapper ul li div').removeClass('select hover');
                    $('.theater-ac[data-theater-id="' + itemSelected.id + '"]').addClass('select hover');
                }

            },

            onLoadEvent: function(){
                if( $('#top-search-input-2').val().length < minCharsSearch ){
                    hideAutocomplete();
                    //$('.main-search-template').hide();
                }
            },
        }
    };

    //$('#top-search-input-2').easyAutocomplete( optionsAutocomplete );

    /*
    $('#top-search-input-2').keyup(function(){
        if( $('#top-search-input-2').val().length >= 2  ){
            console.log('clkick');
            $('.main-search-template').fadeIn();
            $('.main-search-template .search-input').val( $('#top-search-input-2').val() );
            $('.main-search-template .search-input').focus();
            var e = jQuery.Event("keydown");
            e.which = 50;
            $('.main-search-template .search-input').trigger(e);
            $('.easy-autocomplete-container').hide();
        }
    })
    */

    $('#top-search-input-2').easyAutocomplete( optionsAutocomplete2 );

    $('#top-search-input-2').keyup(function(e){
        $('.easy-autocomplete-container').hide();

        if( $('#top-search-input-2').val().length >= minCharsSearch )
            $('.clear-search').show();
        else{
            hideAutocomplete();
        }

        switch(event.keyCode) {
            case 37:
            break;
            case 38:
            break;
            case 39:
            break;
            case 40:
            break;
            case 13:
                //window.location.href = pageUrl( "search.php?stext=" + $('.search-input').val() + "&stype=all" );
            break;
/* barra espaciadora key 32 */

            case 32:
                $('#top-search-input-2').trigger('click');
            break;

            default:

            break;

        }
    })

    $('.main-search-template').on('click', '.close-modal', function(){
        $('.main-search-template .o-container').removeClass('animate__fadeInDownBig').addClass('animate__fadeOut');
        $('.main-search-template').fadeOut();
        $('body').removeClass('sm-open');
    })

    $(document).keyup(function(e){
        if(  e.keyCode === 27 ){
            hideAutocomplete();
            /*
            $('.main-search-template .o-container').removeClass('animate__fadeInDownBig').addClass('animate__fadeOutUpBig');
            $('.main-search-template').fadeOut();
            $('body').removeClass('sm-open');
            $('.clear-search').hide();
            */
        }
    })

    $('.title-ac-wrapper').on('click', '.movie-card-acf', function(){
        window.location.href = pageUrl("film" + $(this).attr('data-movie-id') + ".html");
    })

    $('.name-ac-wrapper').on('click', '.name-ac', function(){
        window.location.href = pageUrl("name.php?name-id=" + $(this).attr('data-name-id'));
    })

    $('.theaters-ac-wrapper').on('click', '.theater-ac', function(){
        window.location.href = pageUrl("theater-showtimes.php?id=" + $(this).attr('data-theater-id'));
    })

    $('#top-search-input-2').focus(function(event){

        //$(this).addClass('s-large');
        //$(this).closest('#topsearch-ac').addClass('s-large');

        $('.main-search-template .o-container').removeClass('animate__fadeOut').addClass('animate__fadeInDownBig');

        if( $('#top-search-input-2').val().length >= minCharsSearch ){
            $('.clear-search').show();

            if( $('.title-ac-wrapper li').length == 0 && $('.name-ac-wrapper li').length == 0 && $('.theaters-ac-wrapper li').length == 0 ){
                var evt = jQuery.Event("keyup");
                evt.which = 41;
                evt.keyCode = 41;

                $('#top-search-input-2').trigger(evt);
            }else{
                showAutocomplete();
            }

        } else{
            hideAutocomplete();
        }

        //$('.advsearch').hide();
    })

    /*
    $('#top-search-input-2').blur(function(e){
        console.log(e.target);
        $(this).removeClass('s-large');
        $(this).closest('#topsearch-ac').removeClass('s-large');
        $('.clear-search').hide();
        $('.advsearch').show();
    });
    */

    $(window).click(function(e) {
        const $target = $(e.target);

        if (!$target.closest('#top-search-input-2').length && !$target.closest('.clear-search').length ) {
            //$('#top-search-input-2').removeClass('s-large');
            //$('#topsearch-ac').removeClass('s-large');
            $('.clear-search').hide();
            $('.advsearch').show();
        }

        if (!$target.closest('.o-container').length && !$target.closest('#top-search-input-2').length) {
            hideAutocomplete();
            /*
            $('.main-search-template .o-container').removeClass('animate__fadeInDownBig').addClass('animate__fadeOutUpBig');
            $('.main-search-template').fadeOut();
            $('body').removeClass('sm-open');
            */
        }

        if( $target.hasClass('overflow-wrapper') )
            hideAutocomplete();

        if( $target.hasClass('top-search-wrapper') )
            hideAutocomplete();

        if( $target.hasClass('o-container') )
            hideAutocomplete();

        if( $target.hasClass('separator') )
            hideAutocomplete();
    });

    //on click cross search, clean content input
    $('.clear-search').on('click', function(){
        $('#top-search-input-2').val('');
        $('#top-search-input-2').focus();
        //$('.clear-search').hide();
        //$('.main-search-template .o-container').removeClass('animate__fadeInDownBig').addClass('animate__fadeOutUpBig');
        //$('.main-search-template').fadeOut();
        //$('body').removeClass('sm-open');
        hideAutocomplete();
    })
/*
    $('.top-search-wrapper').on('mouseenter', '.movie-card-acf, .name-ac, .theater-ac', function(){
        $(this).find('.title.fromLeft::after').css('width', '100%');
    }).on('mouseleave', '.movie-card-acf, .name-ac, .theater-ac', function(){
        $(this).css('box-shadow', 'unset');
    })
*/
})

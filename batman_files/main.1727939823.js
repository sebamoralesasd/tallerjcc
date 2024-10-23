var ff = 0;
var adp = 1;

var swUserPrefs = true;

function ol()
{
    if(ff != 0)
        ff.focus();
}


function pDateTime(value)
{
    if(value == undefined)
        return;

    var d = new Date(value * 1000);
    document.write(d.toLocaleString());
}

function pDate(value)
{
    if(value == undefined)
        return;

    var d = new Date(value * 1000);

    document.write( d.toLocaleDateString() );
}

function pTime(value)
{
    if(value == undefined)
        return;

    var d = new Date(value * 1000);

    document.write( d.toLocaleTimeString() );
}

function togglerw(id)
{
    rtext = document.getElementById('text' + id);
    rlink = document.getElementById('link' + id);

    if(rtext.style.display == 'none')
    {
        rtext.style.display = '';
        rlink.style.display = 'none';
    }
    else
    {
        rtext.style.display = 'none';
        rlink.style.display = '';
    }
}

function openShop(name, link)
{
    w = window.open(link, name, '');
    w.focus();
}


function clickAd(url)
{
    window.open(url);
}

function pageUrl($page)
{
    var $page = '/' + site_loc + '/' + $page
/*
    if( $page.match(/login.php|register.php|updmydata.php/) )
    {
        $page = 'https://' + baseDomain() + $page;
    }
*/
    return $page;
}


function securePageUrl($page)
{
    var domain = baseDomain();

    var protocol = 'https://';
    if(domain.match(/filmaffinity.com$/) == null)
        protocol = 'http://';

    return  protocol + domain + pageUrl($page);
}


function baseDomain()
{
    return location.host.replace('www.', '');
}


function corsAjax(url, params, callback)
{
    $.ajax({
        type: "POST",
        url: url,

        xhrFields: {
            withCredentials: true
        },

        data: params,

        dataType: supportDataType()
    })
    .done(function(data)
    {
        callback(data);
    });
}


function supportDataType()
{
    var supportDataType = 'jsonp';
    if(supportCORS())
    {
        supportDataType = 'json';
    }

    return supportDataType;
}



function supportCORS()
{
    var cors = ('withCredentials' in new XMLHttpRequest());

    return cors;
}


function hideUserMenu()
{
    $('.user-card-profile .pop-menu .menu, .user-card-profile-res .pop-menu .menu').hide();
    $('.user-card-profile .pop-menu .switch-menu, .user-card-profile-res .pop-menu .switch-menu').removeClass('visible');
}


function sendpv(data)
{
    $.post("/sp.php", {"r": data, "sw": $(window).width(), "sh": $(window).height(), "adb": dadb()});
}


function dadb()
{
    var value = 0;
    if(typeof adsbl === 'undefined')
    {
        value = 1;
    }

    return value;
}


function sessPing(stk, secs)
{
    var msecs = secs * 1000;

    setTimeout(function()
    {
        var params = {};
        params.action = 'ping';
        params.stk = stk;

        $.post(pageUrl('session.ajax.php'), params, function(data)
        {
            if(data.result === 0)
            {
                sessPing(data.stk, data.psSecs);
            }
        });
    }, msecs);
}


function renderVersionReminder(text)
{
    if(typeof(Storage) !== "undefined")
    {
        var render = true;


        var lastRem = localStorage.getItem('remVersion');

        if(lastRem)
        {
            var ts = Math.round(new Date().getTime()/1000);

            if( lastRem > ts )
            {
                //Aun no ha caducado
                render = false;
            }
        }

        if(render)
        {
            var remCount = localStorage.getItem('remVersionCount');
            if(remCount == null)
            {
                remCount = 0;
            }

            remCount = parseInt(remCount);

            if(remCount < 5)
            {
                localStorage.setItem('remVersionCount', remCount + 1);
            }
            else
            {
                hideVersionReminder();
                render = false;
            }
        }

        if(render)
        {
            var reminder =  '<div class="version-reminder">';
                reminder +=    '<div class="body">' + text + '</div>';
                reminder +=    '<div class="close"><i class="fa fa-times"></i></div>';
                reminder += '</div>';


            $('#header-bottom .version-selector').prepend(reminder);
        }
    }
}


function hideVersionReminder()
{
    var duration = 60 * 60 * 24 * 7;

    var ts = Math.round(new Date().getTime()/1000);

    localStorage.setItem('remVersion', ts + duration);
    localStorage.setItem('remVersionCount', 0);

    $('#header-bottom .version-reminder').hide();

}

function resizeNavWidth( container){
    var deviceWidth = $(window).width();
    $(container).css('width', deviceWidth - 10 + 'px');
}


function getBreakpointWidth(breakPoint)
{
    let breakpointWidth = null;

    let availableBreakpoints = new Array('xs', 'sm', 'md', 'lg', 'xl', 'xxl');
    if(availableBreakpoints.includes(breakPoint))
    {
        breakpointWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bs-breakpoint-' + breakPoint));
    }

    return breakpointWidth;
}


function isMediaBreakpointDown(breakPoint)
{
    let result = false;

    let breakpointWidth = getBreakpointWidth(breakPoint);
    if(breakpointWidth !== null)
    {
        let screenWidth = window.screen.width;

        result = screenWidth <= breakpointWidth;
    }
    
    return result;
}
function isMediaBreakpointUp(breakPoint)
{
    let result = false;

    let breakpointWidth = getBreakpointWidth(breakPoint);
    if(breakpointWidth !== null)
    {
        let screenWidth = window.screen.width;

        result = screenWidth >= breakpointWidth;
    }
    
    return result;
}


$(function(){

    function animateJS(elem, style, unit, from, to, time, prop) {
        if (!elem) {
            return;
        }
        var start = new Date().getTime(),
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    elem[style] = (from + step * (to - from))+unit;
                } else {
                    elem.style[style] = (from + step * (to - from))+unit;
                }
                if (step === 1) {
                    clearInterval(timer);
                }
            }, 25);
        if (prop) {
              elem[style] = from+unit;
        } else {
              elem.style[style] = from+unit;
        }
    }


    


    $('.vod-wrapper').on('click', '#upd-jw', function(){
        $('.vod-wrapper').append('<div id="loadajax"><div class="img-wrapper"><div class="fa-3x"><i class="fad fa-spinner-third fa-spin"></i></div></div></div>');
        corsAjax( pageUrl('adm/justwatch.ajax.php'), {'action': 'updateMovie', 'movieId': $('.lightbox').attr('data-movie-id')}, function(){
            location.reload();
        })
    })

    //bar news top
/*
    $('.news-wrapper-top').on('click', '.close', function(){
        corsAjax( pageUrl('client-prefs.ajax.php'), { 'action': 'disabledMovieNews' } , function(data){
            $('.news-wrapper-top').fadeOut();
        })
    })
*/
    var signInUrl = pageUrl('login.php');
    var signOutUrl = pageUrl('logout.php');

    if( typeof nrp == 'undefined')
    {
        var signInUrl = pageUrl('login.php?rp=' + encodeURIComponent(window.location.href));
        var signOutUrl = pageUrl('logout.php?rp=' + encodeURIComponent(window.location.href));
    }

    $('a.sign-in').attr('href', signInUrl);
    $('a.sign-out').attr('href', signOutUrl);

    $('.sign-in').click(function(event){

        event.preventDefault();

        window.location.href = signInUrl;
    });

    $('.sign-out, .lg-out-li a').click(function(event){

        event.preventDefault();

        corsAjax(securePageUrl('account.ajax.php?action=logout'), null, function(result)
        {
            if(result.result == 0)
                location.reload(true);
        });

    });

    $('#import').on('click', '.close', function(e){
        e.preventDefault();

        $('#import .fa-info-pop').fadeOut();
    })


    //para que no redirija a la publi en los overlays
    $('.ui-widget-overlay, .cboxOverlay').bind('click', function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });

    $('#topsearch').on('input', 'input[name="stext"]', function(){
        $('.clear-search').show();
    })

    $('input[name="stext"]').on('focusin', function(){
        if( $('input[name="stext"]').val().length > 0 )
            $('.clear-search').show();
    })

    //on click cross search, clean content input
    $('#topsearch').on('click', '.clear-search', function(){
        $('input[name="stext"]').val('');
        $('input[name="stext"]').focus();
        $('.clear-search').hide();
    })


    $('a[href*="#"]').not('[href="#"]').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

            if (target.length) {
                var top = target.offset().top;
                if( $(target).attr('id') == 'header-top' ){
                    top = 0;
                }

                window.scrollTo(0, top - 50) ;
                return false;
            }
        }
    });

    // toplink
    $('#top-anch').hide();
    $(window).scroll(function(){
        if($(window).scrollTop() >= 100)
        {
            $('#top-anch').fadeIn(500);
        }
        else
        {
            $('#top-anch').fadeOut(500);
        }
    });


    $('.version-selector ul.version > li').on('click', function()
    {
        $('.page-versions-pop').toggle();
    });

    $('#mob-version, #mob-version-top').on('click', function(){
        corsAjax(securePageUrl('client-prefs.ajax.php'), {'action': 'setMobileVersion'}, function(data){
        })
    })

/*
    var jqvmap = $('.page-versions-pop #vmap').vectorMap({
        map: 'world_en' ,
        selectedColor: '#F4F3F0',
        colors: mapVersions,    //se crea en el servidor
        hoverColor: '#FDCC1A',
        onRegionOver: function(event, code)
        {
            if(typeof mapVersions[code] == 'undefined')
            {
                event.preventDefault();
            }
        },

        onRegionSelect: function(event, code)
        {
            if(typeof mapVersions[code] != 'undefined')
            {
                $('.page-versions-pop .countries > li[data-country-id="' + code + '"]').trigger('click');
            }
        },
    });

    $('.page-versions-pop').on('mouseover', '.continents .header', function()
    {
        $('.map-zoom', $(this)).css('visibility', 'visible');
    })
    .on('mouseleave', '.continents .header', function()
    {
        $('.map-zoom', $(this)).css('visibility', 'hidden');
    })
*/

    $('.page-versions-pop').on('mouseover', '.countries > li', function()
    {
        $('.go-to-version', $(this)).show();
    })
    .on('mouseleave', '.countries > li', function()
    {
        $('.go-to-version', $(this)).hide();
    })

    .on('click', '.countries > li', function()
    {
        var params = {
            action: 'changeVersion',
            key: 'version',
            value: $(this).attr('data-version'),
        };

        $.post(pageUrl('client-prefs.ajax.php'), params, function()
        {
            var pathParts = location.pathname.split('/');
            pathParts.shift();
            pathParts.shift();

            location.href = location.protocol + '//' + location.host + '/' + params.value + '/' + pathParts.join('/') + location.search;
        });

    })
/*
    .on('click', '.continents .header', function()
    {
        //jQuery('#vmap').vectorMap('zoomIn');

        switch($(this).closest('li').attr('data-continent'))
        {
            case 'america-north':
                jqvmap.transX = 0;
                jqvmap.transY = 10;
                jqvmap.scale = 1.5;
                jqvmap.zoomCurStep = 3;
                jqvmap.applyTransform();
                break;

            case 'america-south':
                jqvmap.transX = 0;
                jqvmap.transY = -250;
                jqvmap.scale = 1.5;
                jqvmap.zoomCurStep = 3;
                jqvmap.applyTransform();
                break;

            case 'europe':
                jqvmap.transX = -263;
                jqvmap.transY = -51;
                jqvmap.scale = 2;
                jqvmap.zoomCurStep = 4;
                jqvmap.applyTransform();
                break;

            case 'oceania':
                jqvmap.transX = -450;
                jqvmap.transY = -250;
                jqvmap.scale = 1.5;
                jqvmap.zoomCurStep = 3;
                jqvmap.applyTransform();
                break;
        }
    });
*/


    $('.version-reminder .close').on('click', function()
    {
        hideVersionReminder();
    });

    $('.version-reminder .disclosure').on('click', function()
    {
        hideVersionReminder();
    });

    $('.version-reminder .fa-button').on('click', function(e){

        e.preventDefault();

        var locale = $('.version-reminder .body .fa-button').attr('data-version');
        $('.page-versions-pop .countries > li[data-country-id="' + locale + '"]').trigger('click');
    })

    $('.user-card-profile .switch-menu, .user-card-profile-res .switch-menu').on('click', function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        let modal = isMediaBreakpointDown('md');   //menos de md queremos modal

        if(modal)
        {
            let dialog = $('#user-card-res-menu');
            if($('.modal-body .menu-list').length == 0)
            {
                let menu = $('.user-card-profile-res .pop-menu .menu');
                $('.angle', menu).remove();
                

                $('.modal-body', dialog).html(menu.html());
            }

            const modal = new bootstrap.Modal(dialog);
            modal.show();
        }
        else
        {
            if($(this).hasClass('visible'))
            {
                hideUserMenu();
            }
            else
            {
                $('.menu', $(this).closest('.pop-menu')).show();
                $(this).addClass('visible');
            }
        }
    });

    $('.user-card-profile-res .show-all-snets').on('click', function(event)
    {
        event.preventDefault();
        event.stopPropagation();
        $('.user-card-profile-res .switch-menu').trigger('click');
    })

    $('.user-card-profile .pop-menu span.sn-icon, .user-card-profile .in-block span.sn-icon').on('click', function(event)
    {
        event.stopPropagation();

        var dialog = $('.user-card-profile .templates .go-to-url' );
        if($('a', dialog).attr('href') == '')
        {
            var friendId = $('.user-card-profile').attr('data-user-id');
            $.post(pageUrl("users-ajax.php"), {'action': 'getUserWeb', 'friendId': friendId}, function(data)
            {
                dialog.find('a').attr('href', data.url).html(data.url);

                openUserWebDialog(dialog.clone());
            });
        }
        else
        {
            openUserWebDialog(dialog.clone());
        }
    });
    $('.user-card-profile-res span.sn-icon').on('click', function(event)
    {
        event.stopPropagation();

        let dialog = $('.templates-modals #blog-ext-link');
        
        if($('a', dialog).attr('href') == '')
        {
            var friendId = $('.user-card-profile-res').attr('data-user-id');
            $.post(pageUrl("users-ajax.php"), {'action': 'getUserWeb', 'friendId': friendId}, function(data)
            {
                dialog.find('.link a').attr('href', data.url).html(data.url);

                const modal = new bootstrap.Modal(dialog);
                modal.show();
            });
        }
        else
        {
            const modal = new bootstrap.Modal(dialog);
            modal.show();
        }
    });


    $('.mr-user-info-wrapper.sn .snets .fa-globe').on('click', function(event)
    {
        event.preventDefault();
        event.stopPropagation();


        var friendId = $(this).closest('.user-info').data('user-id');
        $.post(pageUrl("users-ajax.php"), {'action': 'getUserWebPop', 'friendId': friendId}, function(data)
        {
            openUserWebDialog($(data.pop));
        });

    });

    $('.movie-card .mobile-actions').on('click', function()
    {
        let mc = $(this).closest('.movie-card');

        let dialog = $('#mc-actions-modal');

        let movieId = mc.attr('data-movie-id');
        dialog.attr('data-movie-id', movieId);
        
        
        $('.modal-header-content > div:first-child').html($('.mc-poster img', mc).clone());
        $('.modal-header-content > .col').text($('.mc-poster img', mc).attr('alt'));

        let options = $(this).attr('data-options').split(',');
        $('.menu-action', dialog).hide();

        
        options.forEach(function(action)
        {
            switch(action)
            {
                case 'share-movie':

                break;

                case 'share-rating':
                    let userId = mc.attr('data-uid');
                    let href = $('.menu-action.' + action, dialog).attr('href');
                    href = href.replace('{user-id}', userId);
                    href = href.replace('{movie-id}', movieId);
                    $('.menu-action.' + action, dialog).attr('href', href);
                    break;
                    
            }

            $('.menu-action.' + action, dialog).show();
        });

        const modal = new bootstrap.Modal(dialog);
        modal.show();
    });


    $('#mc-actions-modal').on('click', '.add-lists', function()
    {
        let menuDialog = $(this).closest('#mc-actions-modal');

        let dialog = $('#mc-add-lists-modal');

        let listsBox = $('.lists-box', dialog);
        let loadListsPromise = loadLists(listsBox, menuDialog.attr('data-movie-id'));

        //esperamos a que se cargue el load
        loadListsPromise.then(
            function()
            {
                //$('.recent-lists', listsBox).addClass('recent-lists-resp').removeClass('recent-lists');
                $('.modal-footer', dialog).html($('.bottom', listsBox));

                //cerramos el modal del menu
                const menuModal = bootstrap.Modal.getInstance(menuDialog);
                menuModal.hide();

                //mostramos el menú de listas
                const modal = new bootstrap.Modal(dialog);
                modal.show();
            }
            
        );
        
        
    });
    

    $('.view-options-template').on('click', '[data-key-option]', function(event)
    {
        event.preventDefault();

        let item = $(this);

        let params = {
            action: 'setViewOption',
            viewOption: item.attr('data-key-option'),
        };

        $.post(pageUrl('client-prefs.ajax.php'), params, function()
        {
            let href = item.attr('href');
            
            if(typeof href === 'undefined' || !href)
            {
                href = $('a', item).attr('href');
            }
            
            location.href = href;
        });
    });
    
    if($('.name-card .main-role').length > 0)
    {
        $('.name-card').on('click', '.main-role .see-more', function()
        {
            let ul = $(this).closest('ul');

            $(this).remove();
            $('li.hidden', ul).css('display', 'inline-block');
        })
    }


    if($('.reviews-useful-bar').length > 0)
    {
        $.each($('.reviews-useful-bar > div'), function(index, bar)
        {
            $(bar).css({'width': $(this).data('percent'), 'transition' : '3s'})
        });

    }


    if($('.reset-review-ratings').length > 0 || $('.del-review-edition').length > 0)
    {
        $('.reset-review-ratings').on('click', function()
        {
            resetRatingsDiscardChanges($(this).attr('data-review-id'), 'reset-ratings');
        });

        $('.discard-review-changes').on('click', function()
        {
            resetRatingsDiscardChanges($(this).attr('data-review-id'), 'discard-changes');
        });


        function resetRatingsDiscardChanges(reviewId, type)
        {
            var action = null;
            switch(type)
            {
                case 'reset-ratings':
                    action = 'userMovieReviewValidation';
                    break;

                case 'discard-changes':
                    action = 'userMovieReviewDiscard';
                    break;
            }

            if(action)
            {
                var tcTexts = TranslateContext.getInstance(commonTextsJs);

                var dialog = $('<p>' + tcTexts.t('reviews-' + type) + '</p>');
                dialog.dialog({
                    width: 500,
                    modal: true,
                    buttons: [
                    {
                        text: 'Ok',
                        click: function()
                        {
                            var params = {};
                            params.action = action;
                            params.reviewId = reviewId;

                            $.post(pageUrl('reviews.ajax.php'), params, function(data)
                            {
                                if(data.result == 0)
                                {
                                   // resetRatingsDiscardChangesCompleteMsg(data.msg);
                                   location.reload();
                                }
                            });

                            $(this).dialog('destroy');
                        }
                    },
                    {
                        text: 'Cancel',
                        click: function()
                        {
                            $(this).dialog('destroy');
                        }
                    }]
                });
            }
        }

        function resetRatingsDiscardChangesCompleteMsg(msg)
        {
            var dialog = $('<p>' + msg + '</p>');

            dialog.dialog({
                width: 500,
                modal: true,
                buttons: [
                {
                    text: 'Ok',
                    click: function()
                    {
                        location.reload();

                        $(this).dialog('destroy');
                    }
                }]
            });
        }
    }


    function openUserWebDialog(dialog)
    {
        dialog.dialog(
        {
            resizable: false,
            height:200,
            width: 400,
            modal: true,
            open: function ()
            {
                $('a').blur();
            }
        });
    }

    $('.z-movie #left-column .add-review-wrapper').on('click', '.revtext', function(){
        var movieId =  $(this).attr('data-movie-id');

        window.location.href = pageUrl('addreview.php?movie_id=' + movieId)
    });

    if( $('.history-wrapper').length > 0 ){
        $('.skeleton-history').fadeOut();
        $('.history-wrapper').fadeIn();

        $('.history-scroll').slick({
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 3,
            prevArrow: '<span class="arrow-left"><i class="fal fa-chevron-left"></i></span>',
            nextArrow: '<span class="arrow-right"><i class="fal fa-chevron-right"></i></span>',
        })
    }
})

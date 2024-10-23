$(document).ready(function()
{
    $(document).click(function() {
        var empty = hideListBoxes();

        return !empty;
    });

    $('#mt-content-cell').on('click', '.lists-box .error-box .close', function(e)
    {
        $(this).closest('.error-box').hide();
    });

    $('#mt-content-cell').on('click', '.lists-box .recent-lists > .header > i, .lists-box .recent-lists .close', function(e)
    {
        hideListBoxes();
    });

    $('#mt-content-cell').on('click', '.lists-box .recent-lists', function(e)
    {
        e.stopPropagation();
    });

    $('#mt-content-cell').on('click', '.lists-box .recent-lists > table label[for="in-list"]', function(e)
    {
        e.stopPropagation();
        var tr = $(this).closest('tr');

        $('input[name="in-list"]', tr).prop('checked', !$('input[name="in-list"]', tr).prop('checked'));

        addRemoveMovie( tr );
    });

    $('#mt-content-cell').on('click', '.lists-box .recent-lists > table .list-name', function(e)
    {
        e.stopPropagation();
        var tr = $(this).closest('tr');

        $('input[name="in-list"]', tr).prop('checked', !$('input[name="in-list"]', tr).prop('checked'));

        addRemoveMovie(tr);
    });

    $('#mt-content-cell').on('change', '.lists-box .recent-lists [name="in-list"]', function(e)
    {
        var tr = $(this).closest('li');

        addRemoveMovie(tr);
    });


    $('#mt-content-cell').on('click', '.addl', function(event)
    {

        event.preventDefault();
        event.stopPropagation();

        var listsBox = $(this).closest('.movie-card').find('.lists-box');

        var uniqueBox = listsBox.length == 0;
        if(uniqueBox)
            listsBox = $('.unique-lists-box .lists-box');

        if(listsBox.is(':empty'))
        {

            hideListBoxes();

            //selectMc($(this).closest('.movie-card'));

            loadLists(listsBox, $(this).closest('.movie-card').attr('data-movie-id'), $(this));
        }
        else
        {
            //Esta rama es para los tours, ya que utilizan el mismo List Box
            if(uniqueBox)
                var lastMovieId = $('.recent-lists', listsBox).attr('data-movie-id');

            hideListBoxes();

            if( uniqueBox && ( lastMovieId != $(this).closest('.movie-card').attr('data-movie-id') ) )
                loadLists(listsBox, $(this).closest('.movie-card').attr('data-movie-id'), $(this));
        }


    });
});

    var previousLoadLists = null;
    if(typeof loadLists !== 'undefined')
    {
        previousLoadLists = loadLists;
    }


    loadLists = async function(listsBox, movieId, item)
    {
        if(previousLoadLists)
            previousLoadLists(item);

        if( item != undefined){ 
            if(item.hasClass('addl-selected'))
            {
                $('.main-tour-slider-wrap .addl').removeClass('addl-selected');
            }
            else
            {
                $('.main-tour-slider-wrap .addl').removeClass('addl-selected');
                item.addClass('addl-selected');
            }            
        }

        listsBox.html('<div class="recent-lists"><img src="/images/loading24.gif"></div>');

        var params = {};
        params.movieId = movieId;
        params.action = 'getListsTip';
        params.rp = location.href;
        params.responsive = 0;

        if(listsBox.hasClass('lists-box-resp'))
        {
            params.responsive = 1;
        }

        return await loadListsPost(listsBox, params);
    }


    function loadListsPost(listsBox, params)
    {
        return Promise.resolve(
            $.post(pageUrl('lists.ajax.php'), params, function(data)
            {
                if(data.result == 0)
                {
                    listsBox.html(data.tip);
                }
                else if(data.result == 2)
                {
                    var tcCommon = TranslateContext.getInstance(commonTextsJs);
                    listsBox.find('.recent-lists').html('<div class="error-lst-md">'+  tcCommon.t(data.errorMsg) + '</div>');
                }

                scrollTable($('.recent-lists', listsBox));
            })
        );
    }


    function addRemoveMovie(tr)
    {
        var listsTable = tr.closest('.recent-lists');

        var params = {};
        params.listId = tr.attr('data-list-id');
        params.movieId = listsTable.attr('data-movie-id');
        params.itk = itk;

        let toastCode = null;
        if( $('input[name="in-list"]', tr).prop('checked') )
        {
            params.action = 'addMovieToList';
            if($('.movie-card-templates #add-movie-list-success-toast').length > 0)
            {
                toastCode = $('#add-movie-list-success-toast').clone();
            }
        }
        else
        {
            params.action = 'removeMovieFromList';
            if($('.movie-card-templates #remove-movie-list-success-toast').length > 0)
            {
                toastCode = $('#remove-movie-list-success-toast').clone();
            }
        }

        $.post(pageUrl('movieslist.ajax.php'), params, function(data)
        {
            var activeTable = $('.recent-lists[data-movie-id="' + params.movieId + '"]');

            if(data.result != 0)
            {
                if($('.movie-card-templates #movie-list-error-toast').length > 0)
                {
                    toastCode = $('#movie-list-error-toast').clone();
                 
                    if(typeof data.errorMsg != 'undefined')
                    {
                        $('.toast-body', toastCode).html(data.errorMsg);
                    }

                    $('.main-toast-container').prepend(toastCode);
                    toast = new bootstrap.Toast(toastCode);
                    toast.show();

                    let checked = $('[data-list-id="' + params.listId + '"] input[name="in-list"]', activeTable).prop('checked');
                    $('[data-list-id="' + params.listId + '"] input[name="in-list"]', activeTable).prop('checked', !checked);
                }
                else
                {
                    $('table > tbody > tr[data-list-id="' + params.listId + '"] input[name="in-list"]', activeTable).prop('checked', false);

                    $('#error-dlg').dialog({ resizable: false, modal: true, buttons: { "Ok": function() { $( this ).dialog( "close" ); } } });
                }

                

                /*
                $('.error-box .msg', activeTable).html(data.errorMsg);
                $('.error-box', activeTable).show();
                setTimeout(function()
                {
                      $('.error-box', activeTable).fadeOut('fast');
                }, 1000);
                */
            }
            else
            {
                if($('table > tbody > tr[data-list-id="' + data.listId + '"]', activeTable).length > 0)
                {
                    $('table > tbody > tr[data-list-id="' + data.listId + '"]', activeTable).stop().effect('highlight');
                }

                if(toastCode)
                {
                    $('.main-toast-container').prepend(toastCode);
                    toast = new bootstrap.Toast(toastCode);
                    toast.show();
                }
                

                if(typeof addRemoveActions == 'function')
                {
                    addRemoveActions(data);   //definida en el lugar donde se incluye
                }
            }
        });
    }


    function scrollTable(listsTable)
    {
        var listsTablePos = listsTable.offset();

        var windowBottom = $(document).scrollTop() + $(window).outerHeight();
        var listTableBottom = listsTablePos.top +     listsTable.outerHeight();

        if(listTableBottom > windowBottom)  //no entra la lista actualmente en pantalla
        {
            var st = listsTablePos.top - ($(window).outerHeight() - listsTable.outerHeight());
            st += 50; //de margen

            if(st < 0)
            {
                st = 0;
            }

            $('html, body').animate(
            {
                scrollTop: st
            }, 300);

        }
    }

    var previousHideListBoxes = null;
    if(typeof hideListBoxes !== 'undefined')
    {
        previousHideListBoxes = hideListBoxes;
    }

    hideListBoxes= function()
    {
        if(previousHideListBoxes)
            previousHideListBoxes();

        var empty = $('.lists-box').length == 0 || $('.lists-box').is(':empty');

        $('.lists-box').empty();

        $('.main-tour-slider-wrap .addl').removeClass('addl-selected');

        return !empty;
    }

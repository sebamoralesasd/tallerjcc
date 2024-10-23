$(function(){

    renderRateMovie();

});

function renderRateMovie(){

    var tcTexts = TranslateContext.getInstance(commonTextsJs);

    $(".rate-movie-box").each(function(index, rBox){
        var movieId = $(rBox).attr('data-movie-id');
        var userRating = $(rBox).attr('data-user-rating');

        if(userRating != '')
        {
            if( $('.rating-select', rBox).find('option').length == 1 ){
                userRating = isNaN(parseInt( userRating )) ? 0 : parseInt( userRating );

                var urlRating = '/imgs/myratings/' + userRating + '_.png';
                var hasReview = $('.review-img', rBox).attr('data-review') != undefined;
                var htmlSelect = '';

                if(!hasReview || (hasReview && userRating == -1))
                    htmlSelect += '<option data-content="<div><span class=\'avg-rat-wrapper\'> - </span>' + tcTexts.t('rating-ns') + '</div>" value="-1">' +  tcTexts.t('rating-ns') + '</option>';

                if(userRating >=1 && userRating <=10)
                    $("#share-rating-" +  movieId, rBox).css({'visibility': 'visible'});

                for(i = 10; i >= 1; i--)
                {
                    htmlSelect += '<option data-content="<div><span class=\'avg-rat-wrapper\'>' +  i +'</span>' + tcTexts.t('rating-' + i) +'</div>">' + i + '</option>';
                }

                $('.rating-select', rBox).empty().append(htmlSelect);

                $('.bootstrap-select').removeClass('rating-select');
                $('.rating-select', rBox).on('change', function(){
                        var myrBox = $(this).closest(".rate-movie-box");

                        $(".rating-img", myrBox).append('<span>').addClass('sending-rating').html(tcTexts.t('sending rating'));

                        var myMovieId = $(myrBox).attr('data-movie-id');
                        var rsid = $(this).attr('id');
                        var itk = $(this).data('itk');

                        $.post( "ratingajax.php", { id: parseInt(myMovieId), rating: $(this).selectpicker('val'), rsid: rsid, itk: itk, action: 'rate' }, function(data){
                                if(data.result == -1 )
                                {
                                    $(".rating-img img", myrBox).hide();
                                    $('.ts-rat', myrBox).css('visibility', 'hidden');
                                    $(".rating-img", myrBox).append('<span>').removeClass('sending-rating').addClass('error-sending-rating').html(tcTexts.t('error text') );
                                }
                                else
                                {
                                    //$(".rating-img", myrBox).empty().append('<img src="/imgs/myratings/' + data.rating +'_.png" />');
                                    $('.ts-rat small', myrBox).html(data.ts);

                                    if(data.rating != 'ns')
                                    {
                                        $("#share-rating-" +  movieId, myrBox).css({'visibility': 'inherit'});
                                        $("#share-rating-" +  movieId, myrBox).removeClass('zoomOut').addClass('zoomIn');
                                        $('.ts-rat', myrBox).css('visibility', 'visible');
                                        $(myrBox).attr('data-user-rating', data.rating);
                                    }
                                    else
                                    {
                                        $("#share-rating-" +  movieId, myrBox).removeClass('zoomIn').addClass('zoomOut');
                                        $('.ts-rat', myrBox).css('visibility', 'hidden');
                                        $(myrBox).attr('data-user-rating', '-1');
                                    }
                                }
                        });

                })
            }

            if(userRating == -1)
                userRating = userRating.toString();

            $('.rating-select', rBox).selectpicker('val', userRating.toString());
        }//endif lenght rating

    });
}
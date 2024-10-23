$(document).ready(function()
{
    fixIndex();

    $('.adver-wrapper, .adv-300x250, div[id^="ftdiv"], div[id^="ftin"]').on('DOMNodeInserted', function()
    {
        fixIndex();
    });


});


function fixIndex()
{
    var maxZindex = 1300;
    var minZindex = 300;

    $('.adver-wrapper div, .adver-wrapper span, .adv-300x250 div, .adv-300x250 span, div[id^="ftdiv"], div[id^="ftin"]').filter(function()
    {
        return $(this).css('z-index') > maxZindex;
    }).css('z-index', function()
    {
        $(this).css('z-index', parseInt(($(this).css('z-index') % (maxZindex - minZindex))) + minZindex);
    });
}

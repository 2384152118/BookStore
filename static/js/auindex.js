$(function(){
    //作品管理与作者资料  点击事件
    $('.author-aside>li').first().css({
        'background-color': 'rgb(93,145,77)',
        'color': 'white'
    });
    $('.author-aside-content>li').first().css('display', 'block');
    $('.author-aside').on('click', 'li', function () {
        $('.author-aside').children().css({
            'background-color': 'white',
            'color': 'black'
        });
        $(this).css({
            'background-color': 'rgb(93,145,77)',
            'color': 'white'
        });

        $('.author-aside-content li').css('display', 'none');
        $('.author-aside-content li').eq($(this).index()).css('display', 'block');
    })


})
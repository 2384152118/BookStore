$(function () {
    $("#search").on("click",function(){
        $.ajax({
            url: '/front/search',
            type: 'POST',
            dataType: 'JSON',
            data: {novellist:$("input[name='search']").val()},
            success: function (result) {
                console.log(result);
                window.location.href='/search';
            }
        });
    })
    
});
$(function () {
    $("#search").on("click",function(){
        $.ajax({
            url: '/front/search',
            type: 'POST',
            dataType: 'JSON',
            data: {noveltype:$("input[name='search']").val()},
            success: function (result) {
                console.log(result);
                window.location.href='/search';
            }
        });
    })
    
});
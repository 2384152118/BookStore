$(function () {
    $("#section").on("click","img",function(){
       console.log(1111);
        console.log($(this).attr("data-nid"));
        $.ajax({
            url: '/front/section',
            type: 'POST',
            dataType: 'JSON',
            data: {nid:$(this).attr("data-nid")},
            success: function (result) {
                console.log(result);
                window.location.href='/section';
            }
        });
    });

    //加入书架的点击事件
    $("#section").on("click","#joinbook",function(){
        alert("成功加入书架！")
        $.ajax({
            url: '/front/join',
            type: 'POST',
            dataType: 'JSON',
            data: {novelid:$(this).attr("data-novelid")},
            success: function (result) {
                console.log(result);
                // window.location.href='/mycenter';
            }
        });
    })
   
});
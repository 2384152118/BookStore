$(function(){
    $(".daohang").on("click","li",function(){
        $(".bottom").children().css("display","none");
        $(".bottom").children().eq($(this).index()).css("display","block");
    })
})
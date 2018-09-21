$(function () {
    var form = layui.form;
    //验证码刷新
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });
    // 用户登录
    form.on('submit(login)', function(data){
        $.ajax({
            url: '/admin/login',
            type: 'POST',
            dataType: 'JSON',
            data: $('#adminlogin').serialize(),
            success: function (result) {
                console.log(result);
                if(result.r == 'u_not'){
                    $('input[name="adminname"]').parent().next('.layui-form-mid').html('账号不存在');
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/admin';
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
    $('.admin-login').click(function () {
        if($('.layui-form-danger').length){
            return ;
        }
        $('.H').html('');
        
    });

});
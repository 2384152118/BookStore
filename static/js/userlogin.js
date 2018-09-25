$(function () {
    var form = layui.form;
    //验证码刷新
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });
    // 用户登录
    form.on('submit(userlogin)', function(data){
        $.ajax({
            url: '/front/ulogin',
            type: 'POST',
            dataType: 'JSON',
            data: $('#userlogin').serialize(),
            success: function (result) {
                console.log(result);
                if(result.r == 'coder_err'){
                    alert("验证码错误！");
                    return ;
                }
                if(result.r == 'u_not'){
                    alert("用户不存在！");
                    return ;
                }
                if(result.r == 'p_err'){
                    alert("密码错误！");
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/';
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

});
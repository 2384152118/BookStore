$(function () {
    var form = layui.form;
    //验证码刷新
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });
    // 用户注册
    form.on('submit(userregist)', function(data){
        $.ajax({
            url: '/front/regist',
            type: 'POST',
            dataType: 'JSON',
            data: $('#userregist').serialize(),
            success: function (result) {
                console.log(result);
                if(result.r == 'coder_err'){
                    alert("验证码错误！");
                    return ;
                }
                if(result.r == 'u_has'){
                    alert("用户已存在！");
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/ulogin';
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

});
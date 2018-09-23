$(function (){
    var form = layui.form;
    //验证码刷新
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });
    // 作者登录
    form.on('submit(aulogin)', function(data){
        $.ajax({
            url: '/author/alogin',
            type: 'POST',
            dataType: 'JSON',
            data: $('#aulogin').serialize(),
            success: function (result) {
                console.log(result);
                if(result.r == 'author_not'){
                    $('input[name="aname"]').parent().next('.layui-form-mid').html('账号不存在');
                    return ;
                }
                if(result.r == 'pwd_err'){
                    $('input[name="apassword"]').parent().next('.layui-form-mid').html('密码错误');
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/author/index';
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

    // 用户注册
    form.on('submit(auregist)', function(data){
        $.ajax({
            url: '/author/regist',
            type: 'POST',
            dataType: 'JSON',
            data: $('#auregist').serialize(),
            success: function (result) {
                console.log(result);
                if(result.r == 'autour_exist'){
                    $('input[name="aname"]').parent().next('.layui-form-mid').html('用户已存在');
                    return ;
                }
                if(result.r == 'pwd_err'){
                    $('input[name="password"]').parent().next('.layui-form-mid').html('密码不一致');
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/author/';
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });


})
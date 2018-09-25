$(function(){
    //作品管理  点击事件
    $('.author-aside>li').first().on('click',function () {
        $('.author-aside').children().addClass("au_not_click");
        $(this).removeClass("au_not_click").addClass("au_click");

        window.location.href="/author/index";
    })

    //与作者资料
    $('.author-aside>li').last().on('click',function () {
        $('.author-aside').children().addClass("au_not_click");
        $(this).removeClass("au_not_click").addClass("au_click");

        window.location.href="/author/authorinfo";
    })

    //点击书查看内容
    $('.look').on('click','img',function(){
        let nid=$(this).parent().parent().children().first().html();
        let nname=$(this).next().html();
        
        $.ajax({
            url: '/author/look',
            type: 'POST',
            dataType: 'JSON',
            data: {nid:nid,nname:nname},
            success: function (result) {
                if(result.r == 'ok'){
                    window.location.href = '/author/look';
                }
            }
        });
    })

    //修改章节
    var form = layui.form;
    form.on('submit(see_section)', function(data){
        $.ajax({
            url: '/author/update_section',
            type: 'POST',
            dataType: 'JSON',
            data: $('#write_section').serialize(),
            success: function (result) {
                if(result.r == 'sname_is_empty'){
                    alert("章节名不能为空！");
                    return ;
                 }
                if(result.r == 'ok'){
                    alert("章节修改成功");
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

    //创建新章节 
    $('.look').on('click','.write_section',function(){
        let nid=$(this).parent().parent().children().first().html();
        let nname=$(this).parent().parent().children().eq(1).children().last().html();
        $.ajax({
            url: '/author/write_section',
            type: 'POST',
            dataType: 'JSON',
            data: {nid:nid,nname:nname},
            success: function (result) {
                if(result.r == 'ok'){
                    window.location.href = '/author/write_section';
                }
            }
        });
    })

    //完结书 
    $('.look').on('click','.overbook',function(){
        let nid=$(this).parent().parent().children().first().html();
        $.ajax({
            url: '/author/overbook',
            type: 'POST',
            dataType: 'JSON',
            data: {nid:nid,serial:1},
            success: function (result) {
                if(result.r == 'ok'){
                    window.location.href = '/author/index';
                }
            }
        });
    })

    //创建新书
    var form = layui.form;
    form.on('submit(write_novel)', function(data){
        $.ajax({
            url: '/author/write_novel',
            type: 'POST',
            dataType: 'JSON',
            data: $('#write_novel').serialize(),
            success: function (result) {
                if(result.r == 'nname_is_empty'){
                    alert("作品名不能为空！");
                    return ;
                 }
                if(result.r == 'ok'){
                    alert("作品创建成功");
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

      //添加章节
      form.on('submit(write_section)', function(data){
        $.ajax({
            url: '/author/add_section',
            type: 'POST',
            dataType: 'JSON',
            data: $('#write_section').serialize(),
            success: function (result) {
                if(result.r == 'sname_is_empty'){
                    alert("章节名不能为空！");
                    return ;
                 }
                if(result.r == 'ok'){
                    alert("章节添加成功");
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

      
      //发起修改作者信息请求
    form.on('submit(auinfo)',function () {
        $.ajax({
            url: '/author/auinfo',
            type: 'POST',
            dataType: 'JSON',
            data: $('#auinfo').serialize(),
            success: function (result) {
                if (result.r == 'ok') {
                    alert("修改成功");
                    window.location.href="/author/authorinfo";
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })


})
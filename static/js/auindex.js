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

    //点击书查看内容
    $('.look').on('click','img',function(){
        window.location.href="/author/look";
    })

    //创建新章节 
    $('.look').on('click','.write_section',function(){
        window.location.href="/author/write_section";
    })

    //完结书 
    $('.look').on('click','.overbook',function(){
        let nid=$('#nid').html();
        $.ajax({
            url: '/author/overbook',
            type: 'POST',
            dataType: 'JSON',
            data: {nid:nid,serial:1},
            success: function (result) {
                console.log(result);
            }
        });
    })

    //上传头像即其他信息
    let img = document.querySelector('#images');
    //当你选择文件的时候，value值会发生改变，触发change事件
    img.onchange = function () {
        //获取选中的文件信息：文件内容
        console.log(this.files[0]);
        let _this = this;
        // 使用ajax发送图片到服务器
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/author/upload');
        //创建一个表单数据对象
        let formdata = new FormData(); //创建一个表单数据对象 可以理解为创建一个  <form>  </form>  
        formdata.append("images", _this.files[0]); //往表单里面追加input  name="images"  value="文件"
        formdata.append("username", "徐小杨");
        formdata.append("age", "18");

        //不用设置请求头
        xhr.send(formdata);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                console.log(data);
                document.querySelector('#img').src = data.path;
                document.querySelector('#imgval').value = data.path;
            }
        }
    }

})
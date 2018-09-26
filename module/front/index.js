const express = require('express');
const router = express.Router();
const async = require('async');
//文件上传模块
const multer = require('multer');
//首页路由  跳到index首页
router.get('/', (req, res)=>{
    //判断有没有session信息
    //查询novel数据
    let data={};
    data.uid=req.session.uid;
    data.username=req.session.username;
    console.log(req.body);
    let sql = 'SELECT * FROM novel';
    conn.query(sql, (err, results)=>{
        data.novellist=results;
        res.render('front/index',data);
    });
});
//用户注册  路由
router.get('/userlogin', (req, res)=>{
    res.render('front/regist');
});
//用户登录 路由
router.get('/ulogin', (req, res)=>{
    res.render('front/ulogin');
});
//用户注册请求  post
router.post("/front/regist", (req, res) => {
            let d = req.body;
            //首先验证验证码
            if (d.coder.toLowerCase() != req.session.coder.toLowerCase()) {
                res.json({
                    r: 'coder_err'
                });
                return;
            }
            //进行数据验证
            let sql = 'SELECT * FROM user WHERE username = ?';
            conn.query(sql, d.username, (err, result) => {
                // //账号是不是存在  存在就停止执行
                if (result[0] && result[0].username == d.username) {
                    res.json({
                        r: 'u_has'
                    });
                    return;
                }
                //判断密码是否符合正确格式  (?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}  d.upasswd != pd
                let pd = /^(\w){6,20}$/;
                if(!pd.exec(d.upasswd)){
                    res.json({
                        r:"passwd_not"
                    })
                    return;
                }
                //判断电话是否符合正确格式
                let tel = /^[1][3,4,5,7,8][0-9]{9}$/;
                if(!tel.exec(d.utel)){
                    res.json({
                        r:"utel_not"
                    })
                    return;
                }
                //所有判断正确就可以添加进数据库
            //   console.log(d);
              let sql = 'INSERT INTO user(username,  upasswd, utel, addtimes) VALUES (?,?,?,?)';
              let data = [d.username, d.upasswd, d.utel, new Date().toLocaleString()];
              conn.query(sql, data, (err, result) => {
                  if (err) {
                      console.log(err);
                      res.json({
                          r: 'db_err'
                      });
                      return;
                  }
                  res.json({
                      r: 'ok'
                  });
              });

            });
        });
//用户登录请求 post
router.post("/front/ulogin", (req, res) => {
    let d = req.body;
    //首先验证验证码
    if(d.coder.toLowerCase() != req.session.coder.toLowerCase()){
        res.json({r:'coder_err'});
        return ;
    }
    //进行数据验证
    let sql = 'SELECT * FROM user WHERE username = ? ';
    conn.query(sql, [d.username,d.upasswd], (err, result)=>{
        // console.log(result);
        //账号是不是存在
        if(!result.length){
            res.json({r:'u_not'});
            return ;
        }
        //判断密码是否正确
        if(d.upasswd != result[0].upasswd){
            res.json({r:'p_err'});
            return ;
        }
        // //保存session信息
        req.session.uid = result[0].uid;
        req.session.username = result[0].username;
        req.session.uimg = result[0].uimg;
        req.session.utel = result[0].utel;

        
        res.json({r:'ok'});
        //登录成功
        

        //更新状态
        // let sql = 'UPDATE SET admin loginnums = loginnums + 1, lasttimes = ? WHERE uid = ?';
        // conn.query(sql, [new Date().toLocaleString(), result[0].uid], (err, result)=>{
        //     res.json({r:'ok'});
        // });
        
    });
})
//完结的小说    路由
router.get("/final",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    let sql = 'SELECT * FROM novel WHERE serial= 1';
    conn.query(sql, (err, results)=>{
        info.novellist=results;
    res.render("front/final",info);
    });
})
//古代言情  路由
router.get("/ancient",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    let sql = 'SELECT * FROM novel WHERE noveltype="古代言情"';
    conn.query(sql, (err, results)=>{
        info.novellist=results;
    res.render("front/ancient",info);
    });
})
//现代言情  
router.get("/modern",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    let sql = 'SELECT * FROM novel WHERE noveltype="现代言情"';
    conn.query(sql, (err, results)=>{
        info.novellist=results;
    res.render("front/modern",info);
    });
})
//玄幻仙侠  
router.get("/xianxia",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    let sql = 'SELECT * FROM novel WHERE noveltype="玄幻仙侠"';
    conn.query(sql, (err, results)=>{
        info.novellist=results;
    res.render("front/xianxia",info);
    });
})
//悬疑灵幻
router.get("/xuanyi",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    let sql = 'SELECT * FROM novel WHERE noveltype="悬疑灵幻"';
    conn.query(sql, (err, results)=>{
        info.novellist=results;
    res.render("front/xuanyi",info);
    });
})
//个人中心
router.post("/front/join",(req, res)=>{
    let d = req.body;
    req.session.novelid=d.novelid;
    if(!req.session.uid){
        res.json({r:"join_err"})
        return;
    }
    let sql = 'UPDATE novel SET nstatus=1 WHERE nid=?';
    conn.query(sql, d.novelid, (err, result)=>{
        res.json({r:"ok"});
    })
})
router.get("/mycenter",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    info.uimg=req.session.uimg;
    info.utel=req.session.utel;
    let sql = 'SELECT * FROM novel WHERE nstatus=1';
    conn.query(sql,  (err, result)=>{
        info.novel=result;
        // console.log(info.novel);
        res.render("front/mycenter",info);
    })
})
//章节页面
router.post("/front/section",(req,res)=>{
    let d = req.body;
    req.session.nid=d.nid;
    let sql = 'SELECT * FROM section where  nid= ? ';
    conn.query(sql,d.nid, (err, result)=>{
        req.session.section = result;
        console.log(result);
        res.json({r:"ok"});
    })
})
router.get("/section",(req, res)=>{
    let data={};
    data.section=req.session.section;
    data.nid=req.session.nid;
    data.count = data.section.length;
    data.length=data.section.length;
    //实现分页
    //当前页数
    let pagenum = 1;
    data.pagenum = pagenum;
    //当前页
    let page = req.query.page ? req.query.page : 1;
    data.page = page;
    let sql = 'SELECT * FROM novel where  nid= ? ';
    conn.query(sql,data.nid, (err, result)=>{
        data.novellist=result;
        res.render("front/section",data);
    })
    

})
//用户搜索  发起ajax请求获取value值 并将value值保存在session中
router.post("/front/search",(req, res)=>{
    let d = req.body;
    let sql = 'SELECT * FROM novel where  noveltype like ? or keywords like ? or aname like ? or nname like ?';
    conn.query(sql,[`%${d.novellist}%`,`%${d.novellist}%`,`%${d.novellist}%`,`%${d.novellist}%`], (err, result)=>{
    
        req.session.novellist = result;
        res.json({r:"ok"});
    })
})
//将session里面的值取出来放进data对象里 并传给前端
router.get("/search",(req,res)=>{
    let data={};
    data.uid=req.session.uid;
    data.username=req.session.username;
    data.novellist=req.session.novellist;
    console.log(data);
    res.render("front/search",data);
})
//帮助中心
router.get("/help",(req,res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    res.render("front/help",info);
})




// 上传文件的文件夹设置
const storage = multer.diskStorage({
    destination: function (req, file, cb) { //存放路径
        //按照月份存放文件
        cb(null, `./upload/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2, '0')}`);
    },
    filename: function (req, file, cb) { //文件命名
        let filename = new Date().valueOf() + '_' + Math.random().toString().substr(2, 8) + '.' + file.originalname.split('.').pop();
        // originalname ：文件的原始名称，包括后缀  0.2365895665468465156  15363008071.45_633055.jpg
        cb(null, filename)
    }
});
const upload = multer({
    storage: storage
});

let hostname="http://localhost:81/";
//作者修改个人信息
// 接收上传数据  使用第三方模块  multer
router.post('/front/upload', upload.single('images'), (req, res) => {
    console.log(req.file);
    //把反斜线转成斜线，防止各种转义引起的路径错误
    req.file.path = hostname + req.file.path.replace(/\\/g, '/');
    res.json(req.file);
});

//响应修改用户信息修改请求
router.post('/front/uinfo', (req, res)=>{
    console.log(1212);
    let d=req.body;
    let sql='UPDATE user SET username=?,uimg=?,utel=? WHERE uid=?';
    let data=[d.username,d.uimg,d.utel,req.session.uid];
    conn.query(sql,data,function (err,result) {
        console.log(333);
        if(err){
            res.json({r:'db_err'});
            return;
        }
        //成功，更新session信息
        req.session.username=d.username;
        req.session.uimg=d.uimg;
        req.session.utel=d.utel;
        res.json({r:'ok'});
    })
});
//导出子路由 
module.exports = router;
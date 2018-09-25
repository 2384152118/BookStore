const express = require('express');
const router = express.Router();
const async = require('async');
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
              console.log(d);
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
    let sql = 'UPDATE novel SET nstatus=1 WHERE nid=?';
    conn.query(sql, d.novelid, (err, result)=>{
        res.json({r:"ok"});
    })
})
router.get("/mycenter",(req, res)=>{
    let info={};
    info.uid=req.session.uid;
    info.username=req.session.username;
    let sql = 'SELECT * FROM novel WHERE nstatus=1';
    conn.query(sql,  (err, result)=>{
        info.novel=result;
        console.log(info.novel);
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
    // console.log(d);
    let sql = 'SELECT * FROM novel where  noveltype like ? or keywords like ? ';
    conn.query(sql,[`%${d.noveltype}%`,`%${d.noveltype}%`], (err, result)=>{
        req.session.noveltype = result;
        res.json({r:"ok"});
    })
})
//将session里面的值取出来放进data对象里 并传给前端
router.get("/search",(req,res)=>{
    let data={};
    data.uid=req.session.uid;
    data.username=req.session.username;
    data.noveltype=req.session.noveltype;
    res.render("front/search",data);
})
//导出子路由 
module.exports = router;
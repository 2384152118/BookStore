const express = require('express');
const router = express.Router();
//首页路由  跳到index首页
router.get('/', (req, res)=>{
    res.render('front/index');
});
router.get('/userlogin', (req, res)=>{
    res.render('front/regist');
});
//用户登录 路由
router.get('/ulogin', (req, res)=>{
    res.render('front/ulogin');
});

//用户注册请求  post
router.post("/front/regist",(req,res)=>{
    let d = req.body;
    let sql = 'INSERT INTO user(username,  upasswd, utel, addtimes) VALUES (?,?,?,?)';
    let data= [d.username, d.upasswd, d.utel, new Date().toLocaleString()];
    conn.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'ok'});
    });
})
//用户登录请求 post
router.post("/front/ulogin",(req,res)=>{
    res.json({r:'ok'});
})
//导出子路由
module.exports = router;
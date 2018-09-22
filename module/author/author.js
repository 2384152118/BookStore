const express = require('express');
const router = express.Router();
//作家登录路由
router.get('/', (req, res)=>{
    res.render('author/alogin');
});
//作家注册路由
router.get('/regist', (req, res)=>{
    res.render('author/regist');
});

//作家专区路由
router.get('/index', (req, res)=>{
    let aname=req.session.aname;
    res.render('author/index',aname);
});




//作家登录请求 post
router.post("/alogin", (req, res) => {
    let d = req.body;
    //首先验证验证码
    if(d.coder.toLowerCase() != req.session.coder.toLowerCase()){
        res.json({r:'coder_err'});
        return ;
    }
    //进行数据验证
    let sql = 'SELECT * FROM author WHERE aname = ? AND apassword = ?';
    conn.query(sql, [d.aname,d.apassword], (err, result)=>{
        // console.log(result);
        //账号是不是存在
        if(!result.length){
            res.json({r:'author_not'});
            return ;
        }
        //判断密码是否正确
        if(d.apassword != result[0].apassword){
            res.json({r:'pwd_err'});
            return ;
        }
        //保存session信息
        req.session.uid = result[0].uid;
        req.session.aname = result[0].aname;

        
        res.json({r:'ok'});
        //登录成功
        

        
    });
})



module.exports = router;
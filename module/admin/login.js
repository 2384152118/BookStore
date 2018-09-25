const express = require('express');
const router = express.Router();
//管理员登录  各种路由处理
router.get('/', (req, res)=>{
    res.render('admin/login');//views下的admin下的login.html页面
});

//登录验证
router.post('/', (req, res)=>{
    let d = req.body;
    //首先验证验证码
    if(d.coder.toLowerCase() != req.session.coder.toLowerCase()){
        res.json({r:'coder_err'});
        return ;
    }
    //进行数据验证
    let sql = 'SELECT * FROM admin WHERE adminname = ?';
    conn.query(sql, d.adminname, (err, result)=>{
//  	console.log(result);
        //账号是不是存在
        if(!result.length){
            res.json({r:'u_not'});
            return ;
        }
        //判断密码是否正确
        if(d.adminpassword!= result[0].adminpassword){
            res.json({r:'p_err'});
            return ;
        }
        //登录成功
        
        //保存session信息
        req.session.adminid = result[0].adminid;
        req.session.adminname = result[0].adminname;
        
        res.json({r:'ok'})
    });
});

module.exports = router;
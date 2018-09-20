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
router.post("/front/regist",(req,res)=>{
    res.json({r:'ok'});
})
//导出子路由
module.exports = router;
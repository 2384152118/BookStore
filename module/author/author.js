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

module.exports = router;
const express = require('express');
const router = express.Router();
//首页路由  跳到index首页
router.get('/', (req, res)=>{
    res.render('front/index');
});


//导出子路由
module.exports = router;
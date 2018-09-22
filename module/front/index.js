const express = require('express');
const router = express.Router();
const async = require('async');
//首页路由  跳到index首页
router.get('/', (req, res)=>{
    //判断有没有session信息
    //查询novel数据
    let data={uid:"",username:""};
    data.uid=req.session.uid;
    data.username=req.session.username;
    let sql = 'SELECT * FROM novel';
    conn.query(sql, (err, results)=>{
        data.novellist=results;
    });
    res.render('front/index',data);
});
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
                // if (d.username in result) {
                //     res.json({
                //         r: 'u_not'
                //     });
                //     return;
                // }
                // //判断密码是否符合正确格式  (?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}  d.upasswd != pd
                // let pd = /^(\w){6,20}$/;
                // if(!pd.exec(d.upasswd)){
                //     res.json({
                //         r:"passwd_not"
                //     })
                //     return;
                // }
                // //判断电话是否符合正确格式
                // let tel = /^[1][3,4,5,7,8][0-9]{9}$/;
                // if(!tel.exec(d.utel)){
                //     res.json({
                //         r:"utel_not"
                //     })
                //     return;
                // }
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
    let sql = 'SELECT * FROM user WHERE username = ? AND upasswd = ?';
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
//导出子路由 
module.exports = router;
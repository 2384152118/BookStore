const express = require('express');
const async = require('async');
const router = express.Router();
//作家登录路由
router.get('/', (req, res) => {
    res.render('author/alogin');
});
//作家注册路由
router.get('/regist', (req, res) => {
    res.render('author/regist');
});

//作家专区路由
router.get('/index', (req, res) => {
    let data={};
    data.aid=req.session.aid;
    data.aimg=req.session.aimg;
    data.aname = req.session.aname;
    
    async.waterfall([
        function(cb){
            //根据作家id查找该作者的所以小说
            let sql='SELECT * FROM novel WHERE aid= ?';
            conn.query(sql,data.aid,(err,results)=>{
                if (err) {
                    console.log(err);
                    return;
                }
                // console.log(results);
                cb(null,results);
            })
        },
        function(re,cb){
            //根据小说id查找该小说的所有章节
            let sql='SELECT * FROM section WHERE nid= ?'
            for(let i=0;i<re.length;i++){
                conn.query(sql,re[i].nid,(err,results)=>{
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(i,re[i].nname,results);
                    re[i]["section"]=results;
                })
            }
            cb(null,re);
        }
    ],(err,result)=>{
        data.books=result;
        console.log(data);
        res.render('author/index',data);
    });
});


//作家登录请求 post
router.post("/alogin", (req, res) => {
    let d = req.body;
    //首先验证验证码
    if (d.coder.toLowerCase() != req.session.coder.toLowerCase()) {
        res.json({
            r: 'coder_err'
        });
        return;
    }
    //进行数据验证
    let sql = 'SELECT * FROM author WHERE aname = ? AND apassword = ?';
    conn.query(sql, [d.aname, d.apassword], (err, result) => {
        // console.log(result);
        //账号是不是存在
        if (!result.length) {
            res.json({
                r: 'author_not'
            });
            return;
        }
        //判断密码是否正确
        if (d.apassword != result[0].apassword) {
            res.json({
                r: 'pwd_err'
            });
            return;
        }
        //保存session信息
        req.session.aid = result[0].aid;
        req.session.aimg = result[0].aimg;
        req.session.aname = result[0].aname;


        res.json({
            r: 'ok'
        });
        //登录成功

    });
})

//作家注册  post
router.post("/regist", (req, res) => {
    let d = req.body;
    //首先验证验证码
    if (d.coder.toLowerCase() != req.session.coder.toLowerCase()) {
        res.json({
            r: 'coder_err'
        });
        return;
    }
    //进行数据验证
    let sql = 'SELECT * FROM author WHERE aname = ?';
    conn.query(sql, d.aname, (err, result) => {
        console.log(result[0]);
        //账号是不是存在  存在就停止执行
        if (result[0]&&result[0].aname==d.aname) {
            res.json({
                r: 'autour_exist'
            });
            return;
        }
        //判断两次输入密码是否一致
        if(d.apassword!=d.password){
            res.json({
                r: 'pwd_err'
            });
            return;
        }
        //判断表单格式
        //判断密码是否符合正确格式  (?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}  d.upasswd != pd
        let pd = /^(\w){6,20}$/;
        if (!pd.exec(d.apassword)) {
            res.json({
                r: "passwd_not"
            })
            return;
        }
        //判断电话是否符合正确格式
        let tel = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tel.exec(d.atel)) {
            res.json({
                r: "atel_not"
            })
            return;
        }
        //判断邮箱格式
        let email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!email.exec(d.aemail)) {
            res.json({
                r: "email_not"
            })
            return;
        }
        //所有判断正确就可以添加进数据库
        console.log(d);
        let sql = 'INSERT INTO author(aname, apassword, atel, aemail) VALUES (?,?,?,?)';
        let data = [d.aname, d.apassword, d.atel, d.aemail];
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


module.exports = router;
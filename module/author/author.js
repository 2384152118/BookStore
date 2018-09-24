const express = require('express');
const async = require('async');
//文件上传模块
const multer = require('multer');
const router = express.Router();
//作家登录路由
router.get('/', (req, res) => {
    res.render('author/alogin');
});
//作家注册路由
router.get('/regist', (req, res) => {
    res.render('author/regist');
});

//作家专区  作品管理
router.get('/index', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    data.asex = req.session.asex;
    data.atel = req.session.atel;
    data.aemail = req.session.aemail;
    data.address = req.session.address;

    let arr = []; //用来存放所有小说的id;

    async.waterfall([
        function (cb) {
            //根据作家id查找该作者的所以小说
            let sql = 'SELECT * FROM novel WHERE aid= ?';
            let aid = JSON.parse(data.aid);
            conn.query(sql, aid, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].nid);
                }
                cb(null, results);
            })
        },
        function (re, cb) {
            //根据小说id查找该小说的所有章节
            let str = JSON.stringify(arr);
            let newstr = str.replace('[', '(').replace(']', ')');
            let sql = 'SELECT * FROM section WHERE nid in' + newstr;
            conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < re.length; i++) {
                    let section = [];
                    for (let j = 0; j < results.length; j++) {
                        if (re[i].nid == results[j].nid) {
                            section.push(results[j]);
                        }
                    }
                    re[i].section = JSON.stringify(section);
                }
                cb(null, re);
            })
        }
    ], (err, result) => {
        data.books = result;
        console.log(data);
        res.render('author/index', data);
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
        req.session.atel = result[0].atel;
        req.session.aemail = result[0].aemail;
        req.session.asex = result[0].asex;
        req.session.address = result[0].address;

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
        if (result[0] && result[0].aname == d.aname) {
            res.json({
                r: 'autour_exist'
            });
            return;
        }
        //判断两次输入密码是否一致
        if (d.apassword != d.password) {
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

//作者修改个人信息
// 接收上传数据  使用第三方模块  multer
router.post('/upload', upload.single('images'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.json(req.file);
});

//作者查看小说
router.get('/look', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    data.asex = req.session.asex;
    data.atel = req.session.atel;
    data.aemail = req.session.aemail;
    data.address = req.session.address;

    let arr = []; //用来存放所有小说的id;

    async.waterfall([
        function (cb) {
            //根据作家id查找该作者的所以小说
            let sql = 'SELECT * FROM novel WHERE aid= ?';
            let aid = JSON.parse(data.aid);
            conn.query(sql, aid, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].nid);
                }
                cb(null, results);
            })
        },
        function (re, cb) {
            //根据小说id查找该小说的所有章节
            let str = JSON.stringify(arr);
            let newstr = str.replace('[', '(').replace(']', ')');
            let sql = 'SELECT * FROM section WHERE nid in' + newstr;
            conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < re.length; i++) {
                    let section = [];
                    for (let j = 0; j < results.length; j++) {
                        if (re[i].nid == results[j].nid) {
                            section.push(results[j]);
                        }
                    }
                    re[i].section = JSON.stringify(section);
                }
                cb(null, re);
            })
        }
    ], (err, result) => {
        data.books = result;
        console.log(data);
        res.render('author/look', data);
    });
})
//创建小说
router.get('/write_novel', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    data.asex = req.session.asex;
    data.atel = req.session.atel;
    data.aemail = req.session.aemail;
    data.address = req.session.address;

    let arr = []; //用来存放所有小说的id;

    async.waterfall([
        function (cb) {
            //根据作家id查找该作者的所以小说
            let sql = 'SELECT * FROM novel WHERE aid= ?';
            let aid = JSON.parse(data.aid);
            conn.query(sql, aid, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].nid);
                }
                cb(null, results);
            })
        },
        function (re, cb) {
            //根据小说id查找该小说的所有章节
            let str = JSON.stringify(arr);
            let newstr = str.replace('[', '(').replace(']', ')');
            let sql = 'SELECT * FROM section WHERE nid in' + newstr;
            conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < re.length; i++) {
                    let section = [];
                    for (let j = 0; j < results.length; j++) {
                        if (re[i].nid == results[j].nid) {
                            section.push(results[j]);
                        }
                    }
                    re[i].section = JSON.stringify(section);
                }
                cb(null, re);
            })
        }
    ], (err, result) => {
        data.books = result;
        console.log(data);
        res.render('author/write_novel',data);
    });
})
//写章节 
router.get('/write_section', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    data.asex = req.session.asex;
    data.atel = req.session.atel;
    data.aemail = req.session.aemail;
    data.address = req.session.address;

    let arr = []; //用来存放所有小说的id;

    async.waterfall([
        function (cb) {
            //根据作家id查找该作者的所以小说
            let sql = 'SELECT * FROM novel WHERE aid= ?';
            let aid = JSON.parse(data.aid);
            conn.query(sql, aid, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < results.length; i++) {
                    arr.push(results[i].nid);
                }
                cb(null, results);
            })
        },
        function (re, cb) {
            //根据小说id查找该小说的所有章节
            let str = JSON.stringify(arr);
            let newstr = str.replace('[', '(').replace(']', ')');
            let sql = 'SELECT * FROM section WHERE nid in' + newstr;
            conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                for (let i = 0; i < re.length; i++) {
                    let section = [];
                    for (let j = 0; j < results.length; j++) {
                        if (re[i].nid == results[j].nid) {
                            section.push(results[j]);
                        }
                    }
                    re[i].section = JSON.stringify(section);
                }
                cb(null, re);
            })
        }
    ], (err, result) => {
        data.books = result;
        console.log(data);
        res.render('author/write_section',data);
    });
})
//完结状态
router.post('/overbook', (req, res) => {
    let d=req.body;
    console.log(d.nid*1);
    //修改小说状态
})

module.exports = router;
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

    let arr = []; //用来存放所有小说的id;

    async.waterfall([
        function (cb) {
            //根据作家id查找该作者的所以小说
            let sql = 'SELECT * FROM novel WHERE aid= ?';
            // let aid = JSON.parse(data.aid);
            conn.query(sql, data.aid, (err, results) => {
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
        // console.log(data);
        res.render('author/index', data);
    });
});

//作家专区  作家资料
router.get('/authorinfo', (req, res) => {
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
            let aid = data.aid;
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
        // console.log(data);
        res.render('author/authorinfo', data);
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
    let sql = 'SELECT * FROM author WHERE aname = ?';
    conn.query(sql,d.aname, (err, result) => {
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

//作者查看小说
router.get('/look', (req, res) => {
    let data = req.session.data;
    res.render('author/look', data);
})
router.post('/look', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;

    let d = req.body;
    console.log(d);

    //根据小说id查找该小说的所有章节
    let sql = 'SELECT * FROM section WHERE nid =?'
    conn.query(sql, d.nid * 1, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        //转换时间格式
        for(let i=0;i<results.length;i++){
            results[i].sdatetime=results[i].sdatetime.toLocaleString();
        }
        data.nname = d.nname;
        data.book = results;
        req.session.data = data;
        res.json({
            r: 'ok'
        });
    })

})

//修改章节内容
router.get('/_look',(req,res)=>{
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    let book = req.session.data.book;

    let sid=req.query.sid;
    for(let i=0;i<book.length;i++){
        if(book[i].sid==sid){
            data.book=book[i];
            res.render('author/_look', data);
        }
    }
})

//章节添加到数据库
router.post('/update_section', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    let d = req.body;

    //章节名不能为空
    if(d.sname==""){
        res.json({
            r: 'sname_is_empty'
        });
        return ;
    }
    //判断正确 修改数据库
    let sql = 'UPDATE section set sname=?,sortnum=?,sdatetime=?,text=?,aid=?,aname=?,nid=?,nname=? WHERE sid=?';
    let arr = [d.sname,d.sortnum,new Date().toLocaleString(),d.text,data.aid,data.aname,d.nid,d.nname,d.sid];
    conn.query(sql, arr, (err, result) => {
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
    })
})


//到写章节页面 
router.get('/write_section', (req, res) => {
    let data = req.session.data;
    res.render('author/write_section', data);
})
router.post('/write_section', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;

    let d = req.body;
    console.log(d);

    //根据小说id查找该小说的所有章节
    let sql = 'SELECT * FROM section WHERE nid =?'
    conn.query(sql, d.nid * 1, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        data.nname = d.nname;
        data.nid = d.nid * 1;
        data.book = results;
        req.session.data = data;
        res.json({
            r: 'ok'
        });
    })
})

//章节添加到数据库
router.post('/add_section', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    let d = req.body;

    //章节名不能为空
    if(d.sname==""){
        res.json({
            r: 'sname_is_empty'
        });
        return ;
    }
    //判断正确加入数据库
    let sql = 'INSERT INTO section(sname,sortnum,sdatetime,text,aid,aname,nid,nname) VALUES (?,?,?,?,?,?,?,?)';
    let arr = [d.sname,d.sortnum,new Date().toLocaleString(),d.text,data.aid,data.aname,d.nid,d.nname];
    conn.query(sql, arr, (err, result) => {
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
    })
})

//到创建小说页面
router.get('/write_novel', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;
    res.render('author/write_novel', data);
})

//创建小说成功 添加到数据库
router.post('/write_novel', (req, res) => {
    let data = {};
    data.aid = req.session.aid;
    data.aimg = req.session.aimg;
    data.aname = req.session.aname;

    let d = req.body;
     //小说名不能为空
     if(d.nname==""){
        res.json({
            r: 'nname_is_empty'
        });
        return ;
    }
    //判断该作者的小说名是否存在
    let sql = 'SELECT nid FROM novel WHERE aid=? AND nname=?';
    conn.query(sql, [data.aid, d.nname], (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                r: 'db_err'
            });
            return;
        }
        if (result.length) {
            res.json({
                r: 'novel_has_exist'
            });
            return;
        }
        //判断正确加入数据库
        let sql = 'INSERT INTO novel(nname,noveltype,keywords,info,ndatetime,aid,aname) VALUES (?,?,?,?,?,?,?)';
        let arr = [d.nname, d.noveltype, d.keywords, d.info, new Date().toLocaleString(), data.aid, data.aname];
        conn.query(sql, arr, (err, result) => {
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
        })
    })
})
//完结状态
router.post('/overbook', (req, res) => {
    let d = req.body;
    //修改小说状态
    let sql = 'UPDATE novel set serial=1 where nid=?';
    conn.query(sql, d.nid * 1, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json({
            r: 'ok'
        });
    })
})


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

let hostname="http://localhost:81/";
//作者修改个人信息
// 接收上传数据  使用第三方模块  multer
router.post('/upload', upload.single('images'), (req, res) => {
    console.log(req.file);
    //把反斜线转成斜线，防止各种转义引起的路径错误
    req.file.path = hostname + req.file.path.replace(/\\/g, '/');
    res.json(req.file);
});

//响应修改管理员信息修改请求
router.post('/auinfo', (req, res)=>{
    let d=req.body;
    let sql='UPDATE author SET aname=?,aimg=?,atel=?,aemail=?,address=? WHERE aid=?';
    let data=[d.aname,d.aimg,d.atel,d.aemail,d.address,req.session.aid];
    conn.query(sql,data,function (err,result) {
        if(err){
            res.json({r:'db_err'});
            return;
        }
        //成功，更新session信息
        req.session.aname=d.aname;
        req.session.aimg=d.aimg;
        req.session.atel=d.atel;
        req.session.aemail=d.aemail;
        req.session.address=d.address;
        res.json({r:'ok'});
    })
});

module.exports = router;
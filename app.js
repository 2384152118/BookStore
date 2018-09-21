//引入各种模块
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const session = require("express-session");
const multer = require("multer");
const mysql = require("mysql");
const md5 = require("md5");
const svgCaptcha = require("svg-captcha");
const async = require("async");

//创建服务
const app = express();

//定义secret参数
let secret = "www.bookstore.app";

//启用各种中间件
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser(secret));

//启用模板引擎  views 各种模板文件
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', './views');

//启用session
app.use(session({
    secret:secret,
    resave:false,  //每次都重新保存session
    saveUninitialized: true,
    cookie: {maxAge:30*24*3600*1000}  //最大有效期
}));

//multer 文件上传模块  upload 临时存储上传图片或文件的文件夹
const diskstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./upload/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2, '0')}`);
    },
    filename: function (req, file, cb) {
        let filename = new Date().valueOf() + '_' +  Math.random().toString().substr(2, 8) + '.' + file.originalname.split('.').pop();
        cb(null, filename)
    }
});

//启动数据库服务  
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:3306,
    database:'bookstore'
});
conn.connect();


//定义各种模块的路由请求
//首页模块 子路由
app.use("/",require("./module/front/index.js"));
//作者模块 子路由
app.use("/author",require("./module/author/author.js"));




//静态资源托管文件    static
app.use(express.static("static"));

//端口监听
app.listen(81,(req,res)=>{
    console.log("启动成功...")
})
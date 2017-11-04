let express=require('express');

let bodyParser=require('body-parser');

let session=require('express-session');

let app=express();

app.listen(3000);

app.set('views','./views');
app.set('view engine','xtpl');

app.use(express.static('./public'));
app.use('/public',express.static('./public'))
// 解析post数据的中间件
app.use(bodyParser.urlencoded({extended:false}));

// 处理 session 的中间件
// 当使用了 session 中间件后
// 就在 req 上添加了一个 session
// 属性，通过这个属性可以实现设置和
// 读取session目的
// 有点类似于 PHP 的 $_SESSION
app.use(session({
        secret:'fad',
        resave:false,
        saveUninitialized:false
    
}));

// http规定在请求头之前不能有 响应主体
app.use('/admin',(req,res,next)=> {
    if(!req.session.loginfo&&req.url!='./login'){
        return res.redirect('/login');
    }
    next();
})


let admin=require('./routes/admin');
let home=require('./routes/home');

app.use('/admin',admin);
app.use('/',home);
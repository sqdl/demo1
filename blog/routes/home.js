let express=require('express');
//用户处理数据
let user=require('../models/user');

let post=require('../models/post');

let home=express.Router();

home.get('/',(req,res)=> {
    // res.send('111');
    // 当前页显示两条数据
    let pageSize=2;
    // 当前页码
    let page=req.query.page||1;
    post.count((err,row)=> {
        // console.log(row);
        if(err){
            // console.log(err);
            return;
        }
            

        let total=row.total;
        let pages=Math.ceil(total/pageSize);
        
        post.findAll(pageSize,page,(err,row)=> {

            // console.log(row);
            if(!err){
                res.render('home/index',{
                    posts:row,
                    page:page,
                    pages:pages
                })
            }
        })


    })


   
    
})
home.get('/article',(req,res)=> {

    post.find(req.query.id,(err,rows)=>{
        console.log(req.query);
        if(!err){
            res.render('home/article', {post:rows[0]});
        }
    })
    
})
home.get('/about',(reeq,res)=> {
    res.render('home/about',{});
});
home.get('/center',(req,res)=> {
    res.render('home/center',{});
})
home.get('/join',(req,res)=> {
    res.render('home/join',{});
})
home.get('/login',(req,res)=> {
    res.render('home/login',{});
})
home.get('/register',(req,res)=> {
    res.render('home/register',{});
})


// 注册
home.post('/register',(req,res)=> {
    console.log(req.body);
//    连桥 检测请求是否成功
    // res.send('111');
    user.insert(req.body,(err)=> { 
        if(!err){
           
            res.json({
                code:10000,
                msg:'注册成功'
            })
        }
    })
})

// 登录
home.post('/login',(req,res)=> {

    // res.send('111');
   user.auth(req.body.email,req.body.pass,(err,row)=> {
       if(!err){

        req.session.loginfo=row;

        res.json({
            code:10000,
            msg:'登录成功'
        });
       }
   })
})
module.exports=home;
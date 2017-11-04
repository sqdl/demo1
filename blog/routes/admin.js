let express=require('express');

let user=require('../models/user');

let post=require('../models/post');

let admin=express.Router();

let multer=require('multer');

// let upload=multer({dest: 'public/admin/uploads/avater'});

// 通过 diskStorage 实现目录位置和文件名的自定义操作
var storage = multer.diskStorage({
    // 自定义文件目录
    destination: function (req, file, cb) {
        cb(null, 'public/admin/uploads/avatar');
    },
    // 自定义文件名称
    filename: function (req, file, cb) {
        let extname = file.originalname.slice(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + extname);
    }
})
var upload = multer({ storage: storage });

admin.get('/',(req,res)=> {
    res.render('admin/index',{});
});

admin.get('/add',(req,res)=> {
    res.render('admin/blog_add',{action:'/admin/add'});
})


admin.get('/edit', (req, res) => {

    post.find(req.query.id,(err,rows)=> {
        console.log(req.body);
        if(!err){
            res.render('admin/blog_add', {
                posts:rows[0],
                action:'/admin/modify'
            });
        }
    })
    
})

admin.post('/modify',(req,res)=> {
    let id=req.body.id;
    delete req.body.id;
    post.modify(req.body,id,(err)=> {
        console.log(req.body);
        if(!err){
            return res.json({
                code:10000,
                msg:'修改成功'
            })
        }
    })

})

admin.get('/list',(req,res)=> {
    
    post.findAll((err,rows)=> {
        if(err){
            return res.send('数据库错误');
        }
        res.render('admin/blog_list',{posts:rows});
    })


    
})
admin.get('/repass',(req,res)=> {
    res.render('admin/repass',{});
});

admin.get('/settings',(req,res)=> {
    let uid = req.session.loginfo.id;
    user.find(uid, (err, rows) => {
        // console.log(err);
        if (!err) {
            res.render('admin/settings', { users: rows[0] });
        }  
    })
})


// 退出
admin.get('/logout',(req,res)=> {
    req.session.loginfo=null;

    res.redirect('/login');
})

// 添加文章
admin.post('/add',(req,res)=> {
    // console.log(req.body);
    // res.send('111');
    post.add(req.body,(err)=> {
        console.log(req.body);

        req.body.uid=req.session.loginfo.id;
        if(!err){

            res.json({
                code:10000,
                msg:'添加成功'
            })
        }
    })
})

admin.post('/list',(req,res)=> {
    post.delete(req.body.id,(err)=> {
        if(err){
            return res.send('删除失败');
        }
        res.json({
            code:10000,
            msg:'删除成功'
        })
    })
})

admin.post('/update',(req,res)=> {
    // res.send('111');
    let uid=req.session.loginfo.id;
    user.update(req.body,uid,(err)=> {
        if(err){
            // console.log(err);
            return res.send('保存失败');
        }
        res.json({
            code:10000,
            msg:'保存成功'
        })
    })
});

// 使用中间件 upload.single 中间件 实现文件上传
admin.post('/upfile',upload.single('avatar'),(req,res)=> {
    res.json({
        code:10000,
        msg:'上传成功',
        path:req.file.path
    })
})

module.exports = admin;
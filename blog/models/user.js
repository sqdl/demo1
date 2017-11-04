let db=require('./db');

//插入数据( 调用时用中间件user)
exports.insert=function(data,cb){
    let query='insert into users set ?';

    data.pass=db.md5(data.pass);
    db.query(query,data,(err)=> {
        if(err){
            return cb(err);
        }
        cb(null);
    });
}

// 登录验证
exports.auth=function(email,password,cb){
    let query='select * from users where email=?';

    db.query(query,email,(err,rows)=> {
        if(err){
           return cb(err);
        }

        if(rows[0].pass==db.md5(password)){
            return cb(null,rows[0]);
        }

        cb({
            msg:'用户或密码错误'
        })
        
    })
}

exports.find = (id,cb) => {
    let query = 'select * from users where id=?';
    db.query(query,id, (err, rows) => {
        if (err) {
            return cb(err);
        }
        cb(null, rows);
    })
}

// 个人列表修改
exports.update=(data,id,cb)=>{
    let query='update users set ? where id=?';

    db.query(query,[data,id],(err)=> {
        if(err){
            return cb(err);
        }
        cb(null);
    })
}

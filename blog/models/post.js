let db=require('./db');

// 添加文章
exports.add=(data,cb)=> {
    let query='insert into posts set ?';

    db.query(query,data,(err)=> {
        if(err){
            return cb(err);
        }
        cb(null);
    })
}

//在数据库中查找数据，
exports.findAll=(...args)=> {
    // 可以 上传多个参数 args
    let query,offset,pageSize,page,cb;

    if(args.length==1 && typeof args[0]=="function"){
        cb = args[0];
        query='select * from posts left join users on posts.uid=users.id'; 
    }else {
        pageSize=args[0];
        page=args[1];
        cb=args[2];
        offset = (page - 1) * pageSize;
        query='select * from posts left join users on posts.uid=users.id limit ?,?';

    }

    db.query(query,[offset,pageSize],(err,row)=> {
        if(err){
           return cb(err);
        }
        cb(null,row);

    })
}

// 博客总条数
exports.count=(cb)=> {
    let query='select count(*) as total from posts';

    db.query(query,(err,row)=> {
        if(err){
            return cb(err);
        }
        cb(null,row[0]);
    })
}



// 删文章
exports.delete=(id,cb)=> {

    let query='delete from posts where id=?';
    db.query(query,id,(err)=> {
        if(err){
            return cb(err);
        }
        cb(null);
    })
}

module.exports.find = (id, cb) => {
    let query='select * from posts left join users on posts.uid=users.id where posts.id=?';
    db.query(query,id,(err,rows)=> {
        if(err){
            return cb(err);
        }
        cb(null,rows);
    })
}

// 文章编辑
module.exports.modify=(data,id,cb)=> {
    let query='update posts set ? where id=?';

    db.query(query,[data,id],(err)=> {
        if(err){
            return cb(err);
        }
        cb(null);
    })
}
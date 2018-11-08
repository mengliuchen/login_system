const http=require("http")
const fs=require("fs")
const querystring=require("querystring")
const urllib=require("url")
const path=require('path')
var users={};

var server=http.createServer(function(req,res){
//1.接收数据
  var str="";
  var result=JSON.parse(fs.readFileSync("username.json")).user;
  console.log("result",result)

  req.on("data",function(data)
  {
    str+=data;
  })
  req.on("end",function(){
    var obj=urllib.parse(req.url,true)
    var url=obj.pathname;
    var get=obj.query;
    var post=querystring.parse(str)
    //区分接口和文件
    if(url=='/user')
    {
      switch(get.act){
      case 'reg':
      for(var i=0;i<result.length;i++)
      {
        if(get.name==result[i].name)
        {
          res.write('{"ok":"false","msg":"此用户已存在"}')
          res.end()
          break;
        }
        else if(i==result.length-1)
        {
          fs.readFile("username.json",function(err,data){
            if(err)
            {
              req.write("404")
            }
            else {
              var params={"name":get.name,"password":get.password}
              var person = data.toString();
              person = JSON.parse(person)
              console.log("person",person)
              person.user.push(params)
              console.log("person.user",person.user)
              var str = JSON.stringify(person)
              fs.writeFile("username.json",str,function(err)
            {
              if(err)
              console.log(error)
              else {
                res.write('{"ok":"true","msg":"注册成功"}')
              }
              res.end()
            })
            }
          })
        }
      }
      break;
      case 'login':
      for(var i=0;i<result.length;i++)
      {
        if(get.name==result[i].name)
        {
          if(get.password==result[i].password)
          {
            res.write('{"ok":"true","msg":"登陆成功"}')
          }
          else
          {
            res.write('{"ok":"false","msg":"密码错误"}')
          }
          res.end()
          break;
        }
        else if(i==result.length-1)
        {
          res.write('{"ok":"false","msg":"不存在的用户"}')
          res.end()
        }
      }
      break;
      default:
      {
        res.write('{"ok":"false","msg":"未知的act"}')
        res.end()
        }
    }

    }
    else {
      //2.读取文件
      var file_name=__dirname+url
      console.log(path.dirname(__filename))
      fs.readFile(file_name,function(err,data){
        if(err)
        {
          res.write("404")
        }

        else {
          res.write(data)
        }
        res.end()
      })
    }

  })
})
server.listen(8888)

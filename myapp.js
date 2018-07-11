let http=require('http');
let path=require('path');
let fs=require('fs');
let querystring=require('querystring');
let mime=require('mime');
//配置网站根目录
let rootPath=path.join(__dirname,'www');

http.createServer((request,response)=>{
    // response.setHeader('content-type','text/html;charset=utf-8');
    // response.end('请求过来了');
    //生成目录,用pustring解析url中的汉字
    let filePath=path.join(rootPath,querystring.unescape(request.url));
    //判断目录是否存在
    let isfile=fs.existsSync(filePath);
    if(isfile){
        //说明目录存在,遍历文件里的目录
        fs.readdir(filePath,(err,files)=>{
            if(err){
                //说明遍历失败,此目录是文件,而非文件夹,直接读取文件返回给浏览器即可
                // 需设置文件类型,以便浏览器解析
                response.writeHead(200,{
                    "content-type":mime.getType(filePath)
                });
                fs.readFile(filePath,(err,data)=>{
                    response.end(data);
                })
            }else{
                //说明是文件夹,遍历显示目录
                //先判断是否有主页
                if(files.indexOf('index.html')!=-1){
                    //说明文件夹中有主页,直接读取主页返回
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        response.end(data);
                    })
                }else{
                    //遍历子文件
                    console.log('111');
                    let backdata='';
                    for(var i=0;i<files.length;i++){
                        backdata=`<h3><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h3>`
                    }
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8'
                    })
                    response.end(backdata);
                }

            }
        })
    }else{
        //说明目录不存在
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        });
        response.end(`
            <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>The requested URL /in.jklk was not found on this server.</p>
            </body></html>
        `)
    }

}).listen(80,'127.0.0.1',()=>{
    console.log('开始监听,127.0.0.1:80');
})
const ws = require('nodejs-websocket')
const PORT = 3000;
let count = 0
let id = 0


// 每个连接到服务器的用户,都会有一个connect
const server = ws.createServer(connect => {
 
    id++
    console.log("有用户连接上来了，设置为：用户" + id + "\n" + "当前用户数为：" + get_user_nums())
    
    connect.UserName = "用户" + id

    // 接收用户信息,当接收到信息的时候,告诉所有用户(server.connections)发送的内容是什么
    connect.on('text', data => {
        console.log("接收到了" + connect.UserName + "的数据：", data)
        broadcast(data)
    })

    function get_user_nums(){
        return server.connections.length
    }

    // 广播,给所有用户发消息
    function broadcast(msg){
        server.connections.forEach(item => {
            item.send(msg)
        })
    }


    // 有用户离开时,也要告诉所有的用户
    connect.on('close', () => {
        console.log(connect.UserName + "连接断开")
    })

    connect.on('error', () => {
        console.log(connect.UserName + "连接异常")
    })

})

server.listen(PORT, () => {
    console.log("websocket服务启动成功，监听了端口"+PORT)
})
let express = require('express');
let { parseBodyData } = require('./utils.js');
let { getOpenAiReply } = require('./openai/index.js')
let app = express();
//聊天开关
let chatFlag = false
app.post('/api/list', async function (req, res) {
    //不能正确解析json 格式的post参数
    let data = await parseBodyData(req)
    console.log(data, 'data')
    switch (data.msg) {
        case '聊天开启':
            chatFlag = true
            console.log("0000000000")
            return res.json(
                {
                    "success": true,//true时，http-sdk才处理，false直接丢弃
                    "message": "successful!",
                    "event": "SendTextMsg",//告诉它干什么，SendImageMsg是发送图片事件
                    "robot_wxid": data.robot_wxid,//用哪个机器人发
                    "to_wxid": data.from_wxid,//发到哪里？群/好友
                    "member_wxid": '',
                    "member_name": '',
                    "group_wxid": '',
                    "msg": '聊天开启成功',//发送的内容
                }
            )
        case '聊天关闭':
            chatFlag = true
            console.log("11111111111")
            return res.json(
                {
                    "success": true,//true时，http-sdk才处理，false直接丢弃
                    "message": "successful!",
                    "event": "SendTextMsg",//告诉它干什么，SendImageMsg是发送图片事件
                    "robot_wxid": data.robot_wxid,//用哪个机器人发
                    "to_wxid": data.from_wxid,//发到哪里？群/好友
                    "member_wxid": '',
                    "member_name": '',
                    "group_wxid": '',
                    "msg": '聊天关闭成功',//发送的内容
                }
            )
        case '小姐姐':
            return res.json(
                {
                    "success": true,//true时，http-sdk才处理，false直接丢弃
                    "message": "successful!",
                    "event": "SendImageMsg",//告诉它干什么，SendImageMsg是发送图片事件
                    "robot_wxid": data.robot_wxid,//用哪个机器人发
                    "to_wxid": data.from_wxid,//发到哪里？群/好友
                    "member_wxid": '',
                    "member_name": '',
                    "group_wxid": '',
                    "msg": {
                        "url": 'https://api.vvhan.com/api/tao',
                        "name": "111.jpg",
                    },//发送的内容
                }
            )
    }
    /**微信聊天**/
    if (!chatFlag) return //聊天关闭
    let reg = /wxid=(.*)]/g
    reg.test(data.msg)
    let callSomeoneId = RegExp.$1
    if (data?.msg?.indexOf('@at') > -1 && callSomeoneId == data.robot_wxid) { //要@机器人才聊天
        const newMsg = data.msg.substr(data.msg.lastIndexOf('  ')).trim()
        let robotAnswer = await getOpenAiReply(newMsg)
        console.log(robotAnswer, 'robotAnswer')
        return res.json(
            {
                "success": true,//true时，http-sdk才处理，false直接丢弃
                "message": "successful!",
                "event": "SendGroupMsgAndAt",//告诉它干什么，SendImageMsg是发送图片事件
                "robot_wxid": data.robot_wxid,//用哪个机器人发
                "to_wxid": '',//发到哪里？群/好友
                "member_wxid": data.final_from_wxid,
                "member_name": data.final_from_name,
                "group_wxid": data.from_wxid,
                "msg": robotAnswer,//发送的内容
            }
        )
    }
})


/**
* 监听8090端口
*/
app.listen('8090');
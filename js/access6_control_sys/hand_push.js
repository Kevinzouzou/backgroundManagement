/**
 * Created by GIGA on 2017/9/8.
 *1.门口机和围墙机屏亮设置共用一个接口
 *2.timeString是点击推送后弹出框中设置吗？
 */
//天气时间推送
function handPushWeather(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!noSen_getweather.action",
        data: {
            'token': permit,
            'mac':""
        },
        dataType: "json",
        success: function (data) {
            msgTips(data.msg);
        }
    });
}

//重新启动
function pushRestart(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!updateControllerRestartSetting.action",
        data: {
            'token': permit,
            'ctm.byname':"重启定时",
            'ctm.timeString':'5,18:00:00',//前面是周，后面是时间
            'ctm.status':1
        },
        dataType: "json",
        success: function (data) {
            msgTips("重新启动推送成功");
        }
    });
}

//门口机开LCD//门口机关LCD
function pushDoorMachineOnOrOffLCD(status){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCtrollerAction!setDoorScreenBlackLight.action",
        data: {
            'token': permit,
            'ctm.timeString':"1-6,12:20:12-18:20:13",//前面是月份，后面是时间段
            'ctm.status': status//1启用0停用
        },
        dataType: "json",
        success: function (data) {
            if(status==1){
                msgTips("门口机开LCD推送成功");
            }else{
                msgTips("门口机关LCD推送成功");
            }
        }
    });
}

//围墙机开LCD//围墙机关LCD
function pushFenceMachineOnOrOffLCD(status){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCtrollerAction!setDoorScreenBlackLight.action",
        data: {
            'token': permit,
            'ctm.timeString':"1-6,12:20:12-18:20:13",//前面是月份，后面是时间段
            'ctm.status': status//1启用0停用
        },
        dataType: "json",
        success: function (data) {
            if(status==1){
                msgTips("围墙机开LCD推送成功");
            }else{
                msgTips("围墙机关LCD推送成功");
            }
        }
    });
}

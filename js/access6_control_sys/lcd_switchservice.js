/**
 * Created by GIGA on 2017/9/11.
 */
/**
 * 点击LCD开关设置查询controllertimermode表中的数据
 * */
$('.lcd_switch').click(function(){
    queryControllerTimerMode();
});

function queryControllerTimerMode(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!queryControllerRestartSetting.action",
        data: {
            'token': permit,
            'zonecode':getZoneCode_lcd_switch(permit)
        },
        dataType: "json",
        success: function (data) {
           //渲染数据
           showlcdSwitchTableList(data.obj);
        }
    });
}
//加载更新
function lcdSwitchSettings(controllerTimerModeJson){
   //对json参数进行解析
    var timeString = "";
    for(var key in controllerTimerModeJson){
        timeString = controllerTimerModeJson["timeString"];
    }
    //select中默认选中第几项
    $("#lcdswitch_week").val(timeString.split(",")[0]);
    $("#lcdswitch_time").val(timeString.split(",")[1]);
    $("#lcdswitch_status").val(controllerTimerModeJson["status"]);
}
//完成更新并查询
function lcdSwitchUpdateSet(){
    var zonecode = getZoneCode(permit);
    var status = $("#lcdswitch_status").val();
    var timeString = $("#lcdswitch_week").val()+","+$("#lcdswitch_time").val();
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/controllerAction!updateControllerRestartSetting.action",
        data:{
            'token':permit,
            'zonecode':zonecode,
            'ctm.timeString':timeString,
            'ctm.status':status
        },
        dataType:"json",
        success: function(data){
            $("#lcdswitch-modal-set").modal('hide');
            queryControllerTimerMode();
        }
    });
}

//开启和关闭
function startOrStop(controllerTimerModeJson,status){
    $(".lcdswitchStop").css("color","#A4A4A5");
    $(".lcdswitchStart").css("color","#679ACC");
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/controllerAction!updateControllerRestartSetting.action",
        data:{
            'token':permit,
            'zonecode':controllerTimerModeJson["zonecode"],
            'ctm.timeString':controllerTimerModeJson["timeString"],
            'ctm.status':status
        },
        dataType:"json",
        success: function(data){
            queryControllerTimerMode();
        }
    });
}

//取消设置
function cancelLCDSwitchSet(){
    $("#lcdswitch-modal-set").modal('hide');
}

function getZoneCode_lcd_switch(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    return code.substring(0,code.indexOf("d")+1);
}

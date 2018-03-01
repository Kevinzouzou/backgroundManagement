/**
 * Created by along on 2017/1/24. 报警设置
 */
//--加载初始方法--
$("a[href='#security_alarm_menu'],a[href='#tab_set_alarm']").click(function (){
    setTimeout(function(){$(".set_alarm").addClass("active");},200);
});
//--表单验证--
function verifyAlarmRank(prefixId){
    //报警级别
    let itemcode=$("#"+prefixId+" #itemcode").val();//费项编号
    if(!itemcode){msgTips("请填写费项编号");return;};
    let formData={
        "itemcode":itemcode,
    };
    return formData;
};
function verifyAlarmNumber(prefixId){
    //物管账号
    let itemcode=$("#"+prefixId+" #itemcode").val();//费项编号
    if(!itemcode){msgTips("请填写费项编号");return;};
    let formData={
        "itemcode":itemcode,
    };
    return formData;
};
//--回显赋值--
function echoEchoAlarmRank(prefixId,this_){
    //报警级别
    let itemcode=$(this_).parents("tr").find("td").eq(0).text();//费项编号
    $("#"+prefixId+" #itemcode").val(itemcode);
};
function echoEchoAlarmNumber(prefixId,this_){
    //物管账号
    let itemcode=$(this_).parents("tr").find("td").eq(0).text();//费项编号
    $("#"+prefixId+" #itemcode").val(itemcode);
};
// 查询
function setAlarmInitialize(parameters){
    if(parameters=="alarmRank"){
        // 报警级别
        alarmRank();
    }else if(parameters=="alarmNumber"){
        // 物管账号
        alarmNumber();
    }else if(parameters=="alarmTime"){
        // 保存时间
        alarmTime();
    }
};
function alarmRank(page,type){};
function alarmNumber(page,type){};
function alarmTime(page,type){};
// 添加
$(".SetAlarmBut").click(function(){
    let ids=$(this).attr("ids");
    if(ids=="alarmRank"){
        // 报警级别
        $("#addSetAlarmRankModal").modal("show");
    }else if(ids=="alarmNumber"){
        // 物管账号
        $("#addAlarmNumberModal").modal("show");
    }else if(ids=="staffChoice"){
        // 添加物管账号——员工
        $("#propertyAdminModal").modal("show");
    }
});
// 修改
$("#tab_security_alarm").on("click",".modifyBut",function(){
    let this_=$(this);
    let type=this_.attr("type");
    if(type=="alarmRank"){
        // 报警级别
        echoEchoAlarmRank("setAlarmRankForm",this_);
        $("#addSetAlarmRankModal").modal("show");
    }else if(type=="alarmNumber"){
        // 物管账号
        echoEchoAlarmNumber("alarmNumberForm",this_);
        $("#addAlarmNumberModal").modal("show");
    }
});
// 删除
$("#tab_security_alarm").on("click",".deleteBut",function(){
    let type=$(this).attr("type");
    if(type=="alarmRank"){
        // 报警级别
        let ids=$(this).attr("ids");
        let dataObj={"token":permit,"idList":ids};
        let callBack="alarmRank()";
        let ajaxURL="/ucotSmart/";
        deletePubModal(dataObj,callBack,ajaxURL);
    }else if(type=="alarmNumber"){
        // 物管账号
        let ids=$(this).attr("ids");
        let dataObj={"token":permit,"idList":ids};
        let callBack="alarmNumber()";
        let ajaxURL="/ucotSmart/";
        deletePubModal(dataObj,callBack,ajaxURL);
    }
});
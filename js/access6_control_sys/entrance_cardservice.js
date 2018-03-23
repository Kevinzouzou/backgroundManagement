/**
 * Created by GIGA on 2017/9/4. 门禁卡
 */
var pageSize = 10;
/**
 * 点击门禁卡查询门禁卡数据
 * */
$('.entrance_card').click(function(){
    $('#entrance_card_tableList2').hide();
    $('#doorcardMainPage').show();
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryAllDoorCardJump');
    // queryAllDoorCardJump();
    findDoorCardByCondition();
    $('#entrance_card_tableList2').hide();
  $('#doorcardMainPage').show();
  loadSelectDoorCard();
});

// function queryAllDoorCardJump(){
//     $('#entrance_card_tableList2').hide();
//     $('#doorcardMainPage').show();
//     loadSelectDoorCard();
//     var url = "/ucotSmart/doorCardAction!findAllDoorCard.action";
//     var senddata ="";
//     var pageid = "doorcard_page";
//     var fnname = "showDoorCardTableList";
//     queryListByParams(url,senddata,pageid,fnname);
//
// }
//加载select
function loadSelectDoorCard(){
    $('.input').val("");
    var zonecode = getZoneCodeByToken(permit);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        data: {
            'token':permit,
            'zonecode':zonecode
        },
        dataType: "json",
        success: function (data) {
            var doorcardcodeD = $("#doorcard-codeD");
            doorcardcodeD.empty();
            $("#doorcard-codeU").css("display","none");
            $("#doorcard-codeH").css("display","none");
            doorcardcodeD.append('<option value=0>全部房间</option>');
            for(var x=0;x<data.obj.length;x++){
                var codestr = data.obj[x].code;
                var newcodestr = doorcard_strToCharacter(codestr.substring(codestr.indexOf("d")+1));
                doorcardcodeD.append('<option value='+codestr+'>'+newcodestr+'</option>');
            }
        }
    });
}

function selectDoorCardCodeD(buildingcode){
    $("#doorcard-codeU,#doorcard-codeH").empty();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryUnit.action",
        data: {
            'token':permit,
            'buildingcode':buildingcode
        },
        dataType: "json",
        success: function (data) {
            if(buildingcode!=0){
                var doorcardcodeU = $("#doorcard-codeU");
                doorcardcodeU.css("display","");
                $("#doorcard-codeH").css("display","none");
                doorcardcodeU.append('<option value=0>请选择</option>');
                for(var x=0;x<data.obj.length;x++){
                    var codestr = data.obj[x].code;
                    var newcodestr = doorcard_strToCharacter(codestr.substring(codestr.indexOf("b")+1,codestr.indexOf("u")+1));
                    doorcardcodeU.append('<option value='+codestr+'>'+newcodestr+'</option>');
                }
            }else{
                $("#doorcard-codeU").css("display","none");
                $("#doorcard-codeH").css("display","none");
            }
        }
    });
}

function selectDoorCardCodeU(unitcode){
    $("#doorcard-codeH").empty();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        data: {
            'token':permit,
            'unitcode':unitcode
        },
        dataType: "json",
        success: function (data) {
            var doorcardcodeH = $("#doorcard-codeH");
            $("#doorcard-codeH").css("display","");
            doorcardcodeH.append('<option value=0>请选择</option>');
            for(var x=0;x<data.obj.length;x++){
                var codestr = data.obj[x].code;
                var newcodestr = doorcard_strToCharacter(codestr.substring(codestr.indexOf("d")+1));
                doorcardcodeH.append('<option value='+codestr+'>'+newcodestr+'</option>');
            }
        }
    });
}

//门禁卡条件查询
function findDoorCardByCondition(){
    var identity = $("#identity-doorcard").val();
    var cardid = $("#cardid").val();
    var doorcardD =  $("#doorcard-codeD").find("option:selected").val();
    var doorcardU= $("#doorcard-codeU").find("option:selected").val();
    var doorcardH = $("#doorcard-codeH").find("option:selected").val();
    var homecode;
    doorcardH==0||!doorcardH?doorcardU==0||!doorcardU?doorcardD==0||!doorcardD?homecode="":homecode=doorcardD:homecode=doorcardU:homecode=doorcardH;
    var guardType = $("#docarType .guardType").attr("optionid");
    $.ajax({
        type: "post",
        
        url: zoneServerIp+"/ucotSmart/doorCardAction!findAllDoorCard.action",
        data: {
            'token':permit,
            'pager.pages':1,
            'pager.pagesize':pageSize,
            'doorcard.identity':identity,
            'doorcard.cardid':cardid,
            'doorcard.type':guardType,
            'doorcard.code':homecode
        },
        dataType: "json",
        success: function (data) {
            var list=data.obj.data;
            showDoorCardTableList(list);
            var totalNum = data.obj.data_count;//总数
            var totalPages = Math.ceil(totalNum/pageSize);//总页数
            if(totalPages==1||totalPages==0){
                $('#entrance_cardList-paging').empty();
                $('#entrance_card_paging-tips').html("当前页面共"+totalNum+"条数据 总共"+totalNum+"条数据");
            }else{
                showDoorCardPagePlugin(list.length,totalNum,totalPages,identity,cardid,doorcardH);
            }
        }
    });
}
//门禁卡刷卡记录
function doorCardRecord(){
 $("#doorcardRecordModal").modal("show");
    CardRecord();
};
function CardRecord(page,type){
    var doorCardId = $("#cardid").val();
    doorCardId?'':doorCardId='';
    var doorcardD =  $("#doorcard-codeD").find("option:selected").val();
    var doorcardU= $("#doorcard-codeU").find("option:selected").val();
    var doorcardH = $("#doorcard-codeH").find("option:selected").val();
    var homecode;
    doorcardH==0||!doorcardH?doorcardU==0||!doorcardU?doorcardD==0||!doorcardD?homecode="":homecode=doorcardD:homecode=doorcardU:homecode=doorcardH;
    var guardType = $("#docarType .guardType").attr("optionid");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!showDoorCardRecord.action",
        data: {
            'token':permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            'doorCardId':doorCardId,
            'doorcardType':guardType,
            'homecode':homecode
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#doorcardRecordModal .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#doorcardRecordModal .pagingImplement .pageList").hide();
                $("#doorcardRecordList").html("<p>暂无数据</p>");
                $("#doorcardRecordModal .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"doorcardRecordModal",{"functions":"CardRecord(homelistPage,'paging')"});
                };
                let htmlList='';
                for(let i=0;i<obj.length;i++){
                    if(obj[i]) {
                        let adscode=obj[i].macToaddress;
                        let address;
                        if(adscode){
                            address=adsText(adscode);
                        }else{
                            address="";
                        }
                        address.indexOf("-")==0&&address.indexOf("w")==-1?address=address.substr(1,address.lenght):"";
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].cardid+'</td>';
                        htmlList+='<td>'+obj[i].mac+'</td>';
                        htmlList+='<td>'+address+'</td>';
                        htmlList+='<td>'+obj[i].unlocktime+'</td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#doorcardRecordList").html(htmlList);
                wipeNull("doorcardRecordList");
            };
        }
    });
}

function loadAddDoorCard(){
    $("#entrance_card-modal-add").find("input,textarea").val("");
    $("#indate input.time").val("00:00");
    var zoneCode = getZoneCodeByToken(permit);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        data: {
            'token':permit,
            'zonecode':zoneCode
        },
        dataType: "json",
        success: function (data) {
            var doorcarddpb = $("#doorcard-dpb");
            doorcarddpb.empty();
            //$("#allDoorcontrollerInfo").empty();
            $("#doorcard-dpbu").css("display","none");
            $("#doorcard-dpbufh").css("display","none");
            doorcarddpb.append('<option value=0>请选择</option>');
            for(var x=0;x<data.obj.length;x++){
                var codestr = data.obj[x].code;
                var newcodestr = doorcard_strToCharacter(codestr.substring(codestr.indexOf("d")+1));
                doorcarddpb.append('<option value='+codestr+'>'+newcodestr+'</option>');
            }
        }
    });
}

function changeDoorcarddpb(val){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryUnit.action",
        data: {
            'token':permit,
            'buildingcode':val
        },
        dataType: "json",
        success: function (data) {
            if(val!=0){
                var doorcarddpbu = $("#doorcard-dpbu");
                doorcarddpbu.css("display","");
                doorcarddpbu.empty();
                doorcarddpbu.append('<option value=0>请选择</option>');
                for(var x=0;x<data.obj.length;x++){
                    var codestr = data.obj[x].code;
                    var newcodestr = codestr.substring(codestr.indexOf("b")+1,codestr.indexOf("u")+1).replace("u","单元");
                    doorcarddpbu.append('<option value='+codestr+'>'+newcodestr+'</option>');
                }
            }else{
                $("#doorcard-dpbu").css("display","none");
                $("#doorcard-dpbufh").css("display","none");
            }
        }
    });
}
function changeDoorcarddpbu(val){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        data: {
            'token':permit,
            'unitcode':val
        },
        dataType: "json",
        success: function (data) {
            if(val!=0){
                var doorcarddpbufh = $("#doorcard-dpbufh");
                doorcarddpbufh.css("display","");
                doorcarddpbufh.empty();
                doorcarddpbufh.append('<option value=0>请选择</option>');
                for(var x=0;x<data.obj.length;x++){
                    var codestr = data.obj[x].code;
                    var newcodestr = doorcard_strToCharacter(codestr);
                    doorcarddpbufh.append('<option value='+codestr+'>'+newcodestr+'</option>');
                }
            }else{
                $("#doorcard-dpbufh").css("display","none");
            }

        }
    });
}
function changedoorcarddpbufh(val){
    var homecode = val.substring(0,val.indexOf("u")+1);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorAndWallContrllerByUnit.action",
        data: {
            'token':permit,
            'homecode':val
        },
        dataType: "json",
        success: function (data) {
            $("#allDoorcontrollerInfo").empty();
            var html="";
            for(var i=0;i<data.obj.length;i++){
                console.log(data.obj[i]);
                var newhomecode = doorcard_strToCharacter(data.obj[i].code.substring(7));
                html+="<li><input type='checkbox' name='checkbox' value="+data.obj[i].id+" id='e"+data.obj[i].id+"'>" +
                    "<label for='e"+data.obj[i].id+"'>"+newhomecode+"&nbsp;&nbsp;&nbsp;</label></li>";
                $("#allDoorcontrollerInfo").html(html);
            }
        }
    });
}
function changeDoorCardType(val){
    switch(val){
        case "2":
            $("#doorcard-roomid").css("display","none");
            break;
        default:
            $("#doorcard-roomid").css("display","block");
    };
}

function selectAllDoorcontroller(){
    var controlleridarraystr = "";
    $("input[name='checkbox']").each(function(){
        if($(this).is(':checked')){
            controlleridarraystr += $(this).val()+",";
            $(this).prop("checked",false);
        }else{
            $(this).prop("checked",true);
        }
    });
    controlleridarraystr = controlleridarraystr.substring(0,controlleridarraystr.lastIndexOf(","));
    return controlleridarraystr;
}

//选择所有
function choiceAllDoorCard(){
    var imgarr = $("#entrance_cardInfo-body1").find("img");
    if(selectedNum==0){
        imgarr.attr("src","img/choice.png");
        selectedNum = 9;
    }else{
        imgarr.attr("src","img/nochoice.png");
        selectedNum = 0;
    }
}

//手动添加门禁卡
function addentrance_card(){
    var controlleridarray = selectAllDoorcontroller();
    var dates=$("#indate .date").val();
    var times=$("#indate .time").val()+":00";
    var endtime="";
    if(dates){
        endtime=dates+" "+times;
    };
    var cardidarr = $("#doorcard-cardid").val();
    var identity = $("#doorcard-identity").val();
    var type = $("#doorcard-type").val();
    if(identity==""){
        msgTips("持卡人身份证不能为空");
        return;
    }
    if(cardidarr==""){
        msgTips("门禁卡号不能为空");
        return;
    }
    var opt = $("#doorcard-type").find("option:selected").val();
    if(opt!=2){
        if(controlleridarray==""){
            msgTips("房屋编号不能为空");
            return;
        }
    }
    var doorcard_code = $("#doorcard-dpbufh").val();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!addDoorcard.action",
        data: {
            'token':permit,
            'doorcard.cardid':cardidarr,
            'doorcard.identity':identity,
            'doorcard.code':doorcard_code,
            'doorcard.type':type,
            'doorcard.endtime':endtime,
            'doorcard.controlleridarray':controlleridarray
        },
        dataType: "json",
        success: function (data) {
            // msgTips(data.msg);
            // queryAllDoorCardJump();
            findDoorCardByCondition();
        }
    });
    $("#entrance_card-modal-add").modal('hide');
}

//是否选中，切换图片
function changeChoice(){
    var str = $('#doorcard-img1')[0].src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        $("#doorcard-img1").attr({ "src": "img/nochoice.png" });
    }else{
        $("#doorcard-img1").attr({ "src": "img/choice.png" });
    }
}

function doorcard_strToCharacter(str){
    return str.replace("d","街区").replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元").replace("f","层").replace("h","室");
}

//批量删除
function delDoorCard(){
    var imgarr = $("#entrance_cardInfo-body1").find("img");
    var flag = true;
    var idList = "";
    imgarr.each(function (index,item) {
        if($(imgarr[index]).attr("src")=="img/choice.png"){
            flag = false;
            idList += $(imgarr[index]).attr("id").substr(8)+",";
        }
    });
    idList = idList.substr(0,idList.lastIndexOf(","));
    sessionStorage.setItem("alldoorcardidList",idList);
    if(flag){
        msgTips("请选择要删除的门禁卡");
    }else{
        $("#del_door_card_Modal").modal();
    }
}

function delDoorCardBySingle(id){
    sessionStorage.setItem("singledoorcardid",id);
    $("#del_door_card_single_Modal").modal();
}

function confirmdeldoorcardsingle(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!delDoorcard.action",
        data: {
            'token': permit,
            'cardidList':sessionStorage.getItem("singledoorcardid")
        },
        dataType: "json",
        success: function (data) {
            $("#del_door_card_single_Modal").modal("hide");
            // queryAllDoorCardJump();
            findDoorCardByCondition();
        }
    });
}

function confirmdeldoorcard(cardidList) {
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!delDoorcard.action",
        data: {
            'token': permit,
            'cardidList':sessionStorage.getItem("alldoorcardidList")
        },
        dataType: "json",
        success: function (data) {
            $("#del_door_card_Modal").modal("hide");
            // queryAllDoorCardJump();
            findDoorCardByCondition();
        }
    });
}

function againSendCard(){
    var imgarr = $("#entrance_cardInfo-body1").find("img");
    var flag = true;
    imgarr.each(function (index,item) {
        if($(imgarr[index]).attr("src")=="img/choice.png"){
            flag = false;
        }
    });
    if(flag){
        msgTips("您还没有勾选要删除的门禁卡");
    }else{
        //显示模态框
        $('#entrance_card-modal-sendcard').modal();
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/controllerAction!queryDoorCtr.action",
            data: {
                'token': permit,
                'type':'D'
            },
            dataType: "json",
            success: function (data) {
                $("#doorcard-doorcontroller").empty();
                $("#doorcard-table3").empty();
                for(var i=0;i<data.obj.data.length;i++){
                    var doorcontrollername = doorcard_strToCharacter(data.obj.data[i].code.substring(7))+"/"+data.obj.data[i].name;
                    $("#doorcard-doorcontroller").append("<option value="+data.obj.data[i].id+">"+doorcontrollername+"</option>")
                }
            }
        });
    }
}

var doorControllerIdArray = "";
function addDoorControllerForDoorCard() {
    var doorcontroller = $("#doorcard-doorcontroller").find("option:selected").text();
    norepeatForTable(doorcontroller);
    var tr = "<tr style='margin-bottom: 1rem;'><td colspan=2 style='width: 300px;'>"+doorcontroller+"</td><td><button onclick='del(this)' class='btn btn-danger reactive_height'>删除</button></td></tr>";
    $("#doorcard-table3").append(tr);

    //获取再次发卡时select中的value值，也就是门口机的id值
    var doorcontrollerId = $("#doorcard-doorcontroller").find("option:selected").val();
    doorControllerIdArray += doorcontrollerId+",";
}

function norepeatForTable(doorcontroller){
    //去掉table中重复的元素
    $("#doorcard-table3 tr").each(function(){
        var norepeatdoorcontroller = $(this).children("td:first").text();
        if(norepeatdoorcontroller==doorcontroller){
            $(this).children("td").empty();
        }
    });
}

function del(obj) {
    var tr = this.getRowObj(obj);
    if (tr != null) {
        tr.parentNode.removeChild(tr);
    }
}
//得到行对象
function getRowObj(obj) {
    var i = 0;
    while (obj.tagName.toLowerCase() != "tr") {
        obj = obj.parentNode;
        if (obj.tagName.toLowerCase() == "table") return null;
    }
    return obj;
}

//取消发卡
function cancelSendCard(){
    $("#entrance_card-modal-sendcard").modal('hide');
}
//发卡
function sendCard(){
    var imgarr = $("#entrance_cardInfo-body1").find("img");
    var flag = true;
    imgarr.each(function (index,item) {
        if($(imgarr[index]).attr("src")=="img/choice.png"){
            flag = false;
        }
    });
    if(flag){
        msgTips("门口机不能为空，请重新选择");
    }else{
        var imgarr = $("#entrance_cardInfo-body1").find("img");
        var cardidList = "";
        imgarr.each(function (index,item) {
            if($(imgarr[index]).attr("src")=="img/choice.png"){
                cardidList += $(imgarr[index]).attr("id").substr(8)+",";
            }
        });
        cardidList = cardidList.substr(0,cardidList.lastIndexOf(","));
        doorControllerIdArray = doorControllerIdArray.substring(0,doorControllerIdArray.lastIndexOf(","));
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/doorCardAction!doorcardAgainToDoor.action",
            data: {
                'token': permit,
                'cardidList':cardidList,
                'doorControllerIdArray':doorControllerIdArray
            },
            dataType: "json",
            success: function (data) {
                $("#entrance_card-modal-sendcard").modal('hide');
                doorControllerIdArray = "";
                msgTips(data.msg);
                // queryAllDoorCardJump();
                findDoorCardByCondition();
            }
        });
    }
}

//通过token获取zoneCode//16137-45201701d-1511851675863
function getZoneCodeByToken(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.endsWith("N"))
        return code.substring(0,code.indexOf("d")+1);
}
//查看权限
function queryDoorCardAuthorityJump(doorcontrollerId){
    $('#entrance_card_tableList2').show();
    $('#doorcardMainPage').hide();

    $('#all_paging').css('display','none');
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!findDoorCardToDoor.action",
        data: {
            'token': permit,
            'doorcontrollerId':doorcontrollerId
        },
        dataType: "json",
        success: function (data) {
            var list = data.obj;
            showDoorCardAuthorityTableList(list);
        }
    });
}



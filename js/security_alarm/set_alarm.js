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
function echoEchoAlarmArea(prefixId,this_){
    //报警区域
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
    }else if(parameters=="alarmArea"){
        // 报警区域
        alarmArea();
    }else if(parameters=="alarmNumber"){
        // 物管账号
        alarmNumber();
    }else if(parameters=="alarmTime"){
        // 保存时间
        alarmTime();
    }
};
function alarmRank(page,type){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/waringAction!findWarning.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            console.log("查询用户报警");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_setAlarm_rank .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_setAlarm_rank .pagingImplement .pageList").hide();
                $("#userLogoutList").html("<p>暂无数据</p>");
                $("#tab_setAlarm_rank .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_setAlarm_rank",{"functions":"alarmRank(homelistPage,'paging')"});
                };
                let htmlList='',htmlRank='',textRank='';
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        switch (obj[i].status){
                            case 0:
                                status="严重";
                                statusCor="#ff0000";
                                textRank='<li><span class="name">防盗报警</span><span class="radiobox"><label rank="0"><input type="radio" name="rank0" checked="checked">严重</label><label rank="1"><input type="radio" name="rank0">紧急</label><label rank="2"><input type="radio" name="rank0">一般</label></span></li>';
                                break;
                            case 1:
                                status="紧急";
                                statusCor="";
                                textRank='<li><span class="name">防盗报警</span><span class="radiobox"><label rank="0"><input type="radio" name="rank1">严重</label><label rank="1"><input type="radio" name="rank1" checked="checked">紧急</label><label rank="2"><input type="radio" name="rank1">一般</label></span></li>';
                                break;
                            case 2:
                                status="一般";
                                statusCor="";
                                textRank='<li><span class="name">防盗报警</span><span class="radiobox"><label rank="0"><input type="radio" name="rank2">严重</label><label rank="1"><input type="radio" name="rank2">紧急</label><label rank="2"><input type="radio" name="rank2" checked="checked">一般</label></span></li>';
                                break;
                        };
                        htmlList+='<tr>';
                        htmlList+='<td>'+'防盗报警'+'</td>';
                        htmlList+='<td>'+'一般'+'</td>';
                        htmlList+='<td><a class="modifyBut" ids="6" type="alarmRank" name="'+name+'">修改</a></td>';
                        htmlRank+=textRank;
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td></tr>';
                    };
                };
                $("#setAlarmRankList").html(htmlList);
                wipeNull("setAlarmRankList");
                $("#setAlarmRankForm .rankbox").html(htmlRank);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function alarmArea(page,type){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/waringAction!findWarning.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            console.log("查询用户报警");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_setAlarm_rank .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_setAlarm_rank .pagingImplement .pageList").hide();
                $("#userLogoutList").html("<p>暂无数据</p>");
                $("#tab_setAlarm_rank .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_setAlarm_rank",{"functions":"alarmRank(homelistPage,'paging')"});
                };
                let htmlList='',lth=20,textRank='';
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        htmlList+='<tr>';
                        htmlList+='<td>'+'防盗报警'+'</td>';
                        if(obj[i].name.length>lth){
                            let namekTex=obj[i].name.substring(0,lth);
                            htmlList+= '<td content="'+obj[i].name+'"><span>'+namekTex+'...'+'</span><span class="blue" onclick=previewModal("报警区域备注","'+obj[i].name.replace(/(\s*)/g,'')+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+obj[i].name+'">'+obj[i].name+'</td>';
                        }
                        htmlList+='<td><a class="modifyBut" ids="6" type="alarmArea">修改</a>| <a class="deleteBut" ids="6" type="alarmArea">删除</a></td>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td></tr>';
                    };
                };
                $("#setAlarmRankList").html(htmlList);
                wipeNull("setAlarmRankList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function alarmNumber(page,type){};
function alarmTime(page,type){};
// 添加
$(".SetAlarmBut").click(function(){
    let ids=$(this).attr("ids");
    if(ids=="alarmRank"){
        // 报警级别
        $("#addSetAlarmRankModal .modal-title").text("报警级别设置");
        $("#addSetAlarmRankModal .ranktitle").show();
        $("#addSetAlarmRankModal").modal("show");
    }else if(ids=="alarmArea"){
        // 报警区域
        $("#addAlarmAreaModal .modal-title").text("添加报警区域");
        $("#addAlarmAreaModal").modal("show");
    }else if(ids=="alarmNumber"){
        // 物管账号
        $("#addAlarmNumberModal").modal("show");
    }else if(ids=="staffChoice"){
        // 添加物管账号——员工
        $("#propertyAdminModal").modal("show");
    }
});
// 修改
$("#tab_set_alarm").on("click",".modifyBut",function(){
    let this_=$(this);
    let type=this_.attr("type");
    let ids=$(this).attr("ids");
    if(type=="alarmRank"){
        // 报警级别
        $("#addSetAlarmRankModal .modal-title").text("修改报警级别");
        $("#addSetAlarmRankModal .ranktitle").hide();
        let htmlRank="";
        let name=this_.attr("name");
        switch (ids){
            case '0':
                // 严重
                htmlRank='<li><span class="name">'+name+'</span><span class="radiobox"><label rank="0"><input type="radio" name="rank0" checked="checked">严重</label><label rank="1"><input type="radio" name="rank0">紧急</label><label rank="2"><input type="radio" name="rank0">一般</label></span></li>';
                break;
            case '1':
                // 紧急
                htmlRank='<li><span class="name">'+name+'</span><span class="radiobox"><label rank="0"><input type="radio" name="rank1">严重</label><label rank="1"><input type="radio" name="rank1" checked="checked">紧急</label><label rank="2"><input type="radio" name="rank1">一般</label></span></li>';
                break;
            case '2':
                // 一般
                htmlRank='<li><span class="name">'+name+'</span><span class="radiobox"><label rank="0"><input type="radio" name="rank2">严重</label><label rank="1"><input type="radio" name="rank2">紧急</label><label rank="2"><input type="radio" name="rank2" checked="checked">一般</label></span></li>';
                break;
        };
        $("#setAlarmRankForm .rankbox").html(htmlRank);
        echoEchoAlarmRank("setAlarmRankForm",this_);
        $("#addSetAlarmRankModal").modal("show");
    }else if(type=="alarmArea"){
        // 报警区域
        echoEchoAlarmArea("AlarmAreaForm",this_);
        $("#addAlarmAreaModal .modal-title").text("修改报警区域");
        $("#AlarmAreaModalBut").attr("ids",ids);
        $("#addAlarmAreaModal").modal("show");
    }else if(type=="alarmNumber"){
        // 物管账号
        echoEchoAlarmNumber("alarmNumberForm",this_);
        $("#addAlarmNumberModal").modal("show");
    }
});
// 删除
$("#tab_set_alarm").on("click",".deleteBut",function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(type=="alarmArea"){
        // 报警区域
        let dataObj={"token":permit,"idList":ids};
        let callBack="alarmArea()";
        let ajaxURL="/ucotSmart/";
        deletePubModal(dataObj,callBack,ajaxURL);
    }else if(type=="alarmNumber"){
        // 物管账号
        let dataObj={"token":permit,"idList":ids};
        let callBack="alarmNumber()";
        let ajaxURL="/ucotSmart/";
        deletePubModal(dataObj,callBack,ajaxURL);
    }
});
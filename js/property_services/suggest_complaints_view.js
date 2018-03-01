/**
 * @author qilu
 * @function 给物业服务加载信息列表
 */
function pageSuggestServiceLoadInformationList(list,type,status,workType){
    var tasksBody = "tasks_body_"+type;
    $('#'+tasksBody).empty();
    if(list.length==0){
        $("#"+tasksBody).append('<h2>没有查询到数据</h2>');
    }else{
        //*+'<td><img src="img/nochoice.png" style="width: 1.35rem;height: 1.35rem" onclick="changeSuggestChoice('+key+','+value.id+',\''+type+'\')"></td>'*/
        $.each(list,function(key,value) {
            var suggestJson = JSON.stringify(value).replace(/\"/g,"'");
            if(status==0){//全部任务
                var suggestHtml='<tr>'+'<td>'+tasksCheckNull(value.id)+'</td>'
                    +'<td>'+tasksCheckNull(tasksType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(suggestAreaToCharacter(value.code))+'</td>'
                    +'<td>'+tasksAllSubStr(value.createtime)+'</td>'
                    +'<td>'+tasksCheckNull(value.cusName)+'</td>'
                    +'<td>'+tasksCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsAiDance(\''+tasksCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(tasksChangeStatus(value.status))+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    suggestHtml=suggestHtml+'<td class="urgencyColor">'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }
                suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksSentMode(value.sendMode))+'</td>';
                if((status=="0"&&value.status=="4")||value.status=="5"){
                    suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<span href="#" onclick="suggestSendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">派送</span>'
                        +'|<span href="#" onclick="suggestModifyTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</span>'
                        +'|<span href="#" onclick="suggestResendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</span>'
                        +'|<span href="#" onclick="suggestRejectTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</span>'
                        +'|<a href="#" onclick="suggestDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                }else{
                    suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestSendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">派送</a>'
                        +'|<a href="#" onclick="suggestModifyTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                        +'|<a href="#" onclick="suggestResendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</a>'
                        +'|<a href="#" onclick="suggestRejectTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                        +'|<a href="#" onclick="suggestDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                }
                $('#'+tasksBody).append(suggestHtml);
            }else if(status==1){//待办任务或未处理
                var suggestHtml='<tr>'+'<td>'+tasksCheckNull(value.id)+'</td>'
                    +'<td>'+tasksCheckNull(tasksType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(suggestAreaToCharacter(value.code))+'</td>'
                    +'<td>'+tasksAllSubStr(value.createtime)+'</td>'
                    +'<td>'+tasksCheckNull(value.cusName)+'</td>'
                    +'<td>'+tasksCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsAiDance(\''+tasksCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    suggestHtml=suggestHtml+'<td class="urgencyColor">'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }
                suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestSendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">派送</a>'
                    +'|<a href="#" onclick="suggestModifyTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                    +'|<a href="#" onclick="suggestRejectTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                    +'|<a href="#" onclick="suggestResendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</a>'
                    +'|<a href="#" onclick="suggestRepairsTasksJump(\''+value.id+'\',\''+type+'\','+status+')">报修</a>'
                    +'|<a href="#" onclick="suggestDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                $('#'+tasksBody).append(suggestHtml);
            }else if(status==2){//处理中
                var suggestHtml='<tr>'+'<td>'+tasksCheckNull(value.id)+'</td>'
                    +'<td>'+tasksCheckNull(tasksType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(suggestAreaToCharacter(value.code))+'</td>'
                    +'<td>'+tasksAllSubStr(value.createtime)+'</td>'
                    +'<td>'+tasksCheckNull(value.cusName)+'</td>'
                    +'<td>'+tasksCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsAiDance(\''+tasksCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    suggestHtml=suggestHtml+'<td class="urgencyColor">'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }
                suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestFinishInTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">已完成</a>'
                    +'|<a href="#" onclick="suggestNotFinishTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">未完成</a>'
                    +'|<a href="#" onclick="suggestModifyTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                    +'|<a href="#" onclick="suggestRejectTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                    +'|<a href="#" onclick="suggestResendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</a>'
                    +'|<a href="#" onclick="suggestRepairsTasksJump(\''+value.id+'\',\''+type+'\','+status+')">报修</a>'
                    +'|<a href="#" onclick="suggestDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                $('#'+tasksBody).append(suggestHtml);
            }else if(status==3){//再处理
                var suggestHtml='<tr>'+'<td>'+tasksCheckNull(value.id)+'</td>'
                    +'<td>'+tasksCheckNull(tasksType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(suggestAreaToCharacter(value.code))+'</td>'
                    +'<td>'+tasksAllSubStr(value.createtime)+'</td>'
                    +'<td>'+tasksCheckNull(value.cusName)+'</td>'
                    +'<td>'+tasksCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsAiDance(\''+tasksCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    suggestHtml=suggestHtml+'<td class="urgencyColor">'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }
                suggestHtml=suggestHtml+'<td>'+'<a href="#" onclick="suggestDetailsJump('+suggestJson+')">详情</a>'+'</td>'
                    +'<td class="suggestPrint">'+'<a href="#" onclick="suggestFinishInTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">已完成</a>'
                    +'|<a href="#" onclick="suggestNextTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">下一步</a>'
                    +'|<a href="#" onclick="suggestModifyTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                    +'|<a href="#" onclick="suggestRejectTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                    +'|<a href="#" onclick="suggestRepairsTasksJump(\''+value.id+'\',\''+type+'\','+status+')">报修</a>'
                    +'|<a href="#" onclick="suggestResendTasksJump('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">催派</a>'
                    +'|<a href="#" onclick="suggestDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                $('#'+tasksBody).append(suggestHtml);
            }else if(status==4){//已完成
                var suggestHtml = '<tr>'+'<td>'+tasksCheckNull(value.id)+'</td>'
                    +'<td>'+tasksCheckNull(tasksType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(suggestAreaToCharacter(value.code))+'</td>'
                    +'<td>'+tasksAllSubStr(value.createtime)+'</td>'
                    +'<td>'+tasksCheckNull(value.cusName)+'</td>'
                    +'<td>'+tasksCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsAiDance(\''+tasksCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    suggestHtml=suggestHtml+'<td class="urgencyColor">'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }
                suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestDetailsJump('+suggestJson+')">详情</a>'+'</td>'
                suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestVisitedRecordJumps('+suggestJson+',\''+value.id+'\',\''+type+'\','+status+')">回访详情</a>'+'</td>'+'</tr>';
                $('#'+tasksBody).append(suggestHtml);
            }else if(status==5){//已回访
                var suggestHtml ='<tr>'+'<td>'+tasksCheckNull(value.id)+'</td>'
                    +'<td>'+tasksCheckNull(tasksType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+tasksCheckNull(suggestAreaToCharacter(value.code))+'</td>'
                    +'<td>'+tasksAllSubStr(value.createtime)+'</td>'
                    +'<td>'+tasksCheckNull(value.cusName)+'</td>'
                    +'<td>'+tasksCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="tasksDetailsAiDance(\''+tasksCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    suggestHtml=suggestHtml+'<td class="urgencyColor">'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    suggestHtml=suggestHtml+'<td>'+tasksCheckNull(tasksUrgency(value.urgency))+'</td>';
                }
                suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestDetailsJump('+suggestJson+')">详情</a>'+'</td>'
                suggestHtml=suggestHtml+'<td class="suggestPrint">'+'<a href="#" onclick="suggestReturnDetailJump('+suggestJson+')">详情</a>'+'</td>'+'</tr>';
                $('#'+tasksBody).append(suggestHtml);
            }
        });
        var tds=$("#"+tasksBody+" tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#"+tasksBody).append('<tr>'+tdHtml+'</tr>');
            }
        }
    }
};

function tasksDetailsData(content,file){
    console.log(file);
    console.log(zonePicFile);
    console.log(zonePicFile+file);
    $("#tasks_details_file").empty();
    $("#tasks_detail").modal("show");
    $("#tasks_details_content").html(tasksCheckNull(content));
    if(file!=null){
        $("#tasks_details_file").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zonePicFile+file+">");
    }else{
        $("#tasks_details_file").append("");
    }
}

function tasksDetailsAiDance(aidanceName){
    $("#tasks_ai_dance").modal("show");
    $("#tasks_details_ai_dance").html(aidanceName);
}

//是否选中，切换图片
function changeSuggestChoice(value,id,type){
    var suggestChoiceType = 'tasks_body_'+type;
    var imgArray = $("#"+suggestChoiceType).find("img")[value];
    changeImgChoice(imgArray,id);
}

var tasksImgStr = "";
function changeImgChoice(imgArray,id){
    var str = imgArray.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgArray.setAttribute("src","img/nochoice.png");
        tasksImgId = 0;
        tasksImgStr = tasksImgStr.substr(0,tasksImgStr.lastIndexOf(",")-1);
    }else{
        imgArray.setAttribute("src","img/choice.png");
        tasksImgId = id;
        tasksImgStr += id+",";
    }
}

/**
 * 选择所有全部任务数据
 */
function selectTasks(type){
    var imgArray = $("#tasks_body_"+type).find("img");
    if(selectedNum==0){
        imgArray.attr("src","img/choice.png");
        selectedNum = 9;
    }else{
        imgArray.attr("src","img/nochoice.png");
        selectedNum = 0;
    }
}

/**
 * 建议投诉中删除操作
 * @param id
 */
function suggestDeleteTasksJump(id,type,status){
    sessionStorage.setItem("idList",id);
    $("#suggest_delete").modal("show");
    $(".type").attr("type",type);
    $(".status").attr("status",status);
}

/**
 * 建议投诉中批量删除
 * @param id
 */
function suggestDeleteFetchData(){
    var imgArray = $("#tasks_body_tasks").find("img");
    suggestDeleteFetchPublic(imgArray);
}

function suggestDeleteFetchToDoData(){
    var imgArray = $("#tasks_body_toDo").find("img");
    suggestDeleteFetchPublic(imgArray);
}

function suggestDeleteFetchInTasksData(){
    var imgArray = $("#tasks_body_inTasks").find("img");
    suggestDeleteFetchPublic(imgArray);
}

function suggestDeleteFetchReprocessTasksData(){
    var imgArray = $("#tasks_body_reprocessTasks").find("img");
    suggestDeleteFetchPublic(imgArray);
}

function suggestDeleteFetchPublic(imgArray){
    var flag = true;
    var idList="";
    imgArray.each(function (index,item) {
        if($(imgArray[index]).attr("src")=="img/choice.png"){
            flag = false;
            idList += $(imgArray[index]).attr("id").substr(5)+",";
        }
    });
    idList = idList.substr(0,idList.lastIndexOf(","));
    sessionStorage.setItem("idList",idList);
    if(flag){
        msgTips("请选择要删除的全部任务");
    }else{
        $("#suggest_delete").modal();
    }
}

/**
 * 建议投诉中删除功能
 */
function suggestDeleteData(idList){
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    idList = sessionStorage.getItem("idList");
    if(idList==""||idList=="null"||idList==undefined){
        msgTips("请选择相应的数据进行删除!");
        return;
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!delComplaintOld.action",
        data:{
            "token":permit,
            "idList":idList
        },
        dataType:"json",
        success:function(data){
            $("#suggest_delete").modal("hide");
            msgTips(data.msg);
            queryTasksLoadPageDataJump(1,type,status,1);
        }
    });
    sessionStorage.removeItem("idList");
}
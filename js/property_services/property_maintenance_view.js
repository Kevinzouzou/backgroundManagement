/**
 * @author qilu
 * @function 给物业服务加载信息列表
 */
function pagePropertyServiceLoadInformationList(list,type,status,workType){
    var propertyBody = "property_body_"+type;
    $('#'+propertyBody).empty();
    if(list.length==0){
        $("#"+propertyBody).append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(key,value) {
            var propertyJson = JSON.stringify(value).replace(/\"/g,"'");
            if(status==0){//全部任务
                var propertyHtml='<tr>'+'<td>'+propertyCheckNull(value.id)+'</td>'
                    +'<td>'+propertyCheckNull(propertyType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyAreaToCharacter(value.code))+'</td>'
                    +'<td>'+propertyAllSubStr(value.createtime)+'</td>'
                    +'<td>'+propertyCheckNull(value.cusName)+'</td>'
                    +'<td>'+propertyCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsAiDance(\''+propertyCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyChangeStatus(value.status))+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    propertyHtml=propertyHtml+'<td class="urgencyColor">'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }
                propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertySentMode(value.sendMode))+'</td>';
                if((status=="0"&&value.status=="4")||value.status=="5"){
                    propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<span href="#" onclick="propertySendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">派送</span>'
                        +'|<span href="#" onclick="propertyModifyTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</span>'
                        +'|<span href="#" onclick="propertyResendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</span>'
                        +'|<span href="#" onclick="propertyRejectTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</span>'
                        +'|<a href="#" onclick="propertyDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                }else{
                    propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertySendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">派送</a>'
                        +'|<a href="#" onclick="propertyModifyTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                        +'|<a href="#" onclick="propertyResendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</a>'
                        +'|<a href="#" onclick="propertyRejectTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                        +'|<a href="#" onclick="propertyDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                }
                $('#'+propertyBody).append(propertyHtml);
            }else if(status==1){//待办任务或未处理
                var propertyHtml='<tr>'+'<td>'+propertyCheckNull(value.id)+'</td>'
                    +'<td>'+propertyCheckNull(propertyType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyAreaToCharacter(value.code))+'</td>'
                    +'<td>'+propertyAllSubStr(value.createtime)+'</td>'
                    +'<td>'+propertyCheckNull(value.cusName)+'</td>'
                    +'<td>'+propertyCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsAiDance(\''+propertyCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    propertyHtml=propertyHtml+'<td class="urgencyColor">'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }
                propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertySendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">派送</a>'
                    +'|<a href="#" onclick="propertyModifyTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                    +'|<a href="#" onclick="propertyRejectTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                    +'|<a href="#" onclick="propertyResendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</a>'
                    +'|<a href="#" onclick="propertyDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                $('#'+propertyBody).append(propertyHtml);
            }else if(status==2){//处理中
                var propertyHtml='<tr>'+'<td>'+propertyCheckNull(value.id)+'</td>'
                    +'<td>'+propertyCheckNull(propertyType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyAreaToCharacter(value.code))+'</td>'
                    +'<td>'+propertyAllSubStr(value.createtime)+'</td>'
                    +'<td>'+propertyCheckNull(value.cusName)+'</td>'
                    +'<td>'+propertyCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsAiDance(\''+propertyCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    propertyHtml=propertyHtml+'<td class="urgencyColor">'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }
                propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertyFinishInTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">已完成</a>'
                    +'|<a href="#" onclick="propertyNotFinishTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">未完成</a>'
                    +'|<a href="#" onclick="propertyModifyTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                    +'|<a href="#" onclick="propertyRejectTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                    +'|<a href="#" onclick="propertyResendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">重派</a>'
                    +'|<a href="#" onclick="propertyDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                $('#'+propertyBody).append(propertyHtml);
            }else if(status==3){//再处理
                var propertyHtml='<tr>'+'<td>'+propertyCheckNull(value.id)+'</td>'
                    +'<td>'+propertyCheckNull(propertyType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyAreaToCharacter(value.code))+'</td>'
                    +'<td>'+propertyAllSubStr(value.createtime)+'</td>'
                    +'<td>'+propertyCheckNull(value.cusName)+'</td>'
                    +'<td>'+propertyCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsAiDance(\''+propertyCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    propertyHtml=propertyHtml+'<td class="urgencyColor">'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }
                propertyHtml=propertyHtml+'<td>'+'<a href="#" onclick="suggestDetailsJump(\''+value.id+'\',\''+value.mark+'\',\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td class="propertyPrint">'+'<a href="#" onclick="propertyFinishInTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">已完成</a>'
                    +'|<a href="#" onclick="propertyNextTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">下一步</a>'
                    +'|<a href="#" onclick="propertyModifyTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">修改</a>'
                    +'|<a href="#" onclick="propertyRejectTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">拒单</a>'
                    +'|<a href="#" onclick="propertyResendTasksJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">催派</a>'
                    +'|<a href="#" onclick="propertyDeleteTasksJump(\''+value.id+'\',\''+type+'\','+status+')">删除</a>'+'</td>'+'</tr>';
                $('#'+propertyBody).append(propertyHtml);
            }else if(status==4){//已完成
                var propertyHtml = '<tr>'+'<td>'+propertyCheckNull(value.id)+'</td>'
                    +'<td>'+propertyCheckNull(propertyType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyAreaToCharacter(value.code))+'</td>'
                    +'<td>'+propertyAllSubStr(value.createtime)+'</td>'
                    +'<td>'+propertyCheckNull(value.cusName)+'</td>'
                    +'<td>'+propertyCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsAiDance(\''+propertyCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    propertyHtml=propertyHtml+'<td class="urgencyColor">'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }
                propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertyDetailsJump('+propertyJson+')">详情</a>'+'</td>'
                propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertyVisitedRecordJump('+propertyJson+',\''+value.id+'\',\''+type+'\','+status+')">回访详情</a>'+'</td>'+'</tr>';
                $('#'+propertyBody).append(propertyHtml);
            }else if(status==5){//已回访
                var propertyHtml ='<tr>'+'<td>'+propertyCheckNull(value.id)+'</td>'
                    +'<td>'+propertyCheckNull(propertyType(value.type))+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsData(\''+value.content+'\',\''+value.file+'\')">详情</a>'+'</td>'
                    +'<td>'+propertyCheckNull(propertyAreaToCharacter(value.code))+'</td>'
                    +'<td>'+propertyAllSubStr(value.createtime)+'</td>'
                    +'<td>'+propertyCheckNull(value.cusName)+'</td>'
                    +'<td>'+propertyCheckNull(value.followName)+'</td>'
                    +'<td>'+'<a href="#" onclick="propertyDetailsAiDance(\''+propertyCheckNull(value.aidanceName)+'\')">详情</a>'+'</td>';
                if(value.urgency=="1"||value.urgency=="2"){
                    propertyHtml=propertyHtml+'<td class="urgencyColor">'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }else if(value.urgency=="3"){
                    propertyHtml=propertyHtml+'<td>'+propertyCheckNull(propertyUrgency(value.urgency))+'</td>';
                }
                propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertyDetailsJump('+propertyJson+')">详情</a>'+'</td>'
                propertyHtml=propertyHtml+'<td class="propertyPrint">'+'<a href="#" onclick="propertyReturnDetailJump('+propertyJson+')">详情</a>'+'</td>'+'</tr>';
                $('#'+propertyBody).append(propertyHtml);
            }
        });
        var tds=$("#"+propertyBody+" tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#"+propertyBody).append('<tr>'+tdHtml+'</tr>');
            }
        }
    }
};

function propertyDetailsData(content,file){
    $("#tasks_property_details_file").empty();
    $("#tasks_property_detail").modal("show");
    $("#tasks_property_details_content").html(content);
    if(file!=null){
        $("#tasks_property_details_file").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zonePicFile+file+">");
    }else{
        $("#tasks_property_details_file").append("");
    }
}

function propertyDetailsAiDance(aidanceName){
    $("#tasks_property_ai_dance").modal("show");
    $("#tasks_property_details_ai_dance").html(aidanceName);
}

//是否选中，切换图片
function changePropertyTasksChoice(value,id,type){
    var propertyBody = 'property_body_'+type;
    var imgArray = $("#"+propertyBody).find("img")[value];
    changeImgChoice(imgArray,id);
}

var propertyImgStr = "";
function changeImgChoice(imgArray,id){
    var str = imgArray.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgArray.setAttribute("src","img/nochoice.png");
        propertyImgId = 0;
        propertyImgStr = propertyImgStr.substr(0,tasksImgStr.lastIndexOf(",")-1);
    }else{
        imgArray.setAttribute("src","img/choice.png");
        propertyImgId = id;
        propertyImgStr += id+",";
    }
}

/**
 * 选择所有全部任务数据
 */
function selectMaintenance(type){
    var imgArray = $("#property_body_"+type).find("img");
    if(selectedNum==0){
        imgArray.attr("src","img/choice.png");
        selectedNum = 9;
    }else{
        imgArray.attr("src","img/nochoice.png");
        selectedNum = 0;
    }
}


//对状态进行转化
function propertyChangeStatus(type){
    if(type=="1"){
        var propertyStatus="未处理";
    }else if(type=="2"){
        var propertyStatus="处理中";
    }else if(type=="3"){
        var propertyStatus="再处理";
    }else if(type=="4"){
        var propertyStatus="已完成";
    }else if(type=="5"){
        var propertyStatus="已回访";
    }else if(type=="6"){
        var propertyStatus="未完成";
    }else if(type=="7"){
        var propertyStatus="拒单";
    }
    return propertyStatus;
}
/**
 * Created by asus on 2017/9/28.
 */
var pageSize = 10;
var propertyAddType = "";
$("body").on("click",".dropdown-menu a",function(){
    var dropdownId=$(this).parents(".dropdown").attr("ids");
    var prefixId=$(this).parents(".menuBox").attr("id");
    var type=$(this).parents(".menuBox").attr("type");
    var optionId=$(this).attr("codelist");
    var modename=$(this).attr("modename");
    if(optionId){
        $(this).parents(".dropdown").attr("optionId",optionId);
    }else{
        $(this).parents(".dropdown").attr("optionId","");
    };
    //列表选中样式
    $("#"+prefixId+" ."+dropdownId+" a.dropdown-toggle span").addClass("option_type");
    $("#"+prefixId+" ."+dropdownId).attr("modename",modename);
    $("#"+prefixId+" ."+dropdownId+" a.dropdown-toggle span").text(modename);
    if(dropdownId=="propertyChargingAds"){
        propertyUnit(optionId);
    }else if(dropdownId=="propertyUnitAds"){
        propertyDoorplate(optionId);
    }else if(dropdownId=="property_type"){
        propertyAddType = optionId;
        if(optionId=="4"){
            $("#property_cusName,#property_cusPhone").attr("disabled",true);
        }else if(optionId=="5"||optionId=="6"){
            $("#property_cusName,#property_cusPhone").attr("disabled",false).val("");
        }
    }else if(dropdownId=="propertyDoorplateAds"){
        propertyCode(optionId);
    }else if(dropdownId=="property_FollowDm"){
        propertyAddEmp1(optionId);
    }else if(dropdownId=="property_aiDanceDm"){
        propertyAddEmp2(optionId);
    }else if(dropdownId=="property_dm_follow_resend"){
        propertyResendEmp1(optionId);
    }else if(dropdownId=="property_dm_aiDance_resend"){
        propertyResendEmp2(optionId);
    }else if(dropdownId=="property_dm_follow_reject"){
        propertyUpdateRejectEmp(optionId);
    }else if(dropdownId=="property_dm_follow_send"){
        propertySendEmp1(optionId);
    }else if(dropdownId=="property_dm_aiDance_send"){
        propertySendEmp2(optionId);
    }else if(dropdownId=="property_dm_follow_finish"){
        propertyFinishEmp1(optionId);
    }else if(dropdownId=="property_dm_aiDance_finish"){
        propertyFinishEmp2(optionId);
    }else if(dropdownId=="property_dm_follow_send_finish"){
        propertySendFinishEmp1(optionId);
    }else if(dropdownId=="property_dm_aiDance_send_finish"){
        propertySendFinishEmp2(optionId);
    }else if(dropdownId=="property_dm_follow_next"){
        propertyNextEmp1(optionId);
    }else if(dropdownId=="property_dm_aiDance_next"){
        propertyNextEmp2(optionId);
    }

});

$('.property_services,.property_maintenance').click(function(){
    propertyMaintenanceInitialize("tasks");
});

function propertyMaintenanceInitialize(type){
    if(type=="tasks"){
        queryMaintenanceLoadPageDataJump(1,"tasks",0,2);
    }else if(type=="toDo"){
        queryMaintenanceLoadPageDataJump(1,"toDo",1,2);
    }else if(type=="inTasks"){
        queryMaintenanceLoadPageDataJump(1,"inTasks",2,2);
    }else if(type=="reprocessTasks"){
        queryMaintenanceLoadPageDataJump(1,"reprocessTasks",3,2);
    }else if(type=="notTasks"){
        queryMaintenanceLoadPageDataJump(1,"notTasks",4,2);
    }else if(type=="return"){
        queryMaintenanceLoadPageDataJump(1,"return",5,2);
    }
}

/**
 * 加载任务数据分页
 * @param page 当前页
 * @param type 类型
 */
function queryMaintenanceLoadPageDataJump(page,type,status,workType){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintOld.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":page,
            "pager.pagesize":pageSize,
            "c.type":type,
            "c.workorderType":workType,
            "c.status":status,
            "c.starttime":"",
            "c.endtime":""
        },
        success: function (data) {
            $("#property_body_"+type).empty();
            if(data.obj.data==null){
                $("#property_body_"+type).append('<h2>没有查询到数据</h2>');
            }else{
                var list = eval(data.obj.data);
                pagePropertyServiceLoadInformationList(list,type,status,workType);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum/pageSize);//总页数
                $('#property_paging_'+type).empty();
                $('#property_tips_'+type).html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                if(pageNum==1||pageNum==0){

                }else{
                    queryMaintenanceListByPage(list.length, totalNum,pageNum,type,status,"","",workType);
                }
            }
        }
    });
}

/**
 * 条件查询
 */
function propertySearch(type,status){
    var propertyType = $("#property_type_"+type+" .property_type_"+type).attr("optionid");
    var startTime = $("input.property_start_time").val();
    var endTime = $("input.property_end_time").val();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintOld.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":1,
            "pager.pagesize":10,
            "c.type":propertyType,
            "c.workorderType":2,
            "c.status":status,
            "starttime":startTime,
            "endtime":endTime
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pagePropertyServiceLoadInformationList(list,type,status,2);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#property_paging_'+type).empty();
            $('#property_tips_'+type).html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryMaintenanceListByPage(list.length, totalNum,pageNum,type,status,startTime,endTime,2);
            }
        }
    });
}

/*
 *给任务分页插件绑定ajax请求，根据页码任务数据
 */
function queryMaintenanceListByPage(pageNum,totalNum,totalPages,type,status,startTime,endTime,workType){
    var pageMaintenance = 0;
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    var propertyPaging = "property_paging_"+type;
    var propertyPaginationName = "pagination-ll-property-"+type;
    $('#'+propertyPaging).empty();
    $('#'+propertyPaging).append('<ul id="'+propertyPaginationName+'" class="pagination-sm"></ul>');
    var propertyPage;
    $('#'+propertyPaginationName).twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            propertyPage=page;
            if(pageMaintenance==0){
                pageMaintenance++;
            }else{
                $.ajax({
                    type: "post",
                    url: zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintOld.action",
                    dataType: "json",
                    data: {
                        "token": permit,
                        "pager.pages":propertyPage,
                        "pager.pagesize":pageSize,
                        "c.type":type,
                        "c.workorderType":workType,
                        "c.status":status,
                        "c.starttime":startTime,
                        "c.endtime":endTime
                    },
                    success: function (data) {
                        var list=eval(data.obj.data);
                        pagePropertyServiceLoadInformationList(list,type,status,workType);
                        $('#property_tips_'+type).empty();
                        $('#property_tips_'+type).html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                    }
                });
            }
        }
    });
}

function toDoDetailsStatus(page,type){

}

/**
 * 导出任务数据
 */
function maintenanceExportData(status,workorderType){
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+"/ucotSmart/complaintOldAction!exportComplaintOld.action?token="+permit+"&status="+status+"&workorderType="+workorderType);
    var input = $('<input>');
    input.attr('type', 'hidden');
    $('body').append(form);
    form.append(input);
    form.submit();
    form.remove();
}

function maintenancePrintData(type){
    $("#property_list_"+type+" .propertyPrint").hide();
    $("#property_list_"+type).jqprint();
    $("#property_list_"+type+" .propertyPrint").show();
}

/**
 * 建议投诉中删除操作
 * @param id
 */
function propertyDeleteTasksJump(id,type,status){
    sessionStorage.setItem("idList",id);
    $("#property_delete").modal("show");
    $(".divType").attr("type",type);
    $(".divStatus").attr("status",status);
}

/**
 * 建议投诉中批量删除
 * @param type
 * @param id
 */
function maintenanceDeleteFetchData(id){
    var imgArray = $("#property_body_tasks").find("img");
    maintenanceDeleteFetchPublic(id,imgArray);
}

function maintenanceDeleteFetchToDoData(id){
    var imgArray = $("#property_body_toDo").find("img");
    maintenanceDeleteFetchPublic(id,imgArray);
}

function maintenanceDeleteFetchInTasksData(id){
    var imgArray = $("#property_body_inTasks").find("img");
    maintenanceDeleteFetchPublic(id,imgArray);
}

function maintenanceDeleteFetchReprocessTasksData(id){
    var imgArray = $("#property_body_reprocessTasks").find("img");
    maintenanceDeleteFetchPublic(id,imgArray);
}

function maintenanceDeleteFetchPublic(id,imgArray){
    var flag = true;
    sessionStorage.setItem("id",id);
    var idList="";
    imgArray.each(function (index,item) {
        if($(imgArray[index]).attr("src")=="img/choice.png"){
            flag = false;
            idList += $(imgArray[index]).attr("id").substr(8)+",";
        }
    });
    idList = idList.substr(0,idList.lastIndexOf(","));
    sessionStorage.setItem("idList",idList);
    if(flag){
        msgTips("请选择要删除的全部任务");
    }else{
        $("#property_delete").modal();
    }
}

/**
 * 建议投诉中删除功能
 * @param idList
 */
function propertyDeleteData(idList){
    var type = $(".divType").attr("type");
    var status = $(".divStatus").attr("status");
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
            $("#property_delete").modal("hide");
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        }
    });
}

/**
 * 完成详情
 * @param propertyJson
 */
function propertyDetailsJump(propertyJson){
    $("#details_finish_property_file").empty();
    $("#property_detail").modal("show");
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintHistoryById.action?token="+permit+"&id="+propertyJson.id,
        dataType:"json",
        success:function(data){
            var followDm = data.obj.fdmName;
            var followP = data.obj.followName;
            var aiDanceDm = data.obj.admName;
            var aiDanceP = data.obj.aidanceName;
            var manualCharge = data.obj.manualCharge;
            var materialsCharge = data.obj.materialsCharge;
            $("#details_finish_property_follow_dm").html(followDm);
            $("#details_finish_property_follow_p").html(followP);
            $("#details_finish_property_ai_dance_dm").html(aiDanceDm);
            $("#details_finish_property_ai_dance_p").html(aiDanceP);
            $("#details_finish_property_manual_charge").html(manualCharge);
            $("#details_finish_property_materials_charge").html(materialsCharge);
            $("#details_finish_property_content").html(propertyJson.content);
            $("#details_finish_property_file").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zoneServerIp+"/ucotSmart"+propertyJson.file+">");
            $("#details_finish_property_mark").html(propertyJson.mark);
        }
    });
}

/**
 * 回访记录
 * @param id
 */
function propertyVisitedRecordJump(propertyJson,id,type,status){
    $("#property_visited_record").modal("show");
    $(".updateId").attr("id",id);
    $("#property_dm_follow_send_finish .property_dm_follow_send_finish").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#property_p_follow_send_finish .property_p_follow_send_finish").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#property_dm_aiDance_send_finish .property_dm_aiDance_send_finish").attr({"optionid":propertyJson.aidanceDm,"modename":propertyJson.admName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.admName));
    $("#property_p_aiDance_send_finish .property_p_aiDance_send_finish").attr({"optionid":propertyJson.aidanceP,"modename":propertyJson.aidanceName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.aidanceName));
    $(".type").attr("type",type);
    $(".status").attr("status",status);
}

function propertySendFinishDept1(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_follow_send_finish .property_dm_follow_send_finish .option_type").attr("optionId","");
            var deptDm = $("#property_dm_follow_send_finish .property_dm_follow_send_finish .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_follow_send_finish .property_p_follow_send_finish .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_follow_send_finish .property_dm_follow_send_finish .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertySendFinishEmp1(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_follow_send_finish .property_p_follow_send_finish .option_type").attr("optionId","");
            var empP = $("#property_p_follow_send_finish .property_p_follow_send_finish .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_follow_send_finish .property_p_follow_send_finish .followPZoneList-menu li:first-child").remove();
        }
    });
}

function propertySendFinishDept2(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_aiDance_send_finish .property_dm_aiDance_send_finish .option_type").attr("optionId","");
            var deptDm = $("#property_dm_aiDance_send_finish .property_dm_aiDance_send_finish .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_aiDance_send_finish .property_p_aiDance_send_finish .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_aiDance_send_finish .property_dm_aiDance_send_finish .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertySendFinishEmp2(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_aiDance_send_finish .property_p_aiDance_send_finish .option_type").attr("optionId","");
            var empP = $("#property_p_aiDance_send_finish .property_p_aiDance_send_finish .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_aiDance_send_finish .property_p_aiDance_send_finish .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

function propertyCompletedSend(){
    $("#property_visited_send").modal("show");
    propertySendFinishDept1();
    propertySendFinishDept2();
}

function propertyResendFinish(){
    var id = $(".updateId").attr("id");
    var followDm = $("#property_dm_follow_send_finish .property_dm_follow_send_finish").attr("optionid");
    var followP = $("#property_p_follow_send_finish .property_p_follow_send_finish").attr("optionid");
    var aiDanceDm = $("#property_dm_aiDance_send_finish .property_dm_aiDance_send_finish").attr("optionid");
    var aiDanceP = $("#property_p_aiDance_send_finish .property_p_aiDance_send_finish").attr("optionid");
    var content = $("#tasks_completed_property_send_content").val();
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&status=2"+"&operate="+"派送",
        data:{
            "c.followDm":followDm,
            "c.followP":followP,
            "c.aidanceDm":aiDanceDm,
            "c.aidanceP":aiDanceP,
            "c.content":content
        },
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,"notTasks",4,2);
        }
    });
}

function propertyVisitedRecord(){
    var formData = new FormData($("#propertyRecordFormId")[0]);
    var id = $(".updateId").attr("id");
    var createTime = $("#property_record_createTime").val();
    var content = $("#property_record_content").val();
    var satisfaction = $("input[type='radio']:checked").val();
    console.log(satisfaction);
    formData.append("c.satisfaction",satisfaction);
    console.log(formData);
    if(createTime==""||createTime==null){
        msgTips("请输入处理时间的值,不能为空!");
        return;
    }else if(content==""||content==null){
        msgTips("请输入处理详情的值,不能为空!");
        return;
    }else{
        $.ajax({
            type:"post",
            data:formData,
            url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&status=5"+"&operate="+"回访",
            async:false,
            cache:false,
            processData:false,
            contentType:false,
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryMaintenanceLoadPageDataJump(1,'notTasks',4,2);
            }
        });
    }
}

/**
 * 回访详情
 * @param propertyJson
 */
function propertyReturnDetailJump(propertyJson){
    console.log(propertyJson);
    $("#return_details_property_file").empty();
    $("#property_return_done_detail").modal("show");
    $("#return_details_property_createTime").html(propertyJson.createtime);
    $("#return_details_property_content").html(propertyJson.content);
    if(propertyJson.file!=null){
        $("#return_details_property_file").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zonePicFile+propertyJson.file+">");
    }
    if(propertyJson.satisfaction=="1"){
        $("#property_details_satisfaction").html('<label class="star1" style="vertical-align: bottom;" id="return_details_property_satisfaction"></label>');
    }else if(propertyJson.satisfaction=="2"){
        $("#property_details_satisfaction").html('<label class="star2" style="vertical-align: bottom;" id="return_details_property_satisfaction"></label>');
    }else if(propertyJson.satisfaction=="3"){
        $("#property_details_satisfaction").html('<label class="star3" style="vertical-align: bottom;" id="return_details_property_satisfaction"></label>');
    }else if(propertyJson.satisfaction=="4"){
        $("#property_details_satisfaction").html('<label class="star4" style="vertical-align: bottom;" id="return_details_property_satisfaction"></label>');
    }else if(propertyJson.satisfaction=="5"){
        $("#return_details_property_satisfaction").html();
    }

}

/**下一步派送************************************************************部门*/
function propertyNextDept1(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_follow_next .property_dm_follow_next .option_type").attr("optionId","");
            var deptDm = $("#property_dm_follow_next .property_dm_follow_next .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_follow_next .property_p_follow_next .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_follow_next .property_dm_follow_next .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertyNextEmp1(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_follow_next .property_p_follow_next .option_type").attr("optionId","");
            var empP = $("#property_p_follow_next .property_p_follow_next .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_follow_next .property_p_follow_next .followPZoneList-menu li:first-child").remove();
        }
    });
}

function propertyNextDept2(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_aiDance_next .property_dm_aiDance_next .option_type").attr("optionId","");
            var deptDm = $("#property_dm_aiDance_next .property_dm_aiDance_next .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_aiDance_next .property_p_aiDance_next .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_aiDance_next .property_dm_aiDance_next .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertyNextEmp2(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_aiDance_next .property_p_aiDance_next .option_type").attr("optionId","");
            var empP = $("#property_p_aiDance_next .property_p_aiDance_next .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_aiDance_next .property_p_aiDance_next .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 *建议投诉中派送操作
 */
function propertyNextTasksJump(propertyJson,id,type,status){
    $("#property_next").modal("show");
    $("#property_dm_follow_next .property_dm_follow_next").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#property_p_follow_next .property_p_follow_next").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#property_dm_aiDance_next .property_dm_aiDance_next").attr({"optionid":propertyJson.aidanceDm,"modename":propertyJson.admName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.admName));
    $("#property_p_aiDance_next .property_p_aiDance_next").attr({"optionid":propertyJson.aidanceP,"modename":propertyJson.aidanceName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.aidanceName));
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    propertyNextDept1();
    propertyNextDept2();
}

function propertyNextTasks(){
    var id = $(".updateId").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var followDm = $("#property_dm_follow_next .property_dm_follow_next").attr("optionid");
    var followP = $("#property_p_follow_next .property_p_follow_next").attr("optionid");
    var aiDanceDm = $("#property_dm_aiDance_next .property_dm_aiDance_next").attr("optionid");
    var aiDanceP = $("#property_p_aiDance_next .property_p_aiDance_next").attr("optionid");
    var content = $("#next_property_content").val();
    var mark = $("#next_property_mark").val();
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&status=3"+"&operate="+"下一步",
        data:{
            "c.followDm":followDm,
            "c.followP":followP,
            "c.aidanceDm":aiDanceDm,
            "c.aidanceP":aiDanceP,
            "c.content":content,
            "c.mark":mark
        },
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        }
    });
}

/**派送************************************************************部门*/
function propertySendDept1(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_follow_send .property_dm_follow_send .option_type").attr("optionId","");
            var deptDm = $("#property_dm_follow_send .property_dm_follow_send .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_follow_send .property_p_follow_send .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_follow_send .property_dm_follow_send .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertySendEmp1(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_follow_send .property_p_follow_send .option_type").attr("optionId","");
            var empP = $("#property_p_follow_send .property_p_follow_send .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_follow_send .property_p_follow_send .followPZoneList-menu li:first-child").remove();
        }
    });
}

function propertySendDept2(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_aiDance_send .property_dm_aiDance_send .option_type").attr("optionId","");
            var deptDm = $("#property_dm_aiDance_send .property_dm_aiDance_send .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_aiDance_send .property_p_aiDance_send .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_aiDance_send .property_dm_aiDance_send .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertySendEmp2(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_aiDance_send .property_p_aiDance_send .option_type").attr("optionId","");
            var empP = $("#property_p_aiDance_send .property_p_aiDance_send .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_aiDance_send .property_p_aiDance_send .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 *建议投诉中派送操作
 */
function propertySendTasksJump(propertyJson,id,type,status){
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $("#property_dm_follow_send .property_dm_follow_send").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#property_p_follow_send .property_p_follow_send").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#property_dm_aiDance_send .property_dm_aiDance_send").attr({"optionid":propertyJson.aidanceDm,"modename":propertyJson.admName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.admName));
    $("#property_p_aiDance_send .property_p_aiDance_send").attr({"optionid":propertyJson.aidanceP,"modename":propertyJson.aidanceName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.aidanceName));
    if(propertyJson.followP==null||propertyJson.followP=="null"||propertyJson.followP==""){
        $("#property_send").modal("show");
    }else{
        var id = $(".updateId").attr("id");
        var type = $(".type").attr("type");
        var status = $(".status").attr("status");
        var followDm = $("#property_dm_follow_send .property_dm_follow_send").attr("optionid");
        var followP = $("#property_p_follow_send .property_p_follow_send").attr("optionid");
        var aiDanceDm = $("#property_dm_aiDance_send .property_dm_aiDance_send").attr("optionid");
        var aiDanceP = $("#property_p_aiDance_send .property_p_aiDance_send").attr("optionid");
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&status=2"+"&operate="+"派送",
            data:{
                "c.followDm":followDm,
                "c.followP":followP,
                "c.aidanceDm":aiDanceDm,
                "c.aidanceP":aiDanceP
            },
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryMaintenanceLoadPageDataJump(1,type,status,2);
            }
        });
    }
    propertySendDept1();
    propertySendDept2();
}

function propertyTasksResend(){
    var id = $(".updateId").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var followDm = $("#property_dm_follow_send .property_dm_follow_send").attr("optionid");
    var followP = $("#property_p_follow_send .property_p_follow_send").attr("optionid");
    var aiDanceDm = $("#property_dm_aiDance_send .property_dm_aiDance_send").attr("optionid");
    var aiDanceP = $("#property_p_aiDance_send .property_p_aiDance_send").attr("optionid");
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&status=2"+"&operate="+"派送",
        data:{
            "c.followDm":followDm,
            "c.followP":followP,
            "c.aidanceDm":aiDanceDm,
            "c.aidanceP":aiDanceP
        },
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        }
    });
}

/**
 * 建议投诉中修改操作
 */
function propertyModifyTasksJump(propertyJson,id,type,status){
    $("#property_modify").modal("show");
    var propertyUpdateStatus = "";
    if(propertyJson.status=="1"){
        propertyUpdateStatus = "未处理";
    }else if(propertyJson.status=="2"){
        propertyUpdateStatus = "处理中";
    }else if(propertyJson.status=="3"){
        propertyUpdateStatus = "再处理";
    }else if(propertyJson.status=="4"){
        propertyUpdateStatus = "已完成";
    }else if(propertyJson.status=="5"){
        propertyUpdateStatus = "已回访";
    }
    var ropertyUpdateUrgency = "";
    if(propertyJson.urgency=="1"){
        ropertyUpdateUrgency = "非常严重";
    }else if(propertyJson.urgency=="2"){
        ropertyUpdateUrgency = "严重";
    }else if(propertyJson.urgency=="3"){
        ropertyUpdateUrgency = "一般";
    }
    $("#property_update_status .property_update_status").attr({"optionid":propertyJson.status,"modename":propertyUpdateStatus}).find("a.dropdown-toggle span").text(propertyUpdateStatus);
    $("#property_update_urgency .property_update_urgency").attr({"optionid":propertyJson.urgency,"modename":ropertyUpdateUrgency}).find("a.dropdown-toggle span").text(ropertyUpdateUrgency);
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $(".ordernum").attr("ordernum",propertyJson.ordernum);
}

function propertyModify(){
    var id = $(".updateId").attr("id");
    var updateType = $(".type").attr("type");
    var updateStatus = $(".status").attr("status");
    var ordernum = $(".ordernum").attr("ordernum");
    var status = $("#property_update_status .property_update_status").attr("optionid");
    var urgency = $("#property_update_urgency .property_update_urgency").attr("optionid");
    $.ajax({
        type:"post",
        data:{
            "c.status":status,
            "c.urgency":urgency,
            "c.ordernum":ordernum
        },
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&operate="+"修改",
        dataType:"json",
        success:function(data){
            msgTips(data.success);
            queryMaintenanceLoadPageDataJump(1,updateType,updateStatus,2);
        }
    });
}

/**
 * 建议投诉中未完成操作
 * @param id
 * @param status
 */
function propertyNotFinishTasksJump(propertyJson,id,type,status){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=3"+"&c.id="+id+"&operate="+"未完成",
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        }
    });
}

/**完成************************************************************部门*/
function propertyFinishDept1(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_follow_finish .property_dm_follow_finish .option_type").attr("optionId","");
            var deptDm = $("#property_dm_follow_finish .property_dm_follow_finish .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_follow_finish .property_p_follow_finish .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_follow_finish .property_dm_follow_finish .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertyFinishEmp1(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_follow_finish .property_p_follow_finish .option_type").attr("optionId","");
            var empP = $("#property_p_follow_finish .property_p_follow_finish .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_follow_finish .property_p_follow_finish .followPZoneList-menu li:first-child").remove();
        }
    });
}

function propertyFinishDept2(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_aiDance_finish .property_dm_aiDance_finish .option_type").attr("optionId","");
            var deptDm = $("#property_dm_aiDance_finish .property_dm_aiDance_finish .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_aiDance_finish .property_p_aiDance_finish .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_aiDance_finish .property_dm_aiDance_finish .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertyFinishEmp2(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_aiDance_finish .property_p_aiDance_finish .option_type").attr("optionId","");
            var empP = $("#property_p_aiDance_finish .property_p_aiDance_finish .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_aiDance_finish .property_p_aiDance_finish .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 * 建议投诉中的任务完成操作
 * @param propertyJson
 * @param id
 * @param type
 * @param status
 */
function propertyFinishInTasksJump(propertyJson,id,type,status){
    console.log(propertyJson);
    $("#property_finish_detail").modal("show");
    $(".updateId").attr("id",id);
    $("#property_dm_follow_finish .property_dm_follow_finish").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#property_p_follow_finish .property_p_follow_finish").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#property_dm_aiDance_finish .property_dm_aiDance_finish").attr({"optionid":propertyJson.aidanceDm,"modename":propertyJson.admName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.admName));
    $("#property_p_aiDance_finish .property_p_aiDance_finish").attr({"optionid":propertyJson.aidanceP,"modename":propertyJson.aidanceName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.aidanceName));
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $(".code").attr("code",propertyJson.code);
    $(".cusName").attr("cusName",propertyJson.cusName);
    $(".cusPhone").attr("cusPhone",propertyJson.cusPhone);
    propertyFinishDept1();
    propertyFinishDept2();
}

function propertyFinishInTasks(){
    var id = $(".updateId").attr("id");
    var followDm = $("#property_dm_follow_finish .property_dm_follow_finish").attr("optionid");
    var followP = $("#property_p_follow_finish .property_p_follow_finish").attr("optionid");
    var aiDanceDm = $("#property_dm_aiDance_finish .property_dm_aiDance_finish").attr("optionid");
    var aiDanceP = $("#property_p_aiDance_finish .property_p_aiDance_finish").attr("optionid");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var code = $(".code").attr("code");
    var cusName = $(".cusName").attr("cusName");
    var cusPhone = $(".cusPhone").attr("cusPhone");
    var content = $("#property_tasks_content_details").val();
    var upFile = $("#property_defined_attachCompletedInTasks").val();
    var manualCharge = $("#property_tasks_manual_charge").val();
    var materialsCharge = $("#property_tasks_materials_charge").val();
    var mark = $("#property_tasks_remark_details").val();
    //完成 itemprice; //材料费用:2200;人工费用：500
    var itemprice = '';
    itemprice+="材料费用:"+manualCharge+";"+"人工费用:"+materialsCharge;
    var formData = new FormData();
    formData.append("c.followDm",followDm);
    formData.append("c.followP",followP);
    formData.append("c.aidanceDm",aiDanceDm);
    formData.append("c.aidanceP",aiDanceP);
    formData.append("itemprice",itemprice);
    formData.append("c.content",content);
    formData.append("upFile",$("#property_file_attachCompletedInTasks")[0].files[0]);
    formData.append("c.code",code);
    formData.append("c.mark",mark);
    formData.append("c.workorderType",2);
    formData.append("c.cusName",cusName);
    formData.append("c.cusPhone",cusPhone);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=4"+"&c.id="+id+"&operate="+"完成",
        data:formData,
        async:false,
        cache:false,
        contentType:false,
        processData:false,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        }
    });
}

/**
 * 建议投诉中再处理中的任务完成操作
 * @param id
 * @param status
 */
function propertyFinishReprocessTasksJump(id,status){
    $("#tasks_done_detail").modal("show");
}

/**重派************************************************************部门*/
function propertyResendDept1(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_follow_resend .property_dm_follow_resend .option_type").attr("optionId","");
            var deptDm = $("#property_dm_follow_resend .property_dm_follow_resend .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_follow_resend .property_p_follow_resend .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_follow_resend .property_dm_follow_resend .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertyResendEmp1(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_follow_resend .property_p_follow_resend .option_type").attr("optionId","");
            var empP = $("#property_p_follow_resend .property_p_follow_resend .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_follow_resend .property_p_follow_resend .followPZoneList-menu li:first-child").remove();
        }
    });
}

function propertyResendDept2(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_aiDance_resend .property_dm_aiDance_resend .option_type").attr("optionId","");
            var deptDm = $("#property_dm_aiDance_resend .property_dm_aiDance_resend .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_aiDance_resend .property_p_aiDance_resend .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_aiDance_resend .property_dm_aiDance_resend .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function propertyResendEmp2(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_aiDance_resend .property_p_aiDance_resend .option_type").attr("optionId","");
            var empP = $("#property_p_aiDance_resend .property_p_aiDance_resend .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_aiDance_resend .property_p_aiDance_resend .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 * 建议投诉中重派操作
 */
function propertyResendTasksJump(propertyJson,id,type,status){
    $("#property_resend_tasks").modal("show");
    $("#property_dm_follow_resend .property_dm_follow_resend").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#property_p_follow_resend .property_p_follow_resend").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#property_dm_aiDance_resend .property_dm_aiDance_resend").attr({"optionid":propertyJson.aidanceDm,"modename":propertyJson.admName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.admName));
    $("#property_p_aiDance_resend .property_p_aiDance_resend").attr({"optionid":propertyJson.aidanceP,"modename":propertyJson.aidanceName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.aidanceName));
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    propertyResendDept1();
    propertyResendDept2();
}

function propertyResendTasks(){
    var id = $(".updateId").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var followDm = $("#property_dm_follow_resend .property_dm_follow_resend").attr("optionid");
    var followP = $("#property_p_follow_resend .property_p_follow_resend").attr("optionid");
    var aiDanceDm = $("#property_dm_aiDance_resend .property_dm_aiDance_resend").attr("optionid");
    var aiDanceP = $("#property_p_aiDance_resend .property_p_aiDance_resend").attr("optionid");
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&c.id="+id+"&operate="+"重派",
        data:{
            "c.followDm":followDm,
            "c.followP":followP,
            "c.aidanceDm":aiDanceDm,
            "c.aidanceP":aiDanceP
        },
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        }
    });
}

//拒单部门
function propertyUpdateRejectDept(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_dm_follow_reject .property_dm_follow_reject .option_type").attr("optionId","");
            var deptDm = $("#property_dm_follow_reject .property_dm_follow_reject .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_follow_reject .property_p_follow_reject .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_dm_follow_reject .property_dm_follow_reject .followDmZoneList-menu li:first-child").remove();
        }
    });
}

//拒单跟进人
function propertyUpdateRejectEmp(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_p_follow_reject .property_p_follow_reject .option_type").attr("optionId","");
            var empP = $("#property_p_follow_reject .property_p_follow_reject .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_p_follow_reject .property_p_follow_reject .followPZoneList-menu li:first-child").remove();
        }
    });
}


/**
 * 建议投诉中拒单操作
 */
function propertyRejectTasksJump(propertyJson,id,type,status){
    console.log(propertyJson);
    $("#property_reject").modal("show");
    $(".form-horizontal").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $(".aiDanceDm").attr("aidanceDm",propertyJson.aidanceDm);
    $(".aiDanceP").attr("aidanceP",propertyJson.aidanceP);
    $("#property_dm_follow_reject .property_dm_follow_reject").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#property_p_follow_reject .property_p_follow_reject").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#property_reject_content").val(propertyJson.refuseDetail);
    $("#property_file_reject").html(propertyJson.file);
    propertyUpdateRejectDept();
}

//上传相片
$("#property_file_reject").change(function uploadingImg(){
    var pathUrl=$(this).val();
    var names=pathUrl.lastIndexOf("\\");
    var upfileName=pathUrl.substring(names+1,pathUrl.length);
    var imgName=pathUrl.substring(names+1,pathUrl.length-4);
    $("#defined_file_property").val(imgName).attr("upFile",upfileName);
    var file =$(this).get(0).files[0];
    /*if(file!=null){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function(e){
            //$("#property_reject .imgBox").css("background-image","url("+e.target.result+")");//预览图片
            $("#property_reject .imgBox").css("background-image","url("+e.target.result+")");//预览图片
        };
    }*/
});

function propertyRejectTasks(){
    var id = $(".form-horizontal").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var formData = new FormData($('#propertyTasksRejectFormId')[0]);
    var followDm = $("#property_dm_follow_reject .property_dm_follow_reject").attr("optionid");
    var followP = $("#property_p_follow_reject .property_p_follow_reject").attr("optionid");
    var aidanceDm = $(".aiDanceDm").attr("aidanceDm");
    var aidanceP = $(".aiDanceP").attr("aidanceP");
    var upFile = $("#property_defined_reject").val();
    console.log(upFile);
    var refuseDetail = $("#reject_refuseDetail").val();
    formData.append("c.followDm",followDm);
    formData.append("c.followP",followP);
    formData.append("c.aidanceDm",aidanceDm);
    formData.append("c.aidanceP",aidanceP);
    formData.append("upFile",$("#property_file_reject")[0].files[0]);
    formData.append("c.refuseDetail",refuseDetail);
    $.ajax({
        type:"post",
        data:formData,
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=1"+"&c.id="+id+"&operate="+"拒单",
        async:false,
        cache:false,
        processData:false,
        contentType:false,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryMaintenanceLoadPageDataJump(1,type,status,2);
        },
    });
}

function suggestVisitedRecordJump(){
    $("#property_visited_record").modal("show");
}

var Mes=0;
/*$(".addFamMem").click(function(){
    var ids='personMes'+Mes;
    $("#property_aiDanceDm"+ids+".property_aiDanceDm"+ids).empty();
    $(".humanIn .addAiDance").css("display","block");
    var li="";
    console.log(ids);
    li+='<li id="'+ids+'" class="totalLength">';
    li+='<span class="pull-left">部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门</span>';
    li+='<div class="menuBox pull-left" id="property_aiDanceDm">';
    li+='<div class="dropdown areaZone property_aiDanceDm" ids="property_aiDanceDm" optionId="">';
    li+='<a class="dropdown-toggle areaZoneList followDmZoneList reactive_height text-center" data-toggle="dropdown"><span>全部</span><b class="caret"></b></a>';
    li+='<ul class="dropdown-menu areaZoneList-menu followDmZoneList-menu" role="menu">';
    li+='</ul>';
    li+='</div>';
    li+='</div>';
    li+='<span class="pull-left">协&nbsp;&nbsp;作&nbsp;&nbsp;人</span>';
    li+='<div class="menuBox pull-left" id="property_FollowP">';
    li+='<div class="dropdown areaZone property_FollowP" ids="property_FollowP" optionId="">';
    li+='<a class="dropdown-toggle areaZoneList followDmZoneList reactive_height text-center" data-toggle="dropdown"><span>全部</span><b class="caret"></b></a>';
    li+='<ul class="dropdown-menu areaZoneList-menu followDmZoneList-menu" onclick="propertyAddEmp3()" role="menu">';
    li+='</ul>';
    li+='</div>';
    li+='</div>';
    li+='<a class="delete">删除</a></li>';
    $(".addDivMes").append(li);
    removeClass(".delete");
    Mes++;
});*/

function removeClass(cla){
    $(cla).on('click',function(){
        $(this).parent().remove();
    })
}

function propertyAddDept1(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_FollowDm .property_FollowDm .option_type").attr("optionId","");
            var deptDm = $("#property_FollowDm .property_FollowDm .dropdown-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_FollowP .property_FollowP .dropdown-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_FollowDm .property_FollowDm .dropdown-menu li:first-child").remove();
        }
    });
}

function propertyAddEmp1(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_FollowP .property_FollowP .option_type").attr("optionId","");
            var empP = $("#property_FollowP .property_FollowP .dropdown-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_FollowP .property_FollowP .dropdown-menu li:first-child").remove();
        }
    });
}

function propertyAddDept2(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":""
        },
        success:function(data){
            var deptData = eval(data.obj.data);
            $("#property_aiDanceDm .property_aiDanceDm .option_type").attr("optionId","");
            var deptDm = $("#property_aiDanceDm .property_aiDanceDm .dropdown-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_aiDanceP .property_aiDanceP .dropdown-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#property_aiDanceDm .property_aiDanceDm .dropdown-menu li:first-child").remove();
        }
    });
}

function propertyAddEmp2(departId){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType:"json",
        data:{
            "token":permit,
            "pager.pager":"",
            "employee.deptno":departId
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#property_aiDanceP .property_aiDanceP .option_type").attr("optionId","");
            var empP = $("#property_aiDanceP .property_aiDanceP .dropdown-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#property_aiDanceP .property_aiDanceP .dropdown-menu li:first-child").remove();
        }
    });
}

function selectPropertyDept(){
    propertyAddDept1();
    propertyAddDept2();
    propertyBuilding();
}

function propertyBuilding(){
    var zoneCode = propertyAreaCode(permit);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        dataType:"json",
        data:{
            "token":permit,
            "zonecode":zoneCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#property_toDoModalAddress .propertyChargingAds .option_type").attr("optionId","");
            var building = $("#property_toDoModalAddress .propertyChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#property_toDoModalAddress .propertyUnitAds .dropdown-menu").css("display","");
            $("#property_toDoModalAddress .propertyUnitAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr = codeStr.substring(codeStr.indexOf("d")+1,codeStr.indexOf("b")+1).replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
            $("#property_toDoModalAddress .propertyChargingAds .dropdown-menu li:first-child").remove();
        }
    });
}

function propertyUnit(buildingCode){
    sessionStorage.setItem("buildingCode",buildingCode);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryUnit.action",
        dataType:"json",
        data:{
            "token":permit,
            "buildingcode":buildingCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#property_toDoModalAddress .propertyUnitAds .option_type").attr("optionId","");
            var building = $("#property_toDoModalAddress .propertyUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#property_toDoModalAddress .propertyDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr=codeStr.substring(codeStr.indexOf("b")+1,codeStr.indexOf("u")+1).replace("u","单元");
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'">'+newCodeStr+'</a></li>');
            });
            $("#property_toDoModalAddress .propertyUnitAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function propertyDoorplate(buildingCode){
    sessionStorage.setItem("buildingCode",buildingCode);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryOwnerHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":buildingCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#property_toDoModalAddress .propertyDoorplateAds .option_type").attr("optionId","");
            var building = $("#property_toDoModalAddress .propertyDoorplateAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr=codeStr.substring(codeStr.indexOf("u")+1,codeStr.indexOf("h")+1).replace("f", "层").replace("h", "室");
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'">'+newCodeStr+'</a></li>');
            });
            $("#property_toDoModalAddress .propertyDoorplateAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}


function propertyCode(code){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!findNameByType.action",
        dataType:"json",
        data:{
            "token":permit,
            "c.code":code
        },
        success:function(data){
            if(data.obj){
                var cusName = data.obj.name;
                var cusPhone = data.obj.cellphone;
                if(propertyAddType=="4"){
                    $("#property_cusName").val(cusName);
                    $("#property_cusPhone").val(cusPhone);
                }
            }
        }
    });
}

/**
 * 添加派送
 */
function addPropertySend(){
    var type = $("#property_type .property_type").attr("optionid");
    var building = $("#property_toDoModalAddress .propertyChargingAds").attr("optionid");
    var unit = $("#property_toDoModalAddress .propertyUnitAds").attr("optionid");
    var floorRoom = $("#property_toDoModalAddress .propertyDoorplateAds").attr("optionid");
    var content = $("#property_content").val();
    var upFile = $("#property_defined_attach").val();
    var cusName = $("#property_cusName").val();
    var cusPhone = $("#property_cusPhone").val();
    var followDm = $("#property_FollowDm .property_FollowDm").attr("optionid");
    var followP = $("#property_FollowP .property_FollowP").attr("optionid");
    var aiDanceDm = $("#property_aiDanceDm .property_aiDanceDm").attr("optionid");
    var aiDanceP = $("#property_aiDanceP .property_aiDanceP").attr("optionid");
    var sendMode = $("#property_sendMode .property_sendMode").attr("optionid");
    var urgency = $("#property_urgency .property_urgency").attr("optionid");
    var formData = new FormData();
    formData.append("c.workorderType",2);
    formData.append("c.type",type);
    formData.append("c.code",floorRoom);
    formData.append("c.content",content);
    formData.append("upFile",$("#property_file_attach")[0].files[0]);
    formData.append("c.cusName",cusName);
    formData.append("c.cusPhone",cusPhone);
    formData.append("c.followDm",followDm);
    formData.append("c.followP",followP);
    formData.append("c.aidanceDm",aiDanceDm);
    formData.append("c.aidanceP",aiDanceP);
    formData.append("c.sendMode",sendMode);
    formData.append("c.urgency",urgency);
    if(type==""){
        msgTips("请选择获取类型下拉框的值!");
        return;
    }else if(building==""||building=="0"){
        msgTips("请选择获取所在区栋下拉框的值!");
        return;
    }else if(unit==""||unit=="0"){
        msgTips("请选择获取所在单元下拉框的值!");
        return;
    }else if(floorRoom==""||floorRoom=="0"){
        msgTips("请选择获取所在区域下拉框的值!");
        return;
    }else{
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=1"+"&operate="+"派送",
            data:formData,
            async : false,
            cache : false,
            contentType : false,
            processData : false,
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryMaintenanceLoadPageDataJump(1,"toDo",1,2);
            },
        });
    }
}

/**
 * 增加任务
 */
function addProperty(){
    var type = $("#property_type .property_type").attr("optionid");
    var building = $("#property_toDoModalAddress .propertyChargingAds").attr("optionid");
    var unit = $("#property_toDoModalAddress .propertyUnitAds").attr("optionid");
    var floorRoom = $("#property_toDoModalAddress .propertyDoorplateAds").attr("optionid");
    var content = $("#property_content").val();
    var upFile = $("#property_defined_attach").val();
    var cusName = $("#property_cusName").val();
    var cusPhone = $("#property_cusPhone").val();
    var followDm = $("#property_FollowDm .property_FollowDm").attr("optionid");
    var followP = $("#property_FollowP .property_FollowP").attr("optionid");
    var aiDanceDm = $("#property_aiDanceDm .property_aiDanceDm").attr("optionid");
    var aiDanceP = $("#property_aiDanceP .property_aiDanceP").attr("optionid");
    var sendMode = $("#property_sendMode .property_sendMode").attr("optionid");
    var urgency = $("#property_urgency .property_urgency").attr("optionid");
    var formData = new FormData();
    formData.append("c.workorderType",2);
    formData.append("c.type",type);
    formData.append("c.code",floorRoom);
    formData.append("c.content",content);
    formData.append("upFile",$("#property_file_attach")[0].files[0]);
    formData.append("c.cusName",cusName);
    formData.append("c.cusPhone",cusPhone);
    formData.append("c.followDm",followDm);
    formData.append("c.followP",followP);
    formData.append("c.aidanceDm",aiDanceDm);
    formData.append("c.aidanceP",aiDanceP);
    formData.append("c.sendMode",sendMode);
    formData.append("c.urgency",urgency);
    if(type==""){
        msgTips("请选择获取类型下拉框的值!");
        return;
    }else if(building==""||building=="0"){
        msgTips("请选择获取所在区栋下拉框的值!");
        return;
    }else if(unit==""||unit=="0"){
        msgTips("请选择获取所在单元下拉框的值!");
        return;
    }else if(floorRoom==""||floorRoom=="0"){
        msgTips("请选择获取所在区域下拉框的值!");
        return;
    }else{
        $.ajax({
            type:"post",
            data:formData,
            url:zoneServerIp+"/ucotSmart/complaintOldAction!addComplaintOld.action?token="+permit,
            async : false,
            cache : false,
            contentType : false,
            processData : false,
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryMaintenanceLoadPageDataJump(1,"toDo",1,2);
            },
        });
    }
}

//解析成街区到单元
function propertyAreaToCharacter(str){
    return str.replace("d","街区").replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元").replace('f','层').replace('h','室');
}

//对紧急程度进行转化
function propertyUrgency(type){
    if(type=="1"){
        var propertyUrgency = "非常严重";
    }else if(type=="2"){
        var propertyUrgency = "严重";
    }else if(type=="3"){
        var propertyUrgency = "一般";
    }
    return propertyUrgency;
}

//对派送方式进行转化
function propertySentMode(type){
    if(type=="1"){
        var propertySentMode = "APP派送";
    }else if(type=="2"){
        var propertySentMode = "微信派送";
    }
    return propertySentMode;
}

function tasksSatisfaction(type){

}

//对列表数据进行转化
function propertyType(type){
    if(type=="4"){
        var propertyType="用户报修";
    }else if(type=="5"){
        var propertyType = "公共报修";
    }else if(type=="6"){
        var propertyType="综合报修";
    }
    return propertyType;
}

//对状态进行转化
function propertyChangeStatus(type){
    if(type=="1"){
        var propertyChangeStatus="未处理";
        $(".color").addClass("red");
    }else if(type=="2"){
        var propertyChangeStatus="处理中";
        $(".color").removeClass("red");
    }else if(type=="3"){
        var propertyChangeStatus="再处理";
        $(".color").addClass("red");
    }else if(type=="4"){
        var propertyChangeStatus="已完成";
        $(".color").removeClass("red");
    }else if(type=="5"){
        var propertyChangeStatus="已回访";
        $(".color").removeClass("red");
    }else if(type=="6"){
        var propertyChangeStatus="未完成";
        $(".color").removeClass("red");
    }else if(type=="7"){
        var propertyChangeStatus="拒单";
        $(".color").removeClass("red");
    }
    return propertyChangeStatus;
}

//通过token获取zoneCode//200002d1p1z1b
function propertyAreaCode(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.endsWith("N"))
        return code.substring(0,code.indexOf("d"));
}

//格式化时间格式为yyyy-MM-dd
function propertyAllSubStr(time){
    if(time!=null&&time!="undefined"){
        return time.substring(0,10);
    }
    return "";
}

//判断是否为空
function propertyCheckNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}

/**
 * 清空添加模态框
 */
$('#property_add').on('hidden.bs.modal', function (e) {
    $("#property_type,#property_FollowDm,#property_FollowP,#property_aiDanceDm,#property_aiDanceP").find(".dropdown-toggle span").text("全部");
    $("#property_type,#property_FollowDm,#property_FollowP,#property_aiDanceDm,#property_aiDanceP").find(".dropdown").attr({"optionid":"","modename":"全部"});
    $("#property_toDoModalAddress .dropdown-toggle span").text("");
    $("#property_toDoModalAddress .dropdown").attr({"optionid":"","modename":""});
    $("#property_sendMode").find(".dropdown-toggle span").text("APP派送");
    $("#property_sendMode").find(".dropdown").attr({"optionid":"1","modename":"APP派送"});
    $("#property_urgency").find(".dropdown-toggle span").text("非常严重");
    $("#property_urgency").find(".dropdown").attr({"optionid":"1","modename":"非常严重"});
    $(":input").val("");
})
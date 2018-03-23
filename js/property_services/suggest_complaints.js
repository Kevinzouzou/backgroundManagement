/**
 * Created by asus on 2017/9/28.
 */
var pageSize = 10;
var mesDm = 0;
var suggestAddType = "";

$("a[href='#property_service_menu']").click(function(){
    suggestComplaintsInitialize('tasks');
});
/*$('.property_services,.suggest_complaints').click(function(){
    suggestComplaintsInitialize('tasks');
});*/

function suggestComplaintsInitialize(type){
    if(type=="tasks"){
        queryTasksLoadPageDataJump(1,"tasks",0,1);
    }else if(type=="toDo"){
        queryTasksLoadPageDataJump(1,"toDo",1,1);
    }else if(type=="inTasks"){
        queryTasksLoadPageDataJump(1,"inTasks",2,1);
    }else if(type=="reprocessTasks"){
        queryTasksLoadPageDataJump(1,"reprocessTasks",3,1);
    }else if(type=="notTasks"){
        queryTasksLoadPageDataJump(1,"notTasks",4,1);
    }else if(type=="return"){
        queryTasksLoadPageDataJump(1,"return",5,1);
    }
}

$("body").on("click",".dropdown-menu a",function(){
    var ids='personMes'+mesDm;
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
    if(dropdownId=="suggestChargingAds"){
        suggestUnit(optionId);
    }else if(dropdownId=="suggestUnitAds"){
        suggestDoorplate(optionId);
    }else if(dropdownId=="suggest_type"){
        suggestAddType = optionId;
        if(optionId=="1"||optionId=="2"){
            $("#suggest_cusName,#suggest_cusPhone").attr("disabled",true);
        }else if(optionId=="3"){
            $("#suggest_cusName,#suggest_cusPhone").attr("disabled",false).val("");
        }
    }else if(dropdownId=="suggestDoorplateAds"){
        suggestCode(optionId);
    }else if(dropdownId=="suggest_FollowDm"){
        suggestAddEmp1(optionId);
    }else if(dropdownId=="suggest_aiDanceDm"){
        suggestAddEmp2(optionId);
    }else if(dropdownId=="dm_follow_resend"){
        suggestResendEmp1(optionId);
    }else if(dropdownId=="dm_aiDance_resend"){
        suggestResendEmp2(optionId);
    }else if(dropdownId=="dm_follow_reject"){
        suggestUpdateRejectEmp(optionId);
    }else if(dropdownId=="dm_follow_send"){
        suggestSendEmp1(optionId);
    }else if(dropdownId=="dm_aiDance_send"){
        suggestSendEmp2(optionId);
    }else if(dropdownId=="dm_follow_finish"){
        suggestFinishEmp1(optionId);
    }else if(dropdownId=="dm_aiDance_finish"){
        suggestFinishEmp2(optionId);
    }else if(dropdownId=="dm_follow_send_finish"){
        suggestSendFinishEmp1(optionId);
    }else if(dropdownId=="dm_aiDance_send_finish"){
        suggestSendFinishEmp2(optionId);
    }else if(dropdownId=="dm_follow_next"){
        suggestNextEmp1(optionId);
    }else if(dropdownId=="dm_aiDance_next"){
        suggestNextEmp2(optionId);
    }else if(dropdownId=="suggest_aiDanceDm"+ids){
        suggestAddEmp3(ids,optionId);
    }
    mesDm++;
});

/**
 * 加载任务数据分页
 * @param page 当前页
 * @param type 类型
 */
function queryTasksLoadPageDataJump(page,type,status,workType){
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
            $("#tasks_body_"+type).empty();
            if(data.obj.data==null){
                $("#tasks_body_"+type).append('<h2>没有查询到数据</h2>');
            }else{
                var list = eval(data.obj.data);
                pageSuggestServiceLoadInformationList(list,type,status,workType);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum/pageSize);//总页数
                $('#tasks_paging_'+type).empty();
                $('#tasks_tips_'+type).html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                if(pageNum==1||pageNum==0){

                }else{
                    queryTasksListByPage(list.length, totalNum,pageNum,type,status,"","",workType);
                }
            }
        }
    });
}

/**
 * 条件查询
 */
function suggestSearch(type,status){
    var suggestType = $("#suggest_type_"+type+" .suggest_type_"+type).attr("optionid");
    var startTime = $(".startTime").val();
    var endTime = $(".endTime").val();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintOld.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":1,
            "pager.pagesize":10,
            "c.type":suggestType,
            "c.status":status,
            "c.workorderType":1,
            "starttime":startTime,
            "endtime":endTime
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pageSuggestServiceLoadInformationList(list,type,status,1);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#tasks_paging_'+type).empty();
            $('#tasks_tips_'+type).html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryTasksListByPage(list.length, totalNum,pageNum,type,status,startTime,endTime,1);
            }
        }
    });
}

/**
 * 获取任务中的个数
 * @param type
 * @param status
 */
function suggestStatusDetails(type,status){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintOld.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":1,
            "pager.pagesize":10,
            "c.type":"",
            "c.status":status,
            "c.workorderType":1,
            "starttime":"",
            "endtime":""
        },
        success: function (data) {
            $("#tasks_body_"+type).empty();
            if(data.obj.data==null){
                $("#tasks_body_"+type).append('<h2>没有查询到数据</h2>');
            }else {
                var list = eval(data.obj.data);
                pageSuggestServiceLoadInformationList(list, type, status, 1);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum / pageSize);//总页数
                $('#tasks_paging_'+type+'span.status_details').empty();
                $('#tasks_tips_'+type+'span.status_details').text(totalNum);
            }
        }
    });
}

/*
 *给任务分页插件绑定ajax请求，根据页码任务数据
 */
function queryTasksListByPage(pageNum,totalNum,totalPages,type,status,startTime,endTime,workType){
    var pageComplaints = 0;
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    var tasksPaging = "tasks_paging_"+type;
    var tasksPaginationName = "pagination-ll-"+type;
    $('#'+tasksPaging).empty();
    $('#'+tasksPaging).append('<ul id="'+tasksPaginationName+'" class="pagination-sm"></ul>');
    var tasksPage;
    $('#'+tasksPaginationName).twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            tasksPage=page;
            if(pageComplaints==0){
                pageComplaints++;
            }else{
                $.ajax({
                    type: "post",
                    url: zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintOld.action",
                    dataType: "json",
                    data: {
                        "token": permit,
                        "pager.pages":tasksPage,
                        "pager.pagesize":pageSize,
                        "c.type":type,
                        "c.workorderType":workType,
                        "c.status":status,
                        "c.starttime":startTime,
                        "c.endtime":endTime
                    },
                    success: function (data) {
                        var list=eval(data.obj.data);
                        pageSuggestServiceLoadInformationList(list,type,status,workType);
                        $('#tasks_tips_'+type).empty();
                        $('#tasks_tips_'+type).html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                    }
                });
            }
        }
    });
}

/**
 * 导出任务数据
 */
function tasksExportData(status,workorderType){
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

/**
 * 打印
 * @param type
 */
function suggestPrintData(type){
    $("#tasks_list_"+type+" .suggestPrint").hide();
    $("#tasks_list_"+type).jqprint();
    $("#tasks_list_"+type+" .suggestPrint").show();
}

/**
 * 完成详情
 * @param suggestJson
 */
function suggestDetailsJump(suggestJson){
    console.log(suggestJson);
    $("#details_finish_file").empty();
    $("#suggest_detail").modal("show");
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!findComplaintHistoryById.action?token="+permit+"&id="+suggestJson.id,
        dataType:"json",
        success:function(data){
            var followDm = data.obj.fdmName;
            var followP = data.obj.followName;
            var aiDanceDm = data.obj.admName;
            var aiDanceP = data.obj.aidanceName;
            var manualCharge = data.obj.manualCharge;
            var materialsCharge = data.obj.materialsCharge;
            $("#details_finish_follow_dm").html(followDm);
            $("#details_finish_follow_p").html(followP);
            $("#details_finish_ai_dance_dm").html(aiDanceDm);
            $("#details_finish_ai_dance_p").html(aiDanceP);
            $("#details_finish_manual_charge").html(manualCharge);
            $("#details_finish_materials_charge").html(materialsCharge);
            $("#details_finish_content").html(suggestJson.content);
            if(suggestJson.file!=null||suggestJson.file!=""||suggestJson.file!="null"){
                $("#details_finish_file").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zoneServerIp+"/ucotSmart"+suggestJson.file+">");
            }
            //$("#details_finish_file").append("src="+zoneServerIp+"/ucotSmart"+suggestJson.file+">");
            $("#details_finish_mark").html(suggestJson.mark);
        }
    });
}

/**
 * 回访记录
 * @param id
 */
function suggestVisitedRecordJumps(propertyJson,id,type,status){
    $("#suggest_visited_record").modal("show");
    $(".updateId").attr("id",id);
    $("#dm_follow_send_finish .dm_follow_send_finish").attr({"optionid":propertyJson.followDm,"modename":propertyJson.fdmName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.fdmName));
    $("#p_follow_send_finish .p_follow_send_finish").attr({"optionid":propertyJson.followP,"modename":propertyJson.followName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.followName));
    $("#dm_aiDance_send_finish .dm_aiDance_send_finish").attr({"optionid":propertyJson.aidanceDm,"modename":propertyJson.admName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.admName));
    $("#p_aiDance_send_finish .p_aiDance_send_finish").attr({"optionid":propertyJson.aidanceP,"modename":propertyJson.aidanceName}).find("a.dropdown-toggle span").text(propertyCheckNull(propertyJson.aidanceName));
    $(".type").attr("type",type);
    $(".status").attr("status",status);
}

function suggestSendFinishDept1(){
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
            $("#dm_follow_send_finish .dm_follow_send_finish .option_type").attr("optionId","");
            var deptDm = $("#dm_follow_send_finish .dm_follow_send_finish .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_follow_send_finish .p_follow_send_finish .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_follow_send_finish .dm_follow_send_finish .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestSendFinishEmp1(departId){
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
            $("#p_follow_send_finish .p_follow_send_finish .option_type").attr("optionId","");
            var empP = $("#p_follow_send_finish .p_follow_send_finish .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_follow_send_finish .p_follow_send_finish .followPZoneList-menu li:first-child").remove();
        }
    });
}

function suggestSendFinishDept2(){
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
            $("#dm_aiDance_send_finish .dm_aiDance_send_finish .option_type").attr("optionId","");
            var deptDm = $("#dm_aiDance_send_finish .dm_aiDance_send_finish .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_aiDance_send_finish .p_aiDance_send_finish .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_aiDance_send_finish .dm_aiDance_send_finish .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestSendFinishEmp2(departId){
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
            $("#p_aiDance_send_finish .p_aiDance_send_finish .option_type").attr("optionId","");
            var empP = $("#p_aiDance_send_finish .p_aiDance_send_finish .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_aiDance_send_finish .p_aiDance_send_finish .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

function suggestVisitedRecord(){
    var formData = new FormData($('#suggestTasksRecordFormId')[0]);
    var id = $(".updateId").attr("id");
    var createTime = $("#suggest_record_createTime").val();
    var content = $("#suggest_record_content").val();
    var satisfaction = $("input[type='radio']:checked").val();
    formData.append("c.satisfaction",satisfaction);
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
                queryTasksLoadPageDataJump(1,"notTasks",4,1);
            },
        });
    }
}

function suggestCompletedSend(){
    $("#suggest_visited_send").modal("show");
    suggestSendFinishDept1();
    suggestSendFinishDept2();
}

function suggestResendFinish(){
    var id = $(".updateId").attr("id");
    var followDm = $("#dm_follow_send_finish .dm_follow_send_finish").attr("optionid");
    var followP = $("#p_follow_send_finish .p_follow_send_finish").attr("optionid");
    var aiDanceDm = $("#dm_aiDance_send_finish .dm_aiDance_send_finish").attr("optionid");
    var aiDanceP = $("#p_aiDance_send_finish .p_aiDance_send_finish").attr("optionid");
    var content = $("#tasks_completed_send_content").val();
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
            queryTasksLoadPageDataJump(1,"notTasks",4,1);
        }
    });
}

/**
 * 回访详情
 * @param suggestJson
 */
function suggestReturnDetailJump(suggestJson){
    console.log(suggestJson);
    $("#return_details_file").empty();
    $("#return_done_detail").modal("show");
    $("#return_details_createTime").html(suggestJson.createtime);
    $("#return_details_content").html(suggestJson.content);
    if(suggestJson.file!=null){
        $("#return_details_file").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zonePicFile+suggestJson.file+">");
    }
    if(suggestJson.satisfaction=="1"){
        $("#suggest_details_satisfaction").html('<label class="star1" style="vertical-align: bottom;" id="return_details_satisfaction"></label>');
    }else if(suggestJson.satisfaction=="2"){
        $("#suggest_details_satisfaction").html('<label class="star2" style="vertical-align: bottom;" id="return_details_satisfaction"></label>');
    }else if(suggestJson.satisfaction=="3"){
        $("#suggest_details_satisfaction").html('<label class="star3" style="vertical-align: bottom;" id="return_details_satisfaction"></label>');
    }else if(suggestJson.satisfaction=="4"){
        $("#suggest_details_satisfaction").html('<label class="star4" style="vertical-align: bottom;" id="return_details_satisfaction"></label>');
    }else if(suggestJson.satisfaction=="5"){
        $("#return_details_satisfaction").html();
    }
}

/**
 * 保修
 * @param id
 * @param type
 * @param status
 */
function suggestRepairsTasksJump(id,type,status){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=2"+"&c.id="+id+"&c.workorderType=2"+"&operate="+"报修",
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryTasksLoadPageDataJump(1,type,status,1);
        }
    });
}

/**
 * 建议投诉中修改操作
 */
function suggestModifyTasksJump(suggestJson,id,type,status){
    $("#suggest_modify").modal("show");
    var statusText = "";
    if(suggestJson.status=="1"){
        statusText = "未处理";
    }else if(suggestJson.status=="2"){
        statusText = "处理中";
    }else if(suggestJson.status=="3"){
        statusText = "再处理";
    }else if(suggestJson.status=="4"){
        statusText = "已完成";
    }else if(suggestJson.status=="5"){
        statusText = "已回访";
    }
    var urgencyText = "";
    if(suggestJson.urgency=="1"){
        urgencyText = "非常严重";
    }else if(suggestJson.urgency=="2"){
        urgencyText = "严重";
    }else if(suggestJson.urgency=="3"){
        urgencyText = "一般";
    }
    $("#suggest_update_status .suggest_update_status").attr({"optionid":suggestJson.status,"modename":statusText}).find("a.dropdown-toggle span").text(statusText);
    $("#suggest_update_urgency .suggest_update_urgency").attr({"optionid":suggestJson.urgency,"modename":urgencyText}).find("a.dropdown-toggle span").text(urgencyText);
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $(".ordernum").attr("ordernum",suggestJson.ordernum);
}

function suggestModify(){
    var id = $(".updateId").attr("id");
    var updateType = $(".type").attr("type");
    var updateStatus = $(".status").attr("status");
    var ordernum = $(".ordernum").attr("ordernum");
    var status = $("#suggest_update_status .suggest_update_status").attr("optionid");
    var urgency = $("#suggest_update_urgency .suggest_update_urgency").attr("optionid");
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
            if(data.success==true){
                msgTips(data.msg);
                queryTasksLoadPageDataJump(1,updateType,updateStatus,1);
            }
        }
    });
}

/**
 * 建议投诉中未完成操作
 * @param id
 * @param status
 */
function suggestNotFinishTasksJump(suggestJson,id,type,status){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=3"+"&c.id="+suggestJson.id+"&operate="+"未完成",
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryTasksLoadPageDataJump(1,'inTasks',2,1);
        }
    });
}

/**完成************************************************************部门*/
function suggestFinishDept1(){
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
            $("#dm_follow_finish .dm_follow_finish .option_type").attr("optionId","");
            var deptDm = $("#dm_follow_finish .dm_follow_finish .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_follow_finish .p_follow_finish .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_follow_finish .dm_follow_finish .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestFinishEmp1(departId){
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
            $("#p_follow_finish .p_follow_finish .option_type").attr("optionId","");
            var empP = $("#p_follow_finish .p_follow_finish .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_follow_finish .p_follow_finish .followPZoneList-menu li:first-child").remove();
        }
    });
}

function suggestFinishDept2(){
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
            $("#dm_aiDance_finish .dm_aiDance_finish .option_type").attr("optionId","");
            var deptDm = $("#dm_aiDance_finish .dm_aiDance_finish .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#property_p_aiDance_finish .property_p_aiDance_finish .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_aiDance_finish .dm_aiDance_finish .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestFinishEmp2(departId){
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
            $("#p_aiDance_finish .p_aiDance_finish .option_type").attr("optionId","");
            var empP = $("#p_aiDance_finish .p_aiDance_finish .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_aiDance_finish .p_aiDance_finish .aiDancePZoneList-menu li:first-child").remove();
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
function suggestFinishInTasksJump(suggestJson,id,type,status){
    $("#tasks_finish_detail").modal("show");
    $(".update_id").attr("id",id);
    $("#dm_follow_finish .dm_follow_finish").attr({"optionid":suggestJson.followDm,"modename":suggestJson.fdmName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.fdmName));
    $("#p_follow_finish .p_follow_finish").attr({"optionid":suggestJson.followP,"modename":suggestJson.followName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.followName));
    $("#dm_aiDance_finish .dm_aiDance_finish").attr({"optionid":suggestJson.aidanceDm,"modename":suggestJson.admName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.admName));
    $("#p_aiDance_finish .p_aiDance_finish").attr({"optionid":suggestJson.aidanceP,"modename":suggestJson.aidanceName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.aidanceName));
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $(".code").attr("code",suggestJson.code);
    $(".cusName").attr("cusName",suggestJson.cusName);
    $(".cusPhone").attr("cusPhone",suggestJson.cusPhone);
    suggestFinishDept1();
    suggestFinishDept2();
}

function suggestFinishInTasks(){
    var id = $(".update_id").attr("id");
    var followDm = $("#dm_follow_finish .dm_follow_finish").attr("optionid");
    var followP = $("#p_follow_finish .p_follow_finish").attr("optionid");
    var aiDanceDm = $("#dm_aiDance_finish .dm_aiDance_finish").attr("optionid");
    var aiDanceP = $("#p_aiDance_finish .p_aiDance_finish").attr("optionid");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var code = $(".code").attr("code");
    var cusName = $(".cusName").attr("cusName");
    var cusPhone = $(".cusPhone").attr("cusPhone");
    var content = $("#tasks_content_details").val();
    var upFile = $("#defined_attachCompletedInTasks").val();
    var manualCharge = $("#tasks_manual_charge").val();
    var materialsCharge = $("#tasks_materials_charge").val();
    var mark = $("#tasks_remark_details").val();
    var itemprice = '';
    itemprice+="材料费用:"+manualCharge+";"+"人工费用:"+materialsCharge;
    var formData = new FormData();
    formData.append("c.followDm",followDm);
    formData.append("c.followP",followP);
    formData.append("c.aidanceDm",aiDanceDm);
    formData.append("c.aidanceP",aiDanceP);
    formData.append("itemprice",itemprice);
    formData.append("c.content",content);
    formData.append("upFile",$("#file_attachCompletedInTasks")[0].files[0]);
    formData.append("c.code",code);
    formData.append("c.mark",mark);
    formData.append("c.workorderType",1);
    formData.append("c.cusName",cusName);
    formData.append("c.cusPhone",cusPhone);
    $.ajax({
        type:"post",
        data:formData,
        url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=4"+"&c.id="+id+"&operate="+"完成",
        async:false,
        cache:false,
        contentType:false,
        processData:false,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryTasksLoadPageDataJump(1,type,status,1);
        }
    });
}

var Mes=0;
$("body").on('click','.addFamMem',function(){

//$(".addFamMem").click(function(){
    var ids='personMes'+Mes;
    $("#suggest_aiDanceDm"+ids+".suggest_aiDanceDm"+ids).empty();
    console.log("#suggest_aiDanceDm"+ids);
    $(".humanIn .addAiDance").css("display","block");
    var li="";
    console.log(ids);
    li+='<li id="'+ids+'">';
    li+='<span class="pull-left">部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门</span>';
    li+='<div class="menuBox pull-left" id="suggest_aiDanceDm'+ids+'">';
    li+='<div class="dropdown areaZone suggest_aiDanceDm'+ids+'" ids="suggest_aiDanceDm'+ids+'" optionId="">';
    li+='<a class="dropdown-toggle areaZoneList followDmZoneList reactive_height text-center" data-toggle="dropdown"><span>全部</span><b class="caret"></b></a>';
    li+='<ul class="dropdown-menu areaZoneList-menu aiDanceDmZoneList-menu" role="menu">';
    li+='</ul>';
    li+='</div>';
    li+='</div>';
    li+='</li><li>';
    li+='<span class="pull-left">协&nbsp;&nbsp;作&nbsp;&nbsp;人</span>';
    li+='<div class="menuBox pull-left" id="suggest_aiDanceP'+ids+'">';
    li+='<div class="dropdown areaZone suggest_aiDanceP'+ids+'" ids="suggest_aiDanceP'+ids+'" optionId="">';
    li+='<a class="dropdown-toggle areaZoneList followDmZoneList reactive_height text-center" data-toggle="dropdown"><span>全部</span><b class="caret"></b></a>';
    li+='<ul class="dropdown-menu areaZoneList-menu aiDancePZoneList-menu" role="menu">';
    li+='</ul>';
    li+='</div>';
    li+='</div>';
    li+='<a class="delete">删除</a></li>';
    $(".addDivMes").append(li);
    suggestAddDept3(ids);
    removeClass(".delete");
    Mes++;
});

function removeClass(cla){
    $(cla).on('click',function(){
        $(this).parent().find("li").siblings().remove();
    });
}

var mes=0;
function toDoAddPublic(){
    var ids='personMes'+Mes;
    suggestAddDept1();
    suggestAddDept2();
    suggestBuilding();
    ++mes;
}

function suggestAddDept1(){
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
            $("#suggest_FollowDm .suggest_FollowDm .option_type").attr("optionId","");
            var deptDm = $("#suggest_FollowDm .suggest_FollowDm .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#suggest_FollowP .suggest_FollowP .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#suggest_FollowDm .suggest_FollowDm .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestAddEmp1(departId){
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
            $("#suggest_FollowP .suggest_FollowP .option_type").attr("optionId","");
            var empP = $("#suggest_FollowP .suggest_FollowP .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#suggest_FollowP .suggest_FollowP .followPZoneList-menu li:first-child").remove();
        }
    });
}

function suggestAddDept2(){
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
            $("#suggest_aiDanceDm .suggest_aiDanceDm .option_type").attr("optionId","");
            var deptDm = $("#suggest_aiDanceDm .suggest_aiDanceDm .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#suggest_aiDanceP .suggest_aiDanceP .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#suggest_aiDanceDm .suggest_aiDanceDm .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestAddEmp2(departId){
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
            $("#suggest_aiDanceP .suggest_aiDanceP .option_type").attr("optionId","");
            var empP = $("#suggest_aiDanceP .suggest_aiDanceP .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#suggest_aiDanceP .suggest_aiDanceP .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

function suggestAddDept3(ids){
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
            $("#suggest_aiDanceDm"+ids+" .suggest_aiDanceDm"+ids+" .option_type").attr("optionId","");
            var deptDm = $("#suggest_aiDanceDm"+ids+" .suggest_aiDanceDm"+ids+" .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#suggest_aiDanceP"+ids+" .suggest_aiDanceP"+ids+" .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                console.log(deptData[index]);
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            console.log(deptDm);
            $("#suggest_aiDanceDm"+ids+" .suggest_aiDanceDm"+ids+" .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestAddEmp3(ids,departId){
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
            $("#suggest_aiDanceP"+ids+" .suggest_aiDanceP"+ids+" .option_type").attr("optionId","");
            var empP = $("#suggest_aiDanceP"+ids+" .suggest_aiDanceP"+ids+" .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var deptNo = empData[index].deptno;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + deptNo + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#suggest_aiDanceP"+ids+" .suggest_aiDanceP"+ids+" .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

function suggestBuilding(){
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
            $("#suggest_toDoModalAddress .suggestChargingAds .option_type").attr("optionId","");
            var building = $("#suggest_toDoModalAddress .suggestChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#suggest_toDoModalAddress .suggestUnitAds .dropdown-menu").css("display","");
            $("#suggest_toDoModalAddress .suggestUnitAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
            $("#suggest_toDoModalAddress .suggestChargingAds .dropdown-menu li:first-child").remove();
        }
    });
}

function suggestUnit(buildingCode){
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
            $("#suggest_toDoModalAddress .suggestUnitAds .option_type").attr("optionId","");
            var building = $("#suggest_toDoModalAddress .suggestUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#suggest_toDoModalAddress .suggestDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
            $("#suggest_toDoModalAddress .suggestUnitAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function suggestDoorplate(buildingCode){
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
            $("#suggest_toDoModalAddress .suggestDoorplateAds .option_type").attr("optionId","");
            var building = $("#suggest_toDoModalAddress .suggestDoorplateAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("u")+1;
                var lastAds=codeStr.indexOf("h")+1;
                var addressCode = codeStr.substring(firstAds, lastAds);
                var newCodeStr= addressCode.replace("f", "层").replace("h", "室");
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'">'+newCodeStr+'</a></li>');
            });
            $("#suggest_toDoModalAddress .suggestDoorplateAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function suggestCode(code){
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
                if(suggestAddType=="1"||suggestAddType=="2"){
                    $("#suggest_cusName").val(cusName);
                    $("#suggest_cusPhone").val(cusPhone);
                }
            }
        }
    });
}

/**
 * 增加派送
 */
function addSuggestSend(){
    var type = $("#suggest_type .suggest_type").attr("optionid");
    var building = $("#suggest_toDoModalAddress .suggestChargingAds").attr("optionid");
    var unit = $("#suggest_toDoModalAddress .suggestUnitAds").attr("optionid");
    var floorRoom = $("#suggest_toDoModalAddress .suggestDoorplateAds").attr("optionid");
    var content = $("#suggest_content").val();
    var upFile = $("#defined_attach").val();
    var cusName = $("#suggest_cusName").val();
    var cusPhone = $("#suggest_cusPhone").val();
    var followDm = $("#suggest_FollowDm .suggest_FollowDm").attr("optionid");
    var followP = $("#suggest_FollowP .suggest_FollowP").attr("optionid");
    var aiDanceDm = $("#suggest_aiDanceDm .suggest_aiDanceDm").attr("optionid");
    var aiDanceP = $("#suggest_aiDanceP .suggest_aiDanceP").attr("optionid");
    var sendMode = $("#suggest_sendMode .suggest_sendMode").attr("optionid");
    var urgency = $("#suggest_urgency .suggest_urgency").attr("optionid");
    var formData = new FormData();
    formData.append("c.workorderType",1);
    formData.append("c.type",type);
    formData.append("c.code",floorRoom);
    formData.append("c.content",content);
    formData.append("upFile",$("#file_attach")[0].files[0]);
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
        msgTips("请选择获取所在期区栋下拉框的值!");
        return;
    }else if(unit==""||unit=="0"){
        msgTips("请选择获取所在单元下拉框的值!");
        return;
    }else if(floorRoom==""||floorRoom=="0"){
        msgTips("请选择获取所在区域下拉框的值!");
        return;
    }else if(followDm==""||followDm=="0"){
        msgTips("请选择获取部门下拉框的值!");
        return;
    }else if(aiDanceDm==""||aiDanceDm=="0"){
        msgTips("请选择获取部门下拉框的值!");
        return;
    }else if(aiDanceP==""||aiDanceP=="0"){
        msgTips("请选择获取协作人下拉框的值!");
        return;
    }else{
        $.ajax({
            type:"post",
            data:formData,
            url:zoneServerIp+"/ucotSmart/complaintOldAction!updateComplaintOld.action?token="+permit+"&status=1"+"&operate="+"派送",
            async : false,
            cache : false,
            contentType : false,
            processData : false,
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryTasksLoadPageDataJump(1,"toDo",1,1);
            }
        });
    }
}

/**
 * 增加任务
 */
function addTasks(){
    var type = $("#suggest_type .suggest_type").attr("optionid");
    var building = $("#suggest_toDoModalAddress .suggestChargingAds").attr("optionid");
    var unit = $("#suggest_toDoModalAddress .suggestUnitAds").attr("optionid");
    var floorRoom = $("#suggest_toDoModalAddress .suggestDoorplateAds").attr("optionid");
    var content = $("#suggest_content").val();
    var upFile = $("#defined_attach").val();
    var cusName = $("#suggest_cusName").val();
    var cusPhone = $("#suggest_cusPhone").val();
    var followDm = $("#suggest_FollowDm .suggest_FollowDm").attr("optionid");
    var followP = $("#suggest_FollowP .suggest_FollowP").attr("optionid");
    var aiDanceDm = $("#suggest_aiDanceDm .suggest_aiDanceDm").attr("optionid");
    var aiDanceP = $("#suggest_aiDanceP .suggest_aiDanceP").attr("optionid");
    var sendMode = $("#suggest_sendMode .suggest_sendMode").attr("optionid");
    var urgency = $("#suggest_urgency .suggest_urgency").attr("optionid");
    var formData = new FormData();
    formData.append("c.workorderType",1);
    formData.append("c.type",type);
    formData.append("c.code",floorRoom);
    formData.append("c.content",content);
    formData.append("upFile",$("#file_attach")[0].files[0]);
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
                queryTasksLoadPageDataJump(1,"toDo",1,1);
            },
        });
    }
}

/**派送************************************************************部门*/
function suggestSendDept1(){
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
            $("#dm_follow_send .dm_follow_send .option_type").attr("optionId","");
            var deptDm = $("#dm_follow_send .dm_follow_send .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_follow_send .p_follow_send .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_follow_send .dm_follow_send .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestSendEmp1(departId){
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
            $("#p_follow_send .p_follow_send .option_type").attr("optionId","");
            var empP = $("#p_follow_send .p_follow_send .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_follow_send .p_follow_send .followPZoneList-menu li:first-child").remove();
        }
    });
}

function suggestSendDept2(){
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
            $("#dm_aiDance_send .dm_aiDance_send .option_type").attr("optionId","");
            var deptDm = $("#dm_aiDance_send .dm_aiDance_send .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_aiDance_send .p_aiDance_send .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_aiDance_send .dm_aiDance_send .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestSendEmp2(departId){
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
            $("#p_aiDance_send .p_aiDance_send .option_type").attr("optionId","");
            var empP = $("#p_aiDance_send .p_aiDance_send .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_aiDance_send .p_aiDance_send .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 * 派送
 * @param suggestJson
 * @param id
 * @param type
 * @param status
 */
function suggestSendTasksJump(suggestJson,id,type,status){
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $("#dm_follow_send .dm_follow_send").attr({"optionid":suggestJson.followDm,"modename":suggestJson.fdmName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.fdmName));
    $("#p_follow_send .p_follow_send").attr({"optionid":suggestJson.followP,"modename":suggestJson.followName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.followName));
    $("#dm_aiDance_send .dm_aiDance_send").attr({"optionid":suggestJson.aidanceDm,"modename":suggestJson.admName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.admName));
    $("#p_aiDance_send .p_aiDance_send").attr({"optionid":suggestJson.aidanceP,"modename":suggestJson.aidanceName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.aidanceName));
    if(suggestJson.followP==null||suggestJson.followP=="null"||suggestJson.followP==""){
        $("#suggest_send").modal("show");
    }else{
        var id = $(".updateId").attr("id");
        var type = $(".type").attr("type");
        var status = $(".status").attr("status");
        var followDm = $("#dm_follow_send .dm_follow_send").attr("optionid");
        var followP = $("#p_follow_send .p_follow_send").attr("optionid");
        var aiDanceDm = $("#dm_aiDance_send .dm_aiDance_send").attr("optionid");
        var aiDanceP = $("#p_aiDance_send .p_aiDance_send").attr("optionid");
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
                queryTasksLoadPageDataJump(1,type,status,1);
            }
        });
    }
    suggestSendDept1();
    suggestSendDept2();
}

function suggestTasksResend(){
    var id = $(".updateId").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var followDm = $("#dm_follow_send .dm_follow_send").attr("optionid");
    var followP = $("#p_follow_send .p_follow_send").attr("optionid");
    var aiDanceDm = $("#dm_aiDance_send .dm_aiDance_send").attr("optionid");
    var aiDanceP = $("#p_aiDance_send .p_aiDance_send").attr("optionid");
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
            queryTasksLoadPageDataJump(1,type,status,1);
        }
    });
}

/**重派************************************************************部门*/
function suggestResendDept1(){
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
            $("#dm_follow_resend .dm_follow_resend .option_type").attr("optionId","");
            var deptDm = $("#dm_follow_resend .dm_follow_resend .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_follow_resend .p_follow_resend .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_follow_resend .dm_follow_resend .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestResendEmp1(departId){
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
            $("#p_follow_resend .p_follow_resend .option_type").attr("optionId","");
            var empP = $("#p_follow_resend .p_follow_resend .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_follow_resend .p_follow_resend .followPZoneList-menu li:first-child").remove();
        }
    });
}

function suggestResendDept2(){
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
            $("#dm_aiDance_resend .dm_aiDance_resend .option_type").attr("optionId","");
            var deptDm = $("#dm_aiDance_resend .dm_aiDance_resend .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_aiDance_resend .p_aiDance_resend .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_aiDance_resend .dm_aiDance_resend .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestResendEmp2(departId){
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
            $("#p_aiDance_resend .p_aiDance_resend .option_type").attr("optionId","");
            var empP = $("#p_aiDance_resend .p_aiDance_resend .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_aiDance_resend .p_aiDance_resend .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 * 重派
 * @param suggestJson
 * @param id
 * @param type
 * @param status
 */
function suggestResendTasksJump(suggestJson,id,type,status){
    $("#suggest_resend_tasks").modal("show");
    $("#dm_follow_resend .dm_follow_resend").attr({"optionid":suggestJson.followDm,"modename":suggestJson.fdmName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.fdmName));
    $("#p_follow_resend .p_follow_resend").attr({"optionid":suggestJson.followP,"modename":suggestJson.followName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.followName));
    $("#dm_aiDance_resend .dm_aiDance_resend").attr({"optionid":suggestJson.aidanceDm,"modename":suggestJson.admName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.admName));
    $("#p_aiDance_resend .p_aiDance_resend").attr({"optionid":suggestJson.aidanceP,"modename":suggestJson.aidanceName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.aidanceName));
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    suggestResendDept1();
    suggestResendDept2();
}

function suggestResendTasks(){
    var id = $(".updateId").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var followDm = $("#dm_follow_resend .dm_follow_resend").attr("optionid");
    var followP = $("#p_follow_resend .p_follow_resend").attr("optionid");
    var aiDanceDm = $("#dm_aiDance_resend .dm_aiDance_resend").attr("optionid");
    var aiDanceP = $("#p_aiDance_resend .p_aiDance_resend").attr("optionid");
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
            queryTasksLoadPageDataJump(1,type,status,1);
        }
    });
}

//拒单部门
function suggestUpdateRejectDept(){
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
            $("#dm_follow_reject .dm_follow_reject .option_type").attr("optionId","");
            var deptDm = $("#dm_follow_reject .dm_follow_reject .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_follow_reject .p_follow_reject .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_follow_reject .dm_follow_reject .followDmZoneList-menu li:first-child").remove();
        }
    });
}

//拒单跟进人
function suggestUpdateRejectEmp(departId){
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
            $("#p_follow_reject .p_follow_reject .option_type").attr("optionId","");
            var empP = $("#p_follow_reject .p_follow_reject .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_follow_reject .p_follow_reject .followPZoneList-menu li:first-child").remove();
        }
    });
}

//上传相片
$("#file_reject").change(function uploadingImg(){
    var pathUrl=$(this).val();
    var names=pathUrl.lastIndexOf("\\");
    var upfileName=pathUrl.substring(names+1,pathUrl.length);
    var imgName=pathUrl.substring(names+1,pathUrl.length-4);
    $("#defined_file_suggest").val(imgName).attr("upFile",upfileName);
    var file =$(this).get(0).files[0];
    if(file!=null){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function(e){
            $("#suggest_reject .imgBox").css("background-image","url("+e.target.result+")");//预览图片
        };
    }
});

/**
 * 拒单
 * @param suggestJson
 * @param id
 * @param type
 * @param status
 */
function suggestRejectTasksJump(suggestJson,id,type,status){
    console.log(suggestJson);
    $("#suggest_reject").modal("show");
    suggestUpdateRejectDept();
    $(".form-horizontal").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    $("#dm_follow_reject .dm_follow_reject").attr({"optionid":suggestJson.followDm,"modename":suggestJson.fdmName}).find("a.dropdown-toggle span").text(suggestJson.fdmName);
    $("#p_follow_reject .p_follow_reject").attr({"optionid":suggestJson.followP,"modename":suggestJson.followName}).find("a.dropdown-toggle span").text(suggestJson.followName);
    $("#reject_content").val(suggestJson.refuseDetail);
    $("#file_reject").html(suggestJson.file);
    $(".aiDanceDm").attr("aidanceDm",suggestJson.aidanceDm);
    $(".aiDanceP").attr("aidanceP",suggestJson.aidanceP);
}

function suggestRejectTasks(){
    var id = $(".form-horizontal").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var aidanceDm = $(".aiDanceDm").attr("aidanceDm");
    var aidanceP = $(".aiDanceP").attr("aidanceP");
    var upFile = $("#defined_file_suggest").val();
    var formData = new FormData($('#suggestTasksRejectFormId')[0]);
    var followDm = $("#dm_follow_reject .dm_follow_reject").attr("optionid");
    var followP = $("#p_follow_reject .p_follow_reject").attr("optionid");
    var refuseDetail = $("#reject_refuseDetail").val();
    formData.append("c.followDm",followDm);
    formData.append("c.followP",followP);
    formData.append("c.aidanceDm",aidanceDm);
    formData.append("c.aidanceP",aidanceP);
    formData.append("upFile",$("#file_reject")[0].files[0]);
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
            queryTasksLoadPageDataJump(1,type,status,1);
        },
    });
}

/**下一步派送************************************************************部门*/
function suggestNextDept1(){
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
            $("#dm_follow_next .dm_follow_next .option_type").attr("optionId","");
            var deptDm = $("#dm_follow_next .dm_follow_next .followDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_follow_next .p_follow_next .followPZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_follow_next .dm_follow_next .followDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestNextEmp1(departId){
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
            $("#p_follow_next .p_follow_next .option_type").attr("optionId","");
            var empP = $("#p_follow_next .p_follow_next .followPZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_follow_next .p_follow_next .followPZoneList-menu li:first-child").remove();
        }
    });
}

function suggestNextDept2(){
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
            $("#dm_aiDance_next .dm_aiDance_next .option_type").attr("optionId","");
            var deptDm = $("#dm_aiDance_next .dm_aiDance_next .aiDanceDmZoneList-menu");
            deptDm.empty();
            deptDm.append('<li><a codelist="0" modename="全部">全部</a></li>');
            deptDm.css("display","");
            $("#p_aiDance_next .p_aiDance_next .aiDancePZoneList-menu").css("display","");
            $(deptData).each(function(index){
                var deptNo = deptData[index].deptno;
                var deptName = deptData[index].deptname;
                deptDm.append('<li><a codeList="' + deptNo + '" modename="'+deptName+'">' + deptName + '</a></li>');
            });
            $("#dm_aiDance_next .dm_aiDance_next .aiDanceDmZoneList-menu li:first-child").remove();
        }
    });
}

function suggestNextEmp2(departId){
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
            $("#p_aiDance_next .p_aiDance_next .option_type").attr("optionId","");
            var empP = $("#p_aiDance_next .p_aiDance_next .aiDancePZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var id = empData[index].id;
                var empName = empData[index].ename;
                empP.append('<li><a codeList="' + id + '" modename="'+empName+'">' + empName + '</a></li>');
            });
            $("#p_aiDance_next .p_aiDance_next .aiDancePZoneList-menu li:first-child").remove();
        }
    });
}

/**
 *建议投诉中下一步操作
 */
function suggestNextTasksJump(suggestJson,id,type,status){
    $("#suggest_next").modal("show");
    $("#dm_follow_next .dm_follow_next").attr({"optionid":suggestJson.followDm,"modename":suggestJson.fdmName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.fdmName));
    $("#p_follow_next .p_follow_next").attr({"optionid":suggestJson.followP,"modename":suggestJson.followName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.followName));
    $("#dm_aiDance_next .dm_aiDance_next").attr({"optionid":suggestJson.aidanceDm,"modename":suggestJson.admName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.admName));
    $("#p_aiDance_next .p_aiDance_next").attr({"optionid":suggestJson.aidanceP,"modename":suggestJson.aidanceName}).find("a.dropdown-toggle span").text(tasksCheckNull(suggestJson.aidanceName));
    $(".updateId").attr("id",id);
    $(".type").attr("type",type);
    $(".status").attr("status",status);
    suggestNextDept1();
    suggestNextDept2();
}

function suggestNextTasks(){
    var id = $(".updateId").attr("id");
    var type = $(".type").attr("type");
    var status = $(".status").attr("status");
    var followDm = $("#dm_follow_next .dm_follow_next").attr("optionid");
    var followP = $("#p_follow_next .p_follow_next").attr("optionid");
    var aiDanceDm = $("#dm_aiDance_next .dm_aiDance_next").attr("optionid");
    var aiDanceP = $("#p_aiDance_next .p_aiDance_next").attr("optionid");
    var content = $("#next_content").val();
    var mark = $("#next_mark").val();
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
            queryTasksLoadPageDataJump(1,type,status,1);
        }
    });
}

//对紧急程度进行转化
function tasksUrgency(type){
    if(type=="1"){
        var tasksUrgency = "非常严重";
    }else if(type=="2"){
        var tasksUrgency = "严重";
    }else if(type=="3"){
        var tasksUrgency = "一般";
    }
    return tasksUrgency;
}

//对派送方式进行转化
function tasksSentMode(type){
    if(type=="1"){
        var tasksSentMode = "APP派送";
    }else if(type=="2"){
        var tasksSentMode = "微信派送";
    }
    return tasksSentMode;
}

function tasksSatisfaction(type){

}

//对列表数据进行转化
function tasksType(type){
    if(type=="1"){
        var tasksType="建议";
    }else if(type=="2"){
        var tasksType = "投诉";
    }else if(type=="3"){
        var tasksType="综合";
    }
    return tasksType;
}

//对状态进行转化
function tasksChangeStatus(type){
    if(type=="1"){
        var tasksStatus="未处理";
    }else if(type=="2"){
        var tasksStatus="处理中";
    }else if(type=="3"){
        var tasksStatus="再处理";
    }else if(type=="4"){
        var tasksStatus="已完成";
        $("#").find("a").css("bgcolor","#999999");
    }else if(type=="5"){
        var tasksStatus="已回访";
    }else if(type=="6"){
        var tasksStatus="未完成";
    }else if(type=="7"){
        var tasksStatus="拒单";
    }
    return tasksStatus;
}

//格式化时间格式为yyyy-MM-dd
function tasksAllSubStr(time){
    if(time!=null&&time!="undefined"){
        return time.substring(0,10);
    }
    return "";
}

//判断是否为空
function tasksCheckNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}

//解析成街区到单元
function suggestAreaToCharacter(str){
    return str.replace("d","街区").replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元").replace('f','层').replace('h','室');
}

/**
 * 清空添加模态框
 */
$('#toDo_add').on('hidden.bs.modal', function (e) {
    $("#suggest_type,#suggest_FollowDm,#suggest_FollowP,#suggest_aiDanceDm,#suggest_aiDanceP").find(".dropdown-toggle span").text("全部");
    $("#suggest_type,#suggest_FollowDm,#suggest_FollowP,#suggest_aiDanceDm,#suggest_aiDanceP").find(".dropdown").attr({"optionid":"","modename":"全部"});
    $("#suggest_toDoModalAddress .dropdown-toggle span").text("");
    $("#suggest_toDoModalAddress .dropdown").attr({"optionid":"","modename":""});
    $("#suggest_sendMode").find(".dropdown-toggle span").text("APP派送");
    $("#suggest_sendMode").find(".dropdown").attr({"optionid":"1","modename":"APP派送"});
    $("#suggest_urgency").find(".dropdown-toggle span").text("非常严重");
    $("#suggest_urgency").find(".dropdown").attr({"optionid":"1","modename":"非常严重"});
    $(":input").val("");
})
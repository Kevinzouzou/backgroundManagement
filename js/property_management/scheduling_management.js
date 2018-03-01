/**
 * Created by along on 2017/12/10 排班管理
 */
//schedulingType查询类型（排班设置set、排班日程schedule、排班查询inquire 重要条件参数！）
//--加载初始方法--
$(".calendar").click(function(){
    $(this).blur();
});
$("#dateTimes").text(nowYear+"-"+nowMonth).attr({"year":nowYear,"month":nowMonth});
var month="";
var deptid="";
function schedulingManagementInitialize(schedulingType){
    pageDataScheduling(schedulingType);
};
$("#property_management_menu .scheduling_management a").click(function (){
    pageDataScheduling("set");
    departmentMenu();
});
//--回显赋值--
function echoEchoSchedulingSet(prefixId,this_){
    $("#"+prefixId+" #scheduling_code").val($(this_).parents("tr").find("td").eq(0).text());//排班编号
    $("#"+prefixId+" #scheduling_name").val($(this_).parents("tr").find("td").eq(1).text());//排班名称
    $("#"+prefixId+" #scheduling_workarea").val($(this_).parents("tr").find("td").eq(2).text());//排班区域
    $("#"+prefixId+" #scheduling_content").val($(this_).parents("tr").find("td").eq(3).text());//排班内容
    $("#"+prefixId+" #scheduling_time .starttime").val($(this_).parents("tr").find("td").eq(4).text());//排班开始时间
    $("#"+prefixId+" #scheduling_time .endtime").val($(this_).parents("tr").find("td").eq(5).text());//排班结束时间
    $("#"+prefixId+" #scheduling_status .scheduling_status").attr({"modename":$(this_).parents("tr").find("td").eq(6).attr("statusText"),"optionid":$(this_).parents("tr").find("td").eq(6).attr("status")});
    $("#"+prefixId+" #scheduling_status .scheduling_status a.dropdown-toggle span").text($(this_).parents("tr").find("td").eq(6).attr("statusText"));
    $("#"+prefixId+" #scheduling_mark").val($(this_).parents("tr").find("td").eq(7).attr("content"));//备注
};
function echoEchoScheduleModal(prefixId,this_){
    $("#emploModal").hide();
    $("#"+prefixId+" .workMonth").val($(this_).parents("tr").find("td").eq(2).text()).attr("disabled","disabled");//排班月份
    let optionid=$(this_).parents("tr").find("td").eq(0).attr("deptid");
    let deptname=$(this_).parents("tr").find("td").eq(0).text();
    $("#"+prefixId+" .deptnameMenu").attr({"optionid":optionid,"modename":deptname}).css("overflow","hidden").find("a.dropdown-toggle span").text(deptname);//部门名称
    let empid=$(this_).parents("tr").find("td").eq(1).attr("empid");
    let empname=$(this_).parents("tr").find("td").eq(1).text();
    $("#"+prefixId+" .pitch-on").text(empname).attr({"ids":empid+":"+empname,"empid":empid});//姓名
    let cycle=$(this_).parents("tr").find("td").eq(3).attr("cycle");
    let cyclename=$(this_).parents("tr").find("td").eq(3).text();
    $("#"+prefixId+" .workCycle").attr({"optionid":cycle,"modename":cyclename}).find("a.dropdown-toggle span").text(cyclename);//排班周期
};
//--表单验证--
function verifySchedulingSet(prefixId){
    let code=$("#"+prefixId+" #scheduling_code").val();//排班编号
    if(!code){msgTips("请填写排班编号");return;};
    let name=$("#"+prefixId+" #scheduling_name").val();//排班名称
    if(!name){msgTips("请填写排班名称");return;};
    let workarea=$("#"+prefixId+" #scheduling_workarea").val();//排班区域
    if(!workarea){msgTips("请填写排班区域");return;};
    let content=$("#"+prefixId+" #scheduling_content").val();//排班内容
    if(!content){msgTips("请填写排班内容");return;};
    let starttime=$("#"+prefixId+" #scheduling_time .starttime").val();//排班开始时间
    if(!starttime){msgTips("请选择排班开始时间");return;};
    let endtime=$("#"+prefixId+" #scheduling_time .endtime").val();//排班结束时间
    if(!endtime){msgTips("请选择排班结束时间");return;};
    let status=$("#"+prefixId+" #scheduling_status .scheduling_status").attr("optionid");
    if(!status){msgTips("请选择状态");return;};
    let remark=$("#"+prefixId+" #scheduling_mark").val();//备注
    let formData={
        "code":code,
        "name":name,
        "workarea":workarea,
        "content":content,
        "starttime":starttime,
        "endtime":endtime,
        "status":status,
        "remark":remark
    };
    return formData;
};
function verifySchedulingSchedule(prefixId){
    let month=$("#"+prefixId+" .workMonth").val();//排班月份
        //month=month.substr(0,month.length-3);
    if(!month){msgTips("请选择排班月份");return;};
    let deptid=$("#"+prefixId+" .deptnameMenu").attr("optionid");//部门名称
    let deptname=$("#"+prefixId+" .deptnameMenu").attr("modename");
    if(!deptid){msgTips("请选择部门名称");return;};
    let empid=$("#"+prefixId+" #pitchOn").attr("empid")
    let employees=$("#"+prefixId+" #pitchOn").attr("ids");//员工姓名
    if(!employees){msgTips("请选择员工姓名");return;};
    let cycle=$("#"+prefixId+" .workCycle").attr("optionid");//排班周期
    let workCycleText=$("#"+prefixId+" .workCycle").attr("modename");
    if(!cycle){msgTips("请选择排班周期");return;};
    let cycleold=$("#submitSchedulingScheduleBut").attr("cycle");
    let ids=$("#submitSchedulingScheduleBut").attr("ids");
    if(!ids){ids=""};
    let formData={
        "month":month,
        "deptid":deptid,
        "deptname":deptname,
        "empid":empid,
        "employees":employees,
        "cycle":cycle,
        "cycleold":cycleold,
        "ids":ids
    };
    $("#addSchedulingScheduleModal").modal("hide");
    return formData;
};
//--查询方法--
function pageDataScheduling(schedulingType){
    // console.log("查询");
    if(schedulingType=="set"){
        schedulingSet();
    }else if(schedulingType=="schedule"){
        $("#ScheduleTime").val("");
        $("#schedulingMenu .schedulingMenu").attr({"optionid":"","modename":""});
        $("#schedulingMenu .schedulingMenu a.dropdown-toggle span").text("全部部门")
        departmentMenu("schedulingMenu,#deptnameMenu");
        schedulingSchedule();
        schedulingSelect();
    }else if(schedulingType=="inquire"){
        $("#inquireDepartmentMenu .inquireDepartmentMenu").attr({"optionid":"","modename":"全部部门"}).find("a.dropdown-toggle span").text("全部部门");
        $("#inquireStaffMenu .inquireStaffMenu").attr({"optionid":"","modename":"全部员工"}).find("a.dropdown-toggle span").text("全部员工");
        let Month;
        if(nowMonth<10){
            Month="0"+nowMonth;
        }else{Month=nowMonth;}
        $("#dateTimes").attr({"year":nowYear,"month":Month}).text(nowYear+"-"+Month);
        $("#dateTimes").removeAttr("empname empid deptid");
        departmentMenu("inquireDepartmentMenu");
        schedulingInquire();
    };
};
function schedulingSet(page,type){
    //排班设置
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workschedulingAction!queryWorkscheduling.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "workscheduling.id":"",
            "workscheduling.status":""
        },
        success: function (data) {
            // console.log("查询排班设置:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_scheduling_set .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_scheduling_set .pagingImplement .pageList").hide();
                $("#schedulingSetList").html("<p>暂无数据</p>");
                $("#tab_scheduling_set .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_scheduling_set",{"functions":"schedulingSet(homelistPage,'paging')"});
                };
                var htmlList='',lth=20;
                for(var i=0;i<10;i++){
                    if(obj[i]) {
                        let content=obj[i].content;
                        if(!content){content=""}
                        let remark=obj[i].mark;
                        if(!remark){remark=""}
                        let statusText;
                        switch (obj[i].status){
                            case 0:
                                statusText= "不生效";
                                break;
                            case 1:
                                statusText= "生效";
                                break;
                        };
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].code+'</td>';
                        htmlList+='<td>'+obj[i].name+'</td>';
                        htmlList+= '<td value="'+obj[i].workarea+'">'+obj[i].workarea+'</td>';
                        if(content.length>lth){
                            var contentTex=content.substring(0,lth);
                            htmlList+= '<td content="'+content+'"><span>'+contentTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+content.replace(/\s/g,"")+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+content+'">'+content+'</td>';
                        }
                        htmlList+='<td>'+obj[i].starttime+'</td>';
                        htmlList+='<td>'+obj[i].endtime+'</td>';
                        if(obj[i].status==0){
                            htmlList+='<td statusText="'+statusText+'" status="'+obj[i].status+'"><span class="status">'+statusText+'<span></td>';
                        }else{
                            htmlList+='<td statusText="'+statusText+'" status="'+obj[i].status+'">'+statusText+'</td>';
                        };
                        if(remark.length>lth){
                            var remarkTex=remark.substring(0,lth);
                            htmlList+= '<td content="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/\s/g,"")+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+remark+'">'+remark+'</td>';
                        }
                        htmlList+='<td><a class="modifyBut" ids="'+obj[i].id+'" type="schedulingSet">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="schedulingSet">删除</a></td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#schedulingSetList").html(htmlList);
                wipeNull("schedulingSetList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function staffModal(deptno,page,type){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "employee.deptno":deptno
        },
        success: function (data) {
            // console.log("查询人员:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_personnel_management .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#personnelManagementList").html("<p>暂无数据</p>");
                $("#tab_personnel_management .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"schedulingStaffModal",{"functions":"staffModal(deptno,homelistPage,'paging')"});
                };
                var htmlList='';
                for(var i=0;i<obj.length;i++){
                    htmlList+='<tr>';
                    htmlList+='<td><input ids="'+obj[i].id+'" name="'+obj[i].ename+'" type="checkbox"></td>';
                    htmlList+='<td>'+obj[i].accout+'</td>';
                    htmlList+='<td>'+obj[i].ename+'</td>';
                    htmlList+= '<td>'+obj[i].cellphone+'</td>';
                    htmlList+='</tr>';
                };
                $("#staffModalList").html(htmlList);
                //去重
                $("#pitchOn span").each(function(){
                    var ids=$(this).attr("ids");
                    $("#staffModalList input[ids="+ids+"]").prop({"disabled":"disabled","checked":"checked"});
                });
                wipeNull("staffModalList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function schedulingSchedule(page,type){
    //排班日程
    let month=$("#ScheduleTime").val();
    if(!month){month=""}
    let deptid=$("#schedulingMenu .schedulingMenu").attr("optionid");
    if(!deptid){deptid=""}
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workPlanAction!queryWorkPlan.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "workPlan.month":month,
            "workPlan.deptid":deptid
        },
        success: function (data) {
            // console.log("查询排班日程:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#scheduleBox .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#scheduleBox .pagingImplement .pageList").hide();
                $("#schedulingScheduleList").html("<p>暂无数据</p>");
                $("#scheduleBox .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"scheduleBox",{"functions":"schedulingSchedule(homelistPage,'paging')"});
                };
                var htmlList='',lth=20;
                for(var i=0;i<10;i++){
                    if(obj[i]) {
                        let month=obj[i].month.substr(0,7);
                        let cycle;
                        switch (obj[i].cycle){
                            case 0:
                                cycle= "复制上月";
                                break;
                            case 1:
                                cycle= "按周";
                                break;
                            case 2:
                                cycle= "按月";
                                break;
                        };
                        htmlList+='<tr>';
                        htmlList+='<td deptid="'+obj[i].deptid+'">'+obj[i].deptname+'</td>';
                        htmlList+='<td empid="'+obj[i].empid+'">'+obj[i].empname+'</td>';
                        htmlList+='<td>'+month+'</td>';
                        htmlList+='<td cycle="'+obj[i].cycle+'">'+cycle+'</td>';
                        htmlList+='<td><a class="lookOver" obj=\''+JSON.stringify(obj[i])+'\' ids="'+obj[i].id+'" empid="'+obj[i].empid+'" empname="'+obj[i].empname+'" type="lookOver">查看</a>| <a class="modifyBut" ids="'+obj[i].id+'" plandetail="'+obj[i].plandetail+'" cycle="'+obj[i].cycle+'" type="modify">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="schedSche">删除</a> </td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#schedulingScheduleList").html(htmlList);
                wipeNull("schedulingScheduleList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function staffSchedule(prefixId,type,parameterData,opnType){
    $("#inquireMonthbox").addClass("inquireStaffArrange").removeClass("inquireDepartmentArrange");
    if(parameterData.cycleold=="2"&&parameterData.cycle=="1"){
        return
    };
    //查询某员工某月的排班
    let ajaxurl;
    if(opnType=="modify"){
        ajaxurl="/ucotSmart/workPlanAction!queryUpdateWorkplandetailMonth.action";
    }else if(opnType=="lookOver"){
        ajaxurl="/ucotSmart/workPlanAction!queryWorkplandetailMonth.action";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "workPlan.empid":parameterData.empid,
            "workPlan.empname":parameterData.empname,
            "workPlan.deptid":parameterData.deptid,
            "workPlan.deptname":parameterData.deptname,
            "workPlan.month":parameterData.month,
            "workPlan.cycle":parameterData.cycle
        },
        success: function (data) {
            // console.log("查询某员工某月的排班:");
            // console.log(data);
            if(data.success==true){
                let obj=data.obj.data;
                if(obj) {
                    //    数据
                    $("#inquireMonthbox span.schmonth,#inquireMonthbox br").remove();
                    for (let i = 0; i < obj.length; i++)
                        if (type == "week") {
                            if(obj[i].length>0){
                                weekOn(prefixId,obj[i],i+1);
                            };
                        } else if (type == "month") {
                            if(obj[i].length>0){
                                monthOn(prefixId,obj[i],i+1);
                            };
                        }
                }
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function staffScheduleday(empid,plantime){
    //查询某员工某天的排班
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workplandetailAction!queryWorkplandetail.action",
        dataType: "json",
        data: {
            "token":permit,
            "workplandetail.empid":empid,
            "workplandetail.plantime":plantime
        },
        success: function (data) {
            // console.log("查询某员工某天的排班:");
            // console.log(data);
            if(data.success==true){
                let obj=data.obj.Workscheduling;
                if(obj) {
                    //    数据
                    dateOn(obj,"inquireTimeBox");
                    $("#modifyInquireSchModalBut").attr("Workplandetail",JSON.stringify(data.obj.Workplandetail));
                }
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function modifystaffScheduleday(parameterData){
    //编辑某员工某日的排班
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workplandetailAction!updateWorkplandetail.action",
        dataType: "json",
        data: {
            "token":permit,
            "workplandetail.id":parameterData.id,
            "workplandetail.deptid":parameterData.deptid,
            "workplandetail.deptname":parameterData.deptname,
            "workplandetail.empid":parameterData.empid,
            "workplandetail.empname":parameterData.empname,
            "workplandetail.plantime":parameterData.plantime,
            "workplandetail.planids":parameterData.planids,
            "workplandetail.iswork":parameterData.iswork
        },
        success: function (data) {
            // console.log("编辑某员工某日的排班:");
            // console.log(data);
            if(data.success==true){
                //    数据
                $("#modifyInquireSchModal").modal("hide");
                let parData={
                    "month":parameterData.plantime.substr(0,7),
                    "empid":parameterData.empid,
                    "empname":parameterData.empname,
                    "deptid":parameterData.deptid,
                    "deptname":parameterData.deptname,
                    "cycle":"2"
                };
                staffSchedule("inquireMonthbox","month",parData,"lookOver");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function schedulingSelect(page,type){
    //查询排班
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workschedulingAction!queryWorkscheduling.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "workscheduling.status":1
        },
        success: function (data) {
            // console.log("查询排班:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#selectSchedulingForm .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#selectSchedulingForm .pagingImplement .pageList").hide();
                $("#schedulingSetList").html("<p>暂无数据</p>");
                $("#selectSchedulingForm .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"selectSchedulingForm",{"functions":"schedulingSelect(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<obj.length;i++){
                        let content=obj[i].content;
                        if(!content){content=""}
                        let remark=obj[i].remark;
                        if(!remark){remark=""}
                        let statusText;
                        switch (obj[i].status){
                            case 0:
                                statusText= "不生效";
                                break;
                            case 1:
                                statusText= "生效";
                                break;
                        };
                        htmlList+='<tr>';
                        htmlList+='<td><input ids="'+obj[i].id+'" content="'+obj[i].content+'" workarea="'+obj[i].workarea+'" name="'+obj[i].name+'" starttime="'+obj[i].starttime+'" endtime="'+obj[i].endtime+'" type="checkbox"></td>';
                        htmlList+='<td>'+obj[i].code+'</td>';
                        htmlList+='<td>'+obj[i].name+'</td>';
                        htmlList+= '<td value="'+obj[i].workarea+'">'+obj[i].workarea+'</td>';
                        if(content.length>lth){
                            let contentTex=content.substring(0,lth);
                            htmlList+= '<td content="'+content+'"><span>'+contentTex+'...'+'</span><span class="blue" onclick=previewModal("排班内容","'+content.replace(/\s/g,"")+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+content+'">'+content+'</td>';
                        }
                        htmlList+='<td>'+obj[i].starttime+'</td>';
                        htmlList+='<td>'+obj[i].endtime+'</td>';
                        if(remark.length>lth){
                            let remarkTex=remark.substring(0,lth);
                            htmlList+= '<td content="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/\s/g,"")+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+remark+'">'+remark+'</td>';
                        }
                        htmlList+='</tr>';
                };
                $("#selectSchedulingList").html(htmlList);
                wipeNull("selectSchedulingList");
                let line=$("#selectSchedulingModalBut").attr("line");
                dataIsCheckedSche(line,"week");
                dataIsCheckedSche("","inquireTimeBox");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function schedulingInquire(){
    //通过部门查询某月排班情况
    $("#inquireMonthbox").addClass("inquireDepartmentArrange").removeClass("inquireStaffArrange");
    let date=$("#dateTimes").text();
    let deptid=$("#inquireDepartmentMenu .inquireDepartmentMenu").attr("optionid");
    if(!deptid){deptid=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workPlanAction!queryWorkPlanByDept.action",
        dataType: "json",
        data: {
            "token":permit,
            "workPlan.month":date+"-"+"01",
            "workPlan.deptid":deptid
        },
        success: function (data) {
            // console.log("查询排班:");
            // console.log(data);
            //    数据
                var obj=data.obj;
                if(obj){
                    monthtab("inquire");
                    let objArr=obj.split(",");
                    for(let i=0;i<objArr.length;i++){
                        if(objArr[i]=="1"){
                            monthOn("inquireMonthbox","",i+1,"inquire");
                        };
                    };
                };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function inquireDepartmentPersonnel(day){
    //查询某部门某一天有那些人排班
    let ids=$("#dateTimes").attr("deptid");
    if(!ids){ids=""};
    let workday=$("#dateTimes").text()+"-"+day;
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/workPlanAction!queryWorkEmployees.action",
        dataType: "json",
        data: {
            "token":permit,
            "ids":ids,
            "workday":workday
        },
        success: function (data) {
            // console.log("查询某部门某一天有那些人排班:");
            // console.log(data);
            //    数据
            let objs=data.obj;
            if(objs&&objs.length>0){
                $("#showInqDepPerForm").empty();
                for(var i=0;i<objs.length;i++){
                    let html='<div><span class="deptname">'+objs[i].deptname+'</span>&nbsp;&nbsp;<span class="ename blue" empid="'+objs[i].id+'" plantime="'+workday+'">'+objs[i].ename+'</span></div>';
                    $("#showInqDepPerForm").append(html);
                };
                $("#showInqDepPerModal").modal("show");
            }else{msgTips("暂未添加排班日程")};
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//排班设置
$("#addSchedulingSetBut").click(function(){
    $("#schedulingSetForm input,#schedulingSetForm textarea").val("");
    $("#schedulingSetForm .scheduling_status").attr({"optionid":"","modename":""});
    $("#schedulingSetForm .scheduling_status a.dropdown-toggle span").text("");
    $("#addSchedulingSetModal .modal-title").text("添加排班设置");
    $("#submitSchedulingSetBut").attr("type","add").text("添加");
    $("#addSchedulingSetModal").modal("show");
});
//修改
$("#schedulingSetList").on("click",".modifyBut",function(){
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let this_=$(this);
    if(type=="schedulingSet"){
        echoEchoSchedulingSet("schedulingSetForm",this_)
        $("#addSchedulingSetModal .modal-title").text("修改排班设置");
        $("#submitSchedulingSetBut").attr({"type":"modify","ids":ids}).text("修改");
        $("#addSchedulingSetModal").modal("show");
    };
});
$("#submitSchedulingSetBut").click(function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(!ids){ids=""};
    var parameterData=verifySchedulingSet("schedulingSetForm");
    if(type=="add"){
        var ajaxurl="/ucotSmart/workschedulingAction!addWorkscheduling.action";
        var msgtext="添加排班设置";
    }else if(type=="modify"){
        var ajaxurl="/ucotSmart/workschedulingAction!updateWorkscheduling.action";
        var msgtext="修改排班设置";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "workscheduling.id":ids,
            "workscheduling.code":parameterData.code,
            "workscheduling.name":parameterData.name,
            "workscheduling.workarea":parameterData.workarea,
            "workscheduling.content":parameterData.content,
            "workscheduling.starttime":parameterData.starttime,
            "workscheduling.endtime":parameterData.endtime,
            "workscheduling.status":parameterData.status,
            "workscheduling.mark":parameterData.remark
        },
        success: function (data) {
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true){
                schedulingSet();
                $("#addSchedulingSetModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//排班日程
$("#addSchedulingScheduleBut").click(function(){
    $("#addSchedulingScheduleModal .modal-title").text("添加排班日程");
    $("#submitSchedulingScheduleBut").text("添加").attr("type","add");
    scheduleModal();
    $("#SchedulingScheduleForm .workMonth").removeAttr("disabled");
    $("#SchedulingScheduleForm .deptnameMenu").removeAttr("style");
    $("#emploModal").show();
});
function scheduleModal(){
    //调用添加排班日程modal
    $("#SchedulingScheduleForm input").val("");
    $("#SchedulingScheduleForm .workMonth").val(nowYear+"-"+nowMonth);
    $("#SchedulingScheduleForm .dropdown").attr({"optionid":"","modename":""}).find(".dropdown-toggle span").empty();
    $("#pitchOn").empty();
    $("#addSchedulingScheduleModal").modal("show");
};
$("#emploModal").click(function(){
    //人员模态框
    let optionid=$("#deptnameMenu .deptnameMenu").attr("optionid");
    if(optionid){
        let deptname=$("#deptnameMenu .deptnameMenu").attr("optionid");
        staffModal(deptname);
        $("#schedulingStaffModal input.checkboxsBut").attr("checked",false);
        $("#schedulingStaffModal").modal("show").css("z-index","1060");
        $("body .modal-backdrop:last-child").css("z-index","1055");
    }else{
        msgTips("请选择部门");
    };
});
function deWeightScheduling(prefixId,line,type,typeId){
//去重、获取选中
    let checkedString="",selectedStaffId=[],selectedStaffName=[],weekobj=[];
    let inputs=$("#"+prefixId+" input");
    inputs.each(function(){
        if($(this).not(":disabled").is(":checked")){
            let this_id=$(this).attr("ids");
            let this_name=$(this).attr("name");
            let starttime=$(this).attr("starttime");
            let endtime=$(this).attr("endtime");
            let workarea=$(this).attr("workarea");
            let content=$(this).attr("content");
            checkedString=checkedString+","+this_id+":"+this_name;
            let return_value=jQuery.inArray(this_id,selectedStaffId);
            if(return_value==-1){
                selectedStaffId.push(this_id);
                selectedStaffName.push(this_name);
                if(prefixId=="staffModalList"){
                    //去重禁选复选框
                    $(this).prop({"disabled":true,"checked":true});
                }else if(prefixId=="selectSchedulingList"){
                    let weeks={"id":this_id,"name":this_name,"starttime":starttime,"endtime":endtime,"workarea":workarea,"content":content};
                    weekobj.push(weeks);
                };
            };
        };
    });
    if(typeId=="inquireTimeBox"){
        dateOn(weekobj,typeId);
        return;
    };
    if(prefixId=="staffModalList"){
        pitchOn(selectedStaffId,selectedStaffName,checkedString);
    }else if(prefixId=="selectSchedulingList"){
        if(type=="week"){
            weekOn(typeId,weekobj,line);
        }else if(type=="month"){
            monthOn(typeId,weekobj,line);
        };
    }
};
$("#staffModalBut").click(function(){
    //确认选中人员
    deWeightScheduling("staffModalList");
});
$("#selectSchedulingModalBut").click(function(){
    //确认选择排班
    let typeId;
    let line=$(this).attr("line");
    let type=$(this).attr("type");
    let inquire=$(this).attr("inquire");
    if(!inquire){
        if(type=="month"||type=="week"){
            typeId="scheduleBox"
        }
    }else{
        if(inquire=="inquire"){
            typeId="inquireTimeBox"
        };
    };
    deWeightScheduling("selectSchedulingList",line,type,typeId);
    $("#selectSchedulingModalBut").removeAttr("inquire");
});
function pitchOn(selectedStaffId,selectedStaffName,checkedString){
    let pitchOnHtml="";
    for(let i=0;i<selectedStaffId.length;i++){
        pitchOnHtml+='<span ids="'+selectedStaffId[i]+'">'+selectedStaffName[i]+'<i name="'+selectedStaffName[i]+'"  ids="'+selectedStaffId[i]+'">x</i></span>';
    };
    let checkeds=checkedString.substr(1,checkedString.length).replace(/\s/g,"");
    $("#pitchOn").append(pitchOnHtml).attr("ids",checkeds);
    $("#schedulingStaffModal").modal("hide");
};
$("#pitchOn").on("click","i",function(){
    let ids=$(this).attr("ids");
    let name=$(this).attr("name");
    let idstring=$("#pitchOn").attr("ids").replace(ids+":"+name,"").replace(",,",",");
    if(idstring.charAt(0)==","){
        idstring=idstring.substr(1,idstring.length);
    }else if(idstring.charAt(idstring.length-1)==","){
        idstring=idstring.substr(0,idstring.length-1);
    }
    $(this).parent("span").remove();
    $("#pitchOn").attr("ids",idstring);
});
$("#submitSchedulingScheduleBut").click(function(){
    //确认添加排班日程
    let parameterData=verifySchedulingSchedule("SchedulingScheduleForm");
    let type=$(this).attr("type");
    let cycle=$(this).attr("cycle");
    $("#datatitbox").attr({"data":parameterData.month,"parameterData":JSON.stringify(parameterData),"type":type}).text(parameterData.month+"排班周期表");
    if(parameterData.cycle=="1"){
        //按周
        $("#datatitbox").attr("datatype","week");
        weektab();
        if(type=="modify"){
            staffSchedule("scheduleBox","week",parameterData,"modify");
        };
    }else if(parameterData.cycle=="2"){
        //按月
        $("#datatitbox").attr("datatype","month");
        monthtab();
        if(type=="modify"){
            staffSchedule("scheduleBox","month",parameterData,"modify")
        };
    }else if(parameterData.cycle=="0"){
        //复制上月
        createSchedule("copyLastMonth");
    };
});
function dataIsCheckedSche(line,type){
    //排班去重禁选复选框
    let schweeks;
    if(type=="week"){
        schweeks=$("#weekbox div.schweek");
    }else if(type=="month"){
        schweeks=$("#monthbox td.targetmonth[ids="+line+"] span.schmonth");
    }else if(type=="inquireTimeBox"){
        schweeks=$("#inquireTimeBox div.schweek");
    };
    if(schweeks){
        $("#selectSchedulingForm input").prop({"disabled":"","checked":""});
        schweeks.each(function(){
            let ids=$(this).attr("ids");
            if(type=="week"){
                let lines=$(this).attr("line");
                if(lines==line){
                    //去重禁选复选框
                    $("#selectSchedulingList input[ids="+ids+"]").prop({"disabled":"disabled","checked":"checked"});
                };
            }else if(type=="month"||type=="inquireTimeBox"){
                $("#selectSchedulingList input[ids="+ids+"]").prop({"disabled":"disabled","checked":"checked"});
            };
        });
    };
    return schweeks;
}
//--按周排班--
function weektab(){
    //按周
    $("#scheduleBox .tables,#scheduleBox .monthbox,#schedulingMenu").hide();
    $("#scheduleBox .date,#scheduleBox .weekbox,#dateButBox").show();
    $("#scheduleBox .weekbox tr th:first-child").width("110px");
    $("#scheduleBox .weekbox tr td:first-child").width("110px");
    let wth=parseInt(($("#scheduleBox .weekbox table").width()-110)/7);
    $("#scheduleBox .weekbox tr th").not("th:first-child").width(wth);
    $("#scheduleBox .weekbox tr td").not("td:first-child").width(wth-2);
};
$("#scheduleBox .weekbox thead span.blue").click(function(){
    //选择排班弹窗
    let line=$(this).attr("line");
    $("#selectSchedulingModalBut").attr({"line":line,"type":"week"});
    dataIsCheckedSche(line,"week");
    $("#selectSchedulingModal").modal("show");
})
function weekOn(prefixId,weekobj,line){
    let wth=$("#criterionsize").width();
    let hgt=$("#criterionsize").height();
    let leftone=$("#scheduleBox .weekbox tr th:first-child").width();
    let lefts=(line-1)*wth+leftone+20-line;
    let weekOnHtml="";
    for(let i=0;i<weekobj.length;i++){
        let starttime=weekobj[i].starttime.replace("00","").split(":");
        let endtime=weekobj[i].endtime.replace("00","").split(":");
        let content=weekobj[i].name+"&nbsp;&nbsp;&nbsp;&nbsp;"+weekobj[i].starttime+"~"+weekobj[i].endtime;
        let heights,tops;
        if(starttime[1]!="00"){
            tops=hgt*(Number(starttime[0])+1)+hgt*(Number(starttime[1])/60)+20;
        }else{
            tops=hgt*(Number(starttime[0])+1)+20;
        }
        if(endtime[1]!=""){
            heights=hgt*(Number(endtime[0])+2)+hgt*(Number(endtime[1])/60)-tops+20;
        }else{
            heights=hgt*(Number(endtime[0])+2)-tops+20;
        }
        weekOnHtml+='<div class="schweek" ids="'+weekobj[i].id+'" line="'+line+'" style="width:'+wth+'px;height:'+heights+'px;top:'+tops+'px;left:'+lefts+'px;line-height:'+heights+'px;">'+content+'<i>x</i></div>';
    };
    $("#"+prefixId+" .weekbox").append(weekOnHtml);
    $("#selectSchedulingModal").modal("hide");
};
$("#scheduleBox .weekbox").on("click","i",function(){
    //删除选中排班
    $(this).parent("div.schweek").remove();
});
//--按月排班--
function monthtab(type){
    //按月
    let prefixId,dataId,boxId;
    if(!type){
        prefixId="monthbox";
        dataId="datatitbox";
        boxId="scheduleBox";
        $("#"+boxId+" .tables,#"+boxId+" .weekbox,#schedulingMenu").hide();
        $("#"+boxId+" .date,#"+boxId+" .monthbox,#dateButBox").show();
    }else if(type=="lookOver"){
        prefixId="inquireMonthbox";
        dataId="dateTimes";
        boxId="inquireBox";
    }else if(type=="inquire"){
        prefixId="inquireMonthbox";
        dataId="dateTimes";
        boxId="inquireBox";
    };
    $("#"+boxId+" .monthbox table td").removeClass("schmonth targetmonth").empty();
    let wth=$("#"+boxId+" .monthbox table").width()/7;
    $("#"+boxId+" .monthbox tbody th,#"+boxId+" .monthbox tbody td").width(wth);
    let datastr,yaar,month;
    if(dataId=="dateTimes"){
        datastr=$("#"+dataId).text()+"-01";
        yaar=$("#"+dataId).attr("year");
        month=$("#"+dataId).attr("month");
    }else if(dataId=="datatitbox"){
        datastr=$("#"+dataId).attr("data")+"-01";
        yaar=$("#"+dataId).attr("data").substr(0,4);
        month=$("#"+dataId).attr("data").substr(5,2);
    };
    let nowDay = new Date(yaar,month,0);//当前日期
    let nowdaycount = nowDay.getDate();//当月天数
    let nowWeek=getWeek(datastr).whatDay;
    let nowDayNub=getWeek(datastr).nowDayNub;
    for(let i=1;i<=nowDayNub;i++){
        let start=nowWeek+i;
        let row=Math.ceil(start/7);
        let rank=start%7;
        if(rank==0){
            rank=7;
        }
        $("#"+prefixId+" tr:nth-child("+row+") td:nth-child("+rank+")").addClass("targetmonth").attr("ids",i).html('<span class="datetime">'+i+'</span>');
    }
};
$("#monthbox").on("click",".targetmonth",function(e){
    //选择排班弹窗
    if(e.target.tagName!="I"){
        let ids=$(this).attr("ids");
        $("#selectSchedulingModalBut").attr({"line":ids,"type":"month"});
        dataIsCheckedSche(ids,"month");
        $("#selectSchedulingModal").modal("show");
    };
});
function monthOn(prefixId,weekobj,line,type){
    if(type=="inquire"){
        $("#"+prefixId+" .targetmonth[ids="+line+"]").addClass("schmonth")
    }else{
        let weekOnHtml="";
        for(let i=0;i<weekobj.length;i++){
            let content=weekobj[i].name+"&nbsp;&nbsp;&nbsp;&nbsp;"+weekobj[i].starttime+"~"+weekobj[i].endtime;
            weekOnHtml+='<br/><span class="schmonth" ids="'+weekobj[i].id+'" line="'+line+'">'+content+'<i>x</i></span>';
        };
        $("#"+prefixId+" .targetmonth[ids="+line+"]").addClass("schmonth").append(weekOnHtml);
        if(prefixId=="inquireMonthbox"){
            $("#inquireMonthbox .schmonth i").remove();
        };
        $("#selectSchedulingModal").modal("hide");
    };
};
$("#monthbox").on("click",".schmonth i",function(){
    //删除选中排班
    let schmonth=$(this).parents(".targetmonth").find(".schmonth").length;
    let ids=$(this).parents(".targetmonth").attr("ids");
    $(this).parent("span.schmonth").prev("br").remove();
    $(this).parent("span.schmonth").remove();
    if(schmonth<2){
        $("#monthbox .targetmonth[ids="+ids+"]").removeClass("schmonth");
    }else{
        $("#monthbox .targetmonth[ids="+ids+"]").addClass("schmonth");
    };
});
//修改排班
$("#schedulingScheduleList").on("click",".modifyBut",function(){
    let this_=$(this);
    let ids=this_.attr("ids");
    let plandetail=this_.attr("plandetail");
    let cycle=this_.attr("cycle");
    $("#addSchedulingScheduleModal .modal-title").text("修改排班日程");
    $("#submitSchedulingScheduleBut").text("修改").attr({"type":"modify","cycle":cycle,"ids":ids});
    scheduleModal();
    echoEchoScheduleModal("SchedulingScheduleForm",this_);
});
//--生成排班--
function createSchedule(workCycle){
    let type,plandetail,ajaxurl,msgtext;
    if(workCycle=="copyLastMonth"){
        //复制上月
        type="add";
        plandetail="";
    }else{
        type=$("#datatitbox").attr("type");
        let datatype=$("#datatitbox").attr("datatype");
        if(datatype=="week"){
            let schweeks=$("div.schweek");
            let ids1=[],ids2=[],ids3=[],ids4=[],ids5=[],ids6=[],ids7=[];
            schweeks.each(function(){
                let line=$(this).attr("line");
                let ids=$(this).attr("ids");
                eval("ids"+line+".push("+ids+")");
            });
            for(let i=1;i<8;i++){
                eval("ids"+i+".length==0?ids"+i+"=0:ids"+i+".join()")
            };
            plandetail=ids1+";"+ids2+";"+ids3+";"+ids4+";"+ids5+";"+ids6+";"+ids7;
        }else if(datatype=="month"){
            plandetail="";
            let schmonth=$(".targetmonth");
            schmonth.each(function(){
                let line=$(this).attr("line");
                let schmonthspan=$(this).find("span.schmonth");
                let schmonthArr=[];
                schmonthspan.each(function() {
                    let ids=$(this).attr("ids");
                    eval("schmonthArr.push(" + ids + ")");
                });
                if(schmonthArr.length<1){
                    plandetail+="0;";
                }else{
                    plandetail+=schmonthArr.join(",")+";";
                };
            });
            plandetail=plandetail.substr(0,plandetail.length-1);
        };
    }
    let parameterData=JSON.parse($("#datatitbox").attr("parameterdata"));
    if(type=="add"){
        ajaxurl="/ucotSmart/workPlanAction!addWorkPlan.action";
        msgtext="生成排班";
    }else if(type=="modify"){
        ajaxurl="/ucotSmart/workPlanAction!updateWorkPlan.action";
        msgtext="修改排班";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "workPlan.id":parameterData.ids,
            "workPlan.month":parameterData.month,
            "workPlan.deptid":parameterData.deptid,
            "workPlan.deptname":parameterData.deptname,
            "employees":parameterData.employees,
            "workPlan.cycle":parameterData.cycle,
            "workPlan.plandetail":plandetail
        },
        success: function (data) {
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true){
                schedulingSchedule();
                $("#addSchedulingSetModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
    schedulingListPag();
};
$("#dateCreatelBut").click(function(){
    createSchedule();
});
//--取消排班--
$("#dateCancelBut").click(function(){
    //取消
    schedulingListPag();
});
function schedulingListPag(){
    $(".schweek").remove();
    $("#scheduleBox .date,#scheduleBox .weekbox,#scheduleBox .monthbox,#dateButBox").hide();
    $("#scheduleBox .tables,#schedulingMenu").show();
}
//排班查询
function dateAdjuster(type){
    let month=parseInt($("#dateTimes").attr("month"));
    let year=parseInt($("#dateTimes").attr("year"));
    let lth,resetmonth;
    if(type=="left"){
        month--;
        lth=0;
        resetmonth=12;
    }else if(type=="right"){
        month++;
        lth=13;
        resetmonth=1;
    };
    if(month==lth){
        month=resetmonth;
        if(type=="left"){
            year--;
        }else if(type=="right"){
            year++;
        };
    };
    $("#dateTimes").attr("year",year);
    $("#dateTimes").attr("month",month);
    let months=month;
    if(months<10){
        months="0"+months;
    }
    $("#dateTimes").text(year+"-"+months);
};
$("#inquiretitBox .arrowsleft").click(function(){
    dateAdjuster("left")
});
$("#inquiretitBox .arrowsright").click(function(){
    dateAdjuster("right")
});
$("#schedulingScheduleList").on("click",".lookOver",function(){
    let this_obj=$(this).attr("obj");
    let obj=JSON.parse(this_obj);
    let parameterData={
        "month":obj.month.substr(0,7),
        "empid":obj.empid,
        "empname":obj.empname,
        "deptid":obj.deptid,
        "deptname":obj.deptname,
        "cycle":obj.cycle
    };
    $(".scheduling_schedule,#tab_scheduling_schedule").removeClass("active");
    $(".scheduling_inquire,#tab_scheduling_inquire").addClass("active");
    $("#dateTimes").attr("empname",$(this).attr("empname"));
    $("#dateTimes").text(parameterData.month).attr({"empid":$(this).attr("empid"),"year":parameterData.month.substr(0,4),"month":parameterData.month.substr(5,2)});
    staffSchedule("inquireMonthbox","month",parameterData,"lookOver");
    departmentMenu("inquireDepartmentMenu");
    monthtab("lookOver");
});
$("#inquireBox").on("click",".inquireStaffArrange .targetmonth",function(e){
    //选择排班弹窗
    if(e.target.tagName!="I"){
        let empid=$("#dateTimes").attr("empid");
        let day=$(this).attr("ids").length==2?$(this).attr("ids"):"0"+$(this).attr("ids")
        let plantime=$("#dateTimes").text()+"-"+day;
        $("#modifyInquireSchModal").modal("show").find(".modal-title").text($("#dateTimes").attr("empname")+"  "+plantime);
        $("#inquireTimeBox .schweek").remove();
        staffScheduleday(empid,plantime);
    };
});
function dateOn(weekobj,prefixId){
    let wth=$("#timershaftsize").width()+2;
    let weekOnHtml="";
    for(let i=0;i<weekobj.length;i++){
        let starttime=weekobj[i].starttime.replace("00","").split(":");
        let startnub=Number(starttime[0])+Number(starttime[1])/60;
        let endtime=weekobj[i].endtime.replace("00","").split(":");
        let endnub=Number(endtime[0])+Number(endtime[1])/60;
        let content="排班名称："+weekobj[i].name+"<br/>排班区域："+weekobj[i].workarea+"<br/>排班内容："+weekobj[i].content+"<br/>排班时间："+weekobj[i].starttime+"~"+weekobj[i].endtime;
        let widths=wth*(endnub-startnub);
        let lefts=wth*startnub;
        weekOnHtml+='<div class="schweek" ids="'+weekobj[i].id+'" style="min-width:'+wth+'px;width:'+widths+'px;height:180px;top:48px;left:'+lefts+'px;">'+content+'<i>x</i></div>';
    };
    $("#"+prefixId).append(weekOnHtml);
    $("#selectSchedulingModal").modal("hide");
};
$("#modInqBut").click(function(){
    $("#selectSchedulingModal").modal("show").css("z-index","1060");
    $("body .modal-backdrop:last-child").css("z-index","1055");
    $("#selectSchedulingModalBut").attr({"type":"month","inquire":"inquire"});
    dataIsCheckedSche("","inquireTimeBox");
});
$("#inquireTimeBox").on("click",".schweek i",function(){
    //删除选中排班
    $(this).parent("div.schweek").remove();
});
$("#modifyInquireSchModalBut").click(function(){
    let schweekelmt=$("#inquireTimeBox .schweek");
    let planids="";
    schweekelmt.each(function(){
        let ids=$(this).attr("ids");
        planids=planids+","+ids;
    });
    planids=planids.substr(1,planids.length);
    let Workplandetail=JSON.parse($("#modifyInquireSchModalBut").attr("Workplandetail"));
    // console.log(Workplandetail);
    let parameterData={
        "id":Workplandetail[0].id,
        "deptid":Workplandetail[0].deptid,
        "deptname":Workplandetail[0].deptname,
        "empid":Workplandetail[0].empid,
        "empname":Workplandetail[0].empname,
        "plantime":Workplandetail[0].plantime,
        "planids":planids,
        "iswork":1
    };
    modifystaffScheduleday(parameterData);
});
//按部门/全部查询
$("#inquireBox").on("click",".inquireDepartmentArrange .targetmonth",function(){
    //选择排班弹窗
    let day=$(this).attr("ids").length==2?$(this).attr("ids"):"0"+$(this).attr("ids")
    inquireDepartmentPersonnel(day)
});
$("#showInqDepPerForm").on("click",".ename",function(e){
    //选择排班弹窗
    if(e.target.tagName!="I"){
        let empid=$(this).attr("empid");
        let empname=$(this).text();
        let plantime=$(this).attr("plantime");
        $("#modifyInquireSchModal").modal("show").find(".modal-title").text(empname+"  "+plantime);
        $("#inquireTimeBox .schweek").remove();
        staffScheduleday(empid,plantime);
    };
});
//删除
$("#tab_scheduling_management").on("click",".deleteBut",function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(!ids){ids=""};
    let dataObj,callBack,ajaxURL;
    if(type=="schedulingSet"){
        ajaxURL="/ucotSmart/workschedulingAction!deleteWorkscheduling.action";
        callBack="schedulingSet()";
        // 删除排班设置;
    }else if(type=="schedSche"){
        ajaxURL="/ucotSmart/workPlanAction!deleteWorkPlan.action";
        callBack="schedulingSchedule()";
        // 删除排班日程;
    };
    dataObj={"token":permit,"ids":ids};
    deletePubModal(dataObj,callBack,ajaxURL);
});
//搜索
$("#schedulingSearch,#inquiretitBox .arrowsleft,#inquiretitBox .arrowsright").click(function(){
    let this_id=$(this).attr("id");
    if(this_id=="schedulingSearch"){
        $("#dateTimes").removeAttr("empname empid deptid");
    };
    let month=$("#dateTimes").text()+"-01";
    let department=$("#inquireDepartmentMenu .inquireDepartmentMenu").attr("optionid");
    let Staff=$("#inquireStaffMenu .inquireStaffMenu").attr("optionid");
    $("#dateTimes").attr("deptid",department);
    if(!Staff){
        Staff=$("#dateTimes").attr("empid");
    };
    let empname=$("#inquireStaffMenu .inquireStaffMenu").attr("modename");
    monthtab("inquire");
    if(Staff){
        //查员工
        $("#dateTimes").attr({"empid":Staff,"empname":empname});
        let parameterData={
            "empid":Staff,
            "month":month
        };
        staffSchedule("inquireMonthbox","month",parameterData,"lookOver");
    }else if(!Staff||department){
        //查部门
        schedulingInquire()
    };
});
//-------------------打印---------------------------
$("#printScheduling").click(function(){
    sectionalPrint("inquireBox","排班查询");
});
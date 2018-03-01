/**
 * Created by along on 2017/12/20.
 */
//schedulingType查询类型（巡检名称name、巡检计划plan、巡检查询inquire、巡检详情particulars 重要条件参数！）
var routeRedactFormHtml="";
function insInitialize(insType){
    if(insType=="plan"){
        $("#insPlanTime").val();
        $("#insPlanMenu .insPlanMenu").attr({"optionid":"","modename":"全部部门"}).find("a.dropdown-toggle span").text("全部部门");
    };
    pageDataIns(insType);
};
$("#property_management_menu .inspection_management a").click(function (){
    pageDataIns("name");
});
//--回显赋值--
function echoEchoInsName(prefixId,this_){
    $("#"+prefixId+" .inscode").val($(this_).parents("tr").find("td").eq(0).text());//巡检编号
    $("#"+prefixId+" .insname").val($(this_).parents("tr").find("td").eq(1).text());//巡检名称
    $("#"+prefixId+" .patrolpoints").text($(this_).parents("tr").find("td").eq(2).attr("pointnamesTexe")).attr("patrolpoints",$(this_).parents("tr").find("td").eq(2).attr("patrolpoints"));//巡查路线
    $("#"+prefixId+" #insNameStatus .insNameStatus").attr({"modename":$(this_).parents("tr").find("td").eq(4).attr("statusText"),"optionid":$(this_).parents("tr").find("td").eq(4).attr("status")});
    $("#"+prefixId+" #insNameStatus .insNameStatus a.dropdown-toggle span").text($(this_).parents("tr").find("td").eq(4).attr("statusText"));
    $("#"+prefixId+" .insmark").val($(this_).parents("tr").find("td").eq(5).attr("remark"));//备注
};
function echoEchoInsPlaneModal(prefixId,this_){
    $("#"+prefixId+" .workMonth").val($(this_).parents("tr").find("td").eq(2).text()).attr("disabled","disabled");//排班月份
    let optionid=$(this_).parents("tr").find("td").eq(0).attr("deptid");
    let deptname=$(this_).parents("tr").find("td").eq(0).text();
    $("#"+prefixId+" .insPlanDeptnameMenu").attr({"optionid":optionid,"modename":deptname}).css("overflow","hidden").find("a.dropdown-toggle span").text(deptname);//部门名称
    let empid=$(this_).parents("tr").find("td").eq(1).attr("empid");
    let empname=$(this_).parents("tr").find("td").eq(1).text()
    let emptext='<span ids="'+empid+'">'+empname+'<i name="'+empname+'" ids="'+empid+'">x</i></span>';
    $("#"+prefixId+" .pitch-on").html(emptext).attr({"ids":empid+":"+empname,"empid":empid});//姓名
    let cycle=$(this_).parents("tr").find("td").eq(3).attr("cycle");
    let cyclename=$(this_).parents("tr").find("td").eq(3).text();
    $("#"+prefixId+" .workCycle").attr({"optionid":cycle,"modename":cyclename}).find("a.dropdown-toggle span").text(cyclename);//排班周期
};
//--表单验证--
function verifyInsName(prefixId){
    let code=$("#"+prefixId+" .inscode").val();//巡检编号
    if(!code){msgTips("请填写巡检编号");return;};
    let name=$("#"+prefixId+" .insname").val();//巡检名称
    if(!name){msgTips("请填写巡检名称");return;};
    let patrolpoints=$("#"+prefixId+" .patrolpoints").attr("patrolpoints");//巡查路线
    if(!patrolpoints){msgTips("请选择巡查路线");return;};
    let status=$("#"+prefixId+" #insNameStatus .insNameStatus").attr("optionid");//状态
    if(!status){msgTips("请选择状态");return;};
    let remark=$("#"+prefixId+" .insmark").val();//备注
    let formData={
        "patrolpoints":patrolpoints,
        "code":code,
        "name":name,
        "status":status,
        "remark":remark
    };
    return formData;
};
function verifyInsPlan(prefixId){
    let month=$("#"+prefixId+" .workMonth").val();//巡检月份
    //month=month.substr(0,month.length-3);
    if(!month){msgTips("请选择巡检月份");return;};
    let deptid=$("#"+prefixId+" .insPlanDeptnameMenu").attr("optionid");//部门名称
    let deptname=$("#"+prefixId+" .insPlanDeptnameMenu").attr("modename");
    if(!deptid){msgTips("请选择部门名称");return;};
    let empid=$("#"+prefixId+" #insPitchOn").attr("empid")
    let employees=$("#"+prefixId+" #insPitchOn").attr("ids");//员工姓名
    if(!employees){msgTips("请选择员工姓名");return;};
    let cycle=$("#"+prefixId+" .workCycle").attr("optionid");//巡检周期
    let workCycleText=$("#"+prefixId+" .workCycle").attr("modename");
    if(!cycle){msgTips("请选择巡检周期");return;};
    let cycleold=$("#submitInsPlanBut").attr("cycle");
    let ids=$("#submitInsPlanBut").attr("ids");
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
    $("#addInsPlanModal").modal("hide");
    return formData;
};
//--查询方法--
function pageDataIns(insType){
    // console.log("查询");
    if(insType=="name"){
        insName();
    }else if(insType=="plan"){
        $("#insPlanTime").val("");
        departmentMenu("insPlanDeptnameMenu");
        departmentMenu("insPlanMenu");
        insPlanSelect();
        insPlan();
    }else if(insType=="inquire"){
        departmentMenu("inquireInsDepartmentMenu");
        insPlanSelect();
        let Month;
        if(nowMonth<10){
            Month="0"+nowMonth;
        }else{Month=nowMonth;}
        $("#insDateTimes").text(nowYear+"-"+Month).attr({"year":nowYear,"month":Month});
        $("#inquireInsDepartmentMenu .inquireInsDepartmentMenu").attr({"optionid":"","modename":"全部部门"}).find("a.dropdown-toggle span").text("全部部门");
        $("#inquireInsStaffMenu .inquireInsStaffMenu").attr({"optionid":"","modename":"全部员工"}).find("a.dropdown-toggle span").text("全部员工");
        $("#inquireInsStaffMenu .inquireInsStaffMenu .dropdown-menu").empty();
        insPlanInquire();
    }else if(insType=="particulars"){
        $("#insPlanStartTime,#insPlanEndTime").val("");
        insPlanParticulars();
    };
};
function insName(page,type){
    //巡检名称
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolareaAction!queryPatrolarea.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            // console.log("查询巡检名称:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_ins_name .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_ins_name .pagingImplement .pageList").hide();
                $("#insNameList").html("<p>暂无数据</p>");
                $("#tab_ins_name .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_ins_name",{"functions":"insName(homelistPage,'paging')"});
                };
                var htmlList='',lth=20;
                for(var i=0;i<10;i++){
                    if(obj[i]) {
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
                        let pointnamesArr=obj[i].pointnames.split(",");
                        let pointnamesTexe="";
                        for (n in pointnamesArr){
                            pointnamesTexe=pointnamesTexe+"&nbsp;&gt;&gt;&gt;&nbsp;"+pointnamesArr[n];
                        };
                        pointnamesTexe=pointnamesTexe.substr(18,pointnamesTexe.lenght);
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].code+'</td>';
                        htmlList+='<td>'+obj[i].name+'</td>';
                        htmlList+='<td pointnamesTexe="'+pointnamesTexe+'" patrolpoints="'+obj[i].pointnames+'"><span class="blue" onclick=previewModal("巡检路线","'+pointnamesTexe+'")>查看详情</span></td>';
                        let previewContent='atrolpPoint(\''+obj[i].pointids+'\',\'fun\',\'previewContent\')';
                        htmlList+='<td><span class="blue" onclick=previewModal("巡检点位","'+previewContent+'","eval")>查看详情</span></td>';
                        if(obj[i].status==0){
                            htmlList+='<td statusText="'+statusText+'" status="'+obj[i].status+'"><span class="status" style="color:#ff0000">'+statusText+'<span></td>';
                        }else{
                            htmlList+='<td statusText="'+statusText+'" status="'+obj[i].status+'">'+statusText+'</td>';
                        };
                        if(remark.length>lth){
                            var remarkTex=remark.substring(0,lth);
                            htmlList+= '<td remark="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/\s/g,"")+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td remark="'+remark+'">'+remark+'</td>';
                        }
                        htmlList+='<td><a class="modifyBut" ids="'+obj[i].id+'" pointids="'+obj[i].pointids+'" type="insName">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="insName">删除</a></td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#insNameList").html(htmlList);
                wipeNull("insNameList");
            }
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function atrolpPoint(ids,type,prefixId){
    //查询巡检点详情
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolpointAction!queryPatrolpointByIds.action",
        dataType: "json",
        data: {
            "token":permit,
            "ids":ids
        },
        success: function (data) {
            // console.log("查询巡检点详情:");
            // console.log(data);
            //    数据
            let obj=data.obj.data;
            if(obj){
                var htmlList='',patrolpoints='';
                for(var i=0;i<obj.length;i++){
                    let Parameter=obj[i].id+","+obj[i].areaid+","+obj[i].name+","+token;
                    if(type=="fun"){
                        htmlList+='<div class="routeBox"><ul class="list-unstyled clearfix large-half">';
                        htmlList+='<li style="margin-bottom: 5px;"><span>巡检点位:</span><span type="text" class="input_dianw" style="display: inline;">'+obj[i].code+'</span></li>';
                        htmlList+='<li class="but" style="margin-bottom: 5px;"><span class="qrcode blue" type="codeBut" blue="true" style="display: inline;" Parameter="'+Parameter+'">生成二维码</span></li>';
                        htmlList+='<li class="totalLength" style="margin-bottom: 5px;"><span>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</span><span type="text" class="span_minc" style="display: inline;">'+obj[i].name+'</span></li>';
                        htmlList+='<li style="margin-bottom: 5px;"><span>超时时间:</span><span type="text" class="span_cssj" style="display: inline;">'+obj[i].overminute+'分钟</span></li>';
                        htmlList+='<li style="margin-bottom: 5px;"><span style="margin-left: 1rem;">漏检时限:</span><span type="text" class="span_njsx" style="display: inline;">'+obj[i].missminute+'分钟</span></li>';
                        htmlList+='</ul></div>';
                    }if(type=="lookPT"){
                        htmlList+='<div class="routeBox"><ul class="list-unstyled clearfix large-half">';
                        htmlList+='<li style="margin-bottom: 5px;"><span>巡检点位:</span><span type="text" class="input_dianw" style="display: inline;">'+obj[i].code+'</span></li>';
                        htmlList+='<li class="but" style="margin-bottom: 5px;"><span class="lookPT blue" type="lookPT" blue="true" ids="'+obj[i].id+'" style="display: inline;">查看</span></li>';
                        htmlList+='<li class="totalLength" style="margin-bottom: 5px;"><span>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</span><span type="text" class="span_minc" style="display: inline;">'+obj[i].name+'</span></li>';
                        htmlList+='<li style="margin-bottom: 5px;"><span>超时时间:</span><span type="text" class="span_cssj" style="display: inline;">'+obj[i].overminute+'分钟</span></li>';
                        htmlList+='<li style="margin-bottom: 5px;"><span style="margin-left: 1rem;">漏检时限:</span><span type="text" class="span_njsx" style="display: inline;">'+obj[i].missminute+'分钟</span></li>';
                        htmlList+='</ul></div>';
                    }else if(prefixId=="routeRedactForm"){
                        patrolpoints = patrolpoints + ";" + obj[i].code + "," + obj[i].name + "," + obj[i].overminute + "," + obj[i].missminute;
                        htmlList += '<div class="routeBox"><ul class="list-unstyled clearfix large-half">';
                        htmlList += '<li style="margin-bottom: 5px;">';
                        htmlList += '<span>巡检点位:</span>';
                        htmlList += '<span class="input_dianw">' + obj[i].code + '</span>';
                        htmlList += '</li>';
                        htmlList += '<li class="but" style="margin-bottom: 5px;">';
                        htmlList += '<span class="operate finish blue" type="finishBut" blue="false" style="display: none;">完成</span>';
                        htmlList += '<span class="operate add blue" type="addBut" blue="true" style="display: inline;">添加下一行</span>';
                        htmlList += '<span class="operate delete blue" type="deleteBut" blue="true" style="display: inline;">删除</span>';
                        htmlList += '<span class="operate edit blue" type="editBut" blue="true" style="display: inline;">编辑</span>';
                        htmlList += '</li>';
                        htmlList += '<li class="totalLength" style="margin-bottom: 5px;">';
                        htmlList += '<span>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</span>';
                        htmlList += '<input type="text" class="input_minc"  style="display: none;" value="' + obj[i].name + '">';
                        htmlList += '<span type="text" class="span_minc" style="display: inline;">' + obj[i].name + '</span>';
                        htmlList += '</li>';
                        htmlList += '<li style="margin-bottom: 5px;">';
                        htmlList += '<span>超时时间:</span>';
                        htmlList += '<input type="text" class="input_cssj" value="' + obj[i].missminute + '" style="display: none;">';
                        htmlList += '<span class="units" style="display: none;">分钟</span>';
                        htmlList += '<span type="text" class="span_cssj" style="display: inline;" timeout="' + obj[i].overminute + '">' + obj[i].overminute + '分钟</span>';
                        htmlList += '</li>';
                        htmlList += '<li style="margin-bottom: 5px;">';
                        htmlList += '<span style="margin-left: 1rem;">漏检时限:</span>';
                        htmlList += '<input type="text" class="input_njsx" value="' + obj[i].overminute + '" style="display: none;">';
                        htmlList += '<span class="units" style="display: none;">分钟</span>';
                        htmlList += '<span type="text" class="span_njsx" style="display: inline;" timeomit="' + obj[i].missminute + '">' + obj[i].missminute + '分钟</span>';
                        htmlList += '</li>';
                        htmlList += '</ul></div>';
                    }
                };
                if(prefixId=="previewContent"){
                    $("#previewContent").html(htmlList);
                }else if(prefixId=="routeRedactForm"){
                    $("#routeRedactForm").html(htmlList);
                    patrolpoints=patrolpoints.substr(1,patrolpoints.length-1);
                    $("#insNameForm .patrolpoints").attr("patrolpoints",patrolpoints);
                };
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function insPlan(page,type){
    let month=$("#insPlanTime").val();
    if(!month){month=""};
    let deptid=$("#insPlanMenu .insPlanMenu").attr("optionid");
    if(!deptid){deptid=""};
    //巡检计划
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolsettingAction!queryPatrolsetting.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "patrolsetting.month":month,
            "patrolsetting.deptid":deptid
        },
        success: function (data) {
            // console.log("查询巡检计划:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#insPlanBox .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#insPlanBox .pagingImplement .pageList").hide();
                $("#insPlanList").html("<p>暂无数据</p>");
                $("#insPlanBox .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"insPlanBox",{"functions":"insPlan(homelistPage,'paging')"});
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
                        htmlList+='<td><a class="lookOver" obj=\''+JSON.stringify(obj[i])+'\' type="lookOver">查看</a>|<a class="modifyBut" ids="'+obj[i].id+'" cycle="'+obj[i].cycle+'" patroldetail="'+obj[i].patroldetail+'" type="schedSche">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="schedSche">删除</a></td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#insPlanList").html(htmlList);
                wipeNull("insPlanList");
            }
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function insStaffModal(page,type){
    let deptno=$("#insPlanDeptnameMenu .insPlanDeptnameMenu").attr("optionid");
    let month=$("#insPlanForm .workMonth").val()+"-01";
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/employeeAction!queryNoPatrolEmployee.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "deptno":deptno,
            "month":month
        },
        success: function (data) {
            // console.log("查询人员:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#insStaffModal .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#insStaffModalList").html("<p>暂无数据</p>");
                $("#insStaffModal .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"insStaffModal",{"functions":"insStaffModal(homelistPage,'paging')"});
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
                $("#insStaffModalList").html(htmlList);
                //去重
                $("#insPitchOn span").each(function(){
                    var ids=$(this).attr("ids");
                    $("#insStaffModalList input[ids="+ids+"]").prop({"disabled":"disabled","checked":"checked"});
                });
                wipeNull("insStaffModalList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function insPlanSelect(page,type){
    //查询巡检路线
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolareaAction!queryPatrolarea.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            // console.log("查询巡检路线:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#selectInsPlanForm .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#selectInsPlanForm .pagingImplement .pageList").hide();
                $("#selectInsPlanList").html("<p>暂无数据</p>");
                $("#selectInsPlanForm .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"selectInsPlanForm",{"functions":"insPlanSelect(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<obj.length;i++){
                    let remark=obj[i].mark;
                    if(!remark){remark=""}
                    let statusText;
                    let pointnamesArr=obj[i].pointnames.split(",");
                    let pointnamesTexe="";
                    for (n in pointnamesArr){
                        pointnamesTexe=pointnamesTexe+"&nbsp;&gt;&gt;&gt;&nbsp;"+pointnamesArr[n];
                    };
                    pointnamesTexe=pointnamesTexe.substr(18,pointnamesTexe.lenght);
                    htmlList+='<tr>';
                    htmlList+='<td>'+obj[i].code+'</td>';
                    htmlList+='<td>'+obj[i].name+'</td>';
                    htmlList+='<td pointnamesTexe="'+pointnamesTexe+'" patrolpoints="'+obj[i].pointnames+'"><span class="blue" onclick=previewModal("巡检路线","'+pointnamesTexe+'")>查看详情</span></td>';
                    let previewContent='atrolpPoint(\''+obj[i].pointids+'\',\'fun\',\'previewContent\')';
                    htmlList+='<td><span class="blue" onclick=previewModal("巡检点位","'+previewContent+'","eval")>查看详情</span></td>';
                    if(remark.length>lth){
                        var remarkTex=remark.substring(0,lth);
                        htmlList+= '<td remark="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark+'")>详细</span></td>';
                    }else{
                        htmlList+= '<td remark="'+remark+'">'+remark+'</td>';
                    }
                    htmlList+='<td><span class="blue choiceBut" ids="'+obj[i].id+'" content="'+obj[i].content+'" workarea="'+obj[i].workarea+'" name="'+obj[i].name+'" starttime="'+obj[i].starttime+'" overminute="'+obj[i].overmiute+'">选择</span></td>';
                    htmlList+='</tr>';
                };
                $("#selectInsPlanList").html(htmlList);
                wipeNull("selectInsPlanList");
                let line=$("#selectInsPlanModalBut").attr("line");
                dataIsChecked(line,"week");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function staffInsPlan(prefixId,type,parameterData,opnType){
    if(parameterData.cycleold=="2"&&parameterData.cycle=="1"){
        return
    };
    //某人某月的巡检计划
    let ajaxurl;
    if(opnType=="modify"){
        ajaxurl="/ucotSmart/patrolsettingAction!backfillPatrolsetting.action";
    }else if(opnType=="lookOver"){
        $("#insInquireMonthbox").addClass("inquireStaffArrange").removeClass("inquireDepartmentArrange");
        ajaxurl="/ucotSmart/patrolsettingAction!queryMonthPatrolByEmployee.action";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "employees":parameterData.employees,
            "patrolsetting.id":parameterData.ids,
            "patrolsetting.deptid":parameterData.deptid,
            "patrolsetting.deptname":parameterData.deptname,
            "patrolsetting.empid":parameterData.empid,
            "patrolsetting.month":parameterData.month,
            "patrolsetting.cycle":parameterData.cycle
        },
        success: function (data) {
            console.log("某人某月的巡检计划:");
            console.log(data);
            if(data.success==true){
                let obj=data.obj;
                if(obj) {
                    //    数据
                    $("#insInquireMonthbox td.schmonth").removeClass("schmonth").find(".schmonth").remove();
                    $("#insInquireMonthbox span.schmonth,#insInquireMonthbox br").remove();
                    for (let i = 0; i < obj.length; i++)
                        if (type == "week") {
                            if(obj[i].length>0){
                                insWeekOn(prefixId,obj[i],i+1);
                            };
                        } else if (type == "month") {
                            if(obj[i].length>0){
                                insMonthOn(prefixId,obj[i],i+1);
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
function staffInsPlanday(empid,plantime){
    //查询某员工某天的巡检
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patroldetailAction!queryPatroldetail.action",
        dataType: "json",
        data: {
            "token":permit,
            "patroldetail.empid":empid,
            "patroldetail.starttime":plantime
        },
        success: function (data) {
            // console.log("查询某员工某天的巡检:");
            // console.log(data);
            if(data.success==true){
                let obj=data.obj.data;
                if(obj) {
                    //    数据
                    insdateOn(obj,"insPlanTimeBox");
                    $("#modifyInsPlanModalBut").attr("Workplandetail",JSON.stringify(obj[0]));
                }
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function modifyInsPlanday(parameterData){
    //编辑某员工某日的巡检
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patroldetailAction!updatePatroldetail.action",
        dataType: "json",
        data: {
            "token":permit,
            "patroldetail.starttime":parameterData.starttime,
            "patroldetail.deptid":parameterData.deptid,
            "patroldetail.deptname":parameterData.deptname,
            "patroldetail.empid":parameterData.empid,
            "patroldetail.empname":parameterData.empname,
            "patroldetail.starttime":parameterData.starttime,
            "details":parameterData.details
        },
        success: function (data) {
            // console.log("编辑某员工某日的巡检:");
            // console.log(data);
            if(data.success==true){
                //    数据
                $("#modifyInsPlanModal,#showInsPlanModal").modal("hide");
                let parData={
                    "month":parameterData.starttime,
                    "empid":parameterData.empid
                };
                staffInsPlan("insInquireMonthbox","month",parData,"lookOver");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function insPlanInquire(){
    //某月那些天有人巡检
    $("#insInquireMonthbox").addClass("inquireDepartmentArrange").removeClass("inquireStaffArrange");
    let date=$("#insDateTimes").text();
    let deptid=$("#inquireInsDepartmentMenu .inquireInsDepartmentMenu").attr("optionid");
    if(!deptid){deptid=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolsettingAction!queryIsPatrolsetByDeptid.action",
        dataType: "json",
        data: {
            "token":permit,
            "patrolsetting.month":date+"-"+"01",
            "patrolsetting.deptid":deptid
        },
        success: function (data) {
            // console.log("某月那些天有人巡检:");
            // console.log(data);
            //    数据
            insMonthtab("inquire");
            var obj=data.obj;
            if(obj){
                //let objArr=obj.split(",");
                for(let i=0;i<obj.length;i++){
                    if(obj[i]=="1"){
                        insMonthOn("insInquireBox","",i+1,"inquire");
                    };
                };
            }else{
                $("#insInquireMonthbox td.schmonth").removeClass("schmonth").find(".schmonth").remove();
                msgTips(data.msg);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function inquireInsPlanPersonnel(day){
    //某一天有那些人巡检
    let ids=$("#insDateTimes").attr("deptid");
    if(!ids){ids=""};
    let workday=$("#insDateTimes").text()+"-"+day;
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patroldetailAction!queryPatrolEmployees.action",
        dataType: "json",
        data: {
            "token":permit,
            "patroldetail.deptid":ids,
            "patroldetail.starttime":workday
        },
        success: function (data) {
            // console.log("查询某一天有那些人巡检:");
            // console.log(data);
            //    数据
            let objs=data.obj;
            if(objs&&objs.length>0){
                $("#showInsPlanForm").empty();
                for(var i=0;i<objs.length;i++){
                    let html='<div><span class="deptname">'+objs[i].deptname+'</span>&nbsp;&nbsp;<span class="ename blue" empid="'+objs[i].id+'" plantime="'+workday+'">'+objs[i].ename+'</span></div>';
                    $("#showInsPlanForm").append(html);
                };
                $("#showInsPlanModal").modal("show");
            }else{msgTips("暂未添加巡检")};
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function insPlanParticulars(page,type){
    //查询巡检详情
    let starttime=$("#insPlanStartTime").val();
    if(!starttime){starttime=""};
    let endtime=$("#insPlanEndTime").val();
    if(!endtime){endtime=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolpointreccordAction!queryPatrolareareccord.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "starttime":starttime,
            "endtime":endtime
        },
        success: function (data) {
            // console.log("查询巡检详情:");
            // console.log(data);
            //    数据
            if (data.obj) {
                var obj = data.obj.data;
                var pageList = obj.length;
                var totalNum = data.obj.data_count;
                $("#tab_ins_particulars .pagingImplement .pageTips").text("当前页面共" + pageList + "条数据 总共" + totalNum + "条数据");
            };
            if (totalNum == 0) {
                $("#tab_ins_particulars .pagingImplement .pageList").hide();
                $("#insParticularsList").html("<p>暂无数据</p>");
                $("#tab_ins_particulars .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            } else if (obj) {
                if (!type || type != "paging") {
                    pagingPlugin(pageList, totalNum, "tab_ins_particulars", {"functions": "insPlanParticulars(homelistPage,'paging')"});
                };
                var htmlList = '', lth = 20,jsonExl=[];
                for (let i = 0; i < 10; i++) {
                    if (obj[i]) {
                        let liston={
                            "巡检编号":obj[i].code,
                            "巡检名称":obj[i].name,
                            "正常数量":obj[i].normaltimes,
                            "漏检数量":obj[i].misstimes,
                            "超时数量":obj[i].overtimes
                        };
                        jsonExl.push(liston);
                        htmlList += '<tr>';
                        htmlList += '<td>' + obj[i].code + '</td>';
                        htmlList += '<td>' + obj[i].name + '</td>';
                        htmlList += '<td>' + obj[i].normaltimes + '</td>';
                        htmlList += '<td>' + obj[i].misstimes + '</td>';
                        htmlList += '<td>' + obj[i].overtimes + '</td>';
                        if(obj[i].normaltimes!=0||obj[i].misstimes!=0||obj[i].overtimes!=0){
                            let previewContent='atrolpPoint(\''+obj[i].pointids+'\',\'lookPT\',\'previewContent\')';
                            htmlList += '<td><a class="lookPT" onclick=previewModal("巡检点位","'+previewContent+'","eval") type="lookPT">查看点位详情</a></td>';
                        }else{
                            htmlList += '<td><span style="color:#ccc;">查看点位详情</span></td>';
                        };
                        htmlList += '</tr>';
                    } else {
                        htmlList += '<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    }
                    ;
                };
                $("#insParticularsList").html(htmlList);
                wipeNull("insParticularsList");
                localStorage.jsonExl=JSON.stringify(jsonExl);
            }
            ;
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function insPlanPTParticulars(id,page,type){
    //查看巡检点位
    let starttime=$("#insPlanStartTime").val();
    if(!starttime){starttime=""};
    let endtime=$("#insPlanEndTime").val();
    if(!endtime){endtime=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/patrolpointreccordAction!queryPatrolpointreccord.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "patrolpointreccord.pointid":id,
            "starttime":starttime,
            "endtime":endtime
        },
        success: function (data) {
            // console.log("查看巡检点位:");
            // console.log(data);
            //    数据
            if(data.obj.data.length>0){
                if (data.obj) {
                    var obj = data.obj.data;
                    var pageList = obj.length;
                    var totalNum = data.obj.data_count;
                    $("#tab_ins_particulars .pagingImplement .pageTips").text("当前页面共" + pageList + "条数据 总共" + totalNum + "条数据");
                };
                if (totalNum == 0) {
                    $("#tab_ins_particulars .pagingImplement .pageList").hide();
                    $("#insPTList").html("<p>暂无数据</p>");
                    $("#tab_ins_particulars .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
                } else if (obj) {
                    $("#insParticulars,#searchInsParticulars").hide();
                    $("#insPT,#backParticulars").show();
                    $("#insPlanStartTime,#insPlanEndTime").attr("disabled","disabled");
                    if (!type || type != "paging") {
                        pagingPlugin(pageList, totalNum, "tab_ins_particulars", {"functions": "insPlanParticulars(id,homelistPage,'paging')"});
                    };
                    var htmlList = '', lth = 20,jsonExl=[];
                    for (var i = 0; i < 10; i++) {
                        if (obj[i]) {
                            let img=obj[i].image;
                            if(!img){img=""};
                            let status=obj[i].status;
                            let statusCor="";
                            switch (status){
                                case 0:status="正常";
                                    statusCor="";
                                    break;
                                case 1:status="超时";
                                    statusCor="#f19149";
                                    break;
                                case 2:status="漏检";
                                    statusCor="#ff0000";
                                    break;
                            };
                            let liston={
                                "巡检时间":obj[i].patroltime,
                                "巡检人":obj[i].empname,
                                "巡检内容":obj[i].pointname,
                                "巡检照片":obj[i].image,
                                "状态":status
                            };
                            jsonExl.push(liston);
                            htmlList += '<tr>';
                            htmlList += '<td>' + obj[i].patroltime + '</td>';
                            htmlList += '<td>' + obj[i].empname + '</td>';
                            htmlList += '<td>' + obj[i].pointname + '</td>';
                            htmlList += '<td><img src="'+img+'"></td>';
                            htmlList += '<td style="color:'+statusCor+'">' + status + '</td>';
                            htmlList += '</tr>';
                        } else {
                            htmlList += '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                        }
                        ;
                    };
                    $("#insPTList").html(htmlList);
                    wipeNull("insPTList");
                    localStorage.jsonExl=JSON.stringify(jsonExl);
                };
            }else{
                msgTips("未查询到相关数据");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//巡检名称
function routeRedactHtml(prefixId,type){
    //添加巡检点位
    let html='<div class="routeBox"><ul class="list-unstyled clearfix large-half">'+
        '<li style="margin-bottom: 20px;">'+
        '<span>巡检点位:</span>'+
        '<span class="input_dianw">01</span>'+
            //'<span type="text" class="span_dianw" style="display: inline;"></span>'+
        '</li>'+
        '<li class="but" style="margin-bottom: 20px;">'+
        '<span class="operate finish blue" type="finishBut" blue="false" style="display: inline;">完成</span>'+
            //'<span class="operate code blue" type="codeBut" blue="true" style="display: none;">生成二维码</span>'+
        ' <span class="operate add blue" type="addBut" blue="true" style="display: none;">添加下一行</span>'+
        ' <span class="operate delete blue" type="deleteBut" blue="true" style="display: none;">删除</span>'+
        '<span class="operate edit blue" type="editBut" blue="true" style="display: none;">编辑</span>'+
        '</li>'+
        '<li class="totalLength" style="margin-bottom: 20px;">'+
        '<span>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</span>'+
        '<input type="text" class="input_minc"  style="display: inline;">'+
        '<span type="text" class="span_minc" style="display: none;"></span>'+
        '</li>'+
        '<li style="margin-bottom: 20px;">'+
        '<span>超时时间:</span>'+
        '<input type="text" class="input_cssj" value="30" style="display: inline;">'+
        '<span class="units" style="display: inline;">分钟</span>'+
        '<span type="text" class="span_cssj" style="display: none;">30分钟</span>'+
        '</li>'+
        '<li style="margin-bottom: 20px;">'+
        '<span style="margin-left: 1rem;">漏检时限:</span>'+
        '<input type="text" class="input_njsx" value="60" style="display: inline;">'+
        '<span class="units" style="display: inline;">分钟</span>'+
        '<span type="text" class="span_njsx" style="display: none;">60分钟</span>'+
        '</li>'+
        '</ul></div>';
    if(type=="after"){
        prefixId.after(html);
    }else if(type=="html"){
        prefixId.html(html);
    };
    $("#submitInsNameBut,#submitRouteRedactBut").attr("forbidden","forbidden");
};
$("#routeRedactForm").on("click",".operate",function(){
    let this_=$(this);
    let father_box=this_.parents("div.routeBox");
    let type=this_.attr("type");
    if(type=="editBut"){
        //编辑
        this_.siblings(".edit,.delete,.add").hide();
        this_.siblings(".finish").show();
        father_box.find("li").css("margin-bottom","20px");
        father_box.find("input,.units").show();
        father_box.find("span[type='text']").hide();
        this_.hide();
    }else if(type=="deleteBut"){
        //删除
        let lth=$("#routeRedactForm .routeBox").length;
        if(lth<2){
            msgTips("至少要添加1个路线");
        }else{
            father_box.remove();
        };
    }else if(type=="addBut"){
        //添加
        routeRedactHtml(father_box,"after");
        $("#submitInsNameBut,#submitRouteRedactBut").attr("forbidden","forbidden");
        $("#routeRedactForm .routeBox").each(function(i,e){
            let idx=i+1;
            if(idx<10){
                idx="0"+idx;
            };
            $(this).find(".input_dianw").text(idx);
        });
        //$("#submitRouteRedactBut").addClass("btn-default").attr("forbid","forbid");
    }else if(type=="codeBut"){
        //生成二维码
    }else if(type=="finishBut"){
        //完成
        let name=father_box.find(".input_minc").val();//路线名称
        if(!name){msgTips("请填写路线名称");return;};
        let cssj=father_box.find(".input_cssj").val();//超时时间
        if(!cssj){msgTips("请填写超时时间");return;};
        let njsx=father_box.find(".input_njsx").val();//漏检时限
        if(!njsx){msgTips("请填写漏检时限");return;};
        this_.siblings(".edit,.delete,.add").show();
        father_box.find("li").css("margin-bottom","5px");
        father_box.find("span[type='text']").show();
        father_box.find("input,.units").hide();
        this_.hide();
        father_box.find(".span_dianw").text(father_box.find(".input_dianw").val());
        father_box.find(".span_minc").text(father_box.find(".input_minc").val());
        father_box.find(".span_cssj").text(father_box.find(".input_cssj").val()+"分钟").attr("timeout",father_box.find(".input_cssj").val());
        father_box.find(".span_njsx").text(father_box.find(".input_njsx").val()+"分钟").attr("timeomit",father_box.find(".input_njsx").val());
        $("#submitInsNameBut,#submitRouteRedactBut").removeAttr("forbidden");
    };
});
$("#routeRedact").click(function(){
    //编辑路线
    $("#routeRedactModal").modal("show").css("z-index","1060");
    $("body .modal-backdrop:last-child").css("z-index","1055");
});
$("#submitRouteRedactBut").click(function(){
    //提交路线
    if($(this).attr("forbidden")){
        msgTips("请完成路线编辑");
        return;
    }
    let location="",patrolpoints="";
    $("#routeRedactForm .routeBox").each(function(i,e){
        let nub=$(this).find(".input_dianw").text();
        let name=$(this).find(".span_minc").text();
        let timeout=$(this).find(".span_cssj").attr("timeout");
        let timeomit=$(this).find(".span_njsx").attr("timeomit");
        location=location+"&nbsp;&gt;&gt;&gt;&nbsp;"+name;
        patrolpoints=patrolpoints+";"+nub+","+name+","+timeout+","+timeomit
    });
    location=location.substr(18,location.lenght);
    patrolpoints=patrolpoints.substr(1,patrolpoints.lenght);
    $("#insNameForm #route").html(location).attr("patrolpoints",patrolpoints);
    routeRedactFormHtml=$("#routeRedactForm").html();
    $("#routeRedactModal").modal("hide");
});
$("#addInsName").click(function(){
    //添加巡检
    //清空表单
    $("#insNameForm input,#insNameForm textarea").val("");
    $("#insNameForm .patrolpoints").attr("patrolpoints","").empty();
    $("#routeRedactForm").empty();
    $("#insNameForm #insNameStatus .insNameStatus").attr({"modename":"","optionid":""});
    $("#insNameForm #insNameStatus .insNameStatus a.dropdown-toggle span").text("");
    $("#insNameModal .modal-title").text("添加区域");
    $("#submitInsNameBut").attr("type","add");
    $("#insNameModal").modal("show");
    let prefixId=$("#routeRedactForm");
    routeRedactHtml(prefixId,"html");
});
$("#insNameList").on("click",".modifyBut",function(){
    //修改巡检
    let this_=$(this);
    let ids=$(this).attr("ids");
    let pointids=$(this).attr("pointids");
    $("#submitInsNameBut").attr({"type":"modify","ids":ids});
    $("#insNameModal").modal("show");
    echoEchoInsName("insNameForm",this_);
    atrolpPoint(pointids,"","routeRedactForm");
});
$("#submitInsNameBut").click(function(){
    //提交巡检
    if($(this).attr("forbidden")){
        msgTips("请完成路线编辑");
        return;
    }
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(!ids){ids=""};
    var parameterData=verifyInsName("insNameForm");
    if(type=="add"){
        var ajaxurl="/ucotSmart/patrolareaAction!addPatrolarea.action";
        var msgtext="添加巡检名称";
    }else if(type=="modify"){
        var ajaxurl="/ucotSmart/patrolareaAction!updatePatrolarea.action";
        var msgtext="修改巡检名称";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "patrolarea.id":ids,
            "patrolpoints":parameterData.patrolpoints,
            "patrolarea.code":parameterData.code,
            "patrolarea.name":parameterData.name,
            "patrolarea.status":parameterData.status,
            "patrolarea.mark":parameterData.remark
        },
        success: function (data) {
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true){
                insName();
                $("#insNameModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//巡检二维码
$("#previewContent").on("click",".qrcode",function(){
    $("#qrcode").empty();
    let Parameter=$(this).attr("Parameter");
    let qrcodeurl=zoneServerIp+"/ucotSmart/management/navhtml/property_management/routingInspection.html?Parameter="+encodeURI(Parameter);
    $("#qrcode").qrcode(qrcodeurl);
    $("#qrcodeModal").modal("show").css("z-index","1060");
    $("body .modal-backdrop:last-child").css("z-index","1055");
});
//巡检计划
$("#addInsPlanBut").click(function(){
    $("#addInsPlanModal .modal-title").text("添加巡检计划");
    $("#submitInsPlanBut").text("添加").attr("type","add");
    insPlanModal();
    $("#insPlanForm .workMonth").removeAttr("disabled");
    $("#insPlanForm .insPlanDeptnameMenu").removeAttr("style");
    $("#insPlanForm .workMonth").val(nowYear+"-"+nowMonth);
    $("#insEmploModal").show();
});
function insPlanModal(){
    //调用添加巡检计划modal
    $("#insPlanForm input").val("");
    $("#insPlanForm .dropdown").attr({"optionid":"","modename":""}).find(".dropdown-toggle span").empty();
    $("#insPitchOn").empty().attr("ids","");
    $("#addInsPlanModal").modal("show");
};
function cutoutmonth(prefixId){
    let monthval=$("#"+prefixId+" .workMonth").val();
    monthval=monthval.substr(0,monthval.length-3);
    setTimeout(function(){
        $("#"+prefixId+" .workMonth").val(monthval);
    },100);
};
$("#insEmploModal").click(function(){
    //人员模态框
    let month=$("#insPlanForm .workMonth").val();
    if(!month){msgTips("请选择时间");return}
    let optionid=$("#insPlanDeptnameMenu .insPlanDeptnameMenu").attr("optionid");
    if(!optionid){msgTips("请选择部门");return}
    if(optionid){
        insStaffModal();
        $("#insStaffModal input.checkboxsBut").attr("checked",false);
        $("#insStaffModal").modal("show").css("z-index","1060");
        $("body .modal-backdrop:last-child").css("z-index","1055");
    };
});
function deWeightIns(prefixId,line,type,typeId,weekobj){
//去重、获取选中
    let checkedString="",selectedStaffId=[],selectedStaffName=[];//,weekobj=[]
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
                if(prefixId=="insStaffModalList"){
                    //去重禁选复选框
                    $(this).prop({"disabled":"disabled","checked":"checked"});
                }
            };
        };
    });
    if(prefixId=="selectInsPlanList"){

    };
    if(typeId=="insPlanTimeBox"){
        insdateOn(weekobj,typeId);
        return;
    };
    if(prefixId=="insStaffModalList"){
        //员工
        insPitchOn(selectedStaffId,selectedStaffName,checkedString);
    }else if(prefixId=="selectInsPlanList"){
        //巡检
        if(type=="week"){
            insWeekOn(typeId,weekobj,line);
        }else if(type=="month"){
            insMonthOn(typeId,weekobj,line);
        };
    }
};
$("#insStaffModalBut").click(function(){
    //确认选中人员
    deWeightIns("insStaffModalList");
});
$("#selectInsPlanList").on("click","span.choiceBut",function(){
    //选择巡检
    $("#timeInsPlanModalBut").attr({"insPlanId":$(this).attr("ids"),"insPlanName":$(this).attr("name"),"overminute":$(this).attr("overminute")});
    $("#timeInsPlanModal").modal("show").css("z-index","1070");
    $("body .modal-backdrop:last-child").css("z-index","1065");
});
$("#timeInsPlanModalBut").click(function(){
//选择巡检
    let typeId;
    let line=$(this).attr("line");
    let type=$(this).attr("type");
    let name=$(this).attr("insPlanName");
    let id=$(this).attr("insPlanId");
    let inquire=$(this).attr("inquire");
    let starttime=$("#insPlan_time .starttime").val();
    if(!starttime){msgTips("请选择开始时间");return;};
    let overminute=$(this).attr("overminute");
    if(!inquire){
        if(type=="month"||type=="week"){
            typeId="insPlanBox"
        }
    }else{
        if(inquire=="inquire"){
            typeId="insPlanTimeBox"
        };
    };
    let weekobj=[{"areaid":id,"areaname":name,"starttime":starttime,"overminute":overminute}];
    deWeightIns("selectInsPlanList",line,type,typeId,weekobj);
    $("#timeInsPlanModalBut").removeAttr("inquire");
    $("#timeInsPlanModal").modal("hide");
    $("#timeInsPlanForm .starttime").val("");
});
function insPitchOn(selectedStaffId,selectedStaffName,checkedString){
    //选择员工
    let pitchOnHtml="";
    for(let i=0;i<selectedStaffId.length;i++){
        pitchOnHtml+='<span ids="'+selectedStaffId[i]+'">'+selectedStaffName[i]+'<i name="'+selectedStaffName[i]+'"  ids="'+selectedStaffId[i]+'">x</i></span>';
    };
    let checkeds=checkedString.substr(1,checkedString.length).replace(/\s/g,"");
    $("#insPitchOn").append(pitchOnHtml).attr("ids",checkeds);
    $("#insStaffModal").modal("hide");
};
$("#insPitchOn").on("click","i",function(){
    let ids=$(this).attr("ids");
    let name=$(this).attr("name");
    let idstring=$("#insPitchOn").attr("ids").replace(ids+":"+name,"").replace(",,",",");
    if(idstring.charAt(0)==","){
        idstring=idstring.substr(1,idstring.length);
    }else if(idstring.charAt(idstring.length-1)==","){
        idstring=idstring.substr(0,idstring.length-1);
    }
    $(this).parent("span").remove();
    $("#insPitchOn").attr("ids",idstring);
});
$("#submitInsPlanBut").click(function(){
    //确认添加巡检计划
    let parameterData=verifyInsPlan("insPlanForm");
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    let cycle=$(this).attr("cycle");
    $("#insDatatitbox").attr({"data":parameterData.month,"parameterData":JSON.stringify(parameterData),"type":type}).text(parameterData.month+"巡检周期表");
    if(parameterData.cycle=="1"){
        //按周
        $("#insDatatitbox").attr("datatype","week");
        insWeektab("insPlanBox");
        if(type=="modify"){
            staffInsPlan("insPlanBox","week",parameterData,"modify");
        };
    }else if(parameterData.cycle=="2"){
        //按月
        $("#insDatatitbox").attr("datatype","month");
        insMonthtab();
        if(type=="modify"){
            staffInsPlan("insPlanBox","month",parameterData,"modify")
        };
    }else if(parameterData.cycle=="0"){
        //复制上月
        createIns("copyLastMonth");
    };
});
function dataIsChecked(line,type){
    $("#selectInsPlanList span.choiceBut").show();
    //巡检去重禁
    let schweeks;
    if(type=="week"){
        schweeks=$("#insWeekbox div.schweek");
    }else if(type=="month"){
        schweeks=$("#insMonthbox td.targetmonth[ids="+line+"] span.schmonth");
    }else if(type=="insPlanTimeBox"){
        schweeks=$("#insPlanTimeBox div.schweek");
    };
    if(schweeks){
        $("#selectInsPlanForm span.choiceBut").removeAttr("style");
        schweeks.each(function(){
            let ids=$(this).attr("ids");
            if(type=="week"){
                let lines=$(this).attr("line");
                if(lines==line){
                    //去重禁选复选框
                    $("#selectInsPlanList span.choiceBut[ids="+ids+"]").hide();
                };
            }else if(type=="month"||type=="insPlanTimeBox"){
                $("#selectInsPlanList span.choiceBut[ids="+ids+"]").hide();
            };
        });
    };
    return schweeks;
}
//--按周巡检--
function insWeektab(prefixId){
    //按周
    $("#"+prefixId+" .tables,#"+prefixId+" .monthbox,#schedulingMenu,#insPlanMenu").hide();
    $("#"+prefixId+" .date,#"+prefixId+" .weekbox,#dateButBox,#insDateButBox").show();
    $("#"+prefixId+" .weekbox tr th:first-child").width("110px");
    $("#"+prefixId+" .weekbox tr td:first-child").width("110px");
    let wth=parseInt(($("#"+prefixId+" .weekbox table").width()-110)/7);
    $("#"+prefixId+" .weekbox tr th").not("th:first-child").width(wth);
    $("#"+prefixId+" .weekbox tr td").not("td:first-child").width(wth-2);
};
$("#insPlanBox .weekbox thead span.blue").click(function(){
    //选择巡检弹窗
    let line=$(this).attr("line");
    //$("#selectInsPlanModalBut").attr({"line":line,"type":"week"});
    $("#timeInsPlanModalBut").attr({"line":line,"type":"week"});
    dataIsChecked(line,"week");
    $("#selectInsPlanModal").modal("show");
})
function insWeekOn(prefixId,weekobj,line){
    let wth=$("#insSize").width();
    let hgt=$("#insSize").height();
    let leftone=$("#scheduleBox .weekbox tr th:first-child").width();
    let lefts=(line-1)*wth+leftone+20-line;
    let weekOnHtml="";
    for(let i=0;i<weekobj.length;i++){
        let starttime;
        if(weekobj[i].starttime.length>5){
            starttime=weekobj[i].starttime.substr(11,5).replace("00","").split(":");
        }else{
            starttime=weekobj[i].starttime.replace("00","").split(":");
        };
        let overminute=weekobj[i].overminute/60;
        let content=weekobj[i].areaname;
        let heights,tops;
        if(starttime[1]!="00"){
            tops=hgt*(Number(starttime[0])+1)+hgt*(Number(starttime[1])/60)+20;
        }else{
            tops=hgt*(Number(starttime[0])+1)+20;
        }
        heights=hgt*overminute;
        weekOnHtml+='<div class="schweek" ids="'+weekobj[i].areaid+'" line="'+line+'" starttime="~'+weekobj[i].starttime+'"  overminute="'+weekobj[i].overminute+'" style="width:'+wth+'px;height:'+heights+'px;top:'+tops+'px;left:'+lefts+'px;line-height:'+heights+'px;">'+content+'<i>x</i></div>';
    };
    $("#"+prefixId+" .weekbox").append(weekOnHtml);
    $("#selectInsPlanModal").modal("hide");
};
$("#insWeekbox").on("click","i",function(){
    //删除选中巡检
    $(this).parent("div.schweek").remove();
});
//--按月巡检--
function insMonthtab(type){
    //按月
    let prefixId,dataId,boxId;
    if(!type){
        prefixId="insMonthbox";
        dataId="insDatatitbox";
        boxId="insPlanBox";
        $("#"+boxId+" .tables,#"+boxId+" .weekbox,#insPlanMenu").hide();
        $("#"+boxId+" .date,#"+boxId+" .monthbox,#insDateButBox").show();
    }else if(type=="lookOver"){
        prefixId="insInquireMonthbox";
        dataId="insDateTimes";
        boxId="insInquireBox";
    }else if(type=="inquire"){
        prefixId="insInquireMonthbox";
        dataId="insDateTimes";
        boxId="insInquireBox";
    };
    $("#"+boxId+" .monthbox table td").removeClass("schmonth targetmonth").empty();
    let wth=$("#"+boxId+" .monthbox table").width()/7;
    $("#"+boxId+" .monthbox tbody th,#"+boxId+" .monthbox tbody td").width(wth);
    let datastr,yaar,month;
    if(dataId=="insDateTimes"){
        datastr=$("#"+dataId).text()+"-01";
        yaar=$("#"+dataId).attr("year");
        month=$("#"+dataId).attr("month");
    }else if(dataId=="insDatatitbox"){
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
$("#insMonthbox").on("click",".targetmonth",function(e){
    //选择巡检弹窗
    if(e.target.tagName!="I"){
        let ids=$(this).attr("ids");
        $("#timeInsPlanModalBut").attr({"line":ids,"type":"month"});
        dataIsChecked(ids,"month");
        $("#selectInsPlanModal").modal("show");
    };
});
function insMonthOn(prefixId,weekobj,line,type){
    if(type=="inquire"){
        $("#"+prefixId+" .targetmonth[ids="+line+"]").addClass("schmonth")
    }else{
        let weekOnHtml="";
        for(let i=0;i<weekobj.length;i++){
            let starttime;
            if(weekobj[i].starttime.length>5){
                starttime=weekobj[i].starttime.substr(11,5);
            }else{
                starttime=weekobj[i].starttime;
            }
            let content=weekobj[i].areaname+"&nbsp;&nbsp;&nbsp;&nbsp;"+starttime;
            weekOnHtml+='<br/><span class="schmonth" ids="'+weekobj[i].areaid+'" line="'+line+'" starttime="'+starttime+'">'+content+'<i>x</i></span>';
        };
        $("#"+prefixId+" .targetmonth[ids="+line+"]").addClass("schmonth").append(weekOnHtml);
        if(prefixId=="insInquireMonthbox"){
            $("#insInquireMonthbox .schmonth i").remove();
        };
        $("#selectInsPlanModal").modal("hide");
    };
};
$("#insMonthbox").on("click",".schmonth i",function(){
    //删除选中巡检
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
//修改巡检
$("#insPlanList").on("click",".modifyBut",function(){
    let this_=$(this);
    let ids=this_.attr("ids");
    let plandetail=this_.attr("plandetail");
    let cycle=this_.attr("cycle");
    $("#addInsPlanModal .modal-title").text("修改巡检计划");
    $("#submitInsPlanBut").text("修改").attr({"type":"modify","cycle":cycle,"ids":ids});
    insPlanModal();
    echoEchoInsPlaneModal("insPlanForm",this_);
});
//--生成巡检--
function createIns(workCycle){
    departmentMenu("inquireInsDepartmentMenu");
    var type,plandetail,ajaxurl,msgtext;
    if(workCycle=="copyLastMonth"){
        //复制上月
        type="add";
        plandetail="";
    }else{
        type=$("#insDatatitbox").attr("type");
        let datatype=$("#insDatatitbox").attr("datatype");
        if(datatype=="week"){
            let schweeks=$("#insWeekbox div.schweek");
            let ids1=[],ids2=[],ids3=[],ids4=[],ids5=[],ids6=[],ids7=[];
            schweeks.each(function(){
                let line=$(this).attr("line");
                let ids=$(this).attr("ids");
                let starttime=$(this).attr("starttime");
                eval("ids"+line+".push("+ids+")");
                eval("ids"+line+".push("+"'"+starttime+"'"+")");
            });
            for(let i=1;i<8;i++){
                // console.log( eval("ids"+i));
                eval("ids"+i+".length==0"+"?"+"ids"+i+"=0"+":"+"ids"+i+"="+"ids"+i+"[0]+"+"ids"+i+"[1]");
            };
            plandetail=ids1+";"+ids2+";"+ids3+";"+ids4+";"+ids5+";"+ids6+";"+ids7;
        }else if(datatype=="month"){
            plandetail="";
            let schmonth=$("#insMonthbox .targetmonth");
            schmonth.each(function(){
                //let line=$(this).attr("line");
                let schmonthspan=$(this).find("span.schmonth");
                let schmonthArr=[];
                schmonthspan.each(function() {
                    let ids=$(this).attr("ids");
                    let starttime=$(this).attr("starttime");
                    eval("schmonthArr.push("+"'"+ids+"'"+"+'~'+"+"'"+starttime+"'"+")");
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
    let parameterData=JSON.parse($("#insDatatitbox").attr("parameterdata"));
    if(type=="add"){
        ajaxurl="/ucotSmart/patrolsettingAction!addPatrolsetting.action";
        msgtext="生成巡检";
    }else if(type=="modify"){
        ajaxurl="/ucotSmart/patrolsettingAction!updatePatrolsetting.action";
        msgtext="修改巡检";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "patrolsetting.id":parameterData.ids,
            "employees":parameterData.employees,
            "patrolsetting.deptid":parameterData.deptid,
            "patrolsetting.deptname":parameterData.deptname,
            "patrolsetting.month":parameterData.month+"-01",
            "patrolsetting.cycle":parameterData.cycle,
            "patrolsetting.patroldetail":plandetail
        },
        success: function (data) {
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true){
                insPlan();
                $("#addSchedulingSetModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
    insListPag();
};
$("#insDateCreatelBut").click(function(){
    createIns();
});
//--取消巡检--
function insListPag(){
    $(".schweek").remove();
    $("#insPlanBox .date,#insPlanBox .weekbox,#insPlanBox .monthbox,#insDateButBox").hide();
    $("#insPlanBox .tables,#insPlanMenu").show();
}
$("#insDateCancelBut").click(function(){
    //取消
    insListPag();
});
//巡检查询
function insAdjuster(type){
    let month=parseInt($("#insDateTimes").attr("month"));
    let year=parseInt($("#insDateTimes").attr("year"));
    let empid=$("#insDateTimes").attr("empid");
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
    $("#insDateTimes").attr("year",year);
    $("#insDateTimes").attr("month",month);
    let months=month;
    if(months<10){
        months="0"+months;
    }
    $("#insDateTimes").text(year+"-"+months);
    if(empid){
        let parameterData={
            "month":year+"-"+months+"-01",
            "empid":empid
        };
        staffInsPlan("insInquireMonthbox","month",parameterData,"lookOver");
    }else{
        insPlanInquire();
    }
};
$("#insInquiretitBox .arrowsleft").click(function(){
    insAdjuster("left")
});
$("#insInquiretitBox .arrowsright").click(function(){
    insAdjuster("right")
});
$("#insPlanList").on("click",".lookOver",function(){
    departmentMenu("inquireInsDepartmentMenu");
    let this_obj=$(this).attr("obj");
    let obj=JSON.parse(this_obj);
    $("#modifyInsPlanModalBut").attr("Workplandetail",this_obj);
    let parameterData={
        "month":obj.month.substr(0,7),
        "ids":obj.id,
        "empid":obj.empid,
        "empname":obj.empname,
        "deptid":obj.deptid,
        "deptname":obj.deptname,
        "cycle":obj.cycle
    };
    $("#inquireInsDepartmentMenu .inquireInsDepartmentMenu").attr({"optionid":obj.deptid,"modename":obj.deptname}).find("a.dropdown-toggle span").text(obj.deptname);
    $("#inquireInsStaffMenu .inquireInsStaffMenu").attr({"optionid":obj.empid,"modename":obj.empname}).find("a.dropdown-toggle span").text(obj.empname);
    $("#inquireInsStaffMenu .inquireInsStaffMenu .dropdown-menu").empty();
    $(".ins_plan,#tab_ins_plan").removeClass("active");
    $(".ins_inquire,#tab_ins_inquire").addClass("active");
    $("#insDateTimes").text(parameterData.month).attr({"empid":parameterData.empid,"empname":parameterData.empname,"year":parameterData.month.substr(0,4),"month":parameterData.month.substr(5,2)});
    staffInsPlan("insInquireMonthbox","month",parameterData,"lookOver");
    insMonthtab("lookOver");
});
$("#insInquireBox").on("click",".inquireStaffArrange .targetmonth",function(e){
    //选择巡检弹窗
    if(e.target.tagName!="I"){
        let empid=$("#insDateTimes").attr("empid");
        let day=$(this).attr("ids").length==2?$(this).attr("ids"):"0"+$(this).attr("ids")
        let plantime=$("#insDateTimes").text()+"-"+day;
        $("#modifyInsPlanModal").modal("show").find(".modal-title").text($("#insDateTimes").attr("empname")+"  "+plantime+"  巡检计划");
        $("#modifyInsPlanModalBut").attr("starttime",plantime);
        $("#insPlanTimeBox .schweek").remove();
        staffInsPlanday(empid,plantime);
    };
});
function insdateOn(weekobj,prefixId){
    let wth=$("#timeInsSize").width()+2;
    let weekOnHtml="";
    for(let i=0;i<weekobj.length;i++){
        let starttime,starttimeSub;
        if(weekobj[i].starttime.length>5){
            starttimeSub=weekobj[i].starttime.substr(11,5);
            starttime=starttimeSub.replace("00","").split(":");
        }else{
            starttimeSub=weekobj[i].starttime;
            starttime=starttimeSub.replace("00","").split(":");
        };
        let startnub=Number(starttime[0])+Number(starttime[1])/60;
        let overminute=weekobj[i].overminute/60;
        let content=weekobj[i].areaname;
        //let widths=wth*overminute;
        let lefts=wth*startnub;
        weekOnHtml+='<div class="schweek" ids="'+weekobj[i].areaid+'" starttime="'+starttimeSub+'" style="width:'+wth+'px;height:180px;top:48px;left:'+lefts+'px;">'+content+'<i>x</i></div>';
    };
    $("#"+prefixId).append(weekOnHtml);
    $("#selectInsPlanModal").modal("hide");
};
$("#modInsBut").click(function(){
    $("#selectInsPlanModal").modal("show").css("z-index","1060");
    $("body .modal-backdrop:last-child").css("z-index","1055");
    $("#timeInsPlanModalBut").attr({"type":"month","inquire":"inquire"});
    dataIsChecked("","insPlanTimeBox")
});
$("#insPlanTimeBox").on("click",".schweek i",function(){
    //删除选中巡检
    $(this).parent("div.schweek").remove();
});
$("#modifyInsPlanModalBut").click(function(){
    let schweekelmt=$("#insPlanTimeBox .schweek");
    let planids="";
    schweekelmt.each(function(){
        let ids=$(this).attr("ids");
        let starttime=$(this).attr("starttime");
        planids=planids+","+ids+"~"+starttime;
    });
    planids=planids.substr(1,planids.length);
    let datas=$(this).attr("starttime");
    let Workplandetail=JSON.parse($("#modifyInsPlanModalBut").attr("Workplandetail"));
    // console.log(Workplandetail);
    let parameterData={
        "starttime":datas,
        "deptid":Workplandetail.deptid,
        "deptname":Workplandetail.deptname,
        "empid":Workplandetail.empid,
        "empname":Workplandetail.empname,
        "details":planids
    };
    modifyInsPlanday(parameterData);
});
//按部门/全部查询
$("#insInquireBox").on("click",".inquireDepartmentArrange .targetmonth",function(){
    //选择巡检弹窗
    let day=$(this).attr("ids").length==2?$(this).attr("ids"):"0"+$(this).attr("ids")
    inquireInsPlanPersonnel(day)
});
$("#showInsPlanForm").on("click",".ename",function(e){
    //选择巡检弹窗
    if(e.target.tagName!="I"){
        let empid=$(this).attr("empid");
        let empname=$(this).text();
        let plantime=$(this).attr("plantime");
        $("#modifyInsPlanModal").modal("show").css("z-index","1059").find(".modal-title").text(empname+"  "+plantime);
        $("body .modal-backdrop:last-child").css("z-index","1055");
        $("#modifyInsPlanModalBut").attr("starttime",plantime);
        $("#insPlanTimeBox .schweek").remove();
        staffInsPlanday(empid,plantime);
    };
});
//巡检详情
$("#previewContent").on("click",".lookPT",function(){
    let id=$(this).attr("ids");
    insPlanPTParticulars(id);
    $("#previewModal").modal("hide");
    $("#tab_ins_particulars .startToEnd").css("background","#ebebe4");
});
$("#backParticulars,a[href='#tab_ins_particulars']").click(function(){
    //返回
    $("#insParticulars,#searchInsParticulars").show();
    $("#insPT,#backParticulars").hide();
    $("#insPlanStartTime,#insPlanEndTime").removeAttr("disabled");
    $("#tab_ins_particulars .startToEnd").css("background","#ffffff");
});
//删除
$("#tab_inspection_management").on("click",".deleteBut",function(){
    //删除巡检
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(!ids){ids=""};
    let dataObj,callBack,ajaxURL;
    if(type=="insName"){
        ajaxURL="/ucotSmart/patrolareaAction!deletePatrolarea.action";
        callBack="insName()";
        // 删除巡检名称;
    }else if(type=="schedSche"){
        ajaxURL="/ucotSmart/patrolsettingAction!deletePatrolsetting.action";
        callBack="insPlan()";
        // 删除巡检计划;
    };
    dataObj={"token":permit,"ids":ids};
    deletePubModal(dataObj,callBack,ajaxURL);
});
//搜索
$("#insInquireSearch").click(function(){
    $("#insDateTimes").removeAttr("empid empname");
    let month=$("#insDateTimes").text()+"-01";
    let department=$("#inquireInsDepartmentMenu .inquireInsDepartmentMenu").attr("optionid");
    let Staff=$("#inquireInsStaffMenu .inquireInsStaffMenu").attr("optionid");
    let empname=$("#inquireInsStaffMenu .inquireInsStaffMenu").attr("modename");
    $("#insDateTimes").attr("deptid",department);
    insMonthtab("inquire");
    if(Staff){
        //查员工
        $("#insDateTimes").attr({"empid":Staff,"empname":empname});
        let parameterData={
            "empid":Staff,
            "month":month
        };
        staffInsPlan("insInquireMonthbox","month",parameterData,"lookOver");
    }else if(!Staff||department){
        //查部门
        insPlanInquire()
    };
});
$("#searchInsParticulars").click(function(){
    insPlanParticulars();
});
//-------------------打印---------------------------
$("#printIns").click(function(){
    sectionalPrint("insInquireBox","巡检查询");
});
/**
 * Created by asus on 2017/9/28.
 */
var pageSize = 10;

$('.property_services,.repair_statistics').click(function(){
    repairStaticsInitialize(1);
});

function repairStaticsInitialize(){
    queryRepairStaticTicsLoadPageDataJump(1);
}

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
    if(dropdownId=="repair_static_tics_followP"){
        repairStaticTicsFollowDm(optionId);
    }
});

/**
 * 加载任务数据分页
 * @param page 当前页
 */
function queryRepairStaticTicsLoadPageDataJump(page){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/reportRepairAction!findComplaintOld.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":10,
            "c.zonecode":repairStatisticsCode(permit),
            "c.type":"",
            "c.status":"",
            "c.followP":"",
            "createtime":"",
            "endtime":""
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pageRepairStaticTicsServiceLoadInformationList(list);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#repair_paging_static_tics').empty();
            $('#repair_tips_static_tics').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryRepairStaticTicsListByPage(list.length, totalNum,pageNum,"","","","","");
            }
        }
    });
}

/**
 * 条件查询
 */
function repairStatisticsSearch(){
    repairStaticTicsFollowDm(13);
    var type = $("#repair_static_tics_followP .repair_static_tics_type").attr("optionid");
    var status = $("#repair_static_tics_followP .repair_static_tics_status").attr("optionid");
    var followP = $("#repair_static_tics_followP .repair_static_tics_followP").attr("optionid");
    var startTime = $(".startTime").val();
    var endTime = $(".endTime").val();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/reportRepairAction!findComplaintOld.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":1,
            "pager.pagesize":10,
            "c.type":type,
            "c.status":status,
            "c.followP":followP,
            "createtime":startTime,
            "endtime":endTime
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pageRepairStaticTicsServiceLoadInformationList(list);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#repair_paging_static_tics').empty();
            $('#repair_tips_static_tics').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryRepairStaticTicsListByPage(list.length, totalNum,pageNum,type,status,followP,startTime,endTime);
            }
        }
    });
}

/*
 *给报事保修统计分页插件绑定ajax请求，根据页码任务数据
 */
function queryRepairStaticTicsListByPage(pageNum,totalNum,totalPages,type,status,followP,startTime,endTime){
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    $('#repair_paging_static_tics').empty();
    $('#repair_paging_static_tics').append('<ul id="repair_pagination_static_tics" class="pagination-sm"></ul>');

    var repairPage;
    $('#repair_pagination_static_tics').twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            repairPage=page;
        }
    });
    $('#repair_pagination_static_tics').on('click', 'a', function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/reportRepairAction!findComplaintOld.action",
            dataType:"json",
            data:{
                "token":permit,
                "pager.pages":repairPage,
                "pager.pagesize":pageSize,
                "c.type":type,
                "c.status":status,
                "c.followP":followP,
                "createtime":startTime,
                "endtime":endTime
            },
            success: function (data) {
                var list=eval(data.obj.data);
                pageRepairStaticTicsServiceLoadInformationList(list);
                $('#repair_tips_static_tics').empty();
                $('#repair_tips_static_tics').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            }
        });
    });
}

function changeRepairChoice(value,id){
    var imgArray = $("#repair_body_static_tics").find("img")[value];
    var str = imgArray.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgArray.setAttribute("src","img/nochoice.png");
        repairImgId = 0;
        repairImgId = repairImgId.substr(0,repairImgId.lastIndexOf(",")-1);
    }else{
        imgArray.setAttribute("src","img/choice.png");
        repairImgId = id;
        repairImgId += id+",";
    }
}

function repairPrint(){
    $("#repair_list_static_tics .repairStaticPrint").hide();
    $("#repair_list_static_tics").jqprint();
    $("#repair_list_static_tics .repairStaticPrint").show();
}

/**
 * 导出任务数据
 */
function repairExportData(){
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+"/ucotSmart/reportRepairAction!exportComplaintOld.action?token="+permit);
    var input = $('<input>');
    input.attr('type', 'hidden');
    $('body').append(form);
    form.append(input);
    form.submit();
    form.remove();
}

function repairStaticTicsFollowDm(deptNo){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/employeeAction!getEmployees.action",
        dataType:"json",
        data:{
            "token":permit,
            "employee.ename":deptNo
        },
        success:function(data){
            var empData = eval(data.obj.data);
            $("#repair_static_tics_followP .repair_static_tics_followP .option_type").attr("optionId","");
            var empP = $("#repair_static_tics_followP .repair_static_tics_followP .areaZoneList-menu");
            empP.empty();
            empP.append('<li><a codelist="0" modename="全部">全部</a></li>');
            empP.css("display","");
            $(empData).each(function(index){
                var accout = empData[index].accout;
                var ename = empData[index].ename;
                empP.append('<li><a codeList="' + accout + '" modename="'+ename+'">' + ename + '</a></li>');
            });
            $("#repair_static_tics_followP .repair_static_tics_followP .areaZoneList-menu li:first-child").remove();
        }
    });
}

//对紧急程度进行转化
function repairUrgency(type){
    if(type=="1"){
        var repairUrgency = "非常严重";
        $(".color").addClass("red");
    }else if(type=="2"){
        var repairUrgency = "严重";
        $(".color").removeClass("red");
    }else if(type=="3"){
        var repairUrgency = "一般";
        $(".color").removeClass("red");
    }
    return repairUrgency;
}

//对派送方式进行转化
function repairSentMode(type){
    if(type=="1"){
        var repairSentMode = "电话派送";
    }else if(type=="2"){
        var repairSentMode = "短信派送";
    }else if(type=="3"){
        var repairSentMode = "APP派送";
    }else if(type=="4"){
        var repairSentMode = "微信派送";
    }
    return repairSentMode;
}

//对客户满意度进行转化
function repairCsr(type){
    if(type=="1"){
        var repairCsr = "不满意";
    }else if(type=="2"){
        var repairCsr = "较不满意";
    }else if(type=="3"){
        var repairCsr = "一般";
    }else if(type=="4"){
        var repairCsr = "较满意";
    }else if(type=="5"){
        var repairCsr = "很满意";
    }
    return repairCsr;
}

//对列表数据进行转化
function repairType(type){
    if(type=="1"){
        var workorderType="建议投诉";
    }else if(type=="2"){
        var workorderType="物业维修";
    }
    return workorderType;
}

//对状态进行转化
function repairChangeStatus(type){
    if(type=="0"){
        var repairStatus="全部任务";
    }else if(type=="1"){
        var repairStatus="未处理";
    }else if(type=="2"){
        var repairStatus="处理中";
    }else if(type=="3"){
        var repairStatus="再处理";
    }else if(type=="4"){
        var repairStatus="已完成";
    }else if(type=="5"){
        var repairStatus="已回访";
    }else if(type=="6"){
        var repairStatus="未完成";
    }else if(type=="7"){
        var repairStatus="拒单";
    }
    return repairStatus;
}

//格式化时间格式为yyyy-MM-dd
function repairAllSubStr(time){
    if(time!=null&&time!="undefined"){
        return time.substring(0,10);
    }
    return "";
}

//判断是否为空
function repairCheckNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}

//通过token获取zoneCode//200002d1p1z1b
function repairStatisticsCode(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.endsWith("N"))
        return code.substring(0,code.indexOf("d")+1);
}
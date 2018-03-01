/**
 * Created by GIGA on 2017-11-24.
 */
//查询供应商表格数据
$(".supplier_management").on('click',function(){
    enquerySuppliTable();
});
//查询
function enquerySuppliTable(){
    queryListByParams("/ucotSmart/supplierAction!querySupplier.action","","supplypage","addSupplyTable");
}
//表格动态加载供应商
function addSupplyTable(list){
    var len=list.length;
    var html="";
    var html2="";
    $.each(list,function(i,tbodyTr){
        html+='<tr ids="'+checknull(tbodyTr.id)+'"><td>'+checknull(tbodyTr.supplyname)+'</td><td>'+checknull(tbodyTr.linkman)+'</td><td>'+checknull(tbodyTr.cellphone)+
            '</td><td>'+checknull(tbodyTr.address)+'</td><td>'+checknull(tbodyTr.creditcode)+'</td><td>'+checknull(tbodyTr.ratepaycode)+'</td><td>'+
            checknull(tbodyTr.starttime)+'</td><td><a class="modify" data-toggle="modal" data-target="#supplier_modify">修改</a>|' +
            '<a class="delete" data-toggle="modal" data-target="#supplier_delete">删除</a></td></tr>';
        html2+=' <li><a ids="'+checknull(tbodyTr.id)+'">'+checknull(tbodyTr.supplyname)+'</a></li>';
    });
    $("#tab_supplierManage .tables tbody").html(html);
    $("#equipMg_modify .equipSupplier .areaZoneList-menu").html(html2);
    $("#addEquipMge .equipSupplier .areaZoneList-menu").html(html2);
    selectDropdownMenu("#equipMg_modify .equipSupplier .areaZoneList-menu","#equipMg_modify .equipSupplier .areaZoneList");
    selectDropdownMenu("#addEquipMge .equipSupplier .areaZoneList-menu","#addEquipMge .equipSupplier .areaZoneList");
    //行数据少于10行，空行添加
    addTr("#tab_supplierManage .tables tbody",len,10);
    //增加自定义属性ids
    addIds("#tab_supplierManage","#supplier_delete",".to_delete");
    addIds("#tab_supplierManage","#supplier_modify",".toResure");
    //修改，模态框保留初始值
    supplierTableModify();
}
//时间段 查询供应商
function enquerySupplier(th){
    enquery(th,"supplierAction!querySupplier.action","addSupplyTable");
}
//时间段查询
function enquery(th,url,fun){
    var startTime=$(th).siblings().children("input.startTime").val();
    var endTime=$(th).siblings().children("input.endTime").val();
    var data="starttime="+startTime+"&endtime="+endTime;
    queryListByParams("/ucotSmart/"+url,data,"supplypage",fun);
}
//表格修改，模态框自动赋值
function supplierTableModify(){
    $("#tab_supplierManage tbody td .modify").on('click',function(){
        var id="#supplier_modify";
        $(id+" .supplier").val($(this).parents("tr").children("td:first-child").text());
        $(id+" .linker").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .cellphone").val($(this).parents("tr").children("td:nth-child(3)").text());
        $(id+" .address").val($(this).parents("tr").children("td:nth-child(4)").text());
        $(id+" .creditCode").val($(this).parents("tr").children("td:nth-child(5)").text());
        $(id+" .ratePayCode").val($(this).parents("tr").children("td:nth-child(6)").text());
        $(id+" .theTime").val($(this).parents("tr").children("td:nth-child(7)").text());
    });
}
//新增
modalParamsSure("#addSupplier","supplierAction!addSupplier.action");
//修改 更新
modalParamsSure("#supplier_modify","supplierAction!updateSupplier.action");
//新增、修改
function modalParamsSure(id,url){
    $("body").on('click',id+" .toResure",function(){
        var supplier=$(id+" .supplier").val();
        var linker=$(id+" .linker").val();
        var cellphone=$(id+" .cellphone").val();
        var address=$(id+" .address").val();
        var creditCode=$(id+" .creditCode").val();
        var ratePayCode=$(id+" .ratePayCode").val();
        var theTime=$(id+" .theTime").val();
        var data="&supplier.supplyname="+supplier+"&supplier.linkman="+linker+"&supplier.cellphone="+cellphone+
            "&supplier.address="+address+"&supplier.creditcode="+creditCode+"&supplier.ratepaycode="+ratePayCode+
            "&supplier.starttime="+theTime;
        if($(this).attr("ids")){
            var ids=$(this).attr("ids");
            data=data+"&supplier.id="+ids;
        }
        ajaxRequest(url,data,"enquerySuppliTable");
        inputModalEmpty();
        defaultDate();
    });
}
//模态框 删除供应商
$("body").on('click','#supplier_delete .to_delete',function(){
    var ids=$(this).attr("ids");
    var data="&ids="+ids;
    ajaxRequest('supplierAction!deleteSupplier.action',data,"enquerySuppliTable");
});
//添加自定义属性ids
function addIds(id,modalId,modalBtn){
    $(id+" .tables tbody td a").on('click',function(){
        var ids=$(this).parent().parent().attr("ids");
        $(modalId+" "+modalBtn).attr("ids",ids);
    });
}
//清空模态框输入框
function inputModalEmpty(){
    $(".modal input").val("");
}
//模态框 时间input 默认为当前日期
function defaultDate(){
    var date=new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    $(".modal .calendar").val(year+"-"+month+"-"+day);
}
defaultDate();

//访客管理
//访客表格数据
$(".visitor_management").on('click',function(){
    enqueryVisitorTable();
});
//查询
function enqueryVisitorTable(){
    queryListByParams("/ucotSmart/visitrecordAction!queryVisitrecord.action","","visitorPage","addVisitorTable");
}
//表格动态加载访客
function addVisitorTable(list) {
    var len = list.length;
    var html = "";
    $.each(list, function (i, tbodyTr) {
        html +='<tr ids="'+checknull(tbodyTr.id)+'"><td>'+checknull(tbodyTr.starttime)+'</td><td>'+checknull(tbodyTr.visittime)+
            '</td><td>'+checknull(tbodyTr.vname)+'</td><td cerId="'+checknull(tbodyTr.certificateid)+'">'+checknull(tbodyTr.certificatename)+
            '</td><td>'+checknull(tbodyTr.certificateno)+'</td><td>'+checknull(tbodyTr.personnum)+'</td><td>'+checknull(tbodyTr.reason)+
            '</td><td>'+checknull(tbodyTr.address)+'</td><td>'+checknull(tbodyTr.mark)+'</td><td>' +
            '<a class="modify" data-toggle="modal" data-target="#visitor_modify">修改</a>|' +
            '<a class="delete" data-toggle="modal" data-target="#visitor_delete">删除</a></td></tr>';
    });
    $("#tab_visitorManage .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_visitorManage .tables tbody",len,10);
    //增加自定义属性ids
    addIds("#tab_visitorManage","#visitor_delete",".to_delete");
    addIds("#tab_visitorManage","#visitor_modify",".toResure");
    //修改下拉框默认属性ids
    addIds("#tab_visitorManage","#visitor_modify",".areaZoneList");
    tableModify();
}
//时间段查询 访客
function enqueryVisit(th){
    enquery(th,"visitrecordAction!queryVisitrecord.action","addVisitorTable");
}
//添加 查询证件
$("#tab_visitorManage .btns .adding").on('click',function(){
    //ajaxRequest('certificatesAction!queryCertificates.action',"","addDropdownMenu");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/certificatesAction!queryCertificates.action",
        data:"token="+permit,
        dataType: "json",
        success:function(js){
            var html="";
            $.each(js.obj.data,function(i,certify){
                html+='<li><a ids="'+certify.id+'">'+certify.certificatename+'</a></li>';
            });
            $("#addVisitor .areaZoneList-menu").html(html);
           //下拉组件
            selectDropdownMenu("#addVisitor .areaZoneList-menu","#addVisitor .areaZoneList");
        },
        error:function(){
            msgTips("证件查询失败！");
        }
    });
});
//访客 添加
$("#addVisitor .toResure").on('click',function() {
    var id = "#addVisitor";
    var startTime = $(id + " .startTime").val();
    var visitTime = $(id + " .visitTime").val();
    var vName = $(id + " .vName").val();
    var certificateName = $(id + " .certificateName>a").text();
    var certificateId = $(id + " .certificateName>a").attr("ids");
    var certificateNo = $(id + " .certificateNo").val();
    var personNum = $(id + " .personNum").val();
    var reason = $(id + " .reason").val();
    var address = $(id + " .address").val();
    var mark = $(id + " .marBotArea").val();
    var data = "&visitrecord.starttime=" + startTime + "&visitrecord.visittime=" + visitTime + "&visitrecord.vname=" + vName +
        "&visitrecord.certificateid=" + certificateId + "&visitrecord.certificatename=" + certificateName + "&visitrecord.certificateno="
        + certificateNo + "&visitrecord.personnum=" + personNum + "&visitrecord.reason=" + reason + "&visitrecord.address=" + address + "&visitrecord.mark=" + mark;
    ajaxRequest('visitrecordAction!addVisitrecord.action',data,"enqueryVisitorTable");
    inputModalEmpty();
    $("#addVisitor textarea").val("");
});

//修改 查询证件及赋值
function tableModify(){
    $("body").on('click','#tab_visitorManage tbody td .modify',function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/certificatesAction!queryCertificates.action",
            data:"token="+permit,
            dataType: "json",
            success:function(js){
                var html="";
                $.each(js.obj.data,function(i,certify){
                    html+='<li><a ids="'+certify.id+'">'+certify.certificatename+'</a></li>';
                });
                $("#visitor_modify .areaZoneList-menu").html(html);
                //下拉组件
                selectDropdownMenu("#visitor_modify .areaZoneList-menu","#visitor_modify .areaZoneList");
            },
            error:function(){
                msgTips("证件查询失败！");
            }
        });
        var id="#visitor_modify";
        $(id+" .startTime").val($(this).parents("tr").children("td:first-child").text());
        $(id+" .visitTime").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .vName").val($(this).parents("tr").children("td:nth-child(3)").text());
        $(id+" .certificateName a span").text($(this).parents("tr").children("td:nth-child(4)").text());
        $(id+" .certificateName a").attr("ids",$(this).parents("tr").children("td:nth-child(4)").attr("cerId"));
        $(id+" .certificateNo").val($(this).parents("tr").children("td:nth-child(5)").text());
        $(id+" .personNum").val($(this).parents("tr").children("td:nth-child(6)").text());
        $(id+" .reason").val($(this).parents("tr").children("td:nth-child(7)").text());
        $(id+" .address").val($(this).parents("tr").children("td:nth-child(8)").text());
        $(id+" .marBotArea").val($(this).parents("tr").children("td:nth-child(9)").text());
    });
}
//访客 修改
$("body").on('click','#visitor_modify .toResure',function(){
    var ids=$(this).attr("ids");
    var id = "#visitor_modify";
    var startTime = $(id + " .startTime").val();
    var visitTime = $(id + " .visitTime").val();
    var vName = $(id + " .vName").val();
    var certificateName = $(id + " .certificateName>a").text();
    var certificateId = $(id + " .certificateName>a").attr("ids");
    var certificateNo = $(id + " .certificateNo").val();
    var personNum = $(id + " .personNum").val();
    var reason = $(id + " .reason").val();
    var address = $(id + " .address").val();
    var mark = $(id + " .marBotArea").val();
    var data ="&visitrecord.id="+ids+ "&visitrecord.starttime=" + startTime + "&visitrecord.visittime=" + visitTime + "&visitrecord.vname=" + vName +
        "&visitrecord.certificateid=" + certificateId + "&visitrecord.certificatename=" + certificateName + "&visitrecord.certificateno="
        + certificateNo + "&visitrecord.personnum=" + personNum + "&visitrecord.reason=" + reason + "&visitrecord.address=" + address + "&visitrecord.mark=" + mark;
    ajaxRequest('visitrecordAction!updateVisitrecord.action',data,"enqueryVisitorTable");
});
//访客 删除
$("#visitor_delete .to_delete").on('click',function(){
   var ids=$(this).attr("ids");
    var data="&ids="+ids;
    ajaxRequest('visitrecordAction!deleteVisitrecord.action',data,'enqueryVisitorTable');
});
//下拉组件，选中填充
function selectDropdownMenu(class1,class2){
    $("#tab_property_management").on('click',class1+">li>a",function(){
        if($(this).attr("ids")){
            var ids=$(this).attr("ids");
            $(this).parent().parent().siblings(class2).attr("ids",ids);
        }
        $(this).parent().parent().siblings(class2).find("span").text($(this).html());
    });
}
selectDropdownMenu(".areaZoneList-menu",".areaZoneList");

//物料管理
//设备管理  表格数据
$(".material_management").on('click',function(){
    queryEquipManageTable();
    //设备管理 添加修改 供应商 下拉
    forSupplySelect();
});
$("body").on('click',".equip_management",function(){
    queryEquipManageTable();
    //设备管理 添加修改 供应商 下拉
    forSupplySelect();
});
//设备管理 查询
function queryEquipManageTable(){
    queryListByParams("/ucotSmart/equipmentAction!queryEquipment.action","","equipManagePage","addEquipManageTable");
}
//设备名称 查询
$("body").on('click','#tab_equip_management .btns .btn_search',function(){
    var equipName=$(this).siblings(".equipName").val();
    var data="equipment.name="+equipName;
    queryListByParams("/ucotSmart/equipmentAction!queryEquipment.action",data,"equipManagePage","addEquipManageTable");
    //设备管理 添加修改 供应商 下拉
    forSupplySelect();
    console.log(equipName);
});

var equipMg=[];
//动态加载设备管理表格数据
function addEquipManageTable(list){
    equipMg.length=0;
    var len=list.length;
    var html="";
    var num=0;
    $.each(list,function(i,tbodyTr){
        if(tbodyTr.isfit==1){
            num++;
        }
        var equipStatus,equipCycle,equipNextFit;
        if(tbodyTr.status==1){
            equipStatus="运行良好";
        }else if(tbodyTr.status==2){
            equipStatus="设备老化";
        }else if(tbodyTr.status==3){
            equipStatus="部件损坏";
        }
        if(tbodyTr.cycle==0){
            equipCycle="自定义";
        }else if(tbodyTr.cycle==1){
            equipCycle="周保养";
        }else if(tbodyTr.cycle==2){
            equipCycle="月保养";
        }else if(tbodyTr.cycle==3){
            equipCycle="年保养";
        }
        if(tbodyTr.nextfittime==null){
            equipNextFit="";
        }else{
            equipNextFit=tbodyTr.nextfittime;
        }
        var mgItem={
            "设备编号":tbodyTr.code,
            "设备名称":tbodyTr.name,
            "设备品牌":tbodyTr.brand,
            "供应商":tbodyTr.supplyname,
            "设备位置":tbodyTr.location,
            "设备状态":equipStatus,
            "采购时间":tbodyTr.buytime,
            "使用时间":tbodyTr.usetime,
            "负责人":tbodyTr.chargeman,
            "设备保养周期":equipCycle,
            "上次保养时间":tbodyTr.fittime,
            "下次保养时间":equipNextFit,
            "备注":tbodyTr.mark
        };
        equipMg.push(mgItem);
        html+='<tr ids="'+checknull(tbodyTr.id)+'"><td>'+checknull(tbodyTr.code)+'</td><td>'+checknull(tbodyTr.name)+'</td><td>'+
            checknull(tbodyTr.brand)+'</td><td ids="'+checknull(tbodyTr.sid)+'">'+checknull(tbodyTr.supplyname)+'</td><td>'+
            checknull(tbodyTr.location)+'</td><td ids="'+checknull(tbodyTr.status)+'">'+equipStatus+'</td><td>'+checknull(tbodyTr.buytime)+
            '</td><td>'+checknull(tbodyTr.usetime)+'</td><td>'+checknull(tbodyTr.chargeman)+'</td><td ids="'+checknull(tbodyTr.cycle)+'">'+
            equipCycle+'</td><td>'+checknull(tbodyTr.fittime)+'</td><td>'+equipNextFit+'</td><td class="notPrint">' +
            '<a class="detail" data-toggle="modal" data-target="#equipMg_detail" ids="'+checknull(tbodyTr.id)+'">详情</a></td><td>'+checknull(tbodyTr.mark)+'</td>' +
            '<td class="notPrint"><a class="qrCode" data-toggle="modal" data-target="#equipMg_qrCode" ids="'+checknull(tbodyTr.id)+'">生成二维码</a>|' +
            '<a class="maintenanceRecord" data-toggle="modal" data-target="#equipMg_maintenance">保养记录</a>|' +
            '<a class="modify" data-toggle="modal" data-target="#equipMg_modify">修改</a>|' +
            '<a class="delete" data-toggle="modal" data-target="#Mg_delete">删除</a></td></tr>';
    });
    $("#tab_equip_management .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_equip_management .tables tbody",len,10);
    if(num>0){
        $(".equip_management .status_details").css("display","inline-block").html(num);
    }else if(num==0){
        $(".equip_management .status_details").css("display","none");
    }
    //保养记录，修改，删除模态框 增加自定义属性ids
    addIds("#tab_equip_management","#equipMg_maintenance",".determine");
    addIds("#tab_equip_management","#equipMg_modify",".determine");
    addIds("#tab_equip_management","#Mg_delete",".to_delete");
    addIds("#tab_equip_management","#equipMg_qrCode",".to_print");
    //修改，模态框保留初始值
    equipMgTableModify();
}
//显示自定义周期
function showDefineTime(id){
    $("body").on('click',id+' .equipCycle li>a',function(){
        if($(this).attr("ids")==0){
            $(id+" .large-half.defineTime").css("display","block");
        }else{
            $(id+" .large-half.defineTime").css("display","none");
        }
    });
}
//打开修改，模态框自动赋值
function equipMgTableModify(){
    $("#tab_equip_management tbody td .modify").on('click',function(){
        var id="#equipMg_modify";
        $(id+" .equipCode").val($(this).parents("tr").children("td:first-child").text());
        $(id+" .equipName").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .equipBrand").val($(this).parents("tr").children("td:nth-child(3)").text());
        $(id+" .equipSupplier a span").text($(this).parents("tr").children("td:nth-child(4)").text());
        $(id+" .equipSupplier a span").attr("ids",$(this).parents("tr").children("td:nth-child(4)").attr("ids"));
        $(id+" .equipLocation").val($(this).parents("tr").children("td:nth-child(5)").text());
        $(id+" .equipStatus a span").text($(this).parents("tr").children("td:nth-child(6)").text());
        $(id+" .equipStatus a span").attr("ids",$(this).parents("tr").children("td:nth-child(6)").attr("ids"));
        $(id+" .equipPurchase").val($(this).parents("tr").children("td:nth-child(7)").text());
        $(id+" .equipUsing").val($(this).parents("tr").children("td:nth-child(8)").text());
        $(id+" .equipResponsible").val($(this).parents("tr").children("td:nth-child(9)").text());
        $(id+" .equipCycle a span").text($(this).parents("tr").children("td:nth-child(10)").text());
        $(id+" .equipCycle a span").attr("ids",$(this).parents("tr").children("td:nth-child(10)").attr("ids"));
        $(id+" .marBotArea").val($(this).parents("tr").children("td:nth-child(14)").text());
        if($(this).parents("tr").children("td:nth-child(10)").attr("ids")==0){
            $(id+" .large-half.defineTime").css("display","block");
        }else{
            $(id+" .large-half.defineTime").css("display","none");
        }
        showDefineTime(id);
    });
}
//设备管理 查询供应商 添加修改供应商下拉
function forSupplySelect(){
    ajaxRequest("supplierAction!querySupplier.action","","addSupplySelect");
}
//设备管理 添加修改，供应商下拉选项赋值
function addSupplySelect(list){
    var html="";
    $.each(list,function(i,suppliers){
        html+=' <li><a ids="'+suppliers.id+'">'+suppliers.supplyname+'</a></li>';
    });
    $("#equipMg_modify .equipSupplier .areaZoneList-menu").html(html);
    $("#addEquipMge .equipSupplier .areaZoneList-menu").html(html);
   selectDropdownMenu("#equipMg_modify .areaZoneList-menu","#equipMg_modify .areaZoneList");
   selectDropdownMenu("#addEquipMge .areaZoneList-menu","#addEquipMge .areaZoneList");
}
//设备管理 添加
$("body").on('click','#tab_equip_management .btns .adding',function() {
    showDefineTime("#addEquipMge");
});
function equipMgAdd(){
    //$("body").on('click','#addEquipMge .determine',function() {
        var id="#addEquipMge";
        var equipCode=$(id+" .equipCode").val();
        var equipName=$(id+" .equipName").val();
        var equipBrand=$(id+" .equipBrand").val();
        var equipLocation=$(id+" .equipLocation").val();
        var equipPurchase=$(id+" .equipPurchase").val();
        var equipUsing=$(id+" .equipUsing").val();
        var equipStatus=$(id+" .equipStatus>a").attr("ids");
        var equipResponsible=$(id+" .equipResponsible").val();
        var equipCycle=$(id+" .equipCycle>a").attr("ids");
        var equipSupplierId=$(id+" .equipSupplier>a").attr("ids");
        var equipSupplierName=$(id+" .equipSupplier>a>span").text();
        var equipMark=$(id+" .marBotArea").val();
        var data="&equipment.code="+equipCode+"&equipment.name="+equipName+"&equipment.brand="+equipBrand+"&equipment.location="+equipLocation+
            "&equipment.buytime="+equipPurchase+"&equipment.usetime="+equipUsing+"&equipment.status="+equipStatus+"&equipment.chargeman="+equipResponsible+
            "&equipment.cycle="+equipCycle+"&equipment.sid="+equipSupplierId+"&equipment.supplyname="+equipSupplierName+"&equipment.mark="+equipMark;
        if(equipCycle==0){
            var starttime=$(id+" .startTime").val();
            var endtime=$(id+" .endTime").val();
            data=data+"&equipment.starttime="+starttime+"&equipment.endtime="+endtime;
        }
        ajaxRequest('equipmentAction!addEquipment.action',data,'queryEquipManageTable');
        inputModalEmpty();
        $("#addEquipMge textarea").val("");
    //});
}
//设备管理 修改
$("body").on('click','#equipMg_modify .determine',function(){
        var ids=$(this).attr("ids");
        var id="#equipMg_modify";
        var equipCode=$(id+" .equipCode").val();
        var equipName=$(id+" .equipName").val();
        var equipBrand=$(id+" .equipBrand").val();
        var equipLocation=$(id+" .equipLocation").val();
        var equipPurchase=$(id+" .equipPurchase").val();
        var equipUsing=$(id+" .equipUsing").val();
        var equipStatus=-1;
        if(!$(id+" .equipStatus>a").attr("ids")){
            equipStatus=$(id+" .equipStatus>a>span").attr("ids");
        }else{
            equipStatus=$(id+" .equipStatus>a").attr("ids");
        }
        var equipResponsible=$(id+" .equipResponsible").val();
        var equipCycle=-1;
        if(!$(id+" .equipCycle>a").attr("ids")){
            equipCycle=$(id+" .equipCycle>a>span").attr("ids");
        }else{
            equipCycle=$(id+" .equipCycle>a").attr("ids");
        }
        var equipSupplierId=-1;
        if(!$(id+" .equipSupplier>a").attr("ids")){
            equipSupplierId=$(id+" .equipSupplier>a>span").attr("ids");
        }else{
            equipSupplierId=$(id+" .equipSupplier>a").attr("ids");
        }
        var equipSupplierName=$(id+" .equipSupplier>a>span").text();
        var equipMark=$(id+" .marBotArea").val();
        var data="&equipment.id="+ids+"&equipment.code="+equipCode+"&equipment.name="+equipName+"&equipment.brand="+equipBrand+"&equipment.location="+equipLocation+
            "&equipment.buytime="+equipPurchase+"&equipment.usetime="+equipUsing+"&equipment.status="+equipStatus+"&equipment.chargeman="+equipResponsible+
            "&equipment.cycle="+equipCycle+"&equipment.sid="+equipSupplierId+"&equipment.supplyname="+equipSupplierName+"&equipment.mark="+equipMark;
        if(equipCycle==0){
            var starttime=$(id+" .startTime").val();
            var endtime=$(id+" .endTime").val();
            data=data+"&equipment.starttime="+starttime+"&equipment.endtime="+endtime;
        }
        ajaxRequest('equipmentAction!updateEquipment.action',data,'queryEquipManageTable');
    });
//设备管理 删除
$("body").on('click','#Mg_delete .to_delete',function(){
    var ids=$(this).attr("ids");
    var data="&ids="+ids;
    ajaxRequest('equipmentAction!deleteEquipment.action',data,'queryEquipManageTable');
});
//设备管理 查看详情
$("body").on('click','#tab_equip_management tbody td .detail',function(){
    var ids=$(this).attr("ids");
    var data="&maintain.eid="+ids;
    ajaxRequest('maintainAction!queryMaintain.action',data,'generateDetail');
});
//设备管理 生成详情页
function generateDetail(list){
    var html="";
    if(list==""){
        html="<span>无保养记录！</span>";
    }else{
        $.each(list,function(i,detailItems){
            var equipStatus;
            if(detailItems.status==1){
                equipStatus="运行良好";
            }else if(detailItems.status==2){
                equipStatus="设备老化";
            }else if(detailItems.status==3){
                equipStatus="部件损坏";
            }
            html+='<li><ul class="list-unstyled clearfix large-half">' +
                '<li><p>保养时间：'+checknull(detailItems.fittime)+'</p></li><li><p>保养人：'+checknull(detailItems.fitman)+'</p></li><li><p>设备状态：'+equipStatus+'</p></li>' +
                '<li class="totalLength"><p>保养内容：'+checknull(detailItems.mark)+'</p></li>' +
                '</ul></li>';
        });
    }
    $("#equipMg_detail .modal-body ol").html(html);
}
//设备管理 增加 保养记录
$("body").on('click','#equipMg_maintenance .determine',function(){
    var ids=$(this).attr("ids");
    var id="#equipMg_maintenance";
    var fitTime=$(id+" .fitTime").val();
    var fitMan=$(id+" .fitMan").val();
    var equipStatus=$(id+" .equipStatus>a").attr("ids");
    var mark=$(id+" .marBotArea").val();
    var data="&maintain.eid="+ids+"&maintain.fittime="+fitTime+"&maintain.fitman="+fitMan+"&maintain.status="+
        equipStatus+"&maintain.mark="+mark;
    ajaxRequest('maintainAction!addMaintain.action',data,'addMain');
    inputModalEmpty();
    $("#equipMg_maintenance textarea").val("");
});
function addMain(){
    msgTips("保养记录添加成功！");
}
//设备管理 生成二维码
$("body").on('click','#tab_equip_management tbody td .qrCode',function(){
    var ids=$(this).attr("ids");
    var data="&maintain.eid="+ids;
    var url=zoneServerIp+"/ucotSmart/management/qrCode.html?token="+permit+"&ids="+ids;
    $(".qrCreat").html("").qrcode(url);
    //ajaxRequest('equipmentAction!EquipmenQrById.action',data,'function a(){console.log(2);}');
});
//二维码打印
$("body").on('click','#equipMg_qrCode .to_print',function(){
    $("#creatQr").jqprint();
});
//设备管理 打印
$("body").on('click','#tab_equip_management .btns .print',function(){
    $("#tab_equip_management .tables .notPrint").hide();
    $("#tab_equip_management .tables").jqprint();
    $("#tab_equip_management .tables .notPrint").show();
});
//设备管理 导出
$("body").on('click','#tab_equip_management .btns .lead_out',function(){
    var equipMg_json=equipMg.concat();
    if(equipMg.length>0){
        downloadExl(equipMg_json,'equipMgDowExl');
    }else{
        msgTips("暂无数据");
    }
});

//工具管理
$("body").on('click','#tab_material_management .tool_management',function(){
    queryToolManageTable();
});
//工具管理 查询
function queryToolManageTable(){
    queryListByParams("/ucotSmart/toolAction!queryTool.action","","toolManagePage","addToolManageTable");
}
//动态数据加载 工具管理
function addToolManageTable(list){
    var len=list.length;
    var html="";
    $.each(list,function(i,tbodyTr){
        var toolStatus,toolStatusModal,toolAction;
        if(tbodyTr.status==1){
            toolStatus="入库";
            toolAction="借出";
            toolStatusModal="#material_lend_out";
        }else if(tbodyTr.status==2){
            toolStatus="借出";
            toolAction="入库";
            toolStatusModal="#material_inHousing";
        }
        html+='<tr ids="'+checknull(tbodyTr.id)+'"><td>'+checknull(tbodyTr.code)+'</td><td>'+checknull(tbodyTr.name)+'</td><td>'+checknull(tbodyTr.brand)+'' +
            '</td><td>'+checknull(tbodyTr.model)+'</td><td>'+checknull(tbodyTr.buytime)+'</td><td ids="'+checknull(tbodyTr.cusodianid)+'">'+checknull(tbodyTr.custodian)+
            '</td><td>'+toolStatus+'</td><td>'+checknull(tbodyTr.storagetime)+'</td><td>'+checknull(tbodyTr.borrowname)+'</td><td>'+checknull(tbodyTr.borrowtime)+'</td><td>'+
            checknull(tbodyTr.returntime)+'</td><td><a class="detail" data-toggle="modal" data-target="#toolMg_detail" ids="'+checknull(tbodyTr.id)+'">详情</a></td><td>'+checknull(tbodyTr.mark)+'</td><td>' +
            '<a data-toggle="modal" data-target="'+toolStatusModal+'" ids="'+checknull(tbodyTr.status)+'">'+toolAction+'</a>|' +
            '<a class="modify" data-toggle="modal" data-target="#material_tool_mg_modify">修改</a>|' +
            '<a class="delete" data-toggle="modal" data-target="#toolMg_delete">删除</a></td></tr>';
    });
    $("#tab_tool_management .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_tool_management .tables tbody",len,10);
    //增加自定义ids
    addIds("#tab_tool_management","#toolMg_delete",".to_delete");
    addIds("#tab_tool_management","#material_tool_mg_modify",".determine");//修改
    addIds("#tab_tool_management","#material_lend_out",".determine");//借出
    addIds("#tab_tool_management","#material_inHousing",".determine");//入库
    //修改自动赋值
    toolMgTableModify();
}
//工具管理 添加
$("body").on('click','#addToolMg .determine',function(){
    console.log("tool add");
    var id="#addToolMg";
    var toolCode=$(id+" .toolCode").val();
    var toolName=$(id+" .toolName").val();
    var toolBrand=$(id+" .toolBrand").val();
    var toolModel=$(id+" .toolModel").val();
    var toolPurchase=$(id+" .toolPurchase").val();
    var toolDepository=$(id+" .toolDepository").val();
    var toolStatus=$(id+" .toolStatus>a").attr("ids");
    var toolMark=$(id+" .marBotArea").val();
    var data="&tool.code="+toolCode+"&tool.name="+toolName+"&tool.brand="+toolBrand+"&tool.model="+toolModel+
        "&tool.buytime="+toolPurchase+"&tool.custodian="+toolDepository+"&tool.status="+toolStatus+"&tool.mark="+toolMark;
    ajaxRequest('toolAction!addTool.action',data,'queryToolManageTable');
    inputModalEmpty();
    $("#addToolMg textarea").val("");
});
//修改 自动赋值
function toolMgTableModify(){
    $("#tab_tool_management tbody td .modify").on('click',function(){
        var id="#material_tool_mg_modify";
        $(id+" .toolCode").val($(this).parents("tr").children("td:first-child").text());
        $(id+" .toolName").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .toolBrand").val($(this).parents("tr").children("td:nth-child(3)").text());
        $(id+" .toolModel").val($(this).parents("tr").children("td:nth-child(4)").text());
        $(id+" .toolPurchase").val($(this).parents("tr").children("td:nth-child(5)").text());
        $(id+" .toolDepository").val($(this).parents("tr").children("td:nth-child(6)").text());
        $(id+" .toolStatus a span").text($(this).parents("tr").children("td:nth-child(7)").text());
        $(id+" .toolStatus a span").attr("ids",$(this).parents("tr").children("td:nth-child(7)").attr("ids"));
        if($(this).parents("tr").children("td:nth-child(8)").text()!=="-"){
            $(id+" .toolInTime").val($(this).parents("tr").children("td:nth-child(8)").text());
        }else{
            $(id+" .toolInTime").val('');
        }
        if($(this).parents("tr").children("td:nth-child(9)").text()!=="-"){
            $(id+" .toolBorrow").val($(this).parents("tr").children("td:nth-child(9)").text());
        }else{
            $(id+" .toolBorrow").val('');
        }
        if($(this).parents("tr").children("td:nth-child(10)").text()!=="-"){
            $(id+" .toolBorrowTime").val($(this).parents("tr").children("td:nth-child(10)").text());
        }else{
            $(id+" .toolBorrowTime").val('');
        }
        if($(this).parents("tr").children("td:nth-child(11)").text()!=="-"){
            $(id+" .toolReturn").val($(this).parents("tr").children("td:nth-child(11)").text());
        }else{
            $(id+" .toolReturn").val('');
        }
        $(id+" .marBotArea").val($(this).parents("tr").children("td:nth-child(13)").text());
    });
}
//工具管理 修改
$("body").on('click','#material_tool_mg_modify .determine',function(){
    console.log("tool modify");
    var ids=$(this).attr("ids");
    var id="#material_tool_mg_modify";
    var codes=$(id+" .toolCode").val();
    var toolName=$(id+" .toolName").val();
    var toolBrand=$(id+" .toolBrand").val();
    var toolModel=$(id+" .toolModel").val();
    var toolPurchase=$(id+" .toolPurchase").val();
    var toolDepository=$(id+" .toolDepository").val();
    var toolStatus=$(id+" .toolStatus>a").attr("ids");
    var toolInTime=$(id+" .toolInTime").val();
    var toolBorrow=$(id+" .toolBorrow").val();
    var toolBorrowTime=$(id+" .toolBorrowTime").val();
    var toolReturn=$(id+" .toolReturn").val();
    var toolMark=$(id+" .marBotArea").val();
    var data="&tool.id="+ids+"&tool.code="+codes+"&tool.name="+toolName+"&tool.brand="+toolBrand+"&tool.model="+toolModel+
        "&tool.buytime="+toolPurchase+"&tool.custodian="+toolDepository+"&tool.status="+toolStatus+"&tool.mark="+toolMark+
        "&tool.storagetime="+toolInTime+"&tool.borrowname="+toolBorrow+"&tool.borrowtime="+toolBorrowTime+
        "&tool.returntime="+toolReturn;
    ajaxRequest('toolAction!updateTool.action',data,'queryToolManageTable');
});

//工具管理 借出
$("body").on('click','#material_lend_out .determine',function(){
    console.log("tool lead-out");
    var ids=$(this).attr("ids");
    var id="#material_lend_out";
    var toolBorrow=$(id+" .toolBorrow").val();
    var toolBorrowTime=$(id+" .toolBorrowTime").val();
    var toolReturn=$(id+" .toolReturn").val();
    var  data="&tool.id="+ids+"&tool.status=2"+"&tool.borrowname="+toolBorrow+"&tool.borrowtime="+
        toolBorrowTime+"&tool.returntime="+toolReturn;
    ajaxRequest('toolAction!updateTool.action',data,'queryToolManageTable');
});
//工具管理 入库
$("body").on('click','#material_inHousing .determine',function(){
    console.log("tool inhousing");
    var ids=$(this).attr("ids");
    var id="#material_inHousing";
    var toolInTime=$(id+" .toolInTime").val();
    var toolMark=$(id+" .marBotArea").val();
    var data="&tool.id="+ids+"&tool.status=1"+"&tool.storagetime="+toolInTime+"&tool.mark="+toolMark;
    ajaxRequest('toolAction!updateTool.action',data,'queryToolManageTable');
});
//工具管理 删除
$("body").on('click','#toolMg_delete .to_delete',function(){
    console.log("tool delete");
    var ids=$(this).attr("ids");
    var data="&ids="+ids;
    ajaxRequest('toolAction!deleteTool.action',data,'queryToolManageTable');
});
//工具管理 详情
$("body").on('click','#tab_tool_management tbody td .detail',function(){
    var ids=$(this).attr("ids");
    var data="&restitution.toolid="+ids;
    ajaxRequest('restitutionAction!queryRestitution.action',data,'generateToolMgDetail');
});
//工具管理 生成详情页
function generateToolMgDetail(list){
    console.log(list);
    var html="";
    if(list==""){
        html="<span>无借出记录！</span>";
    }else{
        $.each(list,function(i,detailItems){
            html+='<li><ul class="list-unstyled clearfix large-half">' +
                '<li><p>借&nbsp;&nbsp;出&nbsp;&nbsp;人：'+checknull(detailItems.bname)+'</p></li><li><p>借出时间：'+checknull(detailItems.borrowtime)+
                '</p></li><li><p>入库时间：'+checknull(detailItems.retruntime)+'</p></li>' +
                '<li class="totalLength"><p>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：'+checknull(detailItems.mark)+'</p></li>' +
                '</ul></li>';
        });
    }
    $("#toolMg_detail .modal-body ol").html(html);
}

/**
 * Created by GIGA on 2017/9/12.
 */
/**
 * 点击信息推送、广告推送、全部的时候都默认推送门口机广告
 * */
$('.information_push,.advertising,li a[href="#tab_push_all_machine"]').click(function(){
    $("#advertising_push_all_machine_div3").hide();
    $("#advertising_push_all_machine_div1").show();
    $("#advertising_push_all_machine_btn_group").show();
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryAdvertisingAllMachineJump');
    queryAdvertisingAllMachineJump();
});

function queryAdvertisingAllMachineJump(){
    $("#advertising_push_all_machine_div3").hide();
    $("#advertising_push_all_machine_div1").show();
    $("#advertising_push_all_machine_btn_group").show();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adAction!findAdFile.action",
        data: {
            'token': permit,
            'pager.pages':1,
            'pager.pagesize':10,
            'ad.filename':"",
            'ad.filetype':"",
            'ad.createtime':"",
            'ad.status':"",
            'ad.custormername':""
        },
        dataType: "json",
        success: function (data) {
            //渲染数据
            var list=data.obj.data;
            var totalNum = data.obj.data_count;//总数
            showAdvertisingPushTableList(list);
            var totalPages = Math.ceil(totalNum/10);//总页数
            if(totalPages==1||totalPages==0){
                $('#advertising_push_all_machineList-paging').empty();
                $('#advertising_push_all_machine_paging-tips').html("当前页面共"+totalNum+"条数据 总共"+totalNum+"条数据");
            }else{
                show_advertising_push_page_plugin(list.length,totalNum,totalPages);
            }
        }
    });
}

/*2.给分页插件绑定ajax请求，根据当前页查看室内机数据*/
function show_advertising_push_page_plugin(pageNum,totalNum,totalPages){
    var liNums=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        liNums=totalPages;
    }
    $('#advertising_push_all_machineList-paging').empty();
    $('#advertising_push_all_machineList-paging').append('<ul id="advertising_push_all_machine_page" class="pagination-sm"></ul>');
    $('#advertising_push_all_machine_page').twbsPagination({
        totalPages: totalPages,
        visiblePages: liNums,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            $.ajax({
                type: "post",
                url: zoneServerIp+"/ucotSmart/adAction!findAdFile.action",
                data: {
                    'token': permit,
                    'pager.pages':page,
                    'pager.pagesize':10,
                    'ad.filename':"",
                    'ad.filetype':"",
                    'ad.createtime':"",
                    'ad.status':"",
                    'ad.custormername':""
                },
                dataType: "json",
                success: function (data) {
                    var list=data.obj.data;
                    showAdvertisingPushTableList(list);
                    $('#advertising_push_all_machine_paging-tips').empty();
                    $('#advertising_push_all_machine_paging-tips').html("当前页面共" +  list.length + "条数据 总共" + totalNum + "条数据");
                }
            });
        }
    });
}


//添加广告
function addAdvertising(){
    var formData = new FormData($('#advertising_push_all_machine_upload_form')[0]);
    $.ajax({
        type:'post',
        data:formData,
        url:zoneServerIp+"/ucotSmart/adAction!uploadAd.action?token="+permit,
        async:false,
        cache: false,
        processData: false,
        contentType: false,
        dataType:'json',//返回数据类型
        success: function (data) {
            if(data.success==true){
                msgTips("广告添加成功！");
            }else{
                msgTips(data.msg);
            }
            $("#addAdModal").modal('hide');
            queryAdvertisingAllMachineJump();
        }
    });
}

//检查删除是否选中
function checkDelAddIsChoice(){
    if(advertising_push_all_machine_id==0) {
        msgTips("请选择需要要删除的广告！");
    }else{
        $("#delAd_all_Machine_Modal").modal();
    }
}

//删除门口机广告
function delAdallMachine(){
   $.ajax({
       type: "post",
       url: zoneServerIp+"/ucotSmart/adAction!delAd.action",
       data: {
           'token': permit,
           'id':advertising_push_all_machine_id
       },
       dataType: "json",
       success: function (data) {
           queryAdvertisingAllMachineJump();
       }
   });
    $("#delAd_all_Machine_Modal").modal('hide');
}

//检查推送是否勾选
//如果已经勾选,显示门口机列表进入推送广告页面并且要隐藏广告列表
function checkIsSelected(){
    if(advertising_push_all_machine_id==0) {
        msgTips("请选择需要要推送的广告！");
    }else{
        $("#leadOutModal").modal();
        $("#advertising_push_all_machine_div1").hide();
        $("#advertising_push_all_machine_btn_group").hide();
        $("#advertising_push_all_machine_div3").show();
        queryAllAdvertisingByMachineTypeJump(null);
    }
}

function selectMachineType(type){
    queryAllAdvertisingByMachineTypeJump(type);
}

//查询所有的门口机
function queryAllAdvertisingByMachineTypeJump(type){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
        data: {
            'token': permit,
            'controller.type':type,
            'controller.uuid':getUUidByToken(permit),
            'pager.pages':1,
            'pager.pagesize':9
        },
        dataType: "json",
        success: function (data) {
            //渲染门口机
            var list=data.obj.data;
            var totalNum = data.obj.data_count;//总数
            totalPages = Math.ceil(totalNum/pageSize);//总页数
            if(totalPages==1||totalPages==0){
                showAdvertisingPushallMachineTableList(list);
                $('#advertising_push_all_machineList-paging6').empty();
                $('#advertising_push_all_machine_paging-tips6').html("当前页面共"+totalNum+"条数据 总共"+totalNum+"条数据");
            }else{
                showaddPagePluginForallMachine(list.length,totalNum,totalPages,type);
            }
        }
    });
}
/*门口机分页插件*/
function showaddPagePluginForallMachine(pageNum,totalNum,totalPages,type){
    var liNums=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        liNums=totalPages;
    }
    $('#advertising_push_all_machineList-paging6').empty();
    $('#advertising_push_all_machineList-paging6').append('<ul id="advertising_push_all_machine_page6" class="pagination-sm"></ul>');
    $('#advertising_push_all_machine_page6').twbsPagination({
        totalPages: totalPages,
        visiblePages: liNums,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            $.ajax({
                type: "post",
                url: zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
                data: {
                    'token': permit,
                    'controller.type':type,
                    'pager.pages':page,
                    'pager.pagesize':9
                },
                dataType: "json",
                success: function (data) {
                    var list=data.obj.data;
                    showAdvertisingPushallMachineTableList(list);
                    $('#advertising_push_all_machine_paging-tips6').empty();
                    $('#advertising_push_all_machine_paging-tips6').html("当前页面共" + list.length + "条数据 总共" + data.obj.data_count + "条数据");
                }
            });
        }
    });
}

//选择所有
var selectedNum = 0;//被选中的个数
function selectAllMachine(){
    var imgarr = $("#advertising_push_all_machine_Info-body4").find("img");
    if(selectedNum==0){
        imgarr.attr("src","img/choice.png");
        selectedNum = 9;
    }else{
        imgarr.attr("src","img/nochoice.png");
        selectedNum = 0;
    }
}

//进入推送广告后
function pushAdAllMachine(){
    var imgarr = $("#advertising_push_all_machine_Info-body4").find("img");
    var macList = "";
    var typeList = "";
    for(var i=0;i<imgarr.length;i++){
        if($(imgarr[i]).attr("src")=="img/choice.png"){
            macList += $(imgarr[i]).attr("id").split(",")[0]+",";
            typeList += $(imgarr[i]).attr("id").split(",")[1]+",";
        }
    }
    var idList = idstr.substr(0,idstr.lastIndexOf(","));
    macList = macList.substr(0,macList.lastIndexOf(","));
    typeList = typeList.substr(0,typeList.lastIndexOf(","));
    //alert(macList+"-----"+typeList+"-------"+idList);
    var playtime = $("#adplaytime").val();
    var starttime = $("#adstarttime").val();
    var endtime = $("#adendtime").val();
    if(playtime==""){
        msgTips("播放时间不能为空");
    }else if(starttime==""){
        msgTips("开始播放时间不能为空");
    }else if(endtime==""){
        msgTips("结束播放时间不能为空");
    }
    pushAdToDoor(idList,macList,typeList,playtime,starttime,endtime);
}

function pushAdToDoor(idList,macList,typeList,playtime,starttime,endtime){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adAction!updatingAdToDoorForNew.action",
        data: {
            'token': permit,
            'operationType':1,
            'idList':idList,
            'macList':macList,
            'typeList':typeList,
            'playtime':playtime,
            'starttime':starttime,
            'endtime':endtime
        },
        dataType: "json",
        success: function (data) {
            msgTips(data.msg);
            $("#advertising_push_all_machine_div3").hide();
            $("#advertising_push_all_machine_div1").show();
            $("#advertising_push_all_machine_btn_group").show();
            queryAdvertisingAllMachineJump();
            //推送完成后清空
            idstr="";
        }
    });
}

//广告下架
function soldOutAd(advertisingId){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adNewAction!updatingAdToAllMachine.action",
        data: {
            'token': permit,
            'id':advertisingId
       },
        dataType: "json",
        success: function (data) {
            //推送完成后清空
            idstr="";
            queryAdvertisingAllMachineJump();
        }
    });
}

function deleteAdByBatchTips(){
    var imgarr = $("#advertising_push_all_machine_Info-body1").find("img");
    var flag = true;
    var idList = "";
    imgarr.each(function (index,item) {
        if($(imgarr[index]).attr("src")=="img/choice.png"){
            flag = false;
            idList += $(imgarr[index]).attr("id").substr(2)+",";
        }
    });
    idList = idList.substr(0,idList.lastIndexOf(","));
    sessionStorage.setItem("alladidList",idList);
    if(flag){
        msgTips("请选择要删除的广告编号");
    }else{
        $("#delAd_all_Machine_single").modal();
    }
}

function deleteAdById(id){
    sessionStorage.setItem("singleadids",id);
    $("#delAd_single_Machine").modal();
}


//删除单个
function delAdBySingle(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adAction!delAd.action",
        data: {
            'token': permit,
            'id':sessionStorage.getItem("singleadids")
        },
        dataType: "json",
        success: function (data) {
            $("#delAd_single_Machine").modal('hide');
            queryAdvertisingAllMachineJump();
        }
    });
}

//批量删除
function deleteAdByBatch(){
   $.ajax({
         type: "post",
         url: zoneServerIp+"/ucotSmart/adAction!delBybatchAd.action",
         data: {
         'token': permit,
         'idList':sessionStorage.getItem("alladidList")
         },
         dataType: "json",
         success: function (data) {
         $("#delAd_all_Machine_single").modal('hide');
             queryAdvertisingAllMachineJump();
         }
     });
}

//下载
function downloadAd(fileName){
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+'/ucotSmart/downAdAction!down.action?fileName='+fileName);
    var input1 = $('<input>');
    input1.attr('type', 'hidden');
    input1.attr('name', 'token');
    input1.attr('value', permit);
    $('body').append(form);
    form.append(input1);
    form.submit();
    form.remove();
}

//全选
function selectAllAd(){
    var imgarr = $("#advertising_push_all_machine_Info-body1").find("img");
    imgarr.each(function(index,item){
        if($(imgarr[index]).attr("src")=="img/nochoice.png"){
            $(imgarr[index]).attr("src","img/choice.png");
            advertising_push_all_machine_id = 1;
        }else{
            $(imgarr[index]).attr("src","img/nochoice.png");
            advertising_push_all_machine_id = 0;
        }
    });
}
function rest_addAdvertising(){
    $("#advertising_push_all_machine_upload_form")[0].reset();
}


//取消
function cancel(id){
    $("#"+id).modal('hide');
}

//上传文件的提示
$(function(){
    $("input[type=file]").change(function(){$(this).parents(".ad_uploader").find(".ad_filename").val($(this).val());});
    $("input[type=file]").each(function(){
        if($(this).val()==""){$(this).parents(".ad_uploader").find(".ad_filename").val("未选择任何文件");}
    });
});

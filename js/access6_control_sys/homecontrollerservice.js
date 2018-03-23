/**
 * Created by GIGA on 2017/8/31. 室内机
 */

var pageSize = 10;
var totalPages = 0;
/*点击室内机查询数据*/
$('.indoor_machine').click(function(){
    sessionStorage.removeItem("homecontrollercode");
    $('.findCodeU').hide();
    $('.findCodeH').hide();
    queryHomeController(1,null);
    sessionStorage.removeItem("buildingcode");
});
// 条件查询
function homecontroller(){
    let parentBox=$("#homecontroller_select_search_condition");
    let code=parentBox.find(".codeH option:selected").val();
    if(code=="0"||code==null){
        code=parentBox.find(".codeU").val();
    }
    if(code=="0"||code==null){
        code=parentBox.find(".codeD").val();
    }
    code==0||code==null?code="":"";
    queryHomeController(1,code);
};
//1.点击室内机时应该刚开始是查询第一页的数据并显示分页插件
function queryHomeController(currentPage,homecontrollercode){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
        data: {
            'token':permit,
            'controller.type':'H',
            'controller.code':homecontrollercode,
            'controller.uuid':getUUidByToken(permit),
            'pager.pages':currentPage,
            'pager.pagesize':pageSize
        },
        dataType: "json",
        success: function (data) {
            queryBuildingForHomecontroller();
            var list=data.obj.data;
            addHomeControllerTableList(list);
            var totalNum = data.obj.data_count;//总数
            var totalPages = Math.ceil(totalNum/pageSize);//总页数
            if(totalPages==1||totalPages==0){
                $('#homecontrollerList-paging').empty();
                $('#homecontroller_paging-tips').html("当前页面共"+totalNum+"条数据 总共"+totalNum+"条数据");
            }else{
                showHomecontrollerPagePlugin(list.length,totalNum,totalPages);
            }
        }
    });
}


function getZoneCodeByToken1(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.endsWith("N"))
        return code.substring(0,code.indexOf("d")+1);
}


function queryBuildingForHomecontroller(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        data: {
            'token':permit,
            'zonecode':getZoneCodeByToken1(permit)
        },
        dataType: "json",
        success: function (data) {
            $(".codeD").empty();
            $(".codeD").append("<option value=0>全部房屋</option>");
            for(var i=0;i<data.obj.length;i++){
                var newcode = data.obj[i].code.replace("d","街区").replace("p","期").replace("z","区").replace("b","栋");
                $(".codeD").append("<option value="+data.obj[i].code+">"+newcode+"</option>");
            }
            //默认选中
            var buildingcode = sessionStorage.getItem("buildingcode");
            $(".codeD option[value="+buildingcode+"]").attr("selected",true);
        }

    });
}

function queryBuildingForHomecontroller_add(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        data: {
            'token':permit,
            'zonecode':getZoneCodeByToken1(permit)
        },
        dataType: "json",
        success: function (data) {
            $("#homecontroller-add-form .codeD_add").empty();
            var html="<option value=0>全部房屋</option>";
            for(var i=0;i<data.obj.length;i++){
                var newcode = data.obj[i].code.replace("d","街区").replace("p","期").replace("z","区").replace("b","栋");
                html+="<option value="+data.obj[i].code+">"+newcode+"</option>";
            }
            $("#homecontroller-add-form .codeD_add").html(html);
            //默认选中
            // var buildingcode = sessionStorage.getItem("buildingcode");
            // $(".codeD_add option[value="+buildingcode+"]").attr("selected",true);

        }

    });
}

/*2.给分页插件绑定ajax请求，根据当前页查看室内机数据*/
function showHomecontrollerPagePlugin(pageNum,totalNum,totalPages){
    var liNums=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        liNums=totalPages;
    }
    $('#homecontrollerList-paging').empty();
    $('#homecontroller_paging-tips').empty();
    $('#homecontroller_paging-tips').html("当前页面共" + pageNum + "条数据 总共" + totalNum + "条数据");
    $('#homecontrollerList-paging').append('<ul id="homecontroller_page" class="pagination-sm"></ul>');
    var homecontrollerpage ;
    $('#homecontroller_page').twbsPagination({
        totalPages: totalPages,
        visiblePages: liNums,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            homecontrollercode = sessionStorage.getItem("homecontrollercode");
            homecontrollerpage = page;
        }
    });
    $("#homecontroller_page ").on('click', 'a', function(){
        homecontrollercode = sessionStorage.getItem("homecontrollercode");
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
            data: {
                'token':permit,
                'controller.type':'H',
                'controller.code':homecontrollercode,
                'pager.pages':homecontrollerpage,
                'pager.pagesize':pageSize
            },
            dataType: "json",
            success: function (data) {
                var list=data.obj.data;
                addHomeControllerTableList(list);
                $('#homecontroller_paging-tips').empty();
                $('#homecontroller_paging-tips').html("当前页面共" + list.length + "条数据 总共" + data.obj.data_count + "条数据");
            }
        });
    });
}

//添加框
function load_add_homecontroller_window(){
    queryBuildingForHomecontroller_add();
    $("#homecontroller-modal-add :input").val("");
    $("#homecontroller-modal-add select.codeD_add").find("option").removeAttr("selected");
    $("#homecontroller-modal-add").modal();
    $('.findCodeU_add').hide();
    $('.findCodeH_add').hide();
}

//导入
function importHomeController(){
    var formData = new FormData($('#home_controller_upload_form')[0]);
    $.ajax({
        type:'post',
        data:formData,
        url:zoneServerIp+'/ucotSmart/excelControllerAction!pullControllerExcel.action?token='+permit,
        async:false,
        cache: false,
        processData: false,
        contentType: false,
        dataType:'json',//返回数据类型
        success: function (data) {
            msgTips(data.msg);
            //添加成功显示最后一页
            queryHomeController(1,null);
        }
    });
}

//导入重置
function resetHomeControllerImport(){
    $('#home_controller_upload_form')[0].reset();
}

//导出成功
function exportHomeController(){
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+'/ucotSmart/excelControllerAction!getControllerExcel.action');
    var input1 = $('<input>');
    input1.attr('type', 'hidden');
    input1.attr('name', 'token');
    input1.attr('value', permit);
    $('body').append(form);
    form.append(input1);
    form.submit();
    form.remove();
}

//根据老版本上的界面来写//200002d1p1z1b
function selectCodeD(d){
    var buildingcode = $('.codeD option:selected').val();
    sessionStorage.setItem("buildingcode",buildingcode);
    if(d==0){
        $('.findCodeU').hide();
        $('.findCodeH').hide();
        sessionStorage.removeItem("homecontrollercode");
        queryHomeController(1,null);
    }else{
        $('.findCodeU').show();
        //显示后要将option中的内容添加进去
        selectUnit(buildingcode);
    }
}

function selectUnit(buildingcode){
    $.ajax({
        type:'post',
        dataType:'json',
        url:zoneServerIp+'/ucotSmart/building!queryUnit.action',
        data:{
            'token':permit,
            'buildingcode':buildingcode
        },
        success:function(data){
            var arr = eval(data.obj);
            $('.codeU').empty();
            $(".codeU").append("<option value='0'>请选择单元</option>");
            for(var x=0;x<arr.length;x++){
                var u = arr[x].code.substring(arr[x].code.indexOf('b')+1).replace('u','单元');
                $(".codeU").append('<option value='+arr[x].code+'>'+u+'</option>');
            }
        }
    });
}
//200002d1p1z1b1u
function selectCodeU(u){
    var unitcode = $('.codeU option:selected').val();
    if(u==0){
        $('.findCodeH').hide();
    }else{
        $('.findCodeH').show();
        queryHomeByUnitcode(unitcode);
    }
}

function queryHomeByUnitcode(unitcode){
    $.ajax({
        type:'post',
        dataType:'json',
        url:zoneServerIp+'/ucotSmart/building!queryHomeByUnitcode.action',
        data:{
            'token':permit,
            'unitcode':unitcode
        },
        success:function(data){
            var arr = eval(data.obj);
            $('.codeH').empty();
            var opt ='<option value="0">请选择楼层房间</option>';
            $('.codeH').append(opt);
            for(var x=0;x<arr.length;x++){
                var u = arr[x].code.replace('d','街区').replace('p','期').replace('z','区').replace('b','栋')
                    .replace('u','单元').replace('f','层').replace('h','室');
                // var opt1 = '<option value='+(x+1)+'>'+u+'</option>';
                var opt1 = '<option value='+arr[x].code+'>'+u+'</option>';
                $('.codeH').append(opt1);
            }
        }
    });
}

//根据得到的房间号进行条件查询//200002d1p1z1b1u1f1h//doorCtrollerAction!findDoorContrller.action
// function selectCodeH(){
//     var codeHOpt = $('.codeH option:selected').text();
//     var homecontrollercode = codeHOpt.replace('街区','d').replace('期','p').replace('区','z').replace('栋','b')
//         .replace('单元','u').replace('层','f').replace('室','h');
//     queryHomeController(1,homecontrollercode);
//     sessionStorage.setItem("homecontrollercode",homecontrollercode);
// }



//加载添加窗口中的房屋编号
function selectCodeD_add(d){
    var buildingcode = $('.codeD_add option:selected').val();
    sessionStorage.setItem("buildingcode",buildingcode);
    if(d==0){
        $('.findCodeU_add').hide();
        $('.findCodeH_add').hide();
        sessionStorage.removeItem("homecontrollercode");
        queryHomeController(1,null);
    }else{
        $('.findCodeU_add').show();
        //显示后要将option中的内容添加进去
        selectUnit_add(buildingcode);
    }
}

function selectUnit_add(buildingcode){
    $.ajax({
        type:'post',
        dataType:'json',
        url:zoneServerIp+'/ucotSmart/building!queryUnit.action',
        data:{
            'token':permit,
            'buildingcode':buildingcode
        },
        success:function(data){
            var arr = eval(data.obj);
            $('.codeU_add').empty();
            $(".codeU_add").append("<option value='0'>请选择单元</option>");
            for(var x=0;x<arr.length;x++){
                var u = arr[x].code.substring(arr[x].code.indexOf('b')+1).replace('u','单元');
                $(".codeU_add").append('<option value='+arr[x].code+'>'+u+'</option>');
            }
        }
    });
}
//200002d1p1z1b1u
function selectCodeU_add(u){
    var unitcode = $('.codeU_add option:selected').val();
    if(u==0){
        $('.findCodeH_add').hide();
    }else{
        $('.findCodeH_add').show();
        queryHomeByUnitcode_add(unitcode);
    }
}

function queryHomeByUnitcode_add(unitcode){
    $.ajax({
        type:'post',
        dataType:'json',
        url:zoneServerIp+'/ucotSmart/building!queryHomeByUnitcode.action',
        data:{
            'token':permit,
            'unitcode':unitcode
        },
        success:function(data){
            var arr = eval(data.obj);
            $('.codeH_add').empty();
            var opt ='<option value="0">请选择楼层房间</option>';
            $('.codeH_add').append(opt);
            for(var x=0;x<arr.length;x++){
                var u = arr[x].code.replace('d','街区').replace('p','期').replace('z','区').replace('b','栋')
                    .replace('u','单元').replace('f','层').replace('h','室');
                var opt1 = '<option value='+(x+1)+'>'+u+'</option>';
                $('.codeH_add').append(opt1);
            }
        }
    });
}

//根据得到的房间号进行条件查询//200002d1p1z1b1u1f1h//doorCtrollerAction!findDoorContrller.action
function selectCodeH_add(){
    var codeHOpt = $('.codeH_add option:selected').text();
    var homecontrollercode_add = codeHOpt.replace('街区','d').replace('期','p').replace('区','z').replace('栋','b')
        .replace('单元','u').replace('层','f').replace('室','h');
    sessionStorage.setItem("homecontrollercode_add",homecontrollercode_add);
}

function addHomeController(){
    sessionStorage.removeItem("homecontrollercode");
    var mac = $('#homecontroller-mac').val();
    var ip = $('#homecontroller-ip').val();
    var host = $('#homecontroller-host').val();
    var gatewayip = $('#homecontroller-gatewayip').val();
    var serverip = $('#homecontroller-serverip').val();
    var maskcode = $('#homecontroller-maskcode').val();
    var maindns = $('#homecontroller-maindns').val();
    var roomdid = $('#homecontroller-roomdid').val();
    var subdns = $('#homecontroller-subdns').val();
    var homecontrollercode_add = sessionStorage.getItem("homecontrollercode_add");
    $.ajax({
        type:'post',
        dataType:'json',
        async:false,
        url:zoneServerIp+'/ucotSmart/controllerAction!addController.action',
        data:{
            'token':permit,
            'ctr.mac':mac,
            'ctr.roomdid':roomdid,
            'ctr.ip':ip,
            'ctr.host':host,
            'ctr.gatewayip':gatewayip,
            'ctr.serverip':serverip,
            'ctr.maskcode':maskcode,
            'ctr.maindns':maindns,
            'ctr.subdns':subdns,
            'ctr.code':homecontrollercode_add
        },
        success:function(data){
            if(data.success==true){
                msgTips("增加成功!");
            }else{
                msgTips(data.msg);
            }
            $('#homecontroller-modal-add').modal('hide');
            queryHomeController(1,null);
            sessionStorage.removeItem("homecontrollercode_add");
        }
    });
}

//重置
function resetHomeController(){
    sessionStorage.removeItem("buildingcode");
    $("#homecontroller-add-form")[0].reset();
    $('.findCodeU_add').hide();
    $('.findCodeH_add').hide();
    var inputArr = $("#homecontroller-modal-add").find("input");
    inputArr.each(function(index,item){
        $(inputArr[index]).val("");
    });
}

//删除室内机
function removehomecontroller(){
    $.ajax({
        type:'post',
        dataType:'json',
        async:false,
        url:zoneServerIp+'/ucotSmart/controllerAction!cancelController.action',
        data:{
            'token':permit,
            'ctr.id':homecontrollerdeleteId
        },
        success:function(data){
            $("#homecontroller-modal-delete").modal('hide');
            if(data.sucess=='true'||data.success==true){
                queryHomeController(1,null);
            }else{
                msgTips("删除失败");
            }
        }
    });
}

function homecontrollerReplaceMac(){
    var homecontrolleroldmac = sessionStorage.getItem("homecontrolleroldmac");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!replaceHomeController.action",
        data: {
            'token':permit,
            'newmac':$("#homecontroller-newmac").val(),
            'oldmac':homecontrolleroldmac
        },
        dataType: "json",
        success: function (data) {
            $("#homecontroller-modal-update").modal('hide');
            queryHomeController(1,null);
        }
    });
}
//跟新某一台机器的户户通电话本
function updatePhoneBookRoll(mac){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!informToGetIpformSingle.action",
        dataType: "json",
        data: {
            "token":permit,
            "mac":mac
        },
        success: function (data) {
            console.log("新某一台机器的户户通电话本");
            console.log(data);
            //    数据
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
}
//获取电话本信息
function homePhonebook(mac){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!getControllerRealInfo.action",
        dataType: "json",
        data: {
            "token":permit,
            "mac":mac
        },
        success: function (data) {
            console.log("获取电话本");
            console.log(data);
            //    数据
            if(data.obj){
                localStorage.doorPhonebook=JSON.stringify(data.obj);
                paddingManualhome(1);
            }else{
                msgTips(data.msg);
            };
            //localStorage.doorPhonebook=JSON.stringify(homePhonebookobj)
            //paddingManualhome(1);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function paddingManualhome(page,type){
        var obj = JSON.parse(localStorage.doorPhonebook).call_info;
        var nub=paddingBoxhome(obj,page,type);
        var html='';
        for(var i = nub.initial_nub; i < nub.lth_nub;i++){
            html+='<tr><td>'+obj[i]._id+'</td><td>'+obj[i].telephone+'</td><td>'+obj[i].ip+'</td><td>'+obj[i].code+'</td></tr>';
        }
    $("#homePhonebookForm thead").html('<tr><th>ID</th><th>Telephone</th><th>IP</th><th>Code</th>');
        $("#homePhonebookLest").html(html);
    $("#homePhonebookForm .pagingImplement,#homeContrast").show();
        $("#homePhonebook").modal("show");
};
function paddingBoxhome(obj,page,type){
    var totalNum=obj.length;
    var pageTotalNum=Math.ceil(totalNum/pageListSize);
    if(totalNum-pageListSize*page>=0){
        var pageList=pageListSize;
    }else{
        var pageList=totalNum-pageListSize*(page-1);
    }
    var initial_nub=(page-1)*pageListSize;
    var lth_nub=initial_nub+pageListSize;
    if(lth_nub>totalNum){
        lth_nub=totalNum;
    }
    console.log(pageList);
    $("#homePhonebookForm .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
    if(!type||type!="paging"){
        pagingPlugin(pageList,totalNum,"homePhonebookForm",{"functions":"paddingManualhome(homelistPage,'paging')"});
    };
    var nub;
    return nub={"initial_nub":initial_nub,"lth_nub":lth_nub};
};
function homeContrast(){
    //对比
    var honeMac = JSON.parse(localStorage.doorPhonebook).compare.onlyMachineHavephone;
    var honeSer = JSON.parse(localStorage.doorPhonebook).compare.onlyServerHavephone;
    var lth;
    honeMac>honeSer?lth=honeMac.length:lth=honeSer.length;
    var html='';
    for(var i = 0; i < lth;i++){
        html+='<tr><td>'+honeMac[i].code+'</td><td>'+honeMac[i].id+'</td><td>'+honeMac[i].ip+'</td><td></td><td>'+honeSer[i].code+'</td><td>'+honeSer[i].id+'</td><td>'+honeSer[i].ip+'</td></tr>';
    }
    $("#homePhonebookForm thead").html('<tr><th>Code</th><th>ID</th><th>IP</th><th>室内机/服务器</th><th>Code</th><th>ID</th><th>IP</th>');
    $("#homePhonebookLest").html(html);
    $("#homePhonebookForm .pagingImplement,#homeContrast").hide();
};
/**
 * Created by asus on 2017/8/25. 围墙机 门口机 中心机
 */
var pageSize = 10;

$('li a[href="#tab_door_machine"]').click(function(){
    sessionStorage.removeItem("code");
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryEnTranceMachineJump(1,null,"D")');
    queryEnTranceMachineJump(1,null,"D");
});
$('li a[href="#tab_fence_machine"]').click(function(){
    sessionStorage.removeItem("code");
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryEnTranceMachineJump(1,null,"W")');
    queryEnTranceMachineJump(1,null,"W");
});
$('li a[href="#tab_center_machine"]').click(function(){
    sessionStorage.removeItem("code");
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryEnTranceMachineJump(1,null,"C")');
    queryEnTranceMachineJump(1,null,"C");
});

/**
 * 加载数据
 */
function queryEnTranceMachineJump(page,code,type) {
    machineLoadListShow(type);
    querySelectDoorMachine(type);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
        dataType: "json",
        data: {
            "token": permit,
            "controller.code": "",
            "controller.type":type,
            "controller.uuid":getUUidByToken(permit),
            "controller.ip":"",
            "pager.pages":page,
            "pager.pagesize":pageSize
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pageMachineType(list,type);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#machine_paging_'+type+'').empty();
            $('#machine_tips_'+type+'').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryDoorMachineListByPage(list.length, totalNum,pageNum,type,"","");
            }
        },
        error: function (data, status) {
            msgTips("加载门口机信息查询异常!");
        }
    });
}

/**
 * 根据不同类型调用不同函数进行渲染
 */
function pageMachineType(list,type){
    switch (type){
        case 'D':pageEntranceMachine(list,type);
            break;
        case 'C':pageEntranceMachine(list,type);
            break;
        case 'W':pageEntranceMachine(list,type);
            break;
    }
}

/**
 * 条件查询
 */
function doorMachineSearchPara(type){
    var doorMachineIp = $("#machine_ip_"+type+'').val();
    var doorMachineCodeChildFirst = $("#machine_code_child_"+type+'').find("option:selected").val();
    var doorMachineCodeUnitChildSecond ="";
    if(doorMachineCodeChildFirst==0){
        doorMachineCodeChildFirst="";
    }else{
        doorMachineCodeUnitChildSecond = $("#machine_code_unit_child_"+type+'').find("option:selected").val();
        if(doorMachineCodeUnitChildSecond==0){
            doorMachineCodeUnitChildSecond = "";
        }else{
            doorMachineCodeChildFirst = doorMachineCodeUnitChildSecond;
        }
    }
    sessionStorage.setItem("doorMachineCode",doorMachineCodeChildFirst);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
        dataType:"json",
        data:{
            "token":permit,
            "controller.code":doorMachineCodeChildFirst,
            "controller.uuid":getUUidByToken(permit),
            "controller.ip":doorMachineIp,
            "controller.type":type,
            "pager.pages":1,
            "pager.pagesize":10,
        },
        success:function(data){
            var list=eval(data.obj.data);
            pageEntranceMachine(list,type);
            var totalNum=data.obj.data_count;//总数
            var pageNum=Math.ceil(totalNum/10);//总页数
            $('#machine_paging_'+type+'').empty();
            $('#machine_tips_'+type+'').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum!=1&&pageNum!=0){
                queryDoorMachineListByPage(list.length, totalNum,pageNum,type,doorMachineIp,doorMachineCodeChildFirst);
            }
        },
        error: function (data, status) {
            msgTips("门口机条件查询异常!");
        }
    });
}

/*
 *给门口机分页插件绑定ajax请求，根据页码门口机数据
 */
function queryDoorMachineListByPage(pageNum,totalNum,totalPages,type,ip,code){
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    var divname='machine_paging_'+type;
    var ulname='pagination-ll-'+type;
    $('#'+divname+'').empty();
    $('#'+divname+'').append('<ul id="'+ulname+'" class="pagination-sm"></ul>');
    var machinePage;
    $('#'+ulname+'').twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            machinePage=page;
        }
    });
    $('#'+ulname+'').on('click', 'a', function(){
        $.ajax({
            type: "post",
            url:zoneServerIp+"/ucotSmart/doorCtrollerAction!findDoorContrller.action",
            dataType:"json",
            data:{
                "token":permit,
                "controller.code":code,
                "controller.uuid":getUUidByToken(permit),
                "controller.ip":ip,
                "controller.type":type,
                "pager.pages":machinePage,
                "pager.pagesize":pageSize,
            },
            success: function (data) {
                var list=eval(data.obj.data);
                pageEntranceMachine(list,type);
                $('#machine_tips_'+type+'').empty();
                $('#machine_tips_'+type+'').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            },
            error: function (data, status) {
                msgTips("分页门口机查询异常!");
            }
        });
    });
}

/**
 *设置页面
 */
function machineInstallListJump(machineJson,mac,type){
    $("#machine_install_"+type+" input[name='enginpassword']").val(machineJson.enginpassword);
    $("#machine_install_"+type+" input[name='doorpassword']").val(machineJson.doorpassword);
    $("#machine_install_"+type+" input[name='serverIp']").val(machineJson.serverip);
    $("#machine_install_"+type+" input[name='centerIp']").val(machineJson.ip);
    $("#machine_install_"+type+" input[name='callSoundvelume']").val(machineJson.callSoundvelume);
    $("#machine_install_"+type+" input[name='mediumSoundvelume']").val(machineJson.mediumSoundvelume);
    $("#machine_install_"+type+" input[name='brightness']").val(machineJson.brightness);
    sessionStorage.setItem("installMac",mac,type);
    jStr='';
    for(var item in machineJson){
        jStr += item+"="+machineJson[item]+"$";
    }
    jStr.split('$').forEach(function(param){
        param=param.split('=');
        var name=param[0], val=param[1];
        if(val==null){
            val='';
        }
        $('#id'+name+'').val(val);
    });
    machineUpdateShow(type);
}

/**
 * 设置门口机、围墙机和中心机
 */
function machineInstall(type){
    var data = $("#machine_install_"+type).serialize();
    var array=new Array();
    data = decodeURIComponent(data,true);
    var dataArray=data.split("&");
    $.each(dataArray,function(index,item){
        var name=item.split("=")[0];
        var value=item.split("=")[1];
        var newData = '{"name":"'+name+'","value":"'+value+'"}';
        array.push(JSON.parse(newData));
    });
    var temp = JSON.stringify(array);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/updateDoorConfigAction!updateDoorConfig.action",
        data:{
            "token":permit,
            "data":temp,
            "mac":sessionStorage.getItem("installMac")
        },
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryEnTranceMachineJump(1,null,type);
        },
    });
    sessionStorage.removeItem("installMac");
}

/**
 * 重置门口机、围墙机和中心机
 */
function machineInstallCancel(type){
    $("#machine_install_"+type)[0].reset();
}

/**
 * 替换门口机
 */
function machineReplaceJump(machineJson,mac,type){
    $("#machine_replace_"+type+" input[name='mac']").val(machineJson.mac);
    sessionStorage.setItem("installMac",mac,type);
    machineReplaceShow(type);
    machineQueryReplace(type);
}

/**
 * 查询替换门口机、围墙机和中心机
 */
function machineQueryReplace(type){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/doorCtrollerAction!getUnregisteredManageController.action",
        data:{
            "token":permit
        },
        dataType:"json",
        success:function(data){

        },
    });
}

/**
 * 替换门口机、围墙机和中心机
 */
function machineReplaceData(type){
    var data =  $("#machine_replace_"+type).serialize();
    data = decodeURIComponent(data,true);
    var newmac = $("#mac_new_"+type).val();
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/controllerAction!replaceHomeController.action",
        data:data+"&token="+permit+"&newmac="+newmac+"&oldmac="+sessionStorage.getItem("installMac"),
        dataType:"json",
        success:function(data){
            msgTips(data.obj);
            queryEnTranceMachineJump(1,null,type);
            sessionStorage.removeItem("installMac");
        },
    });
}

/**
 * 重置门口机、围墙机和中心机
 */
function machineReplaceCancel(type){
    $("#machine_replace_"+type+"")[0].reset();
}

/**
 * 更新门口机、围墙机和中心机
 */
function machineUpdateJump(id,typeD){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/doorCtrollerAction!updateDoorControllerIpForm.action",
        dataType:"json",
        data:{
            "token":permit,
            "doorcontrollerId":id,
            "type":typeD
        },
        success:function(data){
            msgTips(data.msg);
        },
    });
}

/**
 * 推送详情
 */
var maccode;
function machinePushDetailsJump(mac,type){
    maccode=mac;
    machinePushAdvertShow(type);
    $.ajax({
        type: "post",
        url:zoneServerIp+"/ucotSmart/adAction!findDoorToAd.action",
        dataType: "json",
        data: {
            "token": permit,
            "mac": mac
        },
        success: function (data) {
            var list = eval(data.obj);
            pagePushMachine(list,type);
        }
    });
}

function machineUndercarriageJump(id,mac,type){
    var machineUndercarriage = 'machine_undercarriage_'+type;
    console.log(machineUndercarriage);
    $("#"+machineUndercarriage).modal("show");
    sessionStorage.setItem("id",id);
    sessionStorage.setItem("mac",mac);
}
// 广告推送下架
function machineUndercarriage(type){
    $.ajax({
        type: "post",
        url:zoneServerIp+"/ucotSmart/adAction!updatingAdToDoor.action",
        dataType: "json",
        data: {
            "token": permit,
            "operationType": 2,
            "idList":sessionStorage.getItem("id"),
            "macList":sessionStorage.getItem("mac"),
            "playtime":'',
            "starttime":'',
            "endtime":''
        },
        success: function (data) {
            msgTips(data.msg);
            pagePushMachine(data.obj,type);
            machinePushDetailsJump(maccode,type)
        }
    });
}

/**
 * 选择所有数据
 */
function selectAllMachineData(){
    var checkNum=$('input[name="id"]:checked').length;
    var checkAllNum=$('input[name="id"]').length;
    if(checkNum<checkAllNum){
        $('input[name="id"]').each(function(){
            $(this).prop("checked",true);
        });
    }else{
        $('input[name="id"]:checked').each(function(){
            $(this).prop("checked",false);
        });
    }
}

/**
 * 加载select内容
 */
function querySelectDoorMachine(type){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        dataType:"json",
        data:{
            "token":permit,
            "zonecode":getMachineToken(permit)
        },
        success:function(data){
            var arr = eval(data.obj);
            var doorMachineCodeChild = $('#machine_code_child_'+type+'');
            doorMachineCodeChild.empty();
            $('#machine_code_unit_child_'+type+'').css("display","none");
            doorMachineCodeChild.append('<option value="0">全部</option>');
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr = strToCharacter(codeStr.substring(codeStr.indexOf("d")+1));
                doorMachineCodeChild.append('<option value='+codeStr+'>'+newCodeStr+'</option>');
            });
        },
    });
}

/*
 * 查询单元编号
 */
function doorMachineCodeChildSelect(buildingcode){
    machineCodeChildSelect(buildingcode,'D');
    machineCodeChildSelect(buildingcode,'W');
    machineCodeChildSelect(buildingcode,'C');
}

/**
 * 条件查询下拉选择选项
 */
function machineCodeChildSelect(buildingCode,type){
    if(buildingCode=='0'){
        $("#machine_code_unit_child_"+type).hide();
        //$(dom1).css('display','none');
        return;
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryUnit.action",
        dataType:"json",
        data:{
            "token":permit,
            "buildingcode":buildingCode
        },
        success:function(data){
            var doorMachineCodeUnitChilid = $("#machine_code_unit_child_"+type);
            doorMachineCodeUnitChilid.empty();
            doorMachineCodeUnitChilid.css("display","");
            var arr = eval(data.obj);
            doorMachineCodeUnitChilid.append('<option value=0>全部</option>');
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr = strToCharacter(codeStr.substring(codeStr.indexOf("b")+1,codeStr.indexOf("u")+1));
                doorMachineCodeUnitChilid.append('<option value='+codeStr+'>'+newCodeStr+'</option>');
            });
        },
    });
}

/**
 * 获取第一个下拉选择选项
 */
function insertBuildingDoorMachine(type){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        dataType:"json",
        data:{
            "token":permit,
            "zonecode":getMachineToken(permit)
        },
        success:function(data){
            var arr = eval(data.obj);
            var elementNumberFirstInsert= $("#element_number_first_insert_"+type+"");
            elementNumberFirstInsert.empty();
            $("#element_number_second_insert_"+type+"").css("display","none");
            elementNumberFirstInsert.append('<option value="0">全部</option>');
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr = strToCharacter(codeStr.substring(codeStr.indexOf("d")+1));
                elementNumberFirstInsert.append('<option value='+codeStr+'>'+newCodeStr+'</option>');
            });
        },
    });
}

/*
 * 查询单元编号
 */
function doorMachineElementNumberInsert(insertgcode){
    doorElementNumberPublicInsert(insertgcode,"D");
    doorElementNumberPublicInsert(insertgcode,"W");
    doorElementNumberPublicInsert(insertgcode,"C");
}

/**
 * 插入下拉列表选项
 */
function doorElementNumberPublicInsert(insertgCode,type){
    if(insertgCode=="0"){
        $("#element_number_second_insert_"+type).hide();
        return;
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryUnit.action",
        dataType:"json",
        data:{
            "token":permit,
            "buildingcode":insertgCode
        },
        success:function(data){
            var doorElementNumberSecondInsert= $("#element_number_second_insert_"+type);
            doorElementNumberSecondInsert.empty();
            doorElementNumberSecondInsert.css("display","");
            var arr = eval(data.obj);
            doorElementNumberSecondInsert.append('<option value="0">全部</option>');
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var newCodeStr = codeStr.substring(codeStr.indexOf("b")+1,codeStr.indexOf("u")+1).replace("u","单元");
                doorElementNumberSecondInsert.append('<option value='+codeStr+'>'+newCodeStr+'</option>');
            });
        },
    });
}

function doorMachineAdd(){
    insertBuildingDoorMachine("D");
}

/*
 * 添加门口机(D)、围墙机(W)、中心机(C)
 */
function addDoorMachine(publicType){
    var unitcode = $("#element_number_first_insert_"+publicType).val();
    var childCode = $("#element_number_second_insert_"+publicType).val();
    if(unitcode=="0"||unitcode==""){
        msgTips("所在单元编号中的期区栋不能为空,请重新输入!");
        return;
    }else{
        if(childCode!="0"&&childCode!=""){
            unitcode = childCode;
        }
    }
    var mac = $("#mac_"+publicType).val();
    var ip=$("#ip_"+publicType).val();
    var name=$("#name_"+publicType).val();
    var gatewayip=$("#gatewayip_"+publicType).val();
    var serverip=$("#serverip_"+publicType).val();
    var maskcode=$("#maskcode_"+publicType).val();
    var maindns=$("#maindns_"+publicType).val();
    var subdns=$("#subdns_"+publicType).val();
    var enginpassword=$("#enginpassword_"+publicType).val();
    var doorpassword=$("#doorpassword_"+publicType).val();
    var mediumSoundvelume=$("#mediumSoundvelume_"+publicType).val().split("%")[0];
    var callSoundvelume=$("#callSoundvelume_"+publicType).val().split("%")[0];
    var brightness=$("#brightness_"+publicType).val().split("%")[0];
    var type=$("#type_"+publicType).val();
    if(mac==""||mac==''||mac==null||mac=="undefined"){
        msgTips("机器码不能为空,请重新输入!");
        return;
    }else if(ip==""||ip==''||ip==null||ip=="undefined"){
        msgTips("静态IP不能为空,请重新输入!");
        return;
    }else if(name==""||name==''||name==null||name=="undefined"){
        msgTips("安装位置不能为空,请重新输入!");
        return;
    }else if(gatewayip==''||gatewayip==""||gatewayip==null||gatewayip=="undefined"){
        msgTips("网关IP不能为空,请重新输入!");
        return;
    }else if(serverip==''||serverip==""||serverip==null||serverip=="undefined"){
        msgTips("服务器IP不能为空,请重新输入!");
        return;
    }else if(maskcode==''||maskcode==""||maskcode==null||maskcode=="undefined"){
        msgTips("子网掩码不能为空,请重新输入!");
        return;
    }else if(maindns==''||maindns==""||maindns==null||maindns=="undefined"){
        msgTips("DNS服务器不能为空,请重新输入!");
        return;
    }else if(subdns==''||subdns==""||subdns==null||subdns=="undefined"){
        msgTips("备用DNS不能为空,请重新输入!");
        return;
    }else if(enginpassword==''||enginpassword==""||enginpassword==null||enginpassword=="undefined"){
        msgTips("工程密码不能为空,请重新输入!");
        return;
    }else if(doorpassword==''||doorpassword==""||doorpassword==null||doorpassword=="undefined"){
        msgTips("开锁密码不能为空,请重新输入!");
        return;
    }else{
        var data = $("#machineFormId_"+publicType+"").serialize();//序列化乱码
        data = decodeURIComponent(data,true);
        data = data+"&ctr.mac="+mac+"&ctr.ip="+ip+"&ctr.name="+name
            +"&ctr.gatewayip="+gatewayip+"&ctr.serverip="+serverip
            +"&ctr.maskcode="+maskcode+"&ctr.maindns="+maindns
            +"&ctr.subdns="+subdns+"&ctr.enginpassword="+enginpassword
            +"&ctr.doorpassword="+doorpassword+"&ctr.mediumSoundvelume="+mediumSoundvelume
            +"&ctr.callSoundvelume="+callSoundvelume+"&ctr.brightness="+brightness
            +"&ctr.type="+type+"&ctr.code="+unitcode;
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/controllerAction!addDoorControllerRenew.action",
            data:data+"&token="+permit,
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryEnTranceMachineJump(1,null,publicType);
            },
        });
    }
}

/**
 * 重置增加门口机(D)、围墙机(W)、中心机(C)
 */
function resetDoorMachine(type){
    $("#machineFormId_"+type+"")[0].reset();
    insertBuildingDoorMachine("D");
}

//判断静态IP和网关IP和服务器IP是否合法
function checkIP(ip){
    var reg=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

//判断子网掩码和DNS服务器是否合法
function checkMask(mask){
    var reg=/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    return reg.test(mask);
}

/**'
 * 同步数据
 */
function synchronousData(){
    var checkNum=$('input[name="id"]:checked').length;
    if(checkNum==0){
        alert("请选择同步数据的门口机或者围墙机");
    }else{
        //获取已勾选的门口机
        var doorcontrollerMacList = "";
        $('input[name="id"]:checked').each(function(){
            doorcontrollerMacList += $(this).val()+",";
        });
        doorcontrollerMacList = doorcontrollerMacList.substring(0,doorcontrollerMacList.lastIndexOf(","));
        synchronousDataList(doorcontrollerMacList);
    }
}

/**
 * 批量同步数据
 */
function synchronousDataList(doorcontrollerMacList){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/doorCtrollerAction!synchroDoorcard.action",
        dataType:"json",
        data:{
            "token":permit,
            "doorcontrollerMacList":doorcontrollerMacList
        },
        success:function(data){
            alert(data.msg);
        },
    });
}

/*
 *导入门口机(D)、围墙机(W)、中心机(C)
 */
function importDoorMachineRecord(type){
    var formData = new FormData($('#upload_machine_form_'+type+'')[0]);
    var machineType = $("#file_"+type+'').val();
    console.log(machineType);
    $.ajax({
        type:"post",
        data:formData,
        url:zoneServerIp+"/ucotSmart/excelDoorControllerAction!pullDoorControllerExcel.action?token="+permit+"&upFile="+machineType,
        async:false,
        cache:false,
        processData:false,
        contentType:false,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryEnTranceMachineJump(1,null,type);
        }
    });
}

/**
 * 重置导入门口机(D)、围墙机(W)、中心机(C)
 */
function resetDoorMachineRecord(type){
    $("#upload_machine_"+type+"")[0].reset();
}

/**
 * 导出excel文件
 */
function exportPublicData(type){
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+"/ucotSmart/excelDoorControllerAction!getDoorControllerExcel.action?token="+permit+"&type="+type);
    var input = $('<input>');
    input.attr('type', 'hidden');
    $('body').append(form);
    form.append(input);
    form.submit();
    form.remove();
}

//解析到单元-并加上后面的数据
function tranUnitCodeBehind(code){
    var index1=code.indexOf("d");
    var index2=code.indexOf("p");
    var index3=code.indexOf("z");
    var index4=code.indexOf("b");
    var index5=code.indexOf("u");
    var index6=code.indexOf("-");
    var code1=code.substring(0, index1);
    var code2=code.substring(index1+1, index2);
    var code3=code.substring(index2+1, index3);
    var code4=code.substring(index3+1, index4);
    var code5=code.substring(index4+1, index5);
    var code6=code.substring(index5+6,index6);
    var o=code2+"期"+code3+"区"+code4+"栋"+code5+"单元"+code6;
    return o;
}

//解析到街区-并加上围墙机
function tranBlockFenceMachine(code){
    var index = code.substring(8,13);
    return index;
}

//对列表数据进行转化
function tranType(type){
    if(type=="D"){
        var machine="门口机";
    }else if(type=="C"){
        var machine = "中心机";
    }else if(type=="W"){
        var machine="围墙机";
    }else{
        var machine="全部";
    }
    return machine;
}

//对状态进行转化
function tranStatus(type){
    if(type=="0"){
        var status="离线";
    }else if(type=="1"){
        var status="在线";
    }else if(type=="3"){
        var status="故障";
    }else if(type=="9"){
        var status="未注册";
    }
    return status;
}

//对音量进行拼接
function tranVoiceMachine(code){
    if(code==""||code=="undefined"){
        return code;
    }else{
        return code+="%";
    }
}

//解析成街区到单元
function strToCharacter(str){
    return str.replace("d","街区").replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元");
}

//去掉街区到单元
function strSelectCode(str){
    return str.substring(7,str.length).replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元");
}

//判断是否为空
function checkNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}

//格式化时间格式为yyyy-MM-dd
function checkMachineStr(time){
    if(time!=null&&time!="undefined"){
        return time.substring(0,19);
    }
    return "";
}

function getMachineToken(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.endsWith("N"))
        return code.substring(0,code.indexOf("d"));
}

function machinePushFileType(type){
    if(type=="1"){
        var machineType="图片";
    }else if(type=="2"){
        var machineType="视频";
    }else if(type=="3"){
        var machineType="音频";
    }
    return machineType;
}
//将一台门口机中的门禁卡发放到另一台门口机
function replaceDoorMachine(id){
    $("#menuDoorMachineBut").attr("ids",id);
    $("#selectDoorMachine").modal("show");
}
$("#menuDoorMachineBut").click(function(){
    var Aid=$(this).attr("ids");
    var Bid=$("#menuDoorMachine .menuDoorMachine").attr("optionid");
    var Type=$("#menuDoorMachineType .menuDoorMachineType").attr("optionid");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!copyDoorcard.action",
        dataType: "json",
        data: {
            "token":permit,
            "sourceCotrollerId":Aid,
            "targetCotrollerId":Bid,
            "addType":Type
        },
        success: function (data) {
            console.log("将一台门口机中的门禁卡发放到另一台门口机");
            console.log(data);
            //    数据
            if(data.success==true){
                $("#selectDoorMachine").modal("hide");
            }
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//重新发某个门口机或者围墙机的卡
function anewReplace(id){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/doorCardAction!reSentControllerCard.action",
        dataType: "json",
        data: {
            "token":permit,
            "targetCotrollerId":id
        },
        success: function (data) {
            console.log("重新发某个门口机或者围墙机的卡");
            console.log(data);
            //    数据
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
}
//新某一台机器的户户通电话本
function updatePhoneBookDoor(mac){
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
//获取电话本、门禁卡信息
function doorPhonebook(mac){
    $("#doorPhonebookType .doorPhonebookType").removeAttr("optionid modename").find("a.dropdown-toggle span").text("");
    $("#doorPhonebookBut").attr("mac",mac);
    $("#doorPhonebookBox thead,#doorPhonebookBox tbody").empty();
    $("#doorPhonebookModal .modal-footer,#doorPhonebookmenu").show();
    $("#doorPhonebookModal").modal("show");
    $("#doorPhonebookBox .pagingImplement").hide();
};
$("#doorPhonebookBut").click(function(){
    $(this).attr("disabled","disabled");
    setTimeout(function(){
        $("#doorPhonebookBut").removeAttr("disabled");
    },2100);
    var mac=$(this).attr("mac");
    var typeinfo=$("#doorPhonebookType .doorPhonebookType").attr("optionid");
    if(!typeinfo){
        msgTips("选择需要查看的信息类型");
    }else {
        $("#doorPhonebookBut").attr("typeinfo",typeinfo);
        $.ajax({
            type: "post",
            url: zoneServerIp + "/ucotSmart/controllerAction!getControllerRealInfo.action",
            dataType: "json",
            data: {
                "token": permit,
                "mac": mac
            },
            success: function (data) {
                console.log("获取电话本、门禁卡信息");
                console.log(data);
                //    数据
                if (data.obj) {
                    localStorage.doorPhonebook=JSON.stringify(data.obj);
                    paddingManual(1)
                } else {
                    msgTips(data.msg);
                };
                //paddingManual(1)
                //localStorage.doorPhonebook=JSON.stringify(homePhonebookobj)
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    };
});
function paddingManual(page,type){
    var typeinfo=$("#doorPhonebookBut").attr("typeinfo");
    console.log(JSON.parse(localStorage.doorPhonebook));
    if (typeinfo == "doorcard") {
        //门禁卡信息
        var obj = JSON.parse(localStorage.doorPhonebook).doorcard;
        var nub=paddingBox(obj,page,type);
        var theadhtml='<tr><th>ID</th><th>Number</th></tr>';
        var tbodyhtml = '';
        for (var i = nub.initial_nub; i < nub.lth_nub; i++) {
            tbodyhtml += '<tr><td width="50%">' + obj[i]._id + '</td><td width="50%">' + obj[i].number + '</td></tr>';
        }
    } else if (typeinfo == "h_call_info") {
        //电话本信息
        var obj = JSON.parse(localStorage.doorPhonebook).h_call_info;
        var nub=paddingBox(obj,page,type);
        var theadhtml='<tr><th>ID</th><th>Key</th><th>Telephone</th><th>IP</th><th>Code</th></tr>';
        var tbodyhtml = '';
        for (var i = nub.initial_nub; i < nub.lth_nub; i++) {
            tbodyhtml += '<tr><td>' + obj[i]._id + '</td><td>' + obj[i].key + '</td><td>' + obj[i].telephone + '</td><td>' + obj[i].ip + '</td><td>' + obj[i].code + '</td></tr>';
        }
    }
    $("#doorPhonebookBox thead").html(theadhtml);
    $("#doorPhonebookBox tbody").html(tbodyhtml);
    $("#doorPhonebookBox .pagingImplement,#doorContrast").show();
    $("#doorPhonebookmenu,#doorPhonebookModal .modal-footer").hide();
};
function paddingBox(obj,page,type){
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
    $("#doorPhonebookBox .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
    if(!type||type!="paging"){
        pagingPlugin(pageList,totalNum,"doorPhonebookBox",{"functions":"paddingManual(homelistPage,'paging')"});
    };
    var nub;
    return nub={"initial_nub":initial_nub,"lth_nub":lth_nub};
};
function doorContrast(){
    var typeinfo=$("#doorPhonebookBut").attr("typeinfo");
    //对比
    var lth,html="";
    if(typeinfo=="h_call_info") {
        $("#doorPhonebookBox table").css("min-width","880px");
        //电话本
        var doorLeft = JSON.parse(localStorage.doorPhonebook).compare.onlyMachineHavephone;
        var doorRight = JSON.parse(localStorage.doorPhonebook).compare.onlyServerHavephone;
        doorLeft > doorLeft ? lth = doorLeft.length : lth = doorLeft.length;
        for(var i = 0; i < lth;i++){
            if(!doorLeft[i]&&doorRight[i]){
                html+='<tr><td></td><td></td><td></td><td></td><td>'+doorRight[i].code+'</td><td>'+doorRight[i].doorcontrollercode+'</td><td>'+doorRight[i].ip+'</td></tr>';
            }else if(!doorRight[i]&&doorLeft[i]){
                html+='<tr><td>'+doorLeft[i].code+'</td><td>'+doorLeft[i].id+'</td><td>'+doorLeft[i].ip+'</td><td></td><td></td><td></td><td></td></tr>';
            }else if(!doorLeft[i]&&!doorRight[i]){
                html+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
            }else{
                html+='<tr><td>'+doorLeft[i].code+'</td><td>'+doorLeft[i].id+'</td><td>'+doorLeft[i].ip+'</td><td width="100px"></td><td>'+doorRight[i].code+'</td><td>'+doorRight[i].doorcontrollercode+'</td><td>'+doorRight[i].ip+'</td></tr>';
            }
        }
        $("#doorPhonebookBox thead").html('<tr><th>Code</th><th>ID</th><th>IP</th><th width="100px">机器/服务器</th><th>Code</th><th>Doorcontrollercode</th><th>IP</th></tr>');
    }else if(typeinfo=="doorcard"){
        //门禁卡
        var doorLeft = JSON.parse(localStorage.doorPhonebook).compare.onlyMachineHaveHcard;
        var doorRight = JSON.parse(localStorage.doorPhonebook).compare.onlyServerHaveHcard;
        doorLeft > doorLeft ? lth = doorLeft.length : lth = doorLeft.length;
        for(var i = 0; i < lth;i++){
            if(!doorLeft[i]&&doorRight[i]){
                html+='<tr><td></td><td></td><td></td><td>'+doorRight[i].id+'</td><td>'+doorRight[i].cardid+'</td></tr>';
            }else if(!doorRight[i]&&doorLeft[i]){
                html+='<tr><td>'+doorLeft[i].id+'</td><td>'+doorLeft[i].number+'</td><td></td><td></td><td></td></tr>';
            }else if(!doorLeft[i]&&!doorRight[i]){
                html+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
            }else{
                html+='<tr><td>'+doorLeft[i].id+'</td><td>'+doorLeft[i].number+'</td><td width="100px"></td><td>'+doorRight[i].id+'</td><td>'+doorRight[i].cardid+'</td></tr>';
            }
        }
        $("#doorPhonebookBox thead").html('<tr><th>ID</th><th>Number</th><th width="100px">机器/服务器</th><th>ID</th><th>Cardid</th></tr>');
    }
    $("#doorPhonebookBox tbody").html(html);
    $("#doorPhonebookBox .pagingImplement,#doorContrast").hide();
};
$('#doorPhonebookModal').on('hidden.bs.modal', function (e) {
    $("#doorContrast").hide();
    $("#doorPhonebookBox table").removeAttr("style");
});
function refreshTypeC(){
    //中心机刷新
    $.ajax({
        type: "post",
        url: zoneServerIp + "/ucotSmart/controllerAction!changeCtrStatus.action",
        dataType: "json",
        data: {
            "token": permit,
        },
        success: function (data) {
            console.log("中心机刷新");
            console.log(data);
            //    数据
                msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
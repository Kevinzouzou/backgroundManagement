/**
 * Created by asus on 2017/11/09.
 */
var pageSize = 10;

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
    if(dropdownId=="ownerChargingAds"){
        ownerUnit(optionId);
    }else if(dropdownId=="ownerUnitAds"){
        ownerDoorplate(optionId);
    }else if(dropdownId=="ownerSelectChargingAds"){
        ownerSelectUnitCode(optionId);
    }else if(dropdownId=="ownerSelectUnitAds"){
        ownerSelectDoorplateCode(optionId);
    }else if(dropdownId=="ownerDoorplateAds"){
        ownerCode(optionId);
    }else if(dropdownId=="ownerUpdateChargingAds"){
        ownerUpdateUnit(optionId);
    }else if(dropdownId=="ownerUpdateUnitAds"){
        ownerUpdateDoorplate(optionId);
    }else if(dropdownId=="ownerUpdateDoorplateAds"){
        ownerUpdateCode(optionId);
    }else if(dropdownId=="tenantChargingAds"){
        tenantUnit(optionId);
    }else if(dropdownId=="tenantUnitAds"){
        tenantDoorplate(optionId);
    }else if(dropdownId=="tenantUpdateChargingAds"){
        tenantUpdateUnit(optionId);
    }else if(dropdownId=="tenantUpdateUnitAds"){
        tenantUpdateDoorplate(optionId);
    }else if(dropdownId=="tenantSelectChargingAds"){
        tenantSelectUnitCode(optionId);
    }else if(dropdownId=="tenantSelectUnitAds"){
        tenantSelectDoorplateCode(optionId);
    };
    if(prefixId=="ownerInfoSelect"){
        ownerInfoSearch(optionId);
    }else if(prefixId=="tenantInfoSelect"){
        tenantInfoSearch(optionId);
    }
});

function houseHoldManagementInitialize(type){
    if(type=="owner"){
        queryHouseHoldLoadPageDataJump(1,"",type);
    }else if(type=="tenant"){
        queryTenantInfoLoadPageDataJump(1,"",type);
    }
}

/**
 * 加载住户管理数据分页
 * @param page 当前页
 */
function queryHouseHoldLoadPageDataJump(page,code){
    ownerSelectBuildingCode();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/ownerInfoAction!findOwnerInfo.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":page,
            "pager.pagesize":pageSize,
            "ownerInfoVo.code":code
        },
        success: function (data) {
            $("#house_hold_body_house_hold").empty();
            if(data.obj==null){
                $("#house_hold_body_house_hold").append('<h2>没有查询到数据</h2>');
            }else{
                var list = eval(data.obj.data);
                pageHouseHoldServiceLoadInformationList(list);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum/pageSize);//总页数
                $('#house_hold_paging_house_hold').empty();
                $('#house_hold_tips_house_hold').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                if(pageNum==1||pageNum==0){

                }else{
                    queryHouseHoldListByPage(list.length, totalNum,pageNum,code);
                }
            }
        }
    });
}

/**
 * 条件查询
 */
function ownerInfoSearch(code){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/ownerInfoAction!findOwnerInfo.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":1,
            "pager.pagesize":10,
            "ownerInfoVo.code":code
        },
        success: function (data) {
            $("#house_hold_body_house_hold").empty();
            if(data.obj==null){
                $("#house_hold_body_house_hold").append('<h2>没有查询到数据</h2>');
            }else{
                var list = eval(data.obj.data);
                pageHouseHoldServiceLoadInformationList(list);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum/pageSize);//总页数
                $('#house_hold_paging_house_hold').empty();
                $('#house_hold_tips_house_hold').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                if(pageNum==1||pageNum==0){

                }else{
                    queryHouseHoldListByPage(list.length, totalNum,pageNum,code);
                }
            }
        }
    });
}

/*
 *给住户管理分页插件绑定ajax请求，根据页码任务数据
 */
function queryHouseHoldListByPage(pageNum,totalNum,totalPages,code){
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    $('#house_hold_paging_house_hold').empty();
    $('#house_hold_paging_house_hold').append('<ul id="pagination_ll_house_hold" class="pagination-sm"></ul>');
    var houseHoldPage;
    $('#pagination_ll_house_hold').twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            houseHoldPage=page;
        }
    });
    $('#pagination_ll_house_hold').on('click', 'a', function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/ownerInfoAction!findOwnerInfo.action",
            dataType:"json",
            data:{
                "token":permit,
                "pager.pages":houseHoldPage,
                "pager.pagesize":pageSize,
                "ownerInfoVo.code":code
            },
            success: function (data) {
                var list=eval(data.obj.data);
                pageHouseHoldServiceLoadInformationList(list);
                $('#house_hold_tips_house_hold').empty();
                $('#house_hold_tips_house_hold').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            }
        });
    });
}

function ownerSelectBuildingCode(){
    var zoneCode = houseHoldManagementCode(permit);
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
            $("#ownerInfoSelect .ownerSelectChargingAds .option_type").attr("optionId","");
            var building = $("#ownerInfoSelect .ownerSelectChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="" modename="全部">全部</a></li>');
            building.css("display","");
            $("#ownerInfoSelect .ownerSelectUnitAds").css("display","none");
            $("#ownerInfoSelect .ownerSelectDoorplateAds").css("display","none");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
        }
    });
}

function ownerSelectUnitCode(buildingCode){
    $("#ownerInfoSelect .ownerSelectUnitAds").css("display","");
    if(buildingCode==""){
        $("#ownerInfoSelect .ownerSelectUnitAds").hide();
        $("#ownerInfoSelect .ownerSelectDoorplateAds").hide();
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
            var arr = eval(data.obj);
            $("#ownerInfoSelect .ownerSelectUnitAds .option_type").attr("optionId","");
            var building = $("#ownerInfoSelect .ownerSelectUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="" modename="全部">全部</a></li>');
            building.css("display","");
            $("#ownerInfoSelect .ownerSelectDoorplateAds").css("display","none");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
        }
    });
}

function ownerSelectDoorplateCode(unitCode){
    $("#ownerInfoSelect .ownerSelectDoorplateAds").css("display","");
    if(unitCode==""){
        $("#ownerInfoSelect .ownerSelectDoorplateAds").hide();
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":unitCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#ownerInfoSelect .ownerSelectDoorplateAds .option_type").attr("optionId","");
            var building = $("#ownerInfoSelect .ownerSelectDoorplateAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="" modename="全部">全部</a></li>');
            building.css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("u")+1;
                var lastAds=codeStr.indexOf("h")+1;
                var addressCode = codeStr.substring(firstAds, lastAds);
                var newCodeStr= addressCode.replace("f", "层").replace("h", "室");
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'">'+newCodeStr+'</a></li>');
            });
        }
    });
}

function queryChargeItemNewVoLoadPageDataJump(page,chargeId,ulStr){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":page,
            "pager.pagesize":pageSize,
            "chargemode.id":chargeId
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pageChargeItemNewVoServiceLoadInformationList(list,ulStr);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#charge_item_paging_house_hold').empty();
            $('#charge_item_tips_house_hold').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryChargeItemNewVoListByPage(list.length, totalNum,pageNum,chargeId);
            }
        }
    });
}

/*
 *给收费项分页插件绑定ajax请求，根据页码任务数据
 */
function queryChargeItemNewVoListByPage(pageNum,totalNum,totalPages,chargeId){
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    $('#charge_item_paging_house_hold').empty();
    $('#charge_item_paging_house_hold').append('<ul id="pagination_ll_charge_item_new" class="pagination-sm"></ul>');
    var chargeIteNewVoPage;
    $('#pagination_ll_charge_item_new').twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            chargeIteNewVoPage=page;
        }
    });
    $('#pagination_ll_charge_item_new').on('click', 'a', function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
            dataType:"json",
            data:{
                "token":permit,
                "pager.pages":chargeIteNewVoPage,
                "pager.pagesize":pageSize,
                "chargemode.id":chargeId
            },
            success: function (data) {
                var list=eval(data.obj.data);
                pageChargeItemNewVoServiceLoadInformationList(list);
                $('#charge_item_tips_house_hold').empty();
                $('#charge_item_tips_house_hold').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            }
        });
    });
}

function ownerInsert(){
    ownerBuilding();
}

//获取住户管理中房屋地址
function ownerBuilding(){
    var zoneCode = houseHoldManagementCode(permit);
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
            $("#owner_toDoModalAddress .ownerChargingAds .option_type").attr("optionId","");
            var building = $("#owner_toDoModalAddress .ownerChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#owner_toDoModalAddress .ownerUnitAds .dropdown-menu").css("display","");
            $("#owner_toDoModalAddress .ownerUnitAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
            $("#owner_toDoModalAddress .ownerChargingAds .dropdown-menu li:first-child").remove();
        }
    });
}

function ownerUnit(buildingCode){
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
            $("#owner_toDoModalAddress .ownerUnitAds .option_type").attr("optionId","");
            var building = $("#owner_toDoModalAddress .ownerUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#owner_toDoModalAddress .ownerDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
            $("#owner_toDoModalAddress .ownerUnitAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function ownerDoorplate(buildingCode){
    sessionStorage.setItem("buildingCode",buildingCode);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":buildingCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#owner_toDoModalAddress .ownerDoorplateAds .option_type").attr("optionId","");
            var building = $("#owner_toDoModalAddress .ownerDoorplateAds .dropdown-menu");
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
            $("#owner_toDoModalAddress .ownerDoorplateAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function ownerCode(code){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!findHomeInfo.action",
        dataType:"json",
        data:{
            "token":permit,
            "home.code":code
        },
        success:function(data) {
            if(data.obj){
                var checkInStatusText = "";
                if(data.obj.checkinstatus=="1"){
                    checkInStatusText = "已入住";
                }else if(data.obj.checkinstatus=="2"){
                    checkInStatusText = "未入住";
                }
                var coveredArea = data.obj.coveredarea;
                var useArea = data.obj.usearea;
                var publicArea = data.obj.publicarea;
                var propertyNum = data.obj.certificateid;
                $("#coveredArea").val(houseHoldCheckNull(coveredArea));
                $("#useArea").val(houseHoldCheckNull(useArea));
                $("#status").val(houseHoldCheckNull(checkInStatusText));
                $("#publicArea").val(houseHoldCheckNull(publicArea));
                $("#propertyNum").val(houseHoldCheckNull(propertyNum));
            }
        }
    });
}

$('body').on('click','.ownerAddFamMem',function(){
    var li="";
    li+="<li class='name menuBox totalLength' id='familyGender'>"
    li+="<span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>"
    li+="<input type='text' class='name familyName' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
    li+="<span>身&nbsp;&nbsp;份&nbsp;&nbsp;证</span>"
    li+="<input type='text' class='name familyIdentify' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
    li+="<span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>"
    li+="<div class='familyGender dropdown areaZone' ids='familyGender' optionid='1' modename='男' style='width: 9.31rem;margin-bottom: 0.65rem;'>"
    li+="<a class='dropdown-toggle areaZoneList text-center' data-toggle='dropdown' style='width: 9.31rem;margin-bottom: 0.65rem;'><span class='option_type'>男</span><b class='caret'></b></a>"
    li+="<ul class='dropdown-menu areaZoneList-menu' role='menu' style='width: 9.31rem;margin-bottom: 0.65rem;'>"
    li+="<li><a codelist='1' modename='男'>男</a></li>"
    li+="<li><a codelist='2' modename='女'>女</a></li>"
    li+="</ul></div>"
    li+="<span>关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系</span>"
    li+="<input type='text' class='name familyRelation' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
    li+="<span>手&nbsp;&nbsp;机&nbsp;&nbsp;号</span>"
    li+="<input type='text' class='name familyPhoneNum' style='width: 9.31rem;margin-bottom: 0.65rem;'/><span class='delete' style='text-align: left;padding-left: 10px;color: #69c;'>删除</span>"
    li+="</li>";
    $("#addOwnerInfo .familyMembers").append(li);
    removeOwnerFamily(".delete");
});

function removeOwnerFamily(cla){
    $(cla).on('click',function(){
        $(this).parent().remove();
    })
}

$(".telephoneAdd").on('click',function(){
    var li = "";
    li+='<li class="totalLength addNumber"><input type="text" class="text-center" name="owner.cellphone" style="width: 9.31rem;margin-bottom: 0.856rem;"/><span class="delete" style="text-align: left;padding-left: 10px;color: #69c;">删除</span></li>';
    $("#owner_telephone_box_ul_add").append(li);
    removeClass(".delete");
});

$(".telephoneUpdate").on('click',function(){
    var li = "";
    li+='<li class="totalLength addNumber"><input type="text" class="text-center" name="owner.cellphone" style="width: 9.31rem;margin-bottom: 0.856rem;"/><span class="delete" style="text-align: left;padding-left: 10px;color: #69c;">删除</span></li>';
    $("#owner_telephone_box_ul").append(li);
    removeClass(".delete");
});

function removeClass(cla){
    $(cla).on('click',function(){
        $(this).parent().remove();
    })
}
/**
 * 增加任务
 */
function addHouseHold(){
    var data = $("#houseHoldAddFormId").serialize();
    data = decodeURIComponent(data,true);
    var building = $("#owner_toDoModalAddress .ownerChargingAds").attr("optionid");
    var unit = $("#owner_toDoModalAddress .ownerUnitAds").attr("optionid");
    var floorRoom = $("#owner_toDoModalAddress .ownerDoorplateAds").attr("optionid");
    var ownerGender = $("#unitType-gender .unitType-gender").attr("modename");
    //var checkInStatus = $("#unitType-status .unitType-status").attr("optionid");
    var checkInStatus = $("#status").val();
    var names = $(".familyName");
    console.log("names:"+names);
    var identify=$(".familyIdentify");
    var gender=$("#familyGender .familyGender");
    var relation=$(".familyRelation");
    var phoneNum=$(".familyPhoneNum");

    var familyjson;
    var jsonData = "";
    console.log(names);
    if(building==""||building=="0"){
        msgTips("请选择获取所在期区栋下拉框的值!");
        return;
    }else if(unit==""||unit=="0"){
        msgTips("请选择获取所在单元下拉框的值!");
        return;
    }else if(floorRoom==""||floorRoom=="0"){
        msgTips("请选择获取所在房屋地址下拉框的值!");
        return;
    }else{
        console.log(!names);
        console.log(names.length);
        if(names.length==0){
            console.log(1);
            var temp1="";
            jsonData="familyJson="+temp1+"&"+data+"&home.code="+floorRoom
                +"&owner.gender="+ownerGender;
        }else{
            var temp='{"family": [';
            for(var i=0;i<names.length;i++){
                temp=temp+'{"name":'+'"'+$(names[i]).val()+'",'+'"identity":'+'"'+$(identify[i]).val()+'",'+'"gender":'+'"'+$(gender[i]).attr("modename")+'",'+'"relation":'+'"'+$(relation[i]).val()+'",'+'"telephone":'+'"'+$(phoneNum[i]).val()+'"'+"},";
            }
            temp=temp.substring(0,temp.length-1)+']'+',"number":'+names.length+"}";
            jsonData="familyJson="+temp+"&"+data+"&home.code="+floorRoom
                +"&owner.gender="+ownerGender;
        }
        $.ajax({
            type:"post",
            data:jsonData,
            url:zoneServerIp+"/ucotSmart/ownerInfoAction!addOwnerInfo.action?token="+permit,
            dataType:"json",
            success:function(data){
                msgTips(data.obj.msg);
                queryHouseHoldLoadPageDataJump(1,"");
            }
        });
        $("#addOwnerInfo").modal('hide');
    }
}

$("#chargeItemCheckBox").click(function(){
    var checkNum=$('input[name="chargeItemCheckBox"]:checked').length;
    var checkAllNum=$('input[name="chargeItemCheckBox"]').length;
    if(checkNum<checkAllNum){
        $('input[name="chargeItemCheckBox"]').each(function(){
            $(this).prop("checked",true);
        });
    }else{
        $('input[name="chargeItemCheckBox"]:checked').each(function(){
            $(this).prop("checked",false);
        });
    }
});

/**
 * 对收费项目进行加载信息列表
 */
$("#houseOwnerNewProject").on('click',function(){
    var ulHtml = $("#ownerAddPro li");
    var ulStr = new Array();
    if(ulHtml.length>0){
        for(var i=0;i<ulHtml.length;i++){
            ulStr.push(ulHtml[i].id);
        }
    }
    queryChargeItemNewVoLoadPageDataJump(1,"",ulStr);
});

//确认添加收费项目
$("#chargeItemPushBut").click(function(){
    $("#ownerAddPro").empty();
    var inputs=$("#charge_item_new_vo_body input");
    var html="";
    inputs.each(function(){
        if($(this).is(":checked")){
            var id=$(this).attr("id");
            var name=$(this).attr("name");
            var unitId = $(this).attr("names");
            if(unitId=="4"){
                html+='<li id="'+id+'" name="'+name+'" number="">';
            }else{
                html+='<li id="'+id+'" name="'+name+'" number="0">';
            }
            html+='<input type="text" value="'+name+'" disabled="disabled"/>';
            html+='<span class="icon"></span>';
            if(unitId=="4"){
                html+='<input type="text" id="valueId" value=""/>';
            }else{
                html+='<input type="text" id="valueId" value="0" disabled="disabled"/>';
            }
            html+='<a class="delete">删除</a>';
            html+='</li>';
        };
    });
    $("#ownerAddPro").append(html);
    removeClass(".delete");
    $("#chargeable_item").modal("hide");
});

/**
 * 添加收费项
 * @param houseHoldJson
 */
function houseHoldAddChargesJump(houseHoldJson){
    $("#ownerAddPro").empty();
    $("#ownerInfo_addCharges").modal("show");
    $(".form-horizontal").attr("code",houseHoldJson.code);
    $(".ids").attr("ids",houseHoldJson.itemIdStr);
    var ids = houseHoldJson.itemIdStr;
    if(ids==null){
            return;
        }else{
            $.ajax({
                type:"post",
                url:zoneServerIp+"/ucotSmart/chargeitemnewVoAction!getChargeitemnewVoByid.action",
                data:{
                    "token":permit,
                    "pager.pages":1,
                    "pager.pagesize":10,
                    "ids":houseHoldJson.itemIdStr,
                    "ownercode":houseHoldJson.code
                },
                dataType:"json",
                success:function(data){
                    if(data.obj==null){
                        $("#charge_item_new_vo_body").append("<h2>没有查询到数据</h2>");
                    }else{
                        var list = eval(data.obj.data);
                        var html="";
                        for(var i=0;i<list.length;i++){
                            if(!list[i].equipCode){
                                html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="0">';
                            }else{
                                html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="'+list[i].equipCode+'">';
                            }
                            html+='<input type="text" value="'+list[i].itemname+'" disabled="disabled"/>';
                            html+='<span class="icon"></span>';
                            if(list[i].unitid=="4"){
                                html += '<input type="text" id="valueId" value="'+list[i].equipCode+'" />';
                            }else{
                                html += '<input type="text" id="valueId" value="0" disabled="disabled" />';
                            }
                            html+='<a class="delete">删除</a>';
                            html+='</li>';
                        }
                        $("#ownerAddPro").append(html);
                        removeClass(".delete");
                    }
                }
        });
    }
}

function houseHoldAddCharges(){
    var ownerCode = $(".form-horizontal").attr("code");
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var id = $(".ids").attr("ids");
    var data = $("#ownerInfoAddChargesFormId").serialize;
    data = decodeURIComponent(data,true);
    console.log(data);
    var itemlist = "";
    var itemids="";
    var listLi=$("#ownerAddPro li");
    listLi.each(function(){
        var id=$(this).attr("id");
        itemids=itemids+","+id;
        var name=$(this).attr("name");
        itemlist+=id+":"+$("#valueId").val()+",";
    });
    itemids = itemids.substr(1,itemids.length);
    itemlist = itemlist.substr(0,itemlist.length-1);
    console.log("itemlist:"+itemlist);
    data = data+"&csetting.ownercode="+ownerCode+"&itemlist="+itemlist
            +"&csetting.itemids="+itemids;
    console.log(data);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!addChargerItem.action?token="+permit,
        data:data,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryHouseHoldLoadPageDataJump(1,"");
        }
    })
}


$(".ownerUpdateFamMem").on('click',function(){
    var li="";
    li+="<li class='name menuBox totalLength' id='update_familyGender'>"
    li+="<span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>"
    li+="<input type='text' class='name update_familyName' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
    li+="<span>身&nbsp;&nbsp;份&nbsp;&nbsp;证</span>"
    li+="<input type='text' class='name update_familyIdentify' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
    li+="<span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>"
    li+="<div class='update_familyGender dropdown areaZone' ids='update_familyGender' optionid='1' modename='男' style='width: 9.31rem;margin-bottom: 0.65rem;'>"
    li+="<a class='dropdown-toggle areaZoneList text-center' data-toggle='dropdown'><span class='option_type'>男</span><b class='caret'></b></a>"
    li+="<ul class='dropdown-menu areaZoneList-menu' role='menu' style='width: 9.31rem;margin-bottom: 0.65rem;'>"
    li+="<li><a codelist='1' modename='男'>男</a></li>"
    li+="<li><a codelist='2' modename='女'>女</a></li>"
    li+="</ul></div>"
    li+="<span>关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系</span>"
    li+="<input type='text' class='name update_familyRelation' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
    li+="<span>手&nbsp;&nbsp;机&nbsp;&nbsp;号</span>"
    li+="<input type='text' class='name update_familyPhoneNum' style='width: 9.31rem;margin-bottom: 0.65rem;'/><span class='owner_family_delete' style='text-align: left;padding-left: 10px;color: #69c;'>删除</span>"
    li+="</li>";
    $("#ownerInfo_modify .familyMembers").append(li);
    removeOwnerFamily(".owner_family_delete");
});

function removeClass(cla){
    $(cla).on('click',function(){
        $(this).parent().remove();
    })
}

//获取住户管理中房屋地址
function ownerUpdateBuilding(){
    var zoneCode = houseHoldManagementCode(permit);
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
            $("#owner_update_toDoModalAddress .ownerUpdateChargingAds .option_type").attr("optionId","");
            var building = $("#owner_update_toDoModalAddress .ownerUpdateChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#owner_update_toDoModalAddress .ownerUpdateUnitAds .dropdown-menu").css("display","");
            $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
            $("#owner_update_toDoModalAddress .ownerUpdateChargingAds .dropdown-menu li:first-child").remove();
        }
    });
}

function ownerUpdateUnit(buildingCode){
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
            $("#owner_update_toDoModalAddress .ownerUpdateUnitAds .option_type").attr("optionId","");
            var building = $("#owner_update_toDoModalAddress .ownerUpdateUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
            $("#owner_update_toDoModalAddress .ownerUpdateUnitAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function ownerUpdateDoorplate(buildingCode){
    sessionStorage.setItem("buildingCode",buildingCode);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":buildingCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds .option_type").attr("optionId","");
            var building = $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds .dropdown-menu");
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
            $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds .dropdown-menu li:first-child").remove();
        }
    });
    sessionStorage.removeItem("buildingCode");
}

function ownerUpdateCode(code){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!findHomeInfo.action",
        dataType:"json",
        data:{
            "token":permit,
            "home.code":code
        },
        success:function(data) {
            if(data.obj){
                var checkInStatusText = "";
                if(data.obj.checkinstatus=="1"){
                    checkInStatusText = "已入住";
                }else if(data.obj.checkinstatus=="2"){
                    checkInStatusText = "未入住";
                }
                var coveredArea = data.obj.coveredarea;
                var useArea = data.obj.usearea;
                var publicArea = data.obj.publicarea;
                var propertyNum = data.obj.certificateid;
                $("#updateCoveredArea").val(houseHoldCheckNull(coveredArea));
                $("#updateUseArea").val(houseHoldCheckNull(useArea));
                $("#updateStatus").val(houseHoldCheckNull(checkInStatusText));
                $("#updatePublicArea").val(houseHoldCheckNull(publicArea));
                $("#updatePropertyNum").val(houseHoldCheckNull(propertyNum));
            }
        }
    });
}

/**
 * 业主信息中删除操作
 * @param code
 */
function ownerInfoDeleteJump(code){
    sessionStorage.setItem("idList",code);
    $("#ownerInfo_delete").modal("show");
}

/**
 * 业主信息中批量删除
 * @param code
 */
function ownerInfoDeleteFetchData(code){
    var imgArray = $("#house_hold_body_house_hold").find("img");
    var flag = true;
    sessionStorage.setItem("code",code);
    var idList="";
    imgArray.each(function (index,item) {
        if($(imgArray[index]).attr("src")=="img/choice.png"){
            flag = false;
            idList += $(imgArray[index]).attr("code").substr(5)+",";
        }
    });
    idList = idList.substr(0,idList.lastIndexOf(","));
    sessionStorage.setItem("idList",idList);
    if(flag){
        msgTips("请选择要删除的全部任务");
    }else{
        $("#ownerInfo_delete").modal();
    }
}

/**
 * 业主信息中删除功能
 */
function ownerInfoDelete(idList){
    idList = sessionStorage.getItem("idList");
    if(idList==""||idList=="null"||idList==undefined){
        msgTips("请选择相应的数据进行删除!");
        return;
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!delOwnerInfo.action",
        data:{
            "token":permit,
            "codeStr":idList
        },
        dataType:"json",
        success:function(data){
            $("#ownerInfo_delete").modal("hide");
            msgTips(data.msg);
            queryHouseHoldLoadPageDataJump(1,"");
        }
    });
    sessionStorage.removeItem("idList");
}

/**
 * 修改业主信息操作
 */
function ownerInfoUpdateJump(houseHoldJson){
    $("#ownerUpdatePro").empty();
    $("#owner_update_cellphone_add .update_telephone_delete").empty();
    $("#ownerInfo_modify .familyMembers").empty();
    ownerUpdateBuilding();
    ownerUpdateCode(houseHoldJson.code);
    $("#ownerInfo_modify").modal("show");
    var ownerGenDerText = houseHoldJson.gender;
    var ownerStatusText = houseHoldJson.checkinstatus;
    var ownerCode = houseHoldJson.code;
    var buildingStr1 = ownerCode.indexOf("d")+1;
    var buildingStr2 = ownerCode.indexOf("b")+1;
    var buildingStr = ownerCode.substring(buildingStr1,buildingStr2);
    var buildingCode = buildingStr.replace("p","期").replace("z","区").replace("b","栋");
    var unitStr1 = ownerCode.indexOf("u")+1;
    var unitStr = ownerCode.substring(buildingStr2,unitStr1);
    var unitCode = unitStr.replace("u","单元");
    var doorplateStr1 = ownerCode.indexOf("h")+1;
    var doorplateStr = ownerCode.substring(unitStr1,doorplateStr1);
    var doorplateCode = doorplateStr.replace("f","层").replace("h","室");
    var telephone = houseHoldJson.telephone.split(",");
    var telephoneHtml = '';
    for(var i in telephone){
        if(i==0){
            $("#updateCellphone").val(telephone[0]);
        }else{
            telephoneHtml+='<li class="totalLength addNumber"><input type="text" class="text-center" name="owner.cellphone" value="'+telephone[i]+'" style="width: 9.31rem;margin-bottom: 0.856rem;"/><span class="delete" style="text-align: left;padding-left: 10px;color: #69c;">删除</span></li>';
        }
    }
    $("#owner_telephone_box_ul").html(telephoneHtml);
    removeClass(".delete");
    var id = houseHoldJson.id;
    if(houseHoldJson.familynum>0&&id!=null){
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/ownerInfoAction!getOwnerFamily.action",
            data:{
                "token":permit,
                "ownerid":houseHoldJson.id
            },
            dataType:"json",
            success:function(data){
                var list = data.obj;
                if(list==null){
                    return;
                }else{
                    var li="";
                    for(var i=0;i<list.length;i++){
                        li+="<li class='name menuBox totalLength' id='update_familyGender'>"
                        li+="<span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>"
                        li+="<input type='text' class='name update_familyName' value='"+list[i].name+"' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
                        li+="<span>身&nbsp;&nbsp;份&nbsp;&nbsp;证</span>"
                        li+="<input type='text' class='name update_familyIdentify' value='"+list[i].identity+"' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
                        li+="<span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>"
                        li+="<div class='update_familyGender dropdown areaZone' ids='update_familyGender' optionid='1' modename='"+list[i].gender+"' style='width: 9.31rem;margin-bottom: 0.65rem;'>"
                        li+="<a class='dropdown-toggle areaZoneList text-center' data-toggle='dropdown' style='width: 9.31rem;margin-bottom: 0.65rem;'><span class='option_type'>男</span><b class='caret'></b></a>"
                        li+="<ul class='dropdown-menu areaZoneList-menu' role='menu' style='width: 9.31rem;margin-bottom: 0.65rem;'>"
                        li+="<li><a codelist='1' modename='男'>男</a></li>"
                        li+="<li><a codelist='2' modename='女'>女</a></li>"
                        li+="</ul></div>"
                        li+="<span>关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系</span>"
                        li+="<input type='text' class='name update_familyRelation' value='"+list[i].relation+"' style='width: 9.31rem;margin-bottom: 0.65rem;'/>"
                        li+="<span>手&nbsp;&nbsp;机&nbsp;&nbsp;号</span>"
                        li+="<input type='text' class='name update_familyPhoneNum' value='"+list[i].telephone+"' style='width: 9.31rem;margin-bottom: 0.65rem;'/><span class='owner_family_delete' style='text-align: left;padding-left: 10px;color: #69c;'>删除</span>"
                        li+="</li>";
                    }
                    $("#ownerInfo_modify .familyMembers").append(li);
                    removeOwnerFamily(".owner_family_delete");
                }
            }
        });
    }
    $("#owner_update_toDoModalAddress .ownerUpdateChargingAds").attr({"optionid":houseHoldJson.code,"modename":buildingCode}).find("a.dropdown-toggle span").text(buildingCode);
    $("#owner_update_toDoModalAddress .ownerUpdateUnitAds").attr({"optionid":houseHoldJson.code,"modename":unitCode}).find("a.dropdown-toggle span").text(unitCode);
    $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds").attr({"optionid":houseHoldJson.code,"modename":doorplateCode}).find("a.dropdown-toggle span").text(doorplateCode);
    $("#owner_update_name").val(houseHoldCheckNull(houseHoldJson.name));
    $("#owner_update_identity").val(houseHoldCheckNull(houseHoldJson.identity));
    $("#unitType_update_gender .unitType_update_gender").attr({"optionid":houseHoldJson.gender,"modename":ownerGenDerText}).find("a.dropdown-toggle span").text(houseHoldCheckNull(ownerGenDerText));
    $("#updateStatus").val(houseHoldCheckNull(houseHoldJson.checkinstatus));
    $("#updateRemark").val(houseHoldCheckNull(houseHoldJson.mark));
    var ids = houseHoldJson.itemIdStr;
    if(ids==null){
        return;
    }else{
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/chargeitemnewVoAction!getChargeitemnewVoByid.action",
            data:{
                "token":permit,
                "pager.pages":1,
                "pager.pagesize":10,
                "ids":houseHoldJson.itemIdStr,
                "ownercode":houseHoldJson.code
            },
            dataType:"json",
            success:function(data){
                if(data.obj==null){
                    $("#charge_item_new_vo_body").append("<h2>没有查询到数据</h2>");
                }else{
                    var list = eval(data.obj.data);
                    var html="";
                    for(var i=0;i<list.length;i++){
                        if(!list[i].equipCode){
                            html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="0">';
                        }else{
                            html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="'+list[i].equipCode+'">';
                        }
                        html+='<input type="text" value="'+list[i].itemname+'" disabled="disabled"/>';
                        html+='<span class="icon"></span>';
                        if(list[i].unitid=="4"){
                            html += '<input type="text" id="valueId" value="'+list[i].equipCode+'" />';
                        }else{
                            html += '<input type="text" id="valueId" value="0" disabled="disabled" />';
                        }
                        html+='<a class="delete">删除</a>';
                        html+='</li>';
                    }
                    $("#ownerUpdatePro").append(html);
                    removeClass(".delete");
                }
            }
        });
    }
}

function ownerInfoUpdate(){
    var data = $("#houseHoldUpdateFormId").serialize();
    data = decodeURIComponent(data,true);
    var building = $("#owner_update_toDoModalAddress .ownerUpdateChargingAds").attr("optionid");
    var unit = $("#owner_update_toDoModalAddress .ownerUpdateUnitAds").attr("optionid");
    var floorRoom = $("#owner_update_toDoModalAddress .ownerUpdateDoorplateAds").attr("optionid");
    var ownerGender = $("#unitType_update_gender .unitType_update_gender").attr("modename");
    var names = $(".update_familyName");
    var identify=$(".update_familyIdentify");
    var gender=$("#update_familyGender .update_familyGender");
    var relation=$(".update_familyRelation");
    var phoneNum=$(".update_familyPhoneNum");
    if(names.length==0){
        var temp1="";
        jsonData="familyJson="+temp1+"&"+data+"&home.code="+floorRoom
            +"&owner.gender="+ownerGender;
    }else{
        var temp='{"family": [';
        for(var i=0;i<names.length;i++){
            temp=temp+'{"name":'+'"'+$(names[i]).val()+'",'+'"identity":'+'"'+$(identify[i]).val()+'",'+'"gender":'+'"'+$(gender[i]).attr("modename")+'",'+'"relation":'+'"'+$(relation[i]).val()+'",'+'"telephone":'+'"'+$(phoneNum[i]).val()+'"'+"},";
        }
        temp=temp.substring(0,temp.length-1)+']'+',"number":'+names.length+"}";
        jsonData="familyJson="+temp+"&"+data+"&home.code="+floorRoom
            +"&owner.gender="+ownerGender;
    }
    $.ajax({
        type:"post",
        data:jsonData,
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!updateOwnerInfo.action?token="+permit,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryHouseHoldLoadPageDataJump(1,"");
        }
    });
}

/**
 * 导入业主信息数据
 */
function houseHoldExportData(){
    var formData = new FormData($('#houseHoldOwnerFormId')[0]);
    var upFile = $("#file_OwnerInfo").val();
    $.ajax({
        type:"post",
        data:formData,
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!importOwnerInfo.action?token="+permit+"&upFile="+upFile,
        async:false,
        cache:false,
        processData:false,
        contentType:false,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryHouseHoldLoadPageDataJump(1,"");
        }
    });
}

//-------------------导出---------------------------
function ownerInfoExport(){
    var url = "/ucotSmart/ownerInfoAction!exportOwnerInfo.action";
    //downloadExlgather(url);
}

function tenantInfoExport(){
    var url = "/ucotSmart/tenementInfoAction!exportTenementInfo.action";
    //downloadExlgather(url);
}

/**
 * 重置业主信息数据
 */
function houseHoldResetData(){
    $("#houseHoldOwnerFormId")[0].reset();
}

/********  租户信息功能      *************/
/**
 * 加载住户管理数据分页
 * @param page 当前页
 * @param type 类型
 */
function queryTenantInfoLoadPageDataJump(page,code){
    tenantSelectBuildingCode();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/tenementInfoAction!findTenementInfo.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":page,
            "pager.pagesize":pageSize,
            "tvo.code":code
        },
        success: function (data) {
            $('#tenant_info_body_tenant_info').empty();
            if(data.obj==null){
                $('#tenant_info_body_tenant_info').append('<h2>没有查询到数据</h2>');
            }else{
                var list = eval(data.obj.data);
                pageTenantInfoServiceLoadInformationList(list);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum/pageSize);//总页数
                $('#tenant_info_paging_tenant_info').empty();
                $('#tenant_info_tips_tenant_info').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                if(pageNum==1||pageNum==0){

                }else{
                    queryTenantInfoListByPage(list.length, totalNum,pageNum,code);
                }
            }
        }
    });
}

/**
 * 条件查询
 */
function tenantInfoSearch(code){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/tenementInfoAction!findTenementInfo.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":1,
            "pager.pagesize":10,
            "tvo.code":code
        },
        success: function (data) {
            $('#tenant_info_body_tenant_info').empty();
            if(data.obj==null){
                $('#tenant_info_body_tenant_info').append('<h2>没有查询到数据</h2>');
            }else{
                var list = eval(data.obj.data);
                pageTenantInfoServiceLoadInformationList(list);
                var totalNum = data.obj.data_count;//总数
                var pageNum = Math.ceil(totalNum/pageSize);//总页数
                $('#tenant_info_paging_tenant_info').empty();
                $('#tenant_info_tips_tenant_info').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                if(pageNum==1||pageNum==0){

                }else{
                    queryTenantInfoListByPage(list.length, totalNum,pageNum,code);
                }
            }
        }
    });
}

/*
 *给住户管理分页插件绑定ajax请求，根据页码任务数据
 */
function queryTenantInfoListByPage(pageNum,totalNum,totalPages,code){
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    $('#tenant_info_paging_tenant_info').empty();
    $('#tenant_info_paging_tenant_info').append('<ul id="pagination_ll_tenant_info" class="pagination-sm"></ul>');
    var tenantInfoPage;
    $('#pagination_ll_tenant_info').twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            tenantInfoPage=page;
        }
    });
    $('#pagination_ll_tenant_info').on('click', 'a', function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/tenementInfoAction!findTenementInfo.action",
            dataType:"json",
            data:{
                "token":permit,
                "pager.pages":tenantInfoPage,
                "pager.pagesize":pageSize,
                "tvo.code":code
            },
            success: function (data) {
                var list=eval(data.obj.data);
                pageTenantInfoServiceLoadInformationList(list);
                $('#tenant_info_tips_tenant_info').empty();
                $('#tenant_info_tips_tenant_info').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            }
        });
    });
}

function tenantSelectBuildingCode(){
    var zoneCode = houseHoldManagementCode(permit);
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
            $("#tenantInfoSelect .tenantSelectChargingAds .option_type").attr("optionId","");
            var building = $("#tenantInfoSelect .tenantSelectChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="" modename="全部">全部</a></li>');
            building.css("display","");
            $("#tenantInfoSelect .tenantSelectUnitAds").css("display","none");
            $("#tenantInfoSelect .tenantSelectDoorplateAds").css("display","none");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
        }
    });
}

function tenantSelectUnitCode(buildingCode){
    $("#tenantInfoSelect .tenantSelectUnitAds").css("display","");
    if(buildingCode==""){
        $("#tenantInfoSelect .tenantSelectUnitAds").hide();
        $("#tenantInfoSelect .tenantSelectDoorplateAds").hide();
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
            var arr = eval(data.obj);
            $("#tenantInfoSelect .tenantSelectUnitAds .option_type").attr("optionId","");
            var building = $("#tenantInfoSelect .tenantSelectUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="" modename="全部">全部</a></li>');
            building.css("display","");
            $("#tenantInfoSelect .tenantSelectDoorplateAds").css("display","none");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
        }
    });
}

function tenantSelectDoorplateCode(unitCode){
    $("#tenantInfoSelect .tenantSelectDoorplateAds").css("display","");
    if(unitCode==""){
        $("#tenantInfoSelect .tenantSelectDoorplateAds").hide();
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":unitCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#tenantInfoSelect .tenantSelectDoorplateAds .option_type").attr("optionId","");
            var building = $("#tenantInfoSelect .tenantSelectDoorplateAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="" modename="全部">全部</a></li>');
            building.css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("u")+1;
                var lastAds=codeStr.indexOf("h")+1;
                var addressCode = codeStr.substring(firstAds, lastAds);
                var newCodeStr= addressCode.replace("f", "层").replace("h", "室");
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'">'+newCodeStr+'</a></li>');
            });
        }
    });
}


function tenantInfoSelect(){
    tenantBuilding();
}

//获取住户管理中房屋地址
function tenantBuilding(){
    var zoneCode = houseHoldManagementCode(permit);
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
            $("#tenant_toDoModalAddress .tenantChargingAds .option_type").attr("optionId","");
            var building = $("#tenant_toDoModalAddress .tenantChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#tenant_toDoModalAddress .tenantUnitAds .dropdown-menu").css("display","");
            $("#tenant_toDoModalAddress .tenantUnitAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
            $("#tenant_toDoModalAddress .tenantChargingAds .dropdown-menu li:first-child").remove();
        }
    });
}

function tenantUnit(buildingCode){
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
            $("#tenant_toDoModalAddress .tenantUnitAds .option_type").attr("optionId","");
            var building = $("#tenant_toDoModalAddress .tenantUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#tenant_toDoModalAddress .tenantDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
            $("#tenant_toDoModalAddress .tenantUnitAds .dropdown-menu li:first-child").remove();
        }
    });
}

function tenantDoorplate(unitCode){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":unitCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#tenant_toDoModalAddress .tenantDoorplateAds .option_type").attr("optionId","");
            var building = $("#tenant_toDoModalAddress .tenantDoorplateAds .dropdown-menu");
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
            $("#tenant_toDoModalAddress .tenantDoorplateAds .dropdown-menu li:first-child").remove();
        }
    });
}

$(".add").on('click',function(){
    var li='';
    li+='<li class="totalLength addNumber_tenant">'+
        '<input type="text" name="t.telephone" class="text-center"><span class="delete" style="text-align: left;padding-left: 10px;color: #69c;">删除</span></li>';
    $("#tenant_telephone_box_ul_add").append(li);
    removeClass(".delete");
});

$(".add").on('click',function(){
    var li='';
    li+='<li class="totalLength addNumber_tenant">'+
        '<input type="text" name="t.telephone" class="text-center"><span class="delete" style="text-align: left;padding-left: 10px;color: #69c;">删除</span></li>';
    $("#tenant_telephone_box_ul_update").append(li);
    removeClass(".delete");
});

function AddTenant(){
    var building = $("#tenant_toDoModalAddress .tenantChargingAds").attr("optionid");
    var unit = $("#tenant_toDoModalAddress .tenantUnitAds").attr("optionid");
    var floorRoom = $("#tenant_toDoModalAddress .tenantDoorplateAds").attr("optionid");
    var name = $("#tenant_name").val();//姓名
    var identity = $("#tenant_identity").val();//身份证
    var gendar = $("#unitType-tenant-gender .unitType-tenant-gender").attr("optionid");//性别
    var memberNum = $("#tenant_memberNum").val();//成员数量
    var telephone = $("#tenant_telephone").val();//手机号码
    var startTime = $("#tenant_start_time").val();//起始时间
    var endTime = $("#tenant_end_time").val();//结束时间
    var contract = $("#tenant_contract").val();//合同编号
    var mark = $("#tenant_mark").val();//备注
    if(building=="0"||building==""){
        msgTips("请选择获取所在期区栋下拉框的值!");
        return;
    }else if(unit=="0"||unit==""){
        msgTips("请选择获取所在单元下拉框的值!");
        return;
    }else if(floorRoom=="0"||floorRoom==""){
        msgTips("请选择获取房屋地址下拉框的值!");
        return;
    }else{
        $.ajax({
            type:"post",
            data:{
                "token":permit,
                "t.code":floorRoom,
                "t.name":name,
                "t.identity":identity,
                "t.gendar":gendar,
                "t.membernum":memberNum,
                "t.telephone":telephone,
                "t.starttime":startTime,
                "t.endtime":endTime,
                "t.contract":contract,
                "t.mark":mark
            },
            url:zoneServerIp+"/ucotSmart/tenementInfoAction!addTenementInfo.action",
            dataType:"json",
            success:function(data){
                msgTips(data.msg);
                queryTenantInfoLoadPageDataJump(1,"");
            }
        });
    }
}

/**
 * 导入租户信息
 */
function importTenantInfoData(){
    var formData = new FormData($('#upload_personnel')[0]);
    var upFile = $("#file_tenantInfo").val();
    $.ajax({
        type:"post",
        data:formData,
        url:zoneServerIp+"/ucotSmart/tenementInfoAction!importTenementInfo.action?token="+permit+"&upFile="+upFile,
        async:false,
        cache:false,
        processData:false,
        contentType:false,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryTenantInfoLoadPageDataJump(1,"","tenant");
        }
    });
}

/**
 * 重置租户信息
 */
function resetTenantInfoData(){
    $('#tenantInfoFormId')[0].reset();
}

/**
 * 业主信息中删除操作
 * @param id
 */
function tenantInfoDeleteJump(id){
    sessionStorage.setItem("idList",id);
    $("#tenantInfo_delete").modal("show");
}

/**
 * 业主信息中批量删除
 * @param id
 */
function tenantInfoDeleteFetchData(id){
    var imgArray = $("#tenant_info_body_tenant_info").find("img");
    var flag = true;
    sessionStorage.setItem("id",id);
    var idList="";
    imgArray.each(function (index,item) {
        if($(imgArray[index]).attr("src")=="img/choice.png"){
            flag = false;
            idList += $(imgArray[index]).attr("id").substr(6)+",";
        }
    });
    idList = idList.substr(0,idList.lastIndexOf(","));
    sessionStorage.setItem("idList",idList);
    if(flag){
        msgTips("请选择要删除的全部任务");
    }else{
        $("#tenantInfo_delete").modal();
    }
}

/**
 * 业主信息中删除功能
 */
function tenantInfoDelete(idList){
    idList = sessionStorage.getItem("idList");
    if(idList==""||idList=="null"||idList==undefined){
        msgTips("请选择相应的数据进行删除!");
        return;
    }
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/tenementInfoAction!delTenementInfo.action",
        data:{
            "token":permit,
            "idList":idList
        },
        dataType:"json",
        success:function(data){
            $("#tenantInfo_delete").modal("hide");
            msgTips(data.msg);
            queryTenantInfoLoadPageDataJump(1,"");
        }
    });
    sessionStorage.removeItem("idList");
}

function queryTenantInfoNewVoLoadPageDataJump(page,chargeId,ulStr){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
        dataType: "json",
        data: {
            "token": permit,
            "pager.pages":page,
            "pager.pagesize":pageSize,
            "chargemode.id":chargeId
        },
        success: function (data) {
            var list = eval(data.obj.data);
            pageTenantInfoNewVoServiceLoadInformationList(list,ulStr);
            var totalNum = data.obj.data_count;//总数
            var pageNum = Math.ceil(totalNum/pageSize);//总页数
            $('#charge_item_paging_tenant_info').empty();
            $('#charge_item_tips_tenant_info').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            if(pageNum==1||pageNum==0){

            }else{
                queryTenantInfoNewVoListByPage(list.length, totalNum,pageNum,chargeId);
            }
        }
    });
}

/*
 *给收费项分页插件绑定ajax请求，根据页码任务数据
 */
function queryTenantInfoNewVoListByPage(pageNum,totalNum,totalPages,chargeId){
    var pageShow=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        pageShow=totalPages;
    }
    $('#charge_item_paging_tenant_info').empty();
    $('#charge_item_paging_tenant_info').append('<ul id="pagination_ll_charge_tenant_info" class="pagination-sm"></ul>');
    var tenantInfoPage;
    $('#pagination_ll_charge_tenant_info').twbsPagination({
        totalPages: totalPages,
        visiblePages: pageShow,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            tenantInfoPage=page;
        }
    });
    $('#pagination_ll_charge_tenant_info').on('click', 'a', function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
            dataType:"json",
            data:{
                "token":permit,
                "pager.pages":tenantInfoPage,
                "pager.pagesize":pageSize,
                "chargemode.id":chargeId
            },
            success: function (data) {
                var list=eval(data.obj.data);
                pageTenantInfoNewVoServiceLoadInformationList(list);
                $('#charge_item_tips_tenant_info').empty();
                $('#charge_item_tips_tenant_info').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            }
        });
    });
}

$("#tenantInfoCheckBox").click(function(){
    var checkNum=$('input[name="tenantInfoCheckBox"]:checked').length;
    var checkAllNum=$('input[name="tenantInfoCheckBox"]').length;
    if(checkNum<checkAllNum){
        $('input[name="tenantInfoCheckBox"]').each(function(){
            $(this).prop("checked",true);
        });
    }else{
        $('input[name="tenantInfoCheckBox"]:checked').each(function(){
            $(this).prop("checked",false);
        });
    }
});

/**
 * 对收费项目进行加载信息列表
 */
$("#tenantNewProject").on('click',function(){
    var ulHtml = $("#tenantAddPro li");
    var ulStr = new Array();
    if(ulHtml.length>0){
        for(var i=0;i<ulHtml.length;i++){
            ulStr.push(ulHtml[i].id);
        }
    }
    queryTenantInfoNewVoLoadPageDataJump(1,"",ulStr);
});

//确认添加收费项目
$("#tenantItemPushBut").click(function(){
    $("#tenantAddPro").empty();
    var inputs=$("#tenant_info_new_vo_body input");
    var html="";
    inputs.each(function(){
        if($(this).is(":checked")){
            var id=$(this).attr("id");
            var name=$(this).attr("name");
            var unitId = $(this).attr("names");
            if(unitId=="4"){
                html+='<li id="'+id+'" name="'+name+'" number="">';
            }else{
                html+='<li id="'+id+'" name="'+name+'" number="0">';
            }
            html+='<input type="text" value="'+name+'" disabled="disabled"/>';
            html+='<span class="icon"></span>';
            if(unitId=="4"){
                html+='<input type="text" id="valueId" value=""/>';
            }else{
                html+='<input type="text" id="valueId" value="0" disabled="disabled"/>';
            }
            html+='<a class="delete">删除</a>';
            html+='</li>';
        };
    });
    $("#tenantAddPro").append(html);
    $("#tenantInfo_addItem").modal("hide");
    removeClass(".delete");
});

/**
 * 添加收费项
 * @param tenantInfoJson
 */
function tenantInfoAddChargesJump(tenantInfoJson){
    $("#tenantAddPro").empty();
    $("#tenantInfo_addCharges").modal("show");
    $(".form-horizontal").attr("code",tenantInfoJson.code);
    $(".ids").attr("ids",tenantInfoJson.itemIdStr);
    var ids = tenantInfoJson.itemIdStr;
    if(ids==null){
        return;
    }else{
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/chargeitemnewVoAction!getChargeitemnewVoByid.action",
            data:{
                "token":permit,
                "pager.pages":1,
                "pager.pagesize":10,
                "ids":tenantInfoJson.itemIdStr,
                "ownercode":tenantInfoJson.code
            },
            dataType:"json",
            success:function(data){
                if(data.obj==null){
                    $("#tenant_info_new_vo_body").append("<h2>没有查询到数据</h2>");
                }else{
                    var list = eval(data.obj.data);
                    var html="";
                    for(var i=0;i<list.length;i++){
                        html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="'+list[i].equipCode+'">';
                        html+='<input type="text" value="'+list[i].itemname+'" disabled="disabled"/>';
                        html+='<span class="icon"></span>';
                        if(list[i].unitid=="4"){
                            html += '<input type="text" class="number" value="'+list[i].equipCode+'" />';
                        }else{
                            html += '<input type="text" class="number" value="0" disabled="disabled"/>';
                        }
                        html+='<a class="delete">删除</a>';
                        html+='</li>';
                    }
                    $("#tenantAddPro").append(html);
                    removeClass('.delete');
                }
            }
        });
    }
}

function tenantInfoAddCharges(){
    var code = $(".form-horizontal").attr("code");
    var startTime = $("#start_time").val();
    var id = $(".ids").attr("ids");
    console.log("id:"+id);
    var endTime = $("#end_time").val();
    var data = $("#tenantInfoAddChargesFormId").serialize;
    data = decodeURIComponent(data,true);
    console.log(data);
    var itemlist = "";
    var itemids="";
    var listLi=$("#tenantAddPro li");
    listLi.each(function(){
        var id=$(this).attr("id");
        itemids=itemids+","+id;
        var name=$(this).attr("name");
        itemlist+=id+":"+$("#valueId").val()+",";
    });
    itemids = itemids.substr(1,itemids.length);
    itemlist = itemlist.substr(0,itemlist.length-1);
    data = data+"&csetting.ownercode="+code+"&itemlist="+itemlist+"&csetting.itemids="+itemids;
    console.log(data);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/ownerInfoAction!addChargerItem.action?token="+permit,
        data:data,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryTenantInfoLoadPageDataJump(1,"");
        }
    });
}

//获取住户管理中房屋地址
function tenantUpdateBuilding(){
    var zoneCode = houseHoldManagementCode(permit);
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
            $("#tenant_update_toDoModalAddress .tenantUpdateChargingAds .option_type").attr("optionId","");
            var building = $("#tenant_update_toDoModalAddress .tenantUpdateChargingAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#tenant_update_toDoModalAddress .tenantUpdateUnitAds .dropdown-menu").css("display","");
            $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("d")+1;
                var lastAds=codeStr.indexOf("b")+1;
                var addressCode=codeStr.substring(firstAds,lastAds);
                var newCodeStr =  addressCode.replace("p","期").replace("z","区").replace("b","栋");
                building.append('<li><a codeList="' + codeStr + '" modename="'+newCodeStr+'">' + newCodeStr + '</a></li>');
            });
            $("#tenant_update_toDoModalAddress .tenantUpdateChargingAds .dropdown-menu li:first-child").remove();
        }
    });
}

function tenantUpdateUnit(buildingCode){
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
            $("#tenant_update_toDoModalAddress .tenantUpdateUnitAds .option_type").attr("optionId","");
            var building = $("#tenant_update_toDoModalAddress .tenantUpdateUnitAds .dropdown-menu");
            building.empty();
            building.append('<li><a codelist="0" modename="全部">全部</a></li>');
            building.css("display","");
            $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds .dropdown-menu").css("display","");
            $(arr).each(function(index){
                var codeStr = arr[index].code;
                var firstAds=codeStr.indexOf("b")+1;
                var lastAds=codeStr.indexOf("u");
                var newCodeStr=codeStr.substring(firstAds,lastAds);
                building.append('<li><a codeList="'+codeStr+'" modename="'+newCodeStr+'单元">'+newCodeStr+'单元</a></li>');
            });
            $("#tenant_update_toDoModalAddress .tenantUpdateUnitAds .dropdown-menu li:first-child").remove();
        }
    });
}

function tenantUpdateDoorplate(unitCode){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/building!queryHomeByUnitcode.action",
        dataType:"json",
        data:{
            "token":permit,
            "unitcode":unitCode
        },
        success:function(data){
            var arr = eval(data.obj);
            $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds .option_type").attr("optionId","");
            var building = $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds .dropdown-menu");
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
            $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds .dropdown-menu li:first-child").remove();
        }
    });
}

/**
 * 修改租户信息
 * @param id
 */
function tenantInfoUpdateJump(tenantInfoJson){
    $("#tenantUpdatePro").empty();
    $("#tenantInfo_modify").modal("show");
    var genDarText = "";
    if(tenantInfoJson.gendar=="1"){
        genDarText = "男";
    }else if(tenantInfoJson.gendar=="2"){
        genDarText = "女";
    }
    var tenantCode = tenantInfoJson.code;
    var buildingStr1 = tenantCode.indexOf("d")+1;
    var buildingStr2 = tenantCode.indexOf("b")+1;
    var buildingStr = tenantCode.substring(buildingStr1,buildingStr2);
    var buildingCode = buildingStr.replace("p","期").replace("z","区").replace("b","栋");
    var unitStr1 = tenantCode.indexOf("u")+1;
    var unitStr = tenantCode.substring(buildingStr2,unitStr1);
    var unitCode = unitStr.replace("u","单元");
    var doorplateStr1 = tenantCode.indexOf("h")+1;
    var doorplateStr = tenantCode.substring(unitStr1,doorplateStr1);
    var doorplateCode = doorplateStr.replace("f","层").replace("h","室");
    $(".tenantId").attr("id",tenantInfoJson.id);
    $("#tenant_update_toDoModalAddress .tenantUpdateChargingAds").attr({"optionid":tenantInfoJson.code,"modename":buildingCode}).find("a.dropdown-toggle span").text(buildingCode);
    $("#tenant_update_toDoModalAddress .tenantUpdateUnitAds").attr({"optionid":tenantInfoJson.code,"modename":unitCode}).find("a.dropdown-toggle span").text(unitCode);
    $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds").attr({"optionid":tenantInfoJson.code,"modename":doorplateCode}).find("a.dropdown-toggle span").text(doorplateCode);
    $("#tenant_update_name").val(tenantInfoJson.name);
    $("#tenant_update_identity").val(tenantInfoJson.identity);
    $("#tenant_unitType-update-gender .tenant_unitType-update-gender").attr({"optionid":tenantInfoJson.gendar,"modename":genDarText}).find("a.dropdown-toggle span").text(genDarText);
    $("#tenant_update_memberNum").val(tenantInfoJson.membernum);
    //$("#tenant_update_telephone").val();
    $("#tenant_update_start_time").val(tenantInfoJson.starttime);
    $("#tenant_update_end_time").val(tenantInfoJson.endtime);
    $("#tenant_update_contract").val(tenantInfoJson.contract);
    $("#tenant_update_mark").val(tenantInfoJson.mark);
    tenantUpdateBuilding();
    var telephone = tenantInfoJson.telephone.split(',');
    var telephoneHtml = '';
    for(var i in telephone){
        if(i==0){
            $("#tenant_update_telephone").val(telephone[0]);
        }else{
            telephoneHtml+='<li class="totalLength addNumber"><input type="text" class="text-center" name="t.telephone" value="'+telephone[i]+'" style="width: 9.31rem;margin-bottom: 0.856rem;"/><span class="delete" style="text-align: left;padding-left: 10px;color: #69c;">删除</span></li>';
        }
    }
    $("#owner_telephone_box_ul").html(telephoneHtml);
    removeClass(".delete");
    var ids = tenantInfoJson.itemIdStr;
    if(ids==null){
        return;
    }else{
        $.ajax({
            type:"post",
            url:zoneServerIp+"/ucotSmart/chargeitemnewVoAction!getChargeitemnewVoByid.action",
            data:{
                "token":permit,
                "pager.pages":1,
                "pager.pagesize":10,
                "ids":tenantInfoJson.itemIdStr,
                "ownercode":tenantInfoJson.code
            },
            dataType:"json",
            success:function(data){
                if(data.obj==null){
                    $("#tenant_info_new_vo_body").append("<h2>没有查询到数据</h2>");
                }else{
                    var list = eval(data.obj.data);
                    var html="";
                    for(var i=0;i<list.length;i++){
                        if(!list[i].equipCode){
                            html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="0">';
                        }else{
                            html+= '<li id="' + list[i].id + '" ids="' + list[i].itemcode + '" name="' + list[i].itemname + '" number="'+list[i].equipCode+'">';
                        }
                        html+='<input type="text" value="'+list[i].itemname+'" disabled="disabled"/>';
                        html+='<span class="icon"></span>';
                        if(list[i].unitid=="4"){
                            html += '<input type="text" id="valueId" value="'+list[i].equipCode+'" />';
                        }else{
                            html += '<input type="text" id="valueId" value="0" disabled="disabled" />';
                        }
                        html+='<a class="delete">删除</a>';
                        html+='</li>';
                    }
                    $("#tenantUpdatePro").append(html);
                    removeClass(".delete");
                }
            }
        });
    }
}

function tenantInfoUpdate(){
    var id = $(".tenantId").attr("id");
    var data = $("#tenantInfoUpdateFormId").serialize();//序列化乱码
    data = decodeURIComponent(data,true);
    var building = $("#tenant_update_toDoModalAddress .tenantUpdateChargingAds").attr("optionid");
    var unit = $("#tenant_update_toDoModalAddress .tenantUpdateUnitAds").attr("optionid");
    var floorRoom = $("#tenant_update_toDoModalAddress .tenantUpdateDoorplateAds").attr("optionid");
    var name = $("#tenant_update_name").val();//姓名
    var identity = $("#tenant_update_identity").val();//身份证
    var gendar = $("#tenant_unitType-update-gender .tenant_unitType-update-gender").attr("optionid");//性别
    var memberNum = $("#tenant_update_memberNum").val();//成员数量
    var telephone = $("#tenant_update_telephone").val();//手机号码
    var startTime = $("#tenant_update_start_time").val();//起始时间
    var endTime = $("#tenant_update_end_time").val();//结束时间
    var contract = $("#tenant_update_contract").val();//合同编号
    var mark = $("#tenant_update_mark").val();//备注
    data = data+"&t.gendar="+gendar+"&token="+permit;
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/tenementInfoAction!updateTenementInfo.action?t.id="+id,
        dataType:"json",
        data:data,
        success:function(data){
            msgTips(data.msg);
            queryTenantInfoLoadPageDataJump(1,"");
        }
    });
}

//收费类别
function houseHoldChargeCategory(type){
    if(type=="1"){
        var chargeCategory = "周期性收费";
    }else if(type=="2"){
        var chargeCategory = "临时性收费";
    }else if(type=="3"){
        var chargeCategory = "押金类收费";
    }
    return chargeCategory;
}

//计算公式
function houseHoldChargeFormula(type){
    if(type=="1"){
        var chargeFormula = "固定金额";
    }else if(type=="2"){
        var chargeFormula = "单价*数量";
    }else if(type=="3"){
        var chargeFormula = "阶梯性收费";
    }
    return chargeFormula;
}

function houseHoldChargeCycle(type) {
    if(type == null){
        var chargeCycle = "--";
    }else if (type == "1") {
        var chargeCycle = "日";
    }else if (type == "2") {
        var chargeCycle = "月";
    }else if (type == "3") {
        var chargeCycle = "季";
    }else if (type == "4") {
        var chargeCycle = "年";
    }else if (type == "5") {
        var chargeCycle = "一次性";
    }
    return chargeCycle;
}

//解析成街区到单元
function houseHoldAreaToCharacter(str){
    return str.replace("d","街区").replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元").replace("f","层").replace("h","室");
}

//通过token获取zoneCode//200002d1p1z1b
function houseHoldManagementCode(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.endsWith("N"))
        return code.substring(0,code.indexOf("d"));
}

//判断是否为空
function houseHoldCheckNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}

//格式化时间格式为yyyy-MM-dd
function tenantInfoSubStr(time){
    if(time!=null&&time!="undefined"){
        return time.substring(0,10);
    }
    return "";
}

//判断是否为空
function tenantInfoCheckNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}

//解析成街区到单元
function tenantInfoAreaToCharacter(str){
    return str.replace("d","街区").replace("p","期").replace("z","区")
        .replace("b","栋").replace("u","单元").replace("f","层").replace("h","室");
}

//解析到室
function tranUnitOwnerTenant(code){
    var index1=code.indexOf("d");
    var index2=code.indexOf("p");
    var index3=code.indexOf("z");
    var index4=code.indexOf("b");
    var index5=code.indexOf("u");
    var index6=code.indexOf("f");
    var index7=code.indexOf("h");
    var code1=code.substring(0, index1);
    var code2=code.substring(index1+1, index2);
    var code3=code.substring(index2+1, index3);
    var code4=code.substring(index3+1, index4);
    var code5=code.substring(index4+1, index5);
    var code6=code.substring(index5+1,index6);
    var code7=code.substring(index6+1,index7);
    var o=code2+"期"+code3+"区"+code4+"栋"+code5+"单元"+code6+"层"+code7+"室";
    return o;
}

function tenantInfoGenDar(genDar){
    if(genDar=="1"){
        var tenantInfoGenDar = "男";
    }else if(genDar=="2"){
        var tenantInfoGenDar = "女";
    }
    return tenantInfoGenDar;
}


/**
 * 业主清空添加模态框
 */
$('#addOwnerInfo').on('hidden.bs.modal', function (e) {
    $("#owner_toDoModalAddress .dropdown-toggle span").text("");
    $("#owner_toDoModalAddress .dropdown").attr({"optionid":"","modename":""});
    $("#unitType-gender").find(".dropdown-toggle span").text("男");
    $(":input").val("");
})

/**
 * 业主收费项清空添加模态框
 */
$('#ownerInfo_addCharges').on('hidden.bs.modal', function (e) {
    $(":input").val("");
})

/**
 * 租户清空添加模态框
 */
$('#addTenantInfo').on('hidden.bs.modal', function (e) {
    $("#tenant_toDoModalAddress .dropdown-toggle span").text("");
    $("#tenant_toDoModalAddress .dropdown").attr({"optionid":"","modename":""});
    $("#unitType-tenant-gender").find(".dropdown-toggle span").text("男");
    $(":input").val("");
})

/**
 * 租户收费项清空添加模态框
 */
$('#tenantInfo_addCharges').on('hidden.bs.modal', function (e) {
    $(":input").val("");
})

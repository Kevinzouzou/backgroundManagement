/**
 * Created by GIGA on 2017-12-20.
 */
//小区概要
//上传图片
$("#tab_communityPro .uploadImg").change(function(){
    var pathUrl=$(this).val();
    var file =$(this).get(0).files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload=function(e){
        $("#tab_communityPro .zonePic").css("background-image","url("+e.target.result+")");//预览图片
    };
});
//编辑文本
$("body").on('click',"#tab_communityPro .btns>.editText",function(){
   $(this).css("display","none");
    $("#tab_communityPro .btns>.determine").css("display","inline-block");
    var id="#tab_communityPro .introduce";
    $(id+">.comTitle").css("display","none");
    $(id+">.headerComTitle").val($(id+">.comTitle").text()).css("display","inline-block");
    $(id+" .textDetail").css("display","none");
    $(id+" .textContent").val($(id+" .textDetail").text()).css("display","block");
});
//确认文本
$("body").on('click',"#tab_communityPro .btns>.determine",function(){
   $(this).css("display","none");
    $("#tab_communityPro .btns>.editText").css("display","inline-block");
    var id="#tab_communityPro .introduce";
    $(id+">.headerComTitle").css("display","none");
    $(id+">.comTitle").text($(id+">.headerComTitle").val()).css("display","inline-block");
    $(id+" .textContent").css("display","none");
    $(id+" .textDetail").text($(id+" .textContent").val()).css("display","block");
});

//房屋设置
//期，区，栋，单元，层，室 添加
addItem("#addPeriod .totalLength .add","#addPeriod .totalLength .delete");
addItem("#addZone .totalLength .add","#addZone .totalLength .delete");
addItem("#addBuilding .totalLength .add","#addBuilding .totalLength .delete");
addItem("#addUnit .totalLength .add","#addUnit .totalLength .delete");
addItem("#addLayer .totalLength .add","#addLayer .totalLength .delete");
addItem("#addRoom .totalLength .add","#addRoom .totalLength .delete");
//模态框添加与删除
function addItem(addId,deleteId){
    $("body").on('click',addId,function(){
        var html='<li class="totalLength"><span></span><input type="text" class="adds"/><a class="delete">删除</a></li>';
        $(this).parents("ul.large-half").append(html);
        deleteItem(deleteId);
    });
}
function deleteItem(id){
    $("body").on('click',id,function(){
       $(this).parent().remove();
    });
}
//下拉组件，选中填充 模态添加增加disabled 属性
function selectZoneAreaDrop(id,class1,class2){
    $(id).on('click',class1+">li>a",function(){
        if($(this).attr("ids")){
            var ids=$(this).attr("ids");
            $(this).parent().parent().siblings(class2).attr("ids",ids);
            if(ids==2){
                $(this).parents(".large-half").find(".adds").attr("disabled",true);
                $(this).parents(".large-half").find(".add").addClass("ad").removeClass("add");
            }else if(ids==1){
                $(this).parents(".large-half").find(".adds").attr("disabled",false);
                $(this).parents(".large-half").find(".ad").addClass("add").removeClass("ad");
            }
        }
        $(this).parent().parent().siblings(class2).find("span").text($(this).html());
    });
}
selectZoneAreaDrop("#tab_community_management",".areaZoneList-menu",".areaZoneList");
//期 添加
$("body").on('click',"#addPeriod .determine",function(){
    var id="#addPeriod",data;
    var  uuid=$(id+" .unCode").val();
    if($(id+" .areaZoneList").attr("ids")==2){
        $(id+" .adds").attr("disabled",true);
        data="&z.uuid="+uuid+"&z.p=0";
    }else if($(id+" .areaZoneList").attr("ids")==1){
        $(id+" .adds").attr("disabled",false);
        var str="";
        var txt=$(id).find('.adds');
        for (var i = 0; i < txt.length; i++) {
            str+=txt.eq(i).val()+"," ;
        }
        str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
        data="&z.uuid="+uuid+"&z.p="+str;
    }
    ajaxRequest("zone!addZonearea.action",data,"queryPeriodTable");
    $(id+" input").val("");
});
//期 查询
$("body").on('click',".house_set",function(){
   queryPeriodTable();
});
$("body").on('click',".period_set",function(){
   queryPeriodTable();
});
//期 查询
function queryPeriodTable(){
    var data="target=p";
    queryListByParams("/ucotSmart/zone!queryZonearea.action",data,"periodPage","addPeriodTable");
}
var period=[];
//期 查询方法
function addPeriodTable(list){
    period.length=0;
    var html="",len=list.length;
    $.each(list,function(i, tbodyTr){
        var peItem={ "期":tbodyTr.p};
        period.push(peItem);
        html+='<tr><td>'+checknull(tbodyTr.p)+'</td>' +
            '<td><a class="delete" data-toggle="modal" data-target="#deletePeriodSet">删除</a></td></tr>';
    });
    $("#tab_period_set .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_period_set .tables tbody",len,10);
    //删除相关信息 传值
    deleteZoneArea("#tab_period_set");
}
//期 导出
$("body").on('click',"#tab_period_set .btns .lead_out",function(){
   var peJson=period.concat();
    if(period.length>0){
        downloadExl(peJson,"periodSetDowExl");
    }else{
        msgTips("暂无数据！");
    }
});
//表格中 删除事件，传值（删除内容）
function deleteZoneArea(id){
    $(id+" tbody td .delete").on("click",function(){
        $(id+" .mBody_title .deleteInfo").val($(this).parents("tr").children("td:first-child").text());
    });
}
//期 删除
deleteZInfo("#tab_period_set","p","queryPeriodTable");
//期 区 栋 单元 层 删除（ p, z, b, u, f）
function deleteZInfo(id,paras,fn){
    $("body").on("click",id+" .modal .to_delete",function(){
        var deleteValue=$(id+" .modal .mBody_title .deleteInfo").val();
        var data="&z."+paras+"="+deleteValue;
        ajaxRequest("zone!dellZonearea.action",data,fn);
    });
}

//区 查询
$("body").on('click',".zone_set",function(){
    queryZoneSetTable();
});
function queryZoneSetTable(){
    var data="target=z";
    queryListByParams("/ucotSmart/zone!queryZonearea.action",data,"zonePage","addZoneSetTable");
}
var zoneSet=[];
//区 查询方法
function addZoneSetTable(list){
    zoneSet.length=0;
    var html="",len=list.length;
    $.each(list,function(i, tbodyTr){
        var zoneItem={ "区":tbodyTr.z};
        zoneSet.push(zoneItem);
        html+='<tr><td>'+checknull(tbodyTr.z)+'</td>' +
            '<td><a class="delete" data-toggle="modal" data-target="#deleteZoneSet">删除</a></td></tr>';
    });
    $("#tab_zone_set .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_zone_set .tables tbody",len,10);
    //删除相关信息 传值
    deleteZoneArea("#tab_zone_set");
}
//区 添加
$("body").on('click',"#addZone .determine",function(){
    var id="#addZone",data;
    if($(id+" .areaZoneList").attr("ids")==2){
        $(id+" .adds").attr("disabled",true);
        data="&z.z=0";
    }else if($(id+" .areaZoneList").attr("ids")==1){
        $(id+" .adds").attr("disabled",false);
        var str="";
        var txt=$(id).find('.adds');
        for (var i = 0; i < txt.length; i++) {
            str+=txt.eq(i).val()+"," ;
        }
        str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
        data="&z.z="+str;
    }
    ajaxRequest("zone!addZonearea.action",data,"queryZoneSetTable");
    $(id+" input").val("");
});
//区 导出
$("body").on('click',"#tab_zone_set .btns .lead_out",function(){
    var zoneSetJson=zoneSet.concat();
    if(zoneSet.length>0){
        downloadExl(zoneSetJson,"zoneSetDowExl");
    }else{
        msgTips("暂无数据！");
    }
});
//区 删除
deleteZInfo("#tab_zone_set","z","queryZoneSetTable");

//栋 查询
$("body").on('click',".building_set",function(){
    queryBuildingSetTable();
});
function queryBuildingSetTable(){
    var data="target=b";
    queryListByParams("/ucotSmart/zone!queryZonearea.action",data,"buildingPage","addBuildingSetTable");
}
var buildingSet=[];
//栋 查询方法
function addBuildingSetTable(list){
    buildingSet.length=0;
    var html="",len=list.length;
    $.each(list,function(i, tbodyTr){
        var buildItem={ "栋":tbodyTr.b};
        buildingSet.push(buildItem);
        html+='<tr><td>'+checknull(tbodyTr.b)+'</td>' +
            '<td><a class="delete" data-toggle="modal" data-target="#deleteBuildingSet">删除</a></td></tr>';
    });
    $("#tab_building_set .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_building_set .tables tbody",len,10);
    //删除相关信息 传值
    deleteZoneArea("#tab_building_set");
}
//栋 添加
$("body").on('click',"#addBuilding .determine",function(){
    var id="#addBuilding",data;
    var str="";
    var txt=$(id).find('.adds');
    for (var i = 0; i < txt.length; i++) {
        str+=txt.eq(i).val()+"," ;
    }
    str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
    data="&z.b="+str;
    ajaxRequest("zone!addZonearea.action",data,"queryBuildingSetTable");
    $(id+" input").val("");
});
//栋 导出
$("body").on('click',"#tab_zone_set .btns .lead_out",function(){
    var zoneSetJson=buildingSet.concat();
    if(buildingSet.length>0){
        downloadExl(zoneSetJson,"buildingSetDowExl");
    }else{
        msgTips("暂无数据！");
    }
});
//栋 删除
deleteZInfo("#tab_building_set","b","queryBuildingSetTable");

//单元 查询
$("body").on('click',".unit_set",function(){
    queryUnitSetTable();
});
function queryUnitSetTable(){
    var data="target=u";
    queryListByParams("/ucotSmart/zone!queryZonearea.action",data,"unitPage","addUnitSetTable");
}
var unitSet=[];
//单元 查询方法
function addUnitSetTable(list){
    unitSet.length=0;
    var html="",len=list.length;
    $.each(list,function(i, tbodyTr){
        var unitItem={ "单元":tbodyTr.u};
        unitSet.push(unitItem);
        html+='<tr><td>'+checknull(tbodyTr.u)+'</td>' +
            '<td><a class="delete" data-toggle="modal" data-target="#deleteUnitSet">删除</a></td></tr>';
    });
    $("#tab_unit_set .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_unit_set .tables tbody",len,10);
    //删除相关信息 传值
    deleteZoneArea("#tab_unit_set");
}
//单元 添加
$("body").on('click',"#addUnit .determine",function(){
    var id="#addUnit",data;
    if($(id+" .areaZoneList").attr("ids")==2){
        $(id+" .adds").attr("disabled",true);
        data="&z.u=0";
    }else if($(id+" .areaZoneList").attr("ids")==1){
        $(id+" .adds").attr("disabled",false);
        var str="";
        var txt=$(id).find('.adds');
        for (var i = 0; i < txt.length; i++) {
            str+=txt.eq(i).val()+"," ;
        }
        str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
        data="&z.u="+str;
    }
    ajaxRequest("zone!addZonearea.action",data,"queryUnitSetTable");
    $(id+" input").val("");
});
//单元 导出
$("body").on('click',"#tab_unit_set .btns .lead_out",function(){
    var unitSetJson=unitSet.concat();
    if(unitSet.length>0){
        downloadExl(unitSetJson,"unitSetDowExl");
    }else{
        msgTips("暂无数据！");
    }
});
//单元 删除
deleteZInfo("#tab_unit_set","u","queryUnitSetTable");

//层 查询
$("body").on('click',".layer_set",function(){
    queryLayerSetTable();
});
function queryLayerSetTable(){
    var data="target=f";
    queryListByParams("/ucotSmart/zone!queryZonearea.action",data,"layerPage","addLayerSetTable");
}
var layerSet=[];
//层 查询方法
function addLayerSetTable(list){
    layerSet.length=0;
    var html="",len=list.length;
    $.each(list,function(i, tbodyTr){
        var layerItem={ "层":tbodyTr.f};
        layerSet.push(layerItem);
        html+='<tr><td>'+checknull(tbodyTr.f)+'</td>' +
            '<td><a class="delete" data-toggle="modal" data-target="#deleteLayerSet">删除</a></td></tr>';
    });
    $("#tab_layer_set .tables tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_layer_set .tables tbody",len,10);
    //删除相关信息 传值
    deleteZoneArea("#tab_layer_set");
}
//层 添加
$("body").on('click',"#addLayer .determine",function(){
    var id="#addLayer",data;
    var str="";
    var txt=$(id).find('.adds');
    for (var i = 0; i < txt.length; i++) {
        str+=txt.eq(i).val()+"," ;
    }
    str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
    data="&z.f="+str;
    ajaxRequest("zone!addZonearea.action",data,"queryLayerSetTable");
    $(id+" input").val("");
});
//层 导出
$("body").on('click',"#tab_layer_set .btns .lead_out",function(){
    var layerSetJson=layerSet.concat();
    if(layerSet.length>0){
        downloadExl(layerSetJson,"layerSetDowExl");
    }else{
        msgTips("暂无数据！");
    }
});
//层 删除
deleteZInfo("#tab_layer_set","f","queryLayerSetTable");

//室 添加下拉选项框传值
$("body").on('click',"#tab_room_set .btns>.adding",function() {
    //var data="token="+sessionStorage.getItem("token")+"&pager.pagesize=10";
    var data="token=13300-47100000d-1514942269433";
    $.ajax({
        type: "POST",
        url: zoneServerIp+"/ucotSmart/zone!queryZoneareaObject.action",
        data: data,
        dataType: "json",
        success:function(data){
            console.log(data);
            var pValue=data.obj.p;
            var zValue=data.obj.z;
            var bValue=data.obj.b;
            var uValue=data.obj.u;
            var fValue=data.obj.f;
            addressSelect("#addRoom .periodType",pValue);
            addressSelect("#addRoom .zoneType",zValue);
            addressSelect("#addRoom .buildingType",bValue);
            addressSelect("#addRoom .unitType",uValue);
            addressSelect("#addRoom .layer",fValue);
        }
    });
});
//室 地址下拉选项框传值
function addressSelect(id,str){
    var arr=str.split(",");
    var div='<li><a ids="0">无</a></li>';
    for(var i=0;i<arr.length;i++){
        console.log(arr[i]);
        div+='<li><a ids="'+(i+1)+'">'+arr[i]+'</a></li>';
    }
    $(id+" .dropdown-menu").html(div);
}
//室 添加
$("body").on('click',"#addRoom .determine",function(){
    var id="#addRoom",data;
    var pValue=$(id+" .periodTypeList").attr("ids");
    var zValue=$(id+" .zoneTypeList").attr("ids");
    var bValue=$(id+" .buildingTypeList").attr("ids");
    var uValue=$(id+" .unitTypeList").attr("ids");
    var fValue=$(id+" .roomNumList").attr("ids");
    var str="";
    var txt=$(id).find('.adds');
    for (var i = 0; i < txt.length; i++) {
        str+=txt.eq(i).val()+"," ;
    }
    str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
    data="token="+permit+"&z.p="+pValue+"&z.z="+zValue+"&z.b="+bValue+"&z.u="+uValue+"&z.f="+fValue+"&homearray="+str;
    console.log(data+"--data");
    $.ajax({
        type: "POST",
        url: zoneServerIp+"/ucotSmart/zone!addNewVersionHome.action",
        data: data,
        dataType: "json",
        success:function(data){
            console.log(data);
        }
    });
});
//室 查询
$("body").on('click',"#tab_house_set .room_set",function(){
    queryRoomSetTable();
});
function queryRoomSetTable(){
    queryListByParams("/ucotSmart/zone!queryNewHome.action","","layerPage","addRoomSetTable");
}
var roomSet=[];
//室 查询方法
function addRoomSetTable(list){
    console.log(list);
    roomSet.length=0;
    var html="",len=list.length;
    $.each(list,function(i, tbodyTr){
        var roomItem={ "室":tbodyTr.f};
        roomSet.push(roomItem);
        html+='<tr><td>'+checknull(tbodyTr.f)+'</td>' +
            '<td><a class="delete" data-toggle="modal" data-target="#deleteLayerSet">删除</a></td></tr>';
    });
    //$("#tab_layer_set .tables tbody").html(html);
    //行数据少于10行，空行添加
    //addTr("#tab_layer_set .tables tbody",len,10);
    //删除相关信息 传值
    //deleteZoneArea("#tab_layer_set");
}
//室 导出
$("body").on('click',"#tab_room_set .btns .lead_out",function(){
    var roomSetJson=roomSet.concat();
    if(roomSet.length>0){
        downloadExl(roomSetJson,"roomSetDowExl");
    }else{
        msgTips("暂无数据！");
    }
});




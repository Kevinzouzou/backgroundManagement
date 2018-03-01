/**
 * Created by 冯枭 on 2017/8/25. 小区
 */


/**
 * 点击小区查询小区数据
 * */
$('.community,.device_configuration,li a[href="#access_control_menu"]').click(function(){
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryzoneJump');
    queryzoneJump();
});

var ZONESERVICE = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    // Need init if jQuery is called (just allow error to be thrown if not included)
    return new ZONESERVICE.fn.init( selector, context );
}

ZONESERVICE.fn=ZONESERVICE.prototype={
    constructor: ZONESERVICE,

    // Start with an empty selector
    selector: "",
    // The default length of a jQuery object is 0
    length: 0,

    queryzonJump: function(){
        sessionStorage.removeItem("zoneCode");//清除缓存
        zoneshow();
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/zone!query.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
            data: {"token":sessionStorage.getItem("token"),
                "zone.code":""
            },
            dataType: "json",
            success: function (data) {
                console.log("查询小区");
                var list=eval(data.obj);//得到小区集合
                addZoneTableList(list);//
            }
        });

    }




}


//查询小区信息
function queryzoneJump() {
    sessionStorage.removeItem("zoneCode");//清除缓存
    zoneshow();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/zone!query.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {"token":sessionStorage.getItem("token"),
                "zone.code":""
        },
        dataType: "json",
        success: function (data) {
            console.log("查询小区");
            var list=eval(data.obj);//得到小区集合
            addZoneTableList(list);//
        }
    });
}

//添加小区
function addzone(){
    var data=$("#zone-form-add").serialize();//序列化乱码
    data = decodeURIComponent(data,true);//进行解码，得到要提交的数据
    $('#mymodal').modal('hide');
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/zone!createZone.action",
        data: data+"&token="+sessionStorage.getItem("token"),
        dataType: "json",
        success: function (data) {
            console.log("添加小区");
            queryzoneJump();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}

//删除小区
function deleteZone(zoneCode){
    console.log("删除小区");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/zone!del.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {"token":sessionStorage.getItem("token"),
            "zone.code":zoneCode
        },
        dataType: "json",
        success: function (data) {
            console.log("删除小区");
            mymodalhide();
            back();
            msgTips(data.msg);
        }
    });

}

/**
 * 查询楼宇信息
 * */
function queryBuildingJump(zoneCode){
    sessionStorage.setItem("zoneCode",zoneCode);
    buildingshow();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        data: {
            "token":sessionStorage.getItem("token"),
            "zonecode":zoneCode},
        dataType: "json",
        success: function (data) {
            console.log("查询楼房结果");
            var list=eval(data.obj);
            addBuildingTable(list);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}

//更新楼宇
function updatebuliding(){
    $('#buildingupdatemodal').modal('hide');
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!updateBuilding.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {
            "token": sessionStorage.getItem("token"),
            "zonecode": sessionStorage.getItem("zoneCode"),
            "building.id": $("#building_update").attr("buildingid"),
            "building.code": $("#building_update").attr("buildingcode"),
            "building.name": $("#buldingname").val(),
            "building.unitNum": $("#unitname").val()
        },
        dataType: "json",
        success: function (data) {
            console.log("删除房屋");
            queryBuildingJump(sessionStorage.getItem("zoneCode"));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}

/**
 * 删除楼宇
 * */
function deletebuilding(buildingcode){
    console.log("删除楼宇");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!del.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {"token":sessionStorage.getItem("token"),
            "building.code":buildingcode
        },
        dataType: "json",
        success: function (data) {
            console.log("删除楼宇");
            mymodalhide();
            msgTips(data.msg);
            queryBuildingJump(sessionStorage.getItem("zoneCode"));
        }
    });
}



/**
 * 查询单元信息
 */
function queryUnitJump(buildingCode){
    unitshow();
    sessionStorage.setItem("buildingCode",buildingCode);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryUnit.action",
        data: {
            "token":sessionStorage.getItem("token"),
            "buildingcode":buildingCode},
        dataType: "json",
        success: function (data) {
            console.log("查询的第一页单元信息10条：");
            var list=eval(data.obj);
            addUnitTable(list);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}


//更新单元信息
function updateunit1(){
    $('#unitupdatemodal').modal('hide');
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!updateUnit.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {
            "token": sessionStorage.getItem("token"),
            "unit.id": $("#unit_update").attr("unitid"),
            "unit.code": $("#unit_update").attr("unitcode"),
            "unit.name": $("#unitname1").val(),
            "unit.topfloor": $("#unitfloors").val(),
            "unit.roomNum": $("#unithomenum").val()
        },
        dataType: "json",
        success: function (data) {
            console.log("更新单元");
            queryUnitJump(sessionStorage.getItem("buildingCode"));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}


//删除单元
function deleteunit(unitCode){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!delUnit.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {"token":sessionStorage.getItem("token"),
            "unit.code":unitCode
        },
        dataType: "json",
        success: function (data) {
            console.log("删除单元");
            mymodalhide();
            queryUnitJump(sessionStorage.getItem("buildingCode"));
        }
    });
}


//查询房屋信息
function queryHomeListJump(unitcode) {
    console.log("查询房屋");
    homelistshow();//显示房屋的div，隐藏其余div
    sessionStorage.removeItem('homecode');
    sessionStorage.setItem('unitCode',unitcode);

    var url="/ucotSmart/homeAction!homeListPageByPama.action";
    var data="unitcode="+unitcode;
    var pageid="homelist_pagination";
    var fnName="addHomeTable";
    queryListByParams(url,data,pageid,fnName);


    //queryHomeListByParams("");//根据单元号查询房屋列表
}

//点击进行条件查询
function queryHomeListparam(){
    //queryHomeListByParams(tranFormHomecode($('#homelist-keyword').val()));
    //url,data,tipdom,pagedom,pageid,fnName
    var url="/ucotSmart/homeAction!homeListPageByPama.action";
    var data="&unitcode="+sessionStorage.getItem("unitCode")+ "&home.code='"+tranFormHomecode($('#homelist-keyword').val())+"'";
    var pageid="homelist_pagination";
    var fnName="addHomeTable";
    queryListByParams(url,data,pageid,fnName);
}

//添加房屋//homeAction!addSpecialHome.action
function commithomeadd(){
    var data=$("#home-form-add").serialize();//序列化乱码
    data = decodeURIComponent(data,true);//进行解码，得到要提交的数据
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeAction!addSpecialHome.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: data+"&token="+sessionStorage.getItem("token"),
        dataType: "json",
        success: function (data) {
            console.log("更新房屋");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}


//房屋修改homeAction!update.action
function commithomeupdate(){
    var data=$("#home-form-update").serialize();//序列化乱码
    data = decodeURIComponent(data,true);//进行解码，得到要提交的数据
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeAction!update.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: data+"&token="+sessionStorage.getItem("token"),
        dataType: "json",
        success: function (data) {
            console.log("更新房屋");
            back();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
}


//导入房屋
function importHomeList(){
    $('#home_list_import').modal('hide');
    var formData = new FormData($('#home_list_upload_form')[0]);
    $.ajax({
        type:'post',
        data:formData,
        url:zoneServerIp+'/ucotSmart/excelAction!pullHomefromExcel.action?token='+permit,
        async:false,
        cache: false,
        processData: false,
        contentType: false,
        dataType:'json',//返回数据类型
        success: function (data) {
            queryHomeListByParams(tranFormHomecode($('#homelist-keyword').val()));
            msgTips("导入成功");
        }
    });
}


//导出房屋信息
function exportHomelist(){
    var form = $("<form>");
    console.log(form);
    form.attr('style', 'display:none');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+"/ucotSmart/excelAction!getHomeFormExcel.action");
    var input = $('<input>');
    input.attr('type', 'hidden');
    input.attr('name', 'token');
    input.attr('value', sessionStorage.getItem('token'));
    $('body').append(form);
    form.append(input);
    form.submit();
    form.remove();
}

//删除房间
function deletehome(homeid){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeAction!del.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {
            "token":sessionStorage.getItem("token"),
            "home.id":homeid},
        dataType: "json",
        success: function (data) {
            console.log("删除房屋");
            $('#mymodal').modal('hide');
            queryHomeListJump(sessionStorage.getItem('unitCode'));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
    //删除完之后

}


//批量删除房间信息
function deletehomes(){
    var ids="";
    $('input[name="homecheack"]:checked').each(function(){
        ids+=$(this).attr('homeid')+",";
    });
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeAction!delBybatch.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {
            "token":sessionStorage.getItem("token"),
            "idList":ids},
        dataType: "json",
        success: function (data) {
            console.log("删除房屋");
            $('#mymodal').modal('hide');
            queryHomeListJump(sessionStorage.getItem('unitCode'));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败！");
        }
    });
    //删除完之后

}


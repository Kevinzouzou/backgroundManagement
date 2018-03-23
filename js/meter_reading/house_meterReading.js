/**
 *Created by along on 2017/11/30 业户抄表
 */
//--加载初始方法--
$("a[href='#tab_house_meterReading']").click(function (){
    //水表
    menuAddress("HsMtWaterAds");
    menuAddress("publicAreaAdsModal");
    HsMtInquire("HsMtWater");
});
// 数据加载
function HoMeReInitialize(deviceType){
    switch (deviceType){
        case "water":
            menuAddress("HsMtWaterAds");
            HsMtInquire("HsMtWater");
            break;
        case "electricity":
            menuAddress("HsMtEtyAds");
            HsMtInquire("HsMtEty");
            break;
        case "fuelGas":
            menuAddress("HsMtFuelAds");
            HsMtInquire("HsMtFuel");
            break;
        case "heat":
            menuAddress("HsMtHeatAds");
            HsMtInquire("HsMtHeat");
            break;
        case "cold":
            menuAddress("HsMtColdAds");
            HsMtInquire("HsMtCold");
            break;
    };
};
// 查询方法
function HsMtInquire(type,page,typePaging){
    let ajaxURL;
    switch (type){
        case "HsMtWater":ajaxURL="/ucotSmart/";
            break;
        case "HsMtEty":ajaxURL="/ucotSmart/";
            break;
        case "HsMtFuel":ajaxURL="/ucotSmart/";
            break;
        case "HsMtHeat":ajaxURL="/ucotSmart/";
            break;
        case "HsMtCold":ajaxURL="/ucotSmart/";
            break;
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxURL,
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "code":ownercode,
            "createtime":createtime
        },
        success: function (data) {
            console.log("查询家电");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_equipment_electric .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_equipment_electric .pagingImplement .pageList").hide();
                $("#equipmentElectricList").html("<p>暂无数据</p>");
                $("#tab_equipment_electric .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!typePaging||typePaging!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_equipment_electric",{"functions":"equElectric(homelistPage,'paging')"});
                };
                let htmlList='',lth=20,jsonExl=[];
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        let adscode=obj[i].code;
                        let address;
                        if(adscode){
                            address=adsText(adscode);
                        }else{
                            address="";
                        }
                        let liston={
                            "房屋地址":address,
                            "设备名称":obj[i].name,
                            "设备位置":obj[i].rname
                        };
                        jsonExl.push(liston);
                        htmlList+='<tr>';
                        htmlList+='<td>'+address+'</td>';
                        htmlList+='<td>'+obj[i].name+'</td>';
                        htmlList+='<td>'+obj[i].rname+'</td>';
                        htmlList+='<td><span id="'+obj[i].id+'" homemac="'+obj[i].homemac+'" class="blue details" >详情</span></td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#equipmentElectricList").html(htmlList);
                wipeNull("equipmentElectricList");
                localStorage.jsonExl=JSON.stringify(jsonExl);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
// 添加
function addHsMt(ajaxURL){
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxURL,
        dataType: "json",
        data: {
            "token":permit,
            "code":ownercode,
            "name":name,
            "number":number,
            "protocol":protocol
        },
        success: function (data) {
            console.log("");
            console.log(data);
            //    数据
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
// 修改
function modifyHsMt(ajaxURL,ids){
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxURL,
        dataType: "json",
        data: {
            "token":permit,
            "code":ownercode,
            "name":name,
            "number":number,
            "ids":ids,
            "protocol":protocol
        },
        success: function (data) {
            console.log("");
            console.log(data);
            //    数据
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
// 添加触发显示modal
$("#tab_house_meterReading .addHsMt").click(function(){
    let title,type=$(this).attr("type");
    switch (type){
        case "HsMtWater":title="添加水表";
            break;
        case "HsMtEty":title="添加电表";
            break;
        case "HsMtFuel":title="添加燃气表";
            break;
        case "HsMtHeat":title="添加热量表";
            break;
        case "HsMtCold":title="添加冷量表";
            break;
    };
    $("#addHouseMRModal .modal-title").text(title);
    $("#addHouseMRModal #houseMRModalBut").attr({"type":"add","typeHsMt":type}).text("添加");
    $("#addHouseMRModal").modal("show");
});
// 修改触发显示modal
$("#tab_house_meterReading .modifyBut").click(function(){
    let title,type=$(this).attr("type");
    switch (type){
        case "HsMtWater":title="修改水表";
            break;
        case "HsMtEty":title="修改电表";
            break;
        case "HsMtFuel":title="修改燃气表";
            break;
        case "HsMtHeat":title="修改热量表";
            break;
        case "HsMtCold":title="修改冷量表";
            break;
    };
    $("#addHouseMRModal .modal-title").text(title);
    $("#addHouseMRModal #houseMRModalBut").attr({"type":"modify","typeHsMt":type}).text("修改");
    $("#addHouseMRModal").modal("show");
});
// 提交数据
$("#houseMRModalBut").click(function(){
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let typeHsMt=$(this).attr("typeHsMt");
    let ajaxURL;
    if(type=="add"){
        switch (typeHsMt){
            case "HsMtWater":ajaxURL="/ucotSmart/";
                break;
            case "HsMtEty":ajaxURL="/ucotSmart/";
                break;
            case "HsMtFuel":ajaxURL="/ucotSmart/";
                break;
            case "HsMtHeat":ajaxURL="/ucotSmart/";
                break;
            case "HsMtCold":ajaxURL="/ucotSmart/";
                break;
        };
        addHsMt(ajaxURL);
    }else if(type=="modify"){
        switch (typeHsMt){
            case "HsMtWater":ajaxURL="/ucotSmart/";
                break;
            case "HsMtEty":ajaxURL="/ucotSmart/";
                break;
            case "HsMtFuel":ajaxURL="/ucotSmart/";
                break;
            case "HsMtHeat":ajaxURL="/ucotSmart/";
                break;
            case "HsMtCold":ajaxURL="/ucotSmart/";
                break;
        };
        modifyHsMt(ajaxURL,ids)
    };
    $("#addHouseMRModal").modal("hide");
});
// 删除触发显示modal
$("#tab_house_meterReading .deleteBut").click(function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    let callBack,ajaxURL,dataObj={"token":permit,"idList":ids};
    switch (type){
        case "HsMtWater":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtEty":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtFuel":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtHeat":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtCold":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
    };
    deletePubModal(dataObj,callBack,ajaxURL);
});
// 查看抄表时间
$("#tab_house_meterReading .meterReadTime").click(function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    let ajaxURL,dataObj={"token":permit,"idList":ids};
    switch (type){
        case "HsMtWater":
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtEty":
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtFuel":
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtHeat":
            ajaxURL="/ucotSmart/";
            break;
        case "HsMtCold":
            ajaxURL="/ucotSmart/";
            break;
    };
    meterReadTime(dataObj,ajaxURL);
});
function meterReadTime(dataObj,ajaxURL){
    $("#meterReadTimeModal").modal("show");
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxURL,
        dataType: "json",
        data:dataObj,
        success: function (data) {
            if(data.msg==true){

            }else{

            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
// 条件搜索
$("#tab_house_meterReading .btnSearch").click(function(){
    //条件搜索
    let type=$(this).attr("type");
    switch (type){
        case "HsMtWater":
            break;
        case "HsMtEty":
            break;
        case "HsMtFuel":
            break;
        case "HsMtHeat":
            break;
        case "HsMtCold":
            break;
    };
});
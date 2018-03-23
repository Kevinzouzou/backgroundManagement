/**
 *Created by along on 2017/11/30 抄表设置
 */
//--加载初始方法--
$("a[href='#tab_automatic_meterReading'],a[href='#tab_set_meterReading']").click(function (){
    setTimeout(function(){$(".set_meterReading").addClass("active");},200);
    //水表
    // menuAddress("SetWaterAds");
    // menuAddress("publicAreaAdsModal");
    SetInquire("SetWater");
});
// 数据加载
function setMeterInitialize(deviceType){
    switch (deviceType){
        case "water":
            menuAddress("SetWaterAds");
            SetInquire("SetWater");
            break;
        case "electricity":
            menuAddress("SetEtyAds");
            SetInquire("SetEty");
            break;
        case "fuelGas":
            menuAddress("SetFuelAds");
            SetInquire("SetFuel");
            break;
        case "heat":
            menuAddress("SetHeatAds");
            SetInquire("SetHeat");
            break;
        case "cold":
            menuAddress("SetColdAds");
            SetInquire("SetCold");
            break;
    };
};
// 查询方法
function SetInquire(type,page,typePaging){
    let ajaxURL;
    switch (type){
        case "SetWater":ajaxURL="/ucotSmart/";
            break;
        case "SetEty":ajaxURL="/ucotSmart/";
            break;
        case "SetFuel":ajaxURL="/ucotSmart/";
            break;
        case "SetHeat":ajaxURL="/ucotSmart/";
            break;
        case "SetCold":ajaxURL="/ucotSmart/";
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
function addSet(ajaxURL){
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
function modifySet(ajaxURL,ids){
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
$("#tab_set_meterReading .addSet").click(function(){
    let title,type=$(this).attr("type");
    switch (type){
        case "SetWater":title="添加水表";
            break;
        case "SetEty":title="添加电表";
            break;
        case "SetFuel":title="添加燃气表";
            break;
        case "SetHeat":title="添加热量表";
            break;
        case "SetCold":title="添加冷量表";
            break;
    };
    $("#addSetMeterModal .modal-title").text(title);
    $("#addSetMeterModal #setMeterModalBut").attr({"type":"add","typeSet":type}).text("添加");
    $("#addSetMeterModal").modal("show");
});
// 修改触发显示modal
$("#tab_set_meterReading .modifyBut").click(function(){
    let title,type=$(this).attr("type");
    switch (type){
        case "SetWater":title="修改水表";
            break;
        case "SetEty":title="修改电表";
            break;
        case "SetFuel":title="修改燃气表";
            break;
        case "SetHeat":title="修改热量表";
            break;
        case "SetCold":title="修改冷量表";
            break;
    };
    $("#addSetMeterModal .modal-title").text(title);
    $("#addSetMeterModal #setMeterModalBut").attr({"type":"modify","typeSet":type}).text("修改");
    $("#addSetMeterModal").modal("show");
});
// 提交数据
$("#setMeterModalBut").click(function(){
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let typeSet=$(this).attr("typeSet");
    let ajaxURL;
    if(type=="add"){
        switch (typeSet){
            case "SetWater":ajaxURL="/ucotSmart/";
                break;
            case "SetEty":ajaxURL="/ucotSmart/";
                break;
            case "SetFuel":ajaxURL="/ucotSmart/";
                break;
            case "SetHeat":ajaxURL="/ucotSmart/";
                break;
            case "SetCold":ajaxURL="/ucotSmart/";
                break;
        };
        addSet(ajaxURL);
    }else if(type=="modify"){
        switch (typeSet){
            case "SetWater":ajaxURL="/ucotSmart/";
                break;
            case "SetEty":ajaxURL="/ucotSmart/";
                break;
            case "SetFuel":ajaxURL="/ucotSmart/";
                break;
            case "SetHeat":ajaxURL="/ucotSmart/";
                break;
            case "SetCold":ajaxURL="/ucotSmart/";
                break;
        };
        modifySet(ajaxURL,ids)
    };
    $("#addSetMeterModal").modal("hide");
});
// 删除触发显示modal
$("#tab_set_meterReading .deleteBut").click(function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    let callBack,ajaxURL,dataObj={"token":permit,"idList":ids};
    switch (type){
        case "SetWater":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "SetEty":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "SetFuel":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "SetHeat":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "SetCold":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
    };
    deletePubModal(dataObj,callBack,ajaxURL);
});
// 查看抄表时间
// $("#tab_set_meterReading .meterReadTime").click(function(){
//     let type=$(this).attr("type");
//     let ids=$(this).attr("ids");
//     let ajaxURL,dataObj={"token":permit,"idList":ids};
//     switch (type){
//         case "SetWater":
//             ajaxURL="/ucotSmart/";
//             break;
//         case "SetEty":
//             ajaxURL="/ucotSmart/";
//             break;
//         case "SetFuel":
//             ajaxURL="/ucotSmart/";
//             break;
//         case "SetHeat":
//             ajaxURL="/ucotSmart/";
//             break;
//         case "SetCold":
//             ajaxURL="/ucotSmart/";
//             break;
//     };
//     meterReadTime(dataObj,ajaxURL);
// });
// function meterReadTime(dataObj,ajaxURL){
//     $("#meterReadTimeModal").modal("show");
//     $.ajax({
//         type: "post",
//         url: zoneServerIp+ajaxURL,
//         dataType: "json",
//         data:dataObj,
//         success: function (data) {
//             if(data.msg==true){
//
//             }else{
//
//             };
//         },
//         error: function (data, status) {
//             //msgTips("");
//         }
//     });
// };
// 条件搜索
// $("#tab_set_meterReading .btnSearch").click(function(){
//     //条件搜索
//     let type=$(this).attr("type");
//     switch (type){
//         case "SetWater":
//             break;
//         case "SetEty":
//             break;
//         case "SetFuel":
//             break;
//         case "SetHeat":
//             break;
//         case "SetCold":
//             break;
//     };
// });
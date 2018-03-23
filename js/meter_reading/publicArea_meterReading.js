/**
 *Created by along on 2017/11/30 公区抄表
 */
//--加载初始方法--
$("a[href='#tab_publicArea_meterReading']").click(function (){
    //水表
    menuAddress("PcArWaterAds");
    menuAddress("publicAreaAdsModal");
    PcArInquire("PcArWater");
});
// 数据加载
function PcArInitialize(deviceType){
    switch (deviceType){
        case "water":
            menuAddress("PcArWaterAds");
            PcArInquire("PcArWater");
            break;
        case "electricity":
            menuAddress("PcArEtyAds");
            PcArInquire("PcArEty");
            break;
        case "fuelGas":
            menuAddress("PcArFuelAds");
            PcArInquire("PcArFuel");
            break;
        case "heat":
            menuAddress("PcArHeatAds");
            PcArInquire("PcArHeat");
            break;
        case "cold":
            menuAddress("PcArColdAds");
            PcArInquire("PcArCold");
            break;
    };
};
// 查询方法
function PcArInquire(type,page,typePaging){
    let ajaxURL;
    switch (type){
        case "PcArWater":ajaxURL="/ucotSmart/";
            break;
        case "PcArEty":ajaxURL="/ucotSmart/";
            break;
        case "PcArFuel":ajaxURL="/ucotSmart/";
            break;
        case "PcArHeat":ajaxURL="/ucotSmart/";
            break;
        case "PcArCold":ajaxURL="/ucotSmart/";
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
function addPcAr(ajaxURL){
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
function modifyPcAr(ajaxURL,ids){
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
$("#tab_publicArea_meterReading .addPcAr").click(function(){
    let title,type=$(this).attr("type");
    switch (type){
        case "PcArWater":title="添加水表";
            break;
        case "PcArEty":title="添加电表";
            break;
        case "PcArFuel":title="添加燃气表";
            break;
        case "PcArHeat":title="添加热量表";
            break;
        case "PcArCold":title="添加冷量表";
            break;
    };
    $("#addPublicAreaModal .modal-title").text(title);
    $("#addPublicAreaModal #publicAreaModalBut").attr({"type":"add","typePcAr":type}).text("添加");
    $("#addPublicAreaModal").modal("show");
});
// 修改触发显示modal
$("#tab_publicArea_meterReading .modifyBut").click(function(){
    let title,type=$(this).attr("type");
    switch (type){
        case "PcArWater":title="修改水表";
            break;
        case "PcArEty":title="修改电表";
            break;
        case "PcArFuel":title="修改燃气表";
            break;
        case "PcArHeat":title="修改热量表";
            break;
        case "PcArCold":title="修改冷量表";
            break;
    };
    $("#addPublicAreaModal .modal-title").text(title);
    $("#addPublicAreaModal #publicAreaModalBut").attr({"type":"modify","typePcAr":type}).text("修改");
    $("#addPublicAreaModal").modal("show");
});
// 提交数据
$("#publicAreaModalBut").click(function(){
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let typePcAr=$(this).attr("typePcAr");
    let ajaxURL;
    if(type=="add"){
        switch (typePcAr){
            case "PcArWater":ajaxURL="/ucotSmart/";
                break;
            case "PcArEty":ajaxURL="/ucotSmart/";
                break;
            case "PcArFuel":ajaxURL="/ucotSmart/";
                break;
            case "PcArHeat":ajaxURL="/ucotSmart/";
                break;
            case "PcArCold":ajaxURL="/ucotSmart/";
                break;
        };
        addPcAr(ajaxURL);
    }else if(type=="modify"){
        switch (typePcAr){
            case "PcArWater":ajaxURL="/ucotSmart/";
                break;
            case "PcArEty":ajaxURL="/ucotSmart/";
                break;
            case "PcArFuel":ajaxURL="/ucotSmart/";
                break;
            case "PcArHeat":ajaxURL="/ucotSmart/";
                break;
            case "PcArCold":ajaxURL="/ucotSmart/";
                break;
        };
        modifyPcAr(ajaxURL,ids)
    };
    $("#addPublicAreaModal").modal("hide");
});
// 删除触发显示modal
$("#tab_publicArea_meterReading .deleteBut").click(function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    let callBack,ajaxURL,dataObj={"token":permit,"idList":ids};
    switch (type){
        case "PcArWater":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "PcArEty":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "PcArFuel":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "PcArHeat":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
        case "PcArCold":
            callBack="alarmArea()";
            ajaxURL="/ucotSmart/";
            break;
    };
    deletePubModal(dataObj,callBack,ajaxURL);
});
// 查看抄表时间
$("#tab_publicArea_meterReading .meterReadTime").click(function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    let ajaxURL,dataObj={"token":permit,"idList":ids};
    switch (type){
        case "PcArWater":
            ajaxURL="/ucotSmart/";
            break;
        case "PcArEty":
            ajaxURL="/ucotSmart/";
            break;
        case "PcArFuel":
            ajaxURL="/ucotSmart/";
            break;
        case "PcArHeat":
            ajaxURL="/ucotSmart/";
            break;
        case "PcArCold":
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
$("#tab_publicArea_meterReading .btnSearch").click(function(){
    //条件搜索
    let type=$(this).attr("type");
    switch (type){
        case "PcArWater":
            break;
        case "PcArEty":
            break;
        case "PcArFuel":
            break;
        case "PcArHeat":
            break;
        case "PcArCold":
            break;
    };
});
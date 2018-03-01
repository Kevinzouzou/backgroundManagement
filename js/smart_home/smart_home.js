/**
 * Created by along on 2017/12/27. 设备状态
 */
//deviceType查询类型（家电electric、报警alertor、app账户appAccount 重要条件参数！）
//--加载初始方法--
function equipmentInitialize(deviceType){
    pageDataDevice(deviceType);
};
$("a[href='#smart_home_menu'],a[href='#tab_device_state']").click(function (){
    //查询家电
    setTimeout(function(){$(".device_state").addClass("active");},200);
    pageDataDevice("electric");
});
$("#manualLogoutA").click(function (){
    //查询app账户
    pageDataDevice("appAccount");
});
//--查询方法--
function pageDataDevice(deviceType){
    $("#"+deviceType+"Address .btnSearch").removeAttr("ownercode time0 time1");
    if(deviceType=="electric"){
        menuAddress("electricAddress");
        equElectric();
    }else if(deviceType=="alertor"){
        menuAddress("alertorAddress");
        equAlertor();
    }else if(deviceType=="appAccount"){
        menuAddress("appAccountAddress");
        appLogout();
    };
};
function equElectric(page,type){
    //查询家电
    let ownercode=$("#electricAddress .btnSearch").attr("ownercode");
    if(!ownercode){
        ownercode="";
        emptySearchCondition("electricAddress");
    };
    let createtime=$("#electricTime").val();
    if(!createtime){createtime=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeAppliancesAction!findHomeAppliances.action",
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
                if(!type||type!="paging"){
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
function equDetails(id,homemac){
    let createtime=$("#electricTime").val();
    if(!createtime){createtime=""};
    //家电详情
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeAppliancesAction!findHestatusById.action",
        dataType: "json",
        data: {
            "token":permit,
            "havo.id_1":id,
            "havo.homemac":homemac,
            "createtime":createtime
        },
        success: function (data) {
            console.log("家电详情");
            console.log(data);
            //    数据
            var obj=data.obj;
            if(data.obj){
                let data=obj[0].modifiedtime.substr(0,10);
                let htmlList='<ul class="list-unstyled clearfix large-half"><li class="totalLength">日期：'+data+'</li> ';
                for(let i=0;i<obj.length;i++){
                        let time=obj[i].modifiedtime.substr(11,8);
                        let status=obj[i].status;
                        switch (status){
                        case "0":status="开启";
                            break;
                        case "1":status="关闭";
                            break;
                        case "2":status="停止";
                            break;
                    };
                        htmlList+='<li><span>'+time+'</span><span>设备状态 : '+status+'</span></li> ';
                };
                htmlList+='</ul> ';
                $("#equDetailsForm").html(htmlList);
                wipeNull("equDetailsForm");
                $("#equDetailsModal").modal("show");
            }else{
                msgTips(data.msg);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function equAlertor(page,type){
    //查询报警
    let ownercode=$("#alertorAddress .btnSearch").attr("ownercode");
    if(!ownercode){
        ownercode="";
        emptySearchCondition("alertorAddress");
    };
    let starttime=$("#alertorStartTime").val();
    if(!starttime){starttime=""};
    let endtime=$("#alertorEndTime").val();
    if(!endtime){endtime=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeWarningAction!findHomeWarning.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "code":ownercode,
            "starttime":starttime,
            "endtime":endtime
        },
        success: function (data) {
            console.log("查询报警");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_equipment_alertor .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_equipment_alertor .pagingImplement .pageList").hide();
                $("#equipmentAlertorList").html("<p>暂无数据</p>");
                $("#tab_equipment_alertor .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_equipment_alertor",{"functions":"equAlertor(homelistPage,'paging')"});
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
                        let warninglevel=obj[i].warninglevel,warninglevelCor="";

                        switch (warninglevel){
                            case 0:warninglevel="一般";
                                break;
                            case 1:warninglevel="紧急";
                                warninglevelCor="#f19149";
                                break;
                            case 2:warninglevel="严重";
                                warninglevelCor="#ff0000";
                                break;
                            default:
                                warninglevel="一般";
                        };
                        let status=obj[i].status,statusCor="";
                        switch (status){
                            case 0:status="未响应";
                                statusCor="red";
                                break;
                            case 1:status="已响应";
                                break;
                            default:
                                status="";
                        };
                        let liston={
                            "设备类型":obj[i].policename,
                            "报警地址":address,
                            "报警位置":obj[i].name,
                            "报警内容":obj[i].content,
                            "报警级别":status,
                            "报警时间":obj[i].starttime,
                            "响应状态":warninglevel,
                            "响应时间":obj[i].endtime
                        };
                        jsonExl.push(liston);
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].policename+'</td>';
                        htmlList+='<td>'+address+'</td>';
                        htmlList+='<td>'+obj[i].name+'</td>';
                        htmlList+='<td>'+obj[i].content+'</td>';
                        htmlList+='<td style="color:'+statusCor+'">'+status+'</td>';
                        htmlList+='<td>'+obj[i].starttime+'</td>';
                        htmlList+='<td style="color:'+warninglevelCor+'">'+warninglevel+'</td>';
                        htmlList+='<td>'+obj[i].endtime+'</td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#equipmentAlertorList").html(htmlList);
                wipeNull("equipmentAlertorList");
                localStorage.jsonExl=JSON.stringify(jsonExl);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function appLogout(page,type){
    //查询app账户
    let ownercode=$("#appAccountAddress .btnSearch").attr("ownercode");
    if(!ownercode){
        ownercode="";
        emptySearchCondition("appAccountAddress");
    };
    let zonecode=permit.substr(permit.indexOf("d")-6,7);
    if(!zonecode){zonecode=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/appAccountCancelAction!findAppAccountVo.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "code":ownercode,
            "zonecode":zonecode
        },
        success: function (data) {
            console.log("查询app账户");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_manual_logout .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_manual_logout .pagingImplement .pageList").hide();
                $("#logoutList").html("<p>暂无数据</p>");
                $("#tab_manual_logout .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_manual_logout",{"functions":"appLogout(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        let adscode=obj[i].code;
                        let address=adsText(adscode);
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].name+'</td>';
                        htmlList+='<td>'+obj[i].cellphone+'</td>';
                        htmlList+='<td>'+address+'</td>';
                        htmlList+='<td>'+obj[i].type+'</td>';
                        htmlList+='<td><span cellphone="'+obj[i].cellphone+'" class="blue logoutBut" >注销</span></td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#logoutList").html(htmlList);
                wipeNull("logoutList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//--家电状态详情--
$("#equipmentElectricList").on("click",".details",function(){
    let id=$(this).attr("id");
    let homemac=$(this).attr("homemac");
    equDetails(id,homemac);
});
//--app账户注销--
$("#tab_smart_home").on("click",".logoutBut",function(){
    let cellphone=$(this).attr("cellphone");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/appAccountCancelAction!cancelAppAccount.action",
        dataType: "json",
        data: {
            "token":permit,
            "cellphone":cellphone
        },
        success: function (data) {
            console.log("app账户注销");
            console.log(data);
            //    数据
            if(data.success==true){
                let ownercode=$("#appAccountMenu .btnSearch").attr("ownercode");
                if(!ownercode){ownercode=""}
                appLogout(ownercode);
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//--条件搜索--
$("#tab_smart_home").on("click",".btnSearch",function(){
    //条件搜索
    let prefixId=$(this).attr("ids");
    if(prefixId=="electricAddress"){
        ownercodeGetSelected(prefixId)
        equElectric();//查询家电
    }else if(prefixId=="alertorAddress"){
        ownercodeGetSelected(prefixId)
        equAlertor();//查询报警
    }else if(prefixId=="appAccountAddress"){
        ownercodeGetSelected(prefixId)
        appLogout()//查询app账户
    };
});
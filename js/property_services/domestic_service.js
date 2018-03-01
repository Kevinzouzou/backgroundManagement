/**
 * Created by along on 2017/11/01 家政服务
 */
//inquireType查询类型（公司company/服务serve 重要条件参数！）
//加载初始方法
$("a[href='#tab_domestic_service']").click(function(){
    domesticInitialize("company");
    plugTime();
});
function domesticInitialize(inquireType){
    if(inquireType=="serve"){
        //推送列表
        pushData();
    };
    pageDataHousekeeping(inquireType);
};
// var inquireType="company";
//切换下拉列表类型文字
function modifyType(optionid,prefixId){
    let modifyText="";
    switch (optionid){
        case "1":
            modifyText="搬运";
            break;
        case "2":
            modifyText="保洁";
            break;
        case "3":
            modifyText="疏通";
            break;
        case "4":
            modifyText="清洗";
            break;
        case "5":
            modifyText="安装维修";
            break;
        case "6":
            modifyText="防水补漏";
            break;
    };
    $("#"+prefixId+" a.dropdown-toggle span").text(modifyText);
};
//表单验证
function formVerifyHousekeeping(prefixId){
    let objInput="";
    if(prefixId=="housekeepingCompanyForm"){
        let idList=$("#"+prefixId).attr("idList");
        let optionid=$("#"+prefixId).parents(".modal-body").attr("optionid");
        let company_name=$("#"+prefixId+" .company_name").val();
        let company_address=$("#"+prefixId+" .company_address").val();
        let company_contacts=$("#"+prefixId+" .company_contacts").val();
        let company_tel=$("#"+prefixId+" .company_tel").val();
        let company_web=$("#"+prefixId+" .company_web").val().replace(/(\s*)/g,'');
        let company_wx=$("#"+prefixId+" .company_wx").val();
        objInput={"idList":idList,"optionid":optionid,"company_name":company_name,"company_address":company_address,"company_contacts":company_contacts,"company_tel":company_tel,"company_web":company_web,"company_wx":company_wx};
        if(!company_name){
            msgTips("请填写公司名称");
            return;
        };
        if(!company_address){
            msgTips("请填写公司地址");
            return;
        };
        if(!company_contacts){
            msgTips("请填写公司联系人");
            return;
        };
        if(!company_tel||company_tel.length<7){
            msgTips("电话格式错误");
            return;
        };
    }else if(prefixId=="housekeepingServeForm"){
        let idList=$("#"+prefixId).attr("idList");
        let optionid=$("#"+prefixId).parents(".modal-body").attr("optionid");
        let serve_ids=$("#"+prefixId).attr("ids");
        let serve_roomcode=$("#"+prefixId+" #serve_roomcode .doorplateAds").attr("optionid");
        let serve_phone=$("#"+prefixId+" .serve_phone").val();
        let serve_createtime=$("#"+prefixId+" .serve_createtime").val();
        let serve_content=$("#"+prefixId+" .serve_content").val().replace(/(\s*)/g,'');
        objInput={"idList":idList,"optionid":optionid,"serve_ids":serve_ids,"serve_roomcode":serve_roomcode,"serve_phone":serve_phone,"serve_createtime":serve_createtime,"serve_content":serve_content};
        if(!serve_roomcode){
            msgTips("请选择户主信息");
            return;
        };
        if(!serve_phone){
            msgTips("请填写联系电话");
            return;
        };
        if(!serve_createtime){
            msgTips("请选择服务时间");
            return;
        };
        if(!serve_content){
            msgTips("请填写服务内容");
            return;
        };
    }
    return objInput;
};
//回显
function echoEchoHousekeeping(prefixId,this_){
    //回显
    if(prefixId=="housekeepingCompanyForm"){
        $("#"+prefixId+" .company_name").val($(this_).parents("tr").find("td").eq(0).text());
        $("#"+prefixId+" .company_address").val($(this_).parents("tr").find("td").eq(1).text());
        $("#"+prefixId+" .company_contacts").val($(this_).parents("tr").find("td").eq(2).text());
        $("#"+prefixId+" .company_tel").val($(this_).parents("tr").find("td").eq(3).text());
        $("#"+prefixId+" .company_web").val($(this_).parents("tr").find("td").eq(4).attr("content"));
        $("#"+prefixId+" .company_wx").val($(this_).parents("tr").find("td").eq(5).text());
    }else if(prefixId=="housekeepingServeForm"){
        let roomcode=$(this_).parents("tr").find("td").eq(0).attr("roomcode");//地址
        let indexD=roomcode.indexOf("d")+1;
        let lastOf2=roomcode.indexOf("b")+1;
        let lastOf3=roomcode.indexOf("u")+1;
        let addressText1=roomcode.substring(indexD,lastOf2).replace("p","期").replace("z","区").replace("b","栋");
        $("#"+prefixId+" .chargingAds a.dropdown-toggle span").text(addressText1);
        let addressText2=roomcode.substring(lastOf2,lastOf3).replace("u","单元");
        $("#"+prefixId+" .unitAds a.dropdown-toggle span").text(addressText2);
        let addressText3=roomcode.substring(lastOf3).replace("f","层").replace("h","室");
        $("#"+prefixId+" .doorplateAds").attr("optionid",roomcode);
        $("#"+prefixId+" .doorplateAds a.dropdown-toggle span").text(addressText3);
        $("#"+prefixId+" .serve_roomcode").val($(this_).parents("tr").find("td").eq(0).text());
        $("#"+prefixId+" .serve_phone").val($(this_).parents("tr").find("td").eq(1).text());
        $("#"+prefixId+" .serve_createtime").val($(this_).parents("tr").find("td").eq(2).text());
        $("#"+prefixId+" .serve_content").val($(this_).parents("tr").find("td").eq(3).attr("content"));
    }
};
//查询方法
function pageDataHousekeeping(inquireType){
    if(inquireType=="company"){
        housekepCompany();
    }else if(inquireType=="serve"){
        housekepServe();
    }
}
function housekepCompany(page,type){
    let optionId=$("#companyMenu .companyMenu").attr("optionid");
    optionId?"":optionId="1";
    $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/homemakingAction!findHomemaking.action",
            dataType: "json",
            data: {
                "token":permit,
                "pager.pages":page,
                "homemaking.type": optionId,
                "pager.pagesize":pageListSize
            },
            success: function (data) {
                // console.log("查询家公司:");
                // console.log(data);
                //    数据
                if(data.obj){
                    var obj=data.obj.data;
                    var pageList=data.obj.data.length;
                    var totalNum=data.obj.data_count;
                    $("#tab_housekeepingFirm .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
                };
                if(totalNum==0){
                    $("#tab_housekeepingFirm .pagingImplement .pageList").hide();
                    $("#companyList").html('<p>'+data.msg+'</p>');
                    $("#tab_housekeepingFirm .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
                }else if(obj){
                    if(!type||type!="paging"){
                        pagingPlugin(pageList,totalNum,"tab_housekeepingFirm",{"functions":"housekepCompany(homelistPage,'paging')"});
                    };
                    let htmlList='',lth=30;
                    for(let i=0;i<10;i++){
                        if(obj[i]) {
                            htmlList += '<tr id="' + obj[i].id + '">';
                            htmlList += '<td>' + obj[i].name + '</td>';
                            htmlList += '<td>' + obj[i].address + '</td>';
                            htmlList += '<td>' + obj[i].contacts + '</td>';
                            htmlList += '<td>' + obj[i].phone + '</td>';
                            if(obj[i].website.length>lth){
                                let positionsTex=obj[i].website.substring(0,lth);
                                htmlList+= '<td content="'+obj[i].website+'"><span>'+positionsTex+'...'+'</span><span class="blue" onclick=previewModal("关联网址","'+obj[i].website+'")>详细</span></td>';
                            }else{
                                htmlList += '<td content="'+obj[i].website+'">' + obj[i].website + '</td>';
                            }
                            htmlList += '<td>' + obj[i].wechat + '</td>';
                            htmlList += '<td><a class="modifyBut" ids="' + obj[i].id + '"  type="company">修改</a>| <a class="deleteBut" ids="' + obj[i].id + '" type="company">删除</a> </td>';
                            htmlList += '</tr>';
                        }else{
                            htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                        };
                    };
                    $("#companyList").html(htmlList);
                    wipeNull("companyList");
                };
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
}
function housekepServe(page,type){
    let optionId=$("#serveMenu .serveMenu").attr("optionid");
    optionId?"":optionId="1";
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homeserviceAction!findHomeservice.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "type":optionId,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            // console.log("查询家政服务:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=data.obj.data.length;
                var totalNum=data.obj.data_count;
                $("#tab_housekeepingService .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0||obj==null){
                $("#tab_housekeepingService .pagingImplement .pageList").hide();
                $("#serveList").html('<p>'+data.msg+'</p>');
                $("#tab_housekeepingService .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_housekeepingService",{"functions":"housekepServe(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        htmlList+='<tr>';
                        let codeList=obj[i].roomcode;
                        let firstAds=codeList.indexOf("d")+1;
                        let addressCode=codeList.substring(firstAds,codeList.length);
                        let addressText=addressCode.replace("p","期").replace("z","区").replace("b","栋").replace("u","单元").replace("f","层").replace("h","室");;
                        htmlList+='<td roomcode="'+obj[i].roomcode+'">'+addressText+'</td>';
                        htmlList+='<td>'+obj[i].phone+'</td>';
                        htmlList+= '<td>'+obj[i].createtime+'</td>';
                        if(obj[i].content.length>lth){
                            let contentTex=obj[i].content.substring(0,lth);
                            //htmlList+= '<td class="tooltips" content="'+obj[i].content+'"><span class="positions ellipsis">'+contentTex+'...'+'</span><div class="popover fade top in"><div class="arrow" style="left: 50%;"></div><div class="popover-content">'+obj[i].content+'</div></div></td>';
                            htmlList+= '<td content="'+obj[i].content+'"><span>'+contentTex+'...'+'</span><span class="blue" onclick=previewModal("服务类容","'+obj[i].content+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+obj[i].content+'">'+obj[i].content+'</td>';
                        }
                        htmlList+='<td><a class="pushBut" homemaking_ids="'+obj[i].homemaking_ids+'" ids="'+obj[i].id+'" type="'+obj[i].type+'">推送</a>| <a class="feedbackBut" forbidden="yes" ids="'+obj[i].id+'" type="'+obj[i].type+'">反馈</a>| <a class="modifyBut" homemaking_ids="'+obj[i].homemaking_ids+'" ids="'+obj[i].id+'"  type="serve">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="serve">删除</a> </td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#serveList").html(htmlList);
                wipeNull("serveList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
}
//添加
$(".addHousekeepingBut").click(function(){
    $("#housekeepingModal").modal("show");
    $("#housekeepingModal input,#housekeepingModal textarea").val("");//清空输入框
    $("#submitHousekeepingBut").attr("operation_type","add");
    let inquireType=$(this).attr("ids");
    if(inquireType=="company"){
        // console.log("添加公司模态框");
        $("#submitHousekeepingBut").attr("ids","company");
        let optionid=$("#companyMenu .companyMenu").attr("optionid");
        $("#housekeepingModal .modal-title").text("添加家政公司");
        $("#housekeepingModal .modal-body").attr("optionid",optionid);
        $("#housekeepingCompanyForm").show();
        $("#housekeepingServeForm").hide();
    }else if(inquireType=="serve"){
        // console.log("添加服务模态框");
        menuAddress("serve_roomcode");
        $("#submitHousekeepingBut").attr("ids","serve");
        let optionid=$("#serveMenu .serveMenu").attr("optionid");
        $("#housekeepingModal .modal-title").text("添加家政服务");
        $("#housekeepingModal .modal-body").attr("optionid",optionid);
        $("#serve_roomcode div").attr("optionid","");
        $("#serve_roomcode a.dropdown-toggle span").text("");
        $("#housekeepingCompanyForm").hide();
        $("#housekeepingServeForm").show();
    };
});
function addHousekeeping(inquireType){
    if(inquireType=="company"){
        let objParameter=formVerifyHousekeeping("housekeepingCompanyForm");
        // console.log(objParameter);
        //提交添加的公司数据
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/homemakingAction!addHomemaking.action",
            dataType: "json",
            data: {
                "token":permit,
                "homemaking.type":objParameter.optionid,
                "homemaking.name":objParameter.company_name,
                "homemaking.address":objParameter.company_address,
                "homemaking.contacts":objParameter.company_contacts,
                "homemaking.phone":objParameter.company_tel,
                "homemaking.website":objParameter.company_web,
                "homemaking.wechat":objParameter.company_wx
            },
            success: function (data) {
                // console.log("添加家政公司:");
                // console.log(data);
                //添加成功后的操作
                let success=data.success;
                if(success==true){
                    $("#companyList").find("p").remove();//删除无数据提示
                    housekepCompany();
                    $("#housekeepingModal").modal("hide");
                };
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    }else if(inquireType=="serve"){
        let objParameter=formVerifyHousekeeping("housekeepingServeForm");
        // console.log(objParameter);
        //提交添加的服务数据
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/homeserviceAction!addHomeservice.action",
            dataType: "json",
            data: {
                "token": permit,
                "homeservice.roomcode": objParameter.serve_roomcode,
                "homeservice.phone": objParameter.serve_phone,
                "homeservice.createtime":objParameter.serve_createtime,
                "homeservice.content": objParameter.serve_content,
                "homeservice.type": objParameter.optionid
            },
            success: function (data) {
                // console.log("添加家政服务:");
                // console.log(data);
                //添加成功后的操作
                let success=data.success;
                if(success==true){
                    $("#companyList").find("p").remove();//删除无数据提示
                    housekepServe();
                    $("#housekeepingModal").modal("hide");
                };
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    };
};
//修改
$("#tab_domestic_service").on("click",".modifyBut",function(){
    let this_=$(this);
    let inquireType=this_.attr("type");
     $("#housekeepingModal").modal("show");
    $("#housekeepingModal input,#housekeepingModal textarea").val("");//清空输入框;
    $("#housekeepingModal #submitHousekeepingBut").attr("operation_type","modify");
    if(inquireType=="company"){
        // console.log("修改公司");
        $("#submitHousekeepingBut").attr("ids","company");
        let optionid=$("#company-menu").attr("optionid");
        $("#housekeepingModal .modal-title").text("修改家政公司");
        $("#housekeepingModal .modal-body").attr("optionid",optionid);
        $("#housekeepingCompanyForm").show();
        $("#housekeepingServeForm").hide();
        optionid=$(this_).attr("type");
        let idList=$(this_).attr("ids");
        $("#housekeepingCompanyForm").attr("optionid",optionid).attr("idList",idList);
        echoEchoHousekeeping("housekeepingCompanyForm",this_);
    }else if(inquireType=="serve"){
        // console.log("修改服务");
        $("#submitHousekeepingBut").attr("ids","serve");
        let optionid=$("#serveMenu .serveMenu").attr("optionid");
        $("#housekeepingModal .modal-title").text("修改家政服务");
        $("#housekeepingModal .modal-body").attr("optionid",optionid);
        $("#serve_roomcode div").attr("optionid","");
        $("#serve_roomcode a.dropdown-toggle span").text("");
        $("#housekeepingCompanyForm").hide();
        $("#housekeepingServeForm").show();
        $("#serve_roomcode .dropdown-menu").empty();
        optionid=$(this_).attr("type");
        let idList=$(this_).attr("ids");
        let homemaking_ids=$(this_).attr("homemaking_ids");
        $("#housekeepingServeForm").attr("optionid",optionid).attr("idList",idList).attr("homemaking_ids",homemaking_ids);
        echoEchoHousekeeping("housekeepingServeForm",this_);
    };
});
function modifyHousekeeping(inquireType){
    if (inquireType == "company") {
        // console.log("提交修改公司");
        let objParameter = formVerifyHousekeeping("housekeepingCompanyForm");
        let optionid=objParameter.optionid;
        //提交修改的数据
        $.ajax({
            type: "post",
            url: zoneServerIp + "/ucotSmart/homemakingAction!updateHomemaking.action",
            dataType: "json",
            data: {
                "token": permit,
                "homemaking.id": objParameter.idList,
                "homemaking.type": optionid,
                "homemaking.name": objParameter.company_name,
                "homemaking.address": objParameter.company_address,
                "homemaking.contacts": objParameter.company_contacts,
                "homemaking.phone": objParameter.company_tel,
                "homemaking.website": objParameter.company_web,
                "homemaking.wechat": objParameter.company_wx
            },
            success: function (data) {
                // console.log(data);
                //修改成功后的操作
                let success = data.success;
                if (success == true) {
                    housekepCompany();
                    modifyType(optionid,"company-menu");
                    $("#housekeepingModal").modal("hide");
                }
                ;
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    } else if (inquireType == "serve") {
        // console.log("提交修改服务");
        let objParameter = formVerifyHousekeeping("housekeepingServeForm");
        let optionid=objParameter.optionid;
        //提交修改的数据
        $.ajax({
            type: "post",
            url: zoneServerIp + "/ucotSmart/homeserviceAction!updateHomeservice.action",
            dataType: "json",
            data: {
                "token": permit,
                "homeservice.id": objParameter.idList,
                "homeservice.type": optionid,
                "homeservice.homemaking_ids": objParameter.serve_ids,
                "homeservice.roomcode": objParameter.serve_roomcode,
                "homeservice.phone": objParameter.serve_phone,
                "homeservice.createtime":objParameter.serve_createtime,
                "homeservice.content": objParameter.serve_content
            },
            success: function (data) {
                // console.log(data);
                //修改成功后的操作
                let success = data.success;
                if (success == true) {
                    housekepServe();
                    modifyType(optionid,"serveMenu");
                    $("#housekeepingModal").modal("hide");
                }
                ;
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    };
};
//提交
$("#submitHousekeepingBut").click(function(){
    let operation_type=$(this).attr("operation_type");
    let inquireType=$(this).attr("ids");
    if(operation_type=="add"){
        addHousekeeping(inquireType);
    }else if(operation_type=="modify"){
        modifyHousekeeping(inquireType);
    };
});
//删除
$("#companyList,#serveList").on("click",".deleteBut",function(){
    $("#deletePubModal").modal("show");
    let ids,dataObj,callBack,ajaxURL;
    ids=$(this).attr("ids");
    let inquireType=$(this).attr("type");
    if(inquireType=="company"){
        // console.log("删除公司");
        dataObj={"token":permit,"idList":ids};
        callBack="housekepCompany();";
        ajaxURL="/ucotSmart/homemakingAction!delHomemaking.action";

    }else if(inquireType=="serve"){
        // console.log("删除服务");
        dataObj={"token":permit,"idList":ids};
        callBack="housekepServe();";
        ajaxURL="/ucotSmart/homeserviceAction!delHomeservice.action";
    };
    deletePubModal(dataObj,callBack,ajaxURL);
});
//服务反馈
$("#tab_domestic_service").on("click",".feedbackBut",function(){
    if($(this).attr("forbidden")=="no"){
        $("#deletePubModal .modal-title").text("反馈信息");
        $("#deletePubModal .mBody_title").text("确认是否要反馈"+$(this).parents("tr").find("td").eq(0).text()+"！");
        let ids=$(this).attr("ids");
        let dataObj,callBack,ajaxURL;
        dataObj={"token":permit,"id":ids};
        callBack="";
        ajaxURL="/ucotSmart/homeserviceAction!feedbackHomeservice.action";
        deletePubModal(dataObj,callBack,ajaxURL);
    }else{
        msgTips("请先进行推送再反馈！");
    };
});
//服务推送
var checked="";
$("#tab_domestic_service").on("click",".pushBut",function(){
    pushData();
    let ids=$(this).attr("ids");
    $("#push_serve .modal-body").attr("id",ids);
    $("#push_serve").modal("show");
});
$("#pushBut").click(function(){
    deWeightHousekeeping();
    let push_id=$("#push_serve .modal-body").attr("id");
    if(checked==""){
        msgTips("请选择推送公司！");
    }else{
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/homeserviceAction!pushHomeservice.action",
            dataType: "json",
            data: {
                "token":permit,
                "id":push_id,
                "homemaking_ids":checked
            },
            success: function (data) {
                // console.log(data);
                let success=data.success;
                msgTips(data.msg);
                if(data.success==true){
                    $(".feedbackBut[ids="+push_id+"]").attr("forbidden","no");
                };
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
        $("#push_serve").modal("hide");
    };
});
function deWeightHousekeeping(){
//去重、获取选中
    checked="";
    let selected=[];
    let inputs=$("#pushList input");
    inputs.each(function(){
        if($(this).not(":disabled").is(":checked")){
            let this_id=$(this).attr("id");
            checked=checked+","+this_id;
            let return_value=jQuery.inArray(this_id,selected);
            if(return_value==-1){
                selected.push(this_id);
                //去重禁选复选框
                $(this).attr({"disabled":true,"checked":"checked"});
            };
        };
    });
    checked=checked.substr(1,checked.length);
    // console.log(checked);
};
function pushData(page,type){
    let optionId=$("#serveMenu .serveMenu").attr("optionid");
    optionId?"":optionId="1";
    //推送列表
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/homemakingAction!findHomemaking.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "homemaking.type":optionId,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            // console.log("推送列表:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=data.obj.data.length;
                var totalNum=data.obj.data_count;
                $("#push_serve .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#push_serve .pagingImplement .pageList").hide();
                $("#pushList").html('<p>'+data.msg+'</p>');
                $("#push_serve .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"push_serve",{"functions":"pushData(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<obj.length;i++){
                    htmlList+='<tr>';
                    htmlList+='<td><input type="checkbox" id="'+obj[i].id+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                    htmlList+='<td>'+obj[i].name+'</td>';
                    htmlList+='<td>'+obj[i].address+'</td>';
                    htmlList+= '<td>'+obj[i].contacts+'</td>';
                    htmlList+= '<td>'+obj[i].phone+'</td>';
                    if(obj[i].website.length>lth){
                        let positionsTex=obj[i].website.substring(0,lth);
                        htmlList+= '<td content="'+obj[i].website+'"><span>'+positionsTex+'...'+'</span><span class="blue" onclick=previewModal("关联网址","'+obj[i].website+'")>详细</span></td>';
                    }else{
                        htmlList += '<td content="'+obj[i].website+'">' + obj[i].website + '</td>';
                    }
                    htmlList+='<td>'+obj[i].wechat+'</td>';
                    htmlList+='</tr>';
                };
                $("#pushList").html(htmlList);
                $("#pushList td").each(function(){
                    if($(this).text()=="null"||$(this).text()=="undefined"){
                        $(this).text("--");
                    };
                });
                deWeightHousekeeping();
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
$("#push_serve #checkboxs").click(function(){
//全选反选
    if($(this).is(":checked")){
        $("#pushList input").not(":disabled").prop("checked",true);
    }else{
        $("#pushList input").not(":disabled").prop("checked",false);
    };
});
//取消全选状态
$("#push_serve .pagingImplement").on("click",".pageList a",function(){
    $("#checkboxs").prop("checked",false);
});
// 初始化数据加载
pageListNotice();
menuAddress("noticeModalAddress");
$("a[href='#property_service_menu'],a[href='#tab_community_notice']").click(function(){
    $("#noticeStartTime,#noticeEndTime").val("");
    menuAddress("noticeModalAddress");
    pageListNotice();
});
//上传相片
// $(".noticeImgUp .uploadingImg").change(function(){
//     let pathUrl=$(this).val();
//     let names=pathUrl.lastIndexOf("\\");
//     let upfileName=pathUrl.substring(names+1,pathUrl.length);
//     let imgName=pathUrl.substring(names+1,pathUrl.length-4);
//     //let patt=/[\-.]/g;
//     //let name=pathUrl.match(patt);
//     $(".noticeImgUp .upfileName").val(imgName).attr("upfileName",upfileName);
//     // let file =$(this).get(0).files[0];
//     // let reader = new FileReader();
//     // reader.readAsDataURL(file);
//     // reader.onload=function(e){
//     //     $("#addPersonnelModal .uploading .portrait").attr("src",e.target.result);//预览图片
//     // };
// });
function noticeModal(modalType){
    $("#noticeForm input,#noticeForm textarea").val("");
    $("#noticeForm .chargingAds").attr({"optionid":"","modename":"全部"}).find("a.dropdown-toggle span").text("全部");
    $("#submitNoticeBut").show();
    $("#pushNoticeBut").hide();
    let tittle,butText,type;
    if(modalType=="add"){
        tittle="添加公告";
        butText="添加";
        type="add";
    }else if(modalType=="modify"){
        tittle="修改公告";
        butText="修改";
        type="modify";
    };
    $("#addnoticeModal .modal-title").text(tittle);
    $("#addnoticeModal #submitNoticeBut").text(butText).attr("type",type);
    $("#addnoticeModal").modal("show");
}
//表单验证
function formVerifyNotice(prefixId){
    let objInput="",mac;
    let chargingAds=$("#"+prefixId+" .chargingAds").attr("optionid");//地址
    // let unitAds=$("#"+prefixId+" .unitAds").attr("optionid");//地址
    // let doorplateAds=$("#"+prefixId+" .doorplateAds").attr("optionid");//地址
    // if(doorplateAds){mac=doorplateAds}else if(unitAds){mac=unitAds}else if(chargingAds){mac=chargingAds}else{mac=""};
    if(chargingAds){mac=chargingAds}else{mac=""};
    // if(!mac){msgTips("请选择地址");return;}
    let title=$("#"+prefixId+" #noticeName").val();//公告名称
    if(!title){msgTips("请填写公告名称");return;}
    let content=$("#"+prefixId+" #noticeRemark").val();//公告內容
    if(!content){msgTips("请填写公告内容");return;}
    // let upfileName=$("#"+prefixId+" .upfileName").attr("upfileName");//图片名称
    objInput={
        "mac":mac,
        "title":title,
        "content":content
        // "upfileName":upfileName
    };
    return objInput;
};
//--回显赋值--
function echoEchoNotice(prefixId,this_){
    //---------------费项
    let optionid=$(this_).parents("tr").find("td").eq(3).attr("mac");
    let modename=$(this_).parents("tr").find("td").eq(3).text();
    $("#noticeForm .chargingAds").attr({"optionid":optionid,"modename":modename}).find("a.dropdown-toggle span").text(modename);
    let noticeName=$(this_).parents("tr").find("td").eq(0).text();//费项编号
    $("#"+prefixId+" #noticeName").val(noticeName);
    let noticeRemark=$(this_).parents("tr").find("td").eq(1).attr("content");//收费名称
    $("#"+prefixId+" #noticeRemark").val(noticeRemark);
};
//--公告查询--
function pageListNotice(page,type){
    let starttime=$("#noticeStartTime").val();
    if(!starttime){starttime=""}
    let endtime=$("#noticeEndTime").val();
    if(!endtime){endtime=nowTimes}
    // 查询
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/informAction!findInform.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "starttime":starttime,
            "endtime":endtime
        },
        success: function (data) {
            console.log("系统公告:");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_property_services .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_property_services .pagingImplement .pageList").hide();
                $("#communityNoticeList").html("<p>暂无数据</p>");
                $("#personnelTable .checkboxsBut").hide();
                $("#tab_property_services .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                $("#personnelTable .checkboxsBut").show();
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_community_notice",{"functions":"pageListNotice(homelistPage,'paging')"});
                };
                let htmlList='',PrintHtml='',jsonExl=[];
                for(let i=0;i<10;i++){
                    if(obj[i]){
                        let mac;
                        if(obj[i].mac){mac=adsText(obj[i].mac.substr(obj[i].mac.indexOf("p")-1,obj[i].mac.length),"ok");}else{mac=""}
                        let liston={
                            "公告名称":obj[i].title,
                            "公告内容":obj[i].content,
                            "推送时间":obj[i].creattime,
                            "推送范围":mac
                        };
                        jsonExl.push(liston);
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].title+'</td>';
                        htmlList+='<td content="'+obj[i].content.replace(/(\s*)/g,'')+'"><span class="blue" onclick=previewModal("公告内容","'+obj[i].content.replace(/(\s*)/g,'')+'")>详情</span></td>';
                        htmlList+= '<td>'+obj[i].creattime+'</td>';
                        htmlList+= '<td mac="'+obj[i].mac+'">'+mac+'</td>';
                        htmlList+='<td class="notPrint"><a class="modifyBut" ids="'+obj[i].id+'">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'">删除</a>| <a class="pushBut" ids="'+obj[i].id+'" type="costItem">推送</a></td>';
                        htmlList+='</tr>';
                        PrintHtml+='<tr><td>'+obj[i].title+'</td><td>'+obj[i].content+'</td><td>'+obj[i].creattime+'</td><td>'+mac+'</td></tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#communityNoticeList").html(htmlList);
                wipeNull("communityNoticeList");
                localStorage.jsonExl=JSON.stringify(jsonExl);
                localStorage.PrintHtml=PrintHtml;
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
$("#addnoticeBut").click(function () {
    noticeModal("add");
});
$("#communityNoticeList").on("click",".modifyBut",function(){
    let this_=$(this);
    noticeModal("modify");
    echoEchoNotice("noticeForm",this_);
    $("#submitNoticeBut").attr("ids",this_.attr("ids"));
});
$("#communityNoticeList").on("click",".deleteBut",function(){
    $("#noticeDeleteBut").attr("ids",$(this).attr("ids"));
    $("#noticeDeleteModal").modal("show");
});
$("#communityNoticeList").on("click",".pushBut",function(){
    $("#pushDeleteBut").attr("ids",$(this).attr("ids"));
    $("#pushDeleteModal").modal("show");
});
$("#submitNoticeBut").click(function(){
    let type=$(this).attr("type");
    let objInput=formVerifyNotice("noticeForm");
    let createuser=$("#username").text().replace("当前用户：","");
    // let formData = new FormData();
    // formData.append("upfile",$(".noticeImgUp .uploadingImg")[0].files[0]);
    // formData.append("inform.zonecode",objInput.address);
    // formData.append("inform.title",objInput.name);
    // formData.append("inform.content",objInput.remark);
    // formData.append("upfileName",objInput.upfileName);
    let ajaxurl,msgtext,ids;
    if(type=="add"){
        ajaxurl="/ucotSmart/informAction!addInform.action";
        msgtext="添加公告";
    }else if(type=="modify"){
        ajaxurl="/ucotSmart/informAction!updateInform.action";
        msgtext="修改公告";
        ids=$("#submitNoticeBut").attr("ids");
        if(!ids){ids=""};
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        // data: formData,
        // processData: false,
        // contentType: false,
        data: {
            "token":permit,
            "inform.id":ids,
            "inform.zonecode":permit,
            "inform.title":objInput.title,
            "inform.content":objInput.content,
            "inform.mac":objInput.mac,
            "inform.createuser":createuser,
            "inform.needpush":0,
            "inform.status":1
        },
        success: function (data) {
            if(typeof(data)=="string"){
                data=JSON.parse(data)
            }
            console.log(msgtext);
            console.log(data);
            //    数据
            if(data.success==true){
                pageListNotice();
                $("#addnoticeModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#searchNotice").click(function(){
    // 条件查询
    pageListNotice();
});
//--公告刪除--
$("#noticeDeleteBut").click(function(){
    let ids=$("#noticeDeleteBut").attr("ids");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/informAction!delBybatchInform.action",
        dataType: "json",
        data: {
            "token":permit,
            "idList":ids
        },
        success: function (data) {
            console.log("公告刪除");
            console.log(data);
            //    数据
            if(data.success==true){
                pageListNotice();
                $("#noticeDeleteModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//--公告推送--
$("#pushDeleteBut").click(function(){
    let ids=$("#pushDeleteBut").attr("ids");
    let pushtype=$("#noticePushType .rearagePushType").attr("optionid");
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/informAction!pushInformToCtr.action",
        dataType: "json",
        data: {
            "token":permit,
            "idList":ids,
            "pushtype":pushtype
        },
        success: function (data) {
            console.log("公告推送");
            console.log(data);
            //    数据
            $("#pushDeleteModal").modal("hide");
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//-------------------打印---------------------------
$("#noticePrintBut").click(function(){
    sectionalPrint("noticePrint","手动推送打印数据",localStorage.PrintHtml);
});

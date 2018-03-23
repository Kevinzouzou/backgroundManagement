/**
 * Created by along on 2017/1/24. 用户报警
 */
//--加载初始方法--
$("a[href='#tab_users_alarm']").click(function (){
    menuAddress("logoutAddress");
    userAlarm();
});
function userAlarmInitialize(parameters){
    if(parameters=="alarm"){
        // 用户报警
        menuAddress("logoutAddress");
        userAlarm();
    }else if(parameters=="map"){
        // 数字地图
    }
}
function userAlarm(page,type){
    ownercodeGetSelected("logoutAddress");
    //查询用户报警
    let ownercode=$("#userLogoutSearch").attr("ownercode");
    if(!ownercode){
        let lastOf=permit.indexOf("d")+1;
        ownercode=permit.substring(lastOf-7,lastOf);
    };
    let starttime=$("#userLogoutSearch").attr("time0");
    if(!starttime){starttime=""};
    let endtime=$("#userLogoutSearch").attr("time1");
    if(!endtime){endtime=""};
    let status=$("#logoutAddress .logoutTypeMenu").attr("optionid");
    if(!status){status=""};
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/waringAction!findWarning.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "code":ownercode,
            "w.id":"",
            "starttime":starttime,
            "endtime":endtime,
            "w.status":status,
            "w.name":name,
            "w.mac":""
        },
        success: function (data) {
            console.log("查询用户报警");
            console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_user_alarm .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_user_alarm .pagingImplement .pageList").hide();
                $("#userLogoutList").html("<p>暂无数据</p>");
                $("#tab_user_alarm .pagingImplement .pageList").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_user_alarm",{"functions":"userAlarm(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        let status,statusCor="",owner=obj[i].owner,ownerName="",cellphone="",warninglevel,warninglevelCor="";
                        let adscode=obj[i].homecode;
                        let address=adsText(adscode);
                        switch (obj[i].status){
                            case 0:
                                status="未响应";
                                statusCor="#ff0000";
                                break;
                            case 1:
                                status="已响应";
                                statusCor="";
                                break;
                            default:
                                status="";
                                statusCor="";
                        };
                        switch (obj[i].warninglevel){
                            case 0:warninglevel="一般";
                                break;
                            case 1:warninglevel="较严重";
                                warninglevelCor="#f19149";
                                break;
                            case 2:warninglevel="严重";
                                warninglevelCor="#ff0000";
                                break;
                            default:
                                warninglevel="一般";
                        };
                        if(owner){
                            ownerName=obj[i].owner.name;
                            cellphone=obj[i].owner.cellphone;
                        }
                        htmlList+='<tr>';
                        htmlList+='<td>'+address+'</td>';
                        htmlList+='<td>'+ownerName+'</td>';
                        htmlList+='<td>'+cellphone+'</td>';
                        // htmlList+='<td></td>';
                        // htmlList+='<td></td>';
                        if(obj[i].name.length>lth){
                            let namekTex=obj[i].name.substring(0,lth);
                            htmlList+= '<td content="'+obj[i].name+'"><span>'+namekTex+'...'+'</span><span class="blue" onclick=previewModal("报警设备","'+obj[i].name.replace(/(\s*)/g,'')+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+obj[i].name+'">'+obj[i].name+'</td>';
                        }
                        // if(obj[i].picname.length>lth){
                        //     let picnamekTex=obj[i].picname.substring(0,lth);
                        //     htmlList+= '<td content="'+obj[i].picname+'"><span>'+picnamekTex+'...'+'</span><span class="blue" onclick=previewModal("报警方式","'+obj[i].picname.replace(/(\s*)/g,'')+'")>详细</span></td>';
                        // }else{
                        //     htmlList+= '<td content="'+obj[i].picname+'">'+obj[i].picname+'</td>';
                        // }
                        // if(obj[i].picname){
                        //     htmlList+= '<td><img src="'+obj[i].picname+'" alt="图片加载失败"></td>';
                        // }else{
                        //     htmlList+= '<td></td>';
                        // }
                        htmlList+='<td>'+obj[i].starttime+'</td>';
                        htmlList+='<td style="color:'+warninglevelCor+'">'+warninglevel+'</td>';
                        htmlList+='<td style="color:'+statusCor+'">'+status+'</td>';
                        htmlList+='<td>'+obj[i].endtime+'</td>';
                    // <a class="dispose" ids="'+obj[i].id+'">处理</a>|
                        if(obj[i].status==0){
                            htmlList+='<td><a class="response" mac="'+obj[i].mac+'" id1="'+obj[i].id_1+'" status="'+obj[i].status+'">响应</a>| <a class="deleteBut" ids="'+obj[i].id+'">删除</a> </td>';
                        }else if(obj[i].status==1){
                            htmlList+='<td><a class="deleteBut" ids="'+obj[i].id+'">删除</a> </td>';
                        }
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#userLogoutList").html(htmlList);
                wipeNull("userLogoutList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
$("#userLogoutList").on("click",".response",function(){
    // 响应
    let id1=$(this).attr("id1");
    let mac=$(this).attr("mac");
    let status=$(this).attr("status");
    let dataObj={"token":permit,"w.mac":mac,"w.id_1":id1,"w.status":status};
    let callBack="userAlarm()";
    let ajaxURL="/ucotSmart/waringAction!edit.action";
    deletePubModal(dataObj,callBack,ajaxURL);
    $("#deletePubModal .modal-title").text("报警响应");
    $("#deletePubModal .mBody_title").text("确认是否要进行响应！");
});
$("#userLogoutList").on("click",".deleteBut",function(){
    // 删除
    let ids=$(this).attr("ids");
    let dataObj={"token":permit,"idList":ids};
    let callBack="userAlarm()";
    let ajaxURL="/ucotSmart/waringAction!del.action";
    deletePubModal(dataObj,callBack,ajaxURL);
});
$("#userLogoutSearch").click(function(){
    // 条件搜索
    userAlarm();
});
// 数字地图
// 设备列表菜单
$("#tab_number_map .manuPadding strong").click(function(){
    let this_=$(this);
    this_.next("ul").toggle(200,function(){
        let display=this_.next("ul").css("display");
        if(display=="block"){
            this_.find("i").text("-");
        }else if(display=="none"){
            this_.find("i").text("+");
        };
    });
});
$("#addMapBut").click(function(){
    $("#addMapModal").modal("show");
});
$(".tips").click(function(){
    $("#detailsMapModal").modal("show");
});
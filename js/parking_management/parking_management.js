//var token="15048-41200005d-1516156873552";
//var token=sessionStorage.getItem("token");
//var parkingIp="http://192.168.1.202:8080";

//Ajax请求
function ajaxParkRequest(url,data,fun){
    data="token="+token+data;
    url=parkingIp+"/parking/"+url;
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: function(js){
            if(js.obj!==null){
                if(js.obj.data){
                    var list=eval(js.obj.data);
                    if(fun!==""){
                        eval(fun).call(this,list);
                    }
                }else{
                    if(fun!==""){
                        eval(fun).call(this);
                    }
                }
            }else{
                if(fun!==""){
                    eval(fun).call(this);
                }
            }
        },
        error: function(){
            msgTips("请求失败！");
        }
    })
}
//校验是否为空
function checknull(str){
    if(str=='null'||str==null){
        return "-";
    }
    return str;
}
//-------------------bootstrap 日期插件初始化---------------------------
$('.pull-right').on('click', '.calendar', function(){ //
    $(this).datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        //startDate:new Date(),
        //endDate:new Date(),
        pickerPosition:'bottom-right'//相对位置
    });
});
$('.pull-right').on('mousedown', '.calendar', function(){ //就改这一行就可以了
    plugTime(this);
});
function plugTime(dom) {
    $(dom).datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        //startDate:new Date(),
        //endDate:new Date(),
        pickerPosition:'bottom-right'//相对位置
    });
    $(dom).click();
    $(dom).blur();
}
$(".rentTimer").datetimepicker({
    format: "yyyy-mm-dd  hh:ii",
    autoclose: true
})

//下拉组件，选中填充
function selectDropdownMenu(class1,class2){
    $("body").on('click',class1+">li>a",function(){
        if($(this).attr("ids")){
            var ids=$(this).attr("ids");
            $(this).parent().parent().siblings(class2).attr("ids",ids).find("span").text($(this).html());
        }else{
            $(this).parent().parent().siblings(class2).find("span").text($(this).html());
        }
    });
}
selectDropdownMenu(".areaZoneList-menu",".areaZoneList");

$('#username').append(sessionStorage.getItem('username'));
//注销
$('#login_out').click(function () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    window.location.href='login.html';
});
$("body").css("height",window.innerHeight);
var map=new Array();
//一级菜单，二级菜单选中增加class
$(".left_aside .nav_tab li").on('click',function(){
    $('#all_paging').css('display','none');
    $(this).addClass("active").siblings().removeClass("active");
});
//一级菜单，有二级菜单下跳转到指定内容项
$(".left_aside>.nav_tab>li").on('click',function(){
    $('#all_paging').css('display','none');
    $(".left_aside .nav_tab li").removeClass("active");
    $(this).addClass("active");
    var index=$(this).index();
    $(".right_aside>.tab-content>div").eq(index).addClass("active").siblings().removeClass("active");
});
$(".tablist_third>ul>li").on('click', function () {
    $('#all_paging').css('display','none');
});

function back(){
    $('#all_paging').css('display','none');
    var index=map.length-1;//2
    var functionname="";
    if(index!=0){
        functionname =(map[parseInt(index)-1]).split('\:')[1];
    }else{
        functionname = map[0];
    }
    var fn= eval(functionname.split('(')[0]);//queryBuilding('200002d1p1z')
    var params=functionname.split(")")[0].split("(")[1];//参数字符串

    if(params==undefined){
        fn.call(this);//没有参数
    }else{
        var param=params.split(',');//参数数组

        if(parseInt(params.indexOf(','))<0){//一个参数
            fn.call(this,changeParam(changeParam(params)));
        }
        if(param.length==2){//有两个参数
            fn.call(this,changeParam(param[0]),changeParam(param[1]));
        }
        if(param.length==3){//有三个参数
            fn.call(this,changeParam(param[0]),changeParam(param[1]),changeParam(param[2]));
        }
        if(index>0){
            map.splice(index);
        }
    }
}
//去掉字符串单引号
function changeParam(param){//'D' "D"
    param=param.split('"');
    if(param.length==1){
        param=param[0];
    }else{
        param=param[1];
    }
    param=param.split("'");
    if(param.length==1){
        param=param[0];
    }else{
        param=param[1];
    }
    return param;
}

function unitetdline(dom){
    var dom1=$('#'+dom+' td');
    var dom2=$('#'+dom+' td a');
    if(dom=='zoneInfo-body4'){
        dom1.css("line-height","1.6rem").css("padding","0px").css("border","0px");
    }else{
        dom1.css("line-height","3.2rem").css("padding","0px").css("border","0px");
    }
    dom2.css('cursor','pointer');
}

$('#back').click(function(){
    back();
});

//显示提示框，3s后自动关闭
function msgTips(content,times){
    $(".alert").stop();
    $("#msgContent").text(content);
    if(!times){
        times=3000;
    }
    $(".alert").show(100).delay(times).hide(100);
}
//数字地图查询展示车位
queryDigitalMap();
$("body").on('click',".parking_management",function(){
    queryDigitalMap();
});
//数字地图查询
function queryDigitalMap(){
    ajaxParkRequest("pakingManagementAction!showparingManagment.action","","digitalMap");
}
//数字地图 查询方法
function digitalMap(list){
    var areaDiv="",carDiv="";
    $.each(list,function(i,parker){
        areaDiv+='<li><a href="#f'+parker.id+'" role="tab" data-toggle="tab">'+parker.name+'</a></li>';
        carDiv+='<ul id="f'+parker.id+'" class="tab-pane clearfix list-unstyled">';
        for(var i=0;i<parker.carTotal;i++){
            carDiv+='<li><span></span></li>';
        }
        carDiv+='</ul>';
    });
    $("#tab_digital_map .cont>.areas").html(areaDiv);
    $("#tab_digital_map .cont>.cars").html(carDiv);
    if(!$("#tab_digital_map .cont>.areas li").hasClass("active")){
        $("#tab_digital_map .cont>.areas li:first-child").addClass("active");
    }
    if(!$("#tab_digital_map .cont>.cars ul").hasClass("active")){
        $("#tab_digital_map .cont>.cars ul:first-child").addClass("active");
    }
    linkSet();
    var name=$("#tab_digital_map .cont>.areas li.active a").text();
    var ulActive=$("#tab_digital_map .cont>.cars ul.active");
    queryParkingSpace(name,ulActive)
}
//查询车库区域车位信息
function queryParkingSpace(name,ulActive){
    var liId=$(ulActive).find("li");
    var url=parkingIp+"/parking/parkingInformation!queryParkingInformationTocar.action";
    $.ajax({
        type: "POST",
        url: url,
        data: "token="+token+"&parkingCode="+name,
        dataType: "json",
        success: function(data){
            if(data.obj){
                $.each(data.obj.data,function(i, space){
                    id=space.id;
                    status=space.parkingStatus;
                    carNumber=space.carNumber;
                    liId.eq(i).attr("ids",space.id)
                    liId.eq(i).find("span").text(space.carNumber)
                    if(status==1){
                        liId.eq(i).addClass("parkImg")
                    }else{
                        liId.eq(i).removeClass("parkImg")
                    }
                })
            }
        }
    });

}
//查询车库区域车位信息
$("body").on("click","#tab_digital_map .cont>.areas li",function(){
    var name=$(this).find("a").text()
    var index=$(this).index()+1
    var ulActive=$("#tab_digital_map .cont>.cars ul:nth-child("+index+")");
    queryParkingSpace(name,ulActive)
});

//是否私家车位
function checkPrivate(id){
    $("body").on('click',id+" .attribute-menu>li>a",function(){
        if($(this).attr("ids")==0){
            $(id+" .private").show();
        }else if($(this).attr("ids")==1){
            $(id+" .private").hide();
        }
    });
}
checkPrivate(".parkingMg .edits");

//数字地图 添加
$("body").on("click","#addDigitalMap .determine",function(){
    var id="#addDigitalMap", data;
    var areaStr="",carStr="";
    var areaTxt=$(id).find('.areaName');
    var carTxt=$(id).find('.carNum');
    for (var i = 0; i < areaTxt.length; i++) {
        areaStr+=areaTxt.eq(i).val()+",";
        carStr+=carTxt.eq(i).val()+",";
    }
    areaStr=(areaStr.substring(areaStr.length-1)==',')?areaStr.substring(0,areaStr.length-1):areaStr;
    carStr=(carStr.substring(carStr.length-1)==',')?carStr.substring(0,carStr.length-1):carStr;

    data="&name="+areaStr+"&carTotal="+carStr;
    ajaxParkRequest("pakingManagementAction!addshowparking.action",data,"queryDigitalMap");
    $(id+" input").val("");
});
//添加区域名称 车位数
addItem("#addDigitalMap .totalLength .add","#addDigitalMap .totalLength .delete");
function addItem(addId,deleteId){
    $("body").on('click',addId,function(){
        var html='<li class="totalLength"><span>区域名称</span><input type="text" class="areaName" placeholder="输入区域名称">' +
            '<span>车&nbsp;&nbsp;位&nbsp;&nbsp;数</span><input type="number" class="carNum">' +
            '<a class="delete">删除</a></li>';
        $(this).parents("ul.large-half").append(html);
        deleteItem(deleteId);
    });
}
function deleteItem(id){
    $("body").on('click',id,function(){
        $(this).parent().remove();
    });
}
//删除当前区域车库及对应车位
$("body").on("click","#digitalMapDelete .delete",function(){
    var areaId=$("#tab_digital_map .cont>.cars ul.active").attr("id");
    areaId=areaId.substring(1, areaId.length);
    var data="&id="+areaId;
    ajaxParkRequest("pakingManagementAction!delshowParking.action",data,"queryDigitalMap");
});

//临时收费设置 添加删除
addChargeItem("#addChargeSetting .totalLength .add","#addChargeSetting .totalLength .delete","#addChargeSetting .large-half");
addChargeItem("#chargeSettingModify .totalLength .add","#chargeSettingModify .totalLength .delete","#chargeSettingModify .large-half");
function addChargeItem(addId,deleteId,increId){
    $("body").on("click",addId,function(){
        var html='<li><input type="text" class="startTo"/><span class="toTime">小时内</span><span>收费</span>' +
            '<input type="text" class="pay"/><span>元</span><a class="delete">删除</a></li>';
        $(this).parents("ul.chargeTime").append(html);
        deleteItem(deleteId);
        //递增验证
        increase(increId);
    })

}

//车位信息 查询单个车位信息
function linkSet(){
    $("body").on('click',"#tab_digital_map .cont>.cars>ul>li",function(){
        $("#tab_digital_map .cont>.cars>ul>li").removeClass("active");
        $(this).addClass("active");
        var carNumber=$(this).find("span").text();
        var ids=$(this).attr("ids");
        $("#tab_digital_map .cont>.edits .parkingNum span").attr("ids",ids);
        var data="&carNumber="+carNumber;
        ajaxParkRequest("parkingInformation!getParingbyCardNum.action",data,"queryParking")
    });
}
function queryParking(list){
    var id="#tab_digital_map .cont>.edits";
    $.each(list,function(i,parking){
        $(id+" .parkingNum b").text(checknull(parking.carNumber));
        if(parking.parkingStatus==null || parking.parkingStatus=="null"){
            $(id+" .sta span.pull-right").text("-");
        }else if(parking.parkingStatus==1){
            $(id+" .sta span.pull-right").text("占用");
        }else if(parking.parkingStatus==0){
            $(id+" .sta span.pull-right").text("空闲");
        }
        if(parking.attributes==null || parking.attributes=="null"){
            $(id+" .attr span.pull-right").text("-");
            $(id+" .ownerName b").text("-");
            $(id+" .ownerPhone b").text("-");
        }else if(parking.attributes==1){
            $(id+" .attr span.pull-right").text("公共车位");
            $(id+" .private").hide();
        }else if(parking.attributes==0){
            $(id+" .attr span.pull-right").text("私家车位");
            $(id+" .private").show();
            $(id+" .ownerName b").text(checknull(parking.ownerName));
            $(id+" .ownerPhone b").text(checknull(parking.ownerPhone));
        }
        $(id+" .numPlate b").text(checknull(parking.numberplate));
        $(id+" .cameraName b").text(checknull(parking.cameraName));
        $(id+" .cameraId b").text(checknull(parking.cameraId));
        $(id+" .sensorName b").text(checknull(parking.sensorName));
        $(id+" .sensorId b").text(checknull(parking.sensorId));
        $(id+" .mark b").text(checknull(parking.remarks));
    });
}

//数字地图 车位信息 编辑 完成 删除
$("body").on('click',"#tab_digital_map .cont .edits .details .edit",function(){
    var id="#tab_digital_map .cont .edits .details";
    $(id+" .parkingNum input").val($(id+" .parkingNum b").text());
    $(id+" .numPlate input").val($(id+" .numPlate b").text());
    $(id+" .cameraName input").val($(id+" .cameraName b").text());
    $(id+" .cameraId input").val($(id+" .cameraId b").text());
    $(id+" .sensorName input").val($(id+" .sensorName b").text());
    $(id+" .sensorId input").val($(id+" .sensorId b").text());
    $(id+" textarea").val($(id+" .mark b").text());

    $(id+" .done").css("display","inline");
    $(id+" .edit").css("display","none");
    $(id+" input").css("display","inline");
    $(id+" textarea").css("display","block");
    $(id+" .dropdown").css("display","inline-block");
    $(id+" li>b").css("display","none");
    $(id+" span.pull-right").css("display","none");
    if($(id+" .sta span.pull-right").text()=="占用"){
        $(id+" .sta .parkingState-list").attr("ids","1");
    }else if($(id+" .sta span.pull-right").text()=="空闲"){
        $(id+" .sta .parkingState-list").attr("ids","0");
    }
    $(id+" .sta .parkingState-list span").text($(id+" .sta span.pull-right").text());
    if($(id+" .attr span.pull-right").text()=="公共车位"){
        $(id+" .attr .attribute-list").attr("ids","1");
        $(id+" .private").hide();
    }else if($(id+" .attr span.pull-right").text()=="私家车位"){
        $(id+" .attr .attribute-list").attr("ids","0");
        $(id+" .private").show();
        $(id+" .ownerName input").val($(id+" .ownerName b").text())
        $(id+" .ownerPhone input").val($(id+" .ownerPhone b").text())
    }
    $(id+" .attr .attribute-list span").text($(id+" .attr span.pull-right").text());
});
$("body").on('click',"#tab_digital_map .cont .edits .details .done",function(){ //车位信息 编辑 完成
    var id="#tab_digital_map .cont .edits .details li";
    $(id+" .edit").css("display","inline");
    $(id+" .done").css("display","none");
    $(id+" input").css("display","none");
    $(id+" .dropdown").css("display","none");
    $(id+" textarea").css("display","none");
    $(id+" b").css("display","inline");
    $(id+" span.pull-right").css("display","inline");
    $(id+".mark b").css("display","block");
    var ids=$(id+".parkingNum span").attr("ids");
    var parkingNum=$(id+".parkingNum input").val();
    var status=$(id+".sta .parkingState-list").attr("ids");
    if(status==1){
        $("#tab_digital_map .cont>.cars ul li[ids='"+ids+"']").addClass("parkImg");
    }else if(status==0){
        $("#tab_digital_map .cont>.cars ul li[ids='"+ids+"']").removeClass("parkImg");
    }
    $(id+".sta span.pull-right").text($(id+".sta .parkingState-list span").text());
    var attributes=$(id+".attr .attribute-list").attr("ids");
    var parkingCode=$("#tab_digital_map .cont>.areas li.active a").text();

    var ownerName=$(id+".ownerName input").val();
    var ownerPhone=$(id+".ownerPhone input").val();
    var numPlate=$(id+".numPlate input").val();
    var cameraName=$(id+".cameraName input").val();
    var cameraId=$(id+".cameraId input").val();
    var sensorName=$(id+".sensorName input").val();
    var sensorId=$(id+".sensorId input").val();
    var mark=$(id+".mark textarea").val();

    $(id+".parkingNum b").text(parkingNum);
    $(id+".numPlate b").text(numPlate);
    $(id+".cameraName b").text(cameraName);
    $(id+".cameraId b").text(cameraId);
    $(id+".sensorName b").text(sensorName);
    $(id+".sensorId b").text(sensorId);
    $(id+".mark b").text(mark);

    var data="token="+token+"&parking.parkingCode="+parkingCode+"&parking.carNumber="+parkingNum+"&parking.parkingStatus="+
             status+"&parking.numberplate="+parkingNum+"&parking.cameraName="+cameraName+
             "&parking.cameraId="+cameraId+"&parking.sensorName="+sensorName+"&parking.sensorId="+sensorId+
             "&parking.remarks="+mark+"&parking.id="+ids;
    if(attributes==1){
        $(id+".private").hide();
        data=+"&parking.attributes="+attributes+data;
    }else if(attributes==0){
        $(id+".private").show();
        $(id+".ownerName b").text($(id+".ownerName input").val());
        $(id+".ownerPhone b").text($(id+".ownerPhone input").val());
        data=+"&parking.attributes="+attributes+"&parking.ownerName="+ownerName+"&parking.ownerPhone="+ownerPhone+data;
    }
    $(id+".attr span.pull-right").text($(id+".attr .attribute-list span").text());

    ajaxNone("parkingInformation!updateParkingInformation.action",data);
});
$("body").on('click',"#tab_digital_map .cont .edits .details .delete",function(){  //车位信息 删除
    var id="#tab_digital_map .cont .edits .details li";
    var bTxt=$(id).find("b");
    var inputTxt=$(id).find("input");
    for(var i= 0;i<bTxt.length;i++){
        bTxt.eq(i).text("");
    }
    for(var i= 0;i<inputTxt.length;i++){
        inputTxt.eq(i).val("");
    }
    $(id+" span.pull-right").text("");
    $(id+" .dropdown a span").text("请选择")
    $(id+" textarea").val("");
    var ids=$(id+".parkingNum span").attr("ids");
    var data="&id="+ids;
    ajaxNone("parkingInformation!addParkingInformation.action",data);
});

function ajaxNone(url,data){
    $.ajax({
        type: "POST",
        url: parkingIp+"/parking/"+url,
        data: "token="+token+data,
        dataType: "json",
        success: function(data){
            console.log(data)
        },
        error: function(){
            msgTips("请求失败！")
        }
    });
}
//车主管理 查询
$(".owner_management").on('click',function(){
    console.log(token)
    ownerMgTable();
})
var d=[],p=[],z=[],b=[],u=[],f=[],h=[];
function ownerMgTable(){
    d.length=0; p.length=0; z.length=0; b.length=0; u.length=0; f.length=0; h.length=0;
    var url="/parking/ownerInformation!selectByhome.action";
     $.ajax({
        type: "POST",
        url: parkingIp+url,
        data: "token="+token,
        dataType: "json",
        success: function(data){
            $.each(data.obj.home, function(i,homeItem){
                var codes=homeItem.codearray;
                var indexd=codes.indexOf("d");
                var indexp=codes.indexOf("p");
                var indexz=codes.indexOf("z");
                var indexb=codes.indexOf("b");
                var indexu=codes.indexOf("u");
                var indexf=codes.indexOf("f");
                var indexh=codes.indexOf("h");
                d.push(codes.substring(0,indexd));
                p.push(codes.substring(indexd+1,indexp));
                z.push(codes.substring(indexp+1,indexz));
                b.push(codes.substring(indexz+1,indexb));
                u.push(codes.substring(indexb+1,indexu));
                f.push(codes.substring(indexu+1,indexf));
                h.push(codes.substring(indexf+1,indexh));
            });
            selectAddress(p,"期","#tab_parkerMg .btns .periodTypeList-menu");
            selectAddress(z,"区","#tab_parkerMg .btns .zoneTypeList-menu");
            selectAddress(b,"栋","#tab_parkerMg .btns .buildingTypeList-menu");
            selectAddress(u,"单元","#tab_parkerMg .btns .unitTypeList-menu");
            selectAddress(f,"层","#tab_parkerMg .btns .layerList-menu");
            selectAddress(h,"室","#tab_parkerMg .btns .roomNumList-menu");
        },
        error: function(){
            msgTips("车主管理请求失败！");
        }
    })
    queryListByParamsPark(url,"","ownerMgPage","queryOwnerMgTable"); //带分页
}
function queryOwnerMgTable(list){
    var html="",len=list.length;
    $.each(list,function(i,tbodyTr){
        var vehicle;
        if(tbodyTr.vehicleType==0) vehicle="小型";
        else if(tbodyTr.vehicleType==1) vehicle="中型";
        else if(tbodyTr.vehicleType==2) vehicle="大型";
        html+='<tr ids="'+tbodyTr.id+'"><td>'+translate(tbodyTr.ownerAddRess)+'</td><td>'+tbodyTr.ownerName+'</td><td>'+
            tbodyTr.ownerPhone+'</td><td>'+tbodyTr.nameOfRegion+'</td><td>'+tbodyTr.carNumber+'</td><td>'+
            tbodyTr.numberPlate+'</td><td>'+tbodyTr.carModel+'</td><td>'+tbodyTr.carColor+'</td>' +
            '<td ids="'+tbodyTr.vehicleType+'">'+vehicle+'</td><td>'+tbodyTr.admissionTime+'</td><td>'+tbodyTr.chaRgename+
            '</td><td><a class="modify"  data-toggle="modal" data-target="#parkerMgModify">修改</a>|' +
            '<a class="delete"  data-toggle="modal" data-target="#parkerMgDelete">删除</a></td></tr>';
    });
    $("#tab_parkerMg .table tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_parkerMg .tables tbody",len,10);
    //修改时自动赋值
    parkerMgModify();
}
//地址模糊查询
$("body").on('click','#tab_parkerMg .btns .btn_search',function(){
    var id="#tab_parkerMg .btns";
    var addTxt=$(id+" .dropdown .periodTypeList span").text()+$(id+" .dropdown .zoneTypeList span").text()+
        $(id+" .dropdown .buildingTypeList span").text()+$(id+" .dropdown .unitTypeList span").text()+
        $(id+" .dropdown .layerList span").text()+$(id+" .dropdown .roomNumList span").text();

    addTxt=tranFormHomecode(addTxt);
    var data="&homeInformation="+addTxt;
    queryListByParamsPark("/parking/ownerInformation!selectByhome.action",data,"ownerMgPage","queryOwnerMgTable");
})
//修改时自动赋值
function parkerMgModify(){
    $("#tab_parkerMg tbody td .modify").on("click",function(){
        var id="#parkerMgModify";
        $(id+" .ownerName").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .ownerPhone").val($(this).parents("tr").children("td:nth-child(3)").text());
        $(id+" .areasname").val($(this).parents("tr").children("td:nth-child(4)").text());
        $(id+" .parkingNum").val($(this).parents("tr").children("td:nth-child(5)").text());
        $(id+" .numPlate").val($(this).parents("tr").children("td:nth-child(6)").text());
        $(id+" .carModels").val($(this).parents("tr").children("td:nth-child(7)").text());
        $(id+" .carColor").val($(this).parents("tr").children("td:nth-child(8)").text());
        $(id+" .carSizeList").attr("ids",$(this).parents("tr").children("td:nth-child(9)").attr("ids"));
        $(id+" .carSizeList>span").text($(this).parents("tr").children("td:nth-child(9)").text());
        $(id+" .inTime").val($(this).parents("tr").children("td:nth-child(10)").text());
        $(id+" .chargeName").val($(this).parents("tr").children("td:nth-child(11)").text());
    })
}

//车主管理 添加 地址接口
$("#tab_parkerMg .btns .adding").on("click",function(){
    p.length=0, z.length=0, b.length=0, u.length=0, f.length=0, h.length=0;
    $.ajax({
        type: "POST",
        url: parkingIp+"/parking/ownerInformation!showhome.action",
        data: "token="+token,
        dataType: "json",
        success: function(data){
            $.each(data.obj, function(i,homeItem){
                var codes=homeItem.codearray;
                var indexd=codes.indexOf("d");
                var indexp=codes.indexOf("p");
                var indexz=codes.indexOf("z");
                var indexb=codes.indexOf("b");
                var indexu=codes.indexOf("u");
                var indexf=codes.indexOf("f");
                var indexh=codes.indexOf("h");
                d.push(codes.substring(0,indexd));
                p.push(codes.substring(indexd+1,indexp));
                z.push(codes.substring(indexp+1,indexz));
                b.push(codes.substring(indexz+1,indexb));
                u.push(codes.substring(indexb+1,indexu));
                f.push(codes.substring(indexu+1,indexf));
                h.push(codes.substring(indexf+1,indexh));
            });
            selectAddress(p,"期","#addParkerMg .large-half .periodTypeList-menu");
            selectAddress(z,"区","#addParkerMg .large-half .zoneTypeList-menu");
            selectAddress(b,"栋","#addParkerMg .large-half .buildingTypeList-menu");
            selectAddress(u,"单元","#addParkerMg .large-half .unitTypeList-menu");
            selectAddress(f,"层","#addParkerMg .large-half .layerList-menu");
            selectAddress(h,"室","#addParkerMg .large-half .roomList-menu");
        },
        error: function(){
            msgTips("车主管理请求失败！");
        }
    })
})

//车主管理 添加
$("body").on("click","#addParkerMg .determine",function(){
    var id="#addParkerMg .large-half";
    var address=$(id+" .installPosition .periodTypeList span").text()+
                $(id+" .installPosition .zoneTypeList span").text()+
                $(id+" .installPosition .buildingTypeList span").text()+
                $(id+" .installPosition .unitTypeList span").text()+
                $(id+" .installPosition .layerList span").text()+
                $(id+" .installPosition .roomList span").text();
    address=tranFormHomecode(address);
    var ownerName=$(id+" .ownerName").val();
    var ownerPhone=$(id+" .ownerPhone").val();
    var areasname=$(id+" .areasname").val();
    var parkingNum=$(id+" .parkingNum").val();
    var numPlate=$(id+" .numPlate").val();
    var carModels=$(id+" .carModels").val();
    var carColor=$(id+" .carColor").val();
    var carSize=$(id+" .carSizeList").attr("ids");
    var inTime=$(id+" .inTime").val();
    var chargeName=$(id+" .chargeName").val();
    var data="&ow.ownerAddRess="+address+"&ow.ownerName="+ownerName+"&ow.ownerPhone="+ownerPhone+"&ow.nameOfRegion="+
        areasname+"&ow.carNumber="+parkingNum+"&ow.numberPlate="+numPlate+"&ow.carModel="+carModels+"&ow.carColor="+
        carColor+"&ow.vehicleType="+carSize+"&ow.admissionTime="+inTime+"&ow.chaRgename="+chargeName;

    $.ajax({
        type: "POST",
        url: parkingIp+"/parking/ownerInformation!addOwnerInformation.action",
        data: "token="+token+data,
        dataType: "json",
        success: function(data){
            ownerMgTable();
        },
        error: function(){
            msgTips("请求失败！")
        }
    });
})

//车主管理 自定义属性
function addAttrIds(tabId, cla, modId){
    $("body").on("click",tabId+" table "+cla,function(){
        var ids=$(this).parents("tr").attr("ids");
        $(modId).attr("ids",ids);
    });
}
addAttrIds("#tab_parkerMg",".modify","#parkerMgModify .determine");
addAttrIds("#tab_parkerMg",".delete","#parkerMgDelete .to_delete");
//车主管理 修改
$("body").on("click","#parkerMgModify .determine",function(){
    var ids=$(this).attr("ids");
    var id="#parkerMgModify .large-half";
    var ownerName=$(id+" .ownerName").val();
    var ownerPhone=$(id+" .ownerPhone").val();
    var areasname=$(id+" .areasname").val();
    var parkingNum=$(id+" .parkingNum").val();
    var numPlate=$(id+" .numPlate").val();
    var carModels=$(id+" .carModels").val();
    var carColor=$(id+" .carColor").val();
    var carSize=$(id+" .carSizeList").attr("ids");
    var inTime=$(id+" .inTime").val();
    var chargeName=$(id+" .chargeName").val();
    var data="&ow.id="+ids+"&ow.ownerName="+ownerName+"&ow.ownerPhone="+ownerPhone+"&ow.nameOfRegion="+
        areasname+"&ow.carNumber="+parkingNum+"&ow.numberPlate="+numPlate+"&ow.carModel="+carModels+"&ow.carColor="+
        carColor+"&ow.vehicleType="+carSize+"&ow.admissionTime="+inTime+"&ow.chaRgename="+chargeName;
    ajaxParkRequest("ownerInformation!updateOwnerInformation.action",data,"ownerMgTable");

});
//车主管理 删除
$("body").on("click","#parkerMgDelete .to_delete ",function(){
    var ids=$(this).attr("ids");
    var data="&id="+ids;
    ajaxParkRequest('ownerInformation!deleteOwnerInformation.action',data,"ownerMgTable");
});

//临时收费管理 1.临时收费设置
//临时收费设置 查询
$(".temporary_charge").on("click",function(){
    chargeSettingTable();
});
function chargeSettingTable(){
    //queryListByParamsPark("/parking/temporaryChargeAction!showtemporaryCharge.action","","chargeSetPage","queryChargeSettingTable");
    ajaxParkRequest("temporaryChargeAction!showtemporaryCharge.action","","queryChargeSettingTable")
}
function queryChargeSettingTable(list){
    var html="",len=list.length;
    $.each(list,function(i,tbodyTr){
        var carSize,chargeStyle,chargeStyTxt;
        if(tbodyTr.howWay==0){
            carSize="小车";chargeStyle=1;chargeStyTxt="按次收费";
        }else if(tbodyTr.howWay==1){
            carSize="小车";chargeStyle=2;chargeStyTxt="按时收费";
        }else if(tbodyTr.howWay==2){
            carSize="小车";chargeStyle=3;chargeStyTxt="按时段收费";
        }else if(tbodyTr.howWay==3){
            carSize="中车";chargeStyle=1;chargeStyTxt="按次收费";
        }else if(tbodyTr.howWay==4){
            carSize="中车";chargeStyle=2;chargeStyTxt="按时收费";
        }else if(tbodyTr.howWay==5){
            carSize="中车";chargeStyle=3;chargeStyTxt="按时段收费";
        }else if(tbodyTr.howWay==6){
            carSize="大车";chargeStyle=1;chargeStyTxt="按次收费";
        }else if(tbodyTr.howWay==7){
            carSize="大车";chargeStyle=2;chargeStyTxt="按时收费";
        }else if(tbodyTr.howWay==8){
            carSize="大车";chargeStyle=3;chargeStyTxt="按时段收费";
        }
        html+='<tr ids="'+tbodyTr.id+'"><td>'+tbodyTr.chargeName+'</td><td>'+tbodyTr.chargeNum+'</td><td ids="'+tbodyTr.cartype+'">'+carSize+
            '</td><td ids="'+chargeStyle+'">'+chargeStyTxt+'</td><td>' +
            '<a class="detail" data-toggle="modal" data-target="#chargeSettingDetails'+chargeStyle+'" ids="'+tbodyTr.howWay+'">详情</a></td>' +
            '<td><a class="modify" data-toggle="modal" data-target="#chargeSettingModify">修改</a>|' +
            '<a class="delete" data-toggle="modal" data-target="#chargeSettingDelete">删除</a></td></tr>';
    });
    $("#tab_chargeSetting .table tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_chargeSetting .tables tbody",len,10);
    //修改时自动赋值
    chargeSetModify();
}
//收费标准 详情
$("body").on("click","#tab_chargeSetting tbody td .detail",function(){
    var howWay=$(this).attr("ids");
    var data="&howWay="+howWay;
    ajaxParkRequest("temporaryChargeAction!showtemporaryChargeByid.action",data,"chargeSetDetail");
})
function chargeSetDetail(list){
    console.log(list)
    var html="",li1="",li2="";
    $.each(list,function(i,item){
        if(item.howWay%3==0){
            $("#chargeSettingDetails1 .list-unstyled .freeTime").text(item.freeTime);
            $("#chargeSettingDetails1 .list-unstyled .perPrice").text(item.price);
        }else if(item.howWay%3==1){
            html='<li><p>每次<span class="freeTime">'+item.freeTime+'</span>分钟内免收费</p></li>';
            var arr=item.timeY.split(",");
            var payArr=item.pay.split(",");
            console.log(arr.length)
            for(var i=0;i<arr.length;i++){
                html+='<li><p><span class="startTo">'+arr[i]+'</span>小时内 收费<span class="pay">'+payArr[i]+'</span>元</p></li>';
            }
            html+='<li><p>最大收费金额 <span class="maxPrice">'+item.maxprice+'</span>元</p></li>';
            $("#chargeSettingDetails2 .list-unstyled").html(html);
        }else if(item.howWay%3==2){
            //var id="#chargeSettingDetails3 .list-unstyled";
            var id="#chargeSettingDetails3";
            $(id+" .free .freeTime").text(item.freeTime);
            var dayArr=item.timeY.split(",")[0].split("-");
            var nightArr=item.timeY.split(",")[1].split("-");
            var dayPay=item.pay.split(",")[0].split("-");
            var nightPay=item.pay.split(",")[1].split("-");
            for(var i=0;i<dayArr.length;i++){
                li1+='<li><p><span class="startTo">'+dayArr[i]+'</span>小时内 收费<span class="pay">'+dayPay[i]+'</span>元</p></li>';
            }
            $(id+" .dayTime .cont").html(li1);
            for(var j=0;j<nightArr.length;j++){
                li2+='<li><p><span class="startTo">'+nightArr[j]+'</span>小时内 收费<span class="pay">'+nightPay[j]+'</span>元</p></li>';
            }
            $(id+" .nightTime .cont").html(li2);
            $(id+" .maxPrice").text(item.maxprice);
            var height=parseFloat($(id+" .modal-body ul>li").css("height"));
            $(id+" .modal-body ul>.second_time.dayTime").css("height",dayArr.length*height+'px');
            $(id+" .modal-body ul>.dayTime>div").css("height",dayArr.length*height+'px').css("line-height",dayArr.length*height+'px');
            $(id+" .modal-body ul>.second_time.nightTime").css("height",nightArr.length*height+'px');
            $(id+" .modal-body ul>.second_time.nightTime .title").css("height",nightArr.length*height+'px').css("line-height",nightArr.length*height+'px');
        }
    })
}

//修改时自动赋值
function chargeSetModify(){
    $("#tab_chargeSetting tbody td .modify").on("click",function(){
        var id="#chargeSettingModify";
        $(id+" .chargeName").val($(this).parents("tr").children("td:first-child").text());
        $(id+" .chargeNum").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .modelSizeList").attr("ids",$(this).parents("tr").children("td:nth-child(3)").attr("ids"));
        $(id+" .modelSizeList>span").text($(this).parents("tr").children("td:nth-child(3)").text());
        $(id+" .chargeTypeList").attr("ids",$(this).parents("tr").children("td:nth-child(4)").attr("ids"));
        $(id+" .chargeTypeList>span").text($(this).parents("tr").children("td:nth-child(4)").text());
    })
}
//收费类型
chargeType("#addChargeSetting");
chargeType("#chargeSettingModify");
function chargeType(id){
    $("body").on("click",id+" .chargeTypeList-menu li>a",function(){
        var ids=$(this).attr("ids");
        if(ids==1){
            $(id+" .large-half .per-time").show();
            $(id+" .large-half .times").hide();
        }else if(ids==2){
            $(id+" .large-half .per-time").hide();
            $(id+" .large-half .period-time").hide();
            $(id+" .large-half .times-both").show();
            $(id+" .large-half .a-time").show();
        }else if(ids==3){
            $(id+" .large-half .per-time").hide();
            $(id+" .large-half .a-time").hide();
            $(id+" .large-half .times-both").show();
            $(id+" .large-half .period-time").show();
        }
    })
}
//修改 删除模态框添加自定义 ids
addAttrIds("#tab_chargeSetting",".modify","#chargeSettingModify .determine");
addAttrIds("#tab_chargeSetting",".delete","#chargeSettingDelete .to_delete");
//临时收费设置 添加 修改
function addModifyFun(id){
    $("body").on("click",id+" .determine",function(){
        var HowWay,data;
        var freeTime,maxPrice;
        var chargeName=$(id+" .chargeName").val();
        var chargeNum=$(id+" .chargeNum").val();
        var Mids=$(id+" .modelSizeList").attr("ids");
        var CSids=$(id+" .chargeTypeList").attr("ids");
        if(Mids==0 && CSids==1) HowWay=0;
        else if(Mids==0 && CSids==2) HowWay=1;
        else if(Mids==0 && CSids==3) HowWay=2;
        else if(Mids==1 && CSids==1) HowWay=3;
        else if(Mids==1 && CSids==2) HowWay=4;
        else if(Mids==1 && CSids==3) HowWay=5;
        else if(Mids==2 && CSids==1) HowWay=6;
        else if(Mids==2 && CSids==2) HowWay=7;
        else if(Mids==2 && CSids==3) HowWay=8;
        data="&temp.chargeName="+chargeName+"&temp.chargeNum="+chargeNum+"&temp.Cartype="+Mids+"&temp.HowWay="+HowWay;
        if(CSids==1){
            freeTime=$(id+" .per-time .freeTime").val();
            var perPrice=$(id+" .per-time .perPrice").val();
            data="&temp.freeTime="+freeTime+"&temp.price="+perPrice+data;
        }else if(CSids==2){
            var timeYStr="",payStr="";
            freeTime=$(id+" .times-both .freeTime").val();
            maxPrice=$(id+" .a-time .maxPrice").val();
            var aTStartTxt=$(id+" .a-time").find(".startTo");
            var aTPayTxt=$(id+" .a-time").find(".pay");
            for(var i=0;i<aTStartTxt.length;i++){
                timeYStr+=aTStartTxt.eq(i).val()+",";
                payStr+=aTPayTxt.eq(i).val()+",";
            }
            timeYStr=(timeYStr.substring(timeYStr.length-1)==',')?timeYStr.substring(0,timeYStr.length-1):timeYStr;
            payStr=(payStr.substring(payStr.length-1)==',')?payStr.substring(0,payStr.length-1):payStr;
            data="&temp.freeTime="+freeTime+"&temp.TimeY="+timeYStr+"&temp.pay="+payStr+"&temp.maxprice="+maxPrice+data;
        }else if(CSids==3){
            var dayStr="",nightStr="",dayPayStr="",nightPayStr="";
            freeTime=$(id+" .times-both .freeTime").val();
            maxPrice=$(id+" .period-time .maxPrice").val();
            var dayTxt=$(id+" .dayTime").find(".startTo");
            var dayPayTxt=$(id+" .dayTime").find(".pay");
            var nightTxt=$(id+" .nightTime").find(".startTo");
            var nightPayTxt=$(id+" .nightTime").find(".pay");
            for(var i=0;i<dayTxt.length;i++){
                dayStr+=dayTxt.eq(i).val()+"-";
                dayPayStr+=dayPayTxt.eq(i).val()+"-";
            }
            for(var i=0;i<nightTxt.length;i++){
                nightStr+=nightTxt.eq(i).val()+"-";
                nightPayStr+=nightPayTxt.eq(i).val()+"-";
            }
            dayStr=(dayStr.substring(dayStr.length-1)=='-')?dayStr.substring(0,dayStr.length-1):dayStr;
            dayPayStr=(dayPayStr.substring(dayPayStr.length-1)=='-')?dayPayStr.substring(0,dayPayStr.length-1):dayPayStr;
            nightStr=(nightStr.substring(nightStr.length-1)=='-')?nightStr.substring(0,nightStr.length-1):nightStr;
            nightPayStr=(nightPayStr.substring(nightPayStr.length-1)=='-')?nightPayStr.substring(0,nightPayStr.length-1):nightPayStr;
            var timeX="8-20"+","+"20-8";
            var TY=dayStr+","+nightStr, PStr=dayPayStr+","+nightPayStr;
            data="&temp.freeTime="+freeTime+"&temp.TimeX="+timeX+"&temp.TimeY="+TY+"&temp.pay="+PStr+"&temp.maxprice="+maxPrice+data;
        }
        if($(this).attr("ids")){
            var ids=$(this).attr("ids");
            data="$temp.id="+ids+data;
        }
        ajaxParkRequest("temporaryChargeAction!addtemporarycharge.action",data,"chargeSettingTable");
        $(id+" input").val("");
        $(id+" .areaZoneList span").text("请选择");
    })
}
addModifyFun("#addChargeSetting");//添加
addModifyFun("#chargeSettingModify");//修改
//递增验证
function increase(id){
    $(id+" .startTo").on("blur",function(){
        var th=parseFloat($(this).val());
        if($(id+" .chargeTypeList").attr("ids")==2){
            if(th>24){
                alert("按时收费时长不能超过24小时！");
                return $(this).val("");
            }
        }else if($(id+" .chargeTypeList").attr("ids")==3){
            if(th>12){
                alert("按时段收费时长不能超过12小时！");
                return $(this).val("");
            }
        }
        var stTxt=$(id).find(".startTo");
        if(stTxt.length>=2){
            if($(this).parent().prev("li").children(".startTo")){
                var prevTh=parseFloat($(this).parent().prev("li").children(".startTo").val());
                if(th<=prevTh){
                    //msgTips("输入的小时数为递增形式，必须大于上一个小时数！");
                    alert("输入的小时数为递增形式，必须大于上一个小时数！");
                    return $(this).val("");
                }
            }
        }
    })
}
//临时收费设置 删除
$("body").on("click","#chargeSettingDelete .to_delete",function(){
    var ids=$(this).attr("ids");
    var data="&id="+ids;
    ajaxParkRequest("temporaryChargeAction!deletetemporaryCharge.action",data,"chargeSettingTable");
});

//车辆闲时出租  查询    //展示的接口有bug
$(".rent_at_leisure").on('click',function(){
    queryRentLeisure();
});
function queryRentLeisure(){
    ajaxParkRequest("parkingRentSetAtion!showparkingrenset.action","","addRentLeisure");
}
//车辆闲时出租 
function addRentLeisure(list){
    //console.log(list);
    //$.each(list,function(i,sysItem){
    //    console.log(sysItem);
    //    -----------------------------------------------------------------
    //})
}
//车辆闲时出租  修改 确认
$("body").on('click','#tab_hire_set .box .determine',function(){
    $("#tab_hire_set .btns .modify").removeClass("disabled");
    $("#tab_hire_set .box .b_footer").css("display","none");
    var id="#tab_hire_set .sys_contain";
    var commission=$(id+" .commission input").val();
    var returnTime=$(id+" .returnTime input").val();
    var returnIds=$(id+" .returnWay .refundWayList").attr("ids");
    var returnIdsVal=$(id+" .returnWay .refundWayList span").text();
    var data="&parkingrentset.royaltyRate="+commission+"&parkingrentset.returnType="+returnIdsVal;//++------------------------------------
    //ajaxParkRequest("parkingRentSetAtion!updateparkingrentset.action",data,"queryRentLeisure");
    $(id+" li>input").css("display","none");
    $(id+" li>.dropdown").css("display","none");
    $(id+" li>b").css("display","inline-block");
});
//车辆闲时出租 修改 取消
$("body").on('click','#tab_hire_set .box .cancel',function(){
    $("#tab_hire_set .btns .modify").removeClass("disabled");
    $("#tab_hire_set .box .b_footer").css("display","none");
    var id="#tab_hire_set .sys_contain";
    $(id+" li>input").css("display","none");
    $(id+" li>.dropdown").css("display","none");
    $(id+" li>b").css("display","inline-block");
});
//车辆闲时出租 修改
$("body").on('click','#tab_hire_set .btns .modify',function(){
    $("#tab_hire_set .btns .modify").addClass("disabled");
    $("#tab_hire_set .box .b_footer").css("display","block");
    var id="#tab_hire_set .sys_contain";
    $(id+" .commission input").val($(id+" .commission b").text());
    $(id+" .returnTime input").val($(id+" .returnTime b").text());
    $(id+" .returnWay .refundWayList span").text($(id+" .returnWay b").text());
    $(id+" li>.dropdown").css("display","inline-block");
    $(id+" li>input").css("display","inline-block");
    $(id+" li>b").css("display","none");
});
//车位闲时出租管理 周期
cycleType("#addHireManagement");
function cycleType(id){
    $("body").on("click",id+" .cycleHireList-menu li>a",function(){
        var ids=$(this).attr("ids");
        if(ids==1){
            $(id+" .large-half .cycle-items").hide();
        }else if(ids==2){
            $(id+" .large-half .cycle-items").show();
        }
    })
}

 

//车辆监控
$(".parkingMg .leftMonitory>.topItems>li").on('click',function(){
    $(".parkingMg .leftMonitory>.topItems>li>i").css("display","none");
    $(this).children("i").css("display","inline-block");
});
var rem,liWidth;
//$(window).resize(function () {
    rem=parseFloat(document.body.clientWidth/100 +'px');
    liWidth=7.19*rem;
//});
//过车记录
function prevNextStep(id){
    var cls=".parkingMg .leftMonitory>.bottomItems .imgs";
    var n=$(id+" "+cls+" ul").find("li").length;
    var num=7;//过车记录列表ul显示的子集数
    $(id+" "+cls+" ul").css("width",liWidth*n);
    var left= 0;
    $("body").on("click",id+" .parkingMg .imgs>.prev",function(){
        if(left>=(n-num)*liWidth){
            left=(n-num)*liWidth;
        }else{
            left+=liWidth;
        }
        $(id+" "+cls+" ul").css("left",-left);
        console.log(left);
    });
    $("body").on("click",id+" .parkingMg .imgs>.next",function(){
        if(left<=0){
            left=0;
        }else{
            left-=liWidth;
        }
        $(id+" "+cls+" ul").css("left",-left);
        console.log(left);
    });
}
prevNextStep("#tab_entranceLane");
prevNextStep("#tab_exportLane");

//反向寻车展示
$("body").on("click",".reverse_unusual",function(){
   reverseUnusualTable();
});
function reverseUnusualTable(){
    queryListByParamsPark("/parking/findcaraction!findcar.action","","reverseUnPage","queryReverseUnTable");
}
function queryReverseUnTable(list){
    var html="",len=list.length;
    $.each(list,function(i,tbodyTr){
        html+='<tr ids="'+tbodyTr.id+'"><td>'+tbodyTr.numberplate+'</td><td>'+tbodyTr.parkingCode+'</td>' +
            '<td>'+tbodyTr.carNumber+'</td></tr>';
    });
    $("#tab_reverse_car .table tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_reverse_car .tables tbody",len,10);
}
//车牌号 精确查询
$("body").on("click","#tab_reverse_car .btns .btn_search",function(){
    var txt=$(this).siblings("input").val();
    var data="&numberplate="+txt;
    ajaxParkRequest("findcaraction!findcarBynumberplate.action",data,"queryReverseUnTable");
    $("#all_paging").css("display","none");
});


//车辆分析默认表格显示
$("body").on("click",".vehicle_analysis",function(){
    VehicleAnalysisTable();
});
function VehicleAnalysisTable(){
    //今天的时间
    var day1 = new Date();
    day1.setTime(day1.getTime());
    var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
    //明天的时间
    var day2 = new Date();
    day2.setTime(day2.getTime()+24*60*60*1000);
    var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
    var data="&intime="+s1+"&outtime="+s2;
    trafficAna(data);
}
var dataTitle=[],dataIn=[],dataOut=[];
function trafficAna(da){
    dataTitle.length=0,dataIn.length=0,dataOut.length=0;
    $.ajax({
        type:'POST',
        url: parkingIp+"/parking/countparkingaction!Carcount.action",
        data: "token="+token+da,
        dataType: "json",
        success: function(data){
            var html="",len=data.obj.length;
            $.each(data.obj,function(i,tbodyTr){
                dataTitle.push(tbodyTr.time);
                dataIn.push(tbodyTr.incar);
                dataOut.push(tbodyTr.outcar);
                html+='<tr><td>'+tbodyTr.time+'</td><td>'+tbodyTr.incar+'</td><td>'+tbodyTr.outcar+'</td></tr>';
            });
            $("#tab_traffic_analysis .table tbody").html(html);
            //行数据少于10行，空行添加
            addTr("#tab_traffic_analysis .tables tbody",len,10);
            //对应柱状图
            barGraph(dataTitle,dataIn,dataOut)
        },
        error: function(){
            msgTips("请求失败！")
        }
    })
}
//车辆分析 显示格式
styleView("#tab_traffic_analysis");
function styleView(id){
    $("body").on("click",id+" .viewList-menu li>a",function(){
        var ids=$(this).attr("ids");
        if(ids==1){
            $(id+">.tables").show();
            $(id+">.parkingMg").hide();
        }else if(ids==2){
            $(id+">.tables").hide();
            $(id+">.parkingMg").show();
        }
    })
}
//车辆分析柱状图 模拟数据
$("#col_items").css({height:30*rem, width:78.7*rem});
function barGraph(dataTitle,dataIn,dataOut){
    var color1="#69c",color2="#f19149";
//var dataTitle=['一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'];
//var dataIn=[800, 820, 850, 980, 970, 710, 630, 750, 89, 901, 922, 880];
//var dataOut=[910, 960, 881, 722, 723, 645, 656, 500, 90, 980, 850, 540];
    var myChart = echarts.init(document.getElementById("col_items"));
    var option = {
        xAxis: {
            type: 'category',
            data: dataTitle
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: dataIn, //[800, 820, 850, 980, 970, 710, 630, 750, 890, 901, 922, 880],
            itemStyle:{
                normal:{
                    label:{
                        show:true,
                        textStyle:{
                            fontWeight:'bolder',
                            fontSize:'14',
                            fontFamily: '微软雅黑'
                        },
                        position:"top"
                    },
                    color:color1//'#69c'  //柱子颜色
                }
            },
            type: 'bar'
        },{
            data: dataOut, //[910, 960, 881, 722, 723, 645, 656, 500, 900, 980, 850, 540],
            itemStyle:{
                normal:{
                    label:{
                        show:true,
                        textStyle:{
                            fontWeight:'bolder',
                            fontSize:'14',
                            fontFamily: '微软雅黑'
                        },
                        position:"top"
                    },
                    color: color2 //'#f19149'
                }
            },
            type:'bar'
        }]
    };
// 为echarts对象加载数据
    myChart.setOption(option);
}
//时间段查询
$("body").on("click","#tab_traffic_analysis .btns .btn_search",function(){
    var startTime=$(this).siblings("div.startToEnd").children("input.startTime").val();
    var endTime=$(this).siblings("div.startToEnd").children("input.endTime").val();
    var data="&intime="+startTime+"&outtime="+endTime;
    trafficAna(data);
});

//黑名单管理
//黑名单管理查询
$("body").on("click",".blacklist_management",function(){
    blacklistMgTable();
});
function blacklistMgTable(){
    queryListByParamsPark("/parking/blacklistaction!showblacklist.action","","blacklistMgPage","queryBlacklistMgTable");
}
function queryBlacklistMgTable(list){
    var html="",len=list.length;
    $.each(list,function(i,tbodyTr){
        html+='<tr ids="'+tbodyTr.id+'"><td>'+tbodyTr.carnum+'</td><td>'+tbodyTr.ownername+'</td><td>'+tbodyTr.tel+'</td>' +
            '<td><a class="modify" data-toggle="modal" data-target="#blackListModify">修改</a>|' +
            '<a class="delete" data-toggle="modal" data-target="#blackListDelete">删除</a></td></tr>';
    });
    $("#tab_blackListMg .table tbody").html(html);
    //行数据少于10行，空行添加
    addTr("#tab_blackListMg .tables tbody",len,10);
    //修改时自动赋值
    blacklistMgModify();
}
//车牌号 精确查询
$("body").on("click","#tab_blackListMg .btns .btn_search",function(){
    var txt=$(this).siblings("input").val();
    var data="&carnum="+txt;
    $.ajax({
        type:'POST',
        url: parkingIp+"/parking/blacklistaction!findblacklist.action",
        data: "token="+token+data,
        dataType: "json",
        success: function(data){
            var html="",len=data.obj.length;
            $.each(data.obj,function(i,tbodyTr){
                html+='<tr ids="'+tbodyTr.id+'"><td>'+tbodyTr.carnum+'</td><td>'+tbodyTr.ownername+'</td><td>'+tbodyTr.tel+'</td>' +
                    '<td><a class="modify" data-toggle="modal" data-target="#blackListModify">修改</a>|' +
                    '<a class="delete" data-toggle="modal" data-target="#blackListDelete">删除</a></td></tr>';
            });
            $("#tab_blackListMg .table tbody").html(html);
            //行数据少于10行，空行添加
            addTr("#tab_blackListMg .tables tbody",len,10);
            //修改时自动赋值
            blacklistMgModify();
        },
        error: function(){
            msgTips("请求失败！")
        }
    })
    $("#all_paging").css("display","none");
});
//修改时自动赋值
function blacklistMgModify(){
    $("#tab_blackListMg tbody td .modify").on("click",function(){
        var id="#blackListModify";
        $(id+" .numPlate").val($(this).parents("tr").children("td:first-child").text());
        $(id+" .ownerName").val($(this).parents("tr").children("td:nth-child(2)").text());
        $(id+" .ownerPhone").val($(this).parents("tr").children("td:nth-child(3)").text());
    })
}
//添加
$("body").on("click","#addBlackListMg .determine",function(){
    var id="#addBlackListMg .large-half";
    var numPlate=$(id+" .numPlate").val();
    var ownerName=$(id+" .ownerName").val();
    var ownerPhone=$(id+" .ownerPhone").val();
    var data="&bl.carnum="+numPlate+"&bl.ownername="+ownerName+"&bl.tel="+ownerPhone;
    ajaxParkRequest("blacklistaction!addblacklist.action",data,"blacklistMgTable");
});
//添加自定义属性
addAttrIds("#tab_blackListMg",".modify","#blackListModify .determine");
addAttrIds("#tab_blackListMg",".delete","#blackListDelete .to_delete");
//修改
$("body").on("click","#blackListModify .determine",function(){
    var ids=$(this).attr("ids");
    var id="#blackListModify .large-half";
    var numPlate=$(id+" .numPlate").val();
    var ownerName=$(id+" .ownerName").val();
    var ownerPhone=$(id+" .ownerPhone").val();
    var data="&bl.id="+ids+"&bl.carnum="+numPlate+"&bl.ownername="+ownerName+"&bl.tel="+ownerPhone;
    ajaxParkRequest("blacklistaction!updateblacklist.action",data,"blacklistMgTable");
});
//删除
$("body").on("click","#blackListDelete .to_delete ",function(){
    var ids=$(this).attr("ids");
    var data="&id="+ids;
    ajaxParkRequest('blacklistaction!delblacklist.action',data,"blacklistMgTable");
});





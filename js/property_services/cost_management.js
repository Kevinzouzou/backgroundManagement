/**
 * Created by along on 2017/11/10 费用管理
 */
$(".calendar").click(function(){
    $(this).blur();
});
//《--费项js交互--
function emptyCostItem(type){
//清空费项表单
    if(type=="add"){
        $("#addCostItemModal .modal-title").text("添加费项");
        $("#submitCostItemBut").text("添加");
    }else if(type=="modify"){
        $("#addCostItemModal .modal-title").text("修改费项");
        $("#submitCostItemBut").text("修改");
    };
    $("#costItemAddForm").find("input,textarea").val("");
    $("#costItemAddForm .dropdown").attr("optionid","").find("a.dropdown-toggle span").text("");
    $("#cost_item_scope_edit,#cost_item_price_li,#cost_item_sum_money_li,#cost_item_scope_handle,#cost_item_ladder").hide();
    costType("1");
}
$("#chargetype .dropdown-menu a").click(function(){
    //收费类别
    let val=$(this).attr("codelist");
    costType(val);
});
function costType(val){
//收费类别
    if(val!="1"){
        $("#chargecycle").addClass("disabled");
    }else{
        $("#chargecycle").removeClass("disabled");
    }
}
$("#chargeformula .dropdown-menu a").click(function(){
    //计费方式
    let val=$(this).attr("codelist");
    change_cost_item_formula(val)
});
function change_cost_item_formula(val){
//计费公式
    if(val==1){
        $("#cost_item_price_li,#cost_item_scope_edit,#cost_item_scope_handle,#cost_item_ladder").hide();
        $("#cost_item_sum_money_li").show();
    }else if(val==2){
        $("#cost_item_sum_money_li,#cost_item_scope_edit,#cost_item_scope_handle,#cost_item_ladder").hide();
        $("#cost_item_price_li").show();
    }else if(val==3){
        $("#cost_item_price_li,#cost_item_sum_money_li").hide();
        $("#cost_item_scope_edit,#cost_item_scope_handle,#cost_item_ladder").show();
        $("#cost_item_scope_edit").find("a").css("color","#cccccc");
    }
}
function add_cost_item_scope(){
    //添加阶梯性收费
    let insertHtml = '<li class="ipt center"><span>范围</span>' +
        '<input class="input1" type="text" disabled="disabled" style="color:#cccccc"/>~<input class="input2" type="text"/>' +
        '<div class="pull-right"><span>单价</span>' +
        '<input class="input3" type="text"/></div></li>';
    $('#costItemLast').before(insertHtml);
    $("#costItemLast input.input1").val("");
    max_val();
}
function del_cost_item_scope(){
    //删除阶梯性收费
    $('#costItemLast').prev(".center").remove();
    max_val();
}
function finish_cost_item_scope(){
    //完成编辑阶梯性收费
    let costLadderInputs=$("#cost_item_ladder li.ipt");
    let inputLth=costLadderInputs.length;
    $("#cost_item_scope_handle").hide();
    $("#cost_item_scope_edit").find("a").css("color","#69c");
    $("#cost_item_ladder").css("color","#ccc");
    $("#cost_item_ladder input").attr("disabled","disabled");
}
function cost_item_edit(){
    //编辑阶梯性收费
    $("#cost_item_scope_handle").show();
    $("#cost_item_scope_edit").find("a").css("color","#cccccc");
    $("#cost_item_ladder").css("color","#333");
    $("#cost_item_ladder input.input3,#costItemFirst input.input2,#cost_item_ladder .center input").removeAttr("disabled");
}
function max_val(){
    $("#costItemFirst .input1").val("0");
    //阶梯型收费  范围自动补全;
    $("#costItemFirst").find("input.input2").change(function(){
        let first_val=$(this).val();
        $("#costItemFirst").next("li").find("input.input1").val(parseInt(first_val)+1);
    })
    $("#costItemLast").prev("li").find("input.input2").change(function(){
        let last_val=$(this).val();
        $("#costItemLast input.input1").val(parseInt(last_val)+1);
    });
    let list=$("#cost_item_ladder li").length;
    let first_val2=$("#costItemFirst").find("input.input2").val();
    if(list>2){
        $("#costItemFirst").next("li").find("input.input1").val(parseInt(first_val2)+1);
        $("#costItemLast input.input1").val("");
    }else if(list==2){
        $("#costItemLast input.input1").val($("#costItemFirst input.input2").val());
    };
};
//《--账单设置js交互--
$("#tab_bill_set .notTime").click(function(){
    $(this).parent("ul").prev("a span").attr("time","");
})
$("#tab_bill_set .setTime").click(function(){
    let prefixId=$(this).attr("prefixId");
    $("#submitTimeBut").attr("prefixId",prefixId);
    $("#setTimeModal").modal("show");
});
$("#submitTimeBut").click(function(){
    let prefixId=$(this).attr("prefixId");
    let day=$("#setDay").val();
    let hour=$("#setHour").val();
    let minute=$("#setMinute").val();
    if(day<1||day>31){
        alert("当前设置"+day+"日，不能小于1大于31");
    }else if(day<0||hour>23){
        alert("当前设置"+hour+"时，不能小于0大于23");
    }else if(day<0||minute>59){
        alert("当前设置"+minute+"分，不能小于0大于59");
    }else{
        $("#"+prefixId+" span").text("每月"+day+"日"+hour+"时"+minute+"分");
        if(hour.length<2){
            hour="0"+hour;
        }
        if(minute.length<2){
            minute="0"+minute;
        }
        let times=day+"-"+hour+":"+minute+":"+"00";
        $("#"+prefixId).attr("time",times);
        if(prefixId=="pushtime"){
            $("#tab_bill_set #closetime").attr("pushDay",day);
        }
        $("#setTimeModal").modal("hide");
        $("#setDay,#setHour,#setMinute").empty();
    }
});
$("#pushingTime").val(nowYear+"-"+nowMonth+"-"+daycount);
$("#setTimeModal #setDay").attr("max",daycount);
$("#tab_bill_set  #closetime").on("input",function(){;
    let pushDay=$(this).attr("pushDay");
    let this_val=$(this).val();
    if(this_val.length>2){
        $(this).val(this_val.slice(0,2));
    };
    if(daycount-pushDay<this_val){
        $(this).val(daycount-pushDay);
    }
});
$("#tab_bill_set .reset").click(function(){
    //账单设置重置
    $("#tab_bill_set #createtime span,#tab_bill_set #pushtime span,#tab_bill_set #pushtype .pushtype span,#tab_bill_set #isopen .isopen span").empty();
    $("#tab_bill_set #createtime,#tab_bill_set #pushtime").attr("time","");
    $("#tab_bill_set #pushtype,#tab_bill_set #isopen").attr("optionid","");
    $("#tab_bill_set #closetime,#tab_bill_set #latefeeratio").val("");
});
$("#resetTimeModalBut").click(function(){
    //设定时间重置
    $("#setTimeModal .timer input").val("");
});
//《--收费项目弹框隐藏重置body滚动条--
$('#select_fee_item').on('hidden.bs.modal',function(e){
    setTimeout(function(){
        $("body").addClass("modal-open");
    },100);
});
//inquireType查询类型（费项costItem、收费chargingSet、账单设置billSet、账单详情billDetails、推送manualPush、缴费userPay、欠费通知arrearageNotice 重要条件参数！）
//--加载初始方法--
var inquireType;
function costManagementInitialize(inquireTypes){
    inquireType=inquireTypes;
    pageDataCost(inquireTypes);
    if(inquireTypes=="chargingSet"||inquireTypes=="billDetails"||inquireTypes=="manualPush"||inquireTypes=="userPay"||inquireTypes=="arrearageNotice"){
        menuAddress(inquireTypes+"Address");
    };
};
$("#property_service_menu .cost_management a").click(function (){
    max_val();
    pageDataCost("costItem");
    chargeName();
    modeid();
    totalBill("","","","","","arrearageNotice");
});
//--表单验证--
function verifyCostItem(prefixId){
    //---------------费项
    let itemcode=$("#"+prefixId+" #itemcode").val();//费项编号
    if(!itemcode){msgTips("请填写费项编号");return;};
    let itemname=$("#"+prefixId+" #itemname").val();//费项名称
    if(!itemname){msgTips("请填写费项名称");return;};
    let chargecategory=$("#"+prefixId+" .chargetype").attr("optionid");//收费类别
    if(!chargecategory){msgTips("请选择收费类别");return;};
    let chargecycle="";//计费周期
    if(chargecategory=="1"){
        chargecycle=$("#"+prefixId+" .chargecycle").attr("optionid");
        if(!chargecycle){msgTips("请选择计费周期");return;};
    };
    let modeid=$("#"+prefixId+" .modeid").attr("optionid");//计费方式
    if(!modeid){msgTips("请选择计费方式");return;};
    let modename=$("#"+prefixId+" .modeid .option_type").text();
    let chargeformula=$("#"+prefixId+" .chargeformula").attr("optionid");//计费公式
    if(!chargeformula){msgTips("请选择计费公式");return;};
    let price="";//单价
    if(chargeformula=="1"){
        price=$("#"+prefixId+" #cost_item_sum_money").val();
        if(!price){msgTips("请填写金额");return;};
    }else if(chargeformula=="2"){
        price=$("#"+prefixId+" #cost_item_price").val();
        if(!price){msgTips("请填写单价");return;};
    }else if(chargeformula=="3"){
        let costLadderInputs=$("#cost_item_ladder li.ipt");
        let inputLth=costLadderInputs.length;
        costLadderInputs.each(function(index){
            let put1=$(this).find(".input1").val();
            let put2=$(this).find(".input2").val();
            let put3=$(this).find(".input3").val();
            if(index==inputLth-1){
                price=price+","+put1+"+"+":"+put3;
            }else{
                price=price+","+put1+"-"+put2+":"+put3;
            };
        });
        price=price.substr(1,price.length);
        if(!$(".input1").val()||!$(".input2").val()){msgTips("请填写阶梯性收费范围");return;};
        if(!$(".input3").val()){msgTips("请填写阶梯性收费单价");return;};
    };
    let remark=$("#"+prefixId+" #remark").val().replace(/(\s*)/g,'')//备注
    let formData={
        "itemcode":itemcode,
        "itemname":itemname,
        "chargecategory":chargecategory,
        "chargecycle":chargecycle,
        "chargeformula":chargeformula,
        "modeid":modeid,
        "modename":modename,
        "price":price,
        "remark":remark
    };
    return formData;
};
function verifyChargingSet(prefixId){
    //---------------收费
    let ownercode=$("#"+prefixId+" .doorplateAds").attr("optionId");
    if(!ownercode){msgTips("请选择房屋地址");return;};
    let starttime=$("#"+prefixId+" #chargingBeginTime").val();
    if(!starttime){msgTips("请选择起始时间");return;};
    let endtime=$("#"+prefixId+" #chargingOverTime").val();
    if(!endtime){msgTips("请选择结束时间");return;};
    let itemids="",itemlist="";
    let listLi=$("#addPro li");
    let ids=$("#submitChargingSetBut").attr("ids");
    listLi.each(function(){
        let id=$(this).attr("id");
        itemids=itemids+","+id;
        let name=$(this).attr("name");
        let number=$(this).attr("number");
        if(!number){number="0"};
        let name_number=id+":"+number;
        itemlist=itemlist+","+name_number;
    });
    itemids=itemids.substr(1,itemids.length);
    itemlist=itemlist.substr(1,itemlist.length-1);
    if(!$("#addPro .number").val()){msgTips("请填写设备编号");return;};
    if(!itemlist){msgTips("请添加收费项目");return;};
    let remark=$("#"+prefixId+" #chargingRemark").val();
    let formData={
        "itemlist":itemlist,
        "ids":ids,
        "ownercode":ownercode,
        "starttime":starttime,
        "endtime":endtime,
        "itemids":itemids,
        "remark":remark
    };
    return formData;
};
function verifyBill(){
    //---------------账单设置
    let createtime=$("#createtime").attr("time");
    let pushtime=$("#pushtime").attr("time");
    let pushtype=$("#pushtype .pushtype").attr("optionId");
    let closetime=$("#closetime").val();
    let latefeeratio=$("#latefeeratio").val();
    let isopen=$("#isopen .isopen").attr("optionId");
    let ids=$("#submitBillBut").attr("ids");
    let formData={
        "id":ids,
        "createtime":createtime,
        "pushtime":pushtime,
        "pushtype":pushtype,
        "closetime":closetime,
        "latefeeratio":latefeeratio,
        "isopen":isopen
    };
    return formData;
};
function verifyModifyUser(){
    //---------------
    let ids=$("#submitModifyUserBut").attr("ids");
    let latefee=$("#overdueFine").val();
    let discount=$("#discount").val();
    let writeoff=$("#eliminate").val();
    let formData={
        "id":ids,
        "latefee":latefee,
        "discount":discount,
        "writeoff":writeoff
    };
    return formData;
};
//--回显赋值--
function echoEchoCostItem(prefixId,this_){
    //---------------费项
    let itemcode=$(this_).parents("tr").find("td").eq(0).text();//费项编号
    $("#"+prefixId+" #itemcode").val(itemcode);
    let itemname=$(this_).parents("tr").find("td").eq(1).text();//收费名称
    $("#"+prefixId+" #itemname").val(itemname);
    let chargecategory=$(this_).parents("tr").find("td").eq(2).attr("value");//收费类别
    let chargecategoryTexe=$(this_).parents("tr").find("td").eq(2).text();//收费类别
    $("#"+prefixId+" #chargetype .chargetype").attr("optionid",chargecategory);
    $("#"+prefixId+" #chargetype .dropdown-toggle span").text(chargecategoryTexe);
    if(chargecategory=="1"){
        let chargecycle=$(this_).parents("tr").find("td").eq(5).attr("value");//计费周期
        let chargecycleTexe=$(this_).parents("tr").find("td").eq(5).text();//计费周期
        $("#"+prefixId+" #chargecycle .chargecycle").attr("optionid",chargecycle);
        $("#"+prefixId+" #chargecycle .option_type").text(chargecycleTexe);
    }else{
        costType("2");
    };
    let modeid=$(this_).parents("tr").find("td").eq(3).attr("value");//计费方式
    let modeidTexe=$(this_).parents("tr").find("td").eq(3).text();//计费方式
    $("#"+prefixId+" #modeid .modeid").attr("optionid",modeid);
    $("#"+prefixId+" #modeid .option_type").text(modeidTexe);
    let chargeformula=$(this_).parents("tr").find("td").eq(4).attr("value");//计费公式
    let chargeformulaTexe=$(this_).parents("tr").find("td").eq(4).text();//计费公式
    $("#"+prefixId+" #chargeformula .chargeformula").attr("optionid",chargeformula);
    $("#"+prefixId+" #chargeformula .option_type").text(chargeformulaTexe);
    let price=$(this_).parents("tr").find("td").eq(6).text();//金额
    if(chargeformula=="1"){
        change_cost_item_formula(1)
        $("#"+prefixId+" #cost_item_sum_money").val(price);
    }else if(chargeformula=="2"){
        change_cost_item_formula(2)
        $("#"+prefixId+" #cost_item_price").val(price);
    }else if(chargeformula=="3"){
        change_cost_item_formula(3);
    };
    let remark=$(this_).parents("tr").find("td").eq(7).attr("content");//备注
    $("#"+prefixId+" #remark").val(remark);
};
function echoEchoChargingSet(prefixId,this_){
    //---------------收费设置
    let ownercode=$(this_).parents("tr").find("td").eq(0).attr("ownercode");//地址
    let id=$(this_).attr("ids");
    let itemids=$(this_).attr("itemids");
    $("#"+prefixId+" .doorplateAds").attr("optionId",ownercode);
    let lastOf1=ownercode.indexOf("z")+1;
    let buildingCode1=ownercode.substring(0,lastOf1);
    unitAddress("chargingAds",buildingCode1);
    let lastOf2=ownercode.indexOf("b")+1;
    let buildingCode2=ownercode.substring(0,lastOf2);
    unitAddress("unitAds",buildingCode2);
    let lastOf3=ownercode.indexOf("u")+1;
    let buildingCode3=ownercode.substring(0,lastOf3);
    unitAddress("doorplateAds",buildingCode3);
    let indexD=ownercode.indexOf("d")+1;
    let addressText1=adsText(ownercode.substring(indexD,lastOf2),"isCutout");
    $("#"+prefixId+" .chargingAds .option_type").text(addressText1);
    let addressText2=adsText(ownercode.substring(lastOf2,lastOf3),"isCutout");
    $("#"+prefixId+" .unitAds .option_type").text(addressText2);
    let addressText3=adsText(ownercode.substring(lastOf3),"isCutout");
    $("#"+prefixId+" .doorplateAds .option_type").text(addressText3);
    viewChargingSet(itemids,ownercode,"modification");//收费项目
    let name=$(this_).parents("tr").find("td").eq(1).text();//业主姓名
    let phone=$(this_).parents("tr").find("td").eq(2).text();//费业主电话
    let starttime=$(this_).parents("tr").find("td").eq(3).text();//计费起始时间
    let endtime=$(this_).parents("tr").find("td").eq(4).text();//计费结束时间
    let pemark=$(this_).parents("tr").find("td").eq(6).attr("content");//备注
    $("#"+prefixId+" #chargingName").val(name);
    $("#"+prefixId+" #chargingPhone").val(phone);
    $("#"+prefixId+" #chargingBeginTime").val(starttime);
    $("#"+prefixId+" #chargingOverTime").val(endtime);
    if(pemark){
        $("#"+prefixId+" #chargingRemark").val(pemark);
    };
};
//--查询方法--
function pageDataCost(inquireType){
    if(inquireType=="costItem"){
        inquireCostItem();
    }else if(inquireType=="chargingSet"){
        chargingSetCostItem();
    }else if(inquireType=="billSet"){
        inquireBill();
    }else if(inquireType=="billDetails"){
        billDetails();
    }else if(inquireType=="manualPush"||inquireType=="userPay"||inquireType=="arrearageNotice"){
        totalBill();
    };
};
//《--费项--
function inquireCostItem(page,type){
    //费项
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            //console.log("查询费项:");
            //console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_cost_item .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_cost_item .pagingImplement .pageList").hide();
                $("#costItemList").html("<p>暂无数据</p>");
                $("#tab_cost_item .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_cost_item",{"functions":"inquireCostItem(homelistPage,'paging')"});
                };
                let htmlList='',lth=20;
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        let chargecategory=obj[i].chargecategory,chargecycle=obj[i].chargecycle,chargeformula=obj[i].chargeformula
                        switch (chargecategory){
                            case 1:
                                chargecategory= "周期性收费";
                                break;
                            case 2:
                                chargecategory= "临时性收费";
                                break;
                            case 3:
                                chargecategory= "押金类收费";
                                break;
                        };
                        switch (chargecycle){
                            case 1:
                                chargecycle= "日";
                                break;
                            case 2:
                                chargecycle= "月";
                                break;
                            case 3:
                                chargecycle= "季";
                                break;
                            case 4:
                                chargecycle= "年";
                                break;
                            case 5:
                                chargecycle= "一次性";
                                break;
                        };
                        switch (chargeformula){
                            case 1:
                                chargeformula= "固定金额";
                                break;
                            case 2:
                                chargeformula= "单价*数量";
                                break;
                            case 3:
                                chargeformula= "阶梯性收费";
                                break;
                        };
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].itemcode+'</td>';
                        htmlList+='<td>'+obj[i].itemname+'</td>';
                        htmlList+= '<td value="'+obj[i].chargecategory+'">'+chargecategory+'</td>';
                        htmlList+= '<td value="'+obj[i].modeid+'">'+obj[i].modename+'</td>';
                        htmlList+='<td value="'+obj[i].chargeformula+'">'+chargeformula+'</td>';
                        htmlList+='<td value="'+obj[i].chargecycle+'">'+chargecycle+'</td>';
                        htmlList+='<td>'+obj[i].price+'</td>';
                        if(obj[i].remark.length>lth){
                            let remarkTex=obj[i].remark.substring(0,lth);
                            //htmlList+= '<td class="tooltips" content="'+obj[i].remark+'"><span class="positions ellipsis">'+remarkTex+'...'+'</span><div class="popover fade top in"><div class="arrow" style="left: 50%;"></div><div class="popover-content">'+obj[i].remark+'</div></div></td>';
                            htmlList+= '<td content="'+obj[i].remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+obj[i].remark.replace(/(\s*)/g,'')+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+obj[i].remark+'">'+obj[i].remark+'</td>';
                        }
                        htmlList+='<td><a class="modifyBut" ids="'+obj[i].id+'" type="costItem">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="costItem">删除</a> </td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#costItemList").html(htmlList);
                wipeNull("costItemList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//《--收费--
function chargingSetCostItem(page,type){
    let ownercode=$("#chargingSetAddress .btnSearch").attr("ownercode");
    if(!ownercode){
        ownercode="";
        emptySearchCondition("alertorAddress");
    };
    //收费
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargesettingAction!queryChargesetting.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "chargesetting.ownercode":ownercode
        },
        success: function (data) {
            // console.log("收费:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_charging_set .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_charging_set .pagingImplement .pageList").hide();
                $("#chargingSetList").html("<p>暂无数据</p>");
                $("#tab_charging_set .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_charging_set",{"functions":"chargingSetCostItem(homelistPage,'paging')"});
                };
                let htmlList='',lth=15,jsonExl=[];
                for(let i=0;i<10;i++){
                    if(obj[i]) {
                        let ownername,cellphone,starttime,endtime,remark;
                        if(obj[i].owner){
                            obj[i].owner.name?ownername=obj[i].owner.name:ownername="";
                            obj[i].owner.cellphone?cellphone=obj[i].owner.cellphone:cellphone="";
                        }else{
                            ownername="";
                            cellphone="";
                        }
                        if(obj[i].chargesetting){
                            obj[i].chargesetting.starttime?starttime=obj[i].chargesetting.starttime:starttime="";
                            obj[i].chargesetting.endtime?endtime=obj[i].chargesetting.endtime:endtime="";
                            obj[i].chargesetting.remark?remark=obj[i].chargesetting.remark:remark="";
                            obj[i].chargesetting.id?id=obj[i].chargesetting.id:id="";
                            obj[i].chargesetting.itemids?itemids=obj[i].chargesetting.itemids:itemids="";
                            obj[i].chargesetting.ownercode?ownercode=obj[i].chargesetting.ownercode:ownercode="";
                        }else{
                            starttime="",endtime="",remark="",id="",itemids="",ownercode="";
                        }
                        let addressText=adsText(ownercode);
                        let liston={
                            "房屋地址":addressText,
                            "业主姓名":ownername,
                            "业主电话":cellphone,
                            "计费起始时间":starttime,
                            "计费结束时间":endtime,
                            "备注":remark,
                            "收费项目编号":obj[i].itemcodes
                        };
                        jsonExl.push(liston);
                        htmlList+='<tr>';
                        htmlList+='<td ownercode="'+ownercode+'">'+addressText+'</td>';
                        htmlList+='<td>'+ownername+'</td>';
                        htmlList+= '<td>'+cellphone+'</td>';
                        htmlList+= '<td>'+starttime+'</td>';
                        htmlList+='<td>'+endtime+'</td>';
                        htmlList+='<td><a itemids="'+itemids+'" ownercode="'+ownercode+'" class="viewChargingSet">查看</a></td>';
                        if(remark.length>lth){
                            let remarkTex=remark.substring(0,lth);
                            //htmlList+= '<td class="tooltips" content="'+remark+'"><span class="positions ellipsis">'+remarkTex+'...'+'</span><div class="popover fade top in"><div class="arrow" style="left: 50%;"></div><div class="popover-content">'+remark+'</div></div></td>';
                            htmlList+= '<td content="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/(\s*)/g,'')+'")>详细</span></td>';

                        }else{
                            htmlList+= '<td content="'+remark+'">'+remark+'</td>';
                        }
                        htmlList+='<td><a class="modifyBut" ids="'+id+'" itemids="'+itemids+'" type="chargingSet">修改</a>| <a class="deleteBut" ids="'+id+'" type="chargingSet">删除</a> </td>';//| <a class="addnum" itemids="'+itemids+'" ownercode="'+ownercode+'" type="chargingSet">用量</a>
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#chargingSetList").html(htmlList);
                wipeNull("chargingSetList");
                localStorage.jsonExl=JSON.stringify(jsonExl);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function choiceCostItem(page,type){
    //添加收费-收费项目
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            // console.log("添加收费-费项:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#feeItemModal .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#feeItemModal .pagingImplement .pageList").hide();
                $("#costItemList").html("<p>暂无数据</p>");
                $("#feeItemModal .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"feeItemModal",{"functions":"choiceCostItem(homelistPage,'paging')"});
                };
                let htmlList='',lth=10;
                let chargecycle="",chargecategory="",chargeformula="";
                for(let i=0;i<obj.length;i++){
                    switch (obj[i].chargecategory){
                        case 1:
                            chargecategory= "周期性收费";
                            break;
                        case 2:
                            chargecategory= "临时性收费";
                            break;
                        case 3:
                            chargecategory= "押金类收费";
                            break;
                    };
                    switch (obj[i].chargecycle){
                        case 1:
                            chargecycle= "日";
                            break;
                        case 2:
                            chargecycle= "月";
                            break;
                        case 3:
                            chargecycle= "季";
                            break;
                        case 4:
                            chargecycle= "年";
                            break;
                        case 5:
                            chargecycle= "一次性";
                            break;
                    };
                    switch (obj[i].chargeformula){
                        case 1:
                            chargeformula= "固定金额";
                            break;
                        case 2:
                            chargeformula= "单价*数量";
                            break;
                        case 3:
                            chargeformula= "阶梯性收费";
                            break;
                    };
                    let remark=obj[i].remark;
                    if(!remark){remark=""}
                    htmlList+='<tr>';
                    htmlList+='<td>'+obj[i].itemcode+'</td>';
                    htmlList+='<td>'+obj[i].itemname+'</td>';
                    htmlList+= '<td value="'+obj[i].chargecategory+'">'+chargecategory+'</td>';
                    htmlList+= '<td value="'+obj[i].modeid+'">'+obj[i].modename+'</td>';
                    htmlList+='<td value="'+obj[i].chargeformula+'">'+chargeformula+'</td>';
                    htmlList+='<td value="'+obj[i].chargecycle+'">'+chargecycle+'</td>';
                    htmlList+='<td>'+obj[i].price+'</td>';
                    if(remark.length>lth){
                        let remarkTex=remark.substring(0,lth);
                        //htmlList+= '<td class="tooltips" content="'+obj[i].remark+'"><span class="positions ellipsis">'+remarkTex+'...'+'</span><div class="popover fade top in"><div class="arrow" style="left: 50%;"></div><div class="popover-content">'+obj[i].remark+'</div></div></td>';
                        htmlList+= '<td content="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/(\s*)/g,'')+'")>详细</span></td>';
                    }else{
                        htmlList+= '<td content="'+remark+'">'+remark+'</td>';
                    }
                    htmlList+='<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="'+obj[i].id+'" unitid="'+obj[i].unitid+'" type="checkbox"></td>';
                    htmlList+='</tr>';
                };
                $("#feeItem").html(htmlList);
                wipeNull("feeItem");
                addProDeWeight();

            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function viewChargingSet(id,ownercode,operation,page,type){
    //收费设置-查看收费项目
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!getChargeitemnewVoByid.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "ids":id,
            "ownercode":ownercode
        },
        success: function (data) {
            //    数据
            if(operation=="modification"){
                //收费设置-修改回显收费项目
                // console.log("修改回显收费项目:");
                // console.log(data);
                let datas=data.obj.data;
                let proHtml="";
                for(let n=0;n<datas.length;n++) {
                    if(!datas[n].equipCode){
                        proHtml += '<li id="' + datas[n].id + '" ids="' + datas[n].itemcode + '" name="' + datas[n].itemname + '" number="0">';
                    }else{
                        proHtml += '<li id="' + datas[n].id + '" ids="' + datas[n].itemcode + '" name="' + datas[n].itemname + '" number="'+datas[n].equipCode+'">';
                    }
                    proHtml += '<input type="text" value="' + datas[n].itemname + '" disabled="disabled"/>';
                    proHtml += '<span class="icon"></span>';
                    if(!datas[n].equipCode){
                        proHtml += '<input type="text" class="number" value="0" disabled="disabled" />';
                    }else{
                        proHtml += '<input type="text" class="number" value="'+datas[n].equipCode+'" />';
                    }
                    proHtml += '<a class="delete">删除</a>';
                    proHtml += '</li>';
                }
                $("#addPro").html(proHtml);
            }else{
                // console.log("查看收费项目:");
                // console.log(data);
                $("#viewChargingSetPushList").empty();
                if(data.obj){
                    var obj=data.obj.data;
                    var pageList=obj.length;
                    var totalNum=data.obj.data_count;
                    $("#view_charging_set .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
                };
                if(totalNum==0){
                    $("#view_charging_set .pagingImplement .pageList").hide();
                    $("#viewChargingSetPushList").html('未添加收费项目');
                    $("#view_charging_set .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
                }else if(obj){
                    if(!type||type!="paging"){
                        pagingPlugin(pageList,totalNum,"view_charging_set",{"functions":"viewChargingSet(id,ownercode,operation,homelistPage,'paging')"});
                    };
                    let htmlList='',lth=10;
                    let chargecycle="",chargecategory="",chargeformula="";
                    for(let i=0;i<obj.length;i++){
                        switch (obj[i].chargecategory){
                            case 1:
                                chargecategory= "周期性收费";
                                break;
                            case 2:
                                chargecategory= "临时性收费";
                                break;
                            case 3:
                                chargecategory= "押金类收费";
                                break;
                        };
                        switch (obj[i].chargecycle){
                            case 1:
                                chargecycle= "日";
                                break;
                            case 2:
                                chargecycle= "月";
                                break;
                            case 3:
                                chargecycle= "季";
                                break;
                            case 4:
                                chargecycle= "年";
                                break;
                            case 5:
                                chargecycle= "一次性";
                                break;
                        };
                        switch (obj[i].chargeformula){
                            case 1:
                                chargeformula= "固定金额";
                                break;
                            case 2:
                                chargeformula= "单价*数量";
                                break;
                            case 3:
                                chargeformula= "阶梯性收费";
                                break;
                        };
                        let remark=obj[i].remark;
                        if(!remark){remark=""}
                        htmlList+='<tr>';
                        htmlList+='<td>'+obj[i].itemcode+'</td>';
                        htmlList+='<td>'+obj[i].itemname+'</td>';
                        htmlList+= '<td value="'+obj[i].chargecategory+'">'+chargecategory+'</td>';
                        htmlList+= '<td value="'+obj[i].modeid+'">'+obj[i].modename+'</td>';
                        htmlList+='<td value="'+obj[i].chargeformula+'">'+chargeformula+'</td>';
                        htmlList+='<td value="'+obj[i].chargecycle+'">'+chargecycle+'</td>';
                        htmlList+='<td>'+obj[i].price+'</td>';
                        if(remark.length>lth){
                            let remarkTex=remark.substring(0,lth);
                            //htmlList+= '<td class="tooltips" content="'+obj[i].remark+'"><span class="positions ellipsis">'+remarkTex+'...'+'</span><div class="popover fade top in"><div class="arrow" style="left: 50%;"></div><div class="popover-content">'+obj[i].remark+'</div></div></td>';
                            htmlList+= '<td content="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/(\s*)/g,'')+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+remark+'">'+remark+'</td>';
                        }
                        htmlList+='<td>'+obj[i].equipCode+'</td>';
                        htmlList+='</tr>';
                    };
                    $("#viewChargingSetPushList").html(htmlList);
                    wipeNull("viewChargingSetPushList");
                };
                $("#view_charging_set").modal("show");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
$("#chargingSetList").on("click",".viewChargingSet",function(){
    //收费设置-查看收费项目
    let id=$(this).attr("itemids");
    let ownercode=$(this).attr("ownercode");
    viewChargingSet(id,ownercode);
});
//《--账单设置--
function inquireBill(){
    //账单设置
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billsettingAction!queryBillsetting.action",
        dataType: "json",
        data: {
            "token":permit
        },
        success: function (data) {
            // console.log("查询账单设置:");
            // console.log(data);
            //    数据
            let obj=data.obj.data;
            if(obj.length>0){
                let createtime=obj[0].createtime;//账单生成日期
                let createttext=createtime.split(/[-:]/);
                $("#tab_bill_set #createtime").attr("time",createtime);
                $("#tab_bill_set #createtime span").text("每月"+createttext[0]+"日"+createttext[1]+"时"+createttext[2]+"分");
                let pushtime=obj[0].pushtime;//推送日期
                let pushtext=pushtime.split(/[-:]/);
                $("#tab_bill_set #pushtime").attr("time",pushtime);
                $("#tab_bill_set #pushtime span").text("每月"+pushtext[0]+"日"+pushtext[1]+"时"+pushtext[2]+"分");
                $("#tab_bill_set  #closetime").attr("pushDay",pushtext[0]);
                let pushtype=obj[0].pushtype;//推送方式
                let pushtypetext="";
                switch (pushtype){
                    case 1:pushtypetext="APP推送";
                        break;
                    case 2:pushtypetext="室内机";
                        break;
                    case 3:pushtypetext="微信";
                        break;
                };
                $("#tab_bill_set .pushtype").attr("optionid",pushtype);
                $("#tab_bill_set .pushtype .option_type").text(pushtypetext);
                let closetime=obj[0].closetime;//推送后多少天
                $("#tab_bill_set  #closetime").val(closetime);
                let latefeeratio=obj[0].latefeeratio;//滞纳金百分比
                $("#tab_bill_set  #latefeeratio").val(latefeeratio);
                let isopen=obj[0].isopen;//启用
                let isopentext="";
                switch (isopen){
                    case 1:isopentext="启用";
                        break;
                    case 2:isopentext="不启用";
                        break;
                };
                $("#tab_bill_set .isopen").attr("optionid",isopen);
                $("#tab_bill_set .isopen .option_type").text(isopentext);
                $("#submitBillBut").attr("ids",obj[0].id);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//《--账单详情--
function billDetails(page,type){
    let nameHtml=$("#billDetailsAddress .chargeName .dropdown-menu li").length;
    if(nameHtml<1){
       chargeName();//收费名称
    };
    let btnSearch=$("#billDetailsAddress .btnSearch");
    let ownercode=btnSearch.attr("ownercode");
    if(!ownercode){
        ownercode="";
        emptySearchCondition("billDetailsAddress");
    };
    let charge_name=$("#billDetailsAddress .chargeName").attr("optionid");
    charge_name?"":charge_name="";
    let startime=btnSearch.attr("time0");
    startime?"":startime="";
    let endtime=btnSearch.attr("time1");
    endtime?"":endtime="";
    //账单详情
   $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billdetailnewAction!queryBilldetailnew.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "billdetailnew.ownercode":ownercode,
            "billdetailnew.itemid":charge_name,
            "startime":startime,
            "endtime":endtime
        },
        success: function (data) {
            // console.log("账单详情:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_bill_details .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_bill_details .pagingImplement .pageList").hide();
                $("#billDetailsList").html("<p>暂无数据</p>");
                $("#tab_bill_details .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_bill_details",{"functions":"billDetails(homelistPage,'paging')"});
                };
                let htmlList='';
                for(let i=0;i<obj.length;i++){
                    if(obj[i]) {
                        let address=obj[i].ownercode;
                        let addressText=adsText(address);
                        htmlList+='<tr>';
                        htmlList+='<td ownercode="'+address+'">'+addressText+'</td>';
                        htmlList+='<td>'+obj[i].ownername+'</td>';
                        htmlList+= '<td>'+obj[i].ownerphone+'</td>';
                        htmlList+= '<td itemid=" '+obj[i].itemid+'">'+obj[i].itemname+'</td>';
                        htmlList+='<td>'+obj[i].lastamount+'</td>';
                        htmlList+='<td>'+obj[i].nowamount+'</td>';
                        htmlList+='<td>'+obj[i].amount+'</td>';
                        htmlList+='<td>'+obj[i].totalprice+'</td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#billDetailsList").html(htmlList);
                wipeNull("billDetailsList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function chargeName(){
    //账单详情条件查询-收费名称(费项)
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!queryChargeitemnewVo.action",
        dataType: "json",
        data: {
            "token":permit,
            "chargeitemnewVo.id":"",
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            // console.log("收费名称:");
            // console.log(data);
            //    数据
            let obj=data.obj.data;
            let htmlList='<li><a codelist="" modename="全部">全部</a></li>';
            for(let i=0;i<obj.length;i++){
                htmlList+='<li><a codelist="'+obj[i].itemcode+'" modename="'+obj[i].itemname+'">'+obj[i].itemname+'</a></li>';
            };
            $("#billDetailsAddress .chargeName ul").html(htmlList);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//《--手动推送、用户缴费、欠费通知--
var notice="";
function totalBill(page,type,notice) {
    //手动推送、用户缴费、欠费通知
    if (inquireType == "manualPush" || inquireType == "userPay" || inquireType == "arrearageNotice"||notice=="arrearageNotice"){
        var prefixId,prefixSchId, tbodyId, ispay;
        if (inquireType == "manualPush") {
            //手动推送
            prefixId = "tab_manual_push";
            prefixSchId="manualPushAddress";
            tbodyId = "manualPushList";
            ispay = 0;
        } else if (inquireType == "userPay") {
            //用户缴费
            prefixId = "tab_user_pay";
            prefixSchId="userPayAddress";
            tbodyId = "userPayList";
            ispay = 0;
        } else if (inquireType == "arrearageNotice"||notice=="arrearageNotice") {
            //欠费通知
            prefixId = "tab_arrearage_notice";
            prefixSchId="arrearageNoticeAddress";
            tbodyId = "arrearageNoticeList";
            ispay = 1;
        };
        let btnSearch=$("#"+prefixSchId+" .btnSearch");
        let ownercode=btnSearch.attr("ownercode");
        if(!ownercode){
            ownercode="";
            emptySearchCondition(prefixSchId);
        };
        let startime=btnSearch.attr("time0");
        startime?"":startime="";
        let endtime=btnSearch.attr("time1");
        endtime?"":endtime="";
        $.ajax({
            type: "post",
            url: zoneServerIp + "/ucotSmart/billnewAction!queryBillnew.action",
            dataType: "json",
            data: {
                "token": permit,
                "pager.pages": page,
                "pager.pagesize": pageListSize,
                "bVo.ownercode": ownercode,
                "startime": startime,
                "endtime": endtime,
                "bVo.ispay": ispay
            },
            success: function (data) {
                // console.log("手动推送:");
                // console.log(data);
                //    数据
                if (data.obj) {
                    var obj = data.obj.data;
                    var pageList = obj.length;
                    var totalNum = data.obj.data_count;
                    $("#" + prefixId + " .pagingImplement .pageTips").text("当前页面共" + pageList + "条数据 总共" + totalNum + "条数据");
                };
                if (inquireType== "arrearageNotice"||notice=="arrearageNotice") {
                    if (totalNum > 0) {
                        $(".arrearage_notice span.status_details").text(totalNum).show();
                    } else {
                        $(".arrearage_notice span.status_details").text(totalNum).hide();
                    }
                    ;
                }
                ;
                if (totalNum == 0) {
                    $("#" + prefixId + " .pagingImplement .pageList").hide();
                    $("#" + tbodyId).html("<p>暂无数据</p>");
                    $("#" + prefixId + " .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
                } else if (obj) {
                    if (!type || type != "paging") {
                        pagingPlugin(pageList, totalNum, prefixId, {"functions": "totalBill(homelistPage,'paging')"});
                    }
                    ;
                    let htmlList = '',jsonExl=[];
                    for (let i = 0; i < 10; i++) {
                        if(obj[i]) {
                            let address = obj[i].bill.ownercode;//房屋地址
                            let addressText=adsText(address);
                            let ownername = obj[i].bill.ownername;//业主姓名
                            if (!ownername) {
                                ownername = "--"
                            }
                            ;
                            let cellphone = obj[i].bill.cellphone;//业主电话
                            if (!cellphone) {
                                cellphone = "--"
                            }
                            ;
                            let billingtime = "";//计费时间
                            let arrearpay = obj[i].bill.arrearpay;//欠费金额
                            let liston = {
                                "房屋地址": addressText,
                                "业主姓名": ownername,
                                "业主电话": cellphone,
                                "应交金额": obj[i].bill.totalpay,
                                "实收金额": obj[i].bill.receiptpay,
                                "欠费金额": obj[i].bill.arrearpay
                            };
                            jsonExl.push(liston);
                            let obje = new Object();
                            obje = obj[i];
                            let str = JSON.stringify(obje);
                            let billdetail = obj[i].billdetail;
                            let costDetail = "";
                            for (let p = 0; p < billdetail.length; p++) {
                                costDetail += '<li><span class="left">' + billdetail[p].itemname + '</span><span>' + billdetail[p].itemname + '</span><span>10</span><span>10</span><span>1.2</span><span>12</span></li>';
                            }
                            ;
                            htmlList += '<tr>';
                            if (inquireType == "manualPush" || inquireType == "arrearageNotice") {
                                htmlList += '<td class="notPrint"><input id="' + obj[i].bill.billid + '" type="checkbox"></td>';
                            }
                            ;
                            htmlList += '<td ownercode="' + address + '">' + addressText + '</td>';
                            htmlList += '<td>' + ownername + '</td>';
                            htmlList += '<td>' + cellphone + '</td>';
                            htmlList += '<td>' + obj[i].bill.totalpay + '</td>';
                            htmlList += '<td>' + obj[i].bill.receiptpay + '</td>';
                            htmlList += '<td>' + obj[i].bill.arrearpay + '</td>';
                            if (inquireType == "manualPush") {
                                if (obj[i].totalpay == "0") {
                                    htmlList += '<td class="notPrint"><a>修改</a>| <a>推送账单</a> </td>';
                                } else {
                                    htmlList += '<td class="notPrint"><a class="modifyBut" ids="' + obj[i].bill.billid + '" itemids="" type="payFees">修改</a>| <a class="pushBill" ids="' + obj[i].bill.billid + '" type="manualPush" type="userPay" >推送账单<i style="display:none">' + str + '</i></a> </td>';
                                }
                                ;
                            } else if (inquireType == "userPay") {
                                if (obj[i].totalpay == "0") {
                                    htmlList += '<td class="notPrint"><a>修改</a>| <a class="pushBill" ids="' + obj[i].bill.billid + '" type="userPay">缴费详情</a> </td>';
                                } else {
                                    htmlList += '<td class="notPrint"><a class="modifyBut" ids="' + obj[i].bill.billid + '" itemids="" type="payFees">修改</a>| <a class="pushBill" ids="' + obj[i].bill.billid + '" type="userPay">缴费详情<i style="display:none">' + str + '</i></a> </td>';
                                }
                            } else if (inquireType == "arrearageNotice") {
                                htmlList += '<td><a class="pushBill" ids="' + obj[i].bill.billid + '" type="arrearagePush">推送</a> </td>';
                            }
                            ;
                            htmlList += '</tr>';
                        }else if (inquireType == "manualPush"){
                            htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                        }else if (inquireType == "userPay"){
                            htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                        }else if (inquireType == "arrearageNotice"){
                            htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                        };
                    }
                    ;
                    $("#" + tbodyId).html(htmlList);
                    wipeNull(tbodyId)
                    localStorage.jsonExl=JSON.stringify(jsonExl);
                }
                ;
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    };
};
$("#newProject").click(function(){
    addProDeWeight();
    $("#feeItemModal").modal("show").css("z-index","1060");
    $("body .modal-backdrop:last-child").css("z-index","1055");
});
 function addProDeWeight(){
    //去重
    $("#feeItem input").removeAttr("disabled").removeAttr("checked");
    $("#addPro li").each(function(){
        let ids=$(this).attr("id");
        $("#feeItem input[id="+ids+"]").attr({"disabled":true,"checked":"checked"});
    });
};
var checked;
function deWeightCost(prefixId){
//去重、获取选中
    let selected=[];
    let inputs=$("#"+prefixId+" input");
    inputs.each(function(){
        if($(this).not(":disabled").is(":checked")){
            let this_id=$(this).attr("id");
            // console.log(this_id);
            checked=checked+","+this_id;
            let return_value=jQuery.inArray(this_id,selected);
            if(return_value==-1){
                selected.push(this_id);
                //去重禁选复选框
                $(this).attr({"disabled":true,"checked":"checked"});
            };
        };
    });
    addPro(selected);
    checked=checked.substr(1,checked.length);
};
$("#feeItemBut").click(function(){
    deWeightCost("feeItem");
});
function addPro(selected){
    for(let i=0;i<selected.length;i++){
        let this_ipt=$("#feeItem input#"+selected[i]);
        let ids=this_ipt.parents("tr").find("td").eq(0).text();
        let name=this_ipt.parents("tr").find("td").eq(1).text();
        let unitid=this_ipt.attr("unitid");
        let id=this_ipt.attr("id");
        let proHtml=""
            if(unitid=="4"){
                proHtml+='<li id="'+id+'" ids="'+ids+'" name="'+name+'" number="">';
            }else{
                proHtml+='<li id="'+id+'" ids="'+ids+'" name="'+name+'" number="0">';
            }
            proHtml+='<input type="text" value="'+name+'" disabled="disabled"/>';
            proHtml+='<span class="icon"></span>';
            if(unitid=="4"){
                proHtml+='<input type="text" class="number" />';
            }else{
                proHtml+='<input type="text" value="0" class="number" disabled="disabled"/>';
            };
            proHtml+='<a class="delete">删除</a>';
            proHtml+='</li>';
        $("#addPro").append(proHtml);
        $("#addPro").on("blur",".number",function(){
            $(this).parent("li").attr("number",$(this).val());
        });
    };
    $("#feeItemModal").modal("hide");
    // console.log(selected);
};
$("#addPro").on("click",".delete",function(){
    $(this).parents("li").remove();
});
//《--收费项目--
function modeid(){
    //费项计费方式
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/chargemodeAction!queryChargemode.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pagesize":pageListSize,
            "chargeitemnewVo.id":""
        },
        success: function (data) {
            // console.log("计费方式:");
            // console.log(data);
            //    数据
            let obj=data.obj.data;
            let htmlList='';
            if(obj.length>0){
                for(let i=0;i<obj.length;i++){
                    htmlList+='<li><a codelist="'+obj[i].id+'" modename="'+obj[i].modename+'">'+obj[i].modename+'</a></li>';
                };
                $("#modeid .dropdown-menu").html(htmlList);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//《--添加--
$("#tab_cost_management .addBut").click(function(){
    let id=$(this).attr("id");
    if(id=="addCostItemBut"){
        //费项
        emptyCostItem("add");
        $("#addCostItemModal #submitCostItemBut").attr({"type":"add"});
        $("#costItemFirst .input1").val("0");
        $("#addCostItemModal").modal("show");
    }else if(id=="chargingSetBut"){
        //收费
        $("#addChargingSetModal #submitChargingSetBut").attr({"type":"add"}).text("添加");
        $("#addChargingSetModal .modal-title").text("添加收费");
        $("#chargingSetModalAddress").find(".unitAds,.doorplateAds").show();
        $("#addChargingSetModal").modal("show");
        $("#chargingSetModalAddress .option_type").text("");
        $("#chargingSetForm input").val("");
        $("#chargingSetModalAddress ul,#chargingSetForm #addPro").empty();
        let chargingAds=$("#chargingSetAddress .chargingAds .dropdown-menu").html();
        $("#chargingSetModalAddress .chargingAds .dropdown-menu").html(chargingAds);
        $("#chargingSetModalAddress .chargingAds .dropdown-menu li:first-child").remove();
        choiceCostItem();
    };
});
//《--修改--
$("#tab_cost_management").on("click",".modifyBut",function(){
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let this_=$(this);
    if(type=="costItem"){
        //费项
        emptyCostItem("modify");
        echoEchoCostItem("costItemAddForm",this_);
        $("#addCostItemModal #submitCostItemBut").attr({"ids":ids,"type":"modify"});
        $("#addCostItemModal").modal("show");
        $("#costItemFirst .input1").val("0");
    }else if(type=="chargingSet"){
        //收费
        choiceCostItem();
        echoEchoChargingSet("chargingSetForm",this_);
        $("#addChargingSetModal #submitChargingSetBut").attr({"ids":ids,"type":"modify"}).text("修改");
        $("#addChargingSetModal .modal-title").text("修改收费");
        $("#chargingSetModalAddress .chargingAds ul,#chargingSetModalAddress .unitAds ul,#chargingSetModalAddress .doorplateAds ul").empty();
        $("#chargingSetModalAddress .unitAds,#chargingSetModalAddress .doorplateAds").show();
        $("#addChargingSetModal").modal("show");
        $("#chargingSetForm #addPro").on("blur",".number",function(){
            $(this).parent("li").attr("number",$(this).val());
        });
    }else if(type=="payFees"){
        //推送、缴费
        $("#modifyManualPushModal #submitModifyUserBut").attr("ids",ids);
        $("#modifyUserForm input").val("");
        $("#modifyManualPushModal").modal("show");
    };
});
//《----推送--
$(".pushBill").click(function(){
        let listId="",prefixId;
        let typeIds=$(this).attr("typeIds");
        if(typeIds=="manualPushBatch"){
            prefixId="manualPushList";
        }else if(typeIds=="manualPusHarrearage"){
            prefixId="arrearageNoticeList";
        };
        let inputs=$("#"+prefixId+" input");
        inputs.each(function(){
            if($(this).is(":checked")){
                let this_id=$(this).attr("id");
                listId=listId+","+this_id;
            };
        });
        listId=listId.substr(1,listId.length);
        if(listId){
            $.ajax({
                type: "post",
                url: zoneServerIp+"/ucotSmart/billnewAction!pushBillnew.action",
                dataType: "json",
                data: {
                    "token":permit,
                    "ids":listId
                },
                success: function (data) {
                    // console.log("推送:");
                    // console.log(data);
                    msgTips(data.msg);
                    //    数据
                },
                error: function (data, status) {
                    //msgTips("");
                }
            });
        }else{
            msgTips("请选择推送信息");
        };
    });
$("table").on("click",".pushBill",function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(type=="manualPush"||type=="userPay"){
        let prefixId="";
        if(type=="manualPush"){
            prefixId="manualPushForm";
            $("#submitManualPushBut").attr("ids",ids);
        }else if(type=="userPay"){
            prefixId="userPayForm";
            $("#submitUserPayBut").attr("ids",ids);
        }
        let str=$(this).find("i").text();
        let obje=JSON.parse(str);
        $("#"+prefixId+" .ownername").text(obje.bill.ownername);
        $("#"+prefixId+" .ownerphone").text(obje.bill.cellphone);
        $("#"+prefixId+" .owneraddress").text(adsText(obje.bill.ownercode));
        $("#"+prefixId+" .createtime").text(obje.bill.createtime);
        let bidat=obje.billdetail;
        let chargeHtml="";
        for(let l=0;l<bidat.length;l++){
            let itemname=bidat[l].itemname,lastamount=bidat[l].lastamount,nowamount=bidat[l].nowamount,amount=bidat[l].amount,unitprice=bidat[l].unitprice,totalprice=bidat[l].totalprice;
            chargeHtml+='<li><span class="left">'+itemname+'</span><span>'+lastamount+'</span><span>'+nowamount+'</span><span>'+amount+'</span><span>'+unitprice+'</span><span>'+totalprice+'</span></li>';
        }
        $("#"+prefixId+" .chargeList").html(chargeHtml);
        $("#"+prefixId+" .arrearpay").text(obje.bill.arrearpay);
        $("#"+prefixId+" .latefee").text(obje.bill.latefee);
        $("#"+prefixId+" .writeoff").text(obje.bill.writeoff);
        $("#"+prefixId+" .discount").text(obje.bill.discount);
        $("#"+prefixId+" .totalpay").text(obje.bill.totalpay);
        let datas=$(this).find("i").text();
        wipeNull("manualPushForm","span");
        if(type=="manualPush"){
            //手动推送-推送账单
            $("#submitManualPushBut").append('<i style="display:none">'+datas+'</i>');
            $("#manualPushModal").modal("show");
        }else if(type=="userPay"){
            //用户-缴费详情
            $("#userPayModal").modal("show");
        };
    }else if(type=="arrearagePush"){
        $("#submitPushingRearage").attr("ids",ids);
        $("#pushingRearage").modal("show");
    };
});
//《--提交--
$("#submitCostItemBut").click(function(){
    //费项
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let parameterData=verifyCostItem("costItemAddForm");
    // console.log(parameterData);
    if(type=="add"){
        var ajaxurl="/ucotSmart/chargeitemnewVoAction!addChargeitemnewVo.action";
        var msgtext="添加费项";
    }else if(type=="modify"){
        var ajaxurl="/ucotSmart/chargeitemnewVoAction!updateChargeitemnewVo.action";
        var msgtext="修改费项";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "pager.pagesize":pageListSize,
            "chargeitemnewVo.id":ids,
            "chargeitemnewVo.itemcode":parameterData.itemcode,
            "chargeitemnewVo.itemname":parameterData.itemname,
            "chargeitemnewVo.chargecategory":parameterData.chargecategory,
            "chargeitemnewVo.chargecycle":parameterData.chargecycle,
            "chargeitemnewVo.chargeformula":parameterData.chargeformula,
            "chargeitemnewVo.modeid":parameterData.modeid,
            "chargeitemnewVo.modename":parameterData.modename,
            "chargeitemnewVo.price":parameterData.price,
            "chargeitemnewVo.remark":parameterData.remark
        },
        success: function (data) {
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true){
                pageDataCost("costItem");
                $("#addCostItemModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitChargingSetBut").click(function(){
    //收费
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let parameterData=verifyChargingSet("chargingSetForm");
    // console.log(parameterData);
    if(type=="add"){
        var ajaxurl="/ucotSmart/chargesettingAction!addChargesetting.action";
        var msgtext="添加收费";
    }else if(type=="modify"){
        var ajaxurl="/ucotSmart/chargesettingAction!updateChargesetting.action";
        var msgtext="修改收费";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "pager.pagesize":pageListSize,
            "itemlist":parameterData.itemlist,
            "chargesetting.id":parameterData.ids,
            "chargesetting.ownercode":parameterData.ownercode,
            "chargesetting.starttime":parameterData.starttime,
            "chargesetting.endtime":parameterData.endtime,
            "chargesetting.itemids":parameterData.itemids,
            "chargesetting.remark":parameterData.remark
        },
        success: function (data) {
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true) {
                pageDataCost("chargingSet");
                $("#addChargingSetModal").modal("hide");
            }
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitBillBut").click(function(){
    let parameterData=verifyBill("submitBillBut");
    // console.log(parameterData);
    //账单设置
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billsettingAction!addBillsetting.action",
        dataType: "json",
        data: {
            "token":permit,
            "billsetting.id":parameterData.id,
            "billsetting.createtime":parameterData.createtime,
            "billsetting.pushtime":parameterData.pushtime,
            "billsetting.pushtype":parameterData.pushtype,
            "billsetting.closetime":parameterData.closetime,
            "billsetting.latefeeratio":parameterData.latefeeratio,
            "billsetting.isopen":parameterData.isopen
        },
        success: function (data) {
            // console.log("修改账单设置:");
            // console.log(data);
            //    数据
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitModifyUserBut").click(function(){
    let parameterData=verifyModifyUser("submitModifyUserBut");
    //手动推送、用户缴费 修改
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billsettingAction!addBillsetting.action",
        dataType: "json",
        data: {
            "token":permit,
            "billnew.id":parameterData.id,
            "billnew.latefee":parameterData.latefee,
            "billnew.discount":parameterData.discount,
            "billnew.writeoff":parameterData.writeoff
        },
        success: function (data) {
            // console.log("修改手动推送:");
            // console.log(data);
            //    数据
            $("#modifyManualPushModal").modal("hide");
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitBillPush").click(function(){
    let id=$("#submitBillPush").attr("ids");
    //手动推送-推送账单
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billsettingAction!addBillsetting.action",
        dataType: "json",
        data: {
            "token":permit,
            "billnew.id":parameterData.id,
            "billnew.latefee":parameterData.latefee,
            "billnew.discount":parameterData.discount,
            "billnew.writeoff":parameterData.writeoff
        },
        success: function (data) {
            // console.log("手动推送-推送账单:");
            // console.log(data);
            //    数据
            $("#modifyManualPushModal").modal("hide");
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitUserPayrBut").click(function(){
    let id=$("#submitBillPush").attr("ids");
    //用户缴费
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billnewAction!updateBillnew.action",
        dataType: "json",
        data: {
            "token":permit,
            "billnew.id":parameterData.id,
            "billnew.latefee":parameterData.latefee,
            "billnew.discount":parameterData.discount,
            "billnew.writeoff":parameterData.writeoff
        },
        success: function (data) {
            // console.log("用户缴费:");
            // console.log(data);
            //    数据
            $("#modifyManualPushModal").modal("hide");
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitPushingRearage").click(function(){
    let ids=$(this).attr("ids");
    let pushingTime=$("#pushingRearageForm #pushingTime").val();
    let pushType=$("#pushingRearageForm .rearagePushType").attr("optionid");
    //欠费推送
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billnewAction!pushBillnew.action",
        dataType: "json",
        data: {
            "token":permit,
            "ids":ids,
            "pushingTime":pushingTime,
            "pushType":pushType
        },
        success: function (data) {
            // console.log("欠费推送:");
            // console.log(data);
            $("#pushingRearage").modal("hide");
            msgTips(data.msg);
            //    数据
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitManualPushBut").click(function(){
    let ids=$(this).attr("ids");
    let pushingTime=$("#manualPushTime").val();
    let remark=$("#manualPushForm textarea").val();
    let pushType=$("#manualPushType .manualPushType").attr("optionid");
    let datas=$(this).find("i").text();
    $(this).find("i").remove();
    if(!pushingTime){
        msgTips("请选择缴费截止日期");
    }else if(!pushType){
        msgTips("请选择推送方式");
    }else{
    //手动推送
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/billnewAction!pushBillnew.action",
            dataType: "json",
            data: {
                "token":permit,
                "billjson":datas,
                "latetime":pushingTime,
                "pushtype":pushType,
                "remark":remark
            },
            success: function (data) {
                // console.log("手动推送-推送账单:");
                // console.log(data);
                $("#manualPushModal").modal("hide");
                msgTips(data.msg);
                //    数据
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    };
});
$("#submitUserPayBut").click(function(){
    let ids=$(this).attr("ids");
    let remark=$("#userPayForm textarea").val();
    let totalpay=$("#userPayForm .totalpay").text();
    $("#payForm .totalpay,#payAccomplishForm .totalpay").text(totalpay);
    $("#payModal").modal("show");
    //缴费详情
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billnewAction!pushBillnew.action",
        dataType: "json",
        data: {
            "token":permit,
            "ids":ids,
            "remark":remark
        },
        success: function (data) {
            // console.log("用户缴费-缴费详情:");
            // console.log(data);
            $("#userPayModal").modal("hide");
            msgTips(data.msg);
            //    数据
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#submitPayBut").click(function(){
    let totalpay=parseFloat($("#payAccomplishForm .totalpay").text());
    let actuallyPaid=$("#actuallyPaid").val();
    if(!actuallyPaid||actuallyPaid<totalpay){
        msgTips("实付金额有误，请确认！");
    }else{
        let looseChange=actuallyPaid-totalpay;
        $("#payAccomplishForm .pays").text(actuallyPaid);
        $("#payAccomplishForm .looseChange").text(looseChange);
        $("#payModal").modal("hide");
        $("#payAccomplishModal").modal("show");
    }
});
$("#submitAccomplishPayBut").click(function(){
    $("#payAccomplishModal").modal("hide");
    let billid=$(this).attr("ids");
    let fee=$("#payAccomplishForm .totalpay").text();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/billnewAction!commitBillnew.action",
        dataType: "json",
        data: {
            "token":permit,
            "billid":billid,
            "fee":fee
        },
        success: function (data) {
            // console.log("提交支付:");
            // console.log(data);
            msgTips(data.msg);
            //    数据
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//《--删除--
$("#tab_cost_management").on("click",".deleteBut",function(){
    let ids=$(this).attr("ids");
    let type=$(this).attr("type");
    let dataObj={"token":permit,"ids":ids};
    let callBack,ajaxURL;
    if(type=="costItem"){
        callBack="pageDataCost('costItem')";
        ajaxURL="/ucotSmart/chargeitemnewVoAction!deleteChargeitemnewVo.action";
    }else if(type=="chargingSet"){
        callBack="pageDataCost('chargingSet')";
        ajaxURL="/ucotSmart/chargesettingAction!deleteChargesetting.action";
    };
    deletePubModal(dataObj,callBack,ajaxURL);
});
//《--条件搜索--
$("#tab_cost_management").on("click",".btnSearch",function(){
    //条件搜索
    let prefixId=$(this).attr("ids");
    if(prefixId=="chargingSetAddress"){
        ownercodeGetSelected(prefixId);
        chargingSetCostItem();//收费
    }else if(prefixId=="billDetailsAddress"){
        ownercodeGetSelected(prefixId);
        billDetails();//账单详情
    }else{
        ownercodeGetSelected(prefixId);
        totalBill();//账单
    };
});
//-------------------打印---------------------------
$("#manualPushPrint").click(function(){
    sectionalPrint("manualPrint","手动推送打印数据");
});

// 添加用量
$("#chargingSetList").on("click",".addnum",function(){
    let ownercode=$(this).attr("ownercode");
    let itemids=$(this).attr("itemids");
    $("#dosagemodal").modal("show");
    // $.ajax({
    //     type: "post",
    //     url: zoneServerIp+"/ucotSmart/chargeitemnewVoAction!getChargeitemnewVoByid.action",
    //     dataType: "json",
    //     data: {
    //         "token":permit,
    //         "ownercode":ownercode,
    //         "itemids":itemids
    //     },
    //     success: function (data) {
    //         //    数据
    //         // console.log("查看收费项目:");
    //         // console.log(data);
    //         if(data.obj){
    //             var obj=data.obj.data;
    //             var pageList=obj.length;
    //             var totalNum=data.obj.data_count;
    //         };
    //         if(obj){
    //             if(!type||type!="paging"){
    //                 pagingPlugin(pageList,totalNum,"view_charging_set",{"functions":"viewChargingSet(id,ownercode,operation,homelistPage,'paging')"});
    //             };
    //             let htmlList='',lth=10;
    //             let chargecycle="",chargecategory="",chargeformula="";
    //             for(let i=0;i<obj.length;i++){
    //                 switch (obj[i].chargecategory){
    //                     case 1:
    //                         chargecategory= "周期性收费";
    //                         break;
    //                     case 2:
    //                         chargecategory= "临时性收费";
    //                         break;
    //                     case 3:
    //                         chargecategory= "押金类收费";
    //                         break;
    //                 };
    //                 switch (obj[i].chargecycle){
    //                     case 1:
    //                         chargecycle= "日";
    //                         break;
    //                     case 2:
    //                         chargecycle= "月";
    //                         break;
    //                     case 3:
    //                         chargecycle= "季";
    //                         break;
    //                     case 4:
    //                         chargecycle= "年";
    //                         break;
    //                     case 5:
    //                         chargecycle= "一次性";
    //                         break;
    //                 };
    //                 switch (obj[i].chargeformula){
    //                     case 1:
    //                         chargeformula= "固定金额";
    //                         break;
    //                     case 2:
    //                         chargeformula= "单价*数量";
    //                         break;
    //                     case 3:
    //                         chargeformula= "阶梯性收费";
    //                         break;
    //                 };
    //                 let remark=obj[i].remark;
    //                 if(!remark){remark=""}
    //                 htmlList+='<tr>';
    //                 htmlList+='<td>'+obj[i].itemcode+'</td>';
    //                 htmlList+='<td>'+obj[i].itemname+'</td>';
    //                 htmlList+= '<td value="'+obj[i].chargecategory+'">'+chargecategory+'</td>';
    //                 htmlList+= '<td value="'+obj[i].modeid+'">'+obj[i].modename+'</td>';
    //                 htmlList+='<td value="'+obj[i].chargeformula+'">'+chargeformula+'</td>';
    //                 htmlList+='<td value="'+obj[i].chargecycle+'">'+chargecycle+'</td>';
    //                 htmlList+='<td>'+obj[i].price+'</td>';
    //                 if(remark.length>lth){
    //                     let remarkTex=remark.substring(0,lth);
    //                     //htmlList+= '<td class="tooltips" content="'+obj[i].remark+'"><span class="positions ellipsis">'+remarkTex+'...'+'</span><div class="popover fade top in"><div class="arrow" style="left: 50%;"></div><div class="popover-content">'+obj[i].remark+'</div></div></td>';
    //                     htmlList+= '<td content="'+remark+'"><span>'+remarkTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+remark.replace(/(\s*)/g,'')+'")>详细</span></td>';
    //                 }else{
    //                     htmlList+= '<td content="'+remark+'">'+remark+'</td>';
    //                 }
    //                 htmlList+='<td>'+obj[i].equipCode+'</td>';
    //                 htmlList+='</tr>';
    //             };
    //             $("#dosageList").empty();
    //             $("#dosageList").html(htmlList);
    //             wipeNull("dosageList");
    //         };
    //     },
    //     error: function (data, status) {
    //         //msgTips("");
    //     }
    // });
})
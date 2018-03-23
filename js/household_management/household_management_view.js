/**
 *给住户管理加载信息列表
 */
function pageHouseHoldServiceLoadInformationList(list){
    $("#house_hold_body_house_hold").empty();
    if(list.length==0){
        $("#house_hold_body_house_hold").append("<h2>没有查询到数据</h2>");
    }else{
        $.each(list,function(key,value){
            var houseHoldJson = JSON.stringify(value).replace(/\"/g,"'");
            var houseHoldHtml = "";
            houseHoldHtml += '<tr><td>'+houseHoldCheckNull(tranUnitOwnerTenant(value.code))+'</td>'
                +'<td>'+houseHoldCheckNull(value.name)+'</td>'
                +'<td>'+houseHoldCheckNull(value.identity)+'</td>'
                +'<td>'+houseHoldCheckNull(value.gender)+'</td>'
                +'<td>'+houseHoldCheckNull(value.telephone)+'</td>'
                +'<td>'+houseHoldCheckNull(value.familynum)+'</td>'
                +'<td>'+houseHoldCheckNull(value.coveredarea)+'</td>'
                +'<td>'+houseHoldCheckNull(value.usearea)+'</td>'
                +'<td>'+houseHoldCheckNull(value.checkinstatus)+'</td>'
            if(value.chargeitem == ''){
                houseHoldHtml += '<td></td>';
            }else{
                houseHoldHtml += '<td>'+'<a href="#" onclick="houseHoldChargeItemJump(\''+houseHoldCheckNull(value.chargeitem)+'\')">详情</a>'+'</td>';
            }
            houseHoldHtml +='<td>'+houseHoldCheckNull(value.ispay>1?"欠费":"不欠费")+'</td>'
                +'<td>'+'<a href="#" onclick="houseHoldRemark(\''+houseHoldCheckNull(value.mark)+'\')">详情</a>'+'</td>'
                +'<td>'+'<a href="#" onclick="houseHoldAddChargesJump('+houseHoldJson+')">添加收费项</a>'
                +'|<a href="#" onclick="ownerInfoUpdateJump('+houseHoldJson+')">修改</a>'
                +'|<a href="#" onclick="ownerInfoDeleteJump(\''+value.code+'\')">删除</a>'+'</td>'+'</tr>';
            $('#house_hold_body_house_hold').append(houseHoldHtml);
        })
        var tds=$("#house_hold_body_house_hold tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#house_hold_body_house_hold").append('<tr>'+tdHtml+'</tr>');
            }
        }
    }
}

/**
 * 选择所有业主信息
 */
function selectOwnerInfo(){
    var imgArray = $("#house_hold_body_house_hold").find("img");
    if(selectedNum==0){
        imgArray.attr("src","img/choice.png");
        selectedNum = 9;
    }else{
        imgArray.attr("src","img/nochoice.png");
        selectedNum = 0;
    }
}

var houseImgStr = "";
function changeHouseHoldChoice(key,id){
    var imgArray = $("#house_hold_body_house_hold").find("img")[key];
    var str = imgArray.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgArray.setAttribute("src","img/nochoice.png");
        houseImgId = 0;
        houseImgId = houseImgStr.substr(0,houseImgStr.lastIndexOf(",")-1);
    }else{
        imgArray.setAttribute("src","img/choice.png");
        houseImgId = id;
        houseImgId += id + ",";
    }
}

/**
 *给住户管理加载信息列表
 */
function pageChargeItemNewVoServiceLoadInformationList(list,ulStr){
    $('#charge_item_new_vo_body').empty();
    if(list.length==0){
        $("#charge_item_new_vo_body").append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(key,value) {
            var houseHoldJson = JSON.stringify(value).replace(/\"/g,"'");
            if(ulStr.indexOf(value.id.toString())==-1){
                $('#charge_item_new_vo_body').append('<tr>'
                    +'<td>'+houseHoldCheckNull(value.itemcode)+'</td>'
                    +'<td>'+houseHoldCheckNull(value.itemname)+'</td>'
                    +'<td>'+houseHoldCheckNull(houseHoldChargeCategory(value.chargecategory))+'</td>'
                    +'<td value="'+value.modeid+'">'+houseHoldCheckNull(value.modename)+'</td>'
                    +'<td>'+houseHoldCheckNull(houseHoldChargeFormula(value.chargeformula))+'</td>'
                    +'<td>'+houseHoldCheckNull(houseHoldChargeCycle(value.chargecycle))+'</td>'
                    +'<td>'+houseHoldCheckNull(value.price)+'</td>'
                    +'<td>'+houseHoldCheckNull(value.remark)+'</td>'
                    +'<td><input id="'+value.id+'" ids="'+value.itemcode+'" names="'+value.unitid+'" name="'+houseHoldCheckNull(value.itemname)+'" type="checkbox"></td>'+'</tr>');
            }else{
                $('#charge_item_new_vo_body').append('<tr>'
                    +'<td>'+houseHoldCheckNull(value.itemcode)+'</td>'
                    +'<td>'+houseHoldCheckNull(value.itemname)+'</td>'
                    +'<td>'+houseHoldCheckNull(houseHoldChargeCategory(value.chargecategory))+'</td>'
                    +'<td value="'+value.modeid+'">'+houseHoldCheckNull(value.modename)+'</td>'
                    +'<td>'+houseHoldCheckNull(houseHoldChargeFormula(value.chargeformula))+'</td>'
                    +'<td>'+houseHoldCheckNull(houseHoldChargeCycle(value.chargecycle))+'</td>'
                    +'<td>'+houseHoldCheckNull(value.price)+'</td>'
                    +'<td>'+houseHoldCheckNull(value.remark)+'</td>'
                    +'<td><input id="'+value.id+'" ids="'+value.itemcode+'" names="'+value.unitid+'" name="'+houseHoldCheckNull(value.itemname)+'" type="checkbox" disabled="disabled" checked="checked"></td>'+'</tr>');
            }
        });
    }
}

/**
 ************给租户信息加载信息列表******************
 */
function pageTenantInfoServiceLoadInformationList(list){
    $('#tenant_info_body_tenant_info').empty();
    if(list.length==0){
        $("#tenant_info_body_tenant_info").append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(key,value) {
            var tenantInfoJson = JSON.stringify(value).replace(/\"/g,"'");
            var tenantInfoHtml = '';
            tenantInfoHtml += '<tr>'+'<td>'+tenantInfoCheckNull(tranUnitOwnerTenant(value.code))+'</td>'
                +'<td>'+tenantInfoCheckNull(value.ownername)+'</td>'
                +'<td>'+tenantInfoCheckNull(value.ownerphone)+'</td>'
                +'<td>'+tenantInfoCheckNull(value.name)+'</td>'
                +'<td>'+tenantInfoCheckNull(value.identity)+'</td>'
                +'<td>'+tenantInfoCheckNull(tenantInfoGenDar(value.gendar))+'</td>'
                +'<td>'+tenantInfoCheckNull(value.telephone)+'</td>'
                +'<td>'+tenantInfoSubStr(value.starttime)+'</td>'
                +'<td>'+tenantInfoSubStr(value.endtime)+'</td>';
            if(value.itemname=='还没有添加费项'){
                tenantInfoHtml += '<td></td>';
            }else{
                tenantInfoHtml +='<td>'+'<a href="#" onclick="tenantInfoChargeItemJump(\''+houseHoldCheckNull(value.itemname)+'\')">详情</a>'+'</td>';
            }
            tenantInfoHtml += '<td>'+tenantInfoCheckNull(value.ispay>1?"欠费":"不欠费")+'</td>'
                +'<td>'+tenantInfoCheckNull(value.contract)+'</td>'
                +'<td>'+'<a href="#" onclick="tenantInfoDetailsMark(\''+tenantInfoCheckNull(value.mark)+'\')">详情</a>'+'</td>'
                +'<td>'+'<a href="#" onclick="tenantInfoAddChargesJump('+tenantInfoJson+')">添加收费项</a>'
                +'|<a href="#" onclick="tenantInfoUpdateJump('+tenantInfoJson+')">修改</a>'
                +'|<a href="#" onclick="tenantInfoDeleteJump(\''+value.id+'\')">删除</a>'+'</td>'+'</tr>';
            $('#tenant_info_body_tenant_info').append(tenantInfoHtml);
        });
        var tds=$("#tenant_info_body_tenant_info tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#tenant_info_body_tenant_info").append('<tr>'+tdHtml+'</tr>');
            }
        }
    }
}

/**
 * 选择所有业主信息
 */
function selectTenantInfo(){
    var imgArray = $("#tenant_info_body_tenant_info").find("img");
    if(selectedNum==0){
        imgArray.attr("src","img/choice.png");
        selectedNum = 9;
    }else{
        imgArray.attr("src","img/nochoice.png");
        selectedNum = 0;
    }
}

function changeTenantInfoChoice(key,id){
    var imgArray = $("#tenant_info_body_tenant_info").find("img")[key];
    var str = imgArray.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgArray.setAttribute("src","img/nochoice.png");
        tenantImgId = 0;
        tenantImgId = tasksImgStr.substr(0,tasksImgStr.lastIndexOf(",")-1);
    }else{
        imgArray.setAttribute("src","img/choice.png");
        tenantImgId = id;
        tenantImgId += id+",";
    }
}

/**
 *给住户管理加载信息列表
 */
function pageTenantInfoNewVoServiceLoadInformationList(list,ulStr){
    $('#tenant_info_new_vo_body').empty();
    if(list.length==0){
        $("#tenant_info_new_vo_body").append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(key,value) {
            var houseHoldJson = JSON.stringify(value).replace(/\"/g,"'");
            if(ulStr.indexOf(value.id.toString())==-1){
                $('#tenant_info_new_vo_body').append('<tr>'
                    +'<td>'+tenantInfoCheckNull(value.itemcode)+'</td>'
                    +'<td>'+tenantInfoCheckNull(value.itemname)+'</td>'
                    +'<td>'+tenantInfoCheckNull(houseHoldChargeCategory(value.chargecategory))+'</td>'
                    +'<td value="'+value.modeid+'">'+tenantInfoCheckNull(value.modename)+'</td>'
                    +'<td>'+tenantInfoCheckNull(houseHoldChargeFormula(value.chargeformula))+'</td>'
                    +'<td>'+tenantInfoCheckNull(houseHoldChargeCycle(value.chargecycle))+'</td>'
                    +'<td>'+tenantInfoCheckNull(value.price)+'</td>'
                    +'<td>'+tenantInfoCheckNull(value.remark)+'</td>'
                    +'<td><input id="'+value.id+'" ids="'+value.itemcode+'" names="'+value.unitid+'" name="'+tenantInfoCheckNull(value.itemname)+'" type="checkbox"></td>'+'</tr>');
            }else{
                $('#tenant_info_new_vo_body').append('<tr>'
                    +'<td>'+tenantInfoCheckNull(value.itemcode)+'</td>'
                    +'<td>'+tenantInfoCheckNull(value.itemname)+'</td>'
                    +'<td>'+tenantInfoCheckNull(houseHoldChargeCategory(value.chargecategory))+'</td>'
                    +'<td value="'+value.modeid+'">'+tenantInfoCheckNull(value.modename)+'</td>'
                    +'<td>'+tenantInfoCheckNull(houseHoldChargeFormula(value.chargeformula))+'</td>'
                    +'<td>'+tenantInfoCheckNull(houseHoldChargeCycle(value.chargecycle))+'</td>'
                    +'<td>'+tenantInfoCheckNull(value.price)+'</td>'
                    +'<td>'+tenantInfoCheckNull(value.remark)+'</td>'
                    +'<td><input id="'+value.id+'" ids="'+value.itemcode+'" names="'+value.unitid+'" name="'+tenantInfoCheckNull(value.itemname)+'" type="checkbox" disabled="disabled" checked="checked"></td>'+'</tr>');
            }
        });
    }
}

function tenantInfoDetailsMark(mark){
    $("#tenantInfo_details").modal("show");
    $("#tenant_details_mark").html(mark);
}

function houseHoldRemark(mark){
    $("#ownerInfo_remark").modal("show");
    $("#ownerInfo_details_mark").html(mark);
}

function houseHoldChargeItemJump(chargeitem){
    $("#ownerInfo_charge_item").modal("show");
    $("#ownerInfo_details_charge_item").html(chargeitem);
}

function tenantInfoChargeItemJump(itemname){
    $("#tenantInfo_charge_item").modal("show");
    $("#tenantInfo_details_charge_item").html(itemname);
}
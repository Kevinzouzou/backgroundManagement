/**
 * Created by GIGA on 2017/8/28. 小区
 */


//$('#headbar1') $('#headbar2') $('#headbar3') $('#headbar4')
//$('#tableList1') $('#tableList2') $('#tableList3') $('#tableList4')
function zoneshow(){
    $('#zone_div1').show();
    $('#zone_div2').hide();
    $('#zone_div3').hide();
    $('#zone_div4').hide();
    $('#zone_div5').hide();
    $('#zone_div6').hide();
    $('#zone_div7').hide();
}
function buildingshow(){
    $('#zone_div2').show();
    $('#zone_div1').hide();
    $('#zone_div3').hide();
    $('#zone_div4').hide();
    $('#zone_div5').hide();
    $('#zone_div6').hide();
    $('#zone_div7').hide();
}
function unitshow(){
    $('#zone_div3').show();
    $('#zone_div1').hide();
    $('#zone_div2').hide();
    $('#zone_div4').hide();
    $('#zone_div5').hide();
    $('#zone_div6').hide();
    $('#zone_div7').hide();
}
function homelistshow(){
    $('#zone_div4').show();
    $('#zone_div5').show();
    $('#zone_div1').hide();
    $('#zone_div2').hide();
    $('#zone_div3').hide();
    $('#zone_div6').hide();
    $('#zone_div7').hide();
}
function homeupdateshow(){
    $('#zone_div6').show();
    $('#zone_div1').hide();
    $('#zone_div2').hide();
    $('#zone_div3').hide();
    $('#zone_div4').hide();
    $('#zone_div5').hide();
    $('#zone_div7').hide();
}
function homeaddshow(){
    $('#zone_div7').show();
    $('#zone_div1').hide();
    $('#zone_div2').hide();
    $('#zone_div3').hide();
    $('#zone_div4').hide();
    $('#zone_div5').hide();
    $('#zone_div6').hide();
}

/**
 * 添加小区信息按钮，弹出添加页面
 * */
function addzonemodal(){
    $("#zone-modal-add").modal();
    resetzoneform();

}

//重置添加小区表单
function resetzoneform(){
    //重置表单，调用dom方法的reset
    $('#zone-form-add')[0].reset();
}

/**
 * 导入小区按钮，弹出导入页面
 * */
function importHomelist(){
    $("#home_list_import").modal();
}

/**
 * 小区表格数据渲染,对应的表格为
 *  <thead id="zoneInfo-head1">
 <tr><th>小区名称</th>
 <th>小区地址</th>
 <th>期</th>
 <th>区</th>
 <th>总栋数</th>
 <th>小区编号</th>
 <th>操作</th></tr>
 </thead>
 <tbody id="zoneInfo-body1"></tbody>
 * */
function addZoneTableList(list){
    $("#zoneInfo-body1").empty();
    $.each(list,function(key,value) {
        sessionStorage.setItem("zonecode",value.code);
        $("#zoneInfo-body1").append('<tr>'+'<td>'+value.name+'</td>'+'<td>'+value.address+'</td>'+'<td>'+value.pz+'</td>'+
            '<td>'+value.zz+'</td>'+'<td>'+value.bz+'</td>'+'<td>'+value.uuid+'</td>'+
            '<td><a id="zoneInfo-body1-query" href="#" onclick="queryBuildingJump(\''+value.code+'\')">查看</a>|<a id="zoneInfo-body1-delete" href="#" onclick="zonedel(\''+value.code+'\')">删除</a>'+'</td>'+'</tr>');
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#zoneInfo-body1").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
    unitetdline("zoneInfo-body1");
}


/**
 * 删除小区信息弹窗
 * */
function zonedel(zoneCode){
    $("#mymodal").modal();
    $("#model-title").empty();
    $("#modal-body").empty();
    $("#modal-footer").empty();
    $('#model-title').text("删除小区").append('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
    $("#modal-body").append('<h4>删除所有楼宇后再删除该小区，是否删除？</h4>');
    $("#modal-footer").append('<button type="button" class="btn btn-warning" onclick="deleteZone(\''+zoneCode+'\')">是</button>').append('<button type="button" class="btn btn-warning" onclick="mymodalhide()">否</button>');
}



/**
 * 楼宇表格数据渲染,对应的表格为
 * <thead id="zoneInfo-head2">
 <tr><th>楼宇名称</th>
 <th>楼宇编号</th>
 <th>单元数</th>
 <th>状态</th>
 <th>操作</th></tr>
 </thead>
 <tbody id="zoneInfo-body2"></tbody>
 * */
function addBuildingTable(list){
    $("#zoneInfo-body2").empty();
    $.each(list,function(key,value) {
        if(value.unitNum==null||value.unitNum=='null'||value.unitNum==0){
            $("#zoneInfo-body2").append('<tr>'+'<td>'+value.name+'</td>'+'<td>'+tranCode(value.code)+'</td>'+'<td>'+value.unitNum+'</td>'+'<td>操作完成</td>'+'<td><a id="zoneInfo-body2-query" href="#" onclick="queryUnitJump(\''+value.code+'\')" >查看</a>|<a id="zoneInfo-body2-update" href="#" onclick="updatebuildview('+value.id+',\''+value.code+'\')">更新</a>|<a id="zoneInfo-body2-delete" href="#" onclick="isdeleteBuilding(\''+value.code+'\')">删除</a>'+'</td>'+'</tr>');
        }else{
            $("#zoneInfo-body2").append('<tr>'+'<td>'+value.name+'</td>'+'<td>'+tranCode(value.code)+'</td>'+'<td>'+value.unitNum+'</td>'+'<td>操作完成</td>'+'<td><a id="zoneInfo-body2-query" href="#" onclick="queryUnitJump(\''+value.code+'\')" >查看</a>|<span>更新完成</span>|<a id="zoneInfo-body2-delete" href="#" onclick="isdeleteBuilding(\''+value.code+'\')">删除</a>'+'</td>'+'</tr>');
        }
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#zoneInfo-body2").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
    unitetdline("zoneInfo-body2");
}
/**
 * 更新楼宇视图
 * */
function updatebuildview(id,code){
    $("#buildingupdatemodal").modal();
    $("#buldingname").val("");
    $("#unitname").val("");
    $("#building_update").attr("buildingid",id);
    $("#building_update").attr("buildingcode",code);
}

/**
 * 确认删除楼宇
 * */
function isdeleteBuilding(buildingcode){
    $("#mymodal").modal();
    $("#model-title").empty();
    $("#modal-body").empty();
    $("#modal-footer").empty();
    $('#model-title').text("删除楼宇信息").append('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
    $("#modal-body").append('<h4>删除所有单元后再删除该楼宇，确定删除？</h4>');
    $("#modal-footer").append('<button type="button" class="btn btn-warning" onclick="deletebuilding(\''+buildingcode+'\')">是</button>').append('<button type="button" class="btn btn-warning" onclick="mymodalhide()">否</button>');
}


/**
 *单元表格数据渲染，对应的表格为
 * <thead id="zoneInfo-head3">
 <tr><th>单元名称</th>
 <th>单元编号</th>
 <th>每层房屋数量</th>
 <th>最高层</th>
 <th>状态</th></tr>
 </thead>
 <tbody id="zoneInfo-body3"></tbody>
 *
 * */
function addUnitTable(list){
    $("#zoneInfo-body3").empty();
    $.each(list,function(key,value) {
        if(value.roomNum==null||value.roomNum=='null'||value.roomNum==0){
            $("#zoneInfo-body3").append('<tr>'+'<td>'+value.name+'</td>'+'<td>'+tranUnitCode(value.code)+'</td>'+'<td>'+value.roomNum+'</td>'+'<td>'+value.topfloor+'</td>'+'<td><a id="zoneInfo-body3-query" href="#" onclick="queryHomeListJump(\''+value.code+'\')" >查看</a>|<a id="zoneInfo-body3-update" onclick="updateunit('+value.id+',\''+value.code+'\')" href="#">更新</a>|<a id="zoneInfo-body3-delete" href="#" onclick="deleteunitview(\''+value.code+'\')">删除</a>'+'</td>'+'</tr>');
        }else{
            $("#zoneInfo-body3").append('<tr>'+'<td>'+value.name+'</td>'+'<td>'+tranUnitCode(value.code)+'</td>'+'<td>'+value.roomNum+'</td>'+'<td>'+value.topfloor+'</td>'+'<td><a id="zoneInfo-body3-query" href="#" onclick="queryHomeListJump(\''+value.code+'\')" >查看</a>|<span>更新完成</span>|<a id="zoneInfo-body3-delete" href="#" onclick="deleteunitview(\''+value.code+'\')">删除</a>'+'</td>'+'</tr>');
        }
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#zoneInfo-body3").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
    unitetdline("zoneInfo-body3");
}

//更新单元视图
function updateunit(id,code){
    $("#unitupdatemodal").modal();
    $("#unitname1").val("");
    $("#unithomenum").val("");
    $("#unitfloors").val("");
    $("#unit_update").attr("unitid",id);
    $("#unit_update").attr("unitcode",code);
}

/**
 * 删除单元视图
 * */
function deleteunitview(unitCode){
    $("#mymodal").modal();
    $("#model-title").empty();
    $("#modal-body").empty();
    $("#modal-footer").empty();
    $('#model-title').text("删除单元信息").append('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
    $("#modal-body").append('<h4>删除所有房屋后再删除该单元，确定删除？</h4>');
    $("#modal-footer").append('<button type="button" class="btn btn-warning" onclick="deleteunit(\''+unitCode+'\')">是</button>').append('<button type="button" class="btn btn-warning" onclick="mymodalhide()">否</button>');
}


/**
 * 房屋表格数据渲染，对应的表格是
 * <thead id="zoneInfo-head4">
 <tr><th><input type="checkbox"></th>
 <th>门牌序列号</th><th>门牌号</th><th>房屋状态</th>
 <th>建筑面积</th><th>使用面积</th><th>卫生间数</th>
 <th>厅数量</th><th>卧室数量</th><th>用途</th>
 <th>入住时间</th><th>电话号码</th><th>房产证号</th>
 <th>室内直呼</th><th>室内机数量</th><th>操作</th></tr>
 </thead>
 <tbody id="zoneInfo-body4"></tbody>
 * */
function addHomeTable(list){
    $("#zoneInfo-body4").empty();
    if(list.length==0){
        $("#zoneInfo-head4").hide();
        $("#homelist-keywordleft").hide();
        $("#zoneInfo-body4").append('<h2>没有查询到数据</h2>' );
    }else{
        $("#zoneInfo-head4").show();
        $("#homelist-keywordleft").show();
        $.each(list,function(key,value) {
            var homejson = JSON.stringify(value).replace(/\"/g,"'");
            //$("#zoneInfo-body4").append('<tr>'+'<td><input type="checkbox" name="homecheack" homeid="'+value.id+'" class="zoneInfo-body4-boxes"></td>'+'<td>'+checknull(translate(value.code))+'</td>'+'<td>'+checknull(value.name)+'</td>'+'<td>'+checknull(tranHomeStatus(value.status))+'</td><td>'+checknull(value.coveredarea)+'</td><td>'+checknull(value.usearea)+'</td><td>'+checknull(value.bathroom)+'</td><td>'+checknull(value.hall)+'</td><td>'+checknull(value.bedroom)+'</td><td>'+checknull(value.usecalssify)+'</td><td>'+checknull(subStr(value.chectinday))+'</td><td>'+checknull(value.telephone)+'</td><td>'+checknull(value.certificateid)+'</td><td>'+checknull(value.doorcontrollercode)+'</td><td>'+checknull(value.controllernum)+'</td>'+'<td>'+'<a class="zoneInfo-body4-update" onclick="homelistupdateJump('+homejson+')" >修改</a>|<a class="zoneInfo-body4-delete" onclick="deleteHomeshow('+value.id+')">删除</a>'+'</td>'+'</tr>');
            $("#zoneInfo-body4").append('<tr>'+'<td><input type="checkbox" name="homecheack" homeid="'+value.id+'" class="zoneInfo-body4-boxes"></td>'+'<td>'+checknull(translate(value.code))+'</td>'+'<td>'+checknull(value.name)+'</td>'+'<td>'+checknull(tranHomeStatus(value.status))+'</td><td>'+checknull(value.coveredarea)+'</td><td>'+checknull(value.usearea)+'</td><td>'+checknull(value.bathroom)+'</td><td>'+checknull(value.hall)+'</td><td>'+checknull(value.bedroom)+'</td><td>'+checknull(value.usecalssify)+'</td><td>'+checknull(subStr(value.chectinday))+'</td><td>'+checknull(value.telephone)+'</td><td>'+checknull(value.certificateid)+'</td><td>'+checknull(value.doorcontrollercode)+'</td><td>'+checknull(value.controllernum)+'</td>'+'<td>'+'<a class="zoneInfo-body4-update" onclick="homelistupdateJump('+homejson+')" >修改</a>|删除'+'</td>'+'</tr>');
        });
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                $("#zoneInfo-body4").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
            }
        }
        unitetdline("zoneInfo-body4");
    }
}

//显示添加房屋
function homeaddJump(){
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'homeaddshow');
    $('#all_paging').css('display','none');
    homeaddshow();
}

//修改的界面跳转，将修改的值回传
function homelistupdateJump(homejson){

    jStr='';
    for(var item in homejson){
        jStr += item+"="+homejson[item]+"$";
    }
    jStr.split('$').forEach(function(param){
        param=param.split('=');
        var name=param[0], val=param[1];
        if(val==null||val=='null'){
            val='';
        }
        if(name=='status'){
            $("#updatehomestatus option[value='"+val+"']").attr("selected",true);
        }else if(name=='usecalssify'){
            $("#homeusecalssify option[value='"+val+"']").attr("selected",true);
        }else{
            $('#home'+name+'').val(val);
        }

    });
   // $('#homeid').attr('value',homeid);
    $('#all_paging').css('display','none');
    homeupdateshow();

}

//批量删除房间信息
function deleteMultiHome(){
    var checknum=$('input[name="homecheack"]:checked').length;
    if(checknum==0){
        return;
    }else{
        $("#mymodal").modal();
        $("#model-title").empty();
        $("#modal-body").empty();
        $("#modal-footer").empty();
        $('#model-title').text("删除房屋信息").append('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
        $("#modal-body").append('<h4>即将删除选中的'+$('input[name="homecheack"]:checked').length+'条房屋信息</h4>');
        $("#modal-footer").append('<button type="button" class="btn btn-warning" onclick="deletehomes()">是</button>').append('<button type="button" class="btn btn-warning" onclick="mymodalhide()">否</button>');

    }
}
function deleteHomeshow(homeid){
    $("#mymodal").modal();
    $("#model-title").empty();
    $("#modal-body").empty();
    $("#modal-footer").empty();
    $('#model-title').text("删除房屋信息").append('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
    $("#modal-body").append('<h4>确定删除？</h4>');
    $("#modal-footer").append('<button type="button" class="btn btn-warning" onclick="deletehome('+homeid+')">是</button>').append('<button type="button" class="btn btn-warning" onclick="mymodalhide()">否</button>');
}

//mymodalhide
function mymodalhide(){
    $('#model-title').empty();
    $('#modal-footer').empty();
    $('#modal-body').empty();
    $('#mymodal').modal('hide');
}

//全选和反选
function homecheckall(){
    var checknum=$('input[name="homecheack"]:checked').length;
    if(checknum<10){
        $('input[name="homecheack"]').each(function(){
            $(this).prop("checked",true);
        });
    }else{
        $('input[name="homecheack"]:checked').each(function(){
            $(this).prop("checked",false);
        });
    }
}

/**
 * 给门口机加载信息列表 围墙机 门口机 中心机
 */
function pageEntranceMachine(list,type){
    var doorMachineBodyName = "machine_body_"+type;
    $('#'+doorMachineBodyName+'').empty();
    var typeD;
    if(list.length==0){
        $("#"+doorMachineBodyName).append('<h2>没有查询到数据</h2>' );
    }else{
        $.each(list,function(key,value) {
            if(value.mediumSoundvelume==null){
                value.mediumSoundvelume="";
            }
            if(value.callSoundvelume==null){
                value.callSoundvelume="";
            }
            if(value.brightness==null){
                value.brightness="";
            }
            if(value.type=="D"){
                typeD = tranUnitCodeBehind(value.code);
            }
            if(value.type=="W"||value.type=="C"){
                typeD = tranBlockFenceMachine(value.code);
            }
            var machineJson = JSON.stringify(value).replace(/\"/g,"'");
            if(value.type=="C"){
                $('#'+doorMachineBodyName+'').append('<tr>'+'<td><input type="checkbox" name="id" value="'+value.mac+'" class="selectAll"></td>'+'<td>'+typeD+'</td>'+'<td>'+checkNull(value.name)+'</td>'
                    +'<td>'+checkNull(tranStatus(value.status))+'<td>'+checkNull(value.ip)+'</td>'+'<td>'+checkNull(value.maskcode)+'</td>'+'<td>'+checkNull(value.gatewayip)+'</td>'+'<td>'+checkNull(value.maindns)+'</td>'+'<td>'+checkNull(tranType(value.type))+'</td>'
                    +'<td>'+value.mac+'</td>'+'<td>'+'<a href="#" onclick="machineInstallListJump('+machineJson+',\''+value.mac+'\',\''+value.type+'\')">设置</a>'+'</td>'+'</tr>');
            }else{
                var html='<tr>';
                html+='<td><input type="checkbox" name="id" value="'+value.mac+'" class="selectAll"></td>';
                html+='<td>'+typeD+'</td>';
                html+='<td>'+checkNull(value.name)+'</td>';
                html+='<td>'+checkNull(tranStatus(value.status))+'</td>';
                html+='<td>'+checkNull(value.ip)+'</td>';
                html+='<td>'+checkNull(value.maskcode)+'</td>';
                html+='<td>'+checkNull(value.gatewayip)+'</td>';
                html+='<td>'+checkNull(value.maindns)+'</td>';
                html+='<td>'+checkNull(tranType(value.type))+'</td>';
                html+='</td><td>'+checkNull(value.mac)+'</td>';
                html+='<td>';
                html+='<a onclick="doorPhonebook(\''+value.mac+ '\')">查看</a>|';
                if(value.type=="D"){
                    html+='<a onclick="updatePhoneBookDoor(\''+value.mac+ '\')">更新户户通</a>|';
                    html+='<a onclick=replaceDoorMachine('+value.id+')>发卡</a>|';
                }
                html+='<a onclick="anewReplace(' + value.id + ')">重发</a>|';
                html+='<a onclick="machineInstallListJump(' + machineJson + ',\'' + value.mac + '\',\'' + value.type + '\')">设置</a>|';
                html+='<a id="replaceVisibility"  onclick="machineReplaceJump(' + machineJson + ',\'' + value.mac + '\',\'' + value.type + '\')">替换</a>|';
                html+='<a id="updateVisibility" onclick="machineUpdateJump(' + value.id + ',\'' + value.type + '\')">更新</a>|';
                html+='<a id="detailsPush" onclick="machinePushDetailsJump(\'' + value.mac + '\',\'' + value.type + '\')">推送详情</a>';
                html+='</td></tr>';
                $('#'+doorMachineBodyName+'').append(html);
                $('#selectDoorMachine #menuDoorMachine .dropdown-menu').append('<li><a codelist="'+checkNull(value.id)+'" modename="'+checkNull(value.mac)+'">'+checkNull(value.mac)+'</a></li>');
            }
        });
        var tds=$("#"+doorMachineBodyName+" tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#"+doorMachineBodyName).append('<tr>'+tdHtml+'</tr>');
            }
        }
        unitetdline('machine_body_'+doorMachineBodyName);
    }
}

function pagePushMachine(list,type){
    var pushBodyName = "machine_body_push_"+type;
    $('#'+pushBodyName+'').empty();
    var typeD;
    if(list==null){
        $("#"+pushBodyName).append('<h2>没有查询到数据</h2>' );
    }else{
        $.each(list,function(key,value) {
            //var machineJson = JSON.stringify(value).replace(/\"/g,"'");
            $('#'+pushBodyName+'').append('<tr>'+'<td><input type="checkbox" name="id" value="'+value.id+'" class="selectAll"></td>'
                +'<td>'+checkNull(value.custormername)+'</td>'
                +'<td>'+checkNull(value.filename)+'</td>'
                +'<td>'+checkNull(machinePushFileType(value.filetype))+'</td>'
                +'<td>'+checkNull(value.mac)+'</td>'
                +'<td>'+checkNull(checkMachineStr(value.releaseTime))+'</td>'
                +'<td>'+'<a href="#" onclick="machineUndercarriageJump(\''+value.id+'\',\''+value.mac+'\',\''+type+'\')">下架</a>' +'</tr>');
        });
        var tds=$("#"+pushBodyName+" tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#"+pushBodyName).append('<tr>'+tdHtml+'</tr>');
            }
        }
        unitetdline('machine_body_push_'+pushBodyName);
    }
}

function machineLoadListShow(type){
    $("#machine_query_type_"+type).show();
    $("#machine_div_page_"+type).show();
    $("#machine_update_install_"+type).hide();
    $("#machine_update_replace_"+type).hide();
    $("#machine_update_push_"+type).hide();
}

function machineUpdateShow(type){
    $("#machine_update_install_"+type).show();
    $("#machine_query_type_"+type).hide();
    $("#machine_div_page_"+type).hide();
    $("#machine_update_replace_"+type).hide();
    $("#machine_update_push_"+type).hide();
}

function machineReplaceShow(type){
    $("#machine_update_replace_"+type).show();
    $("#machine_update_install_"+type).hide();
    $("#machine_query_type_"+type).hide();
    $("#machine_div_page_"+type).hide();
    $("#machine_update_push_"+type).hide();
}

function machinePushAdvertShow(type){
    $("#machine_update_push_"+type).show();
    $("#machine_query_type_"+type).hide();
    $("#machine_update_replace_"+type).hide();
    $("#machine_update_install_"+type).hide();
    $("#machine_div_page_"+type).hide();

}
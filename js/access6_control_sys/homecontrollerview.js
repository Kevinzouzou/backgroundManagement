/**
 * Created by GIGA on 2017/8/31. 室内机
 */
function addHomeControllerTableList(list){
    $("#homecontrollerInfo-body1").empty();
    if(list.length==0){
        $("#homecontrollerInfo-body1").append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(index, item) {
            var tr = '<tr>'
                +'<td>'+getHomeAddressByCode(item.code.substring(item.code.indexOf("d")+1))+'</td>'
                +'<td>'+item.mac+'</td>'
                +'<td>'+(item.status==0?'离线':'在线')+'</td>'
                +'<td>'+item.ip+'</td>'
                +'<td>'+item.host+'</td>'
                +'<td>'+item.gatewayip+'</td>'
                +'<td>'+item.serverip+'</td>'
                +'<td>'+item.maskcode+'</td>'
                +'<td>'+item.maindns+'</td>'
                +'<td>'+item.subdns+'</td>'
                +'<td class="text-nowrap">'
                +'<a onclick="homePhonebook(\''+item.mac+'\')">查看</a>'
                +'|<a href="#" data-toggle="modal" data-target="#homecontroller-modal-update" onclick="updatehomecontrollerWindow(\''+item.mac+'\')">替换</a>'
                +'|<a href="#" data-toggle="modal" data-target="#homecontroller-modal-delete" onclick="delHomeControllerWindow('+item.id+')">注销</a>'
                +'|<a href="#" onclick="updatePhoneBookRoll(\''+item.mac+'\')">更新户户通</a>'
                +'</td></tr>';
            $("#homecontrollerInfo-body1").append(tr);
        });
    }
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#homecontrollerInfo-body1").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
    unitetdline("homecontrollerInfo-body1");
}

//200002d1p1z1b1u22f1h
function getHomeAddressByCode(code){
    var codestr = code.substring(0);
    codestr = codestr.replace('d','街区').replace('p','期').replace('z','区').replace('b','栋').replace('u','单元').replace('f','层').replace('h','室');
    return codestr;
}

function updatehomecontrollerWindow(homecontrolleroldmac){
    sessionStorage.setItem("homecontrolleroldmac",homecontrolleroldmac);
    $("#homecontroller-oldmac").html(homecontrolleroldmac);
}

var homecontrollerdeleteId = 0;
function delHomeControllerWindow(id){
    homecontrollerdeleteId = id;
}

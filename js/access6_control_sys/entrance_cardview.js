/**
 * Created by GIGA on 2017/9/7. 门禁卡
 */
//渲染表格
var door_card_id = 0;
function showDoorCardTableList(list){
    $("#entrance_cardInfo-body1").empty();
    door_card_id=0;
    $.each(list,function(index, item) {
        var code = item.code;
        if(code!=null){
            var codestr = code.substring(7);//1p1z1b1u1f2h
            var p = codestr.substring(0,codestr.indexOf("p")+1).replace("p","期");
            var z = codestr.substring(codestr.indexOf("p")+1,codestr.indexOf("z")+1).replace("z","区");
            var b = codestr.substring(codestr.indexOf("z")+1,codestr.indexOf("b")+1).replace("b","栋");
            var u = codestr.substring(codestr.indexOf("b")+1,codestr.indexOf("u")+1).replace("u","单元");
        }
        var type ="";
        if(item.type==1){
            type="住户";
        }else if(item.type==2){
            type="管理";
        }else if(item.type==3){
            type="临时";
        }
        var tr = '<tr>'
            +'<td><img src="img/nochoice.png" style="width: 1.35rem;height: 1.35rem" onclick="changeDoorCardChoice('+index+','+item.id+')"></td>'
            +'<td>'+item.cardid+'</td>'
            +'<td>'+type+'</td>'
            +'<td>'+checknull(p)+'</td>'
            +'<td>'+checknull(z)+'</td>'
            +'<td>'+checknull(b)+'</td>'
            +'<td>'+checknull(u)+'</td>'
            +'<td class="text-nowrap">'
            + '<a href="#" onclick="queryDoorCardAuthorityJump('+item.id+')">查看权限</a>'
            + '|<a href="#" onclick="delDoorCardBySingle(\''+item.cardid+'\')">删除</a></td>'
            +'</tr>';
        $("#entrance_cardInfo-body1").append(tr);
        var imgarr = $("#entrance_cardInfo-body1").find("img")[index];
        imgarr.setAttribute("id","doorcard"+item.cardid);
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#entrance_cardInfo-body1").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
}

function showDoorCardAuthorityTableList(list){
    $("#entrance_cardInfo-body2").empty();
    $.each(list,function(index, item) {
        var typename = "";
        if(item.type="D"){
            typename = "门口机";
        }else if(item.type="W"){
            typename = "围墙机";
        }else if(item.type="H"){
            typename = "室内机";
        }else if(item.type="C"){
            typename = "中心机";
        }
        var tr = '<tr>'
            +'<td>'+doorcard_strToCharacter(item.code.substring(7))+'</td>'
            +'<td>'+checknull(item.name)+'</td>'
            +'<td>'+checknull(typename)+'</td>'
            +'</tr>';
        $("#entrance_cardInfo-body2").append(tr);
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#entrance_cardInfo-body2").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
}


$(document).ready(function(){
    $('#entrance_card_tableList2').hide();
});

//是否选中，切换图片
var doorcardidstr = "";
function changeDoorCardChoice(index,id){
    var imgarr = $("#entrance_cardInfo-body1").find("img")[index];
    var str = imgarr.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgarr.setAttribute("src","img/nochoice.png");
        door_card_id = 0;
        doorcardidstr = doorcardidstr.substr(0,doorcardidstr.lastIndexOf(",")-1);
    }else{
        imgarr.setAttribute("src","img/choice.png");
        door_card_id = id;
        doorcardidstr += id+",";
    }
}
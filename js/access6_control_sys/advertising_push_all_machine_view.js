/**
 * Created by GIGA on 2017/9/12.
 */
var advertising_push_all_machine_id = 0;
function showAdvertisingPushTableList(list){
    $("#advertising_push_all_machine_Info-body1").empty();
    advertising_push_all_machine_id=0;
    if(list.length==0){
        $("#advertising_push_all_machine_Info-body1").append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(index, item) {
            var filetype = "";
            //1图片（默认）、2视频、3音频
            if(item.filetype==1){
                filetype = "图片";
            }else if(item.filetype==2){
                filetype = "视频";
            }else if(item.filetype==3){
                filetype = "音频";
            }
            var stautsname = "";
            if(item.status==1){
                stautsname = "<span style='color: red'>未投放</span>";
            }else if(item.status==2){
                stautsname = "<span style='color: green'>已投放</span>";
            }else if(item.status==3){
                stautsname = "下架";
            }
            var tr = '<tr>'
                +'<td><img src="img/nochoice.png" style="width: 1.35rem;height: 1.35rem" onclick="changeAdChoice('+index+','+item.id+')"></td>'
                +'<td>'+item.filename.substring(item.filename.lastIndexOf("-")+1,item.filename.lastIndexOf("."))+'</td>'
                +'<td>'+filetype+'</td>'
                +'<td>'+item.custormername+'</td>'
                +'<td>'+item.version+'</td>'
                +'<td>'+stautsname+'</td>'
                +'<td>'+item.createtime.substring(0,item.createtime.lastIndexOf(":"))+'</td>'
                +'<td>'+(item.status==2?"<a onclick='soldOutAd("+item.id+")'>下架</a>":"<a href='#' style='color: #E5E0E0'>下架")+"|"//只有已投放的广告才能下架
                +'<a href="#" onclick="downloadAd(\''+item.filename+'\')">下载</a>'+"|"
                +'<a href="#" onclick="deleteAdById('+item.id+')">删除</a>'+'</td>'
                +'</tr>';
            $("#advertising_push_all_machine_Info-body1").append(tr);

            var imgarr = $("#advertising_push_all_machine_Info-body1").find("img")[index];
            imgarr.setAttribute("id","ad"+item.id);
        });
    }

    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#advertising_push_all_machine_Info-body1").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
    unitetdline("advertising_push_all_machine_Info-body1");
}

//渲染门口机
function showAdvertisingPushallMachineTableList(list){
    $("#advertising_push_all_machine_Info-body4").empty();
    $.each(list,function(index, item) {
        var typename = "";
        //1图片（默认）、2视频、3音频
        if(item.type=="H"){
            typename = "室内机";
        }else if(item.type=="W"){
            typename = "围墙机";
        }else if(item.type=="D"){
            typename = "门口机";
        }else if(item.type=="C"){
            typename = "中心机";
        }
        var tr = '<tr>'
            +'<td><img src="img/nochoice.png" style="width: 1.35rem;height: 1.35rem" onclick="changeChoiceForallMachine('+index+','+item.id+')"></td>'
            +'<td>'+item.code+'</td>'
            +'<td>'+item.name+'</td>'
            +'<td>'+(item.status==0?'离线':'在线')+'</td>'
            +'<td>'+typename+'</td>'
            +'<td>'+item.mac+'</td>'
            +'</tr>';
        $("#advertising_push_all_machine_Info-body4").append(tr);
        var imgNode = $("#advertising_push_all_machine_Info-body4").find("img")[index];
        imgNode.setAttribute("id",item.mac+","+item.type);
    });



    if(list.length<9){
        for(i=0;i<9-list.length;i++){
            $("#advertising_push_all_machine_Info-body4").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
}

//是否选中，切换图片
var idstr = "";
function changeAdChoice(index,id){
    var imgarr = $("#advertising_push_all_machine_Info-body1").find("img")[index];
    var str = imgarr.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgarr.setAttribute("src","img/nochoice.png");
        advertising_push_all_machine_id = 0;
        idstr = idstr.substr(0,idstr.lastIndexOf(",")-1);
    }else{
        imgarr.setAttribute("src","img/choice.png");
        advertising_push_all_machine_id = id;
        idstr += id+",";
    }
}

function changeChoiceForallMachine(index,id){
    var imgarr = $("#advertising_push_all_machine_Info-body4").find("img")[index];
    var str = imgarr.src;
    str = "img"+str.substring(str.lastIndexOf("/"));
    if(str=="img/choice.png"){
        imgarr.setAttribute("src","img/nochoice.png");
        advertising_push_all_machine_id = 0;
    }else{
        imgarr.setAttribute("src","img/choice.png");
        advertising_push_all_machine_id = id;
    }
}




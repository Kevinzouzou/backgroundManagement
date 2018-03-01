/**
 * Created by GIGA on 2017/9/18.
 */
function addAdvertisingPushToDoorMachineTableList(list,type){
    $("#advertising_push_machine_Info-body1"+type).empty();
    if(list!=null){
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
            var tr = '<tr>'
                +'<td>'+item.filename.substring(item.filename.lastIndexOf("-")+1,item.filename.lastIndexOf("."))+'</td>'
                +'<td>'+filetype+'</td>'
                +'<td>'+item.custormername+'</td>'
                +'<td>'+item.version+'</td>'
                +'<td>'+(item.status==2?"<span>已投放</span>":"<span style='color: red'>未投放</span>")+'</td>'
                +'<td>'+item.createtime.substring(0,item.createtime.lastIndexOf(":"))+'</td>'
                +'<td><a onclick="doorMachinesoldOutAd('+item.id+',\''+type+'\')">下架</a>'+'|'
                +'<a onclick="queryMachineByAd('+item.id+',\''+type+'\')">推送详情</a>'+'</td>'
                +'</tr>';
            $("#advertising_push_machine_Info-body1"+type).append(tr);
        });
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                $("#advertising_push_machine_Info-body1"+type).append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
            }
        }
    }else{
       return;
    }
}

function addAdToMachineTableList(list,type){
    $("#advertising_push_detail_body"+type).empty();
    $.each(list,function(index, item) {
        var tr = '<tr>'
            +'<td>'+translate(item.code)+'</td>'
            +'<td>'+item.mac+'</td>'
            +'<td>'+item.name+'</td>'
            +'<td>'+(item.status==0?'离线':'在线')+'</td>'
            +'<td>'+item.ip+'</td>'
            +'</tr>';
        $("#advertising_push_detail_body"+type).append(tr);
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#advertising_push_detail_body"+type).append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
}

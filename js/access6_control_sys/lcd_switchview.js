/**
 * Created by GIGA on 2017/9/11.
 */
function showlcdSwitchTableList(list){
    $("#lcd_switchInfo-body").empty();
    $.each(list,function(index, item) {
        var controllerTimerModeJson = JSON.stringify(item).replace(/\"/g,"'");
        var tr = '<tr>'
            +'<td>'+item.byname+'</td>'
            +'<td>'+(item.status==0?'<a class="lcdswitchStart" href="#" style="color: #A4A4A5" onclick="startOrStop('+controllerTimerModeJson+','+1+')">开启</a>|'
            + '<a class="lcdswitchStop" href="#" style="color: #679ACC" onclick="startOrStop('+controllerTimerModeJson+','+0+')">关闭</a>'
                :'<a class="lcdswitchStart" href="#" style="color: #679ACC" onclick="startOrStop('+controllerTimerModeJson+','+1+')">开启</a>|'
            + '<a class="lcdswitchStop" href="#" style="color: #A4A4A5" onclick="startOrStop('+controllerTimerModeJson+','+0+')">关闭</a>')+'</td>'
            +'<td>'+item.timeString.split(",")[1]+'</span>&nbsp;&nbsp;&nbsp;<img src="img/icon_setInput.png" onclick="lcdSwitchSettings('+controllerTimerModeJson+')"'
            + 'data-toggle="modal" data-target="#lcdswitch-modal-set"/></td>'
            +'</tr>';
        $("#lcd_switchInfo-body").append(tr);
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
            $("#lcd_switchInfo-body").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
}



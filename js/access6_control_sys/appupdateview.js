/**
 * Created by GIGA on 2017/9/15.
 */

/**
 * 渲染app升级包
 */
function addappupdateTable(list){
    $("#appupdate-body1").empty();
  
    $.each(list,function(key,value) {
    	  var sa=value.name+"-"+value.version
        $("#appupdate-body1").append('<tr>'+'<td>'+value.name+'</td>'+'<td>'+value.version+'</td>'+'<td>'+value.createtime+'</td>'+'<td>'+value.releasetime+'</td>'+'<td>'+getpushstatus(value.pushstatus)+'</td>'+'<td><a href="#" onclick=showUpdateAppDetDetail("'+value.description+'") >查看描述</a></td>'+'<td><a href="../appUpdateDownload!down.action?fileName='+sa+'"  >下载</a>|<a href="#" onclick="updateApppushToCtr(\'' + JSON.stringify(value).replace(/"/g, '&quot;') + '\')" >推送</a>|<a href="#" onclick="deleteUppupdateAppById('+value.id+')" >删除</a></td>'+'</tr>');
    });
    if(list.length<10){
        for(i=0;i<10-list.length;i++){
        	
            $("#appupdate-body1").append('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>');
        }
    }
    unitetdline("appupdate-body1");
}
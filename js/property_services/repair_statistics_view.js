/**
 *给报事保修统计加载信息列表
 */
function pageRepairStaticTicsServiceLoadInformationList(list){
    $('#repair_body_static_tics').empty();
    if(list.length==0){
        $("#repair_body_static_tics").append('<h2>没有查询到数据</h2>');
    }else{
        $.each(list,function(key,value) {
            $('#repair_body_static_tics').append('<tr>'+'<td>'+repairCheckNull(value.id)+'</td>'
                +'<td>'+repairCheckNull(repairType(value.workorderType))+'</td>'
                +'<td>'+repairAllSubStr(value.createtime)+'</td>'
                +'<td>'+'<a href="#" onclick="repairDetailsData(\''+value.content+'\')">详情</a>'+'</td>'
                +'<td>'+repairCheckNull(value.followPName)+'</td>'
                +'<td>'+repairCheckNull(repairUrgency(value.urgency))+'</td>'
                +'<td>'+repairCheckNull(repairChangeStatus(value.status))+'</td>'
                +'<td>'+repairCheckNull(repairCsr(value.satisfaction))+'</td>'
                +'<td>'+'<a href="#" onclick="repairDetailsFile(\''+value.file+'\')">详情</a>'+'</td>' +'</tr>');
            /*var imgArray = $("#repair_body_static_tics").find("img")[key];
            imgArray.setAttribute("id","repair"+value.id);*/
        });
        var tds=$("#repair_body_static_tics tr:first-child td").length;
        if(list.length<10){
            for(i=0;i<10-list.length;i++){
                var tdHtml='';
                for(j=1;j<=tds;j++){
                    tdHtml+="<td></td>";
                }
                $("#repair_body_static_tics").append('<tr>'+tdHtml+'</tr>');
            }
        }
    }
};

function repairDetailsData(content){
    $("#repair_content").modal("show");
    $("#divContentId").html(content);
}

function repairDetailsFile(file){
    $("#divCmFileId").empty();
    $("#repair_view").modal("show");
    $("#divCmFileId").append("<img style='width: 16.67rem;height: 12.5rem;margin: 3.9rem auto 2.3rem;' src="+zonePicFile+file+">");
}
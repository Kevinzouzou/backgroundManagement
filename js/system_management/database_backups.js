/**
 * Created by asus on 2017/9/15.
 */
$('li a[href="#tab_database"]').click(function(){
    queryDatabaseBackupsJump();
    databaseBackupsQuery();
});


/**
 * 加载数据库备份记录
 */
function queryDatabaseBackupsJump() {
    $.ajax({
        type: "post",
        url:zoneServerIp+"/ucotSmart/dbmanagerAction!findDBBackupRecord.action",
        dataType: "json",
        data: {
            "token": permit
        },
        success: function (data) {
            var list = eval(data.obj);
            queryDatabaseBackupsList(list);
        },
        error: function (data, status) {
            msgTips("查询数据库备份记录异常!");
        }
    });
}
/**
 * 给备份加载信息列表
 */
function queryDatabaseBackupsList(list){
    $("#database_backups_body").empty();
    $.each(list,function(key,value){
        $("#database_backups_body").append('<tr>'+'<td>'+checkNull(value.fileName)+'</td>'+'<td>'+value.filePath+'</td>'+'</td>'
            +'<td>'+subStr(checknull(value.createTime))+'</td>'+'<td>'+checkNull(value.downloadNum)+'</td>'+'<td>'+'<a href="#" onclick="downloadData(\''+value.fileName+'\');">下载</a>'+'</td>'+'</tr>');
    });
 }

/**
 * 查询备份参数
 */
function databaseBackupsQuery(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/dbmanagerAction!getBackupPama.action",
        data:{
          "token":permit
        },
        dataType:"json",
        success:function(data){
            var list = eval(data.obj);
            databaseBackupsQueryList(list);
        },
        error:function(data){
            msgTips("加载查询备份异常");
        }
    });
};

/**
 * 加载查询备份参数
 */
function databaseBackupsQueryList(list){
    $("#database_backups_details_body").empty();
    $("#database_backups_details_body").append('<tr>'+'<td>'+list.filePath+'</td>'+'<td>'+list.mysqlpath+'</td>'+'</td>'+'<td>'+list.osType+'</td>'+'<td>'+'</tr>');
    unitetdline('database_backups_details_body');
};

/**
 * 下载数据
 */
function downloadData(fileName){
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action', zoneServerIp+'/ucotSmart/downDBAction!down.action?fileName='+fileName);
    var input1 = $('<input>');
    input1.attr('type', 'hidden');
    input1.attr('name', 'token');
    input1.attr('value', permit);
    $('body').append(form);
    form.append(input1);
    form.submit();
    form.remove();
};


/**
 * 设置备份参数
 */
function updateDatabaseBackups(){
    var data = $("#databaseBackupsFormId").serialize();//序列化乱码
    data = decodeURIComponent(data,true);
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/dbmanagerAction!initBackup.action",
        data:data+"&token="+permit,
        dataType:"json",
        success:function(data){
            msgTips(data.msg);
            queryDatabaseBackupsJump(1,"");
        }
    });
}

/**
 * 设置备份
 */
function databaseBackups(){
    $.ajax({
        type:"post",
        url:zoneServerIp+"/ucotSmart/dbmanagerAction!backupDB.action",
        dataType: "json",
        data:{
            "token":permit
        },
        success:function(data){
            msgTips(data.msg);
            queryDatabaseBackupsJump(1,"");
        }
    });
}

function resetDatabaseBackups(){
    $("#databaseBackupsFormId")[0].reset();
}

//格式化时间格式为yyyy-MM-dd hh:mm:ss
function subStr(time){
    if(time!=null){
        return time.substring(0,19);
    }
    return "";
}

//判断是否为空
function checkNull(str){
    if(str==null||str=="undefined"){
        return "";
    }
    return str;
}
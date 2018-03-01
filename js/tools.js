/**
 * Created by 冯枭 on 2017/8/25.
 */



//解析家庭门卡地址
function translate(code){
    if(code==""||code==null){
        return "";
    }
    if(code.indexOf("d")!=-1)
    code=code.replace("d","街区");
    if(code.indexOf("p")!=-1)
    code=code.replace("p","期");
    if(code.indexOf("z")!=-1)
    code=code.replace("z","区");
    if(code.indexOf("b")!=-1)
    code=code.replace("b","栋");
    if(code.indexOf("u")!=-1)
    code=code.replace("u","单元");
    if(code.indexOf("f")!=-1)
    code=code.replace("f","层");
    if(code.indexOf("h")!=-1)
    code=code.replace("h","室");
    return code;
}
//解析到栋
function tranCode(code){
    if(code==""){
        return "";
    }
    code=code.replace("p","期");
    code=code.replace("z","区");
    code=code.replace("b","栋");
    return code;
}

//解析到单元
function tranUnitCode(code){
    if(code==""){
        return "";
    }
    code=code.replace("p","期");
    code=code.replace("z","区");
    code=code.replace("b","栋");
    code=code.replace("u","单元");
    return code;
}

//将根据前端获取参数转化成code
function tranFormHomecode(code){
    if(code==""||code==null){
        return "";
    }
    if(code.indexOf("街区")!=-1)
    code=code.replace('街区','d');
    if(code.indexOf("期")!=-1)
    code=code.replace('期','p');
    if(code.indexOf("区")!=-1)
    code=code.replace('区','z');
    if(code.indexOf("栋")!=-1)
    code=code.replace('栋','b');
    if(code.indexOf("单元")!=-1)
    code=code.replace('单元','u');
    if(code.indexOf("层")!=-1)
    code=code.replace('层','f');
    if(code.indexOf("室")!=-1)
    code=code.replace('室','h');
    return code;
}


function tranHomeStatus(status){
    if(status==""){
        return "";
    }
    if(status==0){
        var o="未售";
    }else if(status==1){
        var o="自住";
    }else if(status==2){
        var o="出租";
    }else if(status==3){
        var o="空闲";
    }else if(status==4){
        var o="招租";
    }else if(status==5){
        var o="待售";
    }else if(status==6){
        var o="待装修";
    }else if(status==7){
        var o="重装修";
    }else{
        var o="未初始化";
    }
    return o;
}

//校验是否为空
function checknull(str){
    if(str=='null'||str==null){
        return "-";
    }
    return str;
}

function subStr(time){
    if(time!=null){
        return time.substring(0,10);
    }
    return "";
}

function getpushstatus(pushstatus){
    if(pushstatus==1){
        return '已推送';
    }else{
        return '未推送'
    }

}


/**
 * 条件查询信息
 *     var tipdom=$('#paging-tips');
 var pagedom=$('#homeList-paging');
 * */
function queryListByParams(url,senddata,pageid,fnName){//data 的格式是token=adada&unitcode=dadasdad&home.code=dadsads
    senddata="token="+sessionStorage.getItem("token")+"&pager.pagesize=10&"+senddata;
    $.ajax({
        type: "post",
        url: zoneServerIp+url,
        //data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: senddata,
        dataType: "json",
        success: function (data) {
            if(data.obj.data!==null){
                var list=eval(data.obj.data);
                var totalNum=data.obj.data_count;//总数
                var pageNum=Math.ceil(totalNum/10);//总页数
                eval(fnName).call(this,list);
                //$('#paging-tips').empty();
                //$('#paging-tipss').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                //if(list.length!==undefined){
                    //$('#paging-tips').empty();
                    $('#paging-tips').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
                //}
                if(pageNum==0||pageNum==1){
                    $('#homeList-paging').empty();
                }else{
                    showlistPagePlugin(totalNum,url,senddata,pageid,fnName);
                }
            }
            $('#all_paging').css('display','block');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            msgTips("请求失败！");
        }
    });
}

/*显示查询分页插件并绑定请求*/
function showlistPagePlugin(totalNum,url,senddata,pageid,fnName){
    var pageNum=Math.ceil(totalNum/10);//总页数
    var pageSize=5;//默认分页栏显示5
    if(pageNum>1&&pageNum<6){//如果是5页以内一页以上加载插件，显示多少页
        pageSize=pageNum;
    }
    //console.log(pageid);
    var needPage;
    $('#homeList-paging').empty();
    $('#homeList-paging').append('<ul id="'+pageid+'" class="pagination-sm"></ul>');
    $('#'+pageid).twbsPagination({
        totalPages: pageNum,
        visiblePages: pageSize,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            needPage=page;
            queryListByPage(needPage,url,senddata,fnName);//分页查询
        }
    });
}

/*查询分页插件绑定ajax请求，根据页码查看房屋数据*/
function queryListByPage(page,url,senddata,fnName){
    $.ajax({
        type: "post",
        url: zoneServerIp+url,
        //data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: senddata+"&pager.pages="+page,
        dataType: "json",
        success: function (data) {
            var totalNum=data.obj.data_count;
            var list=eval(data.obj.data);
            console.log(fnName);
            eval(fnName).call(this,list);
            //if(list.length!==undefined){
                $('#paging-tips').empty();
                $('#paging-tips').html("当前页面共"+list.length+"条数据 总共"+totalNum+"条数据");
            //}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            msgTips("请求失败！");
        }
    });
}
//Ajax请求
function ajaxRequest(url,data,fun){
    data="token="+permit+data;
    url=zoneServerIp+"/ucotSmart/"+url;
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: function(js){
            //console.log(js);
            if(js.obj!==null){
                if(js.obj.data){
                    var list=eval(js.obj.data);
                    if(fun!==""){
                        eval(fun).call(this,list);
                    }
                }else{
                    if(fun!==""){
                        eval(fun).call(this);
                    }
                }
            }else{
                if(fun!==""){
                    eval(fun).call(this);
                }
            }
        },
        error: function(){
            msgTips("请求失败！");
        }
    })
}

//表格数据行数少于num=10行，则添加空行
function addTr(id,len,num){
    var tds=$(id+" tr:first-child td").length;
    if(len<num){
        for(i=len;i<num;i++){
            var tdHtml="";
            for(j=1;j<=tds;j++){
                tdHtml+="<td></td>";
            }
            $(id).append('<tr class="notPrint">'+tdHtml+'</tr>');
        }
    }
}

//获取UUid
function getUUidByToken(permit){
    var s=permit.split("-");
    var code =s[1].substring(2);
    if(!code.indexOf("N"))
        return code.substring(0,code.indexOf("d"));
}
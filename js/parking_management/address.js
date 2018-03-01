/**
 * Created by GIGA on 2018-02-03.
 */
var token="15048-41200005d-1516156873552";
var zIp="http://192.168.1.202:8080";

//var a=[
//    "902d1p2z1b1u1f1h",
//    "901d1p1z2b1u11f1h",
//    "901d2p1z3b1u5f102h",
//    "901d2p1z4b1u23f103h",
//    "901d3p1z5b1u5f101h"
//]
//冒泡排序 + 数组去重
function unique(arr){
    var arr2 = arr.sort();
    var res = [arr2[0]];
    for(var i=1;i<arr2.length;i++){
        if(arr2[i] !== res[res.length-1]){
            res.push(arr2[i]);
        }
    }
    return res;
}
//给相应下拉菜单增加列表内容
function selectAddress(arr,str,selectId){
    arr=unique(arr)
    var li="";
    for(var i=0;i<arr.length;i++){
        li+="<li><a ids='"+(i+1)+"'>"+arr[i]+str+"</a></li>"
    }
    $(selectId).html(li);
}

function queryListByParamsPark(url,senddata,pageid,fnName){//data 的格式是token=adada&unitcode=dadasdad&home.code=dadsads
    senddata="token="+token+senddata;
    $.ajax({
        type: "post",
        url: zIp+url,
        //data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: senddata,
        dataType: "json",
        success: function (data) {
            if(data.obj.data){
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
                    showlistPagePluginPark(totalNum,url,senddata,pageid,fnName);
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
function showlistPagePluginPark(totalNum,url,senddata,pageid,fnName){
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
            queryListByPagePark(needPage,url,senddata,fnName);//分页查询
        }
    });
}

/*查询分页插件绑定ajax请求，根据页码查看房屋数据*/
function queryListByPagePark(page,url,senddata,fnName){
    $.ajax({
        type: "post",
        url: zIp+url,
        //data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: senddata+"&pager.pages="+page,
        dataType: "json",
        success: function (data) {
            var totalNum=data.obj.data_count;
            var list=eval(data.obj.data);
            //console.log(fnName);
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

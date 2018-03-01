/**
 * Created by GIGA on 2017/9/12.
 */

$('li a[href="#tab_push_door_machine"]').click(function(){
    $("#advertising_push_all_machine_btn_group").hide();
    $("#advertising_push_detailD").hide();
    $("#advertising_push_machine_div1D").show();
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryAdvertisingDoorMachineJump(\"D\")');
    queryAdvertisingDoorMachineJump("D");
});

$('li a[href="#tab_push_fence_machine"]').click(function(){
    $("#advertising_push_all_machine_btn_group").hide();
    $("#advertising_push_detailW").hide();
    $("#advertising_push_machine_div1W").show();
    map.splice(0,map.length);
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'queryAdvertisingDoorMachineJump(\"W\")');
    queryAdvertisingDoorMachineJump("W");
});

function queryAdvertisingDoorMachineJump(type){
    $("#advertising_push_all_machine_btn_group").hide();
    $("#advertising_push_detail"+type).hide();
    $("#advertising_push_machine_div1"+type).show();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adAction!findAdFileByType.action",
        data: {
            'token': permit,
            'pager.pages':1,
            'pager.pagesize':10,
            'type':type
        },
        dataType: "json",
        success: function (data) {
            if(data.obj==null){
                $('#advertising_push_machine_paging-tips'+type).empty();
                addAdvertisingPushToDoorMachineTableList(null,type);
            }else{
                //渲染数据
                var list=data.obj.data;
                var totalNum = data.obj.data_count;//总数
                totalPages = Math.ceil(totalNum/pageSize);//总页数
                addAdvertisingPushToDoorMachineTableList(list,type);
                if(totalPages==1||totalPages==0){
                    $('#advertising_push_machineList-paging'+type).empty();
                    $('#advertising_push_machine_paging-tips'+type).html("当前页面共"+totalNum+"条数据 总共"+totalNum+"条数据");
                }else{
                    showaddPagePlugin(list.length,totalNum,totalPages,type);
                }
            }
        }
    });
}

/*2.给分页插件绑定ajax请求，根据当前页查看室内机数据*/
function showaddPagePlugin(pageNum,totalNum,totalPages,type){
    var liNums=5;//默认分页栏显示5
    if(totalPages>1&&totalPages<6){//如果是5页以内一页以上加载插件，显示多少页
        liNums=totalPages;
    }
    $('#advertising_push_machineList-paging'+type).empty();
    $('#advertising_push_machineList-paging'+type).append('<ul id="advertising_push_machine_page" class="pagination-sm"></ul>');
    var adpage = "";
    $('#advertising_push_machine_page').twbsPagination({
        totalPages: totalPages,
        visiblePages: liNums,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {
            adpage = page;
        }
    });

    $("#advertising_push_machine_page ").on('click', 'a', function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/adAction!findAdFileByType.action",
            data: {
                'token': permit,
                'pager.pages':adpage,
                'pager.pagesize':10,
                'type':type
            },
            dataType: "json",
            success: function (data) {
                var list=data.obj.data;
                addAdvertisingPushToDoorMachineTableList(list,type);
                $('#advertising_push_machine_paging-tips'+type).empty();
                $('#advertising_push_machine_paging-tips'+type).html("当前页面共" + list.length + "条数据 总共" + data.obj.data_count + "条数据");
            }
        });
    });
}

//下架广告
function doorMachinesoldOutAd(id,type){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adNewAction!updatingAdToAllMachine.action",
        data: {
            'token': permit,
            'id':id
        },
        dataType: "json",
        success: function (data) {
            queryAdvertisingDoorMachineJump(type);
        }
    });
}

//推送详情
function queryMachineByAd(id,type){
    $("#advertising_push_detail"+type).show();
    $("#advertising_push_machine_div1"+type).hide();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/adNewAction!findMachineByAdidAndType.action",
        data: {
            'token': permit,
            'type':type,
            'adid':id
        },
        dataType: "json",
        success: function (data) {
            var list = data.obj;
            addAdToMachineTableList(list,type);
        }
    });
}

//取消
function cancel(id){
    $("#"+id).modal('hide');
}


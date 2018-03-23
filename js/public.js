/**
 *Created by along on 2017/11/30 公共类方法
 */
//-------------------定义公用参数---------------------------
var pageListSize=10;//每页显示数据数量
//--下拉菜单--
$("body").on("click",".dropdown-menu a",function(){
    var dropdownId=$(this).parents(".dropdown").attr("ids");
    var prefixId=$(this).parents(".menuBox").attr("id");
    let adstype=$(this).parents(".menuBox").attr("adstype");
    var type=$(this).parents(".menuBox").attr("type");
    var optionId=$(this).attr("codelist");
    var modename=$(this).attr("modename");
    if(optionId){
        $(this).parents(".dropdown").attr("optionId",optionId);
    }else{
        $(this).parents(".dropdown").attr("optionId","");
    }
    //列表选中样式
    $("#"+prefixId+" ."+dropdownId+" a.dropdown-toggle span").addClass("option_type");
    $("#"+prefixId+" ."+dropdownId).attr("modename",modename);
    $("#"+prefixId+" ."+dropdownId+" a.dropdown-toggle span").text(modename);
    if(type=="charge"){
        unitAddress(dropdownId,prefixId,optionId);//费用管理
    }else if(type=="housekeeping"){//家政
        if(prefixId=="companyMenu"){
            pageDataHousekeeping("company");
        }else if(prefixId=="serveMenu"){
            pageDataHousekeeping("serve");
        }
        if(prefixId=="serve-menu"){
            //推送列表
            pushData(optionId);
        }
    }
    //员工管理
    if(prefixId=="personnelMenu"){
        pageListPersonnel();
    }else if(prefixId=="deptname"){
        $("#jobposition .jobposition").attr("modename","").find(".dropdown-toggle span").text("");
        var positionsArr=[];
        var positions=$(this).attr("positions");
        var isArr=positions.indexOf(",");
        if(isArr!=-1){
            positionsArr=positions.split(",");
        }else{
            positionsArr.push(positions);
        }
        var positionsHtml="";
        for(var l=0;l<positionsArr.length;l++) {
            positionsHtml += '<li><a codelist="' + l + '" modename="' + positionsArr[l] + '">' + positionsArr[l] + '</a></li>';
        }
        $("#jobposition .dropdown-menu").html(positionsHtml);
    }
    //排班日程查询
    if(prefixId=="schedulingMenu"){
        let month=$("#ScheduleTime").val();
        if(!month){month=""}
        schedulingSchedule(month,optionId)
    }
    //排班查询
    if(prefixId=="inquireDepartmentMenu"){
        inquirePersonnel(optionId,"inquireStaffMenu");
    }
    //巡检计划
    if(prefixId=="insPlanMenu"){
        insPlan();
    }
    //巡检查询
    if(prefixId=="inquireInsDepartmentMenu"){
        inquirePersonnel(optionId,"inquireInsStaffMenu");
    }
    //门禁系统-门禁卡
    if(prefixId=="docarType"){
        if(optionId=="doorcard"){
            // 查询门禁卡
            findDoorCardByCondition();
        }else if(optionId=="doorcardRecord"){
            // 查询刷卡记录
            doorCardRecord();
        };
    };
});
//--房屋地址--
function menuAddress(prefixId){
    //地址筛选
    var lastOf=permit.indexOf("d")+1;
    var ownercode=permit.substring(lastOf-7,lastOf);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/building!queryBuilding.action",
        dataType: "json",
        data: {
            "token":permit,
            "zonecode":ownercode
        },
        success: function (data) {
            // console.log("地址");
            // console.log(data);
            //    数据
            var obj=data.obj;
            $("#"+prefixId+" .chargingAds,#"+prefixId+" .unitAds,#"+prefixId+" .doorplateAds").find(".dropdown-menu").empty();
            var htmlList='<li><a codelist="" modename="全部">全部</a></li>';
            for(var i=0;i<obj.length;i++){
                var codeList=data.obj[i].code;
                var firstAds=codeList.indexOf("d")+1;
                var lastAds=codeList.indexOf("b")+1;
                var addressCode=codeList.substring(firstAds,lastAds);
                var addressText=addressCode.replace("p","期").replace("z","区").replace("b","栋");
                htmlList+='<li><a codeList="'+codeList+'" modename="'+addressText+'">'+addressText+'</a></li>'
            }
            $("#"+prefixId+" .chargingAds .dropdown-menu").html(htmlList);
            // console.log(prefixId);
            $(".modalAddress .chargingAds .dropdown-menu li:first-child").remove();
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
function unitAddress(dropdownId,prefixId,buildingCode){
    var ids=$("#"+prefixId).attr("ids");
    if(dropdownId=="chargingAds"){
        $("#"+prefixId+" .unitAds").css("display","inline-block");
        if(ids=="modalAddress"){
            $("#"+prefixId+" .unitAds .option_type,#"+prefixId+" .doorplateAds .option_type").text("");
        }else{
            $("#"+prefixId+" .unitAds,#"+prefixId+" .doorplateAds").attr({"optionid":"","modename":""});
            $("#"+prefixId+" .unitAds .option_type").text("全部 单元");
            $("#"+prefixId+" .doorplateAds .option_type").text("全部 房间号");
        }
        if(!buildingCode){
            $("#"+prefixId+" .unitAds").attr({"optionid":"","modename":""}).find(".option_type").text("全部 单元");
            $("#"+prefixId+" .doorplateAds").attr({"optionid":"","modename":""}).find(".option_type").text("全部 房间号");
            $("#"+prefixId+" .unitAds ul,#"+prefixId+" .doorplateAds ul").empty();
            $("#"+prefixId+" .unitAds,#"+prefixId+" .doorplateAds").hide();
        }else{
            $("#"+prefixId+" .doorplateAds ul").empty();
            $.ajax({
                type: "post",
                url: zoneServerIp+"/ucotSmart/building!queryUnit.action",
                dataType: "json",
                data: {
                    "token":permit,
                    "buildingcode":buildingCode
                },
                success: function (data) {
                    // console.log("单元");
                    // console.log(data);
                    //    数据
                    var obj=data.obj;
                    var htmlList='<li><a codelist="">全部 单元</a></li>';
                    for(var i=0;i<obj.length;i++){
                        var codeList=data.obj[i].code;
                        var firstAds=codeList.indexOf("b")+1;
                        var lastAds=codeList.indexOf("u");
                        var addressCode=codeList.substring(firstAds,lastAds);
                        htmlList+='<li><a codeList="'+codeList+'" modename="'+addressCode+'单元">'+addressCode+'单元</a></li>'
                    }
                    $("#"+prefixId+" .unitAds .dropdown-menu").html(htmlList);
                    if(ids=="modalAddress"){
                        $("#"+prefixId+" .unitAds .dropdown-menu li:first-child").remove();
                    }
                },
                error: function (data, status) {
                    //msgTips("");
                }
            });
        }
    }else if(dropdownId=="unitAds"){
        $("#"+prefixId+" .doorplateAds").css("display","inline-block");
        if(ids=="modalAddress"){
            $("#" + prefixId + " .doorplateAds .option_type").text("");
        }else{
            $("#"+prefixId+" .doorplateAds").attr({"optionid":"","modename":""});
            $("#"+prefixId+" .doorplateAds .option_type").text("全部 房间号");
        }
        if(!buildingCode){
            $("#"+prefixId+" .doorplateAds").attr({"optionid":"","modename":""}).find(".option_type").text("全部 房间号");
            $("#"+prefixId+" .doorplateAds ul").empty();
            $("#"+prefixId+" .doorplateAds").hide();
        }else{
            let ajaxurl;
            if(prefixId=="electricAddress"||prefixId=="alertorAddress"){
                //智能家居-家电、报警
                ajaxurl="/ucotSmart/building!queryHomeControllerByUnitcode.action";
            }else{
                ajaxurl="/ucotSmart/building!queryOwnerHomeByUnitcode.action";
            };
            $.ajax({
                type: "post",
                url: zoneServerIp + ajaxurl,
                dataType: "json",
                data: {
                    "token": permit,
                    "unitcode": buildingCode
                },
                success: function (data) {
                    // console.log("门牌");
                    // console.log(data);
                    //    数据
                    var obj = data.obj;
                    var htmlList = '<li><a codelist="">全部 房间号</a></li>';
                    if(obj){
                        for (var i = 0; i < obj.length; i++) {
                            var codeList = data.obj[i].code;
                            var firstAds = codeList.indexOf("u") + 1;
                            var lastAds = codeList.indexOf("h") + 1;
                            var addressCode = codeList.substring(firstAds, lastAds);
                            var addressText = addressCode.replace("f", "层").replace("h", "室");
                            htmlList += '<li><a codeList="' + codeList + '" modename="'+addressText+'">' + addressText + '</a></li>';
                        }
                        $("#"+prefixId+" .doorplateAds .dropdown-menu").html(htmlList);
                    }else{
                        $("#"+prefixId+" .doorplateAds .dropdown-menu").html("");
                    };
                    if(ids=="modalAddress"){
                        $("#"+prefixId+" .doorplateAds .dropdown-menu li:first-child").remove();
                    }
                },
                error: function (data, status) {
                    //msgTips("");
                }
            });
        }
    }else if(dropdownId=="doorplateAds"&&prefixId=="chargingSetModalAddress"){
        //查询业主信息
        $("#chargingName,#chargingPhone").val("");
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/chargesettingAction!getOwner.action",
            dataType: "json",
            data: {
                "token":permit,
                "ownercode":buildingCode
            },
            success: function (data) {
                // console.log("查询业主信息:");
                // console.log(data);
                //    数据
                if(data.obj){
                    $("#chargingSetForm #chargingName").val(data.obj.name);
                    $("#chargingSetForm #chargingPhone").val(data.obj.cellphone);
                }
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    }
};
//地址转码
function adsText(adscode){
    let address="";
    if(!adscode){
        return address;
    }
    if(adscode.indexOf("d")!=-1){
        let firstOf=adscode.indexOf("d")+1;
        address=adscode.substring(firstOf);
    }else{
        address=adscode;
    }
    const codeAds=["p","z","b","u","f","h"];
    const textAds=["期","区","栋","单元","层","室"];
    for(let n=0;n<codeAds.length;n++){
        address=address.replace(codeAds[n],textAds[n]);
    };
    return address;
};
//获取已选地址码
function ownercodeGetSelected(prefixId){
    let doorplateAds=$("#"+prefixId+" .doorplateAds").attr("optionid");
    let unitAds=$("#"+prefixId+" .unitAds").attr("optionid");
    let chargingAds=$("#"+prefixId+" .chargingAds").attr("optionid");
    let ownercode;
    doorplateAds?ownercode=doorplateAds:unitAds?ownercode=unitAds:chargingAds?ownercode=chargingAds:ownercode="";
    $("#"+prefixId+" .btnSearch").attr("ownercode",ownercode);
    $("#"+prefixId+" input").each(function(i,e){
        $("#"+prefixId+" .btnSearch").attr("time"+i,$(this).val());
    });
    //return ownercode;
};
//清除搜索条件
function emptySearchCondition(prefixId,type){
    if(type=="pageData"){
        $("#"+prefixId+" .chargingAds").attr({"optionid":"","modename":""}).find("a.dropdown-toggle span").text("全部");
        $("#"+prefixId).find(".unitAds,.doorplateAds").hide();
        $("#"+prefixId+" .input").val("");
    }else{
        if(!$("#"+prefixId+" .btnSearch").attr("ownercode")){
        $("#"+prefixId+" .chargingAds").attr({"optionid":"","modename":""}).find("a.dropdown-toggle span").text("全部");
        $("#"+prefixId).find(".unitAds,.doorplateAds").hide();
        $("#"+prefixId+" input").each(function(i,e){
            if(!$("#"+prefixId+" .btnSearch").attr("time"+i)){
                $(this).val("");
            };
        });
    };
    };
};
//-------------------查询方法---------------------------
//--查询部门--
//查询部门
function departmentMenu(prefixId){
    if(!prefixId){
        $.ajax({
            type: "post",
            url: zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
            dataType: "json",
            data: {
                "token":permit
            },
            success: function (data) {
                // console.log("查询部门:");
                // console.log(data);
                //    数据
                if(data.obj){
                    let obj=data.obj.data;
                    let htmlList='<li><a codelist="" modename="全部部门">全部部门</a></li>';
                    for(let i=0;i<obj.length;i++){
                        htmlList+='<li><a codelist="'+obj[i].deptno+'" modename="'+obj[i].deptname+'" positions="'+obj[i].positions+'">'+obj[i].deptname+'</a></li>';

                    };
                    localStorage.departmentHtml=htmlList;
                }
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    }else{
        let htmlList=localStorage.departmentHtml;
        $("#"+prefixId).find("ul.dropdown-menu").html(htmlList);
    };
    if(prefixId=="addPersonnelModal #deptname"||prefixId=="deptnameMenu"||prefixId=="insPlanDeptnameMenu"||prefixId=="schedulingMenu,#deptnameMenu"){
        $("#"+prefixId).find("ul.dropdown-menu li:first-child").remove();
    };
};
departmentMenu();
//查询人员
function inquirePersonnel(deptid,prefixId){
    //查询人员
    if(prefixId=="schedulingMenu"){
        $("#dateTimes").attr("deptid",deptid);
    }else if(prefixId=="inquireInsDepartmentMenu"){
        $("#insDateTimes").attr("deptid",deptid);
    };
    $("#"+prefixId+" ."+prefixId).attr({"optionid":"","modename":""}).find("a.dropdown-toggle span").text("");
    $("#"+prefixId+" .dropdown-menu").empty();
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType: "json",
        data: {
            "token":permit,
            "employee.deptno":deptid
        },
        success: function (data) {
            // console.log("查询人员:");
            // console.log(data);
            //    数据
            let obj=data.obj.data;
            if(obj&&obj.length>0){
                var htmlList='<li><a codelist="" modename="全部员工">全部员工</a></li>';
                for(var i=0;i<obj.length;i++){
                    htmlList+='<li><a codelist="'+obj[i].id+'" modename="'+obj[i].ename+'">'+obj[i].ename+'</a></li>';
                };
                $("#"+prefixId+" .dropdown-menu").html(htmlList);
            }else{
                $("#"+prefixId+" ."+prefixId).find("a.dropdown-toggle span").text("暂无员工");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//*显示分页插件并绑定请求*/
var homelistPage;
function pagingPlugin(pageList,totalNum,prefixId,pageListFunction){
    var ones=0;
    var pageNum=Math.ceil(totalNum/pageListSize);//总页数
    var pageSize=5;//默认分页栏显示5
    if(pageNum>=1&&pageNum<=5){//如果是5页以内一页以上加载插件，显示多少页
        pageSize=pageNum;
    }
    if(pageNum<=1){
        $("#"+prefixId+" .pagingImplement .pageList").hide();
    }else{
        $("#"+prefixId+" .pagingImplement .pageList").show();
    }
    $("#"+prefixId+" .pagingImplement .pageList").empty();
    $("#"+prefixId+" .pagingImplement .pageList").html('<ul id="'+prefixId+'Paging" class="homelist_pagination" class="pagination-sm"></ul>');
    $("#"+prefixId+" .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
    $("#"+prefixId+"Paging").twbsPagination({
        totalPages: pageNum,
        visiblePages: pageSize,
        version: '1.1',
        //给分页插件绑定点击事件，page是点击选中的页码
        onPageClick: function (event, page) {

            $('#content').text('Page ' + page);
            homelistPage=page;
            if(ones==0){
                ones++;
            }else{
                // 查询方法
                eval(pageListFunction.functions);
            }
        }
    });
}
//-------------------去空---------------------------
function wipeNull(prefixId,element){
    let dom;
    if(element){
        dom=element;
    }else{
        dom="td";
    };
    $("#"+prefixId+" "+dom).each(function(){
        if($(this).text()=="null"||$(this).text()=="undefined"){
            $(this).text("");
        }
    });
}
//--全选反选--
$("body").on("click",".checkboxsBut",function(){
//全选反选
    var prefixId=$(this).attr("typeIds");
    if($(this).is(":checked")){
        $("#"+prefixId+" input").not(":disabled").prop("checked",true);
    }else{
        $("#"+prefixId+" input").not(":disabled").prop("checked",false);
    }
    //取消全选复选框状态
    $("body").on("click",".pageList a",function(){
        $(this).parents(".tables").find(".checkboxsBu").prop("checked",false);
    });
});
//-------------------预览详情---------------------------
function previewModal(title,content,type){
    $("#previewModal").modal("show");
    $("#previewModal").find(".modal-title").html(title);
    if(type=="eval"){
        eval(content);
    }else{
        $("#previewModal").find(".modal-body").html(content);
    }
}
//-------------------删除通用方法---------------------------
function deletePubModal(dataObj,callBack,ajaxURL){
    $("#deletePubModal").modal("show");
    $("#deletePubBut").off();
    $("#deletePubBut").click(function(){
        $.ajax({
            type: "post",
            url: zoneServerIp+ajaxURL,
            dataType: "json",
            data:dataObj,
            success: function (data) {
                if(data.success==true){
                    $("#deletePubModal").modal("hide");
                    $("#deletePubModal .modal-title").text("删除信息");
                    $("#deletePubModal .mBody_title").text("确认是否删除！");
                    eval(callBack);
                };
                msgTips(data.msg);
            },
            error: function (data, status) {
                //msgTips("");
            }
        });
    });
}
//-------------------bootstrap 日期插件初始化---------------------------
function plugTime() {
    $('.calendar').datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        //startDate:new Date(),
        //endDate:new Date(),
        pickerPosition:'bottom-right'//相对位置
    });
}
document.getElementsByTagName('html')[0].style.fontSize=document.body.clientWidth/100 +'px';
$('.pull-right').on('click', '.calendar', function(){ //
    $(this).datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        //startDate:new Date(),
        //endDate:new Date(),
        pickerPosition:'bottom-right'//相对位置
    });
});
$('.pull-right').on('mousedown', '.calendar', function(){ //就改这一行就可以了
    plugTime(this);
});
function plugTime(dom) {
    $(dom).datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        //startDate:new Date(),
        //endDate:new Date(),
        pickerPosition:'bottom-right'//相对位置
    });
    $(dom).click();
    $(dom).blur();
}
document.getElementsByTagName('html')[0].style.fontSize=document.body.clientWidth/100 +'px';
//日期时间处理
var myDate = new Date();
var nowYear=myDate.getFullYear();//当前年份
var nowMonth=myDate.getMonth()+1;//当前月份
var nowMonthstr="";
    nowMonth.length>1?nowMonthstr=nowMonth:nowMonthstr="0"+nowMonth;//当为一位数时，为开头加0，补齐两位数
var nowDay = new Date(nowYear,nowMonth,0);//当前日期
var Month=myDate.getMonth()+1<10?"0"+(myDate.getMonth()+1):myDate.getMonth()+1;
var nowTimes=myDate.getFullYear()+"-"+Month+"-"+myDate.getDate();//当前日期 1970-00-00
var daycount = nowDay.getDate();//当月天数
var Weeks=myDate.getDay(1)+1;//当月1号对应星期
function getWeek(dateString){
    let nowdate;
    if(!dateString){
        nowdate = new Date();
    }else{
        let dateArray = dateString.split("-");
        nowdate = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    }
    //var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
    //return "星期" + weeks[date.getDay()];
    //return "星期" + "日一二三四五六".charAt(nowdate.getDay());
    let nowDayNub = new Date(dateString.substr(0,4),dateString.substr(5,2),0).getDate();//当月天数
    let dataobj={"whatDay":nowdate.getDay(),"nowDayNub":nowDayNub};
    return dataobj;
}
function cutoutmonth(prefixId){
    //截取年月
    let monthval=$("#"+prefixId+" .workMonth").val();
    monthval=monthval.substr(0,monthval.length-3);
    setTimeout(function(){
        $("#"+prefixId+" .workMonth").val(monthval);
    },100);
}
//-------------------导入---------------------------
var wb;//读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串
function importf(obj,values) {
    //导入
    $("#"+obj.id).prev(".defined_file").find("input").val(values);
    if(!obj.files) {
        return;
    }
    var f = obj.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        if(rABS) {
            wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                type: 'base64'
            });
        } else {
            wb = XLSX.read(data, {
                type: 'binary'
            });
        }
    };
    if(rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
}
function fixdata(data) { //文件流转BinaryString
    var o = "",
        l = 0,
        w = 10240;
    for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}
//-------------------导出---------------------------
function downloadExlgather(url){
    $('body').append('<form id="formExlg"></form>');
    $("#formExlg").on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type:"post",
            url:zoneServerIp+url,
            data:{
                "token":permit
            },
            success:function (data) {
                let datas=data;
                if(typeof data=="string"){
                    datas=JSON.parse(data);
                }
                msgTips(datas.msg);
            }
        });
    });
    $("#formExlg").submit();
    $("#formExlg").remove();
}
$("body").on("click",".educeBut",function(){
    let ids=$(this).attr("ids");
    let jsonExl=JSON.parse(localStorage.jsonExl.replace(/null/g,"\"\"")).concat();
    if(jsonExl.length>0){
        downloadExl(jsonExl,ids);
    }else{
        msgTips("暂无数据");
    };
});
var tmpDown; //导出的二进制对象
function downloadExl(json,Exlname) {
    var type="";
    var tmpdata = json[0];
    json.unshift({});
    var keyMap = []; //获取keys
    for (var k in tmpdata) {
        keyMap.push(k);
        json[0][k] = k;
    }
    var tmpdata = [];//用来保存转换好的json
    json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
        v: v.v
    })
    var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    var tmpWB = {
        SheetNames: ['employee'], //保存的表标题
        Sheets: {
            'employee': Object.assign({},
                tmpdata, //内容
                {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                })
        }
    };
    tmpDown = new Blob([s2ab(XLSX.write(tmpWB,
        {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
    ))], {
        type: ""
    }); //创建二进制对象写入转换好的字节流
    var href = URL.createObjectURL(tmpDown); //创建对象超链接
    document.getElementById(Exlname).href = href; //绑定a标签
    document.getElementById(Exlname).click(); //模拟点击实现下载
    setTimeout(function() { //延时释放
        URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
    json=[];
}
function s2ab(s) { //字符串转字符流
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
    let temCol = '',
        s = '',
        m = 0;
    while (n > 0) {
        m = n % 26 + 1;
        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
    }
    return s;
}
// 打印
function sectionalPrint(prefixId,name,html){
    let names="";
    name?names=name:"";
    let printpage=$("#"+prefixId).html();
    $("body").append('<div id="printBox" class="tab-content"><h4>'+name+'</h4>'+printpage+'</div>');
    if(html){$("#printBox tbody").html(html)};
    wipeNull("printBox");
    $("#printBox .notPrint").remove();
    $(".left_aside,.right_aside").hide();
    window.print();
    $(".left_aside,.right_aside").show();
    $("#printBox").remove();
    return false;
}
// ------------------门禁系统------------------
// 获取Mac地址
$("body").on("focus",".inquireMac",function(){
    let this_=$(this);
    this_.next(".inquireMacbox").html("").show();
    let mac=this_.val();
    let type=this_.attr("macType");
    inquireMac(mac,type,this_);
    this_.next(".inquireMacbox").find("p").click(function(){
        alert();
        this_.val($(this).text());
    });
});
$("body").on("keyup",".inquireMac",function(){
    let this_=$(this);
    let mac=this_.val();
    let type=this_.attr("macType");
    inquireMac(mac,type,this_);
});
$("body").on("blur",".inquireMac",function(){
    let this_=$(this);
    setTimeout(function(){
        this_.next(".inquireMacbox").hide();
    },200)
});
$("body").on("click",".inquireMacbox p",function(){
    let mac=$(this).text();
    $(this).parent().prev("input.inquireMac").val(mac);
    $(this).parent().hide();
});
function inquireMac(mac,type,this_){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!showmacchange.action",
        dataType: "json",
        data: {
            "token":permit,
            "mac":mac,
            "type":type
        },
        success: function (data) {
            console.log("获取Mac地址");
            console.log(data);
            //    数据
            if(data.obj){
                let html='';
                for(let i=0;i<data.obj.length;i++){
                    html+='<p>'+data.obj[i].mac+'</p>'
                };
                this_.next(".inquireMacbox").html(html);
            }else{
                this_.next(".inquireMacbox").html("未查询到相符的数据！");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
// 更新机器状态
function updateMachineStatus(){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/controllerAction!changeCtrStatus.action",
        dataType: "json",
        data: {
            "token":permit
        },
        success: function (data) {
            console.log("获取Mac地址");
            console.log(data);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
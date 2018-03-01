/**
 * Created by along on 2017/11/01.部门设置
 */
$("#positionBox").click(function(){
    $("#positions").append('<li><input type="text"><span class="blue deletePositionBut">删除</span></li>');
});
$(" #positions").on("click","span.blue",function(){
    $(this).parent("li").remove();
});
//表单验证
function formVerifyDepartment(){
    let objInput="";
    let deptname=$("#deptname").val();//部门名称
    let deptno=$("#deptno").val();//部门编号
    let duties=$("#duties").val().replace(/(\s*)/g,'');//部门职责
    let positionsIpt=$("#positions").find("input");
    let positions="";
    positionsIpt.each(function(){
        let positionTex=$(this).val();
        positions=positions+","+positionTex
    });
    positions=positions.substr(1,positions.length-1).replace(/(\s*)/g,'');
    let mark=$("#mark").val().replace(/(\s*)/g,'');
    if(!deptname){
        msgTips("请填写部门名称");
        return;
    }
    if(!deptno){
        msgTips("请填写部门编号");
        return;
    }
    if(!duties){
        msgTips("请填写部门职责");
        return;
    }
    if(!positions||positions.length<1){
        msgTips("请添加职位");
        return;
    }
    objInput={
        "deptno":deptno,
        "deptname":deptname,
        "duties":duties,
        "positions":positions,
        "mark":mark
    };
    return objInput;
};
//回显赋值
function echoEchoDepartment(this_){
    //回显
    let deptno=$(this_).parents("tr").find("td").eq(0).attr("deptno");//部门编号
    $("#deptno").val(deptno);
    let deptname=$(this_).parents("tr").find("td").eq(0).text();//部门名称
    $("#deptname").val(deptname);
    let duties=$(this_).parents("tr").find("td").eq(1).attr("content");//部门职责
    $("#duties").val(duties);
    let positionArr=$(this_).parents("tr").find("td").eq(2).attr("content").split(",");//部门职位
    let positionsHtml="";
    for(let i= 0;i<positionArr.length;i++){
        positionsHtml+='<li><input type="text" value="'+positionArr[i]+'"><span class="blue">删除</span></li>';
    }
    $("#positions").html(positionsHtml);
    let mark=$(this_).parents("tr").find("td").eq(3).attr("content");//备注
    $("#mark").val(mark);
};
//查询
// var departmentNub;
function pageListDepartment(page,type){
    // var departmentNub="";
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/departmentAction!queryDepartment.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize
        },
        success: function (data) {
            //console.log("查询部门:");
            //console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_department_set .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#costItemList").html("<p>暂无数据</p>");
                $("#tab_department_set .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_department_set",{"functions":"pageListDepartment(homelistPage,'paging')"});
                };
                var htmlList='';
                var lth=20;
                for(let i=0;i<10;i++){
                    if(obj[i]){
                        // departmentNub=departmentNub+obj[i].deptno+"  ";
                        htmlList+='<tr>';
                        htmlList+='<td deptno="'+obj[i].deptno+'">'+obj[i].deptname+'</td>';
                        htmlList+='<td content="'+obj[i].duties+'"><span class="blue" onclick=previewModal("职责内容","'+obj[i].duties+'")>详情</span></td>';
                        if(obj[i].positions.length>lth){
                            let positionsTex=obj[i].positions.substring(0,lth);
                            htmlList+= '<td content="'+obj[i].positions+'"><span>'+positionsTex+'...'+'</span><span class="blue" onclick=previewModal("职位类型","'+obj[i].positions+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+obj[i].positions+'">'+obj[i].positions+'</td>';
                        }
                        if(obj[i].mark.length>lth){
                            let markTex=obj[i].mark.substring(0,lth);
                            htmlList+= '<td content="'+obj[i].mark+'"><span>'+markTex+'...'+'</span><span class="blue" onclick=previewModal("备注","'+obj[i].mark+'")>详细</span></td>';
                        }else{
                            htmlList+= '<td content="'+obj[i].mark+'">'+obj[i].mark+'</td>';
                        }
                        htmlList+='<td><a class="modifyBut" ids="'+obj[i].id+'" type="costItem">修改</a>| <a class="deleteBut" ids="'+obj[i].id+'" type="costItem">删除</a> </td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#departmentList").html(htmlList);
                wipeNull("departmentList");
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//加载初始方法
$('a[href="#property_management_menu"],a[href="#tab_department_set"]').click(function(){
    setTimeout(function(){$(".department_set").addClass("active");},200);
    pageListDepartment(1);
});
$("#addDepartmentBut").click(function(){
    $("#deptname,#deptno,#duties,#mark").val("");
    $("#positions").html('<li><input type="text" value=""><span class="blue deletePositionBut">删除</span></li>');
    $("#addDepartmentModal .modal-title").text("添加");
    $("#addDepartmentModal").modal("show");
    $("#submitBepartmentBut").attr("type","add");
});
$("#departmentList").on("click",".modifyBut",function(){
    let this_=$(this);
    echoEchoDepartment(this_);
    let ids=$(this).attr("ids");
    $("#addDepartmentModal .modal-title").text("修改");
    $("#addDepartmentModal").modal("show");
    $("#submitBepartmentBut").attr({"type":"modify","ids":ids});
});
$("#submitBepartmentBut").click(function(){
    let objInput=formVerifyDepartment();
    let type=$(this).attr("type");
    let id=$(this).attr("ids");
    if(type=="add"){
        var ajaxurl="/ucotSmart/departmentAction!addDepartment.action";
        var msgtext="添加部门";
    }else if(type=="modify"){
        var ajaxurl="/ucotSmart/departmentAction!updateDepartment.action";
        var msgtext="修改部门";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: {
            "token":permit,
            "department.id":id,
            "department.deptno":objInput.deptno,
            "department.deptname":objInput.deptname,
            "department.duties":objInput.duties,
            "department.positions":objInput.positions,
            "department.mark":objInput.mark
        },
        success: function (data) {
            //console.log(msgtext);
            //console.log(data);
            //    数据
            if(data.success==true) {
                pageListDepartment();
                departmentMenu();
                $("#addDepartmentModal").modal("hide");
            }
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
$("#departmentList").on("click",".deleteBut",function(){
    // 删除
    let ids=$(this).attr("ids");
    dataObj={"token":permit,"ids":ids};
    callBack="pageListDepartment();departmentMenu()";
    ajaxURL="/ucotSmart/departmentAction!deleteDepartment.action";
    deletePubModal(dataObj,callBack,ajaxURL);
});
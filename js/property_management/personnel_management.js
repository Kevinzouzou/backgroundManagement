/**
 * Created by along on 2017/11/01.员工管理
 */
var zonePicFile=zoneServerIp+"/ucotSmart";
//时间日期控件
$(".calendar").click(function(){
    $(this).blur();
});
//表单验证
function formVerifyPersonnel(prefixId){
    let objInput="";
    let accout=$("#"+prefixId+" .accout").val();//工号
    if(!accout){msgTips("请填写工号");return;}
    let ename=$("#"+prefixId+" .ename").val();//姓名
    if(!ename){msgTips("请填写姓名");return;}
    let gender=$("#"+prefixId+" .gender .dropdown-toggle span").text();//性别
    let identify=$("#"+prefixId+" .identifys").val();//身份证
    if(!identify||identify.length>18){msgTips("身份证格式错误");return;}
    let birthday=$("#"+prefixId+" .birthday").val();//出生年月
    if(!birthday){msgTips("请选择出生年月");return;}
    let registeredad=$("#"+prefixId+" .registeredad").val();//户口地址
    if(!registeredad){msgTips("请填写户口地址");return;}
    let address=$("#"+prefixId+" .address").val();//居住地址
    if(!address){msgTips("请填写居住地址");return;}
    let cellphone=$("#"+prefixId+" .cellphone").val();//电话
    if(!cellphone||cellphone.length>11){msgTips("电话格式错误");return;}
    let weichatNo=$("#"+prefixId+" .weichatNo").val();//微信
    if(!weichatNo){msgTips("请填写微信");return;}
    let entryday=$("#"+prefixId+" .entryday").val();//入职时间
    if(!entryday){msgTips("请选择入职时间");return;}
    let deptno=$("#"+prefixId+" .deptname").attr("optionid");//部门
    if(!deptno){msgTips("请选择部门");return;}
    let deptname=$("#"+prefixId+" .deptname").attr("modename");
    let jobposition=$("#"+prefixId+" #jobposition .jobposition").attr("modename");//职位
    if(!jobposition){msgTips("请选择职位");return;}
    let grantleve=$("#"+prefixId+" .grantleve").attr("optionid");//权限
    if(!grantleve){msgTips("请选择权限");return;}
    let emergencyContact=$("#"+prefixId+" .emergencyContact").val();//紧急联络人 姓名
    if(!emergencyContact){msgTips("请填写紧急联络人 姓名");return;}
    let emergencyPhone=$("#"+prefixId+" .emergencyPhone").val();//紧急联络人 电话
    if(!emergencyPhone||emergencyPhone.length>11){msgTips("请填写紧急联络人 电话");return;}
    let upfileName=$("#"+prefixId+" .upfileName").attr("upfileName");//图片名称
    objInput={
        "accout":accout,
        "ename":ename,
        "gender":gender,
        "identify":identify,
        "birthday":birthday,
        "registeredad":registeredad,
         "address":address,
        "cellphone":cellphone,
        "weichatNo":weichatNo,
        "entryday":entryday,
        "deptno":deptno,
         "deptname":deptname,
        "jobposition":jobposition,
        "grantleve":grantleve,
        "emergencyContact":emergencyContact,
        "emergencyPhone":emergencyPhone,
        "upfileName":upfileName
    };
    return objInput;
};
//回显赋值
function echoEchoPersonnel(prefixId,obje){
    //console.log(obje);
    //回显
    $("#"+prefixId+" .accout").val(obje.accout);//工号
    $("#"+prefixId+" .ename").val(obje.ename);//姓名
    $("#"+prefixId+" .gender .option_type").text(obje.gender);//性别
    $("#"+prefixId+" .gender").val(obje.gender);
    $("#"+prefixId+" .identifys").val(obje.identify);//身份证
    $("#"+prefixId+" .birthday").val(obje.birthday);//出生年月
    if(obje.image){
        let names=obje.image.lastIndexOf("/");
        let upfileName=obje.image.substring(names+1,obje.image.length);
        let imgName=obje.image.substring(names+1,obje.image.length-4);
        $("#"+prefixId+" img.portrait").attr("src",zonePicFile+obje.image);//图片
        $("#"+prefixId+" .upfileName").val(imgName).attr("upfileName",upfileName);
    }else{
        $("#"+prefixId+" img.portrait").attr("src","img/portrait.png");
        $("#"+prefixId+" .upfileName").val("");
    };
    $("#"+prefixId+" .registeredad").val(obje.registeredaddress);//户口地址
    $("#"+prefixId+" .address").val(obje.address);//居住地址
    $("#"+prefixId+" .cellphone").val(obje.cellphone);//电话
    $("#"+prefixId+" .weichatNo").val(obje.weichatNo);//微信
    $("#"+prefixId+" .entryday").val(obje.entryday);//入职时间
    $("#"+prefixId+" .deptname").attr("optionid",obje.deptno).attr("modename",obje.deptname);//部门
    $("#"+prefixId+" .deptname .option_type").text(obje.deptname);
    $("#"+prefixId+" .deptname").val(obje.deptname);
    $("#"+prefixId+" .jobposition").val(obje.jobposition);//职位
    $("#"+prefixId+" #jobposition .jobposition").attr("modename",obje.jobposition).find(".dropdown-toggle span").text(obje.jobposition);
    $("#"+prefixId+" .grantleve").attr("optionid",obje.grantleve);//权限
    let grantleve;
    switch (obje.grantleve){
        case 30:grantleve="普通";
            break;
        case 40:grantleve="租客";
            break;
        case 60:grantleve="家人";
            break;
        case 70:grantleve="业主";
            break;
    }
    $("#"+prefixId+" .grantleve").val(grantleve);
    $("#"+prefixId+" .grantleve .span").text(grantleve);
    $("#"+prefixId+" .grantleve").attr("modename",grantleve);
    $("#"+prefixId+" .grantleve .option_type").text(grantleve);
    $("#"+prefixId+" .emergencyContact").val(obje.emergencyContact);//紧急联络人 姓名
    $("#"+prefixId+" .emergencyPhone").val(obje.emergencyPhone);//紧急联络人 电话
};
//上传相片
$(".uploadingImg").change(function uploadingImg(){
    let pathUrl=$(this).val();
    let names=pathUrl.lastIndexOf("\\");
    let upfileName=pathUrl.substring(names+1,pathUrl.length);
    let imgName=pathUrl.substring(names+1,pathUrl.length-4);
    //let patt=/[\-.]/g;
    //let name=pathUrl.match(patt);
    $(".upfileName").val(imgName).attr("upfileName",upfileName);
    let file =$(this).get(0).files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload=function(e){
        // console.log(e);
        $("#addPersonnelModal .uploading .portrait").attr("src",e.target.result);//预览图片
    };
});
//初始化数据
$('a[href="#tab_personnel_management"]').click(function(){
    departmentMenu("personnelMenu");
    departmentMenu("addPersonnelModal #deptname");//--查询部门方法departmentMenu()在public.js--
    pageListPersonnel("");
});
//查询
function pageListPersonnel(page,type){
    let deptnoid=$("#personnelMenu .personnelMenu").attr("optionid");
    deptnoid?"":deptnoid="";
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/employeeAction!queryEmployee.action",
        dataType: "json",
        data: {
            "token":permit,
            "pager.pages":page,
            "pager.pagesize":pageListSize,
            "employee.deptno":deptnoid
        },
        success: function (data) {
            // console.log("查询人员:");
            // console.log(data);
            //    数据
            if(data.obj){
                var obj=data.obj.data;
                var pageList=obj.length;
                var totalNum=data.obj.data_count;
                $("#tab_personnel_management .pagingImplement .pageTips").text("当前页面共"+pageList+"条数据 总共"+totalNum+"条数据");
            };
            if(totalNum==0){
                $("#tab_personnel_management .pagingImplement .pageList").hide();
                $("#personnelManagementList").html("<p>暂无数据</p>");
                $("#personnelTable .checkboxsBut").hide();
                $("#tab_personnel_management .pagingImplement .pageTips").text("当前页面共0条数据 总共0条数据");
            }else if(obj){
                $("#personnelTable .checkboxsBut").show();
                if(!type||type!="paging"){
                    pagingPlugin(pageList,totalNum,"tab_personnel_management",{"functions":"pageListPersonnel(homelistPage,'paging')"});
                };
                let htmlList='',jsonExl=[];
                for(let i=0;i<10;i++){
                    if(obj[i]){
                        let obje = new Object();
                            obje=obj[i];
                        let str=JSON.stringify(obje);
                        let ids=obj[i].id,accout=obj[i].accout,ename=obj[i].ename,cellphone=obj[i].cellphone,deptname=obj[i].deptname,jobposition=obj[i].jobposition,grantleve=obj[i].grantleve,gender=obj[i].gender,identifys=obj[i].identifys,birthday=obj[i].birthday,registeredad=obj[i].registeredad,address=obj[i].address,weichatNo=obj[i].weichatNo,entryday=obj[i].entryday,emergencyContact=obj[i].emergencyContact,emergencyPhone=obj[i].emergencyPhone;
                        if(!obj[i].accout){accout=""};
                        if(!obj[i].ename){ename=""};
                        if(!obj[i].cellphone){cellphone=""};
                        if(!obj[i].deptname){deptname=""};
                        if(!obj[i].jobposition){jobposition=""};
                        if(!obj[i].grantleve){grantleve=""};
                        switch (grantleve){
                            case 30:grantleve="普通";
                                break;
                            case 40:grantleve="租客";
                                break;
                            case 60:grantleve="家人";
                                break;
                            case 70:grantleve="业主";
                                break;
                        }
                        let liston={
                            "id":ids,
                            "工号":accout,
                            "姓名":ename,
                            "性别":gender,
                            "身份证号":identifys,
                            "出生年月":birthday,
                            "户口地址":registeredad,
                            "居住地址":address,
                            "电话":cellphone,
                            "微信":weichatNo,
                            "入职时间":entryday,
                            "部门":deptname,
                            "职位":jobposition,
                            "权限":obj[i].grantleve,
                            "紧急联络人姓名":emergencyContact,
                            "紧急联络人电话":emergencyPhone
                        };
                        jsonExl.push(liston);
                        htmlList+='<tr>';
                        htmlList+='<td class="notPrint"><input id="'+ids+'" type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        htmlList+='<td>'+accout+'</td>';
                        htmlList+='<td>'+ename+'</td>';
                        htmlList+= '<td>'+cellphone+'</td>';
                        htmlList+= '<td deptno="'+obj[i].deptno+'">'+deptname+'</td>';
                        htmlList+= '<td>'+jobposition+'</td>';
                        htmlList+= '<td>'+grantleve+'</td>';
                        htmlList+= '<td class="notPrint"><a class="checkBut" ids="'+ids+'">查看<i style="display:none">'+str+'</i></a></td>';
                        htmlList+='<td class="notPrint"><a class="modifyBut" ids="'+ids+'" type="costItem">修改<i style="display:none">'+str+'</i></a>| <a class="deleteBut" ids="'+ids+'" type="costItem">删除</a> </td>';
                        htmlList+='</tr>';
                    }else{
                        htmlList+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    };
                };
                $("#personnelManagementList").html(htmlList);
                wipeNull("personnelManagementList");
                localStorage.jsonExl=JSON.stringify(jsonExl);
            };
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
};
//添加
$("#addPersonnelBut").click(function(){
    $("#deptname,#deptno,#duties,#mark").val("");
    $("#jobposition .jobposition").attr("modename","").find(".dropdown-toggle span").text("");
    $("#jobposition .jobposition .dropdown-menu").empty();
    $("#addPersonnelModal .modal-title").text("添加");
    $("#addPersonnelForm input").val("");
    $("#gender .gender").attr({"modename":"男","optionid":"1"});
    $("#gender .gender").find(".dropdown-toggle span").text("男");
    $("#addPersonnelForm img.portrait").attr("src","img/portrait.png");
    $("#deptname .deptname,#grantleve .grantleve").attr({"modename":"","optionid":""});
    $("#deptname .deptname,#grantleve .grantleve").find(".dropdown-toggle span").text("");
    $("#addPersonnelModal").modal("show");
    $("#submitPersonnelBut").attr("type","add");
});
//修改
$("#personnelManagementList").on("click",".modifyBut",function(){
    let this_=$(this);
    let str=$(this).find("i").text();
    let obje=JSON.parse(str);
    echoEchoPersonnel("addPersonnelForm",obje);
    let ids=$(this).attr("ids");
    $("#addPersonnelModal .modal-title").text("修改");
    $("#addPersonnelModal").modal("show");
    $("#submitPersonnelBut").attr({"type":"modify","ids":ids});
});
//提交数据
$("#submitPersonnelBut").click(function(){
    let objInput=formVerifyPersonnel("addPersonnelForm");
    let type=$(this).attr("type");
    let id=$(this).attr("ids");
    let formData = new FormData();
    formData.append("upfile",$(".uploadingImg")[0].files[0]);
    formData.append("upfileName",objInput.upfileName);
    formData.append("token",permit);
    formData.append("employee.id",id);
    formData.append("employee.accout",objInput.accout);
    formData.append("employee.gender",objInput.gender);
    formData.append("employee.deptno",objInput.deptno);
    formData.append("employee.deptname",objInput.deptname);
    formData.append("employee.jobposition",objInput.jobposition);
    formData.append("employee.grantleve",objInput.grantleve);
    formData.append("employee.ename",objInput.ename);
    formData.append("employee.identify",objInput.identify);
    formData.append("employee.birthday",objInput.birthday);
    formData.append("employee.registeredaddress",objInput.registeredad);
    formData.append("employee.address",objInput.address);
    formData.append("employee.cellphone",objInput.cellphone);
    formData.append("employee.weichatNo",objInput.weichatNo);
    formData.append("employee.entryday",objInput.entryday);
    formData.append("employee.emergencyContact",objInput.emergencyContact);
    formData.append("employee.emergencyPhone",objInput.emergencyPhone);
    // console.log(formData);
    if(type=="add"){
        var ajaxurl="/ucotSmart/employeeAction!addEmployee.action";
        var msgtext="添加员工";
    }else if(type=="modify"){
        var ajaxurl="/ucotSmart/employeeAction!updateEmployee.action";
        var msgtext="修改员工";
    };
    $.ajax({
        type: "post",
        url: zoneServerIp+ajaxurl,
        dataType: "json",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if(typeof(data)=="string"){
                data=JSON.parse(data)
            }
            // console.log(msgtext);
            // console.log(data);
            //    数据
            if(data.success==true){
                // let deptnoMenu=$("#personnelMenu .personnelMenu").attr("optionid");
                // if(objInput.deptno!=deptnoMenu){
                //     $("#personnelMenu .personnelMenu").attr("optionid",objInput.deptno);
                //     $("#personnelMenu .personnelMenu a.dropdown-toggle span").text(objInput.deptname);
                // }
                pageListPersonnel();
                $("#addPersonnelModal").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//删除
$("#personnelManagementList").on("click",".deleteBut",function(){
    let ids=$(this).attr("ids");
    deleteStaff(ids);

});
$("#batchDelete").click(function(){
    // 批量删除
    deleteStaff();
});
function deleteStaff(ids){
    if(!ids){
        //批量删除
        ids="";
        let inputs=$("#personnelManagementList input");
        inputs.each(function(){
            if($(this).is(":checked")){
                let this_id=$(this).attr("id");
                ids=ids+","+this_id;
            };
        });
        ids=ids.substr(1,ids.length);
        if(!ids){msgTips("请选择要删除的员工");return};
    }
    dataObj={"token":permit,"ids":ids};
    callBack="pageListPersonnel()";
    ajaxURL="/ucotSmart/employeeAction!deleteEmployee.action";
    deletePubModal(dataObj,callBack,ajaxURL);
}
//查看
$("#personnelManagementList").on("click",".checkBut",function(){
    let str=$(this).find("i").text();
    let obje=JSON.parse(str);
    echoEchoPersonnel("checkForm",obje);
    $("#checkModal").modal("show");
});
//-------------------导出---------------------------
//员工信息
$("#personnelExport").click(function () {
    downloadExlgather("/ucotSmart/employeeAction!exportEmployees.action");
});
//-------------------导入---------------------------
$("#import_personnel").change(function(){
    $("#defined_personnel").val($(this).val());
});
$("#submitImportBut").click(function(){
    let importFormData = new FormData();
        importFormData.append("upfile",$("#import_personnel")[0].files[0]);
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/employeeAction!importEmplloyees.action",
        data: importFormData,
        processData: false,
        contentType: false,
        success: function (data) {
            // console.log("导入员工:");
            if(typeof(data)=="string"){
                data=JSON.parse(data)
            }
            // console.log(data);
            //    数据
            if(data.success==true){
                pageListPersonnel();
                $("#import_personnel").val("");
                $("#importPersonnel").modal("hide");
            };
            msgTips(data.msg);
        },
        error: function (data, status) {
            //msgTips("");
        }
    });
});
//-------------------打印---------------------------
$("#personnelPrint").click(function(){
    sectionalPrint("printPersonnel","员工管理打印数据");
});
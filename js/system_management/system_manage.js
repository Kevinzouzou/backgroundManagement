/**
 * Created by GIGA on 2017-12-14.
 */
//下拉组件，选中填充
function selectDropdownMenu(class1,class2){
    $("body").on('click',class1+">li>a",function(){
        if($(this).attr("ids")){
            var ids=$(this).attr("ids");
            $(this).parent().parent().siblings(class2).attr("ids",ids);
        }
        $(this).parent().parent().siblings(class2).find("span").text($(this).html());
    });
}
//下拉填充 并传参ids
selectDropdownMenu(".areaZoneList-menu",".areaZoneList");

//系统管理 单击事件 系统信息查询
$(".system_management>a").on('click',function(){
    querySysMg();
});
//系统信息查询
function querySysMg(){
    ajaxRequest('systeminfoAction!querySysteminfo.action',"","addSysMg");
}
//系统信息
function addSysMg(list){
    console.log(list);
    $.each(list,function(i,sysItem){
        console.log(sysItem);
        var id="#tab_system_infor .sys_contain";
        $(id+" .comNameInfo").text(sysItem.companyname);
        $(id+" .comNameInfo").attr("ids",sysItem.id);
        $(id+" .comDelInfo").text(sysItem.companyphone);
        $(id+" .comEmailInfo").text(sysItem.companyemail);
        $(id+" .comAddressInfo").text(sysItem.companyaddress);
        $(id+" .softVersionInfo").text(sysItem.systemversion);
        $(id+" .updateTimeInfo").text(sysItem.updatetime);
    })
}
//系统信息 修改
function modifySysMg(list){
    console.log(list);
    querySysMg();
}

//系统信息设置 确认
$("body").on('click','#tab_system_infor .box .determine',function(){
    console.log("determine");
    $("#tab_system_infor .btns .modify").removeClass("disabled");
    $("#tab_system_infor .box .b_footer").css("display","none");
    var id="#tab_system_infor .sys_contain";
    var comNameInfo=$(id+" .comName").val();
    var comNameInfoId=$(id+" .comName").attr("ids");
    var comDelInfo=$(id+" .comDel").val();
    var comEmailInfo=$(id+" .comEmail").val();
    var comAddressInfo=$(id+" .comAddress").val();
    var softVersionInfo=$(id+" .softVersion").val();
    var updateTimeInfo=$(id+" .updateTime").val();
    var data="&systeminfo.id="+comNameInfoId+"&systeminfo.companyname="+comNameInfo+"&systeminfo.companyphone="+comDelInfo+
        "&systeminfo.companyemail="+comEmailInfo+"&systeminfo.companyaddress="+comAddressInfo+"&systeminfo.systemversion="+softVersionInfo+
        "&systeminfo.updatetime="+updateTimeInfo;
    ajaxRequest("systeminfoAction!updateSysteminfo.action",data,"modifySysMg");


    $(id+" li>input").css("display","none");
    $(id+" li>b").css("display","inline-block");
});
//系统信息设置 取消
$("body").on('click','#tab_system_infor .box .cancel',function(){
    console.log("cancel");
    $("#tab_system_infor .btns .modify").removeClass("disabled");
    $("#tab_system_infor .box .b_footer").css("display","none");
    var id="#tab_system_infor .sys_contain";
    $(id+" li>input").css("display","none");
    $(id+" li>b").css("display","inline-block");
});
//系统信息修改
$("body").on('click','#tab_system_infor .btns .modify',function(){
    console.log("modify");
    $("#tab_system_infor .btns .modify").addClass("disabled");
    $("#tab_system_infor .box .b_footer").css("display","block");
    var id="#tab_system_infor .sys_contain";
    $(id+" .comName").val($(id+" .comNameInfo").text());
    $(id+" .comName").attr("ids",$(id+" .comNameInfo").attr("ids"));
    $(id+" .comDel").val($(id+" .comDelInfo").text());
    $(id+" .comEmail").val($(id+" .comEmailInfo").text());
    $(id+" .comAddress").val($(id+" .comAddressInfo").text());
    $(id+" .softVersion").val($(id+" .softVersionInfo").text());
    $(id+" .updateTime").val($(id+" .updateTimeInfo").text());
    $(id+" li>input").css("display","inline-block");
    $(id+" li>b").css("display","none");
});
var token=sessionStorage.getItem("token"),
    userName=sessionStorage.getItem("username");
//系统设置》修改密码
$("body").on('click',"#tab_system_settings .change_pwd",function(){
    console.log(token+"---"+userName);
    var i="1"+token.substring(token.length-2);
    var level=parseInt(token.substring(0,token.indexOf("-")));
    $(".changePwdLabel>li").removeClass("active");
    //判断是否是超级用户，当level/i=100时，为超级用户
    if(level/i==100){
        console.log(level/i+"=====");
        $("#tab_change_pwd .normal").css("display","none");
        $("#tab_change_pwd .superAdmin").css("display","block");
    }else{
        console.log(level/i+"=====");
        $("#tab_change_pwd .superAdmin").css("display","none");
        $("#tab_change_pwd .normal").css("display","block");
    }
});
//超级用户 给二级用户修改密码》超级密码
$("#tab_change_pwd .superAdmin .superPwd").blur(function(){
    var value=$(this).val();
    var data="&userPage.password="+value;
    blurAjax(data,"#tab_change_pwd .superAdmin .superPwd","#tab_change_pwd .superAdmin .changePwdLabel",1);
});
//用户名
$("#tab_change_pwd .superAdmin .userName").blur(function(){
    var value=$(this).val();
    if(value==""||value==null){
        $(this).siblings("b").removeClass("true").css("display","inline-block").html("用户名不能为空");
        $("#tab_change_pwd .superAdmin .changePwdLabel").children("li:nth-child(2)").removeClass("active");
    }else{
        var data="&userPage.password="+$("#tab_change_pwd .superAdmin .superPwd").val()+
            "&username="+value;
        blurAjax(data,"#tab_change_pwd .superAdmin .userName","#tab_change_pwd .superAdmin .changePwdLabel",2);
    }
});
//新密码
newPassword("#tab_change_pwd .superAdmin",3);
//确认密码
confirmPassword("#tab_change_pwd .superAdmin",4);

//表单异步验证：密码，用户名
function blurAjax(data,bTrueId,liActiveId,i){
    var data="token="+permit+"&userPage.username="+userName+data;
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/loginAction!updatePassword.action",
        data: data,
        dataType: "json",
        success:function(js){
            console.log(js);
            if(js.success==true){
                console.log("true");
                $(bTrueId).siblings("b").addClass("true").css("display","inline-block").html("");
                if(i==1){
                    $(liActiveId).children("li:first-child").addClass("active");
                }else{
                    $(liActiveId).children("li:nth-child("+i+")").addClass("active");
                }
            }else if(js.success==false){
                $(bTrueId).siblings("b").removeClass("true").css("display","inline-block").html(js.msg);
                if(i==1){
                    $(liActiveId).children("li:first-child").removeClass("active");
                }else{
                    $(liActiveId).children("li:nth-child("+i+")").removeClass("active");
                }
            }
        },
        error:function(){
            msgTips("请求失败！");
        }
    });
}
//验证新密码
function newPassword(id,i){
    $(id+" .newPwd").blur(function(){
        if(this.validity.valueMissing){
            var msg="密码不能为空！";
            $(this).siblings("b").removeClass("true").css("display","inline-block").html(msg);
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").removeClass("active");
            this.setCustomValidity(msg);
        }else if(this.validity.tooShort){
            var msg="密码不能短于6位！";
            $(this).siblings("b").removeClass("true").css("display","inline-block").html(msg);
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").removeClass("active");
            this.setCustomValidity(msg);
        }else if(this.validity.tooLong){
            var msg="密码不能超过20位！";
            $(this).siblings("b").removeClass("true").css("display","inline-block").html(msg);
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").removeClass("active");
            this.setCustomValidity(msg);
        }else if(this.validity.patternMismatch){
            var msg="密码输入有误！";
            $(this).siblings("b").removeClass("true").css("display","inline-block").html(msg);
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").removeClass("active");
            this.setCustomValidity(msg);
        }else{
            $(this).siblings("b").addClass("true").css("display","inline-block").html("");
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").addClass("active");
            this.setCustomValidity("");
        }
    });
}
//验证旧密码
function confirmPassword(id,i){
    $(id+" .confirmPwd").blur(function(){
        var confirmPwd=$(this).val();
        var newPwd=$(id+" .newPwd").val();
        if(confirmPwd!=newPwd){
            var msg="两次输入的密码不一致";
            $(this).siblings("b").removeClass("true").css("display","inline-block").html(msg);
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").removeClass("active");
            this.setCustomValidity(msg);
        }else{
            $(this).siblings("b").addClass("true").css("display","inline-block").html("");
            $(id+" .changePwdLabel").children("li:nth-child("+i+")").addClass("active");
            this.setCustomValidity("");
        }
    });
}

//普通用户 修改密码》旧密码
$("#tab_change_pwd .normal .oldPwd").blur(function(){
    var oldPwd=$(this).val();
    var data="&userPage.password="+oldPwd;
    blurAjax(data,"#tab_change_pwd .normal .oldPwd","#tab_change_pwd .normal .changePwdLabel",1);
});
//新密码
newPassword("#tab_change_pwd .normal",2);
//确认密码
confirmPassword("#tab_change_pwd .normal",3);

//修改密码确认 determine
$("body").on('click','#tab_change_pwd .box .b_footer .determine',function(){
    var i="1"+token.substring(token.length-2);
    var level=parseInt(token.substring(0,token.indexOf("-")));
    $(".changePwdLabel>li").removeClass("active");
    var id,superPwd,user,newPwd,confirmPwd,oldPwd,data;
    //判断是否是超级用户，当level/i=100时，为超级用户
    if(level/i==100){
        id="#tab_change_pwd .superAdmin";
        superPwd=$(id+" .superPwd").val();
        user=$(id+" .userName").val();
        newPwd=$(id+" .newPwd").val();
        confirmPwd=$(id+" .confirmPwd").val();
        if(superPwd==""||user==""||newPwd==""||confirmPwd==""||newPwd!==confirmPwd){
            msgTips("请完善填写内容！");
        }else{
            data="token="+permit+"&userPage.username="+userName+"&userPage.password="+superPwd+"&username="+user+"&newpassword="+newPwd;
            changePwd(data,id);
        }
    }else{
        id="#tab_change_pwd .normal";
        oldPwd=$(id+" .oldPwd").val();
        newPwd=$(id+" .newPwd").val();
        confirmPwd=$(id+" .confirmPwd").val();
        if(oldPwd==""||newPwd==""||confirmPwd==""||newPwd!==confirmPwd){
            msgTips("请完善填写内容！");
        }else{
            data="token="+permit+"&userPage.username="+userName+"&userPage.password="+oldPwd+"&newpassword="+newPwd;
            changePwd(data,id);
        }
    }
});
//密码修改
function changePwd(data,id){
    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/loginAction!updatePassword.action",
        data: data,
        dataType: "json",
        success:function(js){
            console.log(js);
            if(js.success==true){
                console.log("true");
                msgTips(js.msg);
                $(id+" .large-half li>input").val("");
                $(id+" .large-half li>b").css("display","none").removeClass("true");
                $(id+" .changePwdLabel li").removeClass("active");
            }else if(js.success==false){
                console.log(false);
                msgTips(js.msg);
            }
        },
        error:function(){
            msgTips("请求失败！");
        }
    });
}


//数据管理》2.自动备份
$("body").on('click',"#tab_auto_backup .backupCycle>.dropdown-menu li>a",function(){
    var id="#tab_auto_backup";
    if($(this).attr("ids")==0){
        $(id+" .box .large-half>.dateSet").css("display","none");
    }else if($(this).attr("ids")==1){
        $(id+" .box .large-half>.dateSet").css("display","none");
        $(id+" .box .large-half>.week").css("display","block");
    }else if($(this).attr("ids")==2){
        $(id+" .box .large-half>.dateSet").css("display","none");
        $(id+" .box .large-half>.month").css("display","block");
    }else if($(this).attr("ids")==3){
        $(id+" .box .large-half>.dateSet").css("display","none");
        $(id+" .box .large-half>.year").css("display","block");
    }
});

/**
 * Created by GIGA on 2017-05-18.
 */
//声明变量： 业主电话：phoneNum、电话号码：tel、验证码：checkCode、密码：password、确认密码：repassword
var phoneNum=document.getElementById("phoneNum");
var checkCode=document.getElementById("checkCode");
var pwd=document.getElementById("pwd");
var rePwd=document.getElementById("rePwd");
var emil=document.getElementById("emil");

function strToJson(str){
    var json = (new Function("return " + str))();
    return json;
}

//手机号码
phoneNum.onblur=function(){
    if(this.validity.valueMissing){
        var msg="输入的手机号码不为空";
        $(".num_info").css("display","block").html(msg);
        this.setCustomValidity(msg);
    }else if(this.validity.patternMismatch){
        var msg="输入的手机号码不存在";
        $(".num_info").css("display","block").html(msg);
        this.setCustomValidity(msg);
    }else{
        $(".num_info").css("display","none");
        this.setCustomValidity("");
    }
};

//验证码
checkCode.onblur=function(){
    if(this.validity.valueMissing){
        var msg="输入的验证码有误";
        $(".vCode_info").css("display","block");
        this.setCustomValidity(msg);
    }else{
        $(".vCode_info").css("display","none");
        this.setCustomValidity("");
    }
};

//倒计时60秒
var wait=60;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.value="获取动态码";
        o.style.backgroundColor="#F0AD4E";
        o.style.color="#fff";
        wait = 60;
    } else {
        o.setAttribute("disabled", true);
        o.value= wait + "s"+" 重发";
        o.style.backgroundColor="#ddd";
        o.style.color="#999";
        wait--;
        setTimeout(function() {
            time(o)
        }, 1000)
    }
}

//获取验证码
$('#send').click(function() {
    time(send);
});

//密码
pwd.onblur=function(){
    if(this.validity.valueMissing){
        var msg="密码需要6~14位，包含字母、数字和下划线";
        $(".pwd_info").css("display","block");
        this.setCustomValidity(msg);
    }else if(this.validity.tooShort){
        var msg="密码不能短于6位";
        $(".pwd_info").css("display","block").css("right","-9.5rem").html(msg);
        this.setCustomValidity(msg);
    }else if(this.validity.tooLong){
        var msg="密码不能超过12位";
        $(".pwd_info").css("display","block").css("right","-9.5rem").html(msg);
        this.setCustomValidity(msg);
    }else if(this.validity.patternMismatch){
        var msg="密码需要6~14位，包含字母、数字和下划线";
        $(".pwd_info").css("display","block").html(msg);
        this.setCustomValidity(msg);
    }else{
        $(".pwd_info").css("display","none");
        this.setCustomValidity("");
    }
};

//确认密码
rePwd.onblur=function(){
    if(rePwd.value!=pwd.value){
        var msg="两次输入的密码不一致";
        $(".rePwd_info").css("display","block").html(msg);
        this.setCustomValidity(msg);
    }else{
        $(".rePwd_info").css("display","none");
        this.setCustomValidity("");
    }
};

//E-mail
emil.onblur=function(){
    if(this.validity.valueMissing){
        var msg="E-mail 不能为空";
        $(".emil_info").css("display","block").html(msg);
        this.setCustomValidity(msg);
    }else if(this.validity.patternMismatch){
        var msg="E-mail 格式有误";
        $(".emil_info").css("display","block").html(msg);
        this.setCustomValidity(msg);
    }else{
        $(".emil_info").css("display","none");
        this.setCustomValidity("");
    }
};

//选择所属小区，请求得到小区服务器zoneServerIp地址
$("#forZones").change(function(){
    var opt=$("#forZones").val();
    $.ajax({
        url:SERVER_IP + "/ucotSmart/getLocalServerInfoAction!noSen_getlocalSerIp.action",
        type:"POST",
        data:"zonecode="+opt,
        success:function(data){
            var data=strToJson(data);
            sessionStorage.zoneServerIp=data.msg;
        },
        error:function(){
            alert("获取服务器地址失败！");
        }
    })
});

//注册按钮注册成功
$(".toRegister").click(function(){
    phoneNums=phoneNum.value;
    pwds=pwd.value;
    rePwds=rePwd.value;
    checkCodes=checkCode.value;
    emils=emil.value;
    var zoneValue=$("#forZones").val();
    var roleValue=$("#roles").val();

    if($("#copyRight").prop("checked")){
        $.ajax({
            //url:'http://'+sessionStorage.zoneServerIp + ':8080/ucotSmart/loginAction!doNotNeedSession_reg.action',
            url:zoneServerIp + '/ucotSmart/loginAction!doNotNeedSession_reg.action',
            type:'POST',
            data: "userPage.cellphone="+phoneNums+"&&checkCode="+checkCodes+"&&userPage.password="+pwds
            +"&&userPage.email="+emils+"&&userPage.zonecode="+zoneValue+"&&userPage.role="+roleValue,
            beforeSend: function(XMLHttpRequest) {
                //$(".loading").css("display","block");
            },
            success:function(data) {
                data=strToJson(data);
                window.location.href = "login.html";
                //$(".loading").css("display","none");
                alert(data.msg);
            },
            error:function(){
                alert("注册失败！");
            }
        });
    }else{
        alert("是否阅读并接受《版权声明》和《隐私保护》！")
    }
});


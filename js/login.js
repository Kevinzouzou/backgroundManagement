/**
 * Created by Admin on 2017/9/6.
 */
$(document).ready(function(){
    //从Cookie获取到用户名
    var username = getCookie("This is username") ;
    var password = getCookie(username) ;
    $("#login_username").val(username);
    $("#login_password").val(password);
});

//设置cookie
function setCookie(name,value,day){
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires='+ date;
}
//获取cookie
function getCookie(name){
    var reg = RegExp(name+'=([^;]+)');
    var arr = document.cookie.match(reg);
    if(arr){
        return arr[1];
    }else{
        return '';
    }
}
//删除cookie
function delCookie(name){
    setCookie(name,null,-1);
}

function check (){
    //获取表单输入:用户名,密码,是否保存密码
    var username = document.getElementById("login_username").value.trim() ;
    var password = document.getElementById("login_password").value.trim() ;
    var isRmbPwd = document.getElementById("rem").checked ;

    //判断用户名,密码是否为空(全空格也算空)
    if ( username.length != 0 && password.length != 0 ){
        //若复选框勾选,则添加Cookie,记录密码
        if ( isRmbPwd == true ){
            setCookie ( "This is username", username, 7 ) ;
            setCookie ( username, password, 7 ) ;
        }
        //否则清除Cookie
        else
        {
            delCookie ( "This is username" ) ;
            delCookie ( username ) ;
        }
        return true ;
    }
}

//登录
$('#login_in').click(function () {
    check();
    var username=$('#login_username').val();
    var password=$('#login_password').val();

    $.ajax({
        type: "post",
        url: zoneServerIp+"/ucotSmart/loginAction!doNotNeedSession_login.action",
//      data: "para="+para,  此处data可以为 a=1&b=2类型的字符串 或 json数据。
        data: {
            'userPage.username':username,
            'userPage.password':password,
            'autoLogin':0
        },
        dataType: "json",
        success: function (data) {
            console.log('登陆结果');
            var success=data.success;
            if(success==false){
                $('.err').css('display','block');
            }else{
                $('.err').css('display','none');
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('token',data.msg);
                window.location.href='index.html';
            }
        },
        error: function(){
            msgTips("登录失败！");
        }
    });
});
//按回车键等同于登陆按钮触发事件
$(document).keyup(function (event) {
    if(event.keyCode==13){
        $('#login_in').trigger("click");
    }
});
//显示提示框，3s后自动关闭
function msgTips(content){
    $(".alert").stop();
    $(".alert").text(content);
    $(".alert").show(100).delay(3000).hide(100);
}
/**
 * Created by GIGA on 2017-12-20.
 */
//IP地址 输入控件
//e为 event o为input对象 i 为 第几个输入框
function ipVali(e,o,i){
    //alert(e.keyCode)
    // 96-105 小键盘数字键 48-57大键盘数字键 8 退格键 46 del键 16 shift键 116 刷新 190 大键盘的点 110小键盘的点 9 tab
    var inputs = o.parentNode.getElementsByTagName("input");
    if(e.keyCode == 9 || (e.keyCode >= 96 && e.keyCode <= 105) ||(e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode==8 || e.keyCode==46|| e.keyCode==116 || e.keyCode == 16){
        if(e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57){
            if(e.keyCode != 56)
                return false;
        }
        if( e.keyCode == 9){
            return true;
        }
        if(e.keyCode == 8){
            if(o.value === ''){
                if(i>0){ //OK
                    inputs[i-1].focus();
                }
                return true;
            }
            return true;
        }
        if(o.value.length >= 3 && getRangeByObj(o) == ''){
            if(null != inputs[i+1]){
                if(o.value.length > 1 && parseInt(o.value.charAt(0)) == 0){
                    o.value = parseInt(o.value,"10");
                }
                inputFormat(o);
                inputs[i+1].focus();
            }
        }
    }else if(190 == e.keyCode || 110 == e.keyCode) //输入的是点
    {
        if(o.value == ''){
            for(var j=0; j<=i; j++){
                if(inputs[j].value == ''){
                    inputs[j].value="";
                }
            }
        }
        inputFormat(o);
        inputs[i+1].focus();
        return false;
    }else{
        return false;
    }
}
function ipVali2(o,i){
    if(o.value != ''){
        if(i == 1) //ip地址的第一个字段
        {
            if(o.value > 223){
                o.value = 223;
            }
        }else{
            if(o.value > 255){
                o.value = 255;
            }
        }
    }else{
        o.value = "";
    }
}
function getRangeByObj(obj){
    var word='';
    if (document.selection){
        o=document.selection.createRange();
        if(o.text.length>0)word=o.text;
    }else{
        p1=obj.selectionStart;
        p2=obj.selectionEnd;
        if (p1||p1=='0'){
            if(p1!=p2)word=obj.value.substring(p1,p2);
        }
    }
    return word;
}
function inputFormat(o){
    if(o.value.length > 1 && parseInt(o.value.charAt(0)) == 0){
        o.value = parseInt(o.value,"10");
    }
}
function show(inClass,showId){
    var str = "";
    var ary = $(inClass);
    for(var i=0;i<ary.length;i++){
        str += ary[i].value + ".";
    }
    $(showId).val(str.slice(0,-1));
}
//手动推送
$("body").on('click',"#tab_manual6_push .page1 tr .push",function(){
   $("#manual_push .content").html($(this).parents("tr").children("td:first-child").text());
});
$("body").on('click',"#tab_manual6_push .page1 tr .restart_push",function(){
    $("#tab_manual6_push .page1").css("display","none");
    $("#tab_manual6_push .page2").css("display","block");
    map.push('backmethod'+(parseInt(map.length)+1)+'\:'+'showPushPageJump');
});
function showPushPageJump(){//返回 显示page1 上一个推送页面
    $("#tab_manual6_push .page1").css("display","block");
    $("#tab_manual6_push .page2").css("display","none");
}
$("body").on('click',"#tab_manual6_push .page2 tr .push",function(){
    $("#manual_push .content").html("重新启动？");
});
//手动推送 推送成功提醒
$("body").on('click',"#manual_push .determine",function(){
   msgTips("推送成功！");
});

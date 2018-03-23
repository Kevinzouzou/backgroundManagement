/**
 * Created by Administrator on 2017/8/22.
 */
$('#username').append(sessionStorage.getItem('username'));
/**
 * 注销
 * */
$('#login_out').click(function () {
    //sessionStorage.removeItem('token');
    //sessionStorage.removeItem('username');
    window.location.href='login.html';
});

$("body").css("height",window.innerHeight);
/*   菜单控制 */
//var CON_grantlevel=0;// 用户登陆时，获取到的权限值，从token 中获取
//var CON_sqgl=80;// 社区管理，grantlevel 大于等于(>=) 变量sqgl 时，该菜单显示。否则隐藏。注意，该值在部署前，可以根据项目更改。
//var CON_xtgl=90;//系统管理  。同上
//var CON_zfgl=80;//住户管理  。同上
//var CON_wygl=80;//物业管理  。同上
//var CON_wyfw=80;//物业服务  。同上
//var CON_fygl=90;// 物业服务中的--费用管理。
//var CON_mjxt=80;//门禁系统  。同上
//var CON_mjxtxq=99;// 门禁系统 --小区Tag
//var CON_znjj=80;//智能家居  。同上
//var CON_afbj=90;//安防报警  。同上
//var CON_zzcb=90;//智能抄表  。同上
//var CON_nhgl=90;//能耗管理 。同上
//var CON_tccgl=90;//停车场管理  。同上
//var CON_sqsc=90;//社区商城  。同上
//var CON_zjxt=90;//专家系统  。同上

var token=sessionStorage.getItem("token");
var conLever;
if(token){
    var i="1"+token.substring(token.length-2);
    var level=parseInt(token.substring(0,token.indexOf("-")));
    conLever=level/i;
}
//判断是否是超级用户，当level/i=100时，为超级用户
//console.log(conLever);
//console.log(token)
var con80=80,con90=90,con99=99;
function showItems(id,num){
    if(conLever!==undefined){
        console.log(conLever+" - "+num)
        if(conLever>=num){
            $(id).show();
            //console.log("show");
        }else{
            $(id).hide();
            //console.log("hide");
        }
    }
}
showItems(".left_aside .community_management","101");//社区管理
showItems(".left_aside .system_management","101");//系统设置
showItems(".left_aside .household_management",con80);//业主管理
showItems(".left_aside .property_management",con80);//物业管理
showItems(".left_aside .property_services",con80);// 物业服务
showItems(".left_aside .property_services .cost_management",con80);//物业服务---费用管理
showItems(".left_aside .access_control_system",con80);// 门禁系统
showItems(".right_aside #tab_access_control_system .community",con80);//门禁系统--社区
showItems(".left_aside .smart_home","101");// 智能家居
showItems(".left_aside .security_alarm",con80);// 安防报警
showItems(".left_aside .automatic_meter_reading",con80);//自动抄表
showItems(".left_aside .energy_consumption_monitoring","101");//能耗监控
showItems(".left_aside .community_mall","101");//社区商城
showItems(".left_aside .expert_system","101");// 专家系统
showItems(".left_aside .ucot_cloud","101");// 物联云
showItems(".right_aside .car_park_management","80");//停车场管理

var map=new Array();
//一级菜单，二级菜单选中增加class
$(".left_aside .nav_tab li").on('click',function(){
    $('#all_paging').css('display','none');
    $(this).addClass("active").siblings().removeClass("active");
});
//一级菜单，有二级菜单下跳转到指定内容项
$(".left_aside>.nav_tab>li").on('click',function(){
    $('#all_paging').css('display','none');
    $(".left_aside .nav_tab li").removeClass("active");
    $(this).addClass("active");
    var index=$(this).index();
    $(".right_aside>.tab-content>div").eq(index).addClass("active").siblings().removeClass("active");
});
$(".tablist_third>ul>li").on('click', function () {
    $('#all_paging').css('display','none');
});

$('.myclick').on('click', 'a', function(){ //就改这一行就可以了
    var dex=parseInt(map.length)+1;
    var functionname=$(this).attr('onclick');
    if(functionname===undefined){
        functionname="";
    }
    var index=functionname.indexOf('Jump');
    console.log(index);
    if(parseInt(index)>0){
        map.push('backmethod'+dex+'\:'+functionname);
    }
});

function back(){
    $('#all_paging').css('display','none');
    var index=map.length-1;//2
    var functionname="";
    if(index!=0){
        functionname =(map[parseInt(index)-1]).split('\:')[1];
    }else{
        functionname = map[0];
    }
    console.log('functionname'+functionname);
    var fn= eval(functionname.split('(')[0]);//queryBuilding('200002d1p1z')
    var params=functionname.split(")")[0].split("(")[1];//参数字符串
    console.log(params);
    if(params==undefined){
        fn.call(this);//没有参数
    }else{
        var param=params.split(',');//参数数组
        console.log(param.length==1);
        if(parseInt(params.indexOf(','))<0){//一个参数
            fn.call(this,changeParam(changeParam(params)));
        }
        if(param.length==2){//有两个参数
            fn.call(this,changeParam(param[0]),changeParam(param[1]));
        }
        if(param.length==3){//有三个参数
            fn.call(this,changeParam(param[0]),changeParam(param[1]),changeParam(param[2]));
        }
        if(index>0){
            map.splice(index);
        }
    }
}

/**
 * 去掉字符串单引号
 */
function changeParam(param){//'D' "D"
    param=param.split('"');
    if(param.length==1){
        param=param[0];
    }else{
        param=param[1];
    }
    param=param.split("'");
    if(param.length==1){
        param=param[0];
    }else{
        param=param[1];
    }
    return param;
}

function unitetdline(dom){
    var dom1=$('#'+dom+' td');
    var dom2=$('#'+dom+' td a');
    if(dom=='zoneInfo-body4'){
        dom1.css("line-height","1.6rem").css("padding","0px").css("border","0px");
    }else{
        dom1.css("line-height","3.2rem").css("padding","0px").css("border","0px");
    }
    dom2.css('cursor','pointer');
}

$('#back').click(function(){
    back();
});

//显示提示框，3s后自动关闭
function msgTips(content,times){
    $(".alert").stop();
    $("#msgContent").text(content);
    if(!times){
        times=3000;
    }
    $(".alert").show(100).delay(times).hide(100);
}

//默认显示：物业服务》1.建议投诉
//$("#tab_suggest_complaints").load("navhtml/property_services/suggest_complaints.html");

//1.社区管理
// 1.小区概要
$("#tab_community_profile").load("navhtml/community_management/community_profile.html");
// 2.房屋设置
$("#tab_house_set").load("navhtml/community_management/house_set.html");

//2.系统管理
//$("body").on('click','.system_management',function(){
// 1.系统设置
$("#tab_system_settings").load("navhtml/system_management/system_settings.html");
//2.数据管理
$("#tab_data_management").load("navhtml/system_management/data_management.html");
//3.接口设置
$("#tab_interFace_settings").load("navhtml/system_management/interface_settings.html");
//});

//3.住户管理
//$(".household_management").on('click',function(){
//住户管理
$("#tab_household_management").load("navhtml/household_management/household_management.html");
//});

//4.物业管理
//$(".property_management").on('click',function(){
// 1. 部门设置
$("#tab_department_set").load("navhtml/property_management/department_set.html");
//2. 人员管理
$("#tab_personnel_management").load("navhtml/property_management/personnel_management.html");
//3. 排班管理
$("#tab_scheduling_management").load("navhtml/property_management/scheduling_management.html");
//4. 巡检管理
$("#tab_inspection_management").load("navhtml/property_management/inspection_management.html");
//5. 访客管理
$("#tab_visitor_management").load("navhtml/property_management/visitor_management.html");
//6. 物料管理
$("#tab_material_management").load("navhtml/property_management/material_management.html");
//7. 供应商管理
$("#tab_supplier_management").load("navhtml/property_management/supplier_management.html");
//});

//5.物业服务
//$(".property_services").on('click',function(){
//社区公告
$("#tab_community_notice").load("navhtml/property_services/community_notice.html");
//1.建议投诉
$("#tab_suggest_complaints").load("navhtml/property_services/suggest_complaints.html");
//2.物业维修
$("#tab_property_maintenance").load("navhtml/property_services/property_maintenance.html");
//3.费用管理
$("#tab_cost_management").load("navhtml/property_services/cost_management.html");
//4.家政服务
$("#tab_domestic_service").load("navhtml/property_services/domestic_service.html");
//5.报事报修统计
$("#tab_repair_statistics").load("navhtml/property_services/repair_statistics.html");
//});

//6.门禁系统
//$(".access_control_system").on('click',function(){
//加载小区
$('#tab_community').load('navhtml/access_control_system/zone.html');
//加载室内机
$('#tab_indoor_machine').load('navhtml/access_control_system/homecontroller.html');
//加载门口机
$('#tab_door_machine').load("navhtml/access_control_system/door_machine.html");
//加载围墙机
$("#tab_fence_machine").load("navhtml/access_control_system/fence_machine.html");
//加载中心机
$("#tab_center_machine").load("navhtml/access_control_system/center_machine.html");
//加载门禁卡
$('#tab_entrance_card').load("navhtml/access_control_system/entrance_card.html");
//信息推送--》手动推送
$("#tab_hand_push").load("navhtml/access_control_system/hand_push.html");
//信息推送--》LCD开关设置
$("#tab_lcd_switch").load("navhtml/access_control_system/lcd_switch.html");
//信息推送--》广告推送--》全部
$("#tab_push_all_machine").load("navhtml/access_control_system/advertising_push_all_machine.html");
//信息推送--》广告推送--》门口机
$("#tab_push_door_machine").load("navhtml/access_control_system/advertising_push_door_machine.html");
//信息推送--》广告推送--》围墙机
$("#tab_push_fence_machine").load("navhtml/access_control_system/advertising_push_fence_machine.html");
//加载数据库中备份
$("#tab_database_backups").load("navhtml/access_control_system/database_backups.html");
//加载远程升级
$("#tab_remote_upgrade").load("navhtml/access_control_system/app_update.html");
//});

//6(2).门禁系统666
// 1.设备配置
$("#tab_device6_configuration").load("navhtml/access6_control_sys/device6_configuration.html");
// 2.信息推送
$("#tab_information6_push").load("navhtml/access6_control_sys/information6_push.html");
// 3.远程升级
$("#tab_remote6_upgrade").load("navhtml/access6_control_sys/remote6_upgrade.html");

//7.智能家居
// 1.设备状态
$("#tab_device_state").load("navhtml/smart_home/device_state.html");
//2.手动注销
$("#tab_manual_logout").load("navhtml/smart_home/manual_logout.html");
//8.安防报警
// 1.报警设置
$("#tab_set_alarm").load("navhtml/security_alarm/set_alarm.html");
// 2.用户报警
$("#tab_user_alarm").load("navhtml/security_alarm/user_alarm.html");
// 3.小区报警
$("#tab_house_alarm").load("navhtml/security_alarm/house_alarm.html");
// 4.机房监控
// $("#tab_machine_monitoring").load("navhtml/security_alarm/machine_monitoring.html");
//9.自动抄表
// 1.抄表设置
$("#tab_set_meterReading").load("navhtml/meter_reading/set_meterReading.html");
// 2.业户抄表
$("#tab_house_meterReading").load("navhtml/meter_reading/house_meterReading.html");
// 3.公区抄表
$("#tab_publicArea_meterReading").load("navhtml/meter_reading/publicArea_meterReading.html");


//12.专家系统
// 1.空置率
$("#tab_vacancy_rate").load("navhtml/expert_system/vacancy_rate.html");
// 2.广告统计
$("#tab_ads_statistics").load("navhtml/expert_system/ads_statistics.html");
// 3.投诉建议
$("#tab_com_suggest").load("navhtml/expert_system/com_suggest.html");
// 4.物业维修
$("#tab_pro_mainten").load("navhtml/expert_system/pro_mainten.html");
// 5.住户报警
$("#tab_household_alarm").load("navhtml/expert_system/household_alarm.html");
// 6.公区报警
$("#tab_pub_alarm").load("navhtml/expert_system/pub_alarm.html");
// 7.住户能耗
$("#tab_household_energy").load("navhtml/expert_system/household_energy.html");
// 8.公区能耗
$("#tab_pub_energy").load("navhtml/expert_system/pub_energy.html");
// 9.设备运维
$("#tab_equip_opera").load("navhtml/expert_system/equip_opera.html");
// 10.人工分析
$("#tab_man_analysis").load("navhtml/expert_system/man_analysis.html");

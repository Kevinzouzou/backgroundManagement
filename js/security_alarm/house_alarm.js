/**
 * Created by along on 2017/1/24. 小区报警
 */
//--加载初始方法--
$("a[href='#tab_house_alarm']").click(function (){

});
function houseAlarmInitialize(parameters){};
$("#addEquipmentBut").click(function(){
    $("#addEquipmentModal .modal-title").text("添加设备");
    $("#equipmentModalBut").text("添加").attr("type","add");
    $("#addequipment").show();
    $("#modifyequipment").hide();
    $("#addEquipmentModal").modal("show");
});
$("#equipmentModalBut").click(function(){
    if($("#equipmentModalBut").attr("type")=="add"){
    // 添加通道
        $("#addEquipmentModal").modal("hide");
        $("#addAisleModal").modal("show");
    }else{
        // 修改设备
    }
});
// 修改
$("#tab_house_alarm").on("click",".modifyBut",function(){
    let this_=$(this);
    let type=this_.attr("type");
    let ids=$(this).attr("ids");
    if(type=="equipment"){
        // 设备管理
        $("#addEquipmentModal .modal-title").text("修改设备");
        $("#equipmentModalBut").text("修改").attr("type","modify");
        $("#addequipment").hide();
        $("#modifyequipment").show();
        let name=this_.attr("name");
        if(name){
            $("#modifyequipment .equipmentName").val(name);
        };
        echoEchoAlarmRank("setAlarmRankForm",this_);
        $("#addEquipmentModal").modal("show");
    }
});
// 删除
$("#tab_house_alarm").on("click",".deleteBut",function(){
    let type=$(this).attr("type");
    let ids=$(this).attr("ids");
    if(type=="equipment"){
        // 设备管理
        let dataObj={"token":permit,"idList":ids};
        let callBack="alarmArea()";
        let ajaxURL="/ucotSmart/";
        deletePubModal(dataObj,callBack,ajaxURL);
    }
});
//-----------------------------------------------------
// 设备列表菜单
$("#tab_video_monitorings .manuPadding strong").click(function(){
    let this_=$(this);
    this_.next("ul").toggle(200,function(){
        let display=this_.next("ul").css("display");
        if(display=="block"){
            this_.find("i").text("-");
        }else if(display=="none"){
            this_.find("i").text("+");
        };
    });
});
// 色彩调节器
$(".progressBox progress").click(function(e){
    let this_=$(this);
    valve(this_,e);
});
$(".progressBox i").mousedown(function(){
    $(this).parents(".valve").on("mousemove",function(e){
        let this_=$(this).find("progress");
        valve(this_,e);
    });
});
$("progress,.progressBox i").mouseup(function(){
    $(this).parents(".valve").off("mousemove");
});
$(".valve").mouseenter(function(){
    $(this).off("mousemove");
});
function valve(this_,e){
    let proSize=this_.width();
    let X1=e.pageX;
    let X2=this_.offset().left;
    let max=255;
    if(this_.parents("li").attr("class")=="icon_image"){
        max=6;
    };
    let sizeX=Math.floor(((X1-X2)/proSize)*max);
    let percentage=Math.floor(sizeX/max*100);
    sizeX<0?sizeX=0:sizeX>max?sizeX=max:"";
    percentage<0?percentage=0:percentage>98?percentage=98:percentage=percentage-1;
    let SliderBut=this_.next("i");
    SliderBut.css("left",percentage+"%").attr("title",sizeX);
    this_.attr("value",sizeX);
    this_.parents("li").find(".icon span").text(sizeX);
};
// 切屏操作
let srctext="http://pgccdn.v.baidu.com/3846147858_3884747892_20170815193729.mp4?authorization=bce-auth-v1%2Fc308a72e7b874edd9115e4614e1d62f6%2F2017-08-15T11%3A37%3A34Z%2F-1%2F%2F4c18bbc19e3cdf8bd325fd970a64f3abf2e663de45037aa6c3fce0317b6f4b13&responseCacheControl=max-age%3D8640000&responseExpires=Thu%2C+23+Nov+2017+19%3A37%3A34+GMT&xcode=aa39e00b6be742f82fb4ffdd3c1f9f851d3bc1e53297489c&time=1520047544&_=1519961161025.wmv";
$("#previewVideoScreen .one").click(function(){
    let html='<video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:100%;height:100%;">您的浏览器不支持 video 标签。</video>';
    $("#previewVideo").html(html);
});
$("#previewVideoScreen .four").click(function(){
    let html='<video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:50%;height:50%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:50%;height:50%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:50%;height:50%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:50%;height:50%;">您的浏览器不支持 video 标签。</video>';
    $("#previewVideo").html(html);
    $("#previewVideo video:nth-child(2n)").css("border-left","1px solid #ccc");
});
$("#previewVideoScreen .nine").click(function(){
    let html='<video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video><video src="'+srctext+'" controls="controls" autoplay="autoplay" style="width:33.333%;height:33.333%;">您的浏览器不支持 video 标签。</video>';
    $("#previewVideo").html(html);
    for(var i=1;i<=3;i++){
        let a=2+(i-1)*3;
        $("#previewVideo video:nth-child("+a+")").css({"border-left":"1px solid #ccc","border-right":"1px solid #ccc",});
    };
});
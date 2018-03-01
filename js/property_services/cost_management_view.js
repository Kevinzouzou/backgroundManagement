/**
 * Created by GIGA on 2017/10/10.
 */
function cost_item_add(){
    $("#cost_item_scope_edit").hide();
    $("#cost_item_sum_money_li").hide();
    cost_item_reset();
    $("#cost_item_scope_handle").hide();
    $("#cost_item_ladder").hide();
}

function change_cost_item_type(val){
    if(val!=1){
        $("#cost_item_charge_cycle").attr("disabled","disabled").css("color","#ccc").siblings().css("color","#ccc");
    }else{
        $("#cost_item_charge_cycle").removeAttr("disabled").css("color","#333").siblings().css("color","#333");
    }
}

function change_cost_item_chargetype(val){
    if(val!=8){
        $("#cost_item_amount").attr("disabled","disabled").siblings().css("color","#ccc");
    }else{
        $("#cost_item_amount").removeAttr("disabled").siblings().css("color","#333");
    }
}

function change_cost_item_formula(val){
    if(val==1){
        $("#cost_item_price_li").show();
        $("#cost_item_sum_money_li").hide();
        $("#cost_item_scope_edit").hide();
    }else if(val==2){
        $("#cost_item_price_li").hide();
        $("#cost_item_sum_money_li").show();
        $("#cost_item_scope_edit").hide();
    }else if(val==3){
        $("#cost_item_price_li").hide();
        $("#cost_item_sum_money_li").hide();
        $("#cost_item_scope_edit").show();
        $("#cost_item_scope_handle").show();
        $("#cost_item_ladder").show();
        $("#cost_item_scope_edit").find("a").css("color","#cccccc");
    }
}

function cost_item_reset(){
    $("#cost_item_add_form")[0].reset();
    $("#cost_item_price_li").show();
    $("#cost_item_scope_edit").hide();
    $("#cost_item_charge_cycle").removeAttr("disabled");
    $("#cost_item_ladder").hide();
    $("#cost_item_scope_handle").hide();
    $(".cost_item_ladder_add_new").empty();
    $("#cost_item_amount").attr("disabled","disabled").css("background-color","#EEEEEE;");
}

var cost_item_ladder_index = 0;
function add_cost_item_scope(){
    var insertHtml = '<li><span>范围</span>' +
        '<input type="text"/>~<input type="text"/>' +
        '<div class="pull-right"><span>单价</span>' +
        '<input type="text"/></div></li>';
    $('#cost_item_ladder').append(insertHtml);
}

function del_cost_item_scope(){
    $('#cost_item_ladder li:last').remove();
}

function finish_cost_item_scope(){
    $("#cost_item_scope_handle").hide();
    $("#cost_item_scope_edit").find("a").css("color","#69c");
    $("#cost_item_ladder").css("color","#ccc");
    $("#cost_item_ladder input").attr("disabled","disabled");
}

function cost_item_edit(){
    $("#cost_item_scope_handle").show();
    $("#cost_item_scope_edit").find("a").css("color","#cccccc");
    $("#cost_item_ladder").css("color","#333");
    $("#cost_item_ladder input").removeAttr("disabled");
}

function charge_setting_check(){

}

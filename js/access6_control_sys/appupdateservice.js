/**
 * Created by GIGA on 2017/9/15.
 */

$('li a[href="#tab_remote_upgrade"]')
		.click(
				function() {
					queryappupdate("", "");
					// 精确查询安装包
					$("#appupdate_search_submit").click(function() {
						var appname = $("#appupdatelist-keyword1").val();
						var appversion = $("#appupdatelist-keyword2").val();
						queryappupdate(appname, appversion);

					})

					// 上传跟新包
					$("#sa")
							.click(
									function() {
										var name = $("#updateAppName").val();
										var version = $("#updateAppversion")
												.val();
										var md5 = $("#updateAppmd5").val();
										var releasetime = $(
												"#updateAppreleasetime").val();
										var targemac = $("#updateApptargemac")
												.val();
										var pushstatus = $(
												"#updateApppushstatus").val();
										var file_upPackage = $(
												"#defined_upPackage").val();
										var comtent = $("#updateAppcomtent")
												.val();
										var upPackage = $("#defined_upPackage")
												.val();

										var formData = new FormData();
										formData
												.append(
														"upFile",
														$("#file_upPackage")[0].files[0]);
										formData.append("app.name", name);
										formData.append("app.md5", md5);
										formData.append("app.releasetime",
												releasetime);
										formData.append("app.version", version);
										formData.append("needPush", pushstatus);
										formData.append("app.description",
												comtent);
										formData.append("app.targemac",
												targemac);
										formData.append("token", permit);

										if (name == null || name == "") {

											msgTips("名称不能为空！");
										} else {
											if (version == ""
													|| version == null) {

												msgTips("版本号不能为空！");
											} else {
												if (md5 == null || md5 == "") {

													msgTips("md5不能为空！");

												} else {

													if (releasetime == null
															|| releasetime == "") {
														msgTips("时间不能为空！");
													} else {

														if (comtent == null
																|| comtent == "") {
															msgTips("摘要不能为空！");

														} else {
															if (upPackage == null
																	|| upPackage == "") {
																msgTips("请选择上传文件！");

															} else {
																$
																		.ajax({
																			type : "post",
																			url : zoneServerIp
																					+ "/ucotSmart/uploadControllerUpdateAppAction!upload.action",
																			data : formData,
																			async : false,
																			cache : false,
																			contentType : false,
																			processData : false,
																			success : function(
																					data) {
																				$(
																						"#APP_add")
																						.modal(
																								'hide');
																				var jsonvalue = $
																						.parseJSON(data);
																				if (jsonvalue.success == true) {
																					msgTips("导入成功!")

																				} else {
																					msgTips("导入失败！您没有权限！")
																				}

																				queryappupdate(
																						"",
																						"");

																			}

																		})
															}

														}
													}

												}

											}

										}

									});
				});

//
function queryappupdate(appname, appversion) {
	sessionStorage.setItem("appname", appname);
	sessionStorage.setItem("appversion", appversion);
	$
			.ajax({
				type : "post",
				url : zoneServerIp
						+ "/ucotSmart/uploadControllerUpdateAppAction!queryNewVersion2.action",
				data : {
					"token" : permit,
					"app.name" : appname,
					"app.version" : appversion,
					"pager.pages" : 1,
					"pager.pagesize" : 10
				},
				dataType : "json",
				success : function(data) {
					var list = eval(data.obj.data);
					var totalNum = data.obj.data_count;
					var pageNum = Math.ceil(totalNum / 10);
					addappupdateTable(list);
					$('#appupdate-paging-tips').empty();
					$('#appupdate-paging-tips').html(
							"当前页面共" + list.length + "条数据，总共ܹ" + totalNum
									+ "条数据");
					if (pageNum == 0 || pageNum == 1) {
						$('#appupdateList-paging').empty();
						return;
					} else {
						showAppPagePlugin(totalNum);
					}
				}
			});
}

/**
 * 加载app推送的分页插件
 */
function showAppPagePlugin(totalNum) {
	var pageNum = Math.ceil(totalNum / 10);// 得到一共几页
	var pageSize = 5;// 默认分页栏显示5页
	if (pageNum > 1 && pageNum < 6) {
		pageSize = pageNum;
	}
	var updateAppPage;
	$('#appupdateList-paging').empty();
	$('#appupdateList-paging').append(
			'<ul id="updateApplist_pagination" class="pagination-sm"></ul>');
	$('#updateApplist_pagination').twbsPagination({
		totalPages : pageNum,
		visiblePages : pageSize,
		version : '1.1',
		onPageClick : function(event, page) {
			updateAppPage = page;
		}
	});
	$("#updateApplist_pagination").on('click', 'a', function() {
		queryappUpdateListByPage(updateAppPage);// 点击就进行分页查询
	});
}

/**
 * 分页查询
 */
function queryappUpdateListByPage(updateAppPage) {
	var appname = sessionStorage.getItem("appname");
	var appversion = sessionStorage.getItem("appversion");

	$
			.ajax({
				type : "post",
				url : zoneServerIp
						+ "/ucotSmart/uploadControllerUpdateAppAction!queryNewVersion2.action",
				data : {
					"token" : permit,
					"app.name" : appname,
					"app.version" : appversion,
					"pager.pages" : updateAppPage,
					"pager.pagesize" : 10
				},
				dataType : "json",
				success : function(data) {
					var list = eval(data.obj.data);
					var totalNum = data.obj.data_count;
					addappupdateTable(list);
					$('#appupdate-paging-tips').empty();

					$('#appupdate-paging-tips').html(
							"当前页面共" + list.length + "条数据，总共ܹ" + totalNum
									+ "条数据");
				}
			});

}

// 删除上传的文件

function deleteUppupdateAppById(id) {
	sessionStorage.setItem("singleadid", id);
	$("#delAd_all_Machine_singles").modal();
}
function deleteUpdateById() {
	if (permit == "" || permit == null) {
		$("#delAd_all_Machine_singles").modal("hide");
		msgTips("请先登录！")

	} else {
		var idList = sessionStorage.getItem("singleadid")
		$
				.ajax({
					type : "post",
					url : zoneServerIp
							+ "/ucotSmart/uploadControllerUpdateAppAction!delApp.action",
					data : {
						"token" : permit,
						"idList" : idList

					},
					dataType : "json",
					success : function(data) {
						$("#delAd_all_Machine_singles").modal('hide');

						if (data.success == true) {
							msgTips("删除成功！")

						} else {
							msgTips("删除失败！权限不足")
						}

						queryappupdate("", "");

					}
				})

	}

}
// 下载上传的跟新包
// ajax 无法实现 此处通过 a标签进行跳转 在加载的同事获得需要的属性
// function deleteUppupdateAppByIds(name,version){
// //a
//		
// var sname=name;
// var sversion=version;
// var fileName=sname+"-"+sversion;
// alert(fileName);
// $
// .ajax({
// type : "post",
// url : "../appUpdateDownload!down.action",
// data : {
// "fileName":fileName
// },
// dataType : "json",
// success : function(data) {
// alert(fileName);
// }
// });
//		
//		
// }
// 上传展示上传描述
function showUpdateAppDetDetail(description) {
	$(".delAdModalTipss").html(description);
	$("#delAd_all_Machine_singlesa").modal();
}
function showUpdateAppDetDetailhide() {
	$("#delAd_all_Machine_singlesa").modal("hide");
	queryappupdate("", "");
}

/**
 * 推送app升级包
 */
function updateApppushToCtr(value) {// 讲对象作为json字符串传递过来
	var jsonvalue = $.parseJSON(value);// 讲json字符串转化为json对象 通过对象获得其属性
	sessionStorage.setItem("name", jsonvalue.name);
	sessionStorage.setItem("version", jsonvalue.version);
	sessionStorage.setItem("md5", jsonvalue.md5);
	sessionStorage.setItem("createtime", jsonvalue.createtime);
	sessionStorage.setItem("releasetime", jsonvalue.releasetime);
	sessionStorage.setItem("decription", jsonvalue.decription);
	$("#delAd_all_Machine_singlessa").modal();

}
function pushToCtr() {
	if (permit == "" || permit == null) {
		$("#delAd_all_Machine_singlessa").modal("hide");
		msgTips("请先登录！")

	} else {
		var targemac = $("#updateAppcomtents").val();
		$
				.ajax({
					type : "post",
					url : zoneServerIp
							+ "/ucotSmart/uploadControllerUpdateAppAction!pushToCtr.action",
					data : {
						"token" : permit,
						"app.name" : sessionStorage.getItem("name"),
						"app.version" : sessionStorage.getItem("version"),
						"app.md5" : sessionStorage.getItem("md5"),
						"app.createtime" : sessionStorage.getItem("createtime"),
						"app.releasetime" : sessionStorage
								.getItem("releasetime"),
						"app.description" : sessionStorage
								.getItem("decription"),
						"app.targemac" : targemac
					},
					dataType : "json",
					success : function(data) {
						$("#delAd_all_Machine_singlessa").modal('hide');
						if (data.success == true) {
							msgTips("推送成功！")

						} else {
							msgTips("推送失败！您的权限不足！")
						}

						queryappupdate("", "");

					}
				})

	}

}

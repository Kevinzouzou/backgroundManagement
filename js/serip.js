//Created by 冯枭 on 2017/8/25.

//登陆云端的IP: WERVER_IP 登陆或注册后得到的小区IP为zoneServerIp
var SERVER_IP =  "http://www.ucot.com.cn:8080";
var zoneServerIp="http://192.168.1.251:8080";
var zonePicFile=zoneServerIp+"/ucotSmart";
var serip="http://192.168.1.251:8080";
var permit=sessionStorage.getItem('token');
//停车场IP
var parkingIp="http://192.168.1.202:8080";
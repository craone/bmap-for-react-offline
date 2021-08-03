import React from "react";
import Script from "react-load-script";
import "../styles.css";
import { heyuanAreaPoints, meizhouAreaPoints } from "./map_city";

export default class BmapExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptStatus: "no"
    };
  }

  handleScriptCreate() {
    console.log("handleScriptCreate");
    this.setState({ scriptLoaded: false });
    window.bmapcfg = {
      'imgext': '.jpg',   //瓦片图的后缀 ------ 根据需要修改，一般是 .png .jpg
      'tiles_dir': '/map/tiles',       //普通瓦片图的地址，为空默认在 offlinemap/tiles/ 目录
      'tiles_hybrid': '',       //卫星瓦片图的地址，为空默认在 offlinemap/tiles_hybrid/ 目录
      'tiles_self': '',        //自定义图层的地址，为空默认在 offlinemap/tiles_self/ 目录
      'home': '/map/'
    };
  }

  handleScriptError() {
    console.log("handleScriptError");
    this.setState({ scriptError: true });
  }

  handleScriptLoad() {
    console.log("DynamicScriptExample bmap_offline_api_v3", window.BMap);

    var outputPath = 'tiles/';    //地图瓦片所在的文件夹
    var fromat = ".jpg";    //格式

    /*var tileLayer = new BMap.TileLayer();
    tileLayer.getTilesUrl = function (tileCoord, zoom) {
      var x = tileCoord.x;
      var y = tileCoord.y;
      var url = outputPath + zoom + '/' + x + '/' + y + fromat;
      return url;
    }
    var tileMapType = new BMap.MapType('tileMapType', tileLayer);*/

    var map = new BMap.Map("container")

    var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
    map.centerAndZoom(point, 6);                 // 初始化地图，设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]
    }));
    map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    //单击获取点击的经纬度
    map.addEventListener("click", function (e) {
      alert(e.point.lng + "," + e.point.lat);
    });


    //下面分别使用折线 和 多边形覆盖物绘制 河源市 和 梅州市行政区域。
    //1、使用折线绘制  河源市 行政区域。使用 Polyline 对象
    //设置河源市标签名 及 位置（经纬度）
    var polylineLabel = new BMap.Label("河源市", { position: new BMap.Point(114.706735, 23.750464), offset: new BMap.Size(-22, -12) });
    polylineLabel.setStyle({ color: "blue", fontSize: "15px", border: "none", background: "none", fontWeight: "bold" });
    //河源市点坐标（字符串形式）
    var heyuanPointArray = new Array();//保存坐标数据
    var heyuanAreaPointsDataArray = heyuanAreaPoints.split(";");
    for (var i = 0; i < heyuanAreaPointsDataArray.length; i++) {
      var pointArray = heyuanAreaPointsDataArray[i].split(",");
      var dataPoint = new BMap.Point(parseFloat(pointArray[0]), parseFloat(pointArray[1]));
      heyuanPointArray.push(dataPoint);
    }
    var polyline = new BMap.Polyline(heyuanPointArray, {
      strokeWeight: 3,
      strokeColor: "red",
      strokeOpacity: 0.8
    });
    polyline.disableMassClear();// 禁止清除操作
    map.addOverlay(polyline); // 绘制曲线
    polylineLabel.disableMassClear();// 禁止清除操作
    map.addOverlay(polylineLabel);// 添加标签
    //添加鼠标触发事件
    this.addMarkerClickHandler("河源市", polyline);

    //2、使用多边形覆盖物绘制  梅州市 行政区域。使用 Polygon 对象
    //设置梅州市标签名 及 位置（经纬度）
    var polygonLabel = new BMap.Label("梅州市", { position: new BMap.Point(116.128554, 24.294562), offset: new BMap.Size(-22, -12) });
    polygonLabel.setStyle({ color: "blue", fontSize: "15px", border: "none", background: "none", fontWeight: "bold" });
    //梅州市点坐标（字符串形式）
    var meizhouPointArray = new Array();//保存坐标数据
    var meizhouAreaPointsDataArray = meizhouAreaPoints.split(";");
    for (var i = 0; i < meizhouAreaPointsDataArray.length; i++) {
      var pointArray = meizhouAreaPointsDataArray[i].split(",");
      var dataPoint = new BMap.Point(parseFloat(pointArray[0]), parseFloat(pointArray[1]));
      meizhouPointArray.push(dataPoint);
    }
    var polygon = new BMap.Polygon(meizhouPointArray, {
      strokeWeight: 0.5,
      strokeColor: "blue",
      fillColor: "blue"
    }); //建立多边形覆盖物
    polygon.setFillOpacity(0.3);
    polygon.disableMassClear();// 禁止清除操作
    map.addOverlay(polygon); // 绘制多边形覆盖物
    polygonLabel.disableMassClear();// 禁止清除操作
    map.addOverlay(polygonLabel);// 添加标签

  }

  //添加鼠标触发事件
  addMarkerClickHandler(content, e) {
    var isEditing = false;
    e.addEventListener("mousedown", function (e) {
      var markerMenua = new BMap.ContextMenu();
      var txtMenuItema = [
        {
          text: "编辑" + content,
          callback: function () {
            var p = e.target;
            if (isEditing == true) {
              alert("您当前处于编辑状态，请拖动小方块改变辖区范围或保存辖区！");
              return;
            } else {
              if (p instanceof BMap.Label) {
                layer.msg(p.content);
              } else if (p instanceof BMap.Circle) {
                var tips = "该覆盖物是圆，圆的半径是：" + p.getRadius() + "，圆的中心点坐标是：" + p.getCenter().lng + "," + p.getCenter().lat;
                alert(p.content);
              } else if (p instanceof BMap.Polygon) {
                getpoligon = p;
                alert("当前编辑的辖区包含的的坐标个数是：" + p.getPath().length);
                p.enableEditing();
                isEditing = true;
              } else {
                getpoligon = p;
                p.enableEditing();
                isEditing = true;
                alert("无法获知该覆盖物类型：" + p.getPath().length);
              }
            }
          }
        },
        {
          text: "保存" + content,
          callback: function () {
            var strpara = "";
            var posiall = [];
            if (isEditing == false) {
              alert("您还未处于编辑状态，请点击编辑辖区！");
              return;
            } else {
              if (confirm('您确定要保存辖区吗？') == true) {
                var strpara = "";
                var posiall = [];
                posiall = e.target.getPath();
                for (var i = 0; i < posiall.length; i++) {
                  if (i > 0) {
                    strpara += ";" + posiall[i].lng + "," + posiall[i].lat;
                  } else {
                    strpara += posiall[i].lng + "," + posiall[i].lat;
                  }
                }
                console.log("------------------------------- 获取当前多边形坐标数据-------------------------------");
                console.log("获取当前多边形坐标数据成功，坐标个数为：" + posiall.length);
                console.log("坐标数据：" + strpara);
                alert("保存成功！测试信息。。。当前覆盖物坐标数： " + posiall.length);

              }
            }
          }
        }];
      markerMenua.addItem(new BMap.MenuItem(txtMenuItema[0].text,
        txtMenuItema[0].callback, 120));
      markerMenua.addItem(new BMap.MenuItem(txtMenuItema[1].text,
        txtMenuItema[1].callback, 120));
      e.target.addContextMenu(markerMenua);
    });
  };

  render() {
    return (
      <>
        <Script
          url="/map/bmap_offline_api_v3.0_min.js"
          onCreate={this.handleScriptCreate.bind(this)}
          onError={this.handleScriptError.bind(this)}
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <div>动态脚本引入状态：{this.state.scriptStatus}</div>
        <div id="container"></div>
      </>
    );
  }
}

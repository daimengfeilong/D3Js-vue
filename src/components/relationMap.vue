<style lang="less">
  #container {
    position: fixed;
    left: 0;
    top: 0;
    width: 90%;
    height: 90%!important;
    margin-left: 5%;
    margin-top: 2%;
    .info {
      border-radius: 5px;
      background: rgba(255,255,255,0.8);
      color: #000;
      padding: 10px;
      max-width: 300px;
      min-width: 200px;
      font-size: 14px;
    }
    .info tr .content {
      text-align: right;
      max-width: 200px;
    }
  }
</style>

<template>
  <div class="amap-page-container">
    <div id="container"></div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import Loca from 'Loca'
  import mapData from '@/data/mapData.json'
  import {openInfoWin, closeInfoWin} from '@/assets/js/popup.js'

  export default {
    data () {
      return {
        mapOptions: {
          mapStyle: 'amap://styles/midnight',
          resizeEnable: true,
          rotateEnable: true,
          pitchEnable: true,
          zoom: 5,
          pitch: 45,
          viewMode: '3D',//开启3D视图,默认为关闭
          buildingAnimation: true,//楼块出现是否带动画
          expandZoomRange: true,
          zooms: [4, 16],
          center: ["116.407394", "39.904211"]
        },
        mapPointData: [],
        mapLineData: [],
        routeData: [],
        lineArr: [],
        lineObj: []
      }
    },
    created () {
      let that = this
      that.mapPointData = mapData.point
      that.mapLineData = mapData.line
      that.initData()
    },
    mounted () {
      let that = this
      that.getMap()
    },
    methods: {
      initData () {
        let that = this
        that.routeData = that.mapLineData.map(function (val) {
          if (Array.isArray(val.path[0]) || Array.isArray(val.path[1])) {
            val.path[0] = val.path[0].join(",")
            val.path[1] = val.path[1].join(",")
          }
          return val
        })
      },
      getMap () {
        let that = this
        let map = new AMap.Map('container', that.mapOptions);
        AMap.plugin(['AMap.ControlBar'], function () {
          map.addControl(new AMap.ControlBar())
        })

        let loca = Loca.create(map)
        let layerLine = Loca.visualLayer({
          container: loca,   //挂载的对象
          type: 'line',
          shape: 'line',
          eventSupport: true,
//          fitView: true   //中心自适应
        })
        layerLine.setData(that.mapLineData, {
          type: 'json',
          lnglat: 'path'
        })
        layerLine.setOptions({
          style: {
            // 3D Line 不支持设置线宽，线宽为 1px
            // borderWidth: 1,
            // 曲率 [-1, 1] 区间
            curveness: 1,
            opacity: 1,
            color: 'red'
          }
        })
        layerLine.render()

        let layerPoint = Loca.visualLayer({
          container: loca,   //挂载的对象
          type: 'point',
          shape: 'circle',
          eventSupport: true,
//          fitView: true   //中心自适应
        })
        layerPoint.setData(that.mapPointData, {
          type: 'json',
          lnglat: 'center'
        })
        layerPoint.setOptions({
          style: {
            radius: 10,
            color: 'red',
            opacity: 0.7
          },
          selectStyle: {
            radius: 13,
            color: 'orange',
            opacity: 0.7
          }
        })
        layerPoint.on('mousemove', function (ev) {
          // 事件类型
          let type = ev.type
          // 当前元素的原始数据
          let rawData = ev.rawData
          // 原始鼠标事件
          let originalEvent = ev.originalEvent;
          console.log(ev)
          that.getLineLength(rawData.center)

          //计算两点间的实际距离,并将信息注入弹窗
          let openInfoObj = {
            '名称': rawData.name,
            '位置': rawData.center
          }
          that.lineArr.forEach(function (item) {
            let { targetName, targetPath } = item
            let dis = (AMap.GeometryUtil.distance(rawData.center.split(','), targetPath) / 1000).toFixed(2);
            openInfoObj['距离' + targetName] = `${dis}公里`
          })

          openInfoWin(map, originalEvent, openInfoObj);

        })
        layerPoint.on('mouseleave', function (ev) {
          closeInfoWin()
        })
        layerPoint.on('click', function (ev) {
          // 当前元素的原始数据
          let rawData = ev.rawData, starting = []
          // 原始鼠标事件
          let originalEvent = ev.originalEvent

          layerLine.setOptions({
            style: {
              color: function (res) {
                let targetAddress = res.value.path.join(',')
                if (targetAddress.indexOf(rawData.center) > -1) {
                  starting.push(res.value.path)
                  return 'orange'
                } else {
                  return 'red'
                }
              }
            }
          })
          layerPoint.setOptions({
            style: {
              radius: function (res) {
                let startingStr = starting.join(','), center = res.value.center
                return startingStr.indexOf(center) > -1 ? 13 : 10
              },
              color: function (res) {
                let startingStr = starting.join(','), center = res.value.center
                return startingStr.indexOf(center) > -1 ? 'orange' : 'red'
              }
            }
          })

          layerLine.render()
          layerPoint.render()
        })
        layerPoint.render()
      },
      getLineLength (path) {
        let that = this, arr = [], dataLength = that.routeData.length

        for (let i = 0; i < dataLength; i++) {
          let item = that.routeData[i], arrObj = {}
          if (item.path.indexOf(path) > -1) {
            if (path == item.source.path.join(',')) {
              arrObj.targetName = item.target.pathName
              arrObj.targetPath = item.target.path
            } else if (path == item.target.path.join(',')) {
              arrObj.targetName = item.source.pathName
              arrObj.targetPath = item.source.path
            }
            arr.push(arrObj)
          }
        }
        that.lineArr = arr
      }
    }
  };
</script>

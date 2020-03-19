<style lang="less">
  .main {
    text-align: center;
    canvas{
      border: 1px solid orange;
    }
  }
</style>
<template>
  <section class="main">
    <canvas id="canvas" :width="width" :height="height"></canvas>
  </section>
</template>
<script>
  export default {
    data () {
      return {
        marge: {top: 60, bottom: 60, left: 60, right: 60},
        width: 960,
        height: 600,
        oneData: [
          {'name': '办公用品', 'value': 100},
          {'name': '家具', 'value': 20},
          {'name': '技术', 'value': 60}
        ]
      }
    },
    mounted () {
      let that = this
      that.init()
    },
    methods: {
      init () {
        let that = this
        let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d')
        let x0 = d3.scaleBand().domain(that.oneData.map(function (d) {
          return d.name
        })).rangeRound([0, that.width-that.marge.left-that.marge.right]).padding(0.5)
        let y0 = d3.scaleLinear().domain([0, d3.max(that.oneData, function (d) {
          return d.value
        })]).range([that.height-that.marge.top-that.marge.bottom, 0])
        ctx.translate(that.marge.left, that.marge.top)
        ctx.beginPath()

//        that.width = that.width-that.marge.left-that.marge.right
//        that.height = that.height-that.marge.top-that.marge.bottom
        x0.domain().forEach(function (d) {
          ctx.moveTo(x0(d) + x0.bandwidth()/2, that.height)
          ctx.lineTo(x0(d) + x0.bandwidth()/2, that.height + 6)
        })
        ctx.strokeStyle = 'black'
        ctx.stroke()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        x0.domain().forEach(function (d) {
          ctx.fillText(d, x0(d) + x0.bandwidth()/2, that.height + 6)
        })
        ctx.beginPath()
        ctx.moveTo(0.5, that.height + 0.5)
        ctx.lineTo(that.width + 0.5, that.height + 0.5)
        ctx.strokeStyle = 'black'
        ctx.stroke()

        let yTickCount = 10, yTicks = y0.ticks(yTickCount)
        ctx.beginPath()
        yTicks.forEach(function (d) {
          ctx.moveTo(0, y0(d) + 0.5)
          ctx.lineTo(-6, y0(d) + 0 / 2)
        })
        ctx.strokeStyle = 'black'
        ctx.stroke()
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        yTicks.forEach(function (d) {
          ctx.fillText(d, -9, y0(d))
        })
        ctx.beginPath()
        ctx.moveTo(-6.5, 0 + 0.5);
        ctx.lineTo(0.5, 0 + 0.5);
        ctx.lineTo(0.5, that.height + 0.5);
        ctx.lineTo(-6.5, that.height + 0.5);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "steelblue";
        that.oneData.forEach(function (d) {
          ctx.fillRect(x0(d.name), y0(d.value), x0.bandwidth(), that.height - y0(d.value));
        });
      }
    }
  }
</script>

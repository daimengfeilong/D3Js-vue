<style lang="less">

</style>
<template>
  <div>
    <svg :width="width" :height="height"></svg>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        width: 960,
        height: 600,
        dataSet: [10, 20, 30, 23, 13, 40, 27, 35, 20]
      }
    },
    mounted () {
      let that = this
      that.init()
    },
    methods: {
      init () {
        let that = this
        let marge = {top: 60, bottom: 60, left: 60, right: 60};  //设置边距
        let color = "orange";   //设置矩形的颜色
        let svg = d3.select('svg');
        let g = svg.append('g').attr('transform', `translate(${marge.top}, ${marge.left})`);
        let xScale = d3.scaleBand().domain(d3.range(that.dataSet.length)).rangeRound([0, that.width - marge.left - marge.right]);
        let xAxis = d3.axisBottom(xScale);
        let yScale = d3.scaleLinear().domain([0, d3.max(that.dataSet)]).range([that.height - marge.top - marge.bottom, 0]);
        let yAxis = d3.axisLeft(yScale);

        g.append('g').attr('transform', `translate(${0}, ${that.height - marge.top - marge.bottom})`).call(xAxis);
        g.append('g').attr('transform', `translate(${0}, ${0})`).call(yAxis);

        let gs = g.selectAll('rect').data(that.dataSet).enter().append('g');
        let rectPadding = 20;
        //绘制矩形
        gs.append('rect').attr('x', function (d, i) {
          return xScale(i) + rectPadding / 2;
        }).attr('y', function (d) {
          let min = yScale.domain()[0];
          return yScale(min);
        }).attr('width', function () {
          return xScale.step() - rectPadding;
        }).attr('height', function (d) {
          return 0;
        }).attr('fill', color)
          .on('mouseover', function () {
            d3.select(this).transition().duration(400).attr('fill', '#ed9600');
          }).on('mouseout', function () {
            d3.select(this).transition().duration(400).attr('fill', color);
        }).on('click', function () {
            console.log(d3.select(this).attr('height'))
          })
          .transition()   //添加过渡
          .duration(500)   //持续时间
          //            .delay(function (d, i) {   //延迟
          //              return i*400;
          //            })
          .ease(d3.easeLinear)
          .attr('y', function (d) {   //y回到最终状态
            return yScale(d);
          })
          .attr('height', function (d) {   //height回到最终状态
            return that.height - marge.top - marge.bottom - yScale(d);
          });
        //绘制文字
        gs.append('text').attr('x', function (d, i) {
          return xScale(i);
        }).attr('y', function (d) {
          let min = yScale.domain()[0];
          return yScale(min);
        }).attr('dx', function () {
          return (xScale.step() - rectPadding) / 2;
        }).attr('dy', 20).text(function (d) {
          return d;
        }).transition().duration(500)
          //    .delay(function (d, i) {
          //      return i*400;
          //    })
          .ease(d3.easeLinear).attr('y', function (d) {
          return yScale(d);
        });
      }
    }
  }
</script>

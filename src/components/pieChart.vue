<style lang="less">
  svg{
    border: 1px solid orange;
  }
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
        dataSet: [30, 10, 43, 55, 13],
        colorSet: [
          "#5ab1ef", "#b6a2de", "#2ec7c9", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa",
          "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"
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
        let marge = {top: 60, bottom: 60, left: 60, right: 60};
        let svg = d3.select('svg');
        let g = svg.append('g').attr('transform', `translate(${0}, ${0})`);
        let colorScale = d3.scaleOrdinal().domain(d3.range(that.dataSet.length)).range(that.colorSet);  //设置颜色比例尺
        let pie = d3.pie();   //新建一个饼状图
        let arc_generator = d3.arc().innerRadius(0).outerRadius(100);   //新建一个弧形生成器
        let pieData = pie(that.dataSet);   //得到绘制饼状图的数据
        console.log(pieData);
        //为每一个扇形及其对应的文字建立一个分组<g>
        let gs = g.selectAll('.g').data(pieData).enter().append('g').attr('transform', `translate(${that.width/2}, ${that.height/2})`);
        //绘制扇形
        gs.append('path').attr('d', function (d) {
          return arc_generator(d);   //为弧形生成器注入数据
        }).attr('fill', function (d, i) {
          return colorScale(i);   //为扇形添加颜色
        })
        //绘制扇形上的文字
        gs.append('text').attr('transform', function (d) {
          return `translate(${arc_generator.centroid(d)})`;   //位置设在中心处
        }).attr('text-anchor', 'middle').text(function (d) {
          console.log(d)
          return d.data;
        })
      }
    }
  }
</script>

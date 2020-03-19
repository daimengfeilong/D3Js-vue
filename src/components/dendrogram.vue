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
        dataSet: {
          name: "中国",
          children: [
          {
            name: "浙江",
            children: [
              {name: "杭州", value: 100},
              {name: "宁波", value: 100},
              {name: "温州", value: 100},
              {name: "绍兴", value: 100}
            ]
          },
          {
            name: "广西",
            children: [
              {
                name: "桂林",
                children: [
                  {name: "秀峰区", value: 100},
                  {name: "叠彩区", value: 100},
                  {name: "象山区", value: 100},
                  {name: "七星区", value: 100}
                ]
              },
              {name: "南宁", value: 100},
              {name: "柳州", value: 100},
              {name: "防城港", value: 100}
            ]
          },
          {
            name: "黑龙江",
            children: [
              {name: "哈尔滨", value: 100},
              {name: "齐齐哈尔", value: 100},
              {name: "牡丹江", value: 100},
              {name: "大庆", value: 100}
            ]
          },
          {
            name: "新疆",
            children: [
              {name: "乌鲁木齐"},
              {name: "克拉玛依"},
              {name: "吐鲁番"},
              {name: "哈密"}
            ]
          }
        ]
        }
      }
    },
    mounted () {
      let that = this
      that.init()
    },
    methods: {
      init () {
        let that = this
        let marge = {top: 50, bottom: 0, left: 10, right: 0}
        let svg = d3.select('svg')
        let g = svg.append('g').attr('transform', `translate(${marge.top}, ${marge.left})`)
        let scale = svg.append('g').attr('transform', `translate(${marge.top}, ${marge.left})`)
        //创建一个层级布局
        let hierarchyData = d3.hierarchy(that.dataSet).sum(function (d) {
          return d.value
        })
        //创建一个树状图
        let tree = d3.tree().size([that.width - 400, that.height - 200]).separation(function (a, b) {
          return (a.parent == b.parent ? 4 : 2);
        });
        //初始化树状图
        let treeData = tree(hierarchyData);
        //得到边和节点
        let nodes = treeData.descendants(), links = treeData.links();
        console.log('nodes:', nodes);
        console.log('links:', links);
        //创建一个贝赛尔生成曲线生成器
        let Bézier_curve_generator = d3.linkHorizontal()
          .x(function (d) {
            return d.y;
          })
          .y(function (d) {
            return d.x;
          });
        //绘制边
        g.append('g').selectAll('path').data(links).enter().append('path')
          .attr('d', function (d) {
            let start = {x: d.source.x, y: d.source.y};
            let end = {x: d.target.x, y: d.target.y};
            return Bézier_curve_generator({source: start, target: end});
          })
          .attr('fill', 'none')
          .attr('stroke', 'orange')
          .attr('stroke-width', '1');
        //为每个节点和对应文字创建分组<g>
        let gs = g.append('g').selectAll('g').data(nodes).enter().append('g')
          .attr('transform', function (d) {
            console.log(d)
            let cx = d.x, cy = d.y;
            return `translate(${cy}, ${cx})`;
          });
        //绘制节点
        gs.append('circle').attr('r', 6).attr('fill', 'white').attr('stroke', 'blue').attr('stroke-width', '1');
        //绘制文字
        gs.append('text').attr('x', function (d) {
//        return d.children ? -6 : 10;
          return 10;
        }).attr('y', function (d) {
//        return d.children ? 15 : -5;
          return -5;
        }).attr('dy', 10).text(function (d) {
          return d.data.name;
        })
      }
    }
  }
</script>

<style lang="less">
  .main {
    text-align: center;
    svg{
      border: 1px solid orange;
    }
  }
</style>
<template>
  <section class="main">
    <svg :width="width" :height="height"></svg>
  </section>
</template>

<script>
  let forceSimulation = '', links = '', linksText = '', gs = ''
  export default {
    data() {
      return {
        width: window.innerWidth - 50,
        height: window.innerHeight - 10,
        marge: {top: 60, bottom: 60, left: 60, right: 60},
        nodes: [//节点集
          {name: "中国", level: 1, isShow: true},
          {name: "北京市", level: 2, parent: 0, isShow: true},
          {name: "上海市", level: 2, parent: 0, isShow: true},
          {name: "四川省", level: 2, parent: 0, isShow: true},
          {name: "陕西省", level: 2, parent: 0, isShow: true},
          {name: "广东省", level: 2, parent: 0, isShow: true},
          {name: "浙江省", level: 2, parent: 0, isShow: true},
          {name: "朝阳区", level: 3, parent: 1, isShow: true},
          {name: "海淀区", level: 3, parent: 1, isShow: true},
          {name: "黄浦区", level: 3, parent: 2, isShow: true},
          {name: "浦东区", level: 3, parent: 2, isShow: true},
          {name: "成都市", level: 3, parent: 3, isShow: true},
          {name: "绵阳市", level: 3, parent: 3, isShow: true},
          {name: "西安市", level: 3, parent: 4, isShow: true},
          {name: "延安市", level: 3, parent: 4, isShow: true},
          {name: "广州市", level: 3, parent: 5, isShow: true},
          {name: "深圳市", level: 3, parent: 5, isShow: true},
          {name: "杭州市", level: 3, parent: 6, isShow: true},
          {name: "温州市", level: 3, parent: 6, isShow: true}
        ],
        edges: [//边集
          {source: 0, target: 1, relation: "直辖市", value: 1.3},
          {source: 0, target: 2, relation: "直辖市", value: 1},
          {source: 0, target: 3, relation: "地方省", value: 1},
          {source: 0, target: 4, relation: "地方省", value: 2},
          {source: 0, target: 5, relation: "地方省", value: 2},
          {source: 0, target: 6, relation: "地方省", value: 2},
          {source: 1, target: 7, relation: "市辖区", value: 0.9},
          {source: 1, target: 8, relation: "市辖区", value: 1},
          {source: 2, target: 9, relation: "市辖区", value: 1.6},
          {source: 2, target: 10, relation: "市辖区", value: 0.7},
          {source: 3, target: 11, relation: "省会", value: 0.7},
          {source: 3, target: 12, relation: "地级市", value: 0.7},
          {source: 4, target: 13, relation: "省会", value: 0.7},
          {source: 4, target: 14, relation: "地级市", value: 0.7},
          {source: 5, target: 15, relation: "省会", value: 0.7},
          {source: 5, target: 16, relation: "地级市", value: 0.7},
          {source: 6, target: 17, relation: "省会", value: 0.7},
          {source: 6, target: 18, relation: "地级市", value: 0.7}
        ],
        pieData: [40, 35, 25],
        colorSet: [
          "#5ab1ef", "#b6a2de", "#2ec7c9", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa",
          "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"
        ]
      }
    },
    created () {
      let that = this
    },
    mounted () {
      let that = this
      that.init()
    },
    methods: {
      init () {
        let that = this, svg = d3.select('svg')
        let width = svg.attr('width'), height = svg.attr('height')
        let g = svg.append('g')
        //创建一个颜色比例尺
        let colorScale = d3.scaleOrdinal().domain(d3.range(that.nodes.length)).range(that.colorSet)
        //创建一个力导向图
        forceSimulation = d3.forceSimulation()
          .force('link', d3.forceLink())
          .force('charge', d3.forceManyBody().strength(-500))   //节点间的作用力
          .force('center', d3.forceCenter())   //设置力导向布局的中心点
        //设置缩放
        var zoomObj = d3.zoom().scaleExtent([0.8, 2]).on('zoom', function () {
          var transform = d3.event.transform;       //获取缩放和偏移的数据
          g.attr('transform', transform);   // 设置缩放和偏移量 transform对象自带toString()方法
        }).on('end', function () {});
        svg.call(zoomObj);

        //生成节点数据
        forceSimulation.nodes(that.nodes).on('tick', that.ticked)
        //生成边集数据
        forceSimulation.force('link').links(that.edges).distance(150)
        console.log('nodes:', that.nodes)
        console.log('edges:', that.edges)
        //设置图形中心位置，当前为画布的中心点
        forceSimulation.force('center').x(width/2).y(height/2);

//        that.edges = that.edges.filter(function (val) {
//          return val.target.isShow
//        })
        //绘制箭头
        let marker = g.append('g').selectAll('marker').data(that.edges).enter().append('marker')
          .attr('id', function (d, i) {   //为每个marker添加id名
            return 'resolved-' + i
          })
          .attr('markerUnits', 'userSpaceOnUse')  //若设置为strokeWidth箭头会随着线的粗细发生变化，否则不会
          .attr('viewBox', '0 -5 10 10')  //坐标系的区域
          .attr('refX', function (d) {    //箭头坐标
            return d.target.level < 3 ? 46 : 34
          })
          .attr('refY', 0)
          .attr('markerWidth', 12)  //箭头大小
          .attr('markerHeight', 12)
          .attr('orient', 'auto')  //绘制方向：可将值设置为auto（自动确认方向）或角度值
          .attr('stroke-width', 2)  //箭头宽度
          .append('path')
          .attr('d', 'M0, -5L10, 0L0, 5')   //箭头路径
          .attr('fill', function (d, i) {
            return d.source.index == 0 ? colorScale(i+1) : colorScale(d.source.index)
          })
        //绘制边
        links = g.append('g').selectAll('path').data(that.edges).enter().append('path')
          .attr('id', function (d, i) {
            return 'lineText-' + i
          })
          .attr('class', function (d) {
            return `circle-${d.source.index} circle-sub`;
          })
          .attr('stroke', function (d, i) {
            return d.source.index == 0 ? colorScale(i+1) : colorScale(d.source.index)
          }).attr('stroke-width', 1)
          .attr('marker-end', function (d, i) {
            return `url(#resolved-${i})`
          });
        //绘制边上的文字
        linksText = g.append('g').selectAll('text').data(that.edges).enter().append('text')
          .attr('class', function (d) {
            return `circle-${d.source.index} circle-sub`
          })

        linksText.append('textPath')
          .attr('href', function (d, i) {
            return '#lineText-' + i
          })
          .text(function (d) {
            return d.relation;
          })
        //为每个节点和对应文字创建一个分组<g>
//        that.nodes = that.nodes.filter(function (val) {
//          return val.isShow
//        })
        gs = g.selectAll('.circleText').data(that.nodes).enter().append('g')
          .attr('class', function (d, i) {
            return i > 0 ? `circle-${d.parent} circle-sub` : 'circle-main';
          })
          .attr('transform', function (d, i) {
            let cirX = d.x, cirY = d.y;
            return `translate(${cirX}, ${cirY})`;
          })
          .style('cursor', 'pointer')
          .call(d3.drag()
            .on('start', that.started)
            .on('drag', that.dragged)
            .on('end', that.ended)
          )
          .on('mouseover', function (d) {
            if (d.level < 3) {
              d3.select(this).select('.gBorder').transition().duration(200).attr('transform', 'scale(1.02)')
            }
          })
          .on('mouseout', function (d) {
            if (d.level < 3) {
              d3.select(this).select('.gBorder').transition().duration(200).attr('transform', 'scale(1.1)')
            }
          }).on('click', function (d, i) {
            if (d.level === 1) {
              if (d3.selectAll('.circle-sub').attr('aria-hidden') == 'true') {
                d3.selectAll('.circle-sub').transition().duration(300)
                  .attr('aria-hidden', '')
                  .style('opacity', '1');
              } else {
                d3.selectAll('.circle-sub').transition().duration(300)
                  .attr('aria-hidden', 'true')
                  .style('opacity', '0');
              }
//              that.nodes.map(function (val) {
//                return val.parent >== d.index ? val.isShow = false : val.isShow = true
//              })
//              svg.html('')
//              that.init()
            }
            if (d.level === 2) {
              if (d3.selectAll('.circle-' + d.index).attr('aria-hidden') == 'true') {
                d3.selectAll('.circle-' + d.index).transition().duration(300)
                  .attr('aria-hidden', '')
                  .style('opacity', '1');
              } else {
                d3.selectAll('.circle-' + d.index).transition().duration(300)
                  .attr('aria-hidden', 'true')
                  .style('opacity', '0');
              }
//              that.nodes.map(function (val) {
//                return val.parent === d.index ? val.isShow = false : val.isShow = true
//              })
//              svg.html('')
//              that.init()
            }
          })

        //绘制节点和对应文字
        let gBorder = gs.append('g').attr('class', 'gBorder')
          .attr('fill', '#ffffff')
          .attr('transform', function (d, i) {
            return d.level < 3 ? 'scale(1.1)' : ''
          })
          .attr('stroke', function (d, i) {
            if (d.level === 1 ) {
              return colorScale(0)
            } else if (d.level === 2) {
              return colorScale(i)
            }
          })
          .attr('stroke-width', '2')
        let gCircle = gs.append('g')
          .attr('fill', function (d, i) {
            if (d.level === 1) {
              return colorScale(0)
            } else if (d.level ===2) {
              return colorScale(i)
            } else {
              return colorScale(d.parent)
            }
          })
        let gText = gs.append('g').attr('fill', 'white')
        gBorder.append('circle').attr('r', function (d) {
          if (d.level === 1) {
            return 50
          } else if (d.level === 2) {
            return 40
          } else {
            return 30
          }
        })
        gCircle.append('circle').attr('r', function (d) {
          if (d.level === 1) {
            return 49
          } else if (d.level === 2) {
            return 39
          } else {
            return 29
          }
        })
        gText.append('text')
          .attr('x', 0)
          .attr('y', -25)
          .attr('dy', 30)
          .attr("text-anchor", "middle")
          .style('font-size', '12')
          .text(function (d) {
            return d.name
          })

        that.initPie()  //绘制饼图
      },
      ticked () {
//        links.attr("x1",function (d) {
//          return d.source.x;
//        }).attr("y1",function (d) {
//          return d.source.y;
//        }).attr("x2",function (d) {
//          return d.target.x;
//        }).attr("y2",function (d) {
//          return d.target.y;
//        });
        links.attr('d', function (d, i) {
          return `M${d.source.x}, ${d.source.y} L${d.target.x}, ${d.target.y}`
        })
        linksText.attr("x",function (d) {
          return d.target.level > 2 ? 60 : 80;
        }).attr("y",function (d) {
//          return (d.source.y+d.target.y)/2;
          return 0;
        });

        gs.attr("transform",function (d) {
          return `translate(${d.x}, ${d.y})`;
        });
      },
      started (d) {
        if(!d3.event.active){
          forceSimulation.alphaTarget(0.8).restart();   //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
        }
        d.fx = d.x;
        d.fy = d.y;
      },
      dragged (d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      },
      ended (d) {
        if(!d3.event.active){
          forceSimulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      },
      initPie () {
        let that = this, circleMain = d3.select('.circle-main')
        let g = circleMain.append('g')
        //创建一个颜色比例尺
        let colorScale = d3.scaleOrdinal().domain(d3.range(that.pieData.length)).range(that.colorSet)
        let pie = d3.pie()  //新建一个饼图
        let arc_generator = d3.arc().innerRadius(0).outerRadius(50);   //新建一个弧形生成器(innerRadius是内半径，outerRadius是外半径)
        let pieData = pie(that.pieData);   //得到绘制饼状图的数据
        //为每一个扇形及其对应的文字建立一个分组<g>
        var gs = g.selectAll('.g').data(pieData).enter().append('g');
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
          return d.data;
        })
      }
    }
  };
</script>

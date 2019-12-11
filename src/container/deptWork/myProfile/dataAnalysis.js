/**
 * @file 我的档案 - 效益分析--弹出框数据
 * @author gaofengjiao
 * @since 2018-05-22 14:00:00
 * @version 1.0.0
 */
import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip,Guide,Coord,Legend,Label } from 'bizcharts';
import { DataSet } from '@antv/data-set';
const Text = Guide.Text;

const { DataView } = DataSet;
const getWeek = function(){
  var oneDay = 24 * 3600 * 1000; 
  var date = []; 
  var now = new Date(); 
  function addData() { 
    now = [ now.getMonth() + 1, now.getDate()].join('-'); 
    date.unshift(now); 
    now = new Date(+new Date(now) - oneDay); 
  } 
  for (var i = 1; i < 8; i++) { 
    addData(); 
  } 
  return date; 
}
class DataAnalysis extends Component {
  constructor(props) {
    super(props);
    let DateArr = getWeek();
    let arr =[];
    if(this.props.item.description==="总收入" || this.props.item.description==="总支出"){
      arr = this.props.item.item
    }else{
      if(this.props.item.item){
        arr = this.props.item.item.map((item,index)=>{
          return {year:DateArr[index],value:item}
        })
      }else{
        arr = DateArr.map((item,index)=>{
          return {year:item,value:0}
        })
      }
    }
    this.state = {
      data: arr || [],// 数据源
      cols : {
        value: {
          min: 0 ,
          alias: '值' // 为属性定义别名
        },
      } ,//定义度量,
      type: this.props.item.type
    }

   
  }

  render() {
    const { data,cols,type } = this.state ;
    // const data2 = type==="zsrData" ? data:
    // [
    //   { item: '人工成本', count: Math.random()} ,
    //   { item: '维修费用', count: Math.random()} ,
    //   { item: '材料费', count: Math.random()} ,
    //   { item: '其他', count: Math.random()} 
    // ];
    const data2 = data;
    const dv = new DataView();
    dv.source(data2).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const cols2 = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        }
      }
    } 
    
    return (
      <div>
        {
        type === "zsrData" || type === "zzcData" ?
          <Chart height={400} data={dv} scale={cols2}  forceFit>
            <Coord type='theta' radius={0.75} />
            <Axis name="percent" />
            <Legend position='bottom'  />
            <Tooltip 
              showTitle={false} 
              itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
              />
            <Geom
              type="intervalStack"
              position="percent"
              color='item'
              tooltip={['item*percent',(item, percent) => {
                percent =  (percent * 100).toFixed(2) + '%';
                return {
                  name: item,
                  value: percent
                };
              }]}
              style={{lineWidth: 1,stroke: '#fff'}}
              >
              <Label content='percent' formatter={(val, item) => {
                  return item.point.item + ': ' + val;}} />
            </Geom>
          </Chart>
          :
          <Chart forceFit={true} height={400} data={data} scale={cols}  style={{marginTop: 30}}>
            <Axis name="year" />
            <Axis name="value" />
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type="line" position="year*value" size={2} />
            <Geom type='point' position="year*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
            <Guide><Text content={'开机时长趋势'} top={true}/></Guide>
          </Chart>
        }
       

       

      </div>
    )
  }
}


export default DataAnalysis;
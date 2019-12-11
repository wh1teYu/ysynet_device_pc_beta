/*
 * @Author: yuwei - 科室统计  deptCount
 * @Date: 2018-08-08 14:16:06 
* @Last Modified time: 2018-08-08 14:16:06 
 */
import React , { PureComponent } from 'react';
import { Layout , Col , Row , DatePicker , Select , Form , Icon , Button , Tabs} from 'antd';
import {Chart, Axis, Tooltip, Geom , Guide , Legend } from "bizcharts";
import { getRangeTime } from '../../../utils/tools';
import TableGrid from '../../../component/tableGrid';
import operation from '../../../api/operation';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
import { DataSet } from '@antv/data-set';
import '../style.css';
const Text = Guide.Text;
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const buttonStyle = {
  display: 'block',
};
const columns = [
  {
    title: '科室',
    dataIndex: 'useDeptName',
    width:120
  },
  {
    title: '维修次数',
    dataIndex: 'rrpairNumber',
    width:100,
  },
  {
    title: '维修总费用',
    dataIndex: 'actualPrice',
    width:100,
    render:(text)=>text?Number(text).toFixed(2):''
  },
  {
    title:'材料费',
    dataIndex: 'fittingPrice',
    width:100,
    render:(text)=>text?Number(text).toFixed(2):''
  }
];

/**
 * @param  rrpairNumberList 维修台数 ：[x inRrpairUserName 用户名 , y  rrpairNumber 维修台数]
 * @param  rrpairDateNumList 维修天数图 ：[x rrpairDateNum 用户名 , y  rrpairDateNum 维修台数]
 * @param  avgDayList 平均天数 ：[x inRrpairUserName 用户名 , y  avgDay 平均天数]

*/
const chartField ={
  rrpairNumberList:['useDeptName','rrpairNumber'],
  actualPriceList:['useDeptName','rrpairDateNum']
}
const initTime = getRangeTime('month',1,'before') ;
 class DeptCount extends PureComponent{
 
  state={
    disable:true,//使用科室的禁用条件 。图true- 禁用  表false-可用
    query:{},//初始化的搜索条件
    allData:{},//当前图表所有数据
    chartData:[
    ],//图表-数据
    chartTitle:'维修次数',//默认图表的Y轴显示文字
    activedButton:'1',//有边框色样式的button
    chartFieldText:'rrpairNumberList',//当前字段
  }  
  //表单搜索 - 获取数据 并更新图表以及table
  onSearch = (val)=>{ 
    //获取图表数据
    request(operation.selectUseDeptCountChart,{
      body:queryString.stringify(val),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          if(data.result.rrpairNumberList.length && data.result.actualPriceList.length){
            let allData = data.result;
            const { chartFieldText } = this.state;
            this.setState({allData,query:val,})
            if(chartFieldText==='rrpairNumberList'){
              //rrpairNumberList 渲染的图表
              this.setState({chartData:allData[this.state.chartFieldText]})
            }else{
              //actualPriceList 的时候渲染的图表
              this.setState({chartData:this.formatData( allData[this.state.chartFieldText] , 'actualPriceList')  })
            }
          }else{
            this.setState({allData:data.result,chartData:[]})
          }
        }
      },
      error: err => {console.log(err)}
    })
    //获取table数据
    if(this.refs.table){
      this.refs.table.fetch(val)
    }
  }
  //tab切换 - 更改使用科室的禁用条件
  tabChange = (key) => {
    let ret = key==='1'? true:false;
    this.setState({disable:ret})
    if(key==="1"){
      this.SearchForm.props.form.setFieldsValue({useDeptId:''})
    }
    this.onSearch(this.formatSubmit());
    
  }
  formatSubmit = () => {
    let values = this.SearchForm.props.form.getFieldsValue() ; 
    
    if(values.createDate.length) {
      values.createStartDate = moment(values.createDate[0]).format('YYYY-MM-DD');
      values.createEndDate = moment(values.createDate[1]).format('YYYY-MM-DD');
      delete values['createDate']
    }else{
      delete values['createDate']
    }
    for (const key in values) {
      values[key] = values[key] === undefined? "" : values[key];
    }
    this.setState({query:values})
    return values
  }

  /**
   * @param data 后端传递的对应-维修金额的data数组
   * @param dataField 当前维修金额对应的X，Y轴
   */
  formatData = (data,dataField) => {
    if(data.length){
    let actualPriceObj = {name:'维修费'};
    let fittingPriceObj = {name:'材料费'};
    let deptNameArr = []; // X轴的科室名称
    data.map(item=>{
      actualPriceObj[`${item.useDeptName}`]=item.actualPrice;
      fittingPriceObj[`${item.useDeptName}`]=item.fittingPrice;
      deptNameArr.push(item.useDeptName);
      return item;
    })
    let dataSource = [actualPriceObj , fittingPriceObj];
    const ds = new DataSet(); 
    const dv = ds.createView().source(dataSource);
    dv.transform({
      type: 'fold',
      fields:deptNameArr, // 展开字段集 [ 'Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.' ]
      key: chartField[dataField][0], // x
      value: chartField[dataField][1], // y
    });
    return dv;
    }else{
      const ds = new DataSet(); 
      const dv = ds.createView().source([]);
      dv.transform({
        type: 'fold',
        fields:[], // 展开字段集 [ 'Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.' ]
        key: '', // x
        value: '', // y
      });
      return dv;
    }
  }

  //左侧按钮切换 - 更换data源
  /**
   * @param title - 更改chartTitle
   * @param hasStyleIndex - 更改左侧button样式
   * @param dataField - 对应更改数据源的字段
   */
  changeChartData = (title,hasStyleIndex,dataField) => {
    let data = this.state.allData[dataField] ;
    //双柱图 data转换
    if(dataField==='actualPriceList'){ 
      data =  this.formatData(data,dataField);
    }
    this.setState({
      chartTitle:title,
      activedButton:hasStyleIndex,
      chartData:data,
      chartFieldText:dataField
    })  
  }
  
  render(){
    const { disable , chartData , chartTitle , activedButton , query , chartFieldText} = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <SearchForm wrappedComponentRef={(inst) => this.SearchForm = inst} query={(val)=>this.onSearch(val)} disable={disable} ></SearchForm>
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          {/*chart*/}
          <TabPane tab="图" key="1">
            <Col span={2}>
              <Button style={buttonStyle} actived={activedButton==='1'?'actived':''} onClick={()=>this.changeChartData('维修次数','1','rrpairNumberList')  }>维修次数</Button>
              <Button style={buttonStyle} actived={activedButton==='2'?'actived':''} onClick={()=>this.changeChartData('维修金额','2','actualPriceList')  }>维修金额</Button>
            </Col>
            <Col span={20}>
              <Chart height={500} data={chartData}  forceFit>
                <Guide>
                  <Text
                    top={true}
                    position={ ['0%','0%'] }  // 文本的起始位置，值为原始数据值，支持 callback
                    content= {chartTitle} // 显示的文本内容
                    style= {{
                      fontSize: '12', // 文本大小
                    }}
                  />
                  <Text
                    top={true}
                    position={ ['98%','97%'] }  // 文本的起始位置，值为原始数据值，支持 callback
                    content= {'科室'} // 显示的文本内容
                    style= {{
                      fontSize: '12', // 文本大小
                    }}
                  />
                </Guide>
                <Axis name={chartField[this.state.chartFieldText][0]} />
                <Tooltip crosshairs={{type : "y"}} />
                {//不同参数显示不同参数属性
                  chartFieldText !=='actualPriceList'? 
                  <Geom 
                  type="interval"
                  tooltip={[`${chartField[this.state.chartFieldText][0]}*${chartField[this.state.chartFieldText][1]}`, (time, sold) => {
                    return {
                      name: chartTitle,
                      value: sold
                    };
                  }]}
                  position={`${chartField[this.state.chartFieldText][0]}*${chartField[this.state.chartFieldText][1]}`}  
                  size={15}/>
                  :
                  <div>
                    <Geom 
                      type="interval"
                      position={`${chartField[this.state.chartFieldText][0]}*${chartField[this.state.chartFieldText][1]}`}  
                      color={'name'} adjust={[{type: 'dodge',marginRatio: 1/32}]}  size={25}/>
                    <Legend />
                  </div>
                
                }
                
              </Chart>
            </Col>
          </TabPane>
          {/*table*/}
          <TabPane tab="表" key="0">
            <RemoteTable
              ref='table'
              query={query.bDeptId?query:{}}
              url={operation.selectUseDeptCount}
              scroll={{x: '100%'}}
              columns={columns}
              showHeader={true}
              rowKey={'RN'}
              style={{padding:24}}
              size="small">
            </RemoteTable>
          </TabPane>
        </Tabs>
      </Content>
    )
  }
 }
 export default DeptCount;

 
 class SearchFormWrapper extends PureComponent {
  state = {
    display: 'none',
    manageOptions: [],  //管理科室
    useOptions:[],//使用科室
  }
  componentDidMount() {
    let val = '';
    //1-获取管理科室下拉框
    let options = {
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:async (data) => {
        let manageOptions = data.result;
        if(manageOptions.length){
          //设置默认管理科室
          this.setState({ manageOptions });
          val = manageOptions[0].value;
          await this.props.query({bDeptId:val,createStartDate:initTime[0],createEndDate:initTime[1]})
        }
      },
      error: (err) => console.log(err)
    };
    request(operation.queryManagerDeptListByUserId, options);

    //2-获取机构使用科室
    request(operation.selectUseDeptList,{
      body:queryString.stringify({deptType:'00'}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({useOptions:data.result})
        }
      },
      error: err => {console.log(err)}
    })

  }
  toggle = () => {
    const { display } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none'
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const createDate = values.createDate === undefined ? '': values.createDate;
      if(createDate.length>0) {
        values.createStartDate = moment(createDate[0]).format('YYYY-MM-DD');
        values.createEndDate = moment(createDate[1]).format('YYYY-MM-DD');
        delete values['createDate']
      }else{
        delete values['createDate']
      }
      for (const key in values) {
        values[key] = values[key] === undefined? "" : values[key];
      }
      this.props.query(values);
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({createDate:[]});
  }
 
render() {
  const { display , manageOptions , useOptions} = this.state;
  const { getFieldDecorator } = this.props.form;
  return (
    <Form onSubmit={this.handleSearch}>
      <Row gutter={30}>
        <Col span={8}>
          <FormItem label={`管理科室`} {...formItemLayout}>
            {getFieldDecorator('bDeptId', {
              initialValue:manageOptions?manageOptions.length>0?manageOptions[0].value:'':''
            })(
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
            >
              {manageOptions.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
            </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={`统计时间`} {...formItemLayout}>
            {getFieldDecorator('createDate', {
                initialValue:[moment(initTime[0],'YYYY-MM-DD'),moment(initTime[1],'YYYY-MM-DD')]
              })(
                <RangePicker style={{width: 250}} />
              )}
          </FormItem>
        </Col>
        <Col span={8}  style={{display: display}}>
          <FormItem label={`使用科室`} {...formItemLayout}>
            {getFieldDecorator('useDeptId', {})(
              <Select
                showSearch
                optionFilterProp="children"
                disabled={this.props.disable} 
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
              >
                <Option value='' key=''>全部</Option>
                {useOptions.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8} style={{float:'right', textAlign: 'center', marginTop: 4}} >
          <Button type="primary" htmlType="submit">查询</Button>
          <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
          <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
            {this.state.display === 'block' ? '收起' : '展开'} <Icon type={this.state.display === 'block' ? 'up' : 'down'} />
          </a>
        </Col>
      </Row>
    </Form>
  )
}
}
const SearchForm = Form.create()(SearchFormWrapper);


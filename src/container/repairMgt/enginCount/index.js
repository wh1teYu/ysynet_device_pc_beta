/*
 * @Author: yuwei - 工程师统计  enginCount
 * @Date: 2018-08-08 14:16:06 
* @Last Modified time: 2018-08-08 14:16:06 
 */
import React , { PureComponent } from 'react';
import { Layout , Col , Row , Input , DatePicker , Select , Form , Icon , Button , Tabs } from 'antd';
import {Chart, Axis, Tooltip, Geom , Guide } from "bizcharts";
import { getRangeTime } from '../../../utils/tools';
import TableGrid from '../../../component/tableGrid';
import operation from '../../../api/operation';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
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
    title: '工程师',
    dataIndex: 'inRrpairUserName',
    width:120
  },
  {
    title: '维修台数',
    dataIndex: 'rrpairNumber',
    width:100,
  },
  {
    title: '维修天数',
    dataIndex: 'rrpairDateNum',
    width:100,
  },
  {
    title:'平均维修天数',
    dataIndex: 'avgDay',
    width:100,
  }
];

/**
 * @param  rrpairNumberList 维修台数 ：[x inRrpairUserName 用户名 , y  rrpairNumber 维修台数]
 * @param  rrpairDateNumList 维修天数图 ：[x inRrpairUserName 用户名 , y  rrpairDateNum 维修台数]
 * @param  avgDayList 平均天数 ：[x inRrpairUserName 用户名 , y  avgDay 平均天数]

*/
const chartField ={
  rrpairNumberList:['inRrpairUserName','rrpairNumber'],
  rrpairDateNumList:['inRrpairUserName','rrpairDateNum'],
  avgDayList:['inRrpairUserName','avgDay']
}
const initTime = getRangeTime('month',1,'before') ;

class EnginCount extends PureComponent{

  state={
    disable:true,//工程师的禁用条件 。图true- 禁用  表false-可用
    query:{},//初始化的搜索条件
    allData:{},//当前图表所有数据
    chartData:[
    ],//图表-数据
    chartTitle:'维修台数',//默认图表的Y轴显示文字
    activedButton:'1',//有边框色样式的button
    chartFieldText:'rrpairNumberList',//当前字段
  }
  
  //表单搜索 - 获取数据 并更新图表以及table
  onSearch = (val)=>{ 
    //获取图表数据
    request(operation.selectEngineerCountChart,{
      body:queryString.stringify(val),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          let allData = data.result;
          this.setState({allData,query:val,chartData:allData[this.state.chartFieldText]})
        }
      },
      error: err => {console.log(err)}
    })
    //获取table数据
    if(this.refs.table){
      this.refs.table.fetch(val)
    }
  }
  //tab切换 - 更改工程师的禁用条件
  tabChange = (key) => {
    let ret = key==='1'? true:false;
    this.setState({disable:ret})
    if(key==="1"){
      this.SearchForm.props.form.setFieldsValue({rrpairUserName:''})
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
  //左侧按钮切换 - 更换data源
  /**
   * @param title - 更改chartTitle
   * @param hasStyleIndex - 更改左侧button样式
   * @param dataField - 对应更改数据源的字段
   */
  changeChartData = (title,hasStyleIndex,dataField) => {
    this.setState({
      chartTitle:title,
      activedButton:hasStyleIndex,
      chartData:this.state.allData[dataField],
      chartFieldText:dataField
    })  
  }
  
  render(){
    const { disable , chartData , chartTitle , activedButton , query} = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <SearchForm wrappedComponentRef={(inst) => this.SearchForm = inst}  query={(val)=>this.onSearch(val)} disable={disable} ></SearchForm>
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          {/*chart*/}
          <TabPane tab="图" key="1">
            <Col span={2}>
              <Button style={buttonStyle} actived={activedButton==='1'?'actived':''} onClick={()=>this.changeChartData('维修台数','1','rrpairNumberList')  }>维修台数</Button>
              <Button style={buttonStyle} actived={activedButton==='2'?'actived':''} onClick={()=>this.changeChartData('维修天数','2','rrpairDateNumList')  }>维修天数</Button>
              <Button style={buttonStyle} actived={activedButton==='3'?'actived':''}  onClick={()=>this.changeChartData('平均天数','3','avgDayList') }>平均天数</Button>
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
                    content= {'工程师'} // 显示的文本内容
                    style= {{
                      fontSize: '12', // 文本大小
                    }}
                  />
                </Guide>
                <Axis name={chartField[this.state.chartFieldText][0]} />
                <Tooltip crosshairs={{type : "y"}} />
                <Geom 
                  type="interval"
                  tooltip={[`${chartField[this.state.chartFieldText][0]}*${chartField[this.state.chartFieldText][1]}`, (time, sold) => {
                    return {
                      name: chartTitle,
                      value: sold
                    };
                  }]}
                  position={`${chartField[this.state.chartFieldText][0]}*${chartField[this.state.chartFieldText][1]}`}  
                  size={15}  />
              </Chart>
            </Col>
          </TabPane>
          {/*table*/}
          <TabPane tab="表" key="0">
            <RemoteTable
              ref='table'
              query={query.bDeptId?query:{}}
              url={operation.selectEngineerCount}
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
 export default EnginCount;

 class SearchFormWrapper extends PureComponent {
    state = {
      display: 'none',
      manageOptions: [],  //管理科室
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
      this.props.form.setFieldsValue({createDate:[]})
    }
 
  render() {
    const { display , manageOptions} = this.state;
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
            <FormItem label={`工程师`} {...formItemLayout}>
              {getFieldDecorator('rrpairUserName', {})(
                <Input placeholder="请输入工程师姓名" disabled={this.props.disable} style={{width: 200}} />
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


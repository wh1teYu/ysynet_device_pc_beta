/*
 * @Author: yuwei 折旧计提 - 折旧汇总
 * @Date: 2019-05-15 10:23:45 
 * @Last Modified by: yuwei
 * @Last Modified time: 2019-05-21 17:24:43
 */

import React from 'react';
import { message, Row, Col, Layout, Button, DatePicker, Select, Form, Icon } from 'antd';
import querystring from 'querystring';
import TableGrid from '../../../component/tableGrid';
import devalue from '../../../api/devalue';
import request from '../../../utils/request';
import moment from 'moment' ;
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const { MonthPicker } = DatePicker;
const { Option } = Select;  
const FormItem = Form.Item;

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

const StartCol = [
  {
    title: '序号', 
    dataIndex: 'RN', 
    width:'5%',

  },
  {
    title: '会计月',
    dataIndex: 'depreciationDate',
    width:'10%',
    render:(text,record)=>{
      return text?text.substr(0,11):''
    }
  },
]

const EndCol = [
  {
    title:'折旧方式',
    dataIndex: 'depreciationTypeName',
    width:'10%',
  },{
    title:'原值',
    dataIndex: 'originalValue',
    align:'right',
    width:'10%',
  },{
    title:'累计折旧',
    align:'right',
    dataIndex: 'totalDepreciationPrice',
    width:'10%',
  },{
    title:'净值',
    dataIndex: 'carryingAmount',
    align:'right',
    width:'10%',
  }, {
    title:'本月折旧',
    dataIndex: 'monthDepreciationPrice',
    align:'right',
    width:'10%',
  },  
]

const type0000 = StartCol.concat([
  {
    title:'使用科室',
    dataIndex: 'useDeptName',
    width:'10%',
  }
],EndCol)

const type0001 = StartCol.concat([
  {
    title:'使用科室',
    dataIndex: 'useDeptName',
    width:'10%',
  },{
    title:'折旧分类',
    dataIndex: 'depreciationName',
    width:'10%',
  },
],EndCol)

const type0100 = StartCol.concat([
  {
    title:'管理科室',
    dataIndex: 'bDeptName',
    width:'10%',
  },{
    title:'折旧分类',
    dataIndex: 'depreciationName',
    width:'10%',
  },
],EndCol)

class Summary extends React.Component{

    state = {
      query:{summaryType:"00",reportType:"00"},
      toggle:false,
      deptSelect:[],//使用科室下拉框
      ds:[],
    }

    componentDidMount (){
      this.getDeptSelect();
    }

    //搜索表单 - 查询 
    queryHandler = (query) => {
      let value = this.props.form.getFieldsValue();
      console.log(value)
      if(value.depreciationDate){
        value.depreciationDate = moment(value.depreciationDate).format('YYYY-MM')
      }
      if (query && query.summaryType==="01") {
        this.props.form.setFieldsValue({reportType:"00"})
        value.reportType="00"
      }
      // this.refs.table.fetch({...value,...query});
      this.setState({query:{...value,...query}})
    }
    //搜索表单 - 重置
    reset = () =>{
      this.props.form.resetFields();
      let query =   Object.assign(this.state.query,{summaryType:"00",reportType:"00",useDeptGuid:"",depreciationDate:null})
      this.refs.table.fetch(query);
      this.setState({
        query
      })
    }

    /**
     * @description 查询当前机构使用科室
     */
    getDeptSelect = () => {
      request(devalue.selectUseDeptList, {
        body:querystring.stringify({deptType:"00"}),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            this.setState({deptSelect:data.result})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      });
    }

    /**
     * @description 根据搜索的 统计方式/报表样式 混合显示columns
     * @param {summaryType}  统计方式 00使用科室 01折旧分类
     * @param {reportType}  报表样式 00标准样式 01交叉表
     */
    getColumns = () => {
      let values = this.props.form.getFieldsValue();
      const { summaryType, reportType} = values;
      if ( summaryType === "00" ){
        if (reportType === "00") {
          //使用科室 - 标准样式
          return StartCol.concat([
            {
              title:'使用科室',
              dataIndex: 'useDeptName',
              width:'10%',
            }
          ],EndCol)
        }else {
          //使用科室 - 交叉样式
          return StartCol.concat([
            {
              title:'使用科室',
              dataIndex: 'useDeptName',
              width:'10%',
            },{
              title:'折旧分类',
              dataIndex: 'depreciationName',
              width:'10%',
            },
          ],EndCol)
        }
      }else {
        // summaryType === "01"
        // 折旧分类 - 标准样式
        return StartCol.concat([
          {
            title:'管理科室',
            dataIndex: 'bDeptName',
            width:'10%',
          },{
            title:'折旧分类',
            dataIndex: 'depreciationName',
            width:'10%',
          },
        ],EndCol)
      }
    }

    /**
     * @description 导出表单
     */
    export = () => {
      const { query } = this.state;
      window.open(devalue.exportUseDeptEquimentDepreciationSummary+'?'+querystring.stringify(query))
    }

    render(){
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const { toggle, deptSelect, query } = this.state;
      const type = getFieldValue('summaryType')+ getFieldValue('reportType');
      console.log(type)
      return(
          <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem label='统计方式' {...formItemLayout}>
                    {getFieldDecorator('summaryType',{
                      initialValue:"00"
                    })(
                      <Select style={{width:'100%'}}
                      onSelect={(val)=>this.queryHandler({summaryType:val})}> 
                        <Option value="00">使用科室</Option>
                        <Option value="01">折旧分类</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='会计月' {...formItemLayout}>
                    {getFieldDecorator('depreciationDate')(
                      <MonthPicker
                        style={{width:'100%'}}
                        format="YYYY-MM"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{display: toggle ? 'block':'none' }}>
                  {
                    getFieldValue('summaryType') === "01" ?
                    null:
                    <FormItem label='使用科室' {...formItemLayout}>
                      {getFieldDecorator('useDeptGuid',{
                        initialValue:""
                      })(
                        <Select>
                          <Option value="" key="-1">全部</Option>
                          {
                            deptSelect.map(item=><Option key={item.value} value={item.value}>{item.text}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>
                  }
                </Col>
                <Col span={8} style={{display: toggle ? 'block':'none' }}>
                  <FormItem label='报表样式' {...formItemLayout}>
                    {getFieldDecorator('reportType',{
                      initialValue:"00"
                    })(
                      <Select disabled={getFieldValue('summaryType') === "01"}
                      onSelect={(val)=>this.queryHandler({reportType:val})}>
                        <Option value="00">标准样式</Option>    
                        <Option value="01">交叉表</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col style={{ float: 'right', textAlign:'right' }} span={8}>
                  <Button type='primary' style={{marginRight:8}} onClick={()=>this.queryHandler()}>查询</Button>
                  <Button onClick={this.reset}>重置</Button>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={()=>this.setState({toggle:!toggle})}>
                    {toggle ? '收起' : '展开'}  <Icon type={toggle ? 'up' : 'down'} />
                  </a>
                </Col>
              </Row>
            </Form>
            <Row>
              <Button onClick={this.export} icon='export'>导出</Button>
            </Row>

            {
              type === "0000" ?
              <RemoteTable
                ref='table'
                query={query}
                url={devalue.selectUseDeptEquimentDepreciationSummary}
                isList={true}
                scroll={{x: '100%'}}
                columns={type0000}
                rowKey={'RN'}
                showHeader={true}
                style={{marginTop: 10}}
                size="small"
              /> :null
            }
            {
              type === "0001" ?
              <RemoteTable
                ref='table'
                query={query}
                url={devalue.selectUseDeptEquimentDepreciationSummary}
                isList={true}
                scroll={{x: '100%'}}
                columns={type0001}
                rowKey={'id'}
                showHeader={true}
                style={{marginTop: 10}}
                size="small"
              /> :null
            }
            {
              type === "0100" ?
              <RemoteTable
                ref='table'
                query={query}
                url={devalue.selectUseDeptEquimentDepreciationSummary}
                isList={true}
                scroll={{x: '100%'}}
                columns={type0100}
                rowKey={'RN'}
                showHeader={true}
                style={{marginTop: 10}}
                size="small"
              /> :null
            }

          </Content>
      )
    }

}
export default Form.create()(Summary);
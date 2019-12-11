/*
 * @Author: yuwei - 保养计划
 * @Date: 2018-12-01 00:36:51 
 * @Last Modified by: yuwei
 * @Last Modified time: 2018-12-11 15:05:54
 */
import React from 'react';
import { Modal ,message , Row, Col, Input, Layout , Popover, Form, Select,Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import TableGrid from '../../../component/tableGrid';
import upkeep from '../../../api/upkeep';
import querystring from 'querystring';
import request from '../../../utils/request';
import './styles.css';  
import { upkeepPlanStateSel ,upkeepPlanState , upkeepMainTainType, maintainModeType } from '../../../constants';
import { Link } from 'react-router-dom';
import { timeToStamp } from '../../../utils/tools';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const { Content } = Layout;
const { RemoteTable } = TableGrid;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class SearchForm extends React.Component{

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`计划单号`}>
              {
                getFieldDecorator(`maintainPlanNo`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`资产名称`}>
              {
                getFieldDecorator(`equipmentStandardName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`资产编号`}>
              {
                getFieldDecorator(`assetsRecord`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`保养模式`}>
              {
                getFieldDecorator(`maintainMode`,{
                  initialValue: ''
                })(
                  <Select placeholder='请选择'>
                    <Option value=''>请选择</Option>
                    <Option value='01'>管理科室保养</Option>
                    <Option value='02'>临床科室保养</Option>
                    <Option value='03'>服务商保养</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType='submit'>查询</Button>
            <Button style={{marginLeft: 5, marginRight: 25}} onClick={()=> this.handleReset() }>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const SearchFormWapper = Form.create()(SearchForm);

class MaintainPlan extends React.Component{

    constructor(props){
      super(props);
      /* 设置redux前置搜索条件 */
      const { search, history } = this.props;
      const pathname = history.location.pathname;
      this.state = {
        query:search[pathname]?{...search[pathname]}:{maintainMenu:"plan"},
        visible: false ,
        modalContent:'',
        record:{},
        isDelete:false
      };
    }
    /* 回显返回条件 */
  async componentDidMount () {
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    console.log(search[pathname])
    if (search[pathname]) {
      //找出表单的name 然后set
      let value = {};
      let values = this.form.props.form.getFieldsValue();
      values = Object.getOwnPropertyNames(values);
      values.map(keyItem => {
        value[keyItem] = search[pathname][keyItem];
        return keyItem;
      });
      this.form.props.form.setFieldsValue(value)
    }
  }
    sortTime = (a,b,key) =>{
      if(a[key] && b[key]){
        return timeToStamp(a[key]) - timeToStamp(b[key])
      }
    }
    
    /* 查询时向redux中插入查询参数 */
    searchTable = (val) => {
      /* 存储搜索条件 */
      const { setSearch, history ,search } = this.props;
      const pathname = history.location.pathname;
      val = Object.assign({maintainMenu:"plan"},val)
      let values = Object.assign({...search[pathname]},{...val})
      setSearch(pathname, values);
      this.refs.table.fetch(val)
    }

    getActions = (fstate,record) =>{
      switch(fstate){
        case '00':
          return  (<span>
            <a title='关闭' style={{ marginLeft: 8 }} onClick={()=>this.closePlan(record)}>关闭</a>
          </span>)
        case '20':
          return ( <span>
            <Link to={{pathname:`/upkeep/plan/edit/${record.maintainPlanDetailId}`}}>执行保养</Link>&nbsp;&nbsp;
            <a title='关闭' onClick={()=>this.closePlan(record)}>关闭</a>
          </span>)
        default: 
          break;
      }
    }
    
    deletePlanDetails = (record)=>{//删除
      confirm({
        title: '是否确认删除？',
        content: `删除后不可恢复是否继续删除？`,
        onOk: async () => {
          console.log(record.maintainPlanDetailId);
          let options = {
            body:querystring.stringify({maintainPlanDetailId:record.maintainPlanDetailId}),
            headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
              if(data.status){
                message.success( '删除成功')
                this.refs.table.fetch();
              }else{
                message.error(data.msg)
              }
            },
            error: err => {console.log(err)}
          }
          request(upkeep.deletePlanDetails, options)

        },
        onCancel: () => this.setState({visible: false})
      })
      
    }
    doPlanDetails = (record)=>{//执行
      confirm({
        title: '是否确认执行？',
        content: `确定执行此操作？`,
        onOk: async () => {
          let options = {
            body:querystring.stringify({maintainPlanDetailId:record.maintainPlanDetailId}),
            headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
              if(data.status){
                message.success( '执行计划成功，已生成保养工单。')
                this.refs.table.fetch();
                this.setState({visible: false,});
              }else{
                message.error(data.msg)
              }
            },
            error: err => {console.log(err)}
          }
          request(upkeep.doPlanDetails, options)
        },
        onCancel: () => this.setState({visible: false})
      })
      
    }

    closePlan = (record)=>{//关闭
      confirm({
        title: '是否确认关闭此计划？',
        content: `确定执行此操作？`,
        onOk: async () => {
          let options = {
            body:querystring.stringify({maintainPlanDetailId: record.maintainPlanDetailId,fstate: '80'}),
            headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
              if(data.status){
                message.success('关闭成功')
                this.setState({visible: false},() => this.refs.table.fetch());
              }else{
                message.error(data.msg)
              }
            },
            error: err => {console.log(err)}
          }
          request(upkeep.updateMaintainPlanDetailFstate, options)
        },
        onCancel: () => this.setState({visible: false})
      })
      
    }



    /* 记录table过滤以及分页数据 */
    changeQueryTable = (values) =>{
      const { setSearch, history ,search} = this.props;
      values = Object.assign({...search[history.location.pathname]},{...values})
      setSearch(history.location.pathname, values);
    }
    render(){
      const { modalContent }= this.state;
      const { search , history } = this.props;
      const pathname = history.location.pathname;
      let columns=[
        {
          title: '序号',
          width: 50,
          dataIndex: 'index',
          render: (text,record,index) => `${ index + 1 }`
        },
        {
          title: '保养计划单号',
          // className:'col08',
          width: 150,
          dataIndex: 'maintainPlanNo',
          render(text, record) {
            return <Link to={{ pathname:`/upkeep/plan/details/${record.maintainPlanDetailId}` }}>{text}</Link>
          }
        },
        {
          title: '计划状态',
          dataIndex: 'fstate',
          width: 150,
          key: 'fstate',
          filters:upkeepPlanStateSel,
          onFilter: (value, record) => (record && record.fstate===value),
          render: text => 
            <div>
            { upkeepPlanState[text].text }
            </div>
        },
        {
          title: '资产编号',
          dataIndex: 'assetsRecord',
          width: 150
        },
        {
          title: '资产名称',
          width: 150,
          dataIndex: 'equipmentStandardName',
          render:(text,record) =>
            <Popover  content={
              <div style={{padding:20}}>
                <p>资产名称：{record.equipmentStandardName}</p>
              </div>
            }>
              {text}
            </Popover>
        },
        {
          title: '使用科室',
          width: 150,
          dataIndex: 'useDept',
          render: text => <span title={text}>{text}</span>
        },
        {
          title: '保养类型',
          width: 150,
          dataIndex: 'maintainType',
          render: text => <span>{upkeepMainTainType[text].text}</span>
        },
        {
          title: '上次保养时间',
          width: 150,
          dataIndex: 'lastMaintainDate',
          sorter: (a, b) => this.sortTime(a,b,'maintainDate'),
          render: text => <span title={text}>{text}</span>
        },
        {
          title: '计划保养时间',
          width: 150,
          dataIndex: 'maintainDate',
          sorter: (a, b) => this.sortTime(a,b,'endMaintainDate'),
          render: text => <span title={text}>{text}</span>
        },
        {
          title: '保养模式',
          width: 150,
          dataIndex: 'maintainMode',
          render: text => <span title={text}>{maintainModeType[text].text}</span>
        },
        {
          title: '保养执行科室',
          width: 150,
          dataIndex: 'executeDeptName',
          render: text => <span title={text}>{text}</span>
        },
        {
          title: '操作员',
          width: 150,
          dataIndex: 'executeUsername',
          render: text => <span title={text}>{text}</span>
        },
        { 
          title: '操作', 
          dataIndex: 'maintainPlanDetailId', 
          width: 150,
          key: 'x', 
          render: (text,record) => {
            let { fstate } = record;
            return this.getActions(fstate,record)
          }
        }
      ]
      if(search[pathname]&&search[pathname].fstate){
        columns[2].filteredValue = search[pathname].fstate;
      }
      return(
          <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20,backgroundColor:'none'}}>
            <SearchFormWapper 
              query={(val)=>this.searchTable(val)} 
              wrappedComponentRef={(form) => this.form = form}
            />
            {/* <Row>

                <Col span={12}>
                <Search
                    defaultValue={defaultValue}
                    placeholder="请输入计划单号/资产名称/资产编码"
                    onSearch={value =>  {this.queryHandler({'maintainPlanNo':value})}}
                    style={{ width: 400 }}
                    enterButton="搜索"
                />
                </Col>
            </Row> */}
            <RemoteTable
                ref='table'
                query={this.state.query}
                onChange={this.changeQueryTable}
                url={upkeep.planList}
                scroll={{x: '180%', y : document.body.clientHeight - 110 }}
                columns={columns}
                rowKey={'maintainPlanDetailId'}
                showHeader={true}
                style={{marginTop: 10}}
                size="small"
            /> 
            <Modal
              title="警告"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>{modalContent}</p>
            </Modal>
          </Content>
      )
    }
}

export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(MaintainPlan));
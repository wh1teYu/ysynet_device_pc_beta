/**
 * @file 保养管理 保养台账
 */
import React from 'react';
import { message , Row, Col, Input, Layout, Form, Select, Button, Modal } from 'antd';
import { upkeepPlanLoopFlag , maintaiFlag, maintainModeType } from '../../../constants';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import TableGrid from '../../../component/tableGrid';
import upkeep from '../../../api/upkeep';
import querystring from 'querystring';
import request from '../../../utils/request';
import { Link } from 'react-router-dom';
const Confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const { Content } = Layout;
const { RemoteTable } = TableGrid;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class SearchForm extends React.Component{
  handleSearch = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values,'values')
      this.props.query(values);
    });
  }
  handleReset = () =>{
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={48}>
          <Col span={6}>
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
          <Col span={6}>
            <FormItem {...formItemLayout} label={`资产编号`}>
              {
                getFieldDecorator(`assestRecord`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={6}>
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
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType='submit'>查询</Button>
            <Button style={{marginLeft: 5, marginRight: 25}} onClick={this.handleReset }>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const SearchFormWapper = Form.create()(SearchForm);

class UpkeepAccount extends React.Component{

  constructor(props){
    super(props);
      /* 设置redux前置搜索条件 */
      const { search, history } = this.props;
      const pathname = history.location.pathname;
      this.state = {
        query:search[pathname]?{...search[pathname]}:{},
        record:{},
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
  /* 重置时清空redux */
  handleReset = ()=>{
    this.form.props.form.resetFields();
    const { clearSearch , history } = this.props;
    const pathname = history.location.pathname;
    clearSearch(pathname,{});
  }
  /* 查询时向redux中插入查询参数 */
  searchTable = (val) => {
    /* 存储搜索条件 */
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...val})
    setSearch(pathname, values);
    this.refs.table.fetch(val)
  }
  /* 记录table过滤以及分页数据 */
  changeQueryTable = (values) =>{
    const { setSearch, history ,search} = this.props;
    values = Object.assign({...search[history.location.pathname]},{...values})
    setSearch(history.location.pathname, values);
  }
  // 启用
  startUse = (record,index) =>{
    Confirm({
      content:'确定要启用该台账?',
      onOk: ()=>{
        this.updateFlag({ maintainPlanId: record.maintainPlanId, flag: '01' })
      },
      onCancel: () =>{}
    })
  }
  // 停用
  stop = (record,index) =>{
    Confirm({
      content:'确定要停用该台账?',
      onOk: ()=>{
        this.updateFlag({ maintainPlanId: record.maintainPlanId, flag: '00' })
      },
      onCancel: () =>{}
    })
  }
  updateFlag = (values) =>{
    request(upkeep.updateMaintainPlanFlag,{
      body: querystring.stringify(values),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        this.setState({ loading: false });
        if(data.status){
          message.success('操作成功');
          this.refs.table.fetch();
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  render(){
    let columns = [
      {
        title: '资产名称',
        dataIndex: 'equipmentStandardName',
        width: 150,
        render:(text,record) => <span><Link to={{ pathname: `/upkeep/upKeepAccount/edit/${record.maintainPlanId}` }}>{text}</Link></span>
          
      },
      {
        title: "资产编号",
        dataIndex: 'assestRecord',
        width: 130
      },
      {
        title: "状态",
        dataIndex: 'flag',
        width: 60,
        render: (text,record) => <span>{maintaiFlag[text].text}</span>
      },
      {
        title: '保养模式',
        dataIndex: 'maintainMode',
        width: 80,
        render: (text,record,index) => {
          return <span>{maintainModeType[text].text}</span>
        }
      },
      {
        title: '保养执行科室',
        dataIndex: 'executeDeptName',
        width: 110,
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "最近保养时间",
        dataIndex: 'endMaintainDate',
        width: 110
      },
      {
        title: '循环方式',
        dataIndex: "loopFlag",
        width: 70,
        render: text => <span title={text}>{upkeepPlanLoopFlag[text].text}</span>
      },
      {
        title: '操作员',
        dataIndex: 'planUserName',
        width: 100,
        render: text => <span title={text}>{text}</span>
      },
      {
        title: '创建时间',
        dataIndex: 'planTime',
        width: 110,
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "操作",
        width: 60,
        dataIndex: 'action',
        render: (text,record,index) => {
          return record.flag === '00'
            ?
            <span><a onClick={() => this.startUse(record,index)}>启用</a></span>
            :
            <span><a onClick={() => this.stop(record,index)}>停用</a></span>
        }
      }
    ]
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20,backgroundColor:'none'}}>
        <SearchFormWapper 
          query={(val)=>this.searchTable(val)}
          handleReset={this.handleReset} 
          wrappedComponentRef={(form) => this.form = form}
        />
        <div>
          <Link to={{ pathname: '/upkeep/upKeepAccount/newAdd' }}><Button type='primary'>新增台账</Button></Link>
        </div>
        <RemoteTable
          ref='table'
          query={this.state.query}
          onChange={this.changeQueryTable}
          url={upkeep.selectMaintainParameterList}
          scroll={{x: '120%', y : document.body.clientHeight - 110 }}
          columns={columns}
          rowKey={'maintainPlanId'}
          showHeader={true}
          style={{marginTop: 10}}
          size="small"
      /> 
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(UpkeepAccount));

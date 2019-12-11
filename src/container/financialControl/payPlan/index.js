import { Popconfirm } from 'antd';
/*
 * @Author: yuwei 付款计划 payPlan
 * @Date: 2019-03-22 14:30:18 
 * @Last Modified by: yuwei
 * @Last Modified time: 2019-03-22 22:41:20
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,DatePicker, Divider } from 'antd';
import TableGrid from '../../../component/tableGrid';
import { Link , withRouter } from 'react-router-dom';
import financialControl from '../../../api/financialControl';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { PayPlanFstate,  PayPlanFstateSelect } from '../../../constants';
const {RangePicker} = DatePicker;
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
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

class SearchForm extends Component {

  state={
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    manageSelect:[],
    outDeptOptions: []
  }
  componentDidMount = () => {
    this.getManageSelect();
  }

  getManageSelect = () => {
    request(financialControl.queryManagerDeptListByUserId,{
      body:queryString.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  toggle = () => {
    const { display, expand } = this.state;
    this.props.changeQueryToggle()
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.createTime){
        values.createStartTime = moment(values.createTime[0]).format('YYYY-MM-DD');
        values.createEndTime = moment(values.createTime[1]).format('YYYY-MM-DD');
      }
      delete values['createTime']
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();
  }
  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display } = this.state;
  
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="管理部门"
            >
              {getFieldDecorator('bDeptId',{//manageDeptGuid
                initialValue:""
              })(
                <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.manageSelect.map((item,index) => {
                        return <Option key={index} value={item.value}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {getFieldDecorator('fstate',{
                initialValue:""
              })(
                <Select>
                  <Option key="" value="">全部</Option>
                  {
                    PayPlanFstateSelect.map((item)=>(<Option value={item.value} key={item.value}>{item.text}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="计划名称"
            >
              {getFieldDecorator('pplanName',{
                initialValue:""
              })(
                <Input placeholder='计划名称'/>
              )}
            </FormItem>
          </Col>
          
          <Col span={6} style={{textAlign:'right', paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
        <Row style={{display: display}}>
         <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="制单时间"
            >
              {getFieldDecorator('createTime')(
                <RangePicker></RangePicker>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class PayPlan extends Component {
  
  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:search[pathname]?{...search[pathname]}:{},
      visible:false,
    }
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
      if(search[pathname].startTime&&search[pathname].endTime){
        value.Time=[moment(search[pathname].startTime,'YYYY-MM-DD'),moment(search[pathname].endTime,'YYYY-MM-DD')]
      }
      this.form.props.form.setFieldsValue(value)
    }
  }
  searchTable = (query) => {
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...query},{...search[pathname]},)
    setSearch(pathname, values);
    this.refs.table.fetch(query)
  }
  //删除
  delete = (record) => {
    request(financialControl.deletePayPlan,{
      body:queryString.stringify({pplanId:record.pplanId}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.success('操作成功')
          this.refs.table.fetch(this.state.query)
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //发布 
  submit = (record) => {
    console.log('发布',record)
    request(financialControl.updatePayPlanFstate,{
      body:queryString.stringify({pplanId: record.pplanId, fstate: '03'}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.success('操作成功')
          this.refs.table.fetch(this.state.query)
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  /* 重置时清空redux */
  handleReset = ()=>{
    this.form.props.form.resetFields();
    const { clearSearch , history ,search} = this.props;
    const pathname = history.location.pathname;
    let setToggleSearch = {};
    if(search[pathname]){
      setToggleSearch = { toggle:search[pathname].toggle};
    }else{
      setToggleSearch = { toggle: false };
    }
    clearSearch(pathname,setToggleSearch);
  }
  /* 记录table过滤以及分页数据 */
  changeQueryTable = (values) =>{
    const { setSearch, history ,search} = this.props;
    values = Object.assign({...search[history.location.pathname]},{...values})
    setSearch(history.location.pathname, values);
  }
  /* 记录展开状态 */
  changeQueryToggle = () =>{
    const { search , setSearch , history} = this.props;
    const pathname = history.location.pathname;
    let hasToggleSearch = {};
    if(search[pathname]){
        hasToggleSearch = {...search[pathname],toggle:!search[pathname].toggle};
    }else{
        hasToggleSearch = { toggle: true };
    }
    setSearch(pathname,hasToggleSearch)
  }
  render() {
    const { search , history } = this.props;
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    const columns = [
      {
        title: '计划名称',
        dataIndex: 'pplanName',
        width:100,
        render:(text,record)=><Link to={{'pathname':`/financialControl/payPlan/details/${record.pplanId}`}}>{text}</Link>
      },
      {
        title: '计划金额',
        dataIndex: 'planTotalPrice',
        width:100,
        render:(text)=>text?(text-0).toFixed(2):''
      },
      {
        title:'状态',
        dataIndex:'fstate',
        width:100,
        render:(text)=>text?PayPlanFstate[text]:''
      },
      {
        title: '制单人',
        dataIndex: 'createUserName',
        width:100
      },
      {
        title: '制单时间',
        dataIndex: 'createTime',
        width:100,
        render:(text)=>text.substr(0,11)
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width:100,
        render:(text,record)=>{
          if (record.fstate==='00') {
            return (
              <span>
                <Popconfirm title="确定要删除吗" onConfirm={() => this.delete(record)}>
                  <a href="">删除</a>
                </Popconfirm>
                <Divider type="vertical"/>
                <Popconfirm style={{marginLeft: 8}} title="确定要发布吗" onConfirm={() => this.submit(record)}>
                  <a href="">发布</a>
                </Popconfirm>
              </span>
            )
          }
        }
      },
    ];
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
        <SearchFormWapper 
          query={(val)=>this.searchTable(val)} 
          handleReset={()=>this.handleReset()}
          changeQueryToggle={()=>this.changeQueryToggle()}
          isShow={isShow}
          wrappedComponentRef={(form) => this.form = form}
         ></SearchFormWapper>
        <Row style={{textAlign:'left'}}>
          <Button type='primary' icon='plus'>
            <Link to={{pathname:`/financialControl/payPlan/add`}} style={{color:'#fff'}}> 新建计划</Link>
          </Button>
        </Row>
        <RemoteTable
            onChange={this.changeQueryTable}
            size="small"
            loading={ this.state.loading}
            ref='table'
            query={this.state.query}
            url={financialControl.selectPayPlanList}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'pplanId'}
            style={{marginTop: 10}}
          />
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(PayPlan));
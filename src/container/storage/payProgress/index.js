/*
 * @Author: yuwei  - 付款进度
 * @Date: 2019-01-02 17:41:47 
 * @Last Modified by: yuwei
 * @Last Modified time: 2019-01-03 12:07:48
 */
import React , { PureComponent } from "react";
import { Form , Layout , Input , Col , Row , Select , Button , Icon , message } from 'antd';
import request from '../../../utils/request';
import assets from '../../../api/assets';
import storage from '../../../api/storage';
import queryString from 'querystring';
import TableGrid from '../../../component/tableGrid';
import { PayFstateSelect , PayFstate }  from '../../../constants'
import { search } from '../../../service';
import { Link , withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
const { Content } = Layout;
const FormItem = Form.Item;
const { RemoteTable } = TableGrid;
const { Option } = Select;
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
let columns = [
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    width: 150,
    render:(text,record)=>{
      return (
        <Link to={{pathname:`/storage/payProgress/details/${record.contractId}`}}>{text}</Link>
      )
    }
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 100
  },
  {
    title: '付款状态',
    dataIndex: 'payType',
    width: 100,
    render:(text)=>text?PayFstate[text]:'未付款'
  },
  {
    title: '已付款金额',
    dataIndex: 'payedPrice',
    width: 100,
    className:'text-right',
    render:(text,record,index)=>(
      <p style={{textAlign:'right'}}>{text?Number(record.payedPrice).toFixed(2):''}</p>
    )
  },
  {
    title: '资产总金额',
    dataIndex: 'totalPrice',
    width: 150,
    className:'text-right',
    render:(text,record,index)=>(
      <p style={{textAlign:'right'}}>{text?Number(record.totalPrice).toFixed(2):''}</p>
    )
  },
  {
    title: '供应商',
    dataIndex: 'fOrgName',
    width: 200
  }
];


class PayProgress extends PureComponent {


  constructor(props){
    super(props);
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state={
      query:{...search[pathname]},//"deptType":"MANAGEMENT"
    }
  }

  /* 回显返回条件 */
  async componentDidMount () {
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    if (search[pathname]) {
      //找出表单的name 然后set
      let values = this.form.props.form.getFieldsValue();
      values = Object.getOwnPropertyNames(values);
      let value = {};
      values.map(keyItem => {
        value[keyItem] = search[pathname][keyItem];
        return keyItem;
      });
      this.form.props.form.setFieldsValue(value)
    }
  }
  query = (val) => {
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...val})
    setSearch(pathname, values);
    this.refs.table.fetch(val)
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
  render(){
    const { history, search } = this.props;
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    // if(search[pathname]&&search[pathname].useFstate){
    //   columns[2].filteredValue = search[pathname].useFstate;
    // }
    return(
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}} >
        <SearchFormWapper
          query={query=>{this.query(query)}} 
          handleReset={()=>this.handleReset()}
          changeQueryToggle={()=>this.changeQueryToggle()}
          isShow={isShow}
          wrappedComponentRef={(form) => this.form = form}
       ></SearchFormWapper>
       <RemoteTable
        onChange={this.changeQueryTable}
        loading={ this.state.loading}
        ref='table'
        query={this.state.query}
        url={storage.selectPayContractList}
        scroll={{x: '100%'}}
        columns={columns}
        showHeader={true}
        rowKey={'contractId'}
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
}))(PayProgress));

class SearchForm extends PureComponent {
  
  state={
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    manageSelect:[],
    outDeptOptions: []
  }
  constructor(props){
    super(props)
    this.fetchSelect = _.debounce(this.fetchSelect,500)
    this.fetchUseSelect = _.debounce(this.fetchUseSelect,500)
  }
  componentDidMount = () => {
    this.getManageSelect();
    this.outDeptSelect();
  }

  getManageSelect = () => {
    request(assets.queryManagerDeptListByUserId,{
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
  outDeptSelect = () => {
    request(assets.selectUseDeptList,{
      body:queryString.stringify({deptType:"00"}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
                this.setState({outDeptOptions:data.result})
        }else{
                message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  toggle = () => {
    const { display , expand} = this.state;
    this.props.changeQueryToggle()
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.buyDate){
        values.buyDateStart=moment(values.buyDate[0]).format('YYYY-MM-DD');
        values.buyDateEnd=moment(values.buyDate[1]).format('YYYY-MM-DD');
        delete values['buyDate'];
      }
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();
  }

  //管理科室
  fetchSelect = (input)=>{
    request(assets.queryManagerDeptListByUserId,{
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
  //使用科室- 简码搜索
  fetchUseSelect = (input)=>{
    request(assets.selectUseDeptList,{
      body:queryString.stringify({deptType:"00",deptName:input}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({outDeptOptions:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
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
              label="管理科室"
            >
              {getFieldDecorator('bDeptId',{
                initialValue:""
              })(
                <Select
                onSearch={this.fetchSelect}
                showSearch
                placeholder={'请选择'}
                filterOption={false}
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
              label="付款状态"
            >
              {getFieldDecorator('payType')(
                <Select
                  onSearch={this.fetchUseSelect}
                  showSearch
                  placeholder={'请选择'}
                  filterOption={false}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                      PayFstateSelect.map((item,index)=>
                       <Option value={item.value} key={index}>{item.text}</Option>
                      )
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="合同编号"
            >
              {getFieldDecorator('contractNo')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          
          <Col span={6} style={{textAlign:'right',paddingRight:15,paddingTop:5}}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
        <Row style={{display: display}}>
          <Col span={6}>
              <FormItem
                {...formItemLayout}
                label="合同名称"
              >
                {getFieldDecorator('contractName')(
                  <Input placeholder='请输入'/>
                )}
              </FormItem>
          </Col>
          <Col span={6}>
              <FormItem
                {...formItemLayout}
                label="资产编号"
              >
                {getFieldDecorator('assetsRecord')(
                  <Input placeholder='请输入'/>
                )}
              </FormItem>
          </Col>
          <Col span={6}>
              <FormItem
                {...formItemLayout}
                label="资产名称"
              >
                {getFieldDecorator('equipmentStandardName')(
                  <Input placeholder='请输入'/>
                )}
              </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="申请科室"
            >
              {getFieldDecorator('deptGuid')(
                <Select
                onSearch={this.fetchUseSelect}
                showSearch
                placeholder={'请选择'}
                filterOption={false}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.outDeptOptions.map((item,index) => {
                        return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm)
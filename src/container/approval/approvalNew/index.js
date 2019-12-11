/*
 * @Author: yuwei  approvalNew  新品审批
 * @Date: 2018-07-11 14:31:51 
* @Last Modified time: 2018-07-11 14:31:51 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,DatePicker} from 'antd';
import TableGrid from '../../../component/tableGrid';
import { Link , withRouter } from 'react-router-dom';
import approval from '../../../api/approval';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { allowTypeSelect , allowTypeStatus , approvalFstateSelect ,approvalFstateStatus  } from '../../../constants';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
const RangePicker = DatePicker.RangePicker;
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

  //申请科室
  getManageSelect = () => {
    request(approval.queryDeptListByUserId,{
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
      if(values.Time){
        values.startTime = moment(values.Time[0]).format('YYYY-MM-DD');
        values.endTime = moment(values.Time[1]).format('YYYY-MM-DD');
      }
      delete values['Time']
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { display } = this.state;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="开票日期"
            >
              {getFieldDecorator('Time')(
                <RangePicker></RangePicker>
              )}
            </FormItem>
          </Col>
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="申请科室"
            >
              {getFieldDecorator('deptGuid',{
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
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="单据号"
            >
              {getFieldDecorator('applyNo')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="单据类型"
            >
              {getFieldDecorator('allowType')(
                <Select>
                  <Option key="" value="">全部</Option>
                  {
                    allowTypeSelect.map((item)=><Option key={item.value} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="审批状态"
            >
              {getFieldDecorator('fstate')(
                <Select>
                  <Option key="" value="">全部</Option>
                  {
                    approvalFstateSelect.map((item)=><Option key={item.value} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{textAlign:'right', paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class ApprovalNew extends Component {
  
  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:search[pathname]?{...search[pathname]}:{}
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
        title:'单据类型',
        dataIndex:'allowType',
        width:80,
        render:(text)=>text?allowTypeStatus[text]:""
      },
      {
        title: '单据号',
        dataIndex: 'applyNo',
        width:150,
        render:(text,record)=>(
          <Link to={{pathname:`/approval/approvalNew/details/${record.approvalRecordDetailGuid}`,state:record}}>{text}</Link>
        )
      },
      {
        title: '状态',
        dataIndex: 'fstate',
        width:100,
        render:(text)=>text?approvalFstateStatus[text]:""
      },
      {
        title: '申请科室',
        dataIndex: 'deptName',
        width:120
      },
      {
        title: '管理科室',
        dataIndex: 'bDeptName',
        width:100,
      },
      {
        title: '申请时间',
        dataIndex: 'createTime',
        width:100,
        render:(text)=>text?text.substr(0,11):""
      }
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
        <RemoteTable
            ref='table'
            onChange={this.changeQueryTable}
            query={this.state.query}
            url={approval.queryApprovalList}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'RN'}
            size="small"
          /> 
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(ApprovalNew));
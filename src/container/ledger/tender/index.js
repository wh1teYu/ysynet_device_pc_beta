/*
 * @Author: yuwei  -招标管理 tender
 * @Date: 2018-07-11 15:42:36 
* @Last Modified time: 2018-07-11 15:42:36 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,Modal} from 'antd';
import TableGrid from '../../../component/tableGrid';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { Link } from 'react-router-dom';
import ledger from '../../../api/ledger';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
import { tenderStatus ,  tenderSelect } from '../../../constants';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
const Confirm = Modal.confirm;

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
    display: 'none',
    manageSelect:[],
  }
  componentDidMount = () => {
    this.getManageSelect();
  }

  getManageSelect = () => {
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"01"}),
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

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.invoiceTime){
        values.invoiceStartTime = moment(values.invoiceTime[0]).format('YYYY-MM-DD');
        values.invoiceEndTime = moment(values.invoiceTime[1]).format('YYYY-MM-DD');
        delete values['invoiceTime']
      }
      this.props.query(values);
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  onSubmit={this.handleSearch}>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="管理部门"
            >
              {getFieldDecorator('bDeptId',{
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
              {getFieldDecorator('releaseFlag',{
                initialValue:""
              })(
                <Select>
                  <Option key="" value="">全部</Option>
                  {
                    tenderSelect.map((item)=>(<Option value={item.value} key={item.value}>{item.text}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign:'left',paddingLeft:15,paddingTop:5}}> 
              <Input placeholder="请输入合同名称/编号" style={{width:180,marginRight:8,}}/>
              <Button type="primary" htmlType="submit">搜索</Button>
          </Col>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class Tender extends Component {
  constructor(props) {
    super(props);
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:{...search[pathname]},
    }
  }
  /* 回显返回条件 */
  async componentDidMount () {
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    console.log(search[pathname])
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
  /* 查询时向redux中插入查询参数 */
  searchTable = (val) => {
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
  //删除合同
  deleteRow = (record) =>{
    Confirm({
      content:'确定要删除该合同吗？',
      onOk:()=>{
        request(ledger.deleteZCTenderInfo,{
          body:queryString.stringify({tenderGuid:record.tenderGuid}),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              this.refs.table.fetch(this.refs.form.getFieldsValue())
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
        this.refs.table.fetch({})
      },
      onCancel:()=>{
        
      }
    })
  }
  render() {
    const columns = [
      {
        title:"序号",
        dataIndex:'index',
        width:40,
        render:(text,record,index)=>`${index+1}`
      },
      {
        title:'状态',
        dataIndex:'releaseFlag',
        width:80,
        render:(text)=>tenderStatus[text]
      },
      {
        title: '招标名称',
        dataIndex: 'tenderName',
        width:120,
        render:(text,record)=>(
          <Link to={{pathname:`/ledger/tender/details/${record.tenderGuid}`,state:record}}>{text}</Link>
        )
      },
      {
        title: '管理科室',
        dataIndex: 'bDeptName',
        width:150
      },
      {
        title: '招标编号',
        dataIndex: 'tenderNo',
        width:100
      },
      {
        title: '供应商名称',
        dataIndex: 'fOrgName',
        width:100,
      },
      {
        title: '发布时间',
        dataIndex: 'createTime',
        width:100,
        render:(text)=>text.substr(0,11)
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width:50,
        render:(text,record)=>
          record.releaseFlag==="01" ? null :
          (
            <a onClick={()=>this.deleteRow(record)}>删除</a>
          )
      },
    ];
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Row style={{padding:'24px 24px 0'}}>
            <Col span={6}>
              <Button type='primary'>
                <Icon type="plus" />
                <Link to={{pathname:`/ledger/tender/add`}} style={{color:'#fff'}}> 新建</Link>
              </Button>
            </Col>
            <SearchFormWapper query={(val)=>this.searchTable(val)} 
            wrappedComponentRef={(form) => this.form = form}></SearchFormWapper>
        </Row>
        <RemoteTable
            ref='table'
            onChange={this.changeQueryTable}
            query={this.state.query}
            url={ledger.selectZCTenderList}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'tenderGuid'}
            style={{padding:'0px 24px'}}
            size="small"
          /> 
         
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(Tender));
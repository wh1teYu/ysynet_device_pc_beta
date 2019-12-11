/*
 * @Author: yuwei  - 科室业务 -  设备采购申请  equipProcurement
 * @Date: 2018-07-11 11:16:20 
* @Last Modified time: 2018-07-11 11:16:20 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,Modal} from 'antd';
import TableGrid from '../../../component/tableGrid';
import { Link , withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import deptwork from '../../../api/deptwork';
import request from '../../../utils/request';
import queryString from 'querystring';
import { equipProcurementStatus } from '../../../constants';
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
    manageSelect:[],
  }
  componentDidMount = () => {
    this.getManageSelect();
  }

  getManageSelect = () => {
    request(deptwork.selectUseDeptList,{
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
      this.props.query(values);
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Col span={6} style={{paddingRight:15}}> 
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
        <Col span={6} style={{textAlign:'left',paddingLeft:15}}> 
            <FormItem style={{display: 'inline-block'}}>
              {getFieldDecorator('searchName',{
                initialValue:""
              })(
                <Input placeholder="请输入产品名称/申请单号" style={{width:190,marginRight:8,}}/>
              )}
            </FormItem>
            <Button type="primary" htmlType="submit"  style={{float:'right'}}>搜索</Button>
        </Col>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class EquipProcurement extends Component {
  
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
      this.form.props.form.setFieldsValue(value)
    }
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
  //删除申请
  deleteRow = (record) =>{
    Confirm({
      content:'确定要删除该申请吗？',
      onOk:()=>{
        request(deptwork.deleteApplyZc,{
          body:JSON.stringify({applyId:record.applyId}),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              let values = this.form.props.form.getFieldsValue();
              this.refs.table.fetch(values);
              message.success('删除成功！');
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      },
      onCancel:()=>{}
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
        title:'管理科室',
        dataIndex:'bDeptName',
        width:80
      },
      {
        title: '申请单号',
        dataIndex: 'applyNo',
        width:120,
        render:(text,record)=>(
          <Link to={{pathname:`/deptWork/equipProcurement/details/${record.applyId}`,state:record}}>{text}</Link>
        )
      },
      {
        title: '状态',
        dataIndex: 'fstate',
        width:150,
        render:(text)=>text?equipProcurementStatus[text]:''
      },
      {
        title: '申请人',
        dataIndex: 'applyUserId',
        width:100,
      },
      {
        title: '申请时间',
        dataIndex: 'createTime',
        width:100,
        render:(text)=>text.substr(0,11)
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width:50,
        render:(text,record)=>record.fstate==="00"?
          (
            <a onClick={()=>this.deleteRow(record)}>删除</a>
          ):null
      },
    ];
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
        <Row>
            <Col span={12}>
              <Button type='primary'>
                <Icon type="plus" />
                <Link to={{pathname:`/deptWork/equipProcurement/add`}} style={{color:'#fff'}}> 新建</Link>
              </Button>
            </Col>
            <SearchFormWapper 
              query={(val)=>this.searchTable(val)} 
              wrappedComponentRef={(form) => this.form = form}
            ></SearchFormWapper>
        </Row>
        <RemoteTable
            ref='table'
            query={this.state.query}
            onChange={this.changeQueryTable}
            url={deptwork.queryApplyZcList}
            scroll={{x: '100%', y : document.body.clientHeight - 311}}
            columns={columns}
            showHeader={true}
            rowKey={'applyId'}
            size="small"
          /> 
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(EquipProcurement));
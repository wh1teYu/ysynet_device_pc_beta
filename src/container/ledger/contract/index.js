/*
 * @Author: yuwei - 合同管理
 * @Date: 2018-07-10 16:45:38 
* @Last Modified time: 2018-07-10 16:45:38 
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
import { contractStatus,  contractSelect } from '../../../constants';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
const Confirm = Modal.confirm;

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

class SearchForm extends Component {

  state={
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    manageSelect:[],
    useSelect:[],//使用科室
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

    //使用科室
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"00"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({useSelect:data.result})
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
  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }
  toggle = () => {
    const { display, expand } = this.state;
    this.props.changeQueryToggle()
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
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
      <Form  onSubmit={this.handleSearch} style={{padding:'12px 24px 6px'}}>
        <Row>
          <Col span={8}> 
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
          <Col span={8}> 
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
                    contractSelect.map((item)=>(<Option value={item.value} key={item.value}>{item.text}</Option>))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="合同编号"
            >
              {getFieldDecorator('contractNo')(
                <Input placeholder='请输入合同编号'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{display: display}}>
            <Col span={8}> 
              <FormItem
                {...formItemLayout}
                label="合同名称"
              >
                {getFieldDecorator('contractName')(
                  <Input placeholder='请输入合同名称'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="资产编号"
              >
                {getFieldDecorator('assetsRecord')(
                  <Input  placeholder='请输入资产编号'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="资产名称"
              >
                {getFieldDecorator('equipmentStandardName')(
                  <Input  placeholder='请输入资产名称'/>
                )}
              </FormItem>
            </Col>
        </Row>
        <Row style={{display: display}}>
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
                placeholder={'请选择申请科室'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                >
                    <Option value="" key={-1}>全部</Option>
                    {
                        this.state.useSelect.map((item,index) => {
                        return <Option key={index} value={item.value}>{item.text}</Option>
                        })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Button type='primary'>
              <Icon type="plus" />
              <Link to={{pathname:`/ledger/contract/add`}} style={{color:'#fff'}}> 新建</Link>
            </Button>
          </Col>
          <Col span={8} offset={8} style={{textAlign:'right',paddingRight:15,paddingTop:5}}>
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

class Contract extends Component {
  
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
  //删除合同
  deleteRow = (record) =>{
    const values = this.form.props.form.getFieldsValue();
    Confirm({
      content:'确定要删除该合同吗？',
      onOk:()=>{
        request(ledger.deleteContract,{
          body:queryString.stringify({contractId:record.contractId}),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              console.log(values);
              this.refs.table.fetch(values)
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      },
      onCancel:()=>{ }
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
        dataIndex:'fstate',
        width:60,
        render:(text)=>text?contractStatus[text]:""
      },
      {
        title: '合同名称',
        dataIndex: 'contractName',
        width:120,
        render:(text,record)=>(
          <Link to={{pathname:`/ledger/contract/details/${record.contractId}`,state:record}}>{text}</Link>
        )
      },
      {
        title: '合同编号',
        dataIndex: 'contractNo',
        width:120
      },
      {
        title: '供应商名称',
        dataIndex: 'fOrgName',
        width:100,
      },
      {
        title: '管理科室',
        dataIndex: 'bDeptName',
        width:100,
      },
      {
        title: '最后编辑时间',
        dataIndex: 'createTime',
        width:80,
        render:(text)=>text.substr(0,11)
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width:50,
        render:(text,record)=> 
        record.fstate==="00" ?
         ( <a onClick={()=>this.deleteRow(record)}>删除</a>): null
      },
    ];
    const { history, search } = this.props;
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    if(search[pathname]&&search[pathname].useFstate){
      columns[2].filteredValue = search[pathname].useFstate;
    }
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <SearchFormWapper 
          query={query=>{this.searchTable(query)}} 
          handleReset={()=>this.handleReset()}
          changeQueryToggle={()=>this.changeQueryToggle()}
          isShow={isShow}
          // ref='form'
          wrappedComponentRef={(form) => this.form = form}>
        </SearchFormWapper>
        <Row style={{padding:'0px 24px 12px'}}>
          
        </Row>
        <RemoteTable
            ref='table'
            onChange={this.changeQueryTable}
            query={this.state.query}
            url={ledger.queryContractList}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'contractId'}
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
}))(Contract));
/*
 * @Author: yuwei - 我的档案-列表页
 * @Date: 2018-06-08 14:51:19 
* @Last Modified time: 2018-06-08 14:51:19 
 */

 import React, { Component }  from 'react'
 import { Layout, DatePicker , Form, Row, Col, Input, Button, Icon, Select ,Tag ,message} from 'antd';
 import TableGrid from '../../../component/tableGrid';
 import { Link , withRouter } from 'react-router-dom';
 import { connect } from 'react-redux';
 import { search } from '../../../service';
 import request from '../../../utils/request';
 import deptwork from '../../../api/deptwork';
 import styles from './style.css';
 import { ledgerData,productTypeData } from '../../../constants';
 import querystring from 'querystring';
 import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
 const { Content } = Layout;
 const FormItem = Form.Item;
 const Option = Select.Option;
 const { RemoteTable } = TableGrid;
 const columns = [
   {
    title: '序号',
    dataIndex: 'index',
    width: 50,
    render:(text,record,index)=>`${index+1}`
   },
   {
     title: '操作',
     dataIndex: 'RN',
     width: 150,
     render: (text, record) => 
       <span>
         <Link to={{pathname: `/deptWork/myProfile/details/${record.assetsRecordGuid}`}}><Icon type="profile" />详情</Link>
         <Link className={styles['ml10']}  to={{pathname: `/deptWork/myProfile/content/${record.assetsRecordGuid}`}}><Icon type="profile" />效益分析</Link>
       </span>  
   },
   {
     title: '资产编号',
     dataIndex: 'assetsRecord',
     width: 200,
     sorter:true
   },
   {
     title: '状态',
     dataIndex: 'useFstate',
     width: 100,
      render: text =>  <Tag color={ledgerData[text].color}> { ledgerData[text].text } </Tag>
   },
   {
     title: '资产名称',
     dataIndex: 'equipmentStandardName',
     width: 200
   },
   {
     title: '规格',
     dataIndex: 'spec',
     width: 100
   },
   {
     title: '资产分类',
     dataIndex: 'productType',
     width: 100,
     render: text => text ?  productTypeData[text].text  : null
   },
   {
     title: '保管员',
     dataIndex: 'custodian',
     width: 150
   },
   {
     title: '管理科室',
     dataIndex: 'bDept',
     width: 100
   },
   {
    title: '使用科室',
    dataIndex: 'useDept',
    width: 100
  }
 ];

 
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

class SearchFormWrapper extends Component {
  state = {
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    manageDeptOptions: [],// 管理科室保存数据
    useDeptOptions: [],// 使用科室保存数据
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
      if(values.buyDate){
        values.buyDateStart=moment(values.buyDate[0]).format('YYYY-MM-DD');
        values.buyDateEnd=moment(values.buyDate[1]).format('YYYY-MM-DD');
        delete values['buyDate'];
      }
      this.props.query(values);
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
    this.props.query({});
  }

  componentWillMount = ()=>{
    this.getManagementOptions();
    this.getUseOptions();
  }
  //管理科室下拉框
  getManagementOptions = () => {
    let options = {
      body:querystring.stringify({"deptType":"01"}),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageDeptOptions:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(deptwork.selectUseDeptList,options)

  }

  //使用科室下拉框
  getUseOptions = () => {
    let options = {
      body:{},
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({useDeptOptions:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(deptwork.queryDeptListByUserId,options)

  }

  render() {
    const { display , manageDeptOptions , useDeptOptions } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      // 转科记录查询部分
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}>
            <FormItem label={`资产编码`} {...formItemLayout}>
              {getFieldDecorator('assetCode', {})(
                <Input placeholder="请输入资产编码" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`资产名称`} {...formItemLayout}>
              {getFieldDecorator('assetName', {})(
                <Input placeholder="请输入资产名称" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`型号`} {...formItemLayout}>
              {getFieldDecorator('fmodel', {})(
                <Input placeholder="请输入型号" style={{width: 200}} />
              )}
            </FormItem>
          </Col>

          <Col span={6} style={{ textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
        <Row>
          <Col span={6} style={{display: display}}>
            <FormItem label={`规格`} {...formItemLayout}>
              {getFieldDecorator('spec')(
                <Input placeholder="请输入规格" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{display: display}}>
            <FormItem label={`管理科室`} {...formItemLayout}>
              {getFieldDecorator('manageDeptGuid',{initialValue:""})(
                <Select style={{width: 200}}>
                  <Option key="" value="">全部</Option>
                  {manageDeptOptions.map(item=><Option value={item.value} key={item.value} >{item.text}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{display: display}}>
            <FormItem label={`使用科室`} {...formItemLayout}>
              {getFieldDecorator('useDeptGuid',{initialValue:""})(
                <Select style={{width: 200}}>
                <Option key="" value="">全部</Option>
                {useDeptOptions.map(item=><Option value={item.value} key={item.value} >{item.text}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="购置日期"
            >
              {getFieldDecorator('buyDate')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper);



 class MyProfile extends Component{
  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      loading: false,
      query:search[pathname]?{...search[pathname]}:{"deptType":"USE"},
      messageError:""
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
      if(search[pathname].buyDateStart&&search[pathname].buyDateEnd){
        value.buyDate=[moment(search[pathname].buyDateStart,'YYYY-MM-DD'),moment(search[pathname].buyDateEnd,'YYYY-MM-DD')]
      }
      this.form.props.form.setFieldsValue(value)
    }
  }
  queryHandler = (query) => {
    /* 存储搜索条件 */
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({"deptType":"USE",...query},{...search[pathname]},)
    setSearch(pathname, values);
    let q = Object.assign({"deptType":"USE"},query)
    this.refs.table.fetch(q);
    this.setState({ query:q })
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
    return (
      <Content className='ysynet-content ysynet-common-bgColor myProfile' style={{padding: 24}}>
          <SearchForm 
            query={this.queryHandler}
            handleReset={()=>this.handleReset()}
            changeQueryToggle={()=>this.changeQueryToggle()}
            isShow={isShow}
            wrappedComponentRef={(form) => this.form = form}
          />
          <RemoteTable
            loading={ this.state.loading}
            onChange={this.changeQueryTable}
            ref='table'
            query={this.state.query}
            url={deptwork.selectAssetsList}
            // scroll={{x: '100%', y : document.body.clientHeight - 311}}
            columns={columns}
            showHeader={true}
            rowKey={'assetsRecordGuid'}
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
}))(MyProfile));
/**
 * 维修记录列表
 */ 
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Form , Popconfirm , Layout , Button , DatePicker , message, Select } from 'antd';
import moment from 'moment';
import { search } from '../../../service';
import TableGrid from '../../../component/tableGrid';
import { Link, withRouter } from 'react-router-dom';
import assets from '../../../api/assets';
import { connect } from 'react-redux';
import { repairCommonDataSource } from '../../../constants'
import { repairRecord } from '../../../service';
import querystring from 'querystring';
import request from '../../../utils/request';
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
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

class SearchFormWrapper extends React.Component {
  state = {
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
    deptSelect:[]
  }
  componentDidMount(){
    let options = {
      body:querystring.stringify({deptType:"00"}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({deptSelect:data.result.rows || data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(assets.selectUseDeptList, options)
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
        values.startTime=moment(values.Time[0]).format('YYYY-MM-DD');
        values.endTime=moment(values.Time[1]).format('YYYY-MM-DD');
        delete values['Time'];
      }
      if(values.createDate){
        values.createDateStart=moment(values.createDate[0]).format('YYYY-MM-DD');
        values.createDateEnd=moment(values.createDate[1]).format('YYYY-MM-DD');
        delete values['createDate'];
      }
      console.log(values)
      this.props.query(values);
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();

  }

  render() {
    const { display , deptSelect } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      // 转科记录查询部分
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}>
            <FormItem label={`资产编号`} {...formItemLayout}>
              {getFieldDecorator('assetsRecord')(
                <Input placeholder="请输入资产编号" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`资产名称`} {...formItemLayout}>
              {getFieldDecorator('equipmentStandardName')(
                <Input placeholder="请输入资产名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`维修单号`} {...formItemLayout}>
              {getFieldDecorator('repairOrderNo')(
                <Input placeholder="请输入维修单号"/>
              )}
            </FormItem>
          </Col>

          <Col span={6} style={{ textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
              {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
        <Row>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="维修时间"
            >
              {getFieldDecorator('Time')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              label="维修总费用"
              {...formItemLayout}
            >
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('actualPriceLeast')(
                    <Input type='number'/>
                  )}
                </FormItem>
              </Col>
              <Col span={2}>
                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  -
                </span>
              </Col>
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('actualPriceMax')(
                    <Input type='number'/>
                  )}
                </FormItem>
              </Col>
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              label="报修科室"
              {...formItemLayout}
            >{/* 机构的使用科室 */}
              {getFieldDecorator('useDeptGuid')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择报修科室"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    deptSelect.map((item,index)=>(
                      <Option key={index} value={item.value}>{item.text}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              label="报修时间"
              {...formItemLayout}
            >
              {getFieldDecorator('createDate')(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              label="维修厂家"
              {...formItemLayout}
            >
              {getFieldDecorator('outOrgName')(
                <Input placeholder='请输入维修厂家'/>
              )}
            </FormItem>
          </Col>
        
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper);


class RepairRecordList extends Component {
  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:search[pathname]?{...search[pathname]}:{menuFstate:"repairRecord"}
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
  /* 查询时向redux中插入查询参数 */
  queryHandler = (query) => {
    this.props.setRepairRecordSearch(['searchCondition'], {
      ...query
    })
    /* 存储搜索条件 */
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...query})
    setSearch(pathname, values);
    this.refs.table.fetch(query);
    this.setState({ query });
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
  confirm = (record) => {
    console.log(record)
    // 90 状态 变为 88 
    const { rrpairOrderGuid } = record;
    request(assets.updateRrpairOrderFstate, {
      body:querystring.stringify({rrpairOrderGuid,orderFstate:"88"}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.refs.table.fetch()
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })

  }
  render() {
    const { search , history } = this.props;
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    // const defaultValue = search[pathname]&&search[pathname].params?search[pathname].params:null;
    let columns = [
      {
        title: '',
        dataIndex: 'RN',
        width: 30,
        render: (text, record, index) => index + 1
      },
      {
        title: '操作',
        dataIndex: 'rrpairOrderGuid',
        width: 120,
        render: (text, record) => {
          return (
            <div>
              <Link to={{pathname: `/repairMgt/repairRecord/${record.rrpairOrderGuid}`}}>
                <Icon type="profile" style={{marginRight: 5}}/>
                详情
              </Link>
              {
                record.orderFstate==="90"?
                <Popconfirm title="确认要执行此操作?" onConfirm={()=>this.confirm(record)}>
                  <a style={{marginLeft: 8}}>作废</a>
                </Popconfirm>
                :null
              }
            </div>
          )
        }
      },
      ...repairCommonDataSource,
      {
        title: '维修员',
        dataIndex: 'inRrpairUsername',
        width: 120
      },
      {
        title: '维修时间',
        dataIndex: 'callTime',
        width: 130
      },
      {
        title: '维修厂家',
        dataIndex: 'outOrgName',
        width: 120
      },
      {
        title: '维修费用',
        dataIndex: 'actualPrice',
        width: 100,
        render:(text)=>Number(text)?Number(text).toFixed(2):''
      },
      
    ];
    // const defaultParams = repairRecord.searchCondition ? repairRecord.searchCondition.params : null;
    if(search[pathname]&&search[pathname].orderFstate&&search[pathname].orderFstate.length){
      columns[3].filteredValue = search[pathname].orderFstate;
    }else{
      columns[3].filteredValue = [];
    }
    return (
        <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
          <SearchForm 
          query={ value =>  this.queryHandler({...value,menuFstate:"repairRecord"}) }
          handleReset={()=>this.handleReset()}
          changeQueryToggle={()=>this.changeQueryToggle()}
          isShow={isShow}
          wrappedComponentRef={(form) => this.form = form}
          ></SearchForm>
          {/*
            <Row>

              <Col span={12}>
                <Search
                  placeholder="请输入维修单号/资产编号/资产名称"
                  enterButton="搜索"
                  defaultValue={ defaultParams }
                />
              </Col>
            </Row>
          */}
          <RemoteTable
            onChange={this.changeQueryTable}
            query={this.state.query}
            ref='table'
            showHeader={true}
            url={assets.selectRrpairList}
            scroll={{x: '150%'}}
            columns={columns}
            rowKey={'RN'}
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
  setRepairRecordSearch: (nestKeys, value) => dispatch(repairRecord.setRepairRecordSearch(nestKeys, value)),
}))(RepairRecordList));
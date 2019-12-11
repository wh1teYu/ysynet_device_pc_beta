/*
 * @Author: yuwei 保养工单
 * @Date: 2018-07-26 11:30:17 
* @Last Modified time: 2018-07-26 11:30:17 
 */
import React from 'react';
import { Row, Col, Input, Button , Form , Icon , DatePicker , Layout , Popover, Select} from 'antd';
import TableGrid from '../../../component/tableGrid';
import assets from '../../../api/assets';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { upkeepState , upkeepMainTainType ,upkeepStateSel , upKeepMode , upKeppModeSelect } from '../../../constants';
import { Link } from 'react-router-dom';
import { timeToStamp } from '../../../utils/tools';
// import './styles.css';
import moment from 'moment';
const { Content } = Layout;
const { Option } = Select;
const { RemoteTable } = TableGrid;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const sortTime = (a,b,key) =>{
  if(a[key] && b[key]){
    return timeToStamp(a[key]) - timeToStamp(b[key])
  }
}
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
let columns=[
  {
    title:'序号',
    dataIndex:"index",
    fixed:'left',
    width: 50,
    render:(text,record,index)=>`${index+1}`
  },
  { title: '操作', 
  dataIndex: 'maintainGuid', 
  fixed:'left',
  key: 'x', 
  width:80,
  render: (text,record) =>
    <span>
      { (record.fstate==="00") ? 
        <span><Link to={{pathname:`/upkeep/upkeepRecord/finish/${record.maintainGuid}`}}>完成</Link></span>
        :<span><Link to={{pathname:`/upkeep/upkeepRecord/details/${record.maintainGuid}`}}>详情</Link></span>
      }
    </span>
  },
  {
    title: '保养单号',
    dataIndex: 'maintainNo',
    width:150,
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  },
  {
    title: '保养单状态',
    dataIndex: 'fstate',
    key: 'fstate',
    width:150,
    filters: upkeepStateSel,
    onFilter: (value, record) => (record && record.fstate===value),
    render: text => 
      <div><span style={{marginRight:5,backgroundColor:upkeepState[text].color ,width:10,height:10,borderRadius:'50%',display:'inline-block'}}></span>
      { upkeepState[text].text }
      </div>
      
  },
  {
    title: '资产名称',
    width:150,
    dataIndex: 'equipmentStandardName',
    render:(text,record) =>
      <Popover  content={
        <div style={{padding:20}}>
          <p>资产名称{record.equipmentStandardName}</p>
          <p>操作员：{record.modifyUserName}</p>
          <p>保养单状态：{upkeepState[record.fstate].text}</p>
        </div>
      }>
        {text}
      </Popover>
  },
  {
    title: '资产编号',
    width:150,
    dataIndex: 'assetsRecord'
  },
  {
    title: '保养类型',
    width:150,
    dataIndex: 'maintainType',
    render: text => <span>{upkeepMainTainType[text].text}</span>
  },
  {
    title: '本次计划保养时间',
    width:170,
    dataIndex: 'maintainPlanDate',
    sorter: (a, b) => sortTime(a,b,'maintainPlanDate'),
    render(text, record) {
      return <span title={text}>{text?text.substr(0,11):''}</span>
    }
  },
  {
    title: '保养开始时间',
    width:150,
    dataIndex: 'maintainDate',
    sorter: (a, b) => sortTime(a,b,'maintainDate'),
    render(text, record) {
      return <span title={text}>{text?text.substr(0,11):''}</span>
    }
  },
  {
    title: '保养结束时间',
    width:150,
    dataIndex: 'endMaintainDate',
    sorter: (a, b) => sortTime(a,b,'endMaintainDate'),
    render(text, record) {
      return <span title={text}>{text?text.substr(0,11):''}</span>
    }
  },
  {
    title: '保养计划单号',
    width:150,
    dataIndex: 'maintainPlanNo',
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  },
  {
    title: '下次保养时间',
    width:150,
    dataIndex: 'nextMaintainDate',
    sorter: (a, b) => (sortTime(a,b,'nextMaintainDate')),
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  },
  {
    title: '保养模式',
    dataIndex: 'maintainMode',
    width: 150,
    render:(text,)=>text?upKeepMode[text]:''
  },
  {
    title: '保养执行科室',
    dataIndex: 'executeDeptName',
    width: 150
  },
  {
    title: '操作员',
    width:150,
    dataIndex: 'modifyUserName',
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  }
]

class SearchFormWrapper extends React.Component {
  state = {
    display: this.props.isShow?'block':'none',expand:this.props.isShow,
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
      if(values.PlanTime && values.PlanTime.length){
        values.startPlanTime=moment(values.PlanTime[0]).format('YYYY-MM-DD');
        values.endPlanTime=moment(values.PlanTime[1]).format('YYYY-MM-DD');
        delete values['PlanTime'];
      }
      if(values.UpkeepTime&& values.UpkeepTime.length){
        values.startUpkeepTime=moment(values.UpkeepTime[0]).format('YYYY-MM-DD');
        values.endUpkeepTime=moment(values.UpkeepTime[1]).format('YYYY-MM-DD');
        delete values['UpkeepTime'];
      }
      if(values.UpkeepEndTime&& values.UpkeepEndTime.length){
        values.startUpkeepEndTime=moment(values.UpkeepEndTime[0]).format('YYYY-MM-DD');
        values.endUpkeepEndTime=moment(values.UpkeepEndTime[1]).format('YYYY-MM-DD');
        delete values['UpkeepEndTime'];
      }
      console.log(values)
      values = Object.assign({maintainMenu:"upkeepRecord"},values)
      this.props.query(values);
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
    this.props.query({});
  }

  render() {
    const { display } = this.state;
    const { getFieldDecorator , setFieldsValue } = this.props.form;
    return (
      // 转科记录查询部分
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={6}>
            <FormItem label={`资产编号`} {...formItemLayout}>
              {getFieldDecorator('assetsRecord', {})(
                <Input placeholder="请输入资产编号" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`资产名称`} {...formItemLayout}>
              {getFieldDecorator('equipmentStandardName', {})(
                <Input placeholder="请输入资产名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`保养单号`} {...formItemLayout}>
              {getFieldDecorator('upkeepNo', {})(
                <Input placeholder="请输入保养单号"/>
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
              label="保养开始时间"
            >
              {getFieldDecorator('UpkeepTime')(
                <RangePicker onChange={(dates)=>setFieldsValue({UpkeepTime:dates})}/>
              )}
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="保养结束时间"
            >
              {getFieldDecorator('UpkeepEndTime')(
                <RangePicker onChange={(dates)=>setFieldsValue({UpkeepEndTime:dates})}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="本次计划保养时间"
            >
              {getFieldDecorator('PlanTime')(
                <RangePicker onChange={(dates)=>setFieldsValue({PlanTime:dates})}/>
              )}
            </FormItem>
          </Col>
          <Col span={6}  style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="保养模式"
            >
              {getFieldDecorator('maintainMode',{
                initialValue: ''
              })(
                <Select>
                  <Option value=''>全部</Option>
                  {
                    upKeppModeSelect.map((item,index)=>(
                      <Option value={item.value} key={index}>{item.text}</Option>
                    ))
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
const SearchForm = Form.create()(SearchFormWrapper);

class UpKeepRecord extends React.Component{

    constructor(props) {
      super(props);
      /* 设置redux前置搜索条件 */
      const { search, history } = this.props;
      const pathname = history.location.pathname;
      this.state = {
        query:search[pathname]?{...search[pathname]}:{maintainMenu:"upkeepRecord"}
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
        if(search[pathname].startPlanTime&&search[pathname].endPlanTime){
          value.PlanTime=[moment(search[pathname].startPlanTime,'YYYY-MM-DD'),moment(search[pathname].endPlanTime,'YYYY-MM-DD')]
        }
        if(search[pathname].startUpkeepTime&&search[pathname].endUpkeepTime){
          value.UpkeepTime=[moment(search[pathname].startUpkeepTime,'YYYY-MM-DD'),moment(search[pathname].endUpkeepTime,'YYYY-MM-DD')]
        }
        if(search[pathname].startUpkeepEndTime&&search[pathname].endUpkeepEndTime){
          value.UpkeepEndTime=[moment(search[pathname].startUpkeepEndTime,'YYYY-MM-DD'),moment(search[pathname].endUpkeepEndTime,'YYYY-MM-DD')]
        }
        this.form.props.form.setFieldsValue(value)
      }
    }
    /* 查询时向redux中插入查询参数 */
    queryHandler = (query) => {
      const { setSearch, history ,search } = this.props;
      const pathname = history.location.pathname;
      let values = Object.assign({...query},{...search[pathname]},)
      setSearch(pathname, values);
      this.refs.table.fetch(query);
      this.setState({ query })
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
    handleChange = (pagination, filters, sorter)=>{
    }
    render(){
      const { search , history } = this.props;
      const pathname = history.location.pathname;
      const isShow = search[pathname] ? search[pathname].toggle:false;
      if(search[pathname]&&search[pathname].fstate&&search[pathname].fstate.length){
        columns[2].filteredValue = search[pathname].fstate;
      }else{
        columns[2].filteredValue = [];
      }
      return(
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
              <SearchForm 
              query={(query)=>this.queryHandler(query)}
              handleReset={()=>this.handleReset()}
              changeQueryToggle={()=>this.changeQueryToggle()}
              isShow={isShow}
              wrappedComponentRef={(form) => this.form = form}
              ></SearchForm>
              <RemoteTable
                  ref='table'
                  onChange={this.changeQueryTable}  
                  query={this.state.query}
                  url={assets.selectMaintainOrderList}
                  scroll={{x: '200%', y : document.body.clientHeight - 110 }}
                  columns={columns}
                  rowKey={'maintainGuid'}
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
}))(UpKeepRecord));
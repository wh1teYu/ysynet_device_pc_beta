/*计量查询- 首页 - 列表页*/
import React , { Component } from 'react';
import { Layout, Form, Row, Col, Input, Button, Icon, Select, DatePicker ,} from 'antd';
import tableGrid from '../../../component/tableGrid';
import queryString from 'querystring';
import { Link } from 'react-router-dom';
import {timeToStamp} from '../../../utils/tools';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import moment from 'moment';
import request from '../../../utils/request';
import meterStand from '../../../api/meterStand';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { RemoteTable } = tableGrid

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
    useDeptData: [],   //使用科室保存数据
    mgtDeptData: [],  //管理科室保存数据
  }
  toggle = () => {
    const { display } = this.state;
    this.props.changeQueryToggle()
    this.setState({
      display: display === 'none' ? 'block' : 'none'
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let {detecDate} = values;
      detecDate = detecDate === undefined ? '' : detecDate;
      if(detecDate.length>0) {
        values.startTime = detecDate[0].format('YYYY-MM-DD');
        values.endTime = detecDate[1].format('YYYY-MM-DD');
      }else {
        values.startTime = '';
        values.endTime = '';
      }
      delete values.detecDate;
      this.props.query(values);
    });
 }
  componentDidMount() {
    request(meterStand.selectUseDeptList, {   //使用科室
      bady: queryString.stringify({deptType: "00"}),
      headers: {
        'Content-Type': 'application/json'
      },
      success: (data) => {
        if(data.status) {
          this.setState({ useDeptData: data.result });
        }
      },
      error: (err) => console.log(err)
    });
    request(meterStand.mgtDeptList, {     //管理科室
      headers: {
        'Content-Type': 'application/json'
      },
      success: (data) => {
        if(data.status) {
          this.setState({ mgtDeptData: data.result });
        }
      },
      error: (err) => console.log(err)
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.handleReset();
  }
  render() {
    const { display } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      // 转科记录查询部分
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}>
            <FormItem label={`资产名称`} {...formItemLayout}>
              {getFieldDecorator('assetName', {})(
                <Input placeholder="请输入资产名称" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`资产编号`} {...formItemLayout}>
              {getFieldDecorator('assetsRecord', {})(
                <Input placeholder="请输入资产编号" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}} >
            <FormItem label={`管理科室`} {...formItemLayout}>
              {getFieldDecorator('bDeptId', {})(
              <Select
                showSearch
                onSearch={this.handleChangeMagtDept}
                defaultActiveFirstOption={false}
                allowClear={true}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{width: 200}}
                placeholder={`请搜索选择管理科室`}
              >
                {this.state.mgtDeptData.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}} >
            <FormItem label={`使用科室`} {...formItemLayout}>
              {getFieldDecorator('useDeptId', {})(
              <Select
                showSearch
                onSearch={this.handleChangeUseDept}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear={true}
                style={{width: 200}}
                placeholder={`请搜索选择转出科室`}
              >
                {this.state.useDeptData.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`检定日期`} {...formItemLayout}>
              {getFieldDecorator('detecDate', {})(
                <RangePicker style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`检测结果`} {...formItemLayout}>
              {getFieldDecorator('results', {
                initialValue:""
              })(
              <Select style={{width: 200}}
              >
                <Option value="" key="">全部</Option>
                <Option value="00" key="00">合格</Option>
                <Option value="01" key="01">不合格</Option>
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right', marginTop: 4, float: 'right'}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {this.state.display === 'block' ? '收起' : '展开'} <Icon type={this.state.display === 'block' ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchForm = Form.create()(SearchFormWrapper);


class MeterQuery extends Component{

  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:search[pathname]?{...search[pathname]}:'',
      selectedRowKeys:[],//勾选数据的条数
      selectedRows:[],//勾选数据的具体信息
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
        value.detecDate=[moment(search[pathname].startTime,'YYYY-MM-DD'),moment(search[pathname].endTime,'YYYY-MM-DD')]
      }
      this.form.props.form.setFieldsValue(value)
    }
  }
  queryHandle = (query) => {
    for (const key in query) {
      query[key] = query[key] === undefined? '' : query[key];
    };
    this.setState({ query }, ()=>{ this.refs.table.fetch() });
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...query})
    setSearch(pathname, values);
    
  }

  nextMeasureDate = (a, b) => {
    return timeToStamp(a.nextMeasureDate) - timeToStamp(b.nextMeasureDate);
  }

  sortTime = (a, b) => {
    return timeToStamp(a.measureDate) - timeToStamp(b.measureDate);
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
    const columns = [
      {
        title: '计量检测编号',
        width: 200,
        dataIndex: 'recordNo',
        render: (text, record) => <Link to={{ pathname: `/meterMgt/meterQuery/details/${record.recordInfoGuid}` }}>{text}</Link>
      },
      {
        title: '资产名称',
        dataIndex: 'equipmentName',
        width: 120,
      },
      {
        title: '资产编号',
        dataIndex: 'assetsRecord',
        width: 200
      },
      {
        title: '型号',
        dataIndex: 'fmodel',
        width: 120,
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 120,
      },
      {
        title: '使用科室',
        dataIndex: 'useDeptName',
        width: 120,
      },
      {
        title: '检测日期',
        dataIndex: 'measureDate',
        width: 200,
        sorter: (a, b) => this.sortTime(a,b)
      },
      {
        title: '下次待检日期',
        dataIndex: 'nextMeasureDate',
        width: 200,
        sorter: (a, b) => this.nextMeasureDate(a,b)
      },
      {
        // --状态 00合格 01不合格
        title: '检测结果',
        dataIndex: 'results',
        width:120,
        render: (text, record, index) => {
          if (record.results === "00") {
            return <span>合格</span>;
          } else if (record.results === "01") {
            return <span>不合格</span>;
          }
        }
      }
    ]
    const { query } = this.state;
    const { search , history } = this.props;
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    return(
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <SearchForm 
          query={this.queryHandle} 
          handleReset={()=>this.handleReset()}
          changeQueryToggle={()=>this.changeQueryToggle()}
          isShow={isShow}
          wrappedComponentRef={(form) => this.form = form}
        />
        <RemoteTable
          query={query}
          onChange={this.changeQueryTable}
          showHeader={true}
          ref='table'
          url={meterStand.meterRecordInfoList}
          pagination={{
            size: 'small',
            showTotal: (total, range) => `总共${total}个项目`
          }}
          scroll={{x: '120%'}}
          columns={columns}
          size="small"
          rowKey={'RN'}
          style={{marginTop: 10}}
        />
      </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(MeterQuery));

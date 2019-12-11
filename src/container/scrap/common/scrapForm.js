/**
 * @file 资产报废 - 公用表单
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import { Layout, Form, Row, Col, Button, Input, Icon, Select, DatePicker } from 'antd';
import TableGrid from '../../../component/tableGrid';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import moment from 'moment';
import { scrapListUrl, queryScrapList } from '../../../api/scrap'
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Content } = Layout;
const FormItem = Form.Item;
const { RemoteTable } = TableGrid;
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

class ScrapForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false, // 控制展开以及显示
      deptOption: [], 
      query: {}
    }
  }
  /* 过滤redux中不需要的数据 */
  async componentDidMount() {
    const { search, form, history } = this.props;
    const pathname = history.location.pathname;
    console.log('this.props',this.props)
    console.log('search',search)
    if (search[pathname]) {
      //找出表单的name 然后set
      let values = form.getFieldsValue();
      values = Object.getOwnPropertyNames(values);
      let value = {};
      values.map(keyItem => {
        value[keyItem] = search[pathname][keyItem];
        return keyItem;
      });
      form.setFieldsValue(value)
    }
    const data = await queryScrapList();
    if (data.status) {
      this.setState({
        deptOption: data.result
      })
    }
  }
  /** 查询方法  并往redux中插入查询参数 */
  onSubmit = e => {
    e.preventDefault();
    const { form, setSearch, history ,search } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      values = Object.assign({...values},{...search[history.location.pathname]})
      setSearch(history.location.pathname, values);
      const postData = {
        equipmentStandardName: values.equipmentStandardName,
        useDeptGuid: values.useDeptGuid,
        assetsRecord: values.assetsRecord,
        scrapNo:values.scrapNo
      }
      if (values.date && values.date.length) {
        postData.startDate = moment(values.date[0]).format('YYYY-MM-DD');
        postData.endDate = moment(values.date[1]).format('YYYY-MM-DD');
      }
      this.refs.table.fetch({
        ...postData
      })
    });
  }
  /* 重置时清空redux */
  handleReset = ()=>{
    this.props.form.resetFields();
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
    const { getFieldDecorator } = this.props.form;
    const { deptOption } = this.state;
    let { columns, defaultParams, search, history } = this.props; 
    const pathname = history.location.pathname;
    const isShow = search[pathname] ? search[pathname].toggle:false;
    columns[2].filteredValue = search[pathname]&&search[pathname].fstate&&search[pathname].fstate.length?search[pathname].fstate:[];
    console.log(columns)
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <Form style={{padding: 8, background: '#fff'}} onSubmit={this.onSubmit}>
          <Row>
            <Col span={8}>
              <FormItem label={`资产编码`} {...formItemLayout}>
                {getFieldDecorator(`assetsRecord`)(
                  <Input style={{width: 250}}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`资产名称`} {...formItemLayout}>
                {getFieldDecorator(`equipmentStandardName`)(
                  <Input style={{width: 250}}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <Button type='primary' htmlType='submit'>查询</Button>
              <Button style={{marginLeft: 5, marginRight: 25}}
                onClick={() => this.handleReset()}
              >重置</Button>
              <a style={{userSelect: 'none'}} onClick={() => this.changeQueryToggle()}><Icon type={isShow ? 'up' : 'down'}/> { isShow ? '收起' : '展开' } </a>
            </Col>
          </Row>
          <Row style={{display: isShow ? 'block' : 'none'}}>  
            <Col span={8}>
              <FormItem label={`单号查询`} {...formItemLayout}>
                {getFieldDecorator(`scrapNo`)(
                  <Input placeholder='请输入单号' style={{width: 250}}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`使用科室`} {...formItemLayout}>
                {getFieldDecorator(`useDeptGuid`)(
                    <Select
                      allowClear
                      showSearch
                      style={{ width: 200 }}
                      placeholder="选择科室"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                    {
                      deptOption.map((item, index) => (
                        <Option value={item.value} key={index}>{ item.text }</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`申请时间`} {...formItemLayout}>
                {getFieldDecorator(`date`)(
                  <RangePicker />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Row style={{padding: 8, background: '#fff', marginTop: 4}}>
          <RemoteTable
            onChange={this.changeQueryTable}
            query={{...search[pathname]}}  
            url={this.props.defaultParams ? `${scrapListUrl}?${defaultParams}` : scrapListUrl}
            columns={columns}
            rowKey={'scrapGuid'}
            showHeader={true}
            size="small"
            scroll={{x: '140%'}}
            ref='table'
          /> 
        </Row>
      </Content>    
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(Form.create()(ScrapForm)));
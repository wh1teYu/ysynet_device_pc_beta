/*
 * @Author: yuwei  收入统计
 * @Date: 2019-06-12 15:31:02 
 * @Last Modified by: yuwei
 * @Last Modified time: 2019-06-19 17:48:07
 */
import React , { Component } from 'react'
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,DatePicker} from 'antd';
import TableGrid from '../../../component/tableGrid';
import benefitAnalysis from '../../../api/benefitAnalysis';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
const columns = [
  {
    title:'序号',
    dataIndex:'RN',
    width: 80,
  },{
    title: '资产编码',
    dataIndex: 'assetsRecord',
    width: 200,
  },{
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width: 200
  },{
    title: '型号',
    dataIndex: 'fmodel',
    width: 100
  },{
    title: '规格',
    dataIndex: 'spec',
    width: 100
  },{
    title: '使用科室',
    dataIndex: 'useDeptName',
    width: 100,
  },{
    title: '收费单价',
    dataIndex: 'avgChargePrice',
    width: 100,
    align:'right',
    render:(text)=>(text-0).toFixed(2)
  },{
    title: '使用次数',
    dataIndex: 'useNum',
    width: 100
  },{
    title: '金额',
    dataIndex: 'chargePrice',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  }
];
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
const { RangePicker } = DatePicker;
class SearchForm extends Component {
  state={
    display: 'none',
    outDeptOptions: []
  }
  componentDidMount = () => {
    this.outDeptSelect();
  }

  outDeptSelect = () => {
    request(benefitAnalysis.selectUseDeptList,{
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
    const { display, expand } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({
      chooseTime:[moment().subtract(31, 'days'),moment(new Date())]
    });
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
              label="资产编号"
            >
              {getFieldDecorator('assetsRecord')(
                <Input placeholder='请输入资产编号'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="资产名称"
            >
              {getFieldDecorator('equipmentStandardName')(
                <Input placeholder='请输入资产名称'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('fmodel')(
                <Input  placeholder='请输入型号'/>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign:'right', paddingTop:5}}> 
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
              label="规格"
            >
              {getFieldDecorator('spec')(
                <Input  placeholder='请输入规格'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label='选择时间'>
              {
                getFieldDecorator('chooseTime',{
                  initialValue:[ moment().subtract(31, 'days'), moment(new Date())]
                })(
                  <RangePicker/>
                )
              }
            </FormItem>
          </Col>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="使用科室"
            >
              {getFieldDecorator('useDeptId',{
                initialValue:""
              })(
                <Select 
                showSearch
                placeholder={'请选择'}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
const SearchFormWapper = Form.create()(SearchForm);

class IncomeCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{
        startTime: moment().subtract(31, 'days').format('YYYY-MM-DD'),
        endTime: moment(new Date()).format('YYYY-MM-DD'),
      },
      pagePrice:0,sumPrice:0,
      selectedRowKey:[],
      selectedRow:[],
      modalVisible:false
    }
  }
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query })
  }
  query = (val) => {
    if (val.chooseTime && val.chooseTime.length){
      const [startTime,endTime] = val.chooseTime;
      val.startTime = moment(startTime).format('YYYY-MM-DD')
      val.endTime = moment(endTime).format('YYYY-MM-DD')
      delete val['chooseTime']
    }
    // this.refs.table.fetch(val)
    this.setState({
      query:val
    })
  }

  export = () => {
    const { query }= this.state;
    window.open(`${benefitAnalysis.exportBenefitIncomeSum}?`+ queryString.stringify({...query}))
  }

  render() {
    const { selectedRowKey, pagePrice,sumPrice } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
          <SearchFormWapper query={query=>{this.query(query)}} ref='form'/>
          <Row>
            <Button type='primary' onClick={this.export}>导出</Button>
          </Row>
          <RemoteTable
            loading={ this.state.loading}
            ref='table'
            query={this.state.query}
            url={benefitAnalysis.selectBenefitIncomeSum}
            isList={true}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'runGuid'}
            style={{marginTop: 10}}
            size="small"
            callback={(data)=>{
                if (data.status) {
                  const { extra: { pagePrice,sumPrice } }  = data.result;
                  this.setState({pagePrice,sumPrice})
                }
              }
            }
            footer={()=>{
              return <React.Fragment>
                <Row>
                  <Col span={6}>当页合计金额:{pagePrice.toFixed(2)}</Col>
                  <Col span={6}>全部合计金额:{sumPrice.toFixed(2)}</Col>
                </Row>
              </React.Fragment>
            }}
            rowSelection= {{
              selectedRowKey:selectedRowKey,
              onChange:(selectedRowKey, selectedRow)=>{
                this.setState({selectedRowKey, selectedRow})
              }
            }}
          />  
      </Content>
    )
  }
}

export default IncomeCount;
 
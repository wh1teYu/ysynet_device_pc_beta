/*
 * @Author: yuwei - 借用记录 - borrowRecord
 * @Date: 2018-06-30 14:23:28 
* @Last Modified time: 2018-06-30 14:23:28 
 */
import React , { Component } from 'react'
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,DatePicker} from 'antd';
import TableGrid from '../../../component/tableGrid';
import ledgerBorrow from '../../../api/ledgerBorrow';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { RemoteTable } = TableGrid;
const borrowFstateStatus ={
  "00":"已借出",
  "01":"已归还" 
}
const columns = [
  {
    title:'序号',
    dataIndex:'index',
    width: 40,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width: 200
  },
  {
    title: '型号',
    dataIndex: 'fmodel',
    width: 100
  },
  {
    title: '规格',
    dataIndex: 'spec',
    width: 100
  },
  {
    title: '申请科室',
    dataIndex: 'deptName',
    width: 100,
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    width: 150
  },
  {
    title: '预计归还时间',
    dataIndex: 'estimateBack',
    width: 120
  },
  {
    title: '实际归还时间',
    dataIndex: 'actualBack',
    width: 120
  },
  {
    title: '归还状态',
    dataIndex: 'borrowFstate',
    width: 100,
    render:(text,record)=>borrowFstateStatus[text]
  },
  {
    title: '借用单号',
    dataIndex: 'borrowNo',
    width: 100
  },
  {
    title: '借用金额',
    dataIndex: 'borrowPrice',
    width: 100
  },
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

class SearchForm extends Component {
  state={
    display: 'none',
    outDeptOptions: []
  }
  componentDidMount = () => {
    this.outDeptSelect();
  }

  outDeptSelect = () => {
    request(ledgerBorrow.selectUseDeptList,{
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
      if(values.CreateDate){
        const [loanStartTime,loanEndTime]=values.CreateDate;
        values.loanStartTime = moment(loanStartTime).format('YYYY-MM-DD');
        values.loanEndTime = moment(loanEndTime).format('YYYY-MM-DD');
        delete values.CreateDate;
      }
      this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
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
              label="资产名称"
            >
              {getFieldDecorator('equipmentStandardName')(
                <Input placeholder='请输入资产名称'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
              <FormItem label={`资产编码`} {...formItemLayout}>
                  {getFieldDecorator(`assetsRecord`)(
                      <Input placeholder="请输入资产编码" />
                  )}
              </FormItem>
          </Col>
          <Col span={6}> 
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
          <Col span={6} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="申请时间"
            >
              {getFieldDecorator('CreateDate')(
                <RangePicker allowClear={false}></RangePicker>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign:'right', paddingTop:5,float: 'right'}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8,}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
          <Col span={6} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="借用单号"
            >
              {getFieldDecorator('borrowNo')(
                <Input  placeholder='请输入借用单号'/>
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{display: display}}> 
            <FormItem
              {...formItemLayout}
              label="归还状态"
            >
              {getFieldDecorator('borrowFstate',{initialValue:''})(
                <Select>
                  <Option key="" value="">全部</Option>
                  <Option key="00" value="00">已借出</Option>
                  <Option key="01" value="01">已归还 </Option>
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

class BorrowRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{borrowType:"01"},
      messageError:"",
      tableRecords:0
    }
  }
  queryHandler = (query) => {
    let q = Object.assign({borrowType:"01"},query);//"deptType":"MANAGEMENT"
    this.refs.table.fetch(q);
    this.setState({ q })
  }
  query = (val) => {
    this.refs.table.fetch({...val,borrowType:"01"})
  }
  render() {
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
          <SearchFormWapper query={query=>{this.query(query)}} ref='form'/>
          <RemoteTable
            loading={ this.state.loading}
            ref='table'
            query={this.state.query}
            url={ledgerBorrow.findBorrowRecordList}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'RN'}
            // style={{marginTop: 10}}
            size="small"
          /> 
        </Content>
    )
  }
}

export default BorrowRecord ;
 
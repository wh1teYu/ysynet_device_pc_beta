/*
 * @Author: yuwei -收入数据导入
 * @Date: 2018-06-26 11:55:11 
* @Last Modified time: 2018-06-26 11:55:11 
 */
import React , { Component } from 'react'
import { Row,Col,Input,Icon, Layout,Upload,Button,message,Alert, Form,Select} from 'antd';
import TableGrid from '../../../component/tableGrid';
import benefitAnalysis from '../../../api/benefitAnalysis';
import request from '../../../utils/request';
import queryString from 'querystring';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = TableGrid;
const columns = [
  {
    title:'数据日期',
    dataIndex:'dataTime',
    width: 200,
  },
  {
    title: '资产编码',
    dataIndex: 'assetsRecord',
    width: 200,
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
    title: '医疗收入',
    dataIndex: 'medicalIncome',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  },
  {
    title: '材料收入',
    dataIndex: 'materialIncome',
    width: 150,
    render:(text)=>(text-0).toFixed(2)
  },
  {
    title: '收费单价（次）',
    dataIndex: 'chargePrice',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  }
];
const messageInfo = "添加大量的信息，建议使用导入功能。导入前请先下载Excel格式模版文件。";
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
            <FormItem
              {...formItemLayout}
              label="型号"
            >
              {getFieldDecorator('fmodel')(
                <Input  placeholder='请输入型号'/>
              )}
            </FormItem>
          </Col>
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
          <Col span={6} style={{textAlign:'right', paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
        <Row style={{display: display}}>
          <Col span={6}> 
            <FormItem
              {...formItemLayout}
              label="使用科室"
            >
              {getFieldDecorator('useDeptGuid',{
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

class Income extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{},
      messageError:"",
      tableRecords:0
    }
  }
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query})
  }
  query = (val) => {
    this.refs.table.fetch(val)
  }
  render() {
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
         <Alert message={messageInfo} type="warning" showIcon closeText="关闭" />
         {
            this.state.messageError === "" ? null
            :
            <Alert style={{marginTop : 10}} message="错误提示"  type="error" description={<div dangerouslySetInnerHTML={{__html:this.state.messageError}}></div>} showIcon closeText="关闭" />
          }
          <SearchFormWapper query={query=>{this.query(query)}} ref='form'/>
          <Row style={{marginTop : 10,textAlign:'right'}}>
            <Col span={24} >
              <a target='_blank' href={benefitAnalysis.incomeFile} style={{marginRight:15}} >下载导入模板</a>
              <Upload
                action={benefitAnalysis.importBenefitIncomeList}
                showUploadList={false}
                withCredentials={true}
                beforeUpload={()=>this.setState({loading: true})}
                onError={(error)=>{
                    this.setState({loading: false})
                    console.log(error)
                }}
                onSuccess={(result)=>{
                  console.log(result,'result')
                    this.setState({loading: false})
                    if(result.status){
                        this.refs.table.fetch();
                        this.setState({
                            messageError:""
                        })
                        message.success("导入成功")
                    }
                    else{
                        this.setState({
                            messageError:result.msg
                        })
                    }
                }}
                >
                <Button style={{ marginRight: 8 }}>
                  <Icon type='export'/> 导入
                </Button>
              </Upload>
            </Col>
          </Row>
          <RemoteTable
            loading={ this.state.loading}
            ref='table'
            query={this.state.query}
            url={benefitAnalysis.selectBenefitIncomeList}
            isList={true}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'RN'}
            style={{marginTop: 10}}
            size="small"
            callback={
              (data)=>{
                this.setState({tableRecords:data.result.records})
              }
            }
          /> 
        </Content>
    )
  }
} 

export default Income ;
 
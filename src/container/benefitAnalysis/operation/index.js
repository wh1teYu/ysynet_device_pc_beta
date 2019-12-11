/*
 * @Author: yuwei - 运行数据导入 - operation
 * @Date: 2018-06-26 11:49:08 
* @Last Modified time: 2018-06-26 11:49:08 
 */
import React , { Component } from 'react'
import { Row,Col,Input,Icon, Layout,Upload,Button,message,Alert, Form,Select,Modal,InputNumber} from 'antd';
import TableGrid from '../../../component/tableGrid';
import benefitAnalysis from '../../../api/benefitAnalysis';
import request from '../../../utils/request';
import queryString from 'querystring';
import {validAmount} from '../../../utils/tools';     //验证方法

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
    title: '开机时长（H）',
    dataIndex: 'startupTime',
    width: 100,
  },
  {
    title: '工作时长（H）',
    dataIndex: 'workTime',
    width: 150
  },
  {
    title: '故障时长（H）',
    dataIndex: 'faultTime',
    width: 100
  },
  {
    title: '使用次数',
    dataIndex: 'useTime',
    width: 100
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

class OperationData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{"deptType":"MANAGEMENT"},
      messageError:"",
      tableRecords:0,
      selectedRowKey:[],
      selectedRow:[],
      modalVisible:false
    }
  }
  queryHandler = (query) => {
    let q = Object.assign({"deptType":"MANAGEMENT"},query);
    this.refs.table.fetch(q);
    this.setState({ query:q })
  }
  query = (val) => {
    this.refs.table.fetch(val)
    this.setState({query:val})
  }

  //打开编辑弹窗
  edit = () => {
    const { selectedRowKey } = this.state;
    if (!selectedRowKey.length) {
      return message.warn('至少选择一条数据进行操作！')
    }
    this.setState({modalVisible:true})
  }

  //提交编辑数据
  submitEdit = () => {
    let formData = this.props.form.getFieldsValue();
    const { selectedRowKey } = this.state;
    let payload = {...formData,runGuids:selectedRowKey};
    request(benefitAnalysis.updateBenefitRun,{
      body:queryString.stringify(payload),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          message.success('编辑成功！');
          this.props.form.resetFields()
          this.refs.table.fetch(this.state.query);
          this.setState({modalVisible:false,selectedRowKey:[],selectedRow:[]});
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }

  render() {
    const { selectedRowKey, modalVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
         <Alert message={messageInfo} type="warning" showIcon closeText="关闭" />
         {
            this.state.messageError === "" ? null
            :
            <Alert style={{marginTop : 10}} message="错误提示"  type="error" description={<div dangerouslySetInnerHTML={{__html:this.state.messageError}}></div>} showIcon closeText="关闭" />
          }
          <SearchFormWapper query={query=>{this.query(query)}} ref='form'/>
          <Row style={{textAlign:'right'}}>
            <Col span={12} style={{textAlign:'left'}}>
              <Button type='primary' onClick={this.edit}>编辑</Button>
            </Col>
            <Col span={12} style={{textAlign:'right'}}>
              <a target='_blank' href={benefitAnalysis.operationFile} style={{marginRight:15}} >下载导入模板</a>
              <Upload
                action={benefitAnalysis.importBenefitRunList}
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
                <Button>
                  <Icon type='export'/> 导入
                </Button>
              </Upload>
            </Col>
          </Row>
          <RemoteTable
            loading={ this.state.loading}
            ref='table'
            query={this.state.query}
            url={benefitAnalysis.selectBenefitRunList}
            isList={true}
            scroll={{x: '100%'}}
            columns={columns}
            showHeader={true}
            rowKey={'runGuid'}
            style={{marginTop: 10}}
            size="small"
            callback={
              (data)=>{
                this.setState({tableRecords:data.result.records})
              }
            }
            rowSelection= {{
              selectedRowKeys:selectedRowKey,
              onChange:(selectedRowKey, selectedRow)=>{
                this.setState({selectedRowKey, selectedRow})
              }
            }}
          /> 
          <Modal
            title='编辑'
            visible={modalVisible}
            onOk={this.submitEdit}
            onCancel={()=>{
              this.props.form.resetFields();
              this.setState({
                modalVisible:false
              })
            }}
          >
            <Form>
              <Row>
                <Col span={20}>
                  <FormItem {...formItemLayout} label='开机时长'>
                    {
                      getFieldDecorator('startupTime',{
                        rules: [
                          { validator: validAmount }
                        ],
                      })(
                        <InputNumber  style={{width:"100%"}} min={0} max={99999999}/>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={20}>
                <FormItem {...formItemLayout} label='工作时长'>
                  {
                    getFieldDecorator('workTime',{
                      rules: [
                        { validator: validAmount }
                      ],
                    })(
                      <InputNumber  style={{width:"100%"}} min={0} max={99999999}/>
                    )
                  }
                </FormItem>
                </Col>
                <Col span={20}>
                  <FormItem {...formItemLayout} label='故障时长'>
                  {
                    getFieldDecorator('faultTime',{
                      rules: [
                        { validator: validAmount }
                      ],
                    })(
                      <InputNumber  style={{width:"100%"}} min={0} max={99999999}/>
                    )
                  }
                </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Content>
    )
  }
}

export default Form.create()(OperationData) ;
 
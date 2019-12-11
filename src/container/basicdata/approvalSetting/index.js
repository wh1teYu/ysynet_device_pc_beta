/*
 * @Author: yuwei - 审批配置approvalSetting
 * @Date: 2018-07-11 15:05:57 
* @Last Modified time: 2018-07-11 15:05:57 
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout,Button,message,Form,Select,Modal} from 'antd';
import TableGrid from '../../../component/tableGrid';
import { Link } from 'react-router-dom';
import basicdata from '../../../api/basicdata';
import request from '../../../utils/request';
import queryString from 'querystring';
import { approvalStatus } from '../../../constants';
const Confirm = Modal.confirm;
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
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

class SearchForm extends Component {

  state={
    manageSelect:[]
  }
  componentDidMount = () => {
    this.getManageSelect();
  }

  getManageSelect = () => {
    request(basicdata.queryManagerDeptListByUserId,{
      body:queryString.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
          this.props.form.setFieldsValue({bDeptId:data.result[0]?data.result[0].value:''});
          this.props.query({bDeptId:data.result[0]?data.result[0].value:''});
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
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}> 
            <FormItem
              {...formItemLayout}
              label="管理科室"
            >
              {getFieldDecorator('bDeptId',{
                initialValue:''
              })(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
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
              label="步骤名称"
            >
              {getFieldDecorator('approvalName')(
                <Input placeholder='请输入'/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{textAlign:'right', paddingTop:5}}> 
              <Button type="primary" htmlType="submit">搜索</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class ApprovalSetting extends Component {
  state={
    query:{},
    selectedRowKeys:[],//选中的tablekey
  }
  searchTable = (val) => {
    if(this.refs.table){
      this.refs.table.fetch(val)
    }
    this.setState({query:val})
  }
  //删除配置
  deleteRow = (record)=>{
    Confirm({
      content:'确定要删除该配置吗？',
      onOk:()=>{
        request(basicdata.deleteZCApproval,{
          body:queryString.stringify({approvalGuid:record.approvalGuid}),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              let values = this.refs.form.getFieldsValue();
              this.refs.table.fetch(values);
              message.success('删除成功！');
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      },
      onCancel:()=>{}
    })
  }

  //移动
  moveStep = (up)=>{
    const { selectedRowKeys } = this.state;
    if(selectedRowKeys.length>0){
      Confirm({
        content:'确定要执行该操作吗？',
        onOk:()=>{
          request(basicdata.updateZCApprovalSeqNum,{
            body:queryString.stringify({approvalGuid:selectedRowKeys,up}),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
              if(data.status){
                let values = this.refs.form.getFieldsValue();
                this.refs.table.fetch(values);
                message.success('操作成功！');
              }else{
                message.error(data.msg)
              }
            },
            error: err => {console.log(err)}
          })
        },
        onCancel:()=>{}
      })
    }else{
      message.warn('请至少选择一项进行操作!')
    }
  }
  render() {
    const { selectedRowKeys } = this.state;
    const columns = [
      {
        title:"顺序",
        dataIndex:'seqNum',
        width:40
      },
      {
        title:'管理科室',
        dataIndex:'bDeptName',
        width:80
      },
      {
        title: '步骤名称',
        dataIndex: 'approvalName',
        width:120,
        render:(text,record)=>(
          <Link to={{pathname:`/basicdata/approvalSetting/details/${record.approvalGuid}`,state:record}}>{text}</Link>
        )
      },
      {
        title: '指定审批',
        dataIndex: 'approvalP',
        width:100,
        render:(text)=>text?approvalStatus[text]:'',
      },
      {
        title: '审批人',
        dataIndex: 'approvalUserName',
        width:100
      },
      {
        title: '备注',
        dataIndex: 'tfRemark',
        width:100,
      },
      {
        title: '操作',
        dataIndex: 'invoiceDate',
        width:100,
        render:(text,record)=><a onClick={()=>this.deleteRow(record)}>删除</a>
      }
    ];
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{ padding: 24 }}>
        <SearchFormWapper query={(val)=>this.searchTable(val)} ref='form'></SearchFormWapper>
        <Row style={{ marginBottom: 24 }}>
          <Button type='primary'>
            <Icon type="plus" />
            <Link to={{pathname:`/basicdata/approvalSetting/add`}} style={{color:'#fff'}}> 新建</Link>
          </Button>
          {
            (selectedRowKeys.length===1 || selectedRowKeys.length===0)  ?
            (
              <span>
                <Button style={{marginLeft:8}} onClick={()=>this.moveStep('01')}>上移</Button>
                <Button style={{marginLeft:8}} onClick={()=>this.moveStep('02')}>下移</Button>
              </span>
            ):null
          }
        </Row>
        {
          this.state.query.bDeptId?
        
        <RemoteTable
          ref='table'
          query={this.state.query}
          url={basicdata.selectZCApprovalList}
          scroll={{x: '100%' }}
          columns={columns}
          showHeader={true}
          rowKey={'approvalGuid'}
          size="small"
          rowSelection = {{
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRow)=>{
              this.setState({selectedRowKeys})
            },
          }}
        />
        :null
        }
        
      </Content>
    )
  }
}
export default ApprovalSetting;
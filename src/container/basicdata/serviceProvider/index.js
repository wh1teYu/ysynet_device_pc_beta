/**@file
 * 我的服务商 wwb
*/
import React from 'react'
import { Form, Input, Button, Modal, Layout, Row, Col, message  } from 'antd';
import TableGrid from '../../../component/tableGrid';
import basicdata from '../../../api/basicdata';
import request from '../../../utils/request';
import querystring from 'querystring';
const Confirm = Modal.confirm;
const FormItem = Form.Item;
const { Content } = Layout;
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
class SearchForm extends React.Component{

  handleSearch = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values,'values')
      this.props.query(values);
    });
  }
  handleReset = () =>{
    this.props.form.resetFields();
    this.props.query({})
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`机构名称`}>
              {
                getFieldDecorator(`orgName`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`社会信用码`}>
              {
                getFieldDecorator(`orgCode`,{
                  initialValue: ''
                })(
                  <Input placeholder='请输入'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrapperSearchForm = Form.create()(SearchForm);

class ServiceProvider extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      query: {},
      modalQuery: {},
      visible: false,
      loading: false,
      selected: [],
      selectedRows: []
    }
  }
  searchTable = (val) => {
    console.log(val,'val')
    if(this.refs.table){
      this.refs.table.fetch(val)
    }
    this.setState({ query: val })
  }

  deleteRow = (record,index) =>{
    Confirm({
      content:'确定要删除服务商吗?',
      onOk: () =>{
        request(basicdata.deleteServiceInfo,{
          body: querystring.stringify({ serviceId: record.serviceId }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            this.setState({ loading: false });
            if(data.status){
              message.success('删除成功');
              this.refs.table.fetch();
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

  showModal = () =>{
    this.setState({ visible: true });
  }

  searchModalTable = (val) =>{
    console.log(val,'modalVal')
    if(this.refs.modalTable){
      this.refs.modalTable.fetch(val)
    }
    this.setState({ modalQuery: val });
  }

  handleOk = () =>{
    this.setState({ loading: true });
    let { selected } = this.state;
    request(basicdata.insertServiceInfo,{
      body: querystring.stringify({ orgIds: selected }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        this.setState({ loading: false });
        if(data.status){
          message.success('添加成功');
          this.setState({ visible: false, selected: [], selectedRows: [] },() => this.refs.table.fetch());
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  
  render(){
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render:(text,record,index) =>`${index+1}`
      },
      {
        title: '机构名称',
        dataIndex: 'orgName'
      },
      {
        title: '社会信用码',
        dataIndex: 'orgCode'
      },
      {
        title: '企业联系人',
        dataIndex: 'lxr'
      },
      {
        title: '联系电话',
        dataIndex: 'lxdh'
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record, index ) =>{
          return  <a onClick={() => this.deleteRow(record,index)}>移除</a> 
        }
      }
    ];
    const modalColumns = [
      {
        title: '机构名称',
        dataIndex: 'orgName',
        width: 200
      },
      {
        title: '社会信用码',
        dataIndex: 'orgCode',
        width: 168
      },
      {
        title: '企业联系人',
        dataIndex: 'lxr',
        width: 168
      },
      {
        title: '联系电话',
        dataIndex: 'lxdh',
        width: 168
      }
    ]
    const { query, visible } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{ padding: 24 }}>
        <WrapperSearchForm
          ref='searchForm'
          query={(val)=>this.searchTable(val)}
        />
        <div style={{ marginBottom: 16 }}>
          <Button icon='plus' type='primary' onClick={this.showModal}>新增</Button>
        </div>
        <RemoteTable 
          ref='table'
          query={query}
          url={basicdata.selectServiceList}
          scroll={{x: '100%' }}
          columns={columns}
          showHeader={true}
          rowKey={'serviceId'}
          size="small"
        />
        {
          visible
          &&
        <Modal 
          title='选择机构'
          width={1100}
          visible={visible}
          destroyOnClose={true}
          closable={true}
          footer={[
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              确定
            </Button>,
            <Button key="back" onClick={ ()=> this.setState({ visible: false })}>取消</Button>,
          ]}
          onCancel={()=>this.setState({ visible: false })}
        >
          <WrapperSearchForm 
            ref='modalform'
            query={(val)=>this.searchModalTable(val)}
          />
          <RemoteTable
            query={this.state.modalQuery} 
            columns={modalColumns}
            url={basicdata.selectStaticFOrgList}
            ref='modalTable'
            rowKey={'orgId'}
            scroll={{x: '100%' }}
            showHeader={true}
            rowSelection={{
              selectedRowKeys: this.state.selected,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
              }
            }}
          />
        </Modal>
        }
      </Content>
    )
  }
}
export default ServiceProvider 
// Form.create()(ServiceProvider);
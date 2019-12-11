/* 
 * @Author: yuwei  - 借用处理
 * @Date: 2018-09-25 20:44:17 
* @Last Modified time: 2018-09-25 20:44:17 
 */
import React, { Component } from 'react';
import BorrowHandleForm from './searchForm';
import TableGrid from '../../../component/tableGrid';
import ledgerBorrow from '../../../api/ledgerBorrow';
import request from '../../../utils/request';
import queryString from 'querystring';
import { timeToStamp } from '../../../utils/tools';
import { borrowFstate } from '../../../constants';
import {Button, Row, Modal, Layout, Form, DatePicker, Input, message} from 'antd';
// import {Link} from 'react-router-dom';
const { RemoteTable } = TableGrid;
const {Content} = Layout;
const {TextArea} = Input;
const FormItem = Form.Item;
const Confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
      xs: {span: 24},
      sm: {span: 5}
  },
  wrapperCol: {
      xs: {span: 24},
      sm: {span: 19}
  }
}

class BorrowHandle extends Component {

  state = {
    query: {
        borrowType:'02',
        menuFstate:'borrowHandle',
        assetName: '',
        deptGuid: '',
        assetsRecord: '',
        bDeptGuid: '',
        startTime: '',
        endTime: '',
        loanStartTime: '',
        loanEndTime: '',
        borrowFstate: '',
        borrowNo: '',
    },
    selectedRowKeys: [],
    selectedRows: [],
    visible: false,
    okLoading: false,
    dismissVisible:false,
    tfRemark:null
  }
  sortTime = (a, b, key) =>{
      if(a[key] && b[key]){
          return timeToStamp(a[key]) - timeToStamp(b[key])
      }else{
          return false
      }
  }

  //归还
  showModal = () => {
      let {selectedRows} = this.state;

      if(selectedRows.length === 0) {
          message.warning('请选择一条数据', 2);
          return;
      }
      if(this.refs.modalForm) {
          this.refs.modalForm.resetFields();
      };
      this.setState({visible: true});
  }
  setQuery = (query) => {
      this.setState({ query:{...query,borrowType:"02",menuFstate:'borrowHandle',} }, ()=>{ this.refs.table.fetch() })
  }
  handleOk = () => {
      this.refs.modalForm.validateFields((err, values) => {
          if(err) return;
          let {selectedRows} = this.state;
          this.setState({okLoading: true});
          values.actualBack = values.actualBack.format('YYYY-MM-DD HH:mm:ss');
          values.remark = values.remark === undefined? '' : values.remark;
          values.borrowDetailGuids = selectedRows.map( (item) => item.borrowDetailGuid );
          this.giveback(values);
      })
  }
  giveback = (query) => {
      request(ledgerBorrow.updateBorrow, {
            body: queryString.stringify(query),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    this.setState({okLoading: false, visible: false, selectedRowKeys: []}, ()=>{
                        this.refs.table.fetch();
                    });
                    message.success('归还成功');
                }else {
                    message.error(data.msg);
                    this.setState({okLoading: false});
                }
            },
            error: (err) => console.log(err)
          })
  }

  //驳回借出
  dismiss = () =>{
    const { selectedRowKeys } = this.state;
    if(selectedRowKeys.length>0){
        this.setState({dismissVisible:true})
    }else{
        message.warning('请选择一条数据进行操作')
    }
  }
  onSubmitDismiss = () =>{
    const { selectedRowKeys , tfRemark } = this.state;
    if(selectedRowKeys.length>0){
        let postData ={
            fstate:"09",
            borrowDetailGuids:selectedRowKeys,
            tfRemark
        }
        console.log(JSON.stringify(postData))
        request(ledgerBorrow.updateBorrowFstate, {
            body: queryString.stringify(postData),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    this.setState({dismissVisible:false,selectedRowKeys:[],selectedRows:[]}, ()=>{
                        this.refs.table.fetch();
                    });
                    message.success('驳回成功');
                }else {
                    message.error(data.msg);
                }
            },
            error: (err) => console.log(err)
        })
    }else{
        message.warning('请选择一条数据进行操作')
    }
  }

  //同意借出
  agreeBorrow = ()=>{
    const { selectedRowKeys } = this.state;
    if(selectedRowKeys.length>0){
        Confirm({
            content:"确定执行此操作？",
            onOk:()=>{
                let postData ={
                    fstate:"00",
                    borrowDetailGuids:selectedRowKeys
                }
                request(ledgerBorrow.updateBorrowFstate, {
                    body: queryString.stringify(postData),
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    success: (data) => {
                        if(data.status) {
                            this.setState({selectedRowKeys: [],selectedRows:[]}, ()=>{
                                this.refs.table.fetch();
                            });
                            message.success('借出成功');
                        }else {
                            message.error(data.msg);
                        }
                    },
                    error: (err) => console.log(err)
                })
            }
        })

    }else{
        message.warning('请选择一条数据进行操作')
    }

  }
  
  render() {
      let {query, visible, okLoading, selectedRows ,selectedRowKeys, dismissVisible} = this.state;
      const columns = [
          {
              title: '借用单号',
              dataIndex: 'borrowNo'
          },
          {
              title: '资产编号',
              dataIndex: 'assetsRecord'
          },{
              title: '资产名称',
              dataIndex: 'equipmentStandardName'
          },{
              title: '借用人',
              dataIndex: 'borrowUserName'
          },{
              title: '借用科室',
              dataIndex: 'deptName'
          },{
              title: '借用时间',
              dataIndex: 'createTime',
              sorter: (a, b) => this.sortTime(a, b, 'createTime'),
          },{
              title: '预计归还时间',
              dataIndex: 'estimateBack',
              sorter: (a, b) => this.sortTime(a, b, 'estimateBack'),
          },{
              title: '实际归还时间',
              dataIndex: 'actualBack',
              sorter: (a, b) => this.sortTime(a, b, 'actualBack'),
          },{
              title: '借用原因',
              dataIndex: 'borrowCause'
          },{
              title: '费用',
              dataIndex: 'cost'
          },{
              title: '备注',
              dataIndex: 'remark'
          },{
              title: '操作员',
              dataIndex: 'createUserId'
          },{
              title: '单据状态',
              dataIndex: 'borrowFstate',
              render: (text) => text?borrowFstate[text]:text
          },
      ];
      return (
          <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
              <BorrowHandleForm setQuery={this.setQuery} />
              <Row style={{ marginBottom: 50 }}>
                  <Button onClick={this.agreeBorrow} style={{ marginLeft: 8 }} type="primary" >同意借出</Button>
                  <Button onClick={this.dismiss} style={{ marginLeft: 8 }} type="primary" >驳回借出</Button>
                  <Button onClick={this.showModal} style={{ marginLeft: 8 }} type="primary" >归还</Button>
              </Row>
              <RemoteTable
                  ref="table"
                  selectedRows={selectedRows}
                  rowSelection={{
                    selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRowKeys, selectedRows });
                    }
                  }}
                  pagination={{
                      showTotal: (total, range) => `总共${total}个项目`
                  }}
                  query={query}
                  url={ledgerBorrow.BorrowRecordList}
                  scroll={{x: '150%'}}
                  showHeader={true}
                  columns={columns}
                  size="small"
                  rowKey={'borrowDetailGuid'}
              />
              <Modal
                  title="归还"
                  destroyOnClose={true}
                  visible={visible}
                  onOk={this.handleOk}
                  confirmLoading={okLoading}
                  onCancel={ () => {this.setState({ visible: false })} }
              >
                  <Row>
                      <ModalFormWrap
                          ref="modalForm"
                      />
                  </Row>
              </Modal>
              <Modal
                  title="驳回"
                  destroyOnClose={true}
                  visible={dismissVisible}
                  onOk={()=>this.onSubmitDismiss()}
                  onCancel={()=>{this.setState({ dismissVisible: false })} }
                >
                  <FormItem label='驳回原因' {...formItemLayout}>
                    <TextArea placeholder='请输入' onInput={(e)=>this.setState({tfRemark:e.target.value})}/>
                  </FormItem>
              </Modal>
          </Content>
      )
  }
};

class ModalForm extends Component {
  
  render() {
      const {getFieldDecorator} = this.props.form;
      return (
          <Form>
              <Row>
                  <FormItem label={`归还时间`} {...formItemLayout}>
                      {getFieldDecorator('actualBack', {
                          rules: [{
                              required: true,
                              message: '请输入归还时间'
                          }]
                      })(
                          <DatePicker
                              style={{width: '100%'}}
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              placeholder="请输入归还时间"
                          />
                      )}
                  </FormItem>
              </Row>
              <Row>
                  <FormItem label={`备注`} {...formItemLayout}>
                      {getFieldDecorator('remark')(
                          <TextArea rows={4}/>
                      )}
                  </FormItem>
              </Row>
          </Form>
      )
  }
}

const ModalFormWrap = Form.create()(ModalForm)



export default BorrowHandle;
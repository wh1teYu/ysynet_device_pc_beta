/*
 * @Author: yuwei  - 新建招标管理
 * @Date: 2018-07-11 19:14:42 
* @Last Modified time: 2018-07-11 19:14:42 
 */
import React, { Component } from 'react';
import { Row,Col,Input, Layout,Button,message,Form,Select} from 'antd';
import ledger from '../../../api/ledger';
import request from '../../../utils/request';
import queryString from 'querystring';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const formItemLayoutLine = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const formItemLayoutLine2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
class AddTender extends Component {
  state={
    query:{},
    orgList:[],
    manageSelect:[],
    postFile:[],
    editStatus:false,
    editStatusText:'新建招标',
    fillBackData:{}
  }
  componentDidMount = () => {
    console.log('this.props')
    if(this.props.match.params.id){
      console.log('编辑状态')
      this.setState({
        editStatusText:'编辑招标',
        editStatus:true,
      })
      let Guid = this.props.match.params.id;
      request(ledger.selectZCTenderList,{
        body:queryString.stringify({tenderGuid:Guid}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
              this.setState({
                fillBackData:data.result.rows[0]
              })
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })

    }
    this.getManageSelect();
    this.getOrgSelect();
  }

  getManageSelect = () => {
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"01"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  getOrgSelect = () =>{
    request(ledger.getSelectFOrgList,{
      body:queryString.stringify({deptType:"01"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({orgList:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  handleSearch = () =>{

  }

  submit = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        console.log(JSON.stringify(values))

        if(this.props.match.params.id){
          //编辑状态
          values.tenderGuid=this.props.match.params.id;
        }
        request(ledger.insertZCTender,{
          body:JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.warn('保存成功！')
              const { history } = this.props;
              history.push('/ledger/tender')
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    })
  }

  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }
  fetchSelect = (input)=>{
    request(ledger.selectUseDeptList,{
      body:queryString.stringify({deptType:"01",deptName:input}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({manageSelect:data.result})
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { editStatusText , fillBackData } = this.state; //  editStatus 编辑状态 true为编辑  false 为新增
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <h3 style={{padding:'24px'}}>{editStatusText}  
          <Button style={{float:'right'}}>取消</Button>
          <Button type='primary' style={{float:'right',marginRight:8}} onClick={()=>this.submit()}>确认</Button>
        </h3>

        <Form  onSubmit={this.handleSearch}>
            
            <FormItem
              {...formItemLayout}
              label="招标名称"
              >
              {getFieldDecorator('tenderName',{
                initialValue:fillBackData.tenderName || '',
                rules:[{required:true,message:'请选择招标名称'}]
              })(
                <Input />
              )}
            </FormItem>

            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="管理科室"
                >
                  {getFieldDecorator('rStorageGuid',{
                    initialValue:fillBackData.bDeptId || '',
                    rules:[{required:true,message:'请选择管理科室'}]
                  })(
                    <Select 
                      // showSearch
                      // placeholder={'请选择'}
                      // optionFilterProp="children"
                      // filterOption={(input, option)=>this.filterOption(input, option)}
                      onSearch={this.fetchSelect}
                      showSearch
                      placeholder={'请选择'}
                      filterOption={false}
                      >
                          <Option value="" key={-1}>全部</Option>
                          {
                              this.state.manageSelect.map((item,index) => {
                              return <Option key={item.value} value={item.value}>{item.text}</Option>
                              })
                          }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="招标类型"
                >
                  {getFieldDecorator('tenderType',{
                    initialValue:"00",
                    rules:[{required:true,message:'请选择管理科室'}]
                  })(
                    <Select>
                          <Option value="00" key="00">资产设备类</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="招标编号"
                >
                  {getFieldDecorator('tenderNo',{
                    initialValue:fillBackData.tenderNo || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              {getFieldDecorator('fOrgId',{
                initialValue:fillBackData.fOrgId || '',
                rules:[{required:true,message:'请选择供应商'}]
              })(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option)=>this.filterOption(input, option)}
                  >
                      <Option value="" key={-1}>全部</Option>
                      {
                          this.state.orgList.map((item,index) => {
                          return <Option key={item.orgId} value={item.orgId}>{item.orgName}</Option>
                          })
                      }
                </Select>
              )}
            </FormItem>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="供应商库房"
                >
                  {getFieldDecorator('fStorageGuid',{
                    initialValue:"00",
                  })(
                    <Select>
                      <Option key="00" value="00">默认</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="供应商编号"
                >
                  {getFieldDecorator('fOrgNo',{
                    initialValue:fillBackData.fOrgNo || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="联系人"
                >
                  {getFieldDecorator('lxr',{
                    initialValue:fillBackData.lxr || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayoutLine2}
                  label="联系电话"
                  >
                  {getFieldDecorator('lxdh',{
                    initialValue:fillBackData.lxdh || '',
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
        </Form>
      </Content>
    )
  }
}
export default Form.create()(AddTender);
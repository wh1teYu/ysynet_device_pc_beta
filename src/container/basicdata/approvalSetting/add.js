/*
 * @Author: yuwei - 新增审批配置
 * @Date: 2018-07-11 15:07:47 
* @Last Modified time: 2018-07-11 15:07:47 
 */
import React, { Component } from 'react';
import { Row,Col,Input, Layout,Button,message,Form,Select} from 'antd';
import basicdata from '../../../api/basicdata';
import { CommonData } from '../../../utils/tools';
import request from '../../../utils/request';
import queryString from 'querystring';
import { approvalSelect } from '../../../constants';
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
class AddEquipProcurement extends Component {
  state={
    query:{},
    unitList:[],
    manageSelect:[],
    outDeptOptions: [],
    postFile:[],
    editStatus:false,
    editStatusText:'新建审批步骤',
    fillBackData:{},//回填数据
  }
  componentDidMount = () => {
    console.log('this.props')
    if(this.props.match.params.id){
      console.log('编辑状态')
      this.setState({
        editStatusText:'编辑审批步骤',
        editStatus:true,
      })
      request(basicdata.selectZCApprovalList,{
        body:queryString.stringify({approvalGuid:this.props.match.params.id}),
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
    CommonData('UNIT', (data) => {
      this.setState({unitList:data.rows})
    })

    request(basicdata.queryUserListByOrgId,{
      body:queryString.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            userList:data.result
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
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
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  handleSubmit = () =>{
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(this.state.editStatus){//编辑状态
        values = Object.assign(this.state.fillBackData,values);
        delete values['bDeptGuid']
        delete values['RN']
        request(basicdata.insertZCApproval,{
          body:JSON.stringify(values),
          headers: {
              'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.success('保存成功！');
              const {history} = this.props;
              history.push('/basicdata/approvalSetting')
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }else{//新增}
        values.condition="01";
        values.fstate="01";
        values.approvalFlag="01";//审批类型01
        console.log(JSON.stringify(values));
        request(basicdata.insertZCApproval,{
          body:JSON.stringify(values),
          headers: {
              'Content-Type': 'application/json'
          },
          success: data => {
            if(data.status){
              message.success('保存成功！');
              const {history} = this.props;
              history.push('/basicdata/approvalSetting')
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
  goBack = ()=>{
    const { history } = this.props;
    history.push('/basicdata/approvalSetting');
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { editStatusText ,fillBackData , userList , editStatus } = this.state; //  editStatus 编辑状态 true为编辑  false 为新增
    
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <h3 style={{padding:'24px'}}>{editStatusText}  
          <Button style={{float:'right'}} onClick={()=>this.goBack()}>取消</Button>
          <Button type='primary' style={{float:'right',marginRight:8}} onClick={()=>this.handleSubmit()}>确认</Button>
        </h3>
        <Form>
            <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="步骤名称"
                >
                  {getFieldDecorator('approvalName',{
                    initialValue:fillBackData.approvalName|| '',
                    rules:[{required:true,message:'请填写步骤名称'}]
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine2}
                  label="管理科室"
                >
                  {getFieldDecorator('bDeptId',{
                    initialValue:fillBackData.bDeptGuid||'',
                    rules:[{required:true,message:'请选择管理科室'}]
                  })(
                    <Select 
                      disabled={editStatus}
                      showSearch
                      placeholder={'请选择'}
                      optionFilterProp="children"
                      filterOption={(input, option)=>this.filterOption(input, option)}
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
              </Row>
              <Row>
              <Col span={12}> 
                <FormItem
                  {...formItemLayoutLine}
                  label="指定审批"
                >
                  {getFieldDecorator('approvalP',{
                    initialValue:fillBackData.approvalP|| '01',
                    rules:[{required:true,message:'请选择指定审批'}]
                  })(
                    <Select>
                      {
                        approvalSelect.map((item)=><Option key={item.value} value={item.value}>{item.text}</Option>)
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}> 
              {
                this.props.form.getFieldValue('approvalP')==="01"?
              
                <FormItem
                  {...formItemLayoutLine}
                  label="审批人"
                 >
                  {getFieldDecorator('userId',{
                    initialValue:"",
                  })(
                    <Select disabled={true}>
                      <Option key="" value="">指定审批人</Option>
                    </Select>
                  )}
                </FormItem>
                :
                <FormItem
                  {...formItemLayoutLine}
                  label="审批人"
                >
                  {getFieldDecorator('userId',{
                    initialValue:fillBackData.approvalUserId||"",
                    rules:[{required:true,message:'请选择指定审批'}]
                  })(
                    <Select 
                    showSearch
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    onSelect={(input,option)=>this.setState({userName:option.props.children})}
                    >
                      <Option value="" key={-1}>全部</Option>
                      {
                        userList?userList.map((item,index) => {
                          return <Option key={index} value={item.userId}>{item.userName}</Option>
                          })
                        :""
                      }
                    </Select>
                  )}
                </FormItem>
              }
              </Col>
            </Row>
            <FormItem
              {...formItemLayout}
              label="备注"
              >
              {getFieldDecorator('tfRemark',{
                initialValue:fillBackData.tfRemark|| '',
              })(
                <Input.TextArea rows={5} maxLength={200}>
                </Input.TextArea>
              )}
            </FormItem>
        </Form>
      </Content>
    )
  }
}
export default Form.create()(AddEquipProcurement);
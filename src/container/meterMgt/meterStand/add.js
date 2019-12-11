/*计量台账- 添加*/
import React , { Component } from 'react';
import { Layout, Card, Button, Affix, Form, Col, Row, Input,  DatePicker, Radio, Modal, Select, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import meterStand from '../../../api/meterStand';
import tableGrid from '../../../component/tableGrid';           
import queryString from 'querystring';
import {validAmount, validDay} from '../../../utils/tools';     //验证方法
import request from '../../../utils/request';
const Option = Select.Option;
const { Content } = Layout;
const { RemoteTable } = tableGrid;
const FormItem = Form.Item;
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

class AddMeterStand extends Component{
  state ={
    selectUseDeptList: [],    //使用科室列表
    selectMgtDeptList: [],    //管理科室列表
    showAssetModel: false,
    assetsInfo: {},
    query: {
      assetName: '',
      assetsRecord: '',
      fmodel: '',
      spec: '',
      useDeptGuid: '', 
      manageDeptGuid: ''
    }
  }

  Setquery = (query) => {
    for (const key in query) {
      query[key] = query[key] === undefined? '' : query[key];
    };
    this.setState({ query }, () => { this.refs.selectTab.fetch() });
  }

  
  showAssetModel = () => {    
    this.setState({showAssetModel: true});
    if( this.refs.modalForm ) {
      this.refs.modalForm.resetFields();  //清空表单
      let {query} = this.state;
      for (const key in query) {          //重新搜索
        query[key] = '';
      };
      this.setState({ query }, () => { this.refs.selectTab.fetch() });
    };
    request(meterStand.selectUseDeptList,{    //使用科室列表
      body: queryString.stringify({deptType: "00"}),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        let selectUseDeptList = [{text: "全部", value: ""}, ...data.result]
        this.setState({ selectUseDeptList });
      },
      error: (err) => console.log(err)
    });


    request(meterStand.mgtDeptList,{        //管理科室列表
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        let selectMgtDeptList = [{text: "全部", value: ""}, ...data.result]
        this.setState({ selectMgtDeptList });
      },
      error: (err) => console.log(err)
    });
  }
  
  handleCancel = (e) => {
    this.setState({showAssetModel: false});
  }
  save = () => {    //保存添加资产
    let {assetsInfo} = this.state;
    if(!assetsInfo.assetsRecordGuid){
      message.warning('请选择一条资产');
      return;
    }
    this.props.form.validateFields((err,values)=>{
      if(!err){
        values.nextMeasureDate = values.nextMeasureDate.format('YYYY-MM-DD')

        values.remindDays = values.remindDays === undefined? '' : values.remindDays;

        values = {...values, assetsRecordGuid: assetsInfo.assetsRecordGuid}
        request(meterStand.addAssetMeter, {
          body: queryString.stringify(values),
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: (data) => {
            if(data.status) {
              let {history} = this.props;
              history.push('/meterMgt/meterStand');
            }
          },
          error: (err) => console.log(err)
        })
      }
    })
  }
  setAssetInfo = (assetsInfo) => {
    this.setState({ 
      assetsInfo,
      showAssetModel: false
     });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { assetsInfo, query, selectUseDeptList, selectMgtDeptList } = this.state;
    let {productType} = assetsInfo;   //资产分类
    switch (productType) {
      case "01":
        productType = "通用设备";
        break;
      case "02":
        productType = "电气设备";
        break;
      case "03":
        productType = "电子产品及通信设备";
        break;  
      case "04":
        productType = "仪器仪表及其他";
        break;
      case "05":
        productType = "专业设备";
        break;
      case "06":
        productType = "其他";
        break;
      default: 
        productType = "其他";
    }
    const columns = [
      {
        title: '操作',
        dataIndex: 'handle',
        width: 50,
        render: (text, record) => {
          return <span><a onClick={ ()=>{ this.setAssetInfo(record) } }>添加</a></span>
        }
      },
      {
        title: '资产编号',
        dataIndex: 'assetsRecord',
        width: 120
      },
      {
        title: '资产名称',
        dataIndex: 'equipmentName',
        width:120,
      },
      {
        title: '型号',
        dataIndex: 'fmodel',
        width:120,
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width:120,
      },
      {
        title: '管理科室',
        dataIndex: 'bDeptGuidName',
        width: 120
      },
      {
        title: '使用科室',
        dataIndex: 'useDeptName',
        width: 120
      }
    ]
    return(
      <Content className='ysynet-content'>
      {/* 保存申请信息按钮部分 */}
      <Affix>
        <div style={{background: '#fff', padding: '10px 20px', marginBottom: 4, display: 'flex', alignContent: 'center', justifyContent: 'flex-end'}}>
        <Button type="primary"><Link to={{pathname:`/meterMgt/meterStand/`}}>取消</Link></Button>
        <Button type="primary" onClick={this.save} style={{marginLeft:8}}>保存</Button>
        </div>
      </Affix>
      {/* 资产信息部分 */}
      <Card title="资产信息" bordered={false} className="min_card">
          <Row>
          <Col span={8} >
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-11">
                  <Button type="primary" onClick={this.showAssetModel}>选择资产</Button>
                  <Modal
                    width={1000}
                    style={{ top: 10 }}
                    title="添加资产"
                    visible={this.state.showAssetModel}
                    onCancel={this.handleCancel}
                    footer={null}
                    afterClose={()=>{ console.log(this.refs.modalForm) }}
                  >
                    <Row>
                      <SelectAssetFormWrapper 
                        ref = "modalForm"
                        Setquery={ this.Setquery }
                        selectUseDeptList = {selectUseDeptList}
                        selectMgtDeptList = {selectMgtDeptList}
                      />
                    </Row>
                    <RemoteTable
                      ref="selectTab"
                      url={meterStand.selectAssetsList}
                      columns={ columns }
                      showHeader={ true }
                      bordered={ true }
                      pagination={{
                        showTotal: (total) => `总共${total}个项目`
                      }}
                      rowKey={'RN'}
                      query={query}
                      size="small"
                    />
                  </Modal>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>资产编号</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {assetsInfo.assetsRecord || ''}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>资产名称</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                    {assetsInfo.equipmentName || ''}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>型号</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                    {assetsInfo.fmodel || ''}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>规格</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {assetsInfo.spec || ''}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>资产类别</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {productType || ''}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>

            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>使用科室</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {assetsInfo.useDeptName || ''}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>保管员</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {assetsInfo.custodian || ''}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>管理科室</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {assetsInfo.bDeptGuidName || ''}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row ant-form-item">
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                  <label>原值</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                  <div className="ant-form-item-control">
                  {assetsInfo.originalValue || ''}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
      </Card>
      {/* 资产信息部分 */}
      <Card title="检测信息" bordered={false} style={{marginTop: 4}} className="min_card">     
        <Form ref='checkForm'>
          <Row>
            <Col span={8}>
              <FormItem  {...formItemLayout} label='检定方式'>
                {getFieldDecorator('type', {
                  initialValue:"00"
                })(
                  <Radio.Group>
                    <Radio value="00">内检</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='计量周期'>
                {getFieldDecorator('measureCycly', {
                  rules: [
                    { required: true, message: '请填写计量周期!' },
                    { validator: validAmount }
                  ],
                })(
                  <Input placeholder="请输入计量周期" addonAfter='月' style={{width:200}}/>
                )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem {...formItemLayout} label='下次待检日期'>
              {getFieldDecorator('nextMeasureDate',{
                initialValue:null,
                rules:[{
                  required:true,message:"请选择下次待检日期!"
                }]
              })(
                <DatePicker format={'YYYY-MM-DD'} style={{width:200}}/>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label='提前提醒天数'>
                {getFieldDecorator('remindDays', {
                  reles: [{
                    validator: validDay 
                  }]
                })(
                  <Input placeholder="请输入提醒天数" addonAfter='天' style={{width:200}}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
  </Content>  
    )
  }
}

class SelectAssetForm extends Component{
  state = {
    display: 'none'
  }
  toggle = () => {
    const { display } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.Setquery(values);
    });
 }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
    const { display } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={8}>
            <FormItem label={`资产名称`} {...formItemLayout}>
              {getFieldDecorator('assetName', {})(
                <Input placeholder="请输入资产名称" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`资产编号`} {...formItemLayout}>
              {getFieldDecorator('assetsRecord', {})(
                <Input placeholder="请输入资产编号" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}} >
            <FormItem label={`型号`} {...formItemLayout}>
              {getFieldDecorator('fmodel', {})(
                <Input placeholder="请输入型号" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}} >
            <FormItem label={`规格`} {...formItemLayout}>
              {getFieldDecorator('spec', {})(
                <Input placeholder="请输入规格" style={{width: 200}} />
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}} >
            <FormItem label={`使用科室`} {...formItemLayout}>
              {getFieldDecorator('useDeptGuid', {})(
              <Select
                showSearch
                allowClear={true}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{width: 200}}
                placeholder={`请搜索选择使用科室`}
              >
                {this.props.selectUseDeptList.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>)}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}  style={{display: display}} >
            <FormItem label={`管理科室`} {...formItemLayout}>
              {getFieldDecorator('manageDeptGuid', {})(
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear={true}
                style={{width: 200}}
                placeholder={`请搜索选择管理科室`}
              >
                {this.props.selectMgtDeptList.map( d => <Option value={d.value} key={d.value}>{d.text}</Option> )}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right', marginBottom: 10, float: 'right'}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 30, fontSize: 14}} onClick={this.toggle}>
              {this.state.display === 'block'  ? '收起' : '展开'} <Icon type={this.state.display === 'block' ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}

const SelectAssetFormWrapper = Form.create()(SelectAssetForm);


export default Form.create()(AddMeterStand) ; 
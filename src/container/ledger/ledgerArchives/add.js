/**
 * @file 资产档案 - 新增档案详情
 * @since 2018-04-19
 */
import React, { PureComponent } from 'react';
import { Layout, Card, Affix, Button, Row, Col, Form, Input, Select, DatePicker, message, Modal } from 'antd';
import request from '../../../utils/request';
import querystring from 'querystring';
import transfer from '../../../api/transfer';
import ledger ,{ selectStaticDataListMeteringUnit } from '../../../api/ledger';
import tableGrid from '../../../component/tableGrid';
import moment from 'moment';
import _ from 'lodash';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { RemoteTable } = tableGrid
// 表单布局样式
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
// 选择设备弹框里面的搜索表单
class SelectEquipment extends PureComponent {
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.query(values);
    });
 }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      // 转科记录查询部分
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={12}>
            <FormItem label={`证件号`} {...formItemLayout}>
              {getFieldDecorator('registerNo')(
                <Input placeholder="请输入证件号" style={{width: 220}} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={`品牌`} {...formItemLayout}>
              {getFieldDecorator('tfBrand')(
                <Input placeholder="请输入品牌" style={{width: 220}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label={`设备名称`} {...formItemLayout}>
              {getFieldDecorator('equipmentName')(
                <Input placeholder="请输入设备名称" style={{width: 220}} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={`型号`} {...formItemLayout}>
              {getFieldDecorator('fmodel')(
                <Input placeholder="请输入型号" style={{width: 220}} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label={`规格`} {...formItemLayout}>
              {getFieldDecorator('spec')(
                <Input placeholder="请输入规格" style={{width: 220}} />
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{ textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 30}} onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SelectEquipmentModal = Form.create()(SelectEquipment);
// 新增字典弹框新增表单
class NewAddDictionary extends PureComponent {
  state={
    optionsTfBrand: [],//品牌
    optionsMeteringUnit: [],//计量单位
    callbackData: {}
  }
  async componentDidMount() {
    // 计量单位
    const dataMeteringUnitList = await selectStaticDataListMeteringUnit();
    if (dataMeteringUnitList.status && dataMeteringUnitList.result) {
      this.setState({ optionsMeteringUnit: dataMeteringUnitList.result.rows })
    }
  }
  componentWillMount =()=>{
		this.getTfBrand();//品牌下拉框数据
  }
  // 1品牌调接口并且给数据
  getTfBrand = (value) =>{
		let o;
		if (value) {
			o={code: 'TF_BRAND', name: value};
    } else {
      o={code: 'TF_BRAND'};
    }
		let options = {
			body:querystring.stringify(o),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: data => {
				if(data.status){
					this.setState({
						optionsTfBrand: data.result.rows
					})
				}else{
					message.error(data.msg)
				}
			},
			error: err => {console.log(err)}
		}
		request(ledger.selectStaticDataListTfBrand, options);
  }
  // 2.品牌下拉数据
  getOptions = (selData)=>{
		if(selData){
			return(
				selData.map((d,index) => <Option value={d.TF_CLO_CODE} key={index}>{d.TF_CLO_NAME}</Option>)
			)
		}
  }
  render() {
    const { optionsTfBrand ,optionsMeteringUnit} = this.state;
    const { getFieldDecorator } = this.props.form;
    return(
      <Form>
        <FormItem label="证件号" labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('registerNo', {
            initialValue: '',
            rules: [{required: true, message:'请输入证件号若无注册证号填无'}]
          })(<Input style={{width: 250}} placeholder={`请输入证件号若无注册证号填无`} />)}
        </FormItem>
        <FormItem label="品牌" labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('tfBrand', {
            initialValue: '',
            rules: [{required: true, message:'请选择品牌'}]
          })(
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="请搜索"
              optionFilterProp="children"
              filterOption={(input, option) =>  option.props.children?option.props.children.indexOf(input)>=0:'' }
            >
              {this.getOptions(optionsTfBrand)}
            </Select>
          )}
        </FormItem>
        <FormItem label="设备名称" labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('equipmentName', {
            initialValue: '',
            rules: [{required: true, message:'请输入设备名称'}]
          })(<Input style={{width: 250}} placeholder={`请输入设备名称`} />)}
        </FormItem>
        <FormItem label="型号" labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('fmodel', {
            initialValue: '',
            rules: [{required: true, message:'请输入型号'}]
          })(<Input style={{width: 250}} placeholder={`请输入型号`} />)}
        </FormItem>
        <FormItem label="规格" labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('spec', {
            initialValue: '',
            rules: [{required: true, message:'请输入规格'}]
          })(<Input style={{width: 250}} placeholder={`请输入规格`} />)}
        </FormItem>
        <FormItem label="计量单位" labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
            {getFieldDecorator('meteringUnit', {
              initialValue: '',
              rules: [{required: true, message:'请选择计量单位'}]
            })(
              <Select
                showSearch
                style={{ width: 250 }}
                placeholder="请输入计量单位"
                optionFilterProp="children"
                filterOption={(input, option) =>  option.props.children?option.props.children.indexOf(input)>=0:'' }
              >
                {optionsMeteringUnit.map((item, index) => <Option value={item.TF_CLO_CODE} key={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)}
              </Select>
          )}
        </FormItem>
      </Form>
    )
  }
}
const NewAddDictionaryModal = Form.create()(NewAddDictionary);
class LedgerArchivesAdd extends PureComponent {
  state={
    deptName: '',//模糊搜索参数
    managementData: [],//管理科室
    deptNameData: [],//使用科室
    userNameData: [],//保管人
    orgIdData: [],//供应商
    loading: false,
    equipmentVisible: false, //选择设备弹框
    dictionaryVisible: false, //新增字典弹框
    query: '',//选择设备弹框查询
    res: [],//详情数据
    record: {},//新增字典数据
    equipmentBackData: [],//设备弹框收集的数据
    equipmentCode: null, //设备id
    assetsRecordGuid: null,
    assetsRecord: null,
    productType: null,
    data: {},
    disabled: false,
    submitList: [],
    fOrgId: null,
    callbackData: {},
    disabledAdd: false,
    currentAssetsRecord:null,//当前添加的设备数据
  }
  /**---------------弹框Start------------------------- */
  showModal = (modalName) => {
    this.setState({ [modalName]: true });
  }
  handleOk = (modalName) => {
    if (modalName === 'dictionaryVisible') {
      this.refs.formDictionary.validateFields((err, values) => {
        if (!err) {
          this.sendSubmitAjax(values);
          this.setState({ loading: true });
        }
      })
    }
  }
  // 新增字典弹框 - 增加
  sendSubmitAjax = (value) =>{
    let options = {
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json'
      },
      success: data => {
        this.setState({ loading: false, dictionaryVisible: false });
        if (data.status) {
          message.success( '新增成功');
          this.refs.formDictionary.resetFields();
        } else {
          message.error(data.msg);
        }
      },
      error: err => {console.log(err)}
    }
    request(ledger.getInsertEquipment,options);
  }
  handleCancel = (modalName) => { this.setState({ [modalName]: false }); }
  /**---------------弹框End------------------------- */
  queryHandle = (query) => {
    this.refs.table.fetch(query);
    this.setState({query});
  }
  componentWillMount =() => {
    this.getAllSelectList();
  }
  //获取所有的下拉框
  getAllSelectList = ()=>{
    let options = {
      body:querystring.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          let orgListRet = [] ;
          let {dDeptList,orgList,useDeptList,userList} = data.result;
          if(orgList){
            orgList.forEach(item => {
              orgListRet.push({
                value: item.orgId,
                text: item.orgName
              })
            });
          }
          this.setState({
            'orgIdData': orgListRet,
            'deptNameData':useDeptList,
            'managementData':dDeptList,
            'userNameData':userList
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(ledger.getAllSelectList, options);
  }
  // 保存按钮
  save = () => {
    if ( !this.state.currentAssetsRecord ) { 
      return message.warn("请选择一个设备！")
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.sendEndAjax();
      }
    })
  }
  // 保存逻辑
  sendEndAjax = () => {
    const { currentAssetsRecord:{ assetsRecordGuid, assetsRecord, productType, equipmentCode }, submitList } = this.state;
    let values = this.props.form.getFieldsValue();
    values.equipmentPayList[0] = {
      originalValue: values.equipmentPayList[0].originalValue,
      payType: "01"
    }
    let poatData = {
      equipmentPayList:[].concat(values.equipmentPayList, submitList), // list集合(资金结构)
    };
    // 基本数据
    poatData.assetsRecord = {
      assetsRecordGuid,
      assetsRecord,
      productType,
      equipmentCode,
      originalValue:values.buyPrice,
      ...values,
    };
    console.log(JSON.stringify(poatData))
    let options = {
      body: JSON.stringify(poatData),
      headers: {
        'Content-Type': 'application/json'
      },
      success: data => {
        if (data.status) {
          message.success('保存成功！');
          setTimeout(()=>{
            this.props.history.push('/ledger/ledgerArchives');
          }, 1000);
        } else {
          message.error(data.msg);
        }
      },
      error: err => {console.log(err)}
    }
    request(ledger.getInsertAssetsRecord, options);
  }
  // 选择设备弹框 - 添加按钮
  addEquipmentTable = (value, modalName) => {
    this.setState({[modalName]: false, equipmentCode: value.equipmentCode,currentAssetsRecord:value});
    this.props.form.setFieldsValue({
      'registerNo': value.registerNo,
      'equipmentStandardName':value.equipmentStandardName,
      'fmodel': value.fmodel,
      'spec': value.spec,
      'meteringUnit': value.meteringUnit,
      'tfBrand':value.tfBrand
    });
  }
  //原码-资产编号搜索带值
  getAssetInfoAjax = (value) =>{
    let options = {
      body:querystring.stringify({ assetsRecord: value }),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            assetsRecordGuid: data.result.assetsRecordGuid,
            assetsRecord: data.result.assetsRecord,
            productType: data.result.productType,
            data: data.result
          });
        }else{
          message.error(data.msg)
        }
        this.getCapitalStructure({assetsRecordGuid: data.result.assetsRecordGuid});
      },
      error: err => {console.log(err)}
    }
    request(ledger.getSelectAssetsRecordDetail, options);
  }
  // 点击enter 带出值
  doSerach = (e) =>{
    this.getAssetInfoAjax(e.target.value);
  }
  // 1.编辑资金结构
  getCapitalStructure(id) {
    request(ledger.getSelectEquipmentPayList, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: querystring.stringify(id),
      success: data => {
        if (_.isArray(data.result)) {
          this.setState({submitList: data.result});
        } else {
          this.setState({submitList: []});
        }
      },
      error: err => {console.log(err)}
    })
  }
  // 2.可能新增的时候会有重复的,注意去重
  setSubToHeavy = (e, type, field) => {
    let value = e.target.value;
    let j = {payType: type, [field]: value-0};
    let a = this.state.submitList;
    if (a.length) {
      a.forEach((ele) => {
        if (ele.payType === j.payType) {
          ele = Object.assign(ele, j);
          return;
        }
      })
    }
    a.push(j);
    this.setState({submitList: _.uniqBy(a, 'payType')});
  }
  // 3.回填
  getBackData = (type, field)=>{
    let single = _.find(this.state.submitList, {"payType": type});
    if(single && single[field]){
      return single[field].toString();
    }else{
      return ''
    }
  }
  // 2.使用科室/管理科室 给数据下拉框
	getOptions = (selData)=>{
		if(selData){
			return(
				selData.map(d => <Option key={d.value} value={d.value}>{d.text}</Option>)
			)
		}
  }
  // 3.使用科室/管理科室 赋值value
  setStateValue = (value, keyName, filterData)=>{
		let o = filterData.filter(item=>{
      return item.text === value;
		})[0];
    let ret = o ? o.value :'';
    this.getNewAddessInfo({deptId: ret});
		this.setState({
      callbackData:Object.assign(this.state.callbackData, {[keyName]: ret}),
    })
  }
  // 2.保管人下拉数据
  getOption = (selData)=>{
		if(selData){
			return(
				selData.map(d =><Option value={d.value} key={d.value}>{d.userName+'-'+d.deptName}</Option>)
			)
		}
  }
  // 通过使用科室接口带出存放地址数据
  getNewAddessInfo = (value) => {
    let options = {
      body:querystring.stringify(value),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        this.props.form.setFieldsValue({'deposit': data.result.length ? data.result[0].address : '' });
        this.setState({ disabledAdd: data.result.length ? true : false });
      }
    }
    request(transfer.getSelectDeptAddress, options);
  }
  render() {
    const columns = [
      {
        title: '操作',
        dataIndex: 'equipmentCode',
        width: 80,
        render: (text, record, index) => {
          return(
            <a onClick={()=>this.addEquipmentTable(record, 'equipmentVisible')}>添加</a>
          )
        }
      },
      {
        title: '证件号',
        dataIndex: 'registerNo',
        width: 80,
      },
      {
        title: '品牌',
        dataIndex: 'tfBrand',
        width: 80,
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        width: 80,
      },
      {
        title: '型号',
        dataIndex: 'fmodel',
        width: 80,
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 80,
      },
    ]
    const { orgIdData , equipmentVisible, dictionaryVisible, loading, res, disabled, data, deptNameData, managementData, userNameData, disabledAdd } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const query = this.state.query;
    return (
      <Content>
        <Affix>
          <div style={{background: '#fff', padding: '10px 20px', marginBottom: 4, display: 'flex', alignContent: 'center', justifyContent: 'flex-end'}}>
            <Button type="primary" onClick={this.save} loading={loading} >保存</Button>
          </div>
        </Affix>
        {/* 选择设备弹框 */}
        <Modal
        visible={equipmentVisible}
        title={`选择设备`}
        width='900px'
        onOk={()=>this.handleOk('equipmentVisible')}
        onCancel={()=>this.handleCancel('equipmentVisible')}
        footer={null}
        >
          <SelectEquipmentModal query={this.queryHandle} />
          <RemoteTable
          ref='table' // 根据搜索后进行刷新列表
          showHeader={true}
          query={query}
          url={ledger.getSelectEquipmentList}
          columns={columns}
          rowKey={'equipmentCode'}
          scroll={{x: '100%', y: document.body.clientHeight - 110 }}
          size="small"
          />
        </Modal>

        {/* 新增字典弹框 */}
        <Modal
        visible={dictionaryVisible}
        title={`新增`}
        width='600px'
        onOk={()=>this.handleOk('dictionaryVisible')}
        onCancel={()=>this.handleCancel('dictionaryVisible')}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={()=>this.handleOk('dictionaryVisible')}>提交</Button>,
          <Button key="back" onClick={()=>this.handleCancel('dictionaryVisible')}>取消</Button>
        ]}
        >
          <NewAddDictionaryModal ref='formDictionary' data={{record: this.state.record}} />
        </Modal>
        
        <Card title={`基础信息`}  bordered={false} className="min_card">
          <Row>
            <Col span={24} style={{marginLeft: 56, marginBottom: 10}}>
              <Button type="primary" onClick={()=>{this.showModal('equipmentVisible')}}>选择设备</Button>
              <Button type="primary" onClick={()=>{this.showModal('dictionaryVisible')}} style={{marginLeft: 20}}>新增字典</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="注册证号" {...formItemLayout}>
                {getFieldDecorator('registerNo', {
                  initialValue: res.registerNo
                })(<Input style={{width: 200}} disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="资产名称" {...formItemLayout}>
                {getFieldDecorator('equipmentStandardName', {
                  initialValue: res.equipmentStandardName
                })(<Input style={{width: 200}} disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="型号" {...formItemLayout}>
                {getFieldDecorator('fmodel', {
                  initialValue: res.fmodel
                })(<Input style={{width: 200}} disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="规格" {...formItemLayout}>
                {getFieldDecorator('spec', {
                  initialValue: res.spec
                })(<Input style={{width: 200}} disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="计量单位" {...formItemLayout}>
                {getFieldDecorator('meteringUnit', {
                  initialValue: res.meteringUnit
                })(<Input style={{width: 200}} disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="品牌" {...formItemLayout}>
                {getFieldDecorator('tfBrand', {
                  initialValue: res.tfBrand
                })(<Input style={{width: 200}} disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="资产编码" {...formItemLayout}>
                {getFieldDecorator('assetsRecord')(<Input style={{ width: 200 }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`管理科室`} {...formItemLayout}>
                {getFieldDecorator('bDeptCode', {
                  initialValue: data.bDept,
                  rules:[{required:true,message:'请选择'}]
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择管理科室"
                    optionFilterProp="children"
                    filterOption={(input, option) =>  option.props.children?option.props.children.indexOf(input)>=0:'' }
                  >
                  {this.getOptions(managementData)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`使用科室`} {...formItemLayout}>
                {getFieldDecorator('useDeptCode', {
                  initialValue: data.useDept,
                  rules:[{required:true,message:'请选择'}]
                })(

                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择使用科室"
                    optionFilterProp="children"
                    filterOption={(input, option) =>  option.props.children?option.props.children.indexOf(input)>=0:'' }
                  >
                    {this.getOptions(deptNameData)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="存放地址" {...formItemLayout}>
                {getFieldDecorator('deposit', {
                  initialValue: data.deposit
                })(<Input style={{width: 200}} placeholder="请输入存放地址" disabled={disabled ? disabled: disabledAdd}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={`保管员`} {...formItemLayout}>
              {getFieldDecorator('custodian', {
                initialValue: data.custodian
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择保管员"
                  optionFilterProp="children"
                  filterOption={(input, option) =>  option.props.children?option.props.children.indexOf(input)>=0:'' }
                >
                  {this.getOption(userNameData)}
                </Select>
              )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`供应商`} {...formItemLayout}>
                {getFieldDecorator('fOrgId', {
                })(
                  <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择供应商"
                  optionFilterProp="children"
                  filterOption={(input, option) =>  option.props.children?option.props.children.indexOf(input)>=0:'' }
                >
                  {orgIdData.map( (d,index)=>{
                    return <Option value={d.value?d.value.toString():''} key={index}>{d.text}</Option>
                  })}
                </Select>
                )}
              </FormItem>
            </Col>
            {/* <Col span={8}>
              <FormItem label="合同编号" {...formItemLayout}>
                {getFieldDecorator('contractNo', {
                  initialValue: data.contractNo
                })(<Input style={{width: 200}} disabled={disabled} placeholder={`请输入采购合同号`} />)}
              </FormItem>
            </Col>
          </Row>
          <Row> */}
            {/* <Col span={8}>
              <FormItem label={`出厂日期`} {...formItemLayout}>
                {getFieldDecorator('productionDate', {
                  initialValue: data.productionDate ? moment(data.productionDate) : null
                })(<DatePicker format="YYYY-MM-DD" style={{width: 200}} disabled={disabled} />)}
              </FormItem>
            </Col> */}
            <Col span={8}>
              <FormItem label={`购买金额`} {...formItemLayout}>
              {getFieldDecorator('buyPrice', {
                initialValue: data.buyPrice,
                rules:[{required:true,message:"请输入购买金额"}]
              })(<Input style={{width: 200}} disabled={disabled} placeholder="请输入购买金额" />)}
              </FormItem>
            </Col>
            {/* <Col span={8}>
              <FormItem label="安装费用" {...formItemLayout}>
                {getFieldDecorator('installPrice', {
                  initialValue: data.installPrice
                })(<Input style={{width: 200}} disabled={disabled} placeholder="请输入安装费用" />)}
              </FormItem>
            </Col> */}
          {/* </Row>
          <Row> */}
            <Col span={8}>
              <FormItem label={`购置日期`} {...formItemLayout}>
                {getFieldDecorator('buyDate', {
                 initialValue: data.buyDate ? moment(data.buyDate) : null
                })(<DatePicker format="YYYY-MM-DD" style={{width: 200}} disabled={disabled} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`生产商`} {...formItemLayout}>
              {getFieldDecorator('product', {
                initialValue: data.product
              })(<Input style={{width: 200}} disabled={disabled} placeholder={`请输入生产商`} />)}
              </FormItem>
            </Col>
            {/* <Col span={8}>
              <FormItem label="生产国家" {...formItemLayout}>
                {getFieldDecorator('productCountry', {
                  initialValue: data.productCountry
                })(
                <Select placeholder={`请选择生产国家`} style={{width: 200}} disabled={disabled} onChange={(value)=>{this.setState({productCountry: value})}}>
                  <Option value={`01`}>国产</Option>
                  <Option value={`02`}>进口</Option>
                </Select>)}
              </FormItem>
            </Col> */}
            <Col span={8}>
                <FormItem label={`购入方式`} {...formItemLayout}>
                    {getFieldDecorator(`buyType`,{
                      initialValue: data.buyType?data.buyType==="00"?'招标采购':'议价采购':"01"
                    })(
                        <Select style={{width:200}}>
                          <Option value='00'>招标采购</Option>
                          <Option value='01'>议价采购</Option>
                        </Select>
                    )}
                </FormItem>
            </Col>
          </Row>
        </Card>
{/*         
        <Card title={`折旧信息`}  bordered={false} className="min_card">
          <Row>
            <Col span={8}>
              <FormItem label="折旧方式" {...formItemLayout}>
              {getFieldDecorator(`depreciationType`, {
                initialValue: data.depreciationType
              })(
                  <Select placeholder={`请选择折旧方式`} style={{width: 200}} disabled={disabled} onChange={(value)=>{this.setState({depreciationType: value})}}>
                    <Option value={`01`}>{depreciationTypeData[`01`].text}</Option>
                    <Option value={`02`}>{depreciationTypeData[`02`].text}</Option>
                    <Option value={`03`}>{depreciationTypeData[`03`].text}</Option>
                    <Option value={`04`}>{depreciationTypeData[`04`].text}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="净残值率" {...formItemLayout}>
                {getFieldDecorator('residualValueV', {
                  initialValue: data.residualValueV
                })(<Input style={{width: 200}} disabled={disabled} placeholder="请输入净残值率" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="预计使用年限" {...formItemLayout}>
                {getFieldDecorator('useLimit', {
                  initialValue: data.useLimit
                })(<Input style={{width: 200}} disabled={disabled} placeholder="请输入预计使用年限" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="开始计提时间" {...formItemLayout}>
                {getFieldDecorator('depreciationBeginDate', {
                  initialValue: data.depreciationBeginDate ? moment(data.depreciationBeginDate) : null
                })(<DatePicker format="YYYY-MM" style={{width: 200}} disabled={disabled} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
         */}
        
        {/* <Card title={`其他信息`}  bordered={false} className="min_card">
          <Row>
            <Col span={8}>
              <FormItem label="有无备用" {...formItemLayout}>
              {getFieldDecorator(`spare`, {
                    initialValue: '00',
                  })(
                  <RadioGroup onChange={(e) => {this.setState({value: e.target.value})}} disabled={disabled}>
                    <Radio value={`00`}>无</Radio>
                    <Radio value={`01`}>有</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="保修截至" {...formItemLayout}>
                {getFieldDecorator('inDate', {
                  initialValue: data.inDate ? moment(data.inDate) : null
                })(<DatePicker format="YYYY-MM-DD" style={{width: 200}} disabled={disabled} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="公用设备" {...formItemLayout}>
              {getFieldDecorator(`publicEquipment`, {
                    initialValue: '01',
                  })(
                  <RadioGroup onChange={(e) => {this.setState({value: e.target.value})}} disabled={disabled}>
                    <Radio value={`01`}>是</Radio>
                    <Radio value={`00`}>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="租赁单价" {...formItemLayout}>
                {getFieldDecorator('rentingPrice', {
                  initialValue:null
                })(<Input style={{width: 200}} disabled={disabled} placeholder="请输入租赁单价" />)}
              </FormItem>
            </Col>
          </Row>
        </Card> */}
        <Card title={`资金结构`}  bordered={false} className="min_card">
          {/* <Row>
            <Col span={8}>
              <FormItem label="自筹资金" {...formItemLayout}>
                {(<Input  style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '01', 'buyPrice')} value={this.getBackData('01', 'buyPrice')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="财政拨款" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '02', 'buyPrice')} value={this.getBackData('02', 'buyPrice')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="科研经费" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '03', 'buyPrice')} value={this.getBackData('03', 'buyPrice')} />)}
              </FormItem>
            </Col>
          </Row> */}
          <Row>
            <Col span={8}>
              {/* <FormItem label="自筹资金原值" {...formItemLayout}>
              {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '01', 'originalValue')} value={} />)}
              </FormItem> */}
              <FormItem label="自筹资金原值" {...formItemLayout}>
                {
                  getFieldDecorator('equipmentPayList[0].originalValue',{
                    initialValue:this.getBackData('01', 'originalValue') || getFieldValue("buyPrice"),
                    rules:[
                      {required:true,message:"请填写自筹资金原值！"}
                    ]
                  })(
                    <Input style={{width: 200}} />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="财政拨款原值" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '02', 'originalValue')} value={this.getBackData('02', 'originalValue')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="科研经费原值" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '03', 'originalValue')} value={this.getBackData('03', 'originalValue')} />)}
              </FormItem>
            </Col>
          </Row>
          {/* <Row>
            <Col span={8}>
              <FormItem label="教学资金" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '04', 'buyPrice')} value={this.getBackData('04', 'buyPrice')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="接收捐赠" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '05', 'buyPrice')} value={this.getBackData('05', 'buyPrice')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="其他" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '06', 'buyPrice')} value={this.getBackData('06', 'buyPrice')} />)}
              </FormItem>
            </Col>
          </Row> */}
          <Row>
            <Col span={8}>
              <FormItem label="教学资金原值" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '04', 'originalValue')} value={this.getBackData('04', 'originalValue')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="接收捐赠原值" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '05', 'originalValue')} value={this.getBackData('05', 'originalValue')} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="其他原值" {...formItemLayout}>
                {(<Input style={{width: 200}} onChange={(capitalDataBack)=>this.setSubToHeavy(capitalDataBack, '06', 'originalValue')} value={this.getBackData('06', 'originalValue')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="原值" {...formItemLayout}>
                {/* {getFieldDecorator('originalValue', {
                  initialValue: data.originalValue
                })(<Input style={{width: 200}}/>)} */}
                {getFieldValue("buyPrice") ||  data.originalValue || "0.00"}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Content>
    )
  }
}
export default Form.create()(LedgerArchivesAdd);

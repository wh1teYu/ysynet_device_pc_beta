/*
 * @Author: yuwei - 新建设备送货单
 * @Date: 2018-06-11 15:05:36 
* @Last Modified time: 2018-06-11 15:05:36 
 */
import React , { Component }from 'react';
import { Form,Layout, Row, Col, Input, Select, Button ,message ,Affix, DatePicker, Table , Popconfirm} from 'antd';
import { fetchData , CommonData } from '../../../utils/tools';
import querystring from 'querystring';
import storage from '../../../api/storage';
import moment , { isMoment } from 'moment';
import _ from 'lodash';
const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const styles = {
  fillRight:{
    marginRight:8
  },
  redColor:{
    color:'red',
    marginRight:5
  },
  fixedWidth:{
    width:'82%',
    // minWidth:100
  }
}
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
const messageTops = {
  'materialName':'产品名称',
  'spec':'型号',
  'fmodel':'规格',
  'tfBrand':'品牌',
  'purchaseUnit':'单位',
  'purchasePrice':'采购单价',
  'amount':'发货数量',
  'registerNo':'注册证号',
  // 'aSalePhone':'售后联系电话',
  // 'aSaleUser':'售后联系人',
}
const initData={
  editState:"00",
  amount:null,//数量
  purchasePrice:null,//采购价
  downlineNo:null,//出厂编号
  materialName:null,//产品名称
  fmodel:null,//规格
  spec:null,//型号
  tfBrand:null,//品牌编号
  purchaseUnit:null,//单位
  inDate:undefined,//保修截止期
  aSaleUser:null,//售后联系人
  aSalePhone:null,//售后联系电话
  isImport:null,//国别  00 国产 01 进口 
  downlineDate:undefined,//出厂日期
  produceName:null,//生产厂家
  registerNo:null,//注册证号
}

class SearchForm extends Component {
  state = {
    orgSelect:[],//医疗机构
    managementDeptSelect:[],//管理部门
    deptSelect:[],//收货科室
    adressSelect:[],
    contractSelect: []// 合同编号
  }

  componentWillMount(){
    this.setOrgSelect();
  }
  // 获取合同编号下拉框
  genContract = (value) => {
    this.props.form.setFieldsValue({ 'contractNo': '' });
    fetchData(storage.selectContractCheckList,querystring.stringify({ fOrgId: value }), data => {
      if(data.status){
        if(data.result.length){
            this.setState({ 
              contractSelect: data.result
            });
        }else{
          this.setState({
            contractSelect: [{ text: '暂无合同', value: '' }]
          })
        }
      }
    })
  }
  //获取供应商下拉框
  setOrgSelect = () => {
    fetchData(storage.selectFOrgList,querystring.stringify({}),(data) => {
      if(data){
        this.setState({
          orgSelect:data.result
        })
      }
    })
    //管理部门
    fetchData(storage.selectUseDeptList,querystring.stringify({deptType:"01"}),(data) => {
      if(data){
        this.setState({
          managementDeptSelect:data.result
        })
      }
    })
    //收货科室
    fetchData(storage.selectUseDeptList,querystring.stringify({deptType:""}),(data) => {
      if(data){
        this.setState({
          deptSelect:data.result
        })
      }
    })
  }
  //获取管理部门下拉框 和 收获科室
  getNextSelect = (val) => {
    
  }
  //获取收货信息
  getAdress = (val) => {
    this.props.form.setFieldsValue({tfAddress:""})
    fetchData(storage.searchAddrListByDeptGuid,querystring.stringify({deptGuid:val}),(data) => {
      if(data){
        this.setState({
          adressSelect:data.result
        })
        if(data.result.length>0){
          this.props.form.setFieldsValue({tfAddress:data.result[0].text})
        }
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
    fetchData(storage.selectUseDeptList,querystring.stringify({deptType:"01",deptName:input}),(data) => {
      if(data){
        this.setState({
          managementDeptSelect:data.result
        })
      }
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { orgSelect , managementDeptSelect , deptSelect , adressSelect, contractSelect } =this.state ;
    const options = orgSelect.map(d => <Option value={d.orgId.toString()} key={d.orgId}>{d.orgName}</Option>);
    const managementDeptOptions = managementDeptSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>);
    const deptSelectOptions = deptSelect.length>0 ? deptSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>):null;
    const adressSelectOptions = adressSelect.length>0 ? adressSelect.map(d => <Option value={d.text.toString()} key={d.value}>{d.text}</Option>):null;
    const contractOptions = contractSelect.length ? contractSelect.map(d => <Option value={d.value.toString()} key={d.value}>{d.text}</Option>):[]
    return  (
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label={`供应商`} {...formItemLayout}>
              {getFieldDecorator(`fOrgId`, {
                rules: [{
                  required: true, message: '请选择供应商',
                }]
              })(
                <Select 
                  showSearch
                  placeholder={'请选择供应商'}
                  optionFilterProp="children"
                  filterOption={(input, option) =>this.filterOption(input, option)}
                  onSelect={(value)=>this.genContract(value)}
                  >
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`管理部门`} {...formItemLayout}>
              {getFieldDecorator(`bDeptGuid`, {
                rules: [{
                  required: true, message: '请选择管理部门',
                }]
              })(
                <Select
                  onSearch={this.fetchSelect}
                  showSearch
                  placeholder={'请选择'}
                  filterOption={false}
                  // showSearch
                  // placeholder={'请选择管理部门'}
                  // optionFilterProp="children"
                  // filterOption={(input, option) =>this.filterOption(input, option)}
                  // onSelect={()=>this.props.form.setFieldsValue({tfAddress:""})}
                >
                  {managementDeptOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={`合同编号`} {...formItemLayout}>
              {getFieldDecorator(`contractNo`, {
              })(
                <Select
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  onSelect={(value,option) => this.props.callback(option.props.children)}
                  filterOption={(input, option) =>this.filterOption(input, option)}
                >
                  {contractOptions}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormItem label={`收货科室`} {...formItemLayout}>
              {getFieldDecorator(`tDeptGuid`)(
                <Select
                  showSearch
                  placeholder={'请选择收货科室'}
                  optionFilterProp="children"
                  filterOption={(input, option) =>this.filterOption(input, option)}
                  onSelect={(val)=>this.getAdress(val)}>
                  {deptSelectOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>  
            <FormItem label={`收货信息`} {...formItemLayout}>
              {getFieldDecorator(`tfAddress`)(
                <Select style={{width:350}}>
                  {adressSelectOptions}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrapperForm = Form.create()(SearchForm);

class AddEquimentDelivery extends Component{

  state = {
    orgSelect:[],//医疗机构
    managementDeptSelect:[],//管理部门
    deptSelect:[],//收货科室
    contractNo: null,// 合同编号
    dataSource:[
      {editState:"00",guid:-2,
      materialName:null,//产品名称
      spec:null,//型号
      fmodel:null,//规格
      tfBrand:null,//品牌编号
      purchaseUnit:null,//单位
      purchasePrice:null,//采购价
      amount:null,//数量
      produceName:null,//生产厂家
      downlineNo:null,//出厂编号
      registerNo:null,//注册证号
      downlineDate:null,//出厂日期
      isImport:null,//国别  00 国产 01 进口 
      inDate:null,//保修截止期
      aSalePhone:null,//售后联系电话
      aSaleUser:null,//售后联系人
      },
    ],//table数据
    currentEditRow:{},//当前编辑的数据缓存
    unitList:[],//数据字典单位
    tfBrandList:[]
  }

  componentWillMount (){
    CommonData('UNIT', (data) => {
      this.setState({unitList:data.rows})
    })
    CommonData('TF_BRAND', (data) => {
      console.log(data.rows)
      this.setState({tfBrandList: _.unionBy(data.rows,'TF_CLO_NAME')})
    })
  }

  //获取送货单总金额
  total = () => {
    const {dataSource}=this.state;
    let total = 0;
    dataSource.map(item=>{
      if(item.editState==="01"){
        return total+= (item.amount || 0 )*(item.purchasePrice|| 0)
      }
      return item
    })
    return total.toFixed(2);
  }

  //发货
  submit = () => {
    this.refs.form.validateFields((err,values)=>{
      if(!err){
        if(values.tfAddress){
          let addressArr  = values.tfAddress.split('|');
          let [ tfAddress , linkman , linktel ] = addressArr ; 
          values.tfAddress = tfAddress;
          values.lxr = linkman;
          values.lxdh = linktel;
        }
        values.contractNo = this.state.contractNo;
        let dataSource = [].concat(this.state.dataSource);
        for(let i=0;i<dataSource.length;i++){
          if(dataSource[i].guid === -2){
            delete dataSource[i]
          }else if(dataSource[i].guid !== -2 && dataSource[i].editState==="00"){
            message.warning('请保存当前编辑数据！')
            return 
          }else{
            dataSource[i].purchaseUnit=this.gettfCode(dataSource[i].purchaseUnit);
            // dataSource[i].tfBrand=this.gettfBrandName(dataSource[i].tfBrand);
            dataSource[i].amount = Number(dataSource[i].amount);
            dataSource[i].purchasePrice = Number(dataSource[i].purchasePrice);
            delete dataSource[i].guid
            delete dataSource[i].editState
          }
        }
        console.log(JSON.stringify({deliveryZc:values,deliveryDetailZcList:dataSource.filter(item => {return item})  } ))
        fetchData(storage.insertDelivery,
          {deliveryZc:values,deliveryDetailZcList:dataSource.filter(item => {return item})},
          (data) => {
          if(data.status){
            message.success('发货成功')
            this.refs.form.resetFields()
            this.setState({dataSource:[{...initData}]})
          }else{
            message.warn(data.msg)
            this.setState({dataSource:this.state.dataSource})
          }
        },'application/json')
      }
    })
  }

  //填写输入框的时候更换
  changeTable = (e,record,index,filed) => {
    let dataSource  = this.state.dataSource;
    let val ;
    if(isMoment(e)){
      val = moment(e).format('YYYY-MM-DD');
    }else{
      val = e.target ? e.target.value : e;
    }

    if(filed==='purchasePrice'){///^\d+$/
      if (/^\d+$/.test(val-0) ||  /(\d+\.\d{1}$)/.test(val-0) || /(\d+\.\d{2}$)/.test(val-0)) {
        if (val > 99999999) {
          val  = 99999999;
          return message.warn('输入数值过大, 不能超过100000000')
        }
      } else {
          val  = 0;
          return message.warn('请输入非0正数,最多保留两位小数')
      }
    }else if (filed==='amount'){
      if (/^\d+$/.test(val-0)) {
        if (val > 100) {
          val  = 100;
          return message.warn('输入数值过大, 不能超过100')
        }
      } else {
          val  = 0;
          return message.warn('请输入非0正整数')
      }
    }

    let j = Object.assign(record,{[filed]:val});
    dataSource[index] = j ;
    this.setState({dataSource})
  }

  //点击编辑按钮执行 
  changeEdit = (index) => {
    let dataSource = this.state.dataSource; 
    dataSource[index].editState ="00";
    const ret = Object.assign({},dataSource[index]);
    this.setState({dataSource,currentEditRow:ret})
  }
  //点击复制按钮
  copyRow = (record,index) => {
    let newRow ={ ...record,editState:"00",guid:-2};
    //复制一条新的信息给dataSource的第一条
    let dataSource = this.state.dataSource;
    dataSource[0] = newRow;
    this.setState({dataSource})
  }

  //点击保存按钮执行 
  saveRow = (record,index) => {
    //record在这里需要加上必填验证。然后继续以下操作
    const { produceName,downlineNo,downlineDate,isImport,inDate,aSalePhone,aSaleUser,   ...requiredInfo} = record; 
    console.log( produceName,downlineNo,downlineDate,isImport,inDate,aSalePhone,aSaleUser)
    console.log("保存的单行必填信息内容：",requiredInfo)
    for(let item in requiredInfo){
       if( requiredInfo[item] === undefined || requiredInfo[item]===''|| requiredInfo[item]===null) {
         message.warning( `请填写${messageTops[item]}！`)
         return 
       }
    }
    let dataSource = this.state.dataSource;
    if(index>0){
      dataSource[index] = {...record,editState:"01"}
    }else{
      const r = {...record,editState:"01",guid:dataSource.length}
      dataSource.push(r);
      dataSource[0]={...initData,guid:-2};
    }
    this.setState({dataSource})
  }

  //点击取消的时候做重置操作
  reset = (record,index) => {
    let dataSource = this.state.dataSource;
    if(index>0){
      dataSource[index] = Object.assign(Object.assign({},this.state.currentEditRow),{editState:"01"});
    }else{
      dataSource[0]={...initData,guid:-2};
    }
    this.setState({dataSource})
  }

  //点击删除
  deleteRow = (record,index) => {
    let dataSource = this.state.dataSource;
    dataSource.splice(index,1);
    this.setState({dataSource})
  }

  //getaName 
  gettfCode = (val) => {
    let unitList = this.state.unitList;
    let code = unitList.filter(item=>{
      if(item.TF_CLO_CODE===val){
        return item
      }
      return null;
    });
    let CodeName = code.length>0 ? code[0].TF_CLO_NAME :''
    return CodeName
  }
  gettfBrandName = (val) => {
    let brandList = this.state.tfBrandList;
    let code = brandList.filter(item=>{
      if(item.TF_CLO_CODE===val){
        return item
      }
      return null;
    });
    let CodeName = code.length>0 ? code[0].TF_CLO_NAME :''
    return CodeName
  }

  filterOption = (input, option) => {
    if(option.props.children){
      return option.props.children.indexOf(input) >= 0
    }
    return false
  }

  render(){
    const { dataSource , unitList ,tfBrandList } = this.state;  
    const unitOption =  unitList?unitList.map(item=>(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)):null;
    const tfBrandOption = tfBrandList.map(item=>(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>))
    const columns = [
      {
        title:"产品名称",
        dataIndex: 'materialName',
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text:
             <span style={{minWidth:120,display:'inline-block'}}>
              <i style={styles.redColor}>*</i>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'materialName')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"型号",
        dataIndex: 'fmodel',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <i style={styles.redColor}>*</i>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'fmodel')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"规格",
        dataIndex: 'spec',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <i style={styles.redColor}>*</i>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'spec')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"品牌",
        dataIndex: 'tfBrand',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? this.gettfBrandName(text) :
             <span>
              <i style={styles.redColor}>*</i>
              <Select 
              showSearch
              style={styles.fixedWidth}  
              value={text} 
              onSelect={(e)=>this.changeTable(e,record,index,'tfBrand')}
              filterOption={(input, option) => this.filterOption(input,option)}
              >
                {tfBrandOption}
              </Select>
             </span> 
          )
        } 
      },
      {
        title:"单位",
        width:120,
        dataIndex: 'purchaseUnit',
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? this.gettfCode(text) :
             <span>
              <i style={styles.redColor}>*</i>
              <Select 
              showSearch
              style={styles.fixedWidth}  
              value={record.purchaseUnit} 
              onSelect={(e)=>this.changeTable(e,record,index,'purchaseUnit')}
              filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
              >
                {unitOption}
              </Select>
             </span> 
          )
        } 
      },
      {
        title:"采购单价",
        width:150,
        dataIndex: 'purchasePrice',
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? (text-0).toFixed(2) :
             <span>
              <i style={styles.redColor}>*</i>
              <Input type='number' value={record.purchasePrice}  onChange={(e)=>this.changeTable(e,record,index,'purchasePrice')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"发货数量",
        width:150,
        dataIndex: 'amount',
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <i style={styles.redColor}>*</i>
              <Input type='number' value={record.amount}  onChange={(e)=>this.changeTable(e,record,index,'amount')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"生产商",
        dataIndex: 'produceName',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'produceName')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"出厂编号",
        dataIndex: 'downlineNo',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'downlineNo')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"注册证号",
        dataIndex: 'registerNo',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <i style={styles.redColor}>*</i>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'registerNo')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"出厂日期",
        dataIndex: 'downlineDate',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <DatePicker 
                style={{width:120}}
              value={record.downlineDate? moment(record.downlineDate,'YYYY-MM-DD'):null} allowClear={false} format={'YYYY-MM-DD'} onChange={(e)=>this.changeTable(e,record,index,'downlineDate')}></DatePicker>
             </span> 
          )
        } 
      },
      {
        title:"国别",
        dataIndex: 'isImport',
        width:120,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? (text==="00"? '国产':(text==="01"?'进口':'')) :
             <span>
              <Select onSelect={(e)=>this.changeTable(e,record,index,'isImport')} value={record.isImport} style={styles.fixedWidth}>
                <Option key="00" value="00">国产</Option>
                <Option key="01" value="01">进口</Option>
              </Select>
             </span> 
          )
        } 
      },
      {
        title:"保修截至日期",
        dataIndex: 'inDate',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
          <DatePicker 
          style={{width:120}}
          value={record.inDate? moment(record.inDate,'YYYY-MM-DD'):null} allowClear={false} format={'YYYY-MM-DD'} onChange={(e)=>this.changeTable(e,record,index,'inDate')}></DatePicker>
          )
        } 
      },
      {
        title:"售后服务电话",
        dataIndex: 'aSalePhone',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'aSalePhone')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"售后联系人",
        dataIndex: 'aSaleUser',
        width:150,
        render: (text,record,index) => {
          return(
          record.editState ==="01" ? text :
             <span>
              <Input value={text}  onChange={(e)=>this.changeTable(e,record,index,'aSaleUser')} style={styles.fixedWidth}/>
             </span> 
          )
        } 
      },
      {
        title:"操作",
        dataIndex:"actions",
        width:100,
        fixed:'right',
        render:(text,record,index) => {
          if(record.editState ==="00"){//如果是第一条 || 可以编辑的状态
            return (
              <span>
                <a style={styles.fillRight} onClick={() => this.saveRow(record,index)}>保存</a>
                <Popconfirm title="确定取消操作？" onConfirm={() => this.reset(record,index)}>
                    <a>取消</a>
                </Popconfirm>
              </span>
            )
          }else{//不可编辑的状态
            return (
              <span>
                <a style={styles.fillRight} onClick={()=>this.changeEdit(index)}>编辑</a>
                <a style={styles.fillRight} onClick={()=>this.copyRow(record,index)}>复制</a>
                
                <Popconfirm title="确定删除当前数据？" onConfirm={() => this.deleteRow(record,index)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            )
          }
        }
      },
    ]

    return (
        <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
            <WrapperForm 
              ref='form'
              callback={(contractNo) => this.setState({ contractNo })}
            />
            <Table 
              columns={columns}
              dataSource={dataSource}
              rowKey="guid"
              scroll={{ x: '200%' }}
            />
            <Affix offsetBottom={0} >
              <div style={{padding:10,background:'#fff',clear:'both',height:52}}>
                <span >送货单总金额： <i style={{color:'red'}}>{this.total()}</i></span>
                <Button type="primary" style={{float:'right'}} onClick={()=>this.submit()}>保存</Button>
              </div>
            </Affix>
        </Content>
    )
  }
}
export default AddEquimentDelivery

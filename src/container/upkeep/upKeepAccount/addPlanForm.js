import React from 'react'
import moment from 'moment';
import { Table , message ,  Row, Col, Input,Card ,Form, Button , Radio ,Select ,DatePicker ,Modal} from 'antd'
import request from '../../../utils/request';
import querystring from 'querystring';
import upkeep from '../../../api/upkeep';
import basicdata from '../../../api/basicdata';
import _ from 'lodash';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
function UnStateText(label,data){
  let txt = '';
  switch(data){
    case '02':
      txt = '高';
    break;
    
    case '01':
      if(label==="循环方式"){
        txt='循环';
      }else{
        txt = '中';
      }
    break;

    case '00':
    if(label==="循环方式"){
      txt='单次';
    }else{
      txt = '低';
    }
    break;

    default:
    txt = data;
  }
    
  return (
    <Row style={{padding:'10px 0px'}}>
      <Col span={8} style={{textAlign: 'right',paddingRight:8}}>{label} :</Col>
      <Col span={16}>{txt}</Col>
    </Row>
  )
    
}

const prjColumns = [
  {
    title: '项目名称',
    dataIndex: 'templateTypeName'
  },
]
const initSearch = {
  assetsRecordGuid:"",
  p_maintainType:"",
  maintainDay:"",
  deposit:"",
  bDept:"",
  custodian:"",
  spec:"",
  useDept:"",
  fmodel:"",
  productType:"",
	equipmentStandardName:""
}
export default class AddUpKeepPlanForm extends React.Component {
    state = {
      selectDropData:[],//项目弹出层 下拉框内容
      prjTableData:[],//项目弹出层  下拉框带出对应table内容
      expand: false,
      data:{},
      fileList: [],
      editState:true,
      fileUploadState:true,
      //table
      tableData:[],
      //modal
      loading: false,
      visible: false,
      //tree
      expandedKeys:[],//展开项目 ['0-0-0', '0-0-1']
      autoExpandParent: true,
      checkedKeys: [],//默认勾选项目['0-0-0']
      selectedKeys: [],
      selKey:[],
      cycleModule:'',
      afterSelectValue: ''
    };

    componentWillMount =() =>{
        const { editState, maintainPlanId } =this.props;
        //获取资产编号相关信息
        if(maintainPlanId){
          this.getDetailAjax({ maintainPlanId: maintainPlanId  })
        }
        this.getOneModule();
        this.setState({
          editState:editState,
        })
    }
    //获取详情数据并给form表单
    getDetailAjax = (keys) =>{
      let options = {
        body:querystring.stringify(keys),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            let retData = data.result.rows[0];
            //拿到回显数据--处理时间格式
            retData.maintainDate=moment(retData.maintainDate,'YYYY-MM-DD')
            if(retData.loopFlag==="01"){//如果该数据为循环的数据-则如下处理
              retData.endMaintainDate=moment(retData.endMaintainDate,'YYYY-MM-DD')
            }
            let tabledata =data.result.rows[0].typeList;
            this.setState({
              afterSelectValue: retData.tfCycleType,
              cycleModule: retData.loopFlag, //循环方式
              data:retData,
              tableData:tabledata 
            });
            console.log(retData)
            this.props.maintainData(retData);
            if(this.state.editState){this.props.callback(this.getKey(tabledata))}
            //获取第一个板块的信息内容
            this.getAssetInfoAjax(retData.assestRecord)//assetsRecord
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(this.props.url, options)
    }
    
    componentWillReceiveProps = (nextProps)=> {
      if(nextProps.formInfo.assetsRecordGuid===""){
        this.setState({
          data:nextProps.formInfo,
          tableData:[]
        })
      }
    }

    componentWillUnmount = () =>{
        this.handleReset();
    }
  
    handleReset = () => {
      this.props.form.resetFields();
    }

    getKey = (array)=>{
      let a = [];
      array.forEach(element => {
          a.push(element.maintainTypeId)
      });
      return a;
    }

    //1-资产信息-资产编号搜索带值
    getAssetInfoAjax = (value) =>{
      let options = {
        body:querystring.stringify({
          assetsRecord:value
        }),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            //过滤出资产信息的固定字段
            const jsonData  = initSearch;
            for(let item in jsonData){
              jsonData[item] = data.result[item];
              if(item === 'p_maintainType'){
                jsonData[item] = data.result.maintainType
              }
            }
            this.setState({
              data:Object.assign(this.state.data,jsonData),//合并现有的data数据
            })
          }else{
            message.error(data.msg)
            this.setState({
              data:Object.assign(this.state.data,initSearch)//清除带出的数据
            })
          }
        },
        error: err => {console.log(err)}
      }
      request(upkeep.getAssetInfo, options)
      // if(value && (value).trim()!=='' ){
      //   request(upkeep.getAssetInfo, options)
      // }
    }
    
    //3-项目信息-选择项目弹窗
    toggleTree = () => {
      this.setState({
        visible: true,
      });
    }
    //-----table添加
    handleOkTree = () => {
      this.setState({ loading: true });
      let newData = this.state.checkedKeys;
      if(newData.length<=0){
        message.warn('请至少选择一条项目新增！')
        this.setState({ loading: false });
        return
      }
      newData.forEach(ele=>{
        ele.maintainTypeName = ele.templateTypeName;
      })
      setTimeout(() => {
        this.setState((prevState)=>{ 
          let uniqTableData = _.uniqBy(prevState.tableData.concat(newData),'maintainTypeId');
          console.log(uniqTableData,'uniqTableData')
          this.props.callback(this.getKey(uniqTableData))
          return{
            loading: false, 
            visible: false ,
            selKey:[],
            checkedKeys:[],
            tableData:uniqTableData
          }
        });
      }, 1000);
    }
   
    //-----table删除
    deleteTableData = (record) =>{
      const arr = this.state.tableData;
      arr.splice(arr.findIndex(item => item === record),1);
      this.setState({
        tableData:arr
      })
      this.props.callback(this.getKey(arr))
    }
    
    //关闭模态窗
    handleCancelTree = () => {
      this.setState({ visible: false ,checkedKeys:[],selKey:[]});
    }
    
    //获取添加项目的一级下拉框
    getOneModule = (value) =>{
      let o;
      if(value){
        o={maintainTemplateName:value}
      }else{
        o=''
      }
      let options = {
        body:querystring.stringify(o),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            let ret = []
            data.result.forEach(item => {
              let i ={
                value:item.maintainTemplateId,
                text:item.maintainTemplateName,
                key:item.detailNum
              }
              ret.push(i);
            });
            this.setState({
              'selectDropData':ret
            })
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.queryOneModule,options)
    }
    //获取添加项目的一级下拉框 带出的二级数据
    changeOneModule =(value)=>{
      let o =this.state.selectDropData.filter(item=>{
        return item.text===value
      })[0];
      let json='';
      if(o){
        json ={
          'maintainTemplateId':o.value
        }
      }
      //发出请求获取对应二级项目内容 并给弹窗中的table
      let options = {
        body:querystring.stringify(json),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            this.setState({
              'prjTableData':data.result
            })
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.queryTwoModule,options)

    }

    genAfterSelect = (val) =>{
      return (
        <Select 
          style={{ width: 70  }} 
          value={this.state.afterSelectValue ? this.state.afterSelectValue: val}
          onSelect={value => {
            this.setState({ afterSelectValue: value });
            this.props.tfCycleType(value)
          }}
        >
          <Option value='01'>月</Option>
          <Option value='02'>天</Option>
        </Select>
      )
    }

    _filterDept = (val)=>{
      const { data } = this.state;
      switch (val) {
        case "01"://选择管理科室保养模式 - 则显示添加的资产的管理科室
          return UnStateText('保养执行科室',data.bDept)
        case "02"://选择临床科室保养模式 - 则显示添加的资产的使用科室
          return UnStateText('保养执行科室',data.useDept)
        case "03"://选择临床科室保养模式 - 则显示添加的资产的使用科室
          return UnStateText('保养执行科室',data.bDept)
        default:
          return UnStateText('保养执行科室','')
      }
    }

    render() {
      const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
      const {  selKey  , prjTableData ,selectDropData , data , editState , visible, loading , tableData} = this.state;
      const options = selectDropData.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>);
    
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          width:100,
          render:(text, record, index) => index + 1
        },
        {
          title: '操作',
          dataIndex: 'checkboxDetailGuid',
          width:150,
          render:(text,record)=>{
            if(editState){
              return(
                <a onClick={()=>this.deleteTableData(record)}>删除</a>
              )
            }else{
              return <span>- -</span>
            }
          }
        },
        {
          title: '项目名称',
          width:350,
          dataIndex: 'maintainTypeName',
        }
      ]

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

      const cycleModuleFn =(val)=>{
        const { data } = this.state;
        if(val==='00'){
          return(
              <Col span={8}>
                <FormItem label='保养时间' {...formItemLayout}>
                    {getFieldDecorator(`maintainDate`,{
                      initialValue:data.maintainDate,
                    })(
                    <DatePicker  disabled/>
                  )}
                </FormItem>
              </Col>
          )
        }else{
          return(
            <div>
              <Col span={8}>
                <FormItem label={`循环周期`} {...formItemLayout}>
                  {getFieldDecorator(`tfCycle`,{
                    initialValue:data.tfCycle,
                    rules:[{
                      required:true,message:'请输入循环周期！'
                    }]
                  })(
                    <Input placeholder="请输入循环周期" style={{width: 200}} addonAfter={this.genAfterSelect(data.tfCycleType)}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`提前生成保养单`} {...formItemLayout}>
                  {getFieldDecorator(`advancePlan`,{
                    initialValue:data.advancePlan,
                    rules:[{
                      required:true,message:'请输入天数！'
                    }]
                  })(
                    <Input placeholder="请输入天数" style={{width: 200}} addonAfter={'天'}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8} >
                <FormItem {...formItemLayout} label="保养失效时间">
                  {getFieldDecorator('endMaintainDate',{
                    initialValue:data.endMaintainDate,
                    rules:[{
                      required:true,message:'请填写保养计划有效期！'
                    }]
                  })(<DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={(current)=>{return current && current < moment().endOf('day');}}
                    />)}
                </FormItem>
              </Col>
            </div>
          )
        }
      }
      return (
        <Form>
          <Card title="资产信息" bordered={false} >
              <Row>
                  <Col span={8}>
                    {
                      UnStateText('资产编号',data.assestRecord)
                    }
                  </Col>
                  <Col span={8}>
                      {UnStateText('资产名称',data.equipmentStandardName)}
                  </Col>
              </Row>    
              <Row>
                  <Col span={8} >
                      {UnStateText('型号',data.fmodel)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('规格',data.spec)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('资产类别',data.productType)}
                  </Col>
              </Row>
              <Row>
                  <Col span={8} >
                    {UnStateText('使用科室',data.useDept)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('管理员',data.custodian)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('管理科室',data.bDept)}
                  </Col>
              </Row>
              <Row>
                  <Col span={8} >
                    {UnStateText('存放地址',data.deposit)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('保养分类',data.p_maintainType)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('保养周期',data.maintainDay)}
                  </Col>
              </Row>
          </Card>

          <Card title="计划信息" bordered={false} style={{marginTop:30}}>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label={`保养模式`}>
                    {
                      getFieldDecorator(`maintainMode`,{
                        initialValue: data.maintainMode
                      })(
                        <Select 
                          placeholder='请选择'
                          onSelect={value => setFieldsValue({ 'maintainType': value === '03'? '01':'00' })} 
                          style={{ width: 200 }}
                        >
                          <Option value='01'>管理科室保养</Option>
                          <Option value='02'>临床科室保养</Option>
                          <Option value='03'>服务商保养</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='保养类型' {...formItemLayout}>
                  {getFieldDecorator(`maintainType`,{initialValue: data.maintainType })(
                    <Radio.Group>
                      {
                        getFieldValue('maintainMode') !== '03' && data.maintainType === '00' ?
                        <Radio value='00' checked={true}>内保</Radio>
                        :
                        <Radio value='01' checked={true}>外保</Radio>
                      }
                    </Radio.Group>
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  {editState ? 
                    <FormItem label='临床风险等级' {...formItemLayout}>
                    {getFieldDecorator(`clinicalRisk`,{initialValue:data.clinicalRick})(
                      <Select placeholder='请选择' style={{ width: 200 }}>
                        <Option value="">请选择</Option>
                        <Option value="02">高</Option>
                        <Option value="01">中</Option>
                        <Option value="00">低</Option>
                      </Select>
                    )}
                    </FormItem>
                    : UnStateText('临床风险等级',data.clinicalRisk)
                  }
                </Col>
                <Col span={8}>
                  {//保养执行科室
                    this._filterDept(getFieldValue('maintainMode')||data.maintainMode)
                  }
                </Col>
                <Col span={8}>
                  {editState ? 
                    <FormItem label='循环方式' {...formItemLayout}>
                      {getFieldDecorator(`loopFlag`, {
                        initialValue: data.loopFlag,
                        rules:[
                          {required:true,message: '请选择循环方式',}
                        ]
                      })(
                        <RadioGroup onChange={(e)=>{this.setState({'cycleModule':e.target.value}) } }>
                          <RadioButton value="00">单次</RadioButton>
                          <RadioButton value="01">循环</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    :UnStateText('循环方式',data.loopFlag)
                  }
                </Col>
                {/* <Col span={8}>
                  {editState ? 
                    <FormItem label={`循环周期`} {...formItemLayout}>
                      {getFieldDecorator(`tfCycle`,{
                        initialValue:data.tfCycle,
                        rules:[{
                          required:true,message:'请输入循环周期！'
                        }]
                      })(
                        <Input placeholder="请输入循环周期" style={{width: 200}} addonAfter={this.genAfterSelect()}/>
                      )}
                    </FormItem>
                    :UnStateText('循环周期',data.tfCycle)
                  }
                </Col> */}
                {/* <Col span={8}>
                  {editState ? 
                    <FormItem label='保养时间' {...formItemLayout}>
                        {getFieldDecorator(`maintainDate`,{
                          initialValue:data.maintainDate,
                        })(
                        <DatePicker  disabled/>
                      )}
                    </FormItem>
                    :UnStateText('保养时间',moment(data.maintainDate).format('YYYY-MM-DD'))
                  }
                </Col> */}
                {/* <Col span={8}>
                {editState ? 
                  <FormItem label={`提前生成保养单`} {...formItemLayout}>
                    {getFieldDecorator(`advancePlan`,{
                      initialValue:data.advancePlan,
                      rules:[{
                        required:true,message:'请输入天数！'
                      }]
                    })(
                      <Input placeholder="请输入天数" style={{width: 200}} addonAfter={'天'}/>
                    )}
                  </FormItem>
                  :UnStateText('提前生成保养单',data.advancePlan)
                }
              </Col> */}
              {/* <Col span={8} >
                  {editState ? 
                    <FormItem
                      {...formItemLayout}
                      label="保养计划开始时间"
                    >
                      {getFieldDecorator('maintainDate',{
                        initialValue:data.maintainDate,
                      })(
                        <DatePicker
                          format="YYYY-MM-DD"
                          disabled
                          />
                      )}
                    </FormItem>
                    :UnStateText('保养计划开始时间', moment(data.maintainDate).format('YYYY-MM-DD'))
                  }
              </Col> */}
              </Row>
              {
                this.state.cycleModule &&
                <Row>
                  {
                    cycleModuleFn(this.state.cycleModule)
                  }
                </Row>
              }
          </Card>
          
          <Card title="项目信息" bordered={false} style={{marginTop:30}}>
             <Row><Button type="buttom" onClick={this.toggleTree} disabled={!editState}>选择项目</Button></Row>
             <Row>
                <Table ref='tableItem' rowKey={'maintainTypeId'} columns={columns} dataSource={tableData} size="middle"  style={{marginTop:15}}>
                </Table>
             </Row>

             <Modal
              visible={visible}
              title="选择项目"
              onOk={this.handleOkTree}
              onCancel={this.handleCancelTree}
              footer={[
                <Button key="back" onClick={this.handleCancelTree}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={this.handleOkTree}>
                  提交
                </Button>,
              ]}>
                    <Row>
                      <Col>
                        <Select
                          showSearch
                          optionFilterProp="children"
                          placeholder='请搜索选择保养项目'
                          defaultActiveFirstOption={false}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onSearch={this.getOneModule}
                          onSelect={this.changeOneModule}
                          style={{ width: 250,marginBottom:15 }} 
                        >
                          {options}
                        </Select>
                      </Col>
                    </Row>
                    <Table 
                      rowKey={'templateDetailGuid'}
                      size={'small'}
                      rowSelection={{
                        selectedRowKeys:selKey,
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setState({
                            'selKey':selectedRowKeys,
                            'checkedKeys':selectedRows
                          })
                        },
                        getCheckboxProps: record => ({
                          disabled: record.name === 'Disabled User', // Column configuration not to be checked
                          name: record.name,
                        }),
                      }} 
                      columns={prjColumns} 
                      dataSource={prjTableData} />
             </Modal>
          </Card>
        </Form>
      );
    }
  }

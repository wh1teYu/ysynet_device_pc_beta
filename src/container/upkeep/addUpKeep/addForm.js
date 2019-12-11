import React from 'react'
import moment from 'moment';
import {Table , message ,  Row, Col, Input, Icon ,Card ,Form, Button ,Select ,DatePicker ,Upload ,Modal} from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import request from '../../../utils/request';
import querystring from 'querystring';
import upkeep from '../../../api/upkeep';
import basicdata from '../../../api/basicdata';
import _ from 'lodash';
import { FTP } from '../../../api/local';
import { upkeepDetailsTable , upKeepMode } from '../../../constants';
import './style.css';
const FormItem = Form.Item;
const Option = Select.Option;
function UnStateText(label,data){
  if(data==='Invalid date'){
    data=''
  }
  let txt = '';
  switch(data){
    case '02':
    if(label==="设备状态"){
      txt='故障';
    }else{
      txt = '高';
    }
    break;
    
    case '01':
      if(label==="设备状态"){
        txt='正常';
      }else{
        txt = '中';
      }
    break;

    case '00':
    txt = '低';
    break;

    default:
    txt = data;
  }

  if(label ==="备注（可选）"){
    return (
      <Row style={{padding:'15px 0px'}}>
        <Col span={4} style={{textAlign: 'right',paddingRight:8}}>{label} :</Col>
        <Col span={8}>{txt}</Col>
      </Row>
    )
  }else{
    return (
      <Row style={{padding:'15px 0px'}}>
        <Col span={8} style={{textAlign: 'right',paddingRight:8}}>{label} :</Col>
        <Col span={16}>{txt}</Col>
      </Row>

    )
  }
}

function UnStateTable(value){
  let txt = value;
  return  (
    <span>{txt}</span>
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
  maintainType:"",
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
const formItemRowLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
};
class AddUpKeepForm extends React.Component {
    state = {
      selectDropData:[],//项目弹出层 下拉框内容
      prjTableData:[],//项目弹出层  下拉框带出对应table内容
      expand: false,
      data:{},
      previewVisible: false,
      previewImage: '',
      fileList: [],
      editState:true,
      fileUploadState:true,
      //table
      tableData:[],//回显的tableData
      //treeData
      treeData:[],
      //modal
      loading: false,
      visible: false,
      //tree
      expandedKeys:[],//展开项目 ['0-0-0', '0-0-1']
      autoExpandParent: true,
      checkedKeys: [],//默认勾选项目['0-0-0']
      checkedKeyArray:[],
      selectedKeys: [],
      startValue: null,
      endValue: null,
      upKeepPerson:[],//保养人下拉框
      servicePerson:[],//服务商下拉框
    };
    //图片上传内容---------------------------------------------
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
    beforeUpload = (file) => {
      const type = file.type === 'image/jpeg'|| file.type === 'image/png'|| file.type === 'image/bmp';
      if (!type) {
        message.error('您只能上传image/jpeg、png、bmp!');
      }
      const isLt5M = file.size / 1024 / 1024  < 5;
      if (!isLt5M) {
        message.error('图片不能大于 5MB!');
      }
      this.setState({
        fileUploadState:type && isLt5M
      })
      return true;
    }
    //上传点击删除
    handleChange = ({fileList}) => {
      if(this.state.editState){
        if(this.state.fileUploadState){
         let options = {
            tfAccessoryList:fileList,
          }
          this.setState({ 
            data:Object.assign(this.state.data,options)
          })
        }else{
          this.setState({ 
            data:Object.assign(this.state.data,{tfAccessoryList:fileList.slice(0,[fileList.length-1])})
          })
        }
      }else{
        message.warning('查看详情时不能删除!')
      }
    }
    //-----------------上传结束-------------------------------
    
    componentWillMount =() =>{
        const { maintainGuid , editState} =this.props;
        //获取资产编号相关信息
        if(maintainGuid){
          this.getDetailAjax({maintainGuid})
        }
        this.getOneModule();
        this.setState({
          editState:editState,
        })

        //获取保养人下拉框
        request(upkeep.selectUserNameList,{
          body:querystring.stringify({}),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              this.setState({upKeepPerson:data.result})
            }
          },
          error: err => {console.log(err)}
        })

        //获取 servicePerson 服务商下拉框
        request(upkeep.selectServiceCheckList,{
          body:querystring.stringify({}),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              this.setState({servicePerson:data.result})
            }
          },
          error: err => {console.log(err)}
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
            let retData = data.result;
            let tabledata =data.result.maintainDetailList;
            this.setState({
              data:retData,
              tableData:tabledata 
            })
            if(this.state.editState){this.props.callback(tabledata) }
            //获取第一个板块的信息内容
            this.getAssetInfoAjax(retData.assetsRecord)
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(upkeep.listToDetails, options)
    }
  
    componentWillReceiveProps = (nextProps)=> {
      if(nextProps.formInfo.assetsRecordGuid===""){//重置表格中的内容
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
              jsonData[item] = data.result[item]
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
      if(value && (value).trim()!=='' ){
        request(upkeep.getAssetInfo, options)
      }
    }
    doSerach = (e) =>{
      this.getAssetInfoAjax(e.target.value)
    }
    
    //3-项目信息-选择项目弹窗以及树状图
    toggleTree = () => {
      this.setState({
        visible: true,
      });
    }
    //-----table添加
    handleOkTree = () => {
      this.setState({ loading: true });
      let newData = this.state.checkedKeys;
      if(this.state.checkedKeys && this.state.checkedKeys.length<=0){
        message.warn('请至少选择一条项目添加！')
        this.setState({ loading: false });
        return
      }
      setTimeout(() => {//含清空tree勾选内容
        this.setState((prevState)=>{ 
          let prevData = prevState.tableData || [];
          let uniqTableData = _.uniqBy(prevData.concat(newData),'maintainTypeId');
          this.props.callback(uniqTableData)
          return{
            loading: false, 
            visible: false ,
            checkedKeys:[],
            checkedKeyArray:[],
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
      this.props.callback(arr);
    }
    //-----table行内修改--并向外传送
    changeTableRow = (value,record,keyName) =>{

      const arr = this.state.tableData;
      let v = keyName==="maintainResult" ? value: value.target.value;
      arr[arr.findIndex(item => item === record)][keyName]=v;
      this.props.callback(arr);
    }
    handleCancelTree = () => {//含清空tree勾选内容
      this.setState({ visible: false ,checkedKeys:[],checkedKeyArray:[]});
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
    changeOneModule =(value,key)=>{
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

    //*******************************************/
    disabledStartDate = (startValue) => {
      const endValue = this.state.data.endMaintainDate;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    }
  
    disabledEndDate = (endValue) => {
      const startValue = this.state.data.maintainDate;
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    }
    onChange = (field, value) => {
      let options = {
        [field]:value
      }
      this.setState({
        data:Object.assign(this.state.data,options)
      });
    }
    onStartChange = (value) => {
      this.onChange('maintainDate', value);
    }
    onEndChange = (value) => {
      this.onChange('endMaintainDate', value);
    }
    onPrint = () => {
      window.open(`${upkeep.printMaintain}?maintainGuid=${this.props.maintainGuid}`)
    } 
    /* 附件上传相关内容 */
    normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
    initAccessoryFormat =( backData , field)=>{
      if(backData){
        let accList=backData[field];
        if(Array.isArray(accList)){
          return accList
        }else if(accList){
          let list = accList.split(';');//
          let retList = []
          list.map((item,index)=>{
            if(item!==""){
              let Item =  {
                    uid: index,
                    key:index,
                    name: `${item.split('/')[item.split('/').length-1]}`,
                    status: 'done',
                    url: `${FTP}${item}`,
                    thumbUrl: `${FTP}${item}`
              }
              if(`.${item.split('.')[item.split('.').length-1]}`===".pdf"){
                Item.thumbUrl=require('../../../assets/fujian.png')
              }
              
              retList.push(Item)
            }
            return item 
          })
          return retList
        }else{
          return []
        }
      }else{
        return []
      }
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
      const { getFieldDecorator, getFieldsValue , getFieldValue } = this.props.form;
      const { checkedKeyArray ,prjTableData ,selectDropData , data , editState , visible, loading , tableData
      ,previewVisible, previewImage , upKeepPerson , servicePerson} = this.state;
      const options = selectDropData.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>);
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          render:(text, record, index) => index + 1
        },
        {
          title: '操作',
          dataIndex: 'maintainOrderDetailGuid',
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
          dataIndex: 'templateTypeName',
        },
        {
          title: '结果',
          dataIndex: 'maintainResult',
          width:250,
          render:(text,record)=>{
            if(editState){
              return( <Select 
                  defaultValue='请选择结果'
                  value={record.maintainResult}
                   name='maintainResult' 
                  onSelect={(value)=>this.changeTableRow(value,record,'maintainResult')}>
                  <Option value="00">合格</Option>
                  <Option value="01">不合格</Option>
                  <Option value="02">保养后合格</Option>
                </Select>)
              }else{
                return UnStateTable(upkeepDetailsTable[record.maintainResult].text)
              }
          }
        },
        {
          title: '备注',
          dataIndex: 'tfRemark',
          render:(text,record)=>{
            if(editState){
                return(
                  <Input value={record.tfRemark} onChange={(e)=>this.changeTableRow(e,record,'tfRemark')} />
                )
            }else{
              return UnStateTable(record.tfRemark)
            }
            
          }
        },
      ]
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { showPrint } = this.props;//已完成状态 显示打印按钮
      const showPrintToggle = showPrint && data.fstate==='01';
      return (
        <Form>
          <Card title="资产信息" bordered={false} 
          extra={showPrintToggle?(
            <Button type='primary' style={{float: 'right'}} onClick={this.onPrint}>打印</Button>
          ):null}>
              <Row>
                  <Col span={8} >
                      {editState ? 
                        <FormItem label='资产编号' {...formItemLayout} style={{marginBottom:0}}>
                            {getFieldDecorator(`assetsRecord`,{initialValue:data.assetsRecord})(
                                <Input placeholder="请输入并搜索" onPressEnter={this.doSerach}/>
                            )}
                        </FormItem>
                        : UnStateText('资产编号',data.assetsRecord)
                      }
                  </Col>
                  <Col span={0} >
                        <FormItem>
                            {getFieldDecorator(`assetsRecordGuid`,{initialValue:data.assetsRecordGuid})(
                              <Input placeholder="AS171218000002"/>
                            )}
                        </FormItem>
                  </Col>
                  <Col span={8}>
                        {UnStateText('资产名称',data.equipmentStandardName)}
                  </Col>
              </Row>    
              <Row>
                  <Col span={8}>
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
                    {UnStateText('保养分类',data.maintainType)}
                  </Col>
                  <Col span={8}>
                    {UnStateText('保养周期',data.maintainDay)}
                  </Col>
              </Row>
          </Card>

          <Card title="保养信息" bordered={false} style={{marginTop:30}}>
              <Row>
                <Col span={8}>
                  {
                    editState ?
                    <FormItem label='保养模式' {...formItemLayout}>
                    {getFieldDecorator(`maintainMode`,{initialValue:data.maintainMode?data.maintainMode:'01'})(
                      <Select placeholder='请选择' style={{ width: 200 }}>
                        <Option value="01">管理科室保养</Option>
                        <Option value="02">临床科室保养</Option>
                        <Option value="03">服务商保养</Option>
                      </Select>
                    )}
                    </FormItem>
                    :
                    UnStateText('保养模式',upKeepMode[data.maintainMode])
                  }
                </Col>
                <Col span={8}>
                  {
                    UnStateText('保养类型',getFieldsValue(['maintainMode']).maintainMode === '03'?'外保': '内保')
                  }
                </Col>
                <Col span={8}>
                  {//保养执行科室
                    this._filterDept(getFieldValue('maintainMode')||data.maintainMode)
                  }
                </Col>
                </Row>
                <Row>
                <Col span={8}>
                  {editState ? 
                    <FormItem label='临床风险等级' {...formItemLayout}>
                    {getFieldDecorator(`clinicalRisk`,{initialValue:data.clinicalRisk})(
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

                  {
                        getFieldValue('maintainMode')!=="03"  ? editState ? 
                        <FormItem label='保养人' {...formItemLayout}>
                        {getFieldDecorator(`engineerUserid`,{
                          initialValue:data && upKeepPerson.length>0?data.engineerUserid:'',
                          rules:[{required:true,message:'请选择保养人'}]
                        })(
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            onSelect={(input, option)=>{
                              console.log(option)
                              this.props.form.setFieldsValue({engineerName:option.props.children})
                            }}
                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                          >
                            {//-${item.RN}
                              upKeepPerson.map(item=>(<Option value={`${item.value}`} key={item.RN}>{`${item.userName?item.userName:''}${item.deptName?`-${item.deptName}`:''}`}</Option>))
                            }
                          </Select>
                        )}
                        </FormItem>
                        : data.maintainMode!=="03" ? UnStateText('保养人',data.engineerName):UnStateText('服务商',data.serviceName)
                        :null
                  }

                  {
                      getFieldValue('maintainMode')==="03" ? editState ? 
                      <FormItem label='服务商' {...formItemLayout}>
                        {getFieldDecorator(`serviceId`,{
                          initialValue:servicePerson.length>0?data.serviceId:"",
                          rules:[{required:true,message:'请选择服务商'}]
                        })(
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            onSelect={(input, option)=>{
                              console.log(option)
                              this.props.form.setFieldsValue({serviceName:option.props.children})
                            }}
                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                          >
                            {
                              servicePerson.map(item=>(<Option value={item.value} key={item.value}>{item.text}</Option>))
                            }
                          </Select>
                        )}
                      </FormItem>
                      :data.maintainMode!=="03" ? UnStateText('保养人',data.engineerName):UnStateText('服务商',data.serviceName)
                      :null
                  } 
                </Col>
                <Col span={0}>
                  <FormItem label='保养人Name' {...formItemLayout}>
                  {getFieldDecorator(`engineerName`,{initialValue:data.engineerName})(
                    <Input />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                {editState ? 
                    <FormItem label='开始保养时间' {...formItemLayout}>
                      {getFieldDecorator(`maintainDate`,{
                        initialValue:data.maintainDate?moment(data.maintainDate,'YYYY-MM-DD'):null,
                        rules:[
                          {required:true,message:'请选择开始保养时间'}
                        ]
                      })(
                        <DatePicker
                          disabledDate={this.disabledStartDate}
                          onChange={this.onStartChange}
                          format={"YYYY-MM-DD"}
                          style={{ width: 200 }}
                          placeholder="请选择开始保养时间"
                        /> 
                      )}
                    </FormItem>
                    : UnStateText('开始保养时间',data.maintainDate?moment(data.maintainDate).format('YYYY-MM-DD'):"")
                  }
                </Col>
                <Col span={8}>
                  {editState ?
                    <FormItem label='结束保养时间' {...formItemLayout}>
                    {getFieldDecorator(`endMaintainDate`,{
                      initialValue:data.endMaintainDate?moment(data.endMaintainDate,'YYYY-MM-DD'):null,
                      rules:[
                        {required:true,message:'请选择开始保养时间'}
                      ]})(
                      <DatePicker
                        disabledDate={this.disabledEndDate}
                        onChange={this.onEndChange}
                        format={"YYYY-MM-DD"}
                        style={{ width: 200 }}
                        placeholder="请选择结束保养时间"
                      /> 
                    )}
                    </FormItem>
                    : UnStateText('结束保养时间',data.endMaintainDate?moment(data.endMaintainDate).format('YYYY-MM-DD'):"")                  
                  }
                </Col>
                <Col span={8}>
                  {editState ?
                    <FormItem label='下次保养时间' {...formItemLayout}>
                    {getFieldDecorator(`nextMaintainDate`,{
                      initialValue:data.nextMaintainDate?moment(data.nextMaintainDate,'YYYY-MM-DD'):null,
                    })(
                      <DatePicker
                        format={"YYYY-MM-DD"}
                        placeholder="请选择下次保养时间"
                      /> 
                    )}
                    </FormItem>
                    : UnStateText('下次保养时间',data.nextMaintainDate?moment(data.nextMaintainDate).format('YYYY-MM-DD'):"")
                  }
                </Col>
              </Row>
              <Row>
                  <Col span={21}>
                    {editState ?
                      <FormItem label='备注（可选）' {...formItemRowLayout}>
                      {getFieldDecorator(`remark`,{initialValue:data.remark})(
                        <TextArea placeholder='请输入备注' style={{resize:'none',height:120}} maxLength={500}></TextArea>
                      )}
                      </FormItem>
                      : UnStateText('备注（可选）',data.remark)
                    }
                  </Col>
              </Row>
              <Row>
                <Col className="clearfix" span={21}>
                    <FormItem label='上传附件' {...formItemRowLayout}>
                      {getFieldDecorator(`tfAccessoryList`,{
                        initialValue:this.initAccessoryFormat(data,'tfAccessoryList')||[],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                      })(//
                          <Upload
                            showUploadList={{
                              showRemoveIcon:editState
                            }}
                            action={upkeep.uploadFile}
                            listType="picture-card"
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            beforeUpload={this.beforeUpload}
                          >
                            {editState ? uploadButton : null}
                          </Upload>
                      )}
                    </FormItem>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Col>
              </Row>
          </Card>
          
          <Card title="项目信息" bordered={false} style={{marginTop:30}}>
             <Row><Button type="primary"  onClick={this.toggleTree} disabled={!editState}>选择项目</Button></Row>
             <Row>
              <Table  ref='tableItem' rowKey={'maintainTypeId'} columns={columns} dataSource={tableData} size="middle"  style={{marginTop:15}}>
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
                          // mode="combobox"
                          placeholder='请搜索选择保养项目'
                          defaultActiveFirstOption={false}
                          filterOption={false}
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
                        selectedRowKeys:checkedKeyArray,
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setState({
                            'checkedKeys':selectedRows,
                            'checkedKeyArray':selectedRowKeys
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

export default Form.create()(AddUpKeepForm)

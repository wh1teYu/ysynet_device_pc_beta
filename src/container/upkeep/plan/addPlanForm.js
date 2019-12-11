import React from 'react'
import moment from 'moment';
import { Table , message ,  Row, Col, Input,Card ,Form, Button  ,Select ,DatePicker ,Modal, Upload, Icon, Tag } from 'antd'
import { maintainModeType, upkeepResult } from '../../../constants';
import request from '../../../utils/request';
import { FTP } from '../../../api/local';
import querystring from 'querystring';
import upkeep from '../../../api/upkeep';
import basicdata from '../../../api/basicdata';
import _ from 'lodash';
const { TextArea } = Input;
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
      afterSelectValue: '',
      upKeepPerson: [],
    };

    componentWillMount =() =>{
        const { editState, maintainPlanDetailId } =this.props;
        //获取资产编号相关信息
        if(maintainPlanDetailId){
          this.getDetailAjax({ maintainPlanDetailId: maintainPlanDetailId  })
        }
        this.getOneModule();
        this.setState({
          editState:editState,
        });
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
            //拿到回显数据--处理时间格式
            retData.maintainDate=moment(retData.maintainDate,'YYYY-MM-DD')
            if(retData.loopFlag==="01"){//如果该数据为循环的数据-则如下处理
              retData.endMaintainDate=moment(retData.endMaintainDate,'YYYY-MM-DD')
            }
            let tabledata =data.result.typeList;
            this.setState({
              afterSelectValue: retData.tfCycleType,
              cycleModule: retData.loopFlag, //循环方式
              data:retData,
              tableData:tabledata 
            });
            if(this.props.maintainData){
              this.props.maintainData(retData);
            }
            if(this.state.editState){this.props.callback(this.getKey(tabledata))}
            //获取第一个板块的信息内容
            this.getAssetInfoAjax(retData.assetsRecord)//assetsRecord
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
      array.forEach(ele => {
        let json = {};
        json.maintainTypeId = ele.maintainTypeId;
        json.maintainResult = ele.maintainResult;
        json.tfRemark = ele.tfRemark
        a.push(json)
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
    
    /* 附件上传相关内容 */
    normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
    disabledStartDate = (startValue) => {
      const endValue = this.state.data.endMaintainDate;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    }

    //*******************************************/

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

    //*******************************************/

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

    initAccessoryFormat =( backData , field)=>{
      if(backData){
        let accList=backData[field];
        if(Array.isArray(accList)){
          return accList
        }else if(accList){
          let list = accList;//.split(';')
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
    resultChange = (value,record,index) =>{
      let { tableData } = this.state;
      tableData[index].maintainResult = value;
      console.log(value, record, index, 'record');
      this.setState({ tableData })
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const {  selKey  , prjTableData ,selectDropData , data , editState , visible, loading , tableData, upKeepPerson } = this.state;
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
          width: 200,
          dataIndex: 'maintainTypeName',
        },
        {
          title: '结果',
          width: 150,
          dataIndex: 'maintainResult',
          render: (text,record,index) => {
            return (
              <Select 
                placeholder='请选择结果'
                onChange={(value) => this.resultChange(value,record,index)}
              >
                {
                  upkeepResult.map((item,index) => <Option key={index} value={item.value}>{item.text}</Option>)
                }
              </Select>
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'tfRemark',
          width: 200
        }
      ]
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传图片</div>
        </div>
      );

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

      return (
        <Form>
          <Card title="资产信息" bordered={false} >
              <Row>
                  <Col span={8}>
                    {
                      UnStateText('资产编号',data.assetsRecord)
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
                  <Row style={{padding:'10px 0px'}}>
                    <Col span={8} style={{textAlign: 'right',paddingRight:8}}>{`保养模式`} :</Col>
                    <Col span={16}>{data.maintainMode ? maintainModeType[data.maintainMode].text: ''}</Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row style={{padding:'10px 0px'}}>
                    <Col span={8} style={{textAlign: 'right',paddingRight:8}}>{`保养类型`} :</Col>
                    <Col span={16}>{data.maintainType === '00'?'内保':data.maintainModeType === '01'?'外保':''}</Col>
                  </Row>
                </Col>
                <Col span={8}>
                  {
                    UnStateText('保养执行科室',data.executeDeptName)
                  }
                </Col>
                <Col span={8}>
                  {editState ? 
                    // <FormItem label='临床风险等级' {...formItemLayout}>
                    // {getFieldDecorator(`clinicalRisk`,{initialValue:data.clinicalRick})(
                    //   <Select placeholder='请选择' style={{ width: 200 }}>
                    //     <Option value="">请选择</Option>
                    //     <Option value="02">高</Option>
                    //     <Option value="01">中</Option>
                    //     <Option value="00">低</Option>
                    //   </Select>
                    // )}
                    // </FormItem>
                    UnStateText('临床风险等级',data.clinicalRisk)
                    :
                    ''
                  }
                </Col>
                <Col span={8}>
                  {editState ? 
                    <FormItem label='保养人' {...formItemLayout}>
                    {getFieldDecorator(`engineerUserid`,{
                      initialValue:data.engineerUserid,
                      // rules:[{required:true,message:'请选择保养人'}]
                    })(
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        optionFilterProp="children"
                        onSelect={(input, option)=>{
                          console.log(option);
                          this.props.engineerName(option.props.children)
                          // this.props.form.setFieldsValue({engineerName:option.props.children})
                        }}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      >
                        {
                          upKeepPerson.map(item=>(<Option value={`${item.value}-${item.RN}`} key={item.RN}>{`${item.userName?item.userName:''}${item.deptName?`-${item.deptName}`:''}`}</Option>))
                        }
                      </Select>
                    )}
                    </FormItem>
                    :UnStateText('保养人',data.engineerName)
                  }
                </Col>
                <Col span={8}>
                {editState ? 
                    <FormItem label='开始保养时间' {...formItemLayout}>
                      {getFieldDecorator(`maintainDate`,{
                        initialValue:data.maintainDate || null,
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
                    : UnStateText('开始保养时间',moment(data.maintainDate).format('YYYY-MM-DD'))
                  }
                </Col>
                <Col span={8}>
                  {editState ?
                    <FormItem label='结束保养时间' {...formItemLayout}>
                    {getFieldDecorator(`endMaintainDate`,{
                      initialValue:data.endMaintainDate  || null,
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
                    : UnStateText('结束保养时间',moment(data.endMaintainDate).format('YYYY-MM-DD'))                  
                  }
                </Col>
                <Col span={8}>
                  {editState ?
                    <FormItem label='下次保养时间' {...formItemLayout}>
                    {getFieldDecorator(`nextMaintainDate`,{initialValue:data.nextMaintainDate})(
                      <DatePicker
                        format={"YYYY-MM-DD"}
                        placeholder="请选择下次保养时间"
                      /> 
                    )}
                    </FormItem>
                    : UnStateText('下次保养时间',moment(data.nextMaintainDate).format('YYYY-MM-DD'))
                  }
                </Col>
              <Col span={21}>
                {
                  editState?
                  <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} label={`备注（可选）`}>
                    {
                      getFieldDecorator(`remark`,{
                        initialValue: data.remark
                      })(
                        <TextArea rows={4} maxLength={200} placeholder='请输入备注'/>
                      )
                    }
                  </FormItem>
                  :
                  ''
                }
              </Col>
              <Col className="clearfix" span={21}>
                <FormItem label='上传附件' labelCol={{ span: 3 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator(`tfAccessoryList`,{
                    initialValue: this.initAccessoryFormat(data,'tfAccessoryList')||[],
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(//
                      <Upload
                        
                        showUploadList={{
                          showRemoveIcon: editState
                        }}
                        action={upkeep.uploadFile}
                        listType="picture-card"
                        // onPreview={this.handlePreview}
                        // onChange={this.handleChange}
                        beforeUpload={this.beforeUpload}
                      >
                        {editState ? uploadButton : null}
                      </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>
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

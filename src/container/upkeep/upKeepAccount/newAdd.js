/**
 * @file 保养管理 - 新增计划
 * @author Vania
 * @since 2018-03-21 14:00:00
 * @version 1.0.0
 */
import React, { PureComponent } from 'react';
import { Card, Row, Col, Form, Input, Tooltip, DatePicker, Icon, Button, Modal,Table,Affix,
  Select, Radio, Layout ,message } from 'antd';
import querystring from 'querystring';
import TableGrid from '../../../component/tableGrid';
import request from '../../../utils/request';
import upkeep from '../../../api/upkeep';
import basicdata from '../../../api/basicdata';
import assets from '../../../api/assets';
import _ from 'lodash';
import moment from 'moment';
import { productTypeData } from '../../../constants';
import styles from '../newplan/style.css';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const RangePicker = DatePicker.RangePicker;
/* 表单布局样式 */ 
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
/** 表头 */
/** 选择资产弹窗的modal */
const productColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    render:(text,record,index)=> <span>{`${index+1}`}</span>
  },
  {
    title: '资产编号',
    dataIndex: 'assetsRecord',
    sorter:true
  },
  {
    title: '设备名称',
    dataIndex: 'equipmentStandardName',
  },
  {
    title: '型号',
    dataIndex: 'fmodel',
  },
  {
    title: '规格',
    dataIndex: 'spec',
  },
  {
    title: '设备分类',
    dataIndex: 'productType',
    render: text => text ?  productTypeData[text].text  : null
  },
  {
    title: '使用科室',
    dataIndex: 'useDept',
  },
  {
    title: '有效保养计划',
    dataIndex: 'planNum',
  },
]
const prjColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    render:(text,record,index)=> <span>{`${index+1}`}</span>
  },
  {
    title: '项目名称',
    dataIndex: 'templateTypeName',
  },
]

class MaintainPlan extends PureComponent {
  
  state={
    cycleModule:'00',
    detpSel:[],//资产 选择科室  下拉框内容
    selectDropData:[],//项目弹出层 下拉框内容
    prjTableData:[],//项目弹出层  下拉框带出对应table内容
    prjVisible:false,//项目新增弹窗内容
    productVisible:false,//产品可视内容
    selctParentKey:'',//存储做操作的产品KEY--将在这里插入children
    loading:false,
    ProductModalCallBackKeys:[],//选中保存数据的key
    ProductModalCallBack:[],//选择保养资产返回的数据
    ProductTabledata:[],//选择保养资产返回的数据
    CacheProductTabledata:[],//缓存
    projecrModalCallBack:[],//选择项目返回的数据
    treeData:[],//选择项目的树状结构
    prjCheckedKeys:[],//被选择的项目
    formatPrjData:[],
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    ProductType:'',//资产搜索条件
    useDeptGuid:'',//资产搜索条件
    useDeptGuidStr:'',
    mobile:'',
    PopconfirmVisible:false,//删除的确认窗
    prjSelect:'',//项目搜索条件
    disabled: false,
    afterSelectValue: '01' // 循环周期后缀默认值
  }
 
  componentWillMount = ()=>{
    this.getOneModule();//获取弹窗树状结构
    this.getDetpSelect();
  }

  //给添加的资产表格中的项目添加唯一的key,将父级GUID+自己GUID
  changeTreeData =(mock)=>{
    let a = _.cloneDeep(mock);
    _.forEach(a,function(item,index){
      let parentId = item.assetsRecord;
      // item.children = item.subList;
      // delete item.subList;
      _.forEach(item.subList,function(subItem,index){
        subItem.parentKey = parentId;
        subItem.assetsRecordGuid = parentId.toString() + subItem.templateDetailGuid;
      })
    })
    a = _.assign(a,this.state.CacheProductTabledata);
    _.forEach(a,function(item,index){
      _.uniqBy(item.subList,'maintainTypeId')
    });
    console.log(a,'aaaa')
    return a
  }
  showModal = (modalName,recordKey) => {
    if(modalName==='prjVisible'){
      this.setState({
        selctParentKey:recordKey
      })
    }else{
      setTimeout(()=>{
        this.refs.proTable.fetch()
      },300)
    }
    this.setState({
      [modalName]: true,
    });

  }
  handleOk = (modalName) => {
    if((modalName==='productVisible'&&this.state.ProductModalCallBackKeys.length!==0) || (modalName==='prjVisible'&&this.state.projecrModalCallBack.length!==0)){
      this.setState({ loading: true });
      setTimeout(() => {
        //设置
        if(modalName==='productVisible'){
          //1-在此处通过ProductModalCallBackKeys获取对应的树状结构-赋值给ProductTabledata-资产信息table
          this.productSubmitGetTree();
        }else{
          //2-处理选中的项目数据并赋值给formatPrjData之后 将该数据混合入ProductTabledata
          this.prjInsertParenTable();
        }
        this.setState({ loading: false, [modalName]: false });
      }, 1000);
    }else{
      message.warning('请选择项目之后再添加！')
    }
  }
  handleCancel = (modalName) => {
    if(modalName==='productVisible'){
      this.setState({ 
        ProductType:'',//资产搜索条件
        useDeptGuid:'',//资产搜索条件
        mobile:'',
        useDeptGuidStr:'',
        ProductModalCallBack:[],
        ProductModalCallBackKeys:[],
      });
    }else{
      this.setState({ 
        projecrModalCallBackKeys:[],
        prjSelect:'',
        prjTableData:[]
      });
    }
    this.setState({ [modalName]: false });
  }
  //1-在此处通过ProductModalCallBackKeys获取对应的树状结构-赋值给ProductTabledata-资产信息table
  productSubmitGetTree =()=>{
    let options = {
      body:querystring.stringify({'asstesGuids':this.state.ProductModalCallBackKeys}),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            'ProductTabledata':this.changeTreeData(data.result),
            ProductModalCallBack:[],
            ProductType:'',//资产搜索条件
            useDeptGuidStr:'',
            useDeptGuid:'',//资产搜索条件
            mobile:'',
            // ProductModalCallBackKeys:[],
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(upkeep.getAssetsListInfo,options)
  }
  //2-处理选中的项目数据并赋值给formatPrjData之后 将该数据混合入ProductTabledata
  prjInsertParenTable =()=>{
    let a  = _.cloneDeep(this.state.ProductTabledata);
    let parentKey = this.state.selctParentKey.assetsRecord;
    let pushData = _.cloneDeep(this.state.projecrModalCallBack);
    let ind = _.findIndex(a,{assetsRecord:parentKey})

    console.log('原有的children',a[ind].subList)
    if(ind !==-1){
      let children = [];
      _.forEach(pushData,function(item){
        item.parentKey = parentKey;
        item.assetsRecordGuid = parentKey.toString()+item.templateDetailGuid;
        children.push(item)
      })

      if(a[ind].subList){
        a[ind].subList = _.uniqBy( a[ind].subList.concat(children) ,'maintainTypeId' )
      }else{
        a[ind].subList = _.uniq(children)
      }

      
    }
    this.setState({
      ProductTabledata:a,
      CacheProductTabledata:a,//保存此次操作
      prjSelect:'',
      prjTableData:[],
      projecrModalCallBack:[],
      projecrModalCallBackKeys:[]
    })

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
    this.setState({prjSelect:value})
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
  //获取资产下拉框数据
  getDetpSelect = (value)=>{
    let o = '';
    if(value){
      o={deptName:value}
    }else{
      o=''
    }
    this.setState({'useDeptGuidStr':value})
    let options = {
      body:querystring.stringify(Object.assign({'deptType':'00'},o)),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
          this.setState({
            'detpSel':data.result
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(upkeep.selectUseDeptList,options)
  }
  setQuery = (value) =>{
    let o = this.state.detpSel.filter(item=>{
      return item.text ===value
    })[0];
    let v  = o ? o.value:'' ;
    this.setState({'useDeptGuid' :v,'useDeptGuidStr':value})
  }
  //此处为保存所有的新增计划表单
  handleSubmit =(status)=>{
    //此处提交所有搜集到的数据
    if(this.state.ProductTabledata.length<=0){
      message.warn('请至少添加一条产品！');
      return
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let json = {};
        let maintainPlan = values;
        if(values.loopFlag==="00"){//单次循环
          maintainPlan.maintainDate = moment(maintainPlan.maintainDate).format('YYYY-MM-DD');
        }else{
          maintainPlan.maintainDate = moment(maintainPlan.Date[0]).format('YYYY-MM-DD');
          maintainPlan.endMaintainDate = moment(maintainPlan.Date[1]).format('YYYY-MM-DD');
          maintainPlan.tfCycleType = this.state.afterSelectValue;
          delete maintainPlan.Date;//删除Date
        }
        //此处还需要继续做表格的数据添加
        json.maintainPlan = maintainPlan;
        json.assetsRecordGuidList = this.formatTableData(this.state.ProductTabledata);
        console.log(json)
        this.sendEndAjax(json)
      }
    });
  }
  /**
   * [{
	 *  assetsRecordGuid 资产id
	 *  maintainTypes; 保养项目id（集合）
	 * }]
  */
  formatTableData = (data)=>{
    let a = _.cloneDeep(data);
    let ret = [];
    _.forEach(a,function(item,index){
      let j ={}
      j.assetsRecordGuid = item.assetsRecordGuid;
      j.maintainTypes=[];
      _.forEach(item.subList,function(subItem,index){
        j.maintainTypes.push(subItem.maintainTypeId)
      })
      ret.push(j);
    })
    return ret;
  }

  sendEndAjax =(json)=>{
    console.log('send Ajax:',JSON.stringify(json))
    let options = {
      body:JSON.stringify(json),
      success: data => {
        if(data.status){
          message.success('新增成功');
          this.props.history.push('/upkeep/upKeepAccount')  
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(upkeep.insertMaintainPlan,options)
  }
  
  productQueryHandler =(value)=>{
      this.setState({
        mobile:value
      })
      let json ={
        ProductType:this.state.ProductType,
        useDeptGuid:this.state.useDeptGuid,
        mobile:value
      }
      this.refs.proTable.fetch(json)
  }

  deleteProRow =(isParent,record)=>{
    let a =_.cloneDeep(this.state.ProductTabledata);
    if(isParent){//如果是删除父级
      console.log(this.state.ProductModalCallBackKeys)
      let proSel = this.state.ProductModalCallBackKeys;
      _.remove(proSel,function(n){
        return n===record.assetsRecordGuid
      })
      this.setState({
        ProductModalCallBackKeys:proSel
      })
      _.remove(a,function(n){
        return n.assetsRecord===record.assetsRecord
      })
    }else{//如果删除子集
      let parentKey = record.parentKey;
      let ind = _.findIndex(a,{'assetsRecord':parentKey});
      if(ind!==-1){
        let prjSel = this.state.projecrModalCallBackKeys;
        _.remove(prjSel,function(n){
          return n===record.templateDetailGuid
        })
        console.log(prjSel)
        _.remove(a[ind].subList,function(item){
          return item.templateDetailGuid===record.templateDetailGuid
       })
      }
    }
    this.setState({
      ProductTabledata:a,
      CacheProductTabledata:a
    })
  }

  genAfterSelect = () =>{
    return (
      <Select 
        style={{ width: 70  }} 
        defaultValue={this.state.afterSelectValue} 
        onSelect={value => this.setState({ afterSelectValue: value })}
      >
        <Option value='01'>月</Option>{/* 月 */}
        <Option value='02'>天</Option>{/* 天 */}
      </Select>
    )
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render:(text,record,index)=>{return `${index+1}`}
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 200,
        render:(text,record,index)=>{
          if(record.templateDetailGuid){
            return (
              <span>
                <a onClick={()=>this.deleteProRow(false,record)}>删除</a>&nbsp;&nbsp;
              </span>
            )
          }else{
            return (
              <div>
                  <a onClick={()=>this.deleteProRow(true,record)}>删除</a>&nbsp;&nbsp;
                  <a onClick={()=>{this.showModal('prjVisible',record)}}>新增项目</a>
              </div>
            )
          }
        }
      },
      {
        title: '资产编号',
        dataIndex: 'assetsRecord',
        width: 200,
        sorter:true
      },
      {
        title: '资产名称/项目名称',
        dataIndex: 'equipmentStandardName',
        width: 200,
        render:(text,record,index)=>{
          if(record.equipmentStandardName){
            return (
              <span>
                {record.equipmentStandardName}
              </span>
            )
          }else{
            return (
              <span>
                {record.templateTypeName}
              </span>
            )
          }
        }
      },
      {
        title: '型号',
        dataIndex: 'spec',
        width: 100
      },
      {
        title: '规格',
        dataIndex: 'productType',
        width: 100
      },
      {
        title: '使用科室',
        dataIndex: 'useDept',
        width: 100
      }
    ];
    const { prjSelect , ProductModalCallBackKeys , projecrModalCallBackKeys ,ProductType ,
      useDeptGuidStr ,mobile , detpSel ,cycleModule , prjTableData , 
      selectDropData , productVisible , prjVisible , loading ,ProductTabledata } =this.state;
    const { getFieldDecorator } = this.props.form;
    //选择项目中的下拉框
    const options = selectDropData.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>);
    
    //选择资产弹窗中的科室sel
    const deptSelFn =detpSel.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>);
      
    const cycleModuleFn =(val)=>{
      if(val==='00'){
        return(
          <Col span={8}>
            <FormItem label={
              <Tooltip title="循环保养时用于首次保养时间">
                <span><Icon type="question-circle-o" style={{marginRight: 1}}/>保养时间</span>
              </Tooltip>} {...formItemLayout}>
                {getFieldDecorator(`maintainDate`,{
                  rules:[{
                    required:true,message:'请选择保养时间！'
                  }]
                })(
                <DatePicker />
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
                rules:[{
                  required:true,message:'请输入循环周期！'
                }]
              })(
                <Input placeholder="请输入循环周期" style={{width: 200}} addonAfter={this.genAfterSelect()}/>
              )}
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem label={
              <Tooltip title="循环保养时用于首次保养时间">
                <span><Icon type="question-circle-o" style={{marginRight: 1}}/>保养时间</span>
              </Tooltip>} {...formItemLayout}>
                {getFieldDecorator(`maintainDate`,{
                  rules:[{
                    required:true,message:'请选择保养时间！'
                  }]
                })(
                <DatePicker />
              )}
            </FormItem>
          </Col>
            <Col span={8}>
              <FormItem label={`提前生成保养单`} {...formItemLayout}>
                {getFieldDecorator(`advancePlan`,{
                  rules:[{
                    required:true,message:'请输入天数！'
                  }]
                })(
                  <Input placeholder="请输入天数" style={{width: 200}} addonAfter={'天'}/>
                )}
              </FormItem>
            </Col>
            <Col span={8} >
              {/* maintainDate - endMaintainDate*/}
              <FormItem
                {...formItemLayout}
                label="保养计划有效期"
              >
                {getFieldDecorator('Date',{
                  rules:[{
                    required:true,message:'请填写保养计划有效期！'
                  }]
                })(
                  <RangePicker style={{width:250}}/>
                )}
              </FormItem>
            </Col>
          </div>
        )
      }
    }

    const subColumnsData = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 50,
        render:(text,record,index)=>{return `${index+1}`}
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 50,
        render:(text,record,index)=>{
          return (
            <span>
              <a onClick={()=>this.deleteProRow(false,record)}>删除</a>
            </span>
          )
        }
      },
      {
        title: '项目名称',
        dataIndex: 'templateTypeName',
        key: 'name',
        width: 150,
        render: text => <span title={text}>{text}</span>,
      },
    ];
    return (
      <Content className='ysynet-content' style={{background:'none'}}>
      <Affix>
        <div style={{background:'#fff',padding:'10px 20px',marginBottom:10,display:'flex',alignContent:'center',justifyContent:'flex-end'}}>
          <Button type="primary" onClick={()=>this.handleSubmit('02')}>保存</Button>
        </div>
      </Affix>

        <Card title="计划信息" bordered={false} className='min_card'>
          <Form>
            <Row>
              <Col span={8}>
                <FormItem label={`保养模式`} {...formItemLayout}>
                  {
                    getFieldDecorator(`maintainMode`,{
                      initialValue: '01'
                    })(
                      <Select onSelect={value  => this.props.form.setFieldsValue({ 'maintainType': value === '03'? '01': '00' })}>
                        <Option value={'01'}>管理科室保养</Option>
                        <Option value={'02'}>临床科室保养</Option>
                        <Option value={'03'}>服务商保养</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`保养类型`} {...formItemLayout}>
                  {getFieldDecorator(`maintainType`, {
                    initialValue: '00'
                  })(
                    <RadioGroup>
                      {
                        this.props.form.getFieldValue('maintainMode') !== '03'
                        ?
                        <RadioButton value="00">内保</RadioButton>
                        :
                        <RadioButton value="01">外保</RadioButton>
                      }
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              {/* <Col span={8}>
                <FormItem label={`计划名称`} {...formItemLayout}>
                  {getFieldDecorator(`maintainPlanName`,{
                    rules:[
                      {required:true,message: '请输入计划名称',}
                    ]
                  })(
                    <Input placeholder="请输入计划名称" style={{width: 200}}/>
                  )}
                </FormItem>
              </Col> */}
              <Col span={8}>
                <FormItem label={`临床风险等级`} {...formItemLayout}>
                  {getFieldDecorator(`clinicalRisk`,{
                    rules:[
                      {required:true,message: '请选择临床风险等级',}
                    ]
                  })(
                    <Select allowClear style={{width: 200}} placeholder='请选择'>
                      <Option value={'00'}>低</Option>
                      <Option value={'01'}>中</Option>
                      <Option value={'02'}>高</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={`循环方式`} {...formItemLayout}>
                  {getFieldDecorator(`loopFlag`, {
                    initialValue: '00',
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
              </Col>
              {cycleModuleFn(cycleModule)}
            </Row>
          </Form>
        </Card>

        <Card title='资产信息' bordered={false} style={{marginTop: 20}} className='min_card'>
          <Button type='primary' style={{marginBottom: 12}} onClick={()=>this.showModal('productVisible')}>添加产品</Button>
          {/*资产信息表格*/}
          <Table 
            columns={columns} 
            scroll={{x: '130%' }}
            rowKey={'assetsRecordGuid'}
            onExpand={(expanded, record) => console.log(expanded, record)}
            dataSource={ProductTabledata } 
            expandedRowRender={(record)=>{

              if(record.subList && record.subList.length!==0){
                return(
                  <Table
                    rowKey='maintainTypeId'
                    columns = {subColumnsData}
                    dataSource={record.subList}
                  ></Table>
                )
              }else{
                return(<p>暂无数据</p>)
              }
              
            }}
           />
        </Card>

        {/*选择资产弹窗*/}
        <Modal
          visible={productVisible}
          title="选择要保养的资产"
          width='900px'
          onOk={()=>this.handleOk('productVisible')}
          onCancel={()=>this.handleCancel('productVisible')}
          footer={null}
        >
          <Row>
            <Col className={styles.mbLarge} span={20}>
              <Select name="ProductType" value={ProductType} onChange={(v)=>{this.setState({ProductType:v}) }} style={{ width: 150 }} className={styles.mrLarge}>
                <Option value="">全部分类</Option>
                <Option value="01">通用设备</Option>
                <Option value="02">电气设备</Option>
                <Option value="03">电子产品及通信设备</Option>
                <Option value="04">仪器仪表及其他</Option>
                <Option value="05">专业设备</Option>
                <Option value="06">其他</Option>
              </Select>
              
              <Select
                mode="combobox"
                placeholder="选择使用科室"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.getDetpSelect}
                onSelect={this.setQuery}
                value={useDeptGuidStr}
                style={{ width: 150,marginRight:15 }} 
              >
                <Option key='' value=''> &nbsp;</Option>
                {deptSelFn}
              </Select>
              <Search
                placeholder="请输入设备编号/名称"
                onChange={(v)=>{this.setState({mobile:v.target.value})}}
                onSearch={ value =>  this.productQueryHandler(value) }
                style={{ width: 300 }}
                enterButton="搜索"
                value={mobile }
              />
            </Col>
            <Col span={4} style={{textAlign:'right'}}>
              <Button key="submit" type="primary" loading={loading} onClick={()=>this.handleOk('productVisible')}>
                添加
              </Button>
            </Col>
          </Row>
          <RemoteTable
              ref='proTable'
              query={{}}
              showHeader={true}
              url={assets.selectAssetsIsNormalUseList}
              scroll={{x: '100%' }}
              columns={productColumns}
              rowKey={'assetsRecordGuid'}
              size="small"
              rowSelection={{
                selectedRowKeys:ProductModalCallBackKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                  this.setState({
                    'ProductModalCallBack':selectedRows,
                    'ProductModalCallBackKeys':selectedRowKeys
                  })
                },
                getCheckboxProps: record => ({
                  disabled: record.name === 'Disabled User', // Column configuration not to be checked
                  name: record.name,
                }),
              }}
            /> 
        </Modal>

         {/*选择项目*/}
         <Modal
            visible={prjVisible}
            title="选择项目"
            onOk={()=>this.handleOk('prjVisible')}
            onCancel={()=>this.handleCancel('prjVisible')}
            footer={null}
          >
          <Row>
            <Col className={styles.mbLarge}>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                defaultValue='请搜索选择保养项目'
                className={styles.mrLarge}
                value={prjSelect}
                onSearch={this.getOneModule}
                onSelect={this.changeOneModule}
                style={{ width: 250,marginBottom:15 }} 
              >
                {options}
              </Select>
              <Button key="submit" type="primary" loading={loading} onClick={()=>this.handleOk('prjVisible')}>
                添加
              </Button>
            </Col>
          </Row>
          <Table 
            rowKey={'templateDetailGuid'}
            size={'small'}
            rowSelection={{
              selectedRowKeys:projecrModalCallBackKeys,
               onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                  'projecrModalCallBack':selectedRows,
                  'projecrModalCallBackKeys':selectedRowKeys
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
      </Content>  
    )
  }

}

export default Form.create()(MaintainPlan);
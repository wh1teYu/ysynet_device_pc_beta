/*
 * @Author: yuwei 借用申请 - 新增
 * @Date: 2018-09-25 21:11:11 
* @Last Modified time: 2018-09-25 21:11:11 
 */
import React , { PureComponent } from 'react'
import { Button, Select , message , Row, Col , Table , Modal, Layout, Form, DatePicker, Input , Affix , Tooltip , Icon } from 'antd';
import TableGrid from '../../../component/tableGrid';
import ledgerBorrow from '../../../api/ledgerBorrow';
import request from '../../../utils/request';
import queryString from 'querystring';
import Style from './style.css';
import _ from 'lodash';
import moment from 'moment';
const { RemoteTable } = TableGrid;
const {Content} = Layout;
const { Option } = Select;
const { TextArea , Search } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
      xs: {span: 24},
      sm: {span: 6}
  },
  wrapperCol: {
      xs: {span: 24},
      sm: {span: 16}
  }
}
const sigleFormItemLayout ={
  labelCol: {
    xs: {span: 24},
    sm: {span: 2}
  },
  wrapperCol: {
      xs: {span: 24},
      sm: {span: 16}
  }
}
class BorrowApplyDetails extends PureComponent {

  state={
    useSelect:[],//借用科室
    outSelect:[],//借出科室
    dataSource:[],
    visible:false,
    modalQuery:null//弹窗查询条件 - 借出科室guid
  }

  componentDidMount(){
    request(ledgerBorrow.selectUseDeptList, {     //借出科室
      body: queryString.stringify({ deptType: "00" }),
      headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
          let outSelect = [...data.result];
          this.setState({ outSelect });
      },
      error: (err) => console.log(err)
    });
    request(ledgerBorrow.queryUserDeptListByUserId, {     //借用
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (data) => {
            let useSelect = [...data.result];
            this.setState({ useSelect });
        },
        error: (err) => console.log(err)
    });
  }

  onSubmit = () => {
    const { dataSource }  = this.state;
    if(dataSource.length>0){
      this.props.form.validateFieldsAndScroll((errs,values)=>{
        if(!errs){
          if(values.estimateBack){
            values.estimateBack = moment(values.estimateBack).format('YYYY-MM-DD HH:mm')
          }else{
            delete values['estimateBack']
          }
          values.borrowType="02";
          let assetsRecordGuids  = this.state.dataSource.map((item)=>{
            return item.assetsRecordGuid
          })
          console.log(JSON.stringify({...values,assetsRecordGuids}))
          request(ledgerBorrow.addBorrow,{
            body:queryString.stringify({...values,assetsRecordGuids}),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
              if(data.status){
                message.success('操作成功')
                const { history } = this.props;
                history.push('/ledgerBorrow/borrowApply')
             }else{
               message.warning(data.msg)
             }
            },
            error: err => {console.log(err)}
          })
        }
      })
    }else{
      message.warning('请至少选择一条资产进行保存！')
    }
  }



  //选择添加到主表中
  onAddDataSource = (data) => {
    console.log(data)
    const { dataSource } = this.state;
    let retArr = _.uniqBy(data.concat(dataSource),'RN')
    console.log(retArr)
    this.setState({visible:false,dataSource:retArr})
  } 

  //删除
  deleteDSource  = (index)=> {
    let { dataSource } = this.state;
    let retDs = [].concat(dataSource);
    retDs.splice(index,1)
    this.setState({
      dataSource:retDs
    })
  }
  //打开选择资产弹窗前
  openAssetModal = () => {
    this.props.form.validateFieldsAndScroll(['lendDeptGuid'],(err,values)=>{
      if(!err){
        this.setState({visible:true,modalQuery:values});
      }else{
        message.warning('请先选择借出科室！')
      }
    })
  }



  render(){
    const { getFieldDecorator } = this.props.form;
    const { dataSource , visible , outSelect ,useSelect ,modalQuery } = this.state;
    const columns =[
      {
        title: '序号',
        dataIndex: 'index',
        render:(text,record,index)=>`${index+1}`
      },{
        title: '资产编号',
        dataIndex: 'assetsRecord',
      },{
        title: '资产名称',
        dataIndex: 'equipmentStandardName',
      },{
        title: '型号',
        dataIndex: 'fmodel',
      },{
        title: '规格',
        dataIndex: 'spec',
      },{
        title: '管理科室',
        dataIndex: 'bDeptName',
      },{
        title: '租赁单价',
        dataIndex: 'rentingPrice',
        render:(text)=>text?Number(text)?Number(text).toFixed(2):text:text
      },{
        title: '操作',
        dataIndex: 'action',
        render:(text,record,index)=>(
          <a onClick={()=>this.deleteDSource(index)}>删除</a>
        )
      }
    ]
    return( 
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <Affix offsetTop={0}>
          <div style={{textAlign: 'right'}}>
            <Button type='primary' className={Style.buttonGap} onClick={this.onSubmit}> 保存</Button>
          </div>
        </Affix>
        <h3>申请信息</h3>
        <Form>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="借用科室"
                >
                {getFieldDecorator('deptGuid', {
                  rules: [ {
                    required: true, message: '请选择借用科室',
                  }],
                })(
                  <Select
                    showSearch
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    optionFilterProp="children"
                    placeholder="请选择借用科室"
                    >
                      {useSelect.map( d => <Option value={d.value} key={d.text} >{d.text}</Option> )}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    借出科室&nbsp;
                    <Tooltip title="资产使用科室">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
                >
                {getFieldDecorator('lendDeptGuid', {
                  rules: [ {
                    required: true, message: '请选择借出科室',
                  }],
                })(
                  <Select
                    showSearch
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    optionFilterProp="children"
                    placeholder="请选择借出科室"
                    >
                      {outSelect.map( d => <Option value={d.value} key={d.text} >{d.text}</Option> )}
                  </Select>
                )}
              </FormItem>
            </Col>    
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='借用人'
                >
                {getFieldDecorator('borrowUserName')(
                  <Input placeholder='请输入'/>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...sigleFormItemLayout}
                label='预计归还时间'
                >
                {getFieldDecorator('estimateBack',{
                  rules:[{
                    required:true,message:'请选择预计归还时间'
                  }]
                })(
                  <DatePicker />
                )}
              </FormItem>
            </Col>   
            <Col span={24}>
              <FormItem
                {...sigleFormItemLayout}
                label='借用原因'
                >
                {getFieldDecorator('borrowCause')(
                  <TextArea />
                )}
              </FormItem>
            </Col> 
          </Row>
        </Form>
        <h3>借用资产信息</h3>     
        <Row>
          <Button type='primary' style={{marginBottom: 12}} onClick={()=>this.openAssetModal()  }>选择资产</Button>
        </Row>   
        <Table
          rowKey='RN'
          columns={columns}      
          dataSource={dataSource}
        />
        <Modal
          footer={null}
          width={980}
          onCancel={()=>this.setState({visible:false})}
          visible={visible}>
          {
            visible?
            (
              <SearchFormWapper ref='searchWapper' 
              modalQuery={modalQuery}
              onCancel={()=>this.setState({visible:false})}
              cb={(data)=>this.onAddDataSource(data)}></SearchFormWapper>
            )
            :null
          }
        </Modal>
              
      </Content>
    )
  }

}

export default Form.create()(BorrowApplyDetails);

class SearchForm extends PureComponent {


  state={
    query:this.props.modalQuery,
    selectedRowKeys:[],
    selectedRows:[],
    toggle:false
  }

  //弹窗- 确认
  getSelectSource = () => {
    const { selectedRows } = this.state;
    this.props.cb(selectedRows)
    this.setState({selectedRows:[],selectedRowKeys:[]})
  }
  //弹窗- 取消
  onCancel = () =>{
    this.props.onCancel()
    this.setState({selectedRows:[],selectedRowKeys:[]})
  }

  //toggle
  toggle = ()=> { 
    let  { toggle } = this.state;
    toggle = !toggle;
    this.setState({toggle})
  }

  //搜索
  searchTable = () => {
    this.props.form.validateFieldsAndScroll((err,values)=>{
      console.log(values)
      if(!err){
        console.log(values)
        this.refs.table.fetch({...values,...this.props.modalQuery})
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { query , selectedRowKeys , toggle} = this.state;
    const columns = [ 
      {
          title: '资产编号',
          dataIndex: 'assetsRecord'
      },{
          title: '资产名称',
          dataIndex: 'equipmentStandardName'
      },{
          title: '型号',
          dataIndex: 'fmodel'
      },{
          title: '规格',
          dataIndex: 'spec'
      },{
          title: '管理科室',
          dataIndex: 'bDeptName'
      },{
          title: '租赁单价',
          dataIndex: 'rentingPrice',
          render:(text)=>text?Number(text).toFixed(2):text
      }
    ];
    return(
      <div>
        <Row>
        {
          !toggle ?(
            <div>
              {getFieldDecorator('mobile')(
                <Search placeholder='搜索' onSearch={this.searchTable} style={{width:200,marginBottom:12}} className={Style.buttonGap}/>
              )}
              <Button type='primary' onClick={this.toggle}>更多筛选</Button>
            </div>
          )
          :(
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='资产编号'  
                  >
                    {getFieldDecorator('assetsRecord')(
                      <Input placeholder='请输入' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='名称'  
                  >
                    {getFieldDecorator('equipmentStandardName')(
                      <Input placeholder='请输入'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='型号'  
                  >
                    {getFieldDecorator('fmodel')(
                      <Input placeholder='请输入'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='规格'  
                  >
                    {getFieldDecorator('spec')(
                      <Input placeholder='请输入'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button type='primary' className={Style.buttonGap} onClick={this.searchTable}>查询</Button>
                  <Button type='primary' onClick={this.toggle}>收起筛选</Button>
                </Col>
              </Row>
            </Form>
          )
        }
          
        </Row>
        <RemoteTable
            ref="table"
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
              }
            }}
            query={query}
            url={ledgerBorrow.queryAssetsList}
            scroll={{x: '150%'}}
            showHeader={true}
            columns={columns}
            size="small"
            rowKey={'RN'}
          />
          <Row style={{textAlign: 'right'}}>
            <Button className={Style.buttonGap} type='primary' onClick={this.getSelectSource}>确认</Button>
            <Button className={Style.buttonGap} onClick={this.onCancel}>取消</Button>
          </Row>
      </div>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);
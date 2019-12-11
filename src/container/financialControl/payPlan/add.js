/*
 * @Author: yuwei 新建计划
 * @Date: 2019-03-22 14:45:56 
 * @Last Modified by: yuwei
 * @Last Modified time: 2019-03-24 22:31:06
 */
import React, { PureComponent } from 'react';
import { Layout, Row, Col, Form, Input, Table, Affix, DatePicker, Button, Modal, message } from 'antd';
import { withRouter } from 'react-router-dom'  
import TableGrid from '../../../component/tableGrid';
import financialControl from '../../../api/financialControl';
import request from '../../../utils/request';
import querystring from 'querystring';
import classnames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import styles from './style.css';
const { RemoteTable } = TableGrid;
const { MonthPicker } = DatePicker;
const { Content } = Layout;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
// 选择发票表头
const columns = [
  { title: '会计月', dataIndex: 'acctYh',  width: 100 },
  { title: '开票日期', dataIndex: 'invoiceDate', width: 100 },
  { title: '发票金额', dataIndex: 'accountPayed', width: 100,render:(text)=>text ||text===0 ? Number(text).toFixed(2):'' },
  { title: '未计划金额', dataIndex: 'noplanPrice', width: 100 },
  { title: '发票代码', dataIndex: 'invoiceCode', width: 100 },
  { title: '发票号码', dataIndex: 'invoiceNo', width: 100 },
  { title: '供应商', dataIndex: 'fOrgName', width: 100 }
];
// 预览汇总表头
const previewModalColumns = [
  { title: '供应商', dataIndex: 'fOrgName',  width: 100 },
  { title: '本期应付款', dataIndex: 'currentPrice',  width: 100 },
  { title: '付款月份', dataIndex: 'payYh',  width: 100 },
]
const { RangePicker } = DatePicker;
class AddPayPlan extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      globalData:null,//当前计划详情信息
      disabled:false,//默认为新增可编辑状态
      dataSource: [],
      visible: false, // 发票弹窗
      selectedRows: [], //弹窗选择后进入主列表的数据
      selectedRowKeys: [],//弹窗选择后进入主列表的数据key
      mainSelectKey: [], //主表选择需要删除的操作
      mainSelectRow: [],//主表选择需要删除的操作
      isLoading: false,
    }
    this.changeInput = _.debounce(this.changeInput,300);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    //如果包含ID 则显示查询详情信息
    if (id) {
      request(financialControl.selectPayPlanList,{
        body:querystring.stringify({ pplanId: id }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status && data.result && data.result.rows){
            //已发布状态为纯查看页面
            const disabled = data.result.rows.length && data.result.rows[0].fstate === '03';
            this.setState({globalData:data.result.rows[0],disabled})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
      //获取table内容
      request(financialControl.selectPayPlanDetailList,{
        body:querystring.stringify({ pplanId: id }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status && data.result && data.result.rows){
            this.setState({dataSource:data.result.rows})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
    }
  }
  //获取当前表单所有数据内容
  getPageData = (fstate) => {
    let backData = null;
    this.props.form.validateFieldsAndScroll( (err, values) => {
      if (!err) { 
        if ( this.props.match.params.id ) {
          values.pplanId = this.props.match.params.id;
        } 
        values.totalPrice = this.getTotal();//总金额
        values.fstate = fstate || '00';//状态
        values.detailList = this.state.dataSource;
        console.log('submit values',JSON.stringify(values))
        backData = values;
      } 
    })
    return backData
  }
  //获取当前主表的本期付款
  getTotal = () => {
    const { dataSource } = this.state;
    if (!dataSource.length) { return 0 }
    let total = dataSource.reduce(function( prev, cur ){
      return cur.currentPrice += prev
    },0)
    return total
  }
  //保存整单计划 发布计划
  submit = ( fstate ) => {
    let val = this.getPageData(fstate);
    (fstate === "00") && this.setState({isLoading:true});
    //发送请求
    request(financialControl.insertPayPlan,{
      body:JSON.stringify(val),
      success: data => {
        if(data.status){
          message.success('操作成功！')
          this.props.history.push('/financialControl/payPlan');
          fstate === "00" && this.setState({isLoading:false});
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  //汇总预览
  preview = () => {
    console.log('preview')
    let val = this.getPageData('00');
    //如果为详情或编辑 使用 pplanId查询
    if ( this.props.match.params.id ) {
      return this.setState({
        previewModalVisible: true
      })
    }
    this.props.form.validateFieldsAndScroll((err,values) => {
      if (!err) {
        //为新增预览则发送请求获取相关数据
        request(financialControl.selectPayPlanForgFOrgSum,{
          body:JSON.stringify(val),
          success: data => {
            if(data.status){
              this.setState({previewModalVisible: true, globalData: data.result})
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    })
    
  }
  //主列表 Input 更改
  changeInput = (val,index,field) =>{
    const dataSource = _.cloneDeep(this.state.dataSource);
    dataSource[index][field] = (field === 'currentPrice' ?  Number(val):val);
    this.setState({ dataSource })
  }
  //1 - 弹出层内容 选择部分进入主列表
  selectedInTable = () => {
    console.log('selectedInTable')
    this.setState({visible: false})
    const { selectedRows , dataSource } = this.state;
    if(selectedRows && selectedRows.length){
      const mergeArr = _.cloneDeep([].concat( selectedRows|| [] ,dataSource|| []));
      let retDataSource = _.uniqBy( mergeArr, 'invoiceId');
      retDataSource = retDataSource.map(item => {
        item.payYh = moment().format('YYYY-MM');
        item.currentPrice = item.noplanPrice || 0;
        return item
      })
      this.setState({ 
        dataSource: retDataSource,
        selectedRowKeys:[], 
        visible: false
      })
    }else{
      message.error('至少选择一张发票!')
    }
  }
  //2 - 弹出层内容 取消选择进入列表
  cancelSelect = () => {
    console.log('cancelSelect')
    this.setState({visible: false, selectedRowKeys:[] })
  }
  //3- 删除计划内容
  delete = () => {
    console.log('删除计划内容','delete')
    const { mainSelectKey, dataSource } = this.state;
    if (!mainSelectKey.length) { return message.warn('至少选择一条数据进行删除') }
    let mainDataSource = _.cloneDeep(dataSource);
    for(let i =0; i<mainSelectKey.length; i++ ){ 
      mainDataSource = mainDataSource.filter( item => item.invoiceId !== mainSelectKey[i])
    }
    this.setState({ 
      dataSource: mainDataSource, 
      mainSelectKey:[],  
      mainSelectRow:[],  
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { 
      disabled, //true为不可编辑状态
      dataSource,
      globalData,
      visible, 
      selectedRowKeys, 
      mainSelectKey,
      previewModalVisible,
      isLoading  
    } = this.state; 
    //弹窗选择事件 
    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys ,selectedRows  })
      },
      onSelectAll: (selectedRowKeys, selectedRows, changeRows) => {
        this.setState({ selectedRows })
      }
    };
    // 主列表columns
    const newColumns = columns.concat([
      { 
        title: '付款年月', 
        dataIndex: 'payYh',  
        width: 100,
        render:(text,record,index)=> {
          return disabled ? text
          : ( <MonthPicker 
            format='YYYY-MM' 
            defaultValue={ text ? moment(text,'YYYY-MM') : moment()}
            onChange={(date,dateString) => this.changeInput(dateString,index,'payYh')} 
            /> )
        }
      },
      { 
        title: '本期付款', 
        dataIndex: 'currentPrice',  
        width: 100,
        render:(text,record,index)=> {
         return disabled ? text 
         : ( <Input 
              onChange={(e) => this.changeInput(e.target.value,index,'currentPrice')} 
              type='number' 
              defaultValue={record.currentPrice || 0}/> )
        }
      },
      { 
        title: '备注', 
        dataIndex: 'tfRemark',  
        width: 100,
        render:(text,record,index)=> {
         return disabled ? text
         : ( <Input 
            defaultValue={text} 
            onChange={(e) => this.changeInput(e.target.value,index,'tfRemark')} 
            />)
        }
      }
    ]);
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <Form>
          <h3 className={styles.title}>计划信息</h3>
          <Row>
            <Col span={6}>
              <FormItem label={`计划名称`} {...formItemLayout}>
                {
                  disabled ? <span>{globalData && globalData.pplanName}</span>
                  :
                  getFieldDecorator(`pplanName`, {
                    initialValue:globalData && globalData.pplanName ? globalData.pplanName :'',
                    rules: [{ required: true, message: '请输入计划名称' }],
                  })(
                    <Input/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>  
              <FormItem label={`备注`} {...formItemLayout}>
                {
                  disabled ? <span>{globalData && globalData.tfBremark}</span>
                  : getFieldDecorator(`tfBremark`,{
                    initialValue:globalData && globalData.tfBremark ? globalData.tfBremark :'',
                  })(
                    <Input placeholder="请填写备注" />
                  )
                }
              </FormItem>
            </Col>
          </Row>  
          <h3 className={styles.title}>计划内容</h3>
          {
            !disabled
            && 
            <Row className={styles.mb8}>
              <Button className={styles.mt8} type='primary' onClick={() => this.setState({visible: true})}>添加</Button>
              <Button className={classnames(styles.mt8,styles.ml8)} onClick={() => this.delete() }>删除</Button>
            </Row>
          }
          <Table 
            dataSource={dataSource} 
            columns={newColumns} 
            bordered={true} 
            size={'small'} 
            rowKey={'invoiceId'}
            pagination={false}
            className={styles.noPadding}
            footer={()=>(
              <div>
                计划总金额：<b className={styles.errorText}>{this.getTotal().toFixed(2)}</b>
              </div>
            )}
            rowSelection={{
              selectedRowKeys:mainSelectKey,
              onChange: (mainSelectKey, mainSelectRow) => {
                this.setState({ mainSelectKey, mainSelectRow })
              },
              onSelectAll: (mainSelectKey, mainSelectRow) => {
                this.setState({ mainSelectKey, mainSelectRow })
              }
            }}
          />
        </Form>
        <Affix offsetBottom={0} className={styles.affix}>
          <Row>
            <Col span={24} style={{textAlign: 'right', padding: '5px 50px', background: '#fff'}}>
              { !disabled
                && <Button loading={isLoading} type='primary' className={styles.mr8} onClick={() => this.submit('00')}>保存</Button>
              }
              {
                !disabled && 
              <Button type='primary' className={styles.mr8} onClick={() => this.submit('03')}>发布计划</Button>
              }
              <Button onClick={this.preview}>预览汇总</Button>
            </Col>
          </Row>
        </Affix>  
        {/* 选择发票 */}
        <Modal
          width={1200}        
          title="选发票"
          visible={visible}
          footer={(
            <span>
              <Button type='primary' onClick={ this.selectedInTable }>选入</Button>
              <Button onClick={ this.cancelSelect } className={styles.ml8}>取消 </Button>
            </span>
          )}
          style={{top: 20}}
          onCancel={() => this.cancelSelect()}
        >
          <ModalSearchFormWrapper refreshModalTable={(query) => this.refs.table.fetch(query)}/>
          <RemoteTable
            ref='table'
            url={financialControl.selectPayPlanInvoiceList}
            columns={columns}
            showHeader={true}
            rowKey={'invoiceId'}
            style={{marginTop: 10}}
            size="small"
            scroll={{x: '100%'}}
            rowSelection={rowSelection}
          /> 
        </Modal>
      
        {/* 预览汇总 */}
        <Modal
          title='计划预览'
          width={980} 
          visible={previewModalVisible}
          onCancel={() => this.setState({previewModalVisible: false})}
          footer={null}
          >
          <Row>
            <Col span={18}>计划名称：{globalData && globalData.pplanName}</Col>
          </Row> 
          <Row> 
            <Col span={8} className={styles.mt8}>制单人：{globalData && globalData.createUserName}</Col>
            <Col span={8} className={styles.mt8}>制单时间：{globalData && globalData.createTime}</Col>
            <Col span={8} className={styles.mt8}>计划总金额：{globalData && globalData.planTotalPrice}</Col>
          </Row> 
          {
            globalData && globalData.pplanId ? 
            // 详情或编辑 查看预览
            <RemoteTable
              query={{pplanId: globalData && globalData.pplanId }}
              ref='table'
              url={financialControl.selectPlanDetailForgSum}
              columns={previewModalColumns}
              showHeader={true}
              rowKey={'pPlanDetailId'}
              style={{marginTop: 10}}
              size="small"
              scroll={{x: '100%'}}
              rowSelection={{
                onChange:(key,row)=>{
                  console.log(key,row)
                }
              }}
            />
            // 新增预览汇总
            : <Table
            dataSource={globalData && globalData.detailList}
            rowKey={'pPlanDetailId'}
            columns={previewModalColumns}>
            </Table>
          }
          
        </Modal>
      </Content>  
    )
  }
}

export default withRouter(Form.create()(AddPayPlan));

class ModalSearchForm extends PureComponent {
   

  serach = () => {
    console.log('serach','弹窗搜索')
    let values = this.props.form.getFieldsValue();
    console.log(values);
    if (values.invoiceDate) { 
      values.invoiceStartDate = moment(values.invoiceDate[0]).format('YYYY-MM-DD');
      values.invoiceEndDate = moment(values.invoiceDate[1]).format('YYYY-MM-DD');
    }
    if (values.acctYh) { 
      values.acctYh = moment(values.acctYh).format('YYYY-MM');
    }
    delete values['invoiceDate']
    //搜索弹窗table
    this.props.refreshModalTable && this.props.refreshModalTable(values);
  }
  reset = () => {
    this.props.form.reset();
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label={`会计月`} {...formItemLayout}>
              {getFieldDecorator(`acctYh`)(
                <MonthPicker format={'YYYY-MM'} style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`开票日期`} {...formItemLayout}>
              {getFieldDecorator(`invoiceDate`)(
                <RangePicker></RangePicker>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`发票号码`} {...formItemLayout}>
              {getFieldDecorator(`invoiceNo`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`发票代码`} {...formItemLayout}>
              {getFieldDecorator(`invoiceCode`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8} offset={8} className={styles.textRight}>
            <Button type='primary' onClick={ this.serach }>搜索</Button>
            <Button className={styles.ml8} onClick={ this.reset }>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const ModalSearchFormWrapper = Form.create()(ModalSearchForm);

/**清查记录--列表*/
import React from 'react';
import { message , Row, Col, Input, Layout ,Button ,Select, DatePicker ,Modal ,Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import TableGrid from '../../../component/tableGrid';
import inventory from '../../../api/inventory';
import request from '../../../utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { checkState ,checkStateSel , checkType } from '../../../constants';
import { Link } from 'react-router-dom';
import querystring from 'querystring';
import moment from 'moment';
const Option = Select.Option;
const Search = Input.Search;
const { Content } = Layout;
const FormItem = Form.Item;
const { RemoteTable } = TableGrid;
const { RangePicker } = DatePicker;

const columns=[
  { title: '操作', 
  dataIndex: 'maintainGuid', 
  width:'5%',
  render: (text,record) =>
    <span>
      { (record.fState==="0") ? 
        <span><Link to={{pathname:`/inventory/inventoryRecord/details/${record.stockCountId}`}}>清查</Link></span>
        :<span><Link to={{pathname:`/inventory/inventoryRecord/details/${record.stockCountId}`}}>详情</Link></span>
      }
    </span>
  },
  {
    title: '清查单号',
    dataIndex: 'stockCountNo',
    width:'10%',
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  },
  {
    title: '清查单状态',
    dataIndex: 'fState',
    key: 'fState',
    width:'5%',
    filters: checkStateSel,
    onFilter: (value, record) => (record && record.fState===value),
    render: text => 
      <div>
      <span style={{marginRight:5,backgroundColor:checkState[text].color ,width:10,height:10,borderRadius:'50%',display:'inline-block'}}></span>
        { checkState[text].text }
      </div>
  },
  {
    title: '创建时间',
    width:'8%',
    dataIndex: 'stockCountDate',
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  },
  {
    title: '制单人',
    dataIndex: 'modifyUserName',
    width:'8%',
    render(text, record) {
      return <span title={text}>{text}</span>
    }
  },
  {
    title: '清查方式',
    dataIndex: 'stockCountType',
    width:'8%',
    render(text, record) {
      return <span title={checkType[text].text}> { checkType[text].text }</span>
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width:'20%'
  }
]
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

class ModalForm extends React.Component{
	state={
    selectUseDepart:[],
    callbackData:{}
  }
  componentWillMount =()=>{
		this.getUseDepart();
  }
  //备注的验证规则	
	checkTextLength = (rule, value, callback) => {
		const { getFieldValue } = this.props.form;
		const mentions = getFieldValue('remark');
		if (!mentions || mentions.length < 5) {
			callback(new Error('请输入至少五个字符!'));
		} else {
			callback();
		}
  }

	getUseDepart = (value) =>{
		let o ={deptType:'01'};
    if(value==="0"){
      o={deptType:'01'}
    }else if(value==="1"){
      o={deptType:'00'}
    }
		let options = {
			body:querystring.stringify(o),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: data => {
				if(data.status){
					this.setState({
						'selectUseDepart':data.result
					})
				}else{
					message.error(data.msg)
				}
			},
			error: err => {console.log(err)}
		}
		request(inventory.selectUseDeptList,options)
	}
  getOptions = (selData)=>{
		if(selData){
			return(
				selData.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>)
			)
		}
	} 
	setStateValue = (value,keyName,filterData)=>{
		let o =filterData.filter(item=>{
			return item.text===value
		})[0];

    let ret = o ? o.value :'';
		this.setState({
			callbackData:Object.assign(this.state.callbackData,{[keyName]:ret})
    })
    this.props.callback(this.state.callbackData)
  }
  
	render(){
		const { getFieldDecorator  } = this.props.form;
    const { selectUseDepart } = this.state;
		return(
			<Form>
				<FormItem
					{...formItemLayout}
					label="清查方式"
				>
					{getFieldDecorator('type', {
            initialValue:'0',
						rules: [{
							required: true, message: '请选择清查方式！',
						}],
					})(
            <Select onSelect={(e)=>this.getUseDepart(e)}>
              <Option value='0'>按管理科室</Option>
              <Option value='1'>按使用科室</Option>
            </Select>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="使用科室"
				>
					{getFieldDecorator('deptCode')(
            <Select
                showSearch
                placeholder="请选择使用科室"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                // onSearch={this.getUseDepart}
                onSelect={(v)=>this.setStateValue(v,'deptCode',selectUseDepart)}
                style={{ width: 250,marginBottom:15 }} 
              >
                {this.getOptions(selectUseDepart)}
              </Select>
					)}
				</FormItem>

				<FormItem label='备注' {...formItemLayout}>
					{getFieldDecorator(`remark`,{
						// rules:[
						// 	{validator: this.checkTextLength}
						// ]
					})(
						<TextArea placeholder='请输入' style={{resize:'none',height:120}} maxLength={500}></TextArea>
					)}
				</FormItem>
		</Form>
		)
	}
}
const ModalFormWapper = Form.create()(ModalForm);


class inventoryRecord extends React.Component{
    

    constructor(props) {
      super(props);
      /* 设置redux前置搜索条件 */
      const { search, history } = this.props;
      const pathname = history.location.pathname;
      this.state = {
        query:search[pathname]?{...search[pathname]}:{},
        visible:false,
        modalFormData:{}
      }
    }
    /* 查询时向redux中插入查询参数 */
    queryHandler = () => {
      let { query } = this.state;
      const { setSearch, history ,search } = this.props;
      const pathname = history.location.pathname;
      let values = Object.assign({...search[pathname]},{...query})
      setSearch(pathname, values);
      this.refs.table.fetch(this.state.query);
    }
    onChange = (date, dateString) => {
        let options ={
            startTime:dateString[0],
            endTime:dateString[1],
        }
        this.setState({
            query:Object.assign(this.state.query,options)
        })
    }
		handleOk = (e) => {
      let modalFormData = this.state.modalFormData
			this.refs.form.validateFields((err, values) => {
				if (!err) {
          values= Object.assign(values,modalFormData)
          this.sendSubmitAjax(values)
				}
			})
		}
		handleCancel = (e) => {
      this.refs.form.resetFields();
			this.setState({
				visible: false,
			});
    }
    sendSubmitAjax = (value) =>{
      let options = {
        body:querystring.stringify(value),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            setTimeout(()=>{
              message.success( '操作成功')
              this.setState({
                visible: false,
              });
              this.refs.form.resetFields();
              this.refs.table.fetch();
            },300)
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(inventory.submitInventoryOrders, options)
    }
    /* 记录table过滤以及分页数据 */
    changeQueryTable = (values) =>{
      const { setSearch, history ,search} = this.props;
      values = Object.assign({...search[history.location.pathname]},{...values})
      setSearch(history.location.pathname, values);
    }
    render(){
        const { query , visible , modalFormData } = this.state;
        const { search , history } = this.props;
        const pathname = history.location.pathname;
        const defaultValue = search[pathname]&&search[pathname].stockCountNo?search[pathname].stockCountNo:null;
        let timeDefaultValue = null;
        if(search[pathname]&&search[pathname].startTime&&search[pathname].endTime){
          timeDefaultValue = [moment(search[pathname].startTime,'YYYY-MM-DD'),moment(search[pathname].endTime,'YYYY-MM-DD')]
        }
        return(
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
              <Row>
                  <Col span={18}>
                    <Search
                        placeholder="请输入清查单号"
                        defaultValue={defaultValue}
                        onChange={(e) =>{  this.setState({'query':Object.assign(query,{'stockCountNo':e.target.value}) })   }}
                        style={{ width: 200 ,marginRight:15}}
                    />
                    <RangePicker 
                    defaultValue={timeDefaultValue}
                    onChange={this.onChange}  style={{ marginRight:15}} format='YYYY-MM-DD'/>
                    <Button type='primary' size='default' onClick={this.queryHandler}>查询</Button>
                  </Col> 
                  <Col span={6} style={{textAlign:'right'}}>
                    <Button type='primary' size='default' onClick={()=>{this.setState({visible:true})}}>新增清查 </Button>
                  </Col>
              </Row>
              <RemoteTable
                  ref='table'
                  onChange={this.changeQueryTable}
                  query={this.state.query}
                  url={inventory.queryStockCountList}
                  scroll={{x: '100%'}}
                  columns={columns}
                  rowKey={'stockCountId'}
                  showHeader={true}
                  style={{marginTop: 10}}
                  size="small"
              /> 

              <Modal
								visible={visible}
								onOk={this.handleOk}
								onCancel={this.handleCancel}
                title='新建清查'>
									<ModalFormWapper  ref='form' value={modalFormData}  callback={(modalFormData)=>{ this.setState({modalFormData}) }}></ModalFormWapper>
              </Modal>
            </Content>
        )
    }
}


export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(inventoryRecord));
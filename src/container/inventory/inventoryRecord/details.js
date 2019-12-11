/**资产盘点 --详情/盘点 */
import React, { Component } from 'react';// Alert 
import {message , Affix , Row, Col, Input, Icon ,Card ,Form, Button ,Select , Tooltip , Upload} from 'antd'
import './style.css';
import TableGrid from '../../../component/tableGrid';
import querystring from 'querystring';
import inventory from '../../../api/inventory';
import { checkDetailType , checkType} from '../../../constants'
// import inventory from '../../../api/inventory';
import request from '../../../utils/request';
const { RemoteTable } = TableGrid;
const Option = Select.Option;
const FormItem = Form.Item;
const styles={
	mb:{
		marginBottom:15
	},
	affix:{
		display:'flex',
		alignContent:'center',
		justifyContent:'flex-end',
		background:'#fff',
		padding:'10px 20px',
		marginBottom:10,
	},
	default:{
		width:150
	}
}

//搜索表单内容
class AdvancedSearchForm extends React.Component {
  state = {
		expand: false,
		selectUseDepart:[],
		callbackData:{}
  };

	componentWillMount =()=>{
		this.getUseDepart();
	}

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
		let querystring = Object.assign(values,this.state.callbackData);
		this.props.callback(querystring)
    });
  }

  handleReset = () => {
	this.props.form.resetFields();
	this.setState({
		callbackData:{}
	})
	this.props.callback({})
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  //获取科室下拉框
	getUseDepart = (value) =>{
		let o;
		if(value){
			o={deptName:value,deptType:'00'}
		}else{
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
	}

  render() {
		const { getFieldDecorator } = this.props.form;
		const { expand ,selectUseDepart } = this.state;
	return (
		<Form
			className="ant-advanced-search-form"
			onSubmit={this.handleSearch}
			style={styles.mb}
		>
				<Row gutter={24}>
					<Col span={8} style={{ display: 'block'}}>
						<FormItem label={`资产编码`}>
							{getFieldDecorator(`assetsRecord`)(
								<Input placeholder="请输入资产编码" />
							)}
						</FormItem>
					</Col>
					<Col span={8} style={{ display: 'block'}}>
						<FormItem label={`资产名称`}>
							{getFieldDecorator(`equipmentName`)(
								<Input placeholder="请输入资产名称" />
							)}
						</FormItem>
					</Col>
					<Col span={8} className={ expand ? 'show':'hide' }>
						<FormItem label={`使用科室`}>
							{getFieldDecorator(`deptCode`)(
								<Select
									placeholder="请输入使用科室"
									name='deptCode'
									mode="combobox"
									defaultActiveFirstOption={false}
									showArrow={false}
									filterOption={false}
									onSearch={this.getUseDepart}
									onSelect={(v)=>this.setStateValue(v,'deptCode',selectUseDepart)}
									style={{ width: 250,marginBottom:15 }} 
								>
									{this.getOptions(selectUseDepart)}
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" onChange={this.handleSearch}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
				{expand ? '收起' : '展开'}  <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

// const messageInfo = '全部：10000 条     已清查：9000 条    未清查：990 条    富余：10 条 ';

class inventoryDetails extends Component {

	state={
		detailsId:'',
		queryJson:{},//搜索栏目关键字
		handleRecord:{},
		editState:true,
		data:{},
		loading:false
	}
	componentWillMount = ()=>{
		this.setState({
			detailsId:this.props.match.params.id,
		})
		let key = this.props.match.params.id;
		this.getDetailsAjax({stockCountId:key});
	}

	getDetailsAjax =(key)=>{
		let options = {
			body:querystring.stringify(key),
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: data => {
				if(data.status){
					let retData = data.result;
					retData.stockCountTypeStr = checkType[retData.stockCountType].text;
					//拿到回显数据
					this.setState({
						data:retData,
					})
					if(retData.fState==='1'){
						this.setState({
							 editState:false
						})
					}else{
						this.setState({
							editState:true
					   })
					}
				}else{
					message.error(data.msg)
				}
			},
			error: err => {console.log(err)}
		}
		request(inventory.queryStockCount, options);
	}

	//查询内容
	queryTable = (queryJson)=>{
		this.setState({queryJson})
		this.refs.table.fetch(queryJson)
	}

	handleSubmit = ()=>{
		let options = {
			body:querystring.stringify({stockCountId:this.state.detailsId}),
			headers:{
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: data => {
				if(data.status){
					if(data.status){
						message.success('提交清查成功！')
						this.props.history.push('/inventory/inventoryRecord');
					}
				}else{
					message.error(data.msg)
				}
			},
			error: err => {console.log(err)}
		}
		request(inventory.updateStockCount, options);
	}


  render() {
		const { editState , data , detailsId , queryJson , loading } = this.state;
		const props = {
			showUploadList:false,
			name:'uploadFile',
			withCredentials:true,
			action: inventory.importQrcodeIn,
			data:{
				'stockCountId':detailsId
			},
			onChange:(info)=> {
				if (info.file.status !== 'uploading') {
					this.setState({loading:true})
					if(info.file.type!=='application/vnd.ms-excel' && info.file.type!=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
						message.error('请选择正确的Excel文件！')
						return false
					}
				}
				if (info.file.status === 'done') {
					setTimeout(()=>{
						this.setState({loading:false})
						message.success(`${info.file.name} 文件导入成功！`);
						this.queryTable(queryJson)
					},1000)
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} 文件导入失败！`);
				}
			},
		};
		const columns =[
			{
			title: '序号',
			key: 'index',
			width:60,
			render: (text,record,index) => {return `${index+1}`},
		},
		{
			title: '清查结果类型',
			key: 'stockCountDetailType',
			dataIndex: 'stockCountDetailType',
			width:180,
			render: (text,record,index) => {
				return 	checkDetailType[record.stockCountDetailType].text
			},
		},{
			title: '资产分类',
			key: 'productType',
			dataIndex: 'productType',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '资产编码',
			key: 'assetsRecord',
			dataIndex: 'assetsRecord',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '资产名称',
			key: 'equipmentName',
			dataIndex: 'equipmentName',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '型号',
			key: 'fmodel',
			dataIndex: 'fmodel',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '规格',
			key: 'spec',
			dataIndex: 'spec',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '管理科室',
			key: 'bDept',
			dataIndex: 'bDept',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '使用科室',
			key: 'useDept',
			dataIndex: 'useDept',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '存放地址',
			key: 'deposit',
			dataIndex: 'deposit',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		},{
			title: '保管人',
			key: 'custodian',
			dataIndex: 'custodian',
			width:200,
			render:(text)=><span title={text}>{text}</span>
		}]
    return (
			<div style={{padding:20}} >
				{
					editState?
					<Affix>
						<div style={styles.affix}>
							<Button type="primary" style={{marginRight:15}} onClick={()=>this.handleSubmit()}>提交清查</Button>
							<Tooltip placement="bottom" title={ <span><Icon type="question-circle-o" />&nbsp;请使用手持设备清查</span>}>
							
								<Upload {...props}>
									<Button loading={loading}>导入</Button>
								</Upload>
							</Tooltip>
						</div>
					</Affix>
					:''
				}

				<Card title='清查信息' style={styles.mb}>
					<Row style={styles.mb}>
						<Col span={8}>
							清查方式:{data.stockCountTypeStr}
						</Col>
						<Col span={8}>
							科室:{data.deptName}
						</Col>
						<Col span={8}>
							保管人:{data.createUserName}
						</Col>
					</Row>
				</Card>

				<Card title='资产信息'>
					<WrappedAdvancedSearchForm formInfo ='' callback={(queryJson)=>{this.queryTable(queryJson)}}></WrappedAdvancedSearchForm>
					{/*<Alert message={messageInfo} type="info" showIcon  style={styles.mb}/>*/}
						<RemoteTable
								ref='table'
								query={this.state.queryJson}
								url={inventory.queryStockCountDetailList}
								scroll={{x: '150%', y : document.body.clientHeight - 110 }}//187
								columns={columns}
								rowKey={'stockCountDetailId'}
								showHeader={true}
								style={{marginTop: 10}}
								size="small"
						/> 
				</Card>
			</div>
    )
  }
}
export default inventoryDetails;
/**折旧计提 --详情 */
import React, { Component } from 'react';
import {message ,Row, Col, Input, Icon ,Card ,Form, Button ,Select } from 'antd'
import TableGrid from '../../../component/tableGrid';
import querystring from 'querystring';
import devalue from '../../../api/devalue';
import { payType } from '../../../constants';
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
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
//搜索表单内容
class AdvancedSearchForm extends React.Component {
  state = {
		expand: false,
    selectUseDepart:[],
    typeSelect:[],//折旧分类下拉框
		callbackData:{}
  };

	componentWillMount =()=>{
    this.getUseDepart();
    this.getTypeSelect();
	}

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			console.log(this.state.callbackData)
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
		request(devalue.selectUseDeptList,options)
	}
	getOptions = (selData)=>{
		if(selData){
			return(
				selData.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>)
			)
		}
  } 
  
  /**
   * @description 获取折旧分类下拉框
   */
  getTypeSelect = () => {
    if (this.props.ID) {
      request(devalue.selectDepreciationTypeCheckList,{
        body:querystring.stringify({equipmentDepreciationGuid:this.props.ID}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            this.setState({
              typeSelect:data.result
            })
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
    }
  }

	setStateValue = (value,keyName,filterData)=>{
		let o =filterData.filter(item=>{
			return item.text===value || item.depreciationId === value
		})[0];
		let ret = o ? (o.value || (o.depreciationId||'未分类')) :'';
		this.setState({
			callbackData:Object.assign(this.state.callbackData,{[keyName]:ret})
    })
		console.log(this.state.callbackData)
	}

  render() {
		const { getFieldDecorator } = this.props.form;
		const { expand ,selectUseDepart, typeSelect } = this.state;
		return (
			<Form onSubmit={this.handleSearch} style={styles.mb} >
					<Row gutter={24}>
					<Col span={8} style={{ display: 'block'}}>
							<FormItem label={`资产名称`} {...formItemLayout}>
								{getFieldDecorator(`equipmentStandardName`)(
									<Input placeholder="请输入资产名称" />
								)}
							</FormItem>
						</Col>
						<Col span={8} style={{ display: 'block'}}>
							<FormItem label={`资产编号`} {...formItemLayout}>
								{getFieldDecorator(`assetsRecord`)(
									<Input placeholder="请输入资产编号" />
								)}
							</FormItem>
						</Col>
						
						<Col span={8} style={{display: expand ? 'block':'none' }}>
							<FormItem label={`使用科室`} {...formItemLayout}>
								{getFieldDecorator(`useDeptGuid`)(
									<Select
										placeholder="请选择使用科室"
										name='syks'
										mode="combobox"
										defaultActiveFirstOption={false}
										showArrow={false}
										filterOption={false}
										onSearch={this.getUseDepart}
										onSelect={(v)=>this.setStateValue(v,'useDeptGuid',selectUseDepart)}
										style={{ width: 250,marginBottom:15 }} 
									>
										{this.getOptions(selectUseDepart)}
									</Select>
								)}
							</FormItem>
						</Col>
            <Col span={8} style={{display: expand ? 'block':'none' }}>
							<FormItem label={`折旧分类`} {...formItemLayout}>
								{getFieldDecorator(`depreciationId`,{
                  initialValue:""
                })(
									<Select
                    placeholder="请选择折旧分类"
										onSelect={(val)=>this.setStateValue(val,'depreciationId',typeSelect)}
										style={{ width: 250,marginBottom:15 }} 
									>
                    <Option value="" key="-1">全部</Option>
										{
                      typeSelect.map(item=><Option value={item.depreciationId} key={item.depreciationId}>{item.depreciationName}</Option>)
                    }
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={8} style={{ float:'right', textAlign: 'right' }}>
							<Button type="primary" htmlType="submit" onChange={this.handleSearch}>查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
							<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
							{expand ? '收起' : '展开'}  <Icon type={expand ? 'up' : 'down'} />
							</a>
						</Col>
					</Row>
			</Form>
		)
	}
}
const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

class WithDrawDetails extends Component {

	state={
		detailsId:'',
		queryJson:{},//搜索栏目关键字
		handleRecord:{},
		editState:true,
    data:{},
    exportData:null,//已搜索条件
	}
	componentWillMount = ()=>{
		this.setState({
			detailsId:this.props.match.params.id,
		})
		let key = this.props.match.params.id;
		this.getDetailsAjax(key);
	}

	getDetailsAjax =(key)=>{
		this.setState({
			queryJson:Object.assign(this.state.queryJson,{'equipmentDepreciationGuid':key})
		})
	}

	//查询内容
	queryTable = (queryJson)=>{
		this.setState({queryJson})
		queryJson.equipmentDepreciationGuid =this.state.detailsId
    this.refs.table.fetch(queryJson)
    this.setState({exportData:queryJson})
	}

  exportTable = () => {
    let { exportData } = this.state;
    let val = Object.assign({equipmentDepreciationGuid:this.props.match.params.id},exportData)
    window.open(devalue.exportAssetsCapitalStructureList+'?'+querystring.stringify(val))
  }

  render() {
		const columns =[
			{
				title: '序号',
				key: 'index',
				width:50,
				render: (text,record,index) => {return `${index+1}`},
			},
			{
				title: '科室',
				key: 'aDeptName',
				dataIndex: 'aDeptName',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			},
			{
				title: '分摊比例',
				key: 'shareRatio',
				dataIndex: 'shareRatio',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			},
			{
				title: '资产名称',
				key: 'equipmentStandardName',
				dataIndex: 'equipmentStandardName',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			},
			{
				title: '资产编号',
				key: 'assetsRecord',
				dataIndex: 'assetsRecord',
				width:100,
				render: (text,record,index) => <span>{text}</span>
      },
      {
				title: '折旧分类',
				key: 'depreciationName',
				dataIndex: 'depreciationName',
				width:100,
				render: (text,record,index) => <span>{text}</span>
			},
			{
				title: '折旧年限（年）',
				key: 'useLimit',
				dataIndex: 'useLimit',
				width:100,
				render: (text,record,index) => <span>{text}</span>
			},
			{
				title: '已折月数',
				key: 'depreciationMonths',
				dataIndex: 'depreciationMonths',
				width:100,
				render: (text,record,index) => <span>{text}</span>
			},
			{
				title: '资金来源',
				key: 'payType',
				dataIndex: 'payType',
				width:80,
				render:(text)=>{
					if(text){
						return(
							<span title={payType[text].text}>  {payType[text].text}</span>
						)
					}else{
						return(
							<span> 总计 </span>
						)
					}
				}
			},
			{
				title: '资产原值',
				key: 'originalValue',
				dataIndex: 'originalValue',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			},{
				title: '本次计提',
				key: 'monthDepreciationPrice',
				dataIndex: 'monthDepreciationPrice',
				width:80,
				render:(text)=><span title={text}>{text}</span>
			},{
				title: '累计折旧',
				key: 'totalDepreciationPrice',
				dataIndex: 'totalDepreciationPrice',
				width:80,
				render:(text)=><span title={text}>{text}</span>
			},{
				title: '净值',
				key: 'carryingAmount',
				dataIndex: 'carryingAmount',
				width:80,
				render:(text)=><span title={text}>{text}</span>
			},
			{
				title: '型号',
				key: 'fmodel',
				dataIndex: 'fmodel',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			},{
				title: '规格',
				key: 'spec',
				dataIndex: 'spec',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			},{
				title: '购置日期',
				key: 'buyDate',
				dataIndex: 'buyDate',
				width:100,
				render:(text)=><span title={text}>{text}</span>
			}
		]
    return (
			<div style={{padding:24}}>
        <Card title='资产信息'
          extra={<Button type='primary' onClick={this.exportTable}>导出</Button>}>
          <WrappedAdvancedSearchForm 
            ref='form'
            ID={this.props.match.params.id}
            callback={(queryJson)=>{this.queryTable(queryJson)}}></WrappedAdvancedSearchForm>
					
					<RemoteTable
						ref='table'
						query={this.state.queryJson}
						url={devalue.getDetailTable}
						scroll={{x: '150%', y : document.body.clientHeight - 110 }}
						columns={columns}
						rowKey={'assetsRecordGuid'}
						subrowKey={'equipmendepreciationPayGuid'}
						showHeader={true}
						style={{marginTop: 10}}
						size="small"
					/> 
				</Card>
			</div>
    )
  }
}

export default WithDrawDetails;
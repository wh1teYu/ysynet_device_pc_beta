/*
 * @Author: yuwei 出库明细 -outDetails
 * @Date: 2018-06-12 18:05:37 
* @Last Modified time: 2018-06-12 18:05:37 
 */
import React ,{ Component }from 'react';
import { Form, Row, Col, Input, DatePicker,Button,Select,message } from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import request from '../../../utils/request';
import queryString from 'querystring';
const { RemoteTable } = TableGrid;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends Component{
    state={
        manageSelect:[],
        outDeptOptions: []
    }
    componentDidMount = () => {
        this.getManageSelect();
        this.outDeptSelect();
    }
    getManageSelect = () => {
        request(storage.selectUseDeptList,{
                body:queryString.stringify({deptType:"01"}),
                headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: data => {
                        if(data.status){
                                this.setState({manageSelect:data.result})
                        }else{
                                message.error(data.msg)
                        }
                },
                error: err => {console.log(err)}
        })
    }
    outDeptSelect = () => {
        request(storage.selectUseDeptList,{
            body:queryString.stringify({deptType:"00"}),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
                    if(data.status){
                            this.setState({outDeptOptions:data.result})
                    }else{
                            message.error(data.msg)
                    }
            },
            error: err => {console.log(err)}
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const Time = values.Time === undefined ? "":values.Time;
            if(Time.length>0) {
                values.startTime = Time[0].format('YYYY-MM-DD');
                values.endTime = Time[1].format('YYYY-MM-DD');
                delete values.Time
            }
            console.log(values,"搜索数据")
            this.props.query(values); 
       });
    }
    //重置
    handleReset = () => {
        this.props.form.resetFields();
        this.props.query({});
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        };
        return (
            <Form  onSubmit={this.handleSearch}>
              <Row>
                 <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'出库时间'}>
                        {getFieldDecorator('Time')(
                            <RangePicker format="YYYY-MM-DD" style={{width:"100%"}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'管理部门'}>
                        {getFieldDecorator('manageDeptGuid',{
                            initialValue: ""
                        })(
                            <Select 
                            showSearch
                            placeholder={'请选择'}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.manageSelect.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'使用科室'}>
                        {getFieldDecorator('outDeptGuid',{
                            initialValue:""
                        })(
                            <Select 
                            showSearch
                            placeholder={'请选择'}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.outDeptOptions.map((item,index) => {
                                    return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'单号/名称'}>
                        {getFieldDecorator('mobile')(
                             <Input placeholder="请输出库单号/产品名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={15} key={6} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}
const SearchBox = Form.create()(SearchForm);

class OutDetails extends Component{
    state = {
        query:{}
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render(){
        const columns = [{
                title : '出库单',
                dataIndex : 'outNo',
                width: 120,
            },{
                title : '出库方式',
                dataIndex : 'outMode',
                width: 120,
                render:(text)=>{
                    if(text==="02"){
                        return '科室领用出库'
                    }else if(text==="05"){
                        return '退库出库'
                    }else{
                        return text
                    }
                }
            },{
                title:'领用科室',
                dataIndex: 'outDeptName',
                width: 120,
            },{
                title:'产品名称',
                dataIndex: 'materialName',
                width: 120,
            },{
                title : '型号',
                dataIndex : 'fmodel',
                width: 120,
            },{
                title : '规格',
                dataIndex : 'spec',
                width: 120,
            },{
                title : '单位',
                dataIndex : 'purchaseUnit',
                width: 120,
            },{
                title : '数量',
                dataIndex : 'withdrawNumber',
                width: 120,
                render:(text,record)=>{
                    if(record.outMode==="02"){
                        return record.outNumber;
                    }else if (record.outMode==="05"){
                        return record.withdrawNumber;
                    }else{
                        return text
                    }
                }
            },{
                title : '采购价',
                dataIndex : 'purchasePrice',
                width: 120,
                render:(text)=>{return (text-0).toFixed(2)}
            },{
                title : '供应商',
                dataIndex : 'fOrgName',
                width: 120,
            },{
                title : '出库时间',
                dataIndex : 'outDate',
                width: 120,
                render:(text)=>text?text.substr(0,10):""
            },{
                title : '入库单号',
                dataIndex : 'inNo',
                width: 120,
            },
            {
                title:"资产编号",
                dataIndex: 'assetsRecord',
                width:150
            }
        ];
        // const query = this.state.query;
        return(
            <div>
                <SearchBox query={this.queryHandler}/>
                <RemoteTable
                    url={storage.queryOutportAssetDetails}
                    ref='table'
                    query={this.state.query}
                    scroll={{x: '200%', y : document.body.clientHeight - 110 }}
                    columns={columns}
                    rowKey={'RN'}
                    showHeader={true}
                    style={{marginTop: 10}}
                    size="small">
                </RemoteTable>
            </div>
        )
    }
}

export default OutDetails;
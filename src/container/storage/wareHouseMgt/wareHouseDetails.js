/*
 * @Author: yuwei -入库明细
 * @Date: 2018-06-12 18:06:11 
* @Last Modified time: 2018-06-12 18:06:11 
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
        storageOptions: []
    }
    componentDidMount = () => {
        this.getManageSelect();
        this.getOrgSelect();
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
	getOrgSelect = () => {
        request(storage.selectDeliveryForgList,{
            body:{},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: data => {
                if(data.status){
                    this.setState({storageOptions:data.result})
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
            const inDateTime = values.ImportDate === undefined ? "":values.ImportDate;
            if(inDateTime.length>0) {
                values.startImportDate = inDateTime[0].format('YYYY-MM-DD');
                values.endImportDate = inDateTime[1].format('YYYY-MM-DD');
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
                    <FormItem {...formItemLayout} label={'入库时间'}>
                        {getFieldDecorator('ImportDate')(
                            <RangePicker showTime format="YYYY-MM-DD" style={{width:"100%"}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'管理部门'}>
                        {getFieldDecorator('bDeptId',{
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
                    <FormItem {...formItemLayout} label={'供应商'}>
                        {getFieldDecorator('fOrgId',{
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
                                    this.state.storageOptions.map((item,index) => {
                                    return <Option key={index} value={item.value.toString()}>{item.test}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'单号/名称'}>
                        {getFieldDecorator('parameterName')(
                             <Input placeholder="请输入库单号/产品名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={16} key={6} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 8 ,marginRight: 8}} onClick={this.handleReset}>
                        清除
                    </Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class WareHouseDetails extends Component{
    state = {
        query:{}
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render(){
        const columns = [{
            title : '入库单',
            dataIndex : 'inNo',
            width: 180,
        },{
            title : '入库方式',
            dataIndex : 'intype',
            width: 120,
            render:(text)=>{
                if(text==="01"){
                    return '采购入库'
                }else{
                    return text
                }
            }
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
            dataIndex : 'rksl',
            width: 100,
        },{
            title : '采购价',
            dataIndex : 'purchasePrice',
            width: 100,
            render:text=>{return text.toFixed(2) }
        },{
            title : '金额',
            dataIndex : 'money',
            width: 100,
            render:(text,record) =>{
                return  (record.rksl * record.purchasePrice).toFixed(2)
            }
        },{
            title : '供应商',
            dataIndex : 'fOrgName',
            width: 200,
        },{
            title : '生产商',
            dataIndex : 'produceName',
            width: 120,
        },{
            title : '入库时间',
            dataIndex : 'inDate',
            width: 120,
            render:(text)=>text?text.substr(0,10):""
        },{
          title:"财务分类",
          dataIndex:'styleName',
          width:120
        }
        ];
        // const query = this.state.query;
        return(
            <div>
                <SearchBox query={this.queryHandler}/>
                <RemoteTable
                    url={storage.selectImportParticularsList}
                    ref='table'
                    query={this.state.query}
                    scroll={{x: '150%', y : document.body.clientHeight - 110 }}
                    columns={columns}
                    rowKey={'importDetailGuid'}
                    showHeader={true}
                    style={{marginTop: 10}}
                    size="small">
                </RemoteTable>
            </div>
        )
    }
}

export default WareHouseDetails;
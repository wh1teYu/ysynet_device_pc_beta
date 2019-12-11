/*
 * @Author: yuwei -入库记录
 * @Date: 2018-06-12 18:06:43 
* @Last Modified time: 2018-06-12 18:06:43 
 */
import React , { Component }from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col,DatePicker,Button,Select,message} from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import request from '../../../utils/request';
import queryString from 'querystring';
import moment from 'moment';
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
        this.props.handleReset();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        };
       
        return (
            <Form onSubmit={this.handleSearch}>
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
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'入库方式'}>
                        {getFieldDecorator('intype',{
                            initialValue:""
                        })(
                            <Select>
                                <Option value="" key={-1}>全部</Option>
                                <Option value="01">采购入库</Option>
                                <Option value="06">入库退货</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'供应商'}>
                        {getFieldDecorator('fOrgId',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
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
                <Col span={15} key={6} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
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

class WareHouseRecord extends Component{
        constructor(props) {
            super(props);
            /* 设置redux前置搜索条件 */
            const { search, history } = this.props;
            const pathname = history.location.pathname;
            this.state = {
            query:search[pathname]?{...search[pathname]}:{}
            }
        }
       /* 回显返回条件 */
       async componentDidMount () {
        const { search, history } = this.props;
        const pathname = history.location.pathname;
        console.log(search[pathname])
        if (search[pathname]) {
          //找出表单的name 然后set
          let value = {};
          let values = this.form.props.form.getFieldsValue();
          values = Object.getOwnPropertyNames(values);
          values.map(keyItem => {
            value[keyItem] = search[pathname][keyItem];
            return keyItem;
          });
          if(search[pathname].startImportDate&&search[pathname].endImportDate){
            value.inDateTime=[moment(search[pathname].startImportDate,'YYYY-MM-DD'),moment(search[pathname].endImportDate,'YYYY-MM-DD')]
          }
          this.form.props.form.setFieldsValue(value)
        }
      }
    queryHandler = (query) => {
        const { setSearch, history ,search } = this.props;
        const pathname = history.location.pathname;
        let values = Object.assign({...search[pathname]},{...query})
        setSearch(pathname, values);
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    /* 重置时清空redux */
    handleReset = ()=>{
        this.form.props.form.resetFields();
        const { clearSearch , history ,search} = this.props;
        const pathname = history.location.pathname;
        let setToggleSearch = {};
        if(search[pathname]){
        setToggleSearch = { toggle:search[pathname].toggle};
        }else{
        setToggleSearch = { toggle: false };
        }
        clearSearch(pathname,setToggleSearch);
    }
    /* 记录table过滤以及分页数据 */
    changeQueryTable = (values) =>{
        const { setSearch, history ,search} = this.props;
        values = Object.assign({...search[history.location.pathname]},{...values})
        setSearch(history.location.pathname, values);
    }
    /* 记录展开状态 */
    changeQueryToggle = () =>{
        const { search , setSearch , history} = this.props;
        const pathname = history.location.pathname;
        let hasToggleSearch = {};
        if(search[pathname]){
            hasToggleSearch = {...search[pathname],toggle:!search[pathname].toggle};
        }else{
            hasToggleSearch = { toggle: true };
        }
        setSearch(pathname,hasToggleSearch)
    }
    render(){
        const { search , history } = this.props;
        const pathname = history.location.pathname;
        const isShow = search[pathname] ? search[pathname].toggle:false;
        const columns = [
                {
                    title : '操作',
                    dataIndex : 'action',
                    width: 80 ,
                    render : (text,record)=>{
                            return <Link to={{pathname:`/storage/wareHouseMgt/details/${record.sendId}`,state:record}}>详情</Link>
                    }
            },{
                    title : '入库单',
                    dataIndex : 'inNo',
                    width: 120,
                
            },{
                title : '入库方式',
                dataIndex : 'intype',
                width: 120,
                render:(text)=>{
                    if(text==="01"){
                        return '采购入库'
                    }else if (text==="06"){
                        return '入库退货'
                    }else{
                        return text
                    }
                }
            },
            {
                    title : '送货单',
                    dataIndex : 'sendNo',
                    width: 150,
            },	{
                    title : '管理部门',
                    dataIndex : 'bDeptName',
                    width: 150,
            },{
                    title : '供应商',
                    dataIndex : 'fOrgName',
                    width: 200
            },{
                    title : '操作员',
                    dataIndex : 'createUserName',
                    width: 100
            },{
                    title : '入库时间',
                    dataIndex : 'inDate',
                    width: 140,
                    render:(text)=>text?text.substr(0,10):""
            },{
                    title : '备注',
                    dataIndex : 'tfRemark',
                    width: 150
            }
        ];
        return(
            <div>
                <SearchBox 
                 query={this.queryHandler}
                 handleReset={()=>this.handleReset()}
                 changeQueryToggle={()=>this.changeQueryToggle()}
                 isShow={isShow}
                 wrappedComponentRef={(form) => this.form = form}
                />
                <Row>
                    <Button type="primary" style={{marginLeft:8,marginRight:8}}>
                    <Link to={{pathname:`/storage/wareHouseMgt/addWareHouse`}}>入库</Link></Button>
                    <Button type="primary" style={{marginRight:8}}>
                    <Link to={{pathname:`/storage/wareHouseMgt/refund`}}>退货</Link></Button>
                </Row>
                
                <RemoteTable
                    url={storage.selectImportList}
                    onChange={this.changeQueryTable}
                    ref='table'
                    query={this.state.query}
                    scroll={{x: '150%', y : document.body.clientHeight - 110 }}
                    columns={columns}
                    rowKey={'inId'}
                    showHeader={true}
                    style={{marginTop: 10}}
                    size="small">
                </RemoteTable>
            </div>
        )
    }
}
export default withRouter(connect(state => state, dispatch => ({
    setSearch: (key, value) => dispatch(search.setSearch(key, value)),
    clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
  }))(WareHouseRecord));
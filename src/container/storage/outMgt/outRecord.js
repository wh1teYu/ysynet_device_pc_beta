/*
 * @Author: yuwei  - 出库纪录
 * @Date: 2018-06-12 18:05:02 
* @Last Modified time: 2018-06-12 18:05:02 outRecord
 */
import React , { Component }from 'react';
import { Link } from 'react-router-dom';
import request from '../../../utils/request';
import { Form, Row, Col, Input, DatePicker,Button,Select,message} from 'antd';
import TableGrid from '../../../component/tableGrid';
import storage from '../../../api/storage';
import queryString from 'querystring';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { search } from '../../../service';
const { RemoteTable } = TableGrid;

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
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
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch}>
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
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'出库方式'}>
                        {getFieldDecorator('outMode',{
                            initialValue:""
                        })(
                            <Select>
                                <Option value="" key={-1}>全部</Option>
                                <Option value="02">科室领用出库</Option>
                                <Option value="05">退库出库</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                  <FormItem {...formItemLayout} label={'领用科室'}>
                      {getFieldDecorator('outDeptGuid',{
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
                                  this.state.outDeptOptions.map((item,index) => {
                                  return <Option key={index} value={item.value}>{item.text}</Option>
                                  })
                              }
                          </Select>
                      )}
                  </FormItem>
                </Col>
                 <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'单号'}>
                        {getFieldDecorator('outNo')(
                            <Input placeholder="请输入出库单号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={7} key={6} >
                    <Button type="primary" htmlType="submit" style={{float:'right',marginTop:3}}>搜索</Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}
const SearchBox = Form.create()(SearchForm);

class OutRecord extends Component{
    state = {
        query:{}
    }
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
      if(search[pathname].startTime&&search[pathname].endTime){
        value.Time=[moment(search[pathname].startTime,'YYYY-MM-DD'),moment(search[pathname].endTime,'YYYY-MM-DD')]
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
                        return <Link to={{pathname:`/storage/outMgt/details/${record.outId}`,state:record}}>详情</Link>
                }
            },{
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
                title : '管理部门',
                dataIndex : 'manageDeptName',
                width: 150,
            },{
                title : '操作员',
                dataIndex : 'createUsername',
                width: 100
            },{
                title : '领用科室',
                dataIndex : 'outDeptName',
                width: 100
            },{
                title : '领用人',
                dataIndex : 'receiver',
                width: 100
            },{
                title : '科室地址',
                dataIndex : 'tfAddress',
                width: 100
            },{
                title : '出库时间',
                dataIndex : 'outDate',
                width: 140,
                render:(text)=>text?text.substr(0,10):""
            },{
                title : '备注',
                dataIndex : 'remark',
                width: 150  
            }
        ];
        return(
            <div>
                <SearchBox 
                    query={this.queryHandler}
                    changeQueryToggle={()=>this.changeQueryToggle()}
                    isShow={isShow}
                    wrappedComponentRef={(form) => this.form = form}
                />
                <Row>
                    <Button type="primary" style={{marginLeft:8,marginRight:8}}>
                    <Link to={{pathname:`/storage/outMgt/receive`}}>领用</Link></Button>

                    <Button type="primary">
                    <Link to={{pathname:`/storage/outMgt/refund`}}>退库</Link></Button>
                </Row>
                
                <RemoteTable
                    onChange={this.changeQueryTable}
                    url={storage.queryOutportAssetList}
                    ref='table'
                    query={this.state.query}
                    scroll={{x: '150%', y : document.body.clientHeight - 110 }}
                    columns={columns}
                    rowKey={'outId'}
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
  }))(OutRecord));
import React, { Component } from 'react';
import {Layout, Icon, Button, Row, Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import './style.css';
import InspectionForm from './component/inspectionForm';
import {timeToStamp} from '../../../utils/tools';
import inspectionMgt from '../../../api/inspectionMgt';
import tableGrid from '../../../component/tableGrid';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import moment from 'moment';
const {RemoteTable} = tableGrid;

const {Content} = Layout;


class InspectionRecord extends Component {
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
        value.createTime=[moment(search[pathname].startTime,'YYYY-MM-DD'),moment(search[pathname].endTime,'YYYY-MM-DD')]
      }
      this.form.props.form.setFieldsValue(value)
    }
  }
    setQuery = (query) => {
        if( query.createTime && query.createTime.length > 0 ) {
            query.startTime = query.createTime[0].format('YYYY-MM-DD');
            query.endTime = query.createTime[1].format('YYYY-MM-DD');
        }else {
            query.startTime = '';
            query.endTime = '';
        };
        delete query.createTime;
        for (const key in query) {
            query[key] = query[key] === undefined? '' : query[key]
        };
        const { setSearch, history ,search } = this.props;
        const pathname = history.location.pathname;
        let values = Object.assign({...search[pathname]},{...query})
        setSearch(pathname, values);
        this.refs.table.fetch(query);
    }

    checkDate = (a, b) => {
        return timeToStamp(a.checkDate) - timeToStamp(b.checkDate);
    }

    createTime = (a, b)=> {
        return timeToStamp(a.createTime) - timeToStamp(b.createTime);
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
    
    render() {
        let {query} = this.state;
        const { search , history } = this.props;
        const pathname = history.location.pathname;
        const isShow = search[pathname] ? search[pathname].toggle:false;
        const columns = [
            {
                title: '巡检单号',
                dataIndex: 'checkNo',
                width: 150,
                render: (text, record) => <Link to={{ pathname: `/inspectionMgt/inspectionRecord/detail/${record.checkGuid}` }}>{text}</Link>
            },
            {
                title: '巡检科室',
                width: 150,
                dataIndex: 'deptNames',
                className: "ellipsis",
                render: (text) => {
                    return (
                        <Tooltip placement="topLeft" title={text}>
                            <span className="ellipsis">{text}</span>
                        </Tooltip>
                    )
                }
            },
            {
                title: '巡检结果',
                width: 240,
                dataIndex: 'checkResult',
                className: "ellipsis",
                render: (text) => {
                    return (
                        <Tooltip placement="topLeft" title={text}>
                            <span className="ellipsis">{text}</span>
                        </Tooltip>
                    )
                }
            },
            {
                title: '巡检日期',
                width: 170,
                dataIndex: 'checkDate',
                sorter: (a, b) => this.checkDate(a,b)
            },
            {
                title: '操作时间',
                width: 170,
                dataIndex: 'createTime',
                sorter: (a, b) => this.createTime(a,b)
            },
            {
                title: '巡检人',
                width: 200,
                dataIndex: 'userNames',
                className: "ellipsis",
                render: (text) => {
                    return (
                        <Tooltip placement="topLeft" title={text}>
                            <span className="ellipsis">{text}</span>
                        </Tooltip>
                    )
                }
            },
        ];
        return (
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
                <InspectionForm 
                    setQuery={this.setQuery} 
                    handleReset={()=>this.handleReset()}
                    changeQueryToggle={()=>this.changeQueryToggle()}
                    isShow={isShow}
                    wrappedComponentRef={(form) => this.form = form}
                />
                <Row style={{ marginBottom: 10 }}>
                    <Link to={{ pathname: `/inspectionMgt/inspectionRecord/newRegister` }}><Button type="primary"><Icon type="plus"/>新建</Button></Link>
                </Row>
                <RemoteTable
                    ref="table"
                    onChange={this.changeQueryTable}
                    pagination={{
                        showTotal: (total, range) => `总共${total}个项目`
                    }}
                    query={query}
                    url={inspectionMgt.queryCheckInfoList}
                    scroll={{x: '100%'}}
                    showHeader={true}
                    columns={columns}
                    size="small"
                    rowKey={'RN'}
                />
            </Content>
        )
    }
}

export default withRouter(connect(state => state, dispatch => ({
    setSearch: (key, value) => dispatch(search.setSearch(key, value)),
    clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
  }))(InspectionRecord));
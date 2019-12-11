/**
 * 我的验收单
 */
import React, { Component } from 'react';
import { Row, Col, Input, Icon, Layout } from 'antd';
import TableGrid from '../../../component/tableGrid';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../../service';
import { Link} from 'react-router-dom';
import assets from '../../../api/assets';
import { repairCommonDataSource,faultDescribeData } from '../../../constants'
import  textTips  from '../../../utils/tools'

const Search = Input.Search;
const { Content } = Layout;
const { RemoteTable } = TableGrid;

class MyCheckList extends Component {
  constructor(props) {
    super(props);
    /* 设置redux前置搜索条件 */
    const { search, history } = this.props;
    const pathname = history.location.pathname;
    this.state = {
      query:search[pathname]?{...search[pathname]}:{menuFstate:"myCheckList"}
    }
  }
  /* 查询时向redux中插入查询参数 */
  queryHandler = (val) => {
    const { setSearch, history ,search } = this.props;
    const pathname = history.location.pathname;
    let values = Object.assign({...search[pathname]},{...val})
    setSearch(pathname, values);
    this.refs.table.fetch(val)
    this.setState({ query:val })
  }
  /* 记录table过滤以及分页数据 */
  changeQueryTable = (values) =>{
    const { setSearch, history ,search} = this.props;
    values = Object.assign({...search[history.location.pathname]},{...values})
    setSearch(history.location.pathname, values);
  }
  render() {
    const { search , history } = this.props;
    const pathname = history.location.pathname;
    const defaultValue = search[pathname]&&search[pathname].params?search[pathname].params:null;
    let columns = [
      {
        title: '操作',
        dataIndex: 'RN',
        width: 80,
        render: (text, record) => {
          if (record.orderFstate === '50') {
            return <Link to={{pathname:`/repairMgt/myCheckList/check/${record.rrpairOrderGuid}`,state: record}}>
                    <Icon type="check-circle-o" style={{marginRight: 5}}/>验收
                   </Link>
          } else {
            return <Link to={{pathname:`/repairMgt/myCheckList/detail/${record.rrpairOrderGuid}`,state: record}}>
                    <Icon type='profile' style={{marginRight: 5}}/>详情
                   </Link>
          }
        }
      },
      ...repairCommonDataSource,
      {
        title: '故障现象',
        dataIndex: 'faultDescribe',
        width: 200,
        render:(text,record)=>{
          let str = '';
          if(text){
            text.map((item) => {
              return  str += faultDescribeData[item] ? faultDescribeData[item].text + "," : '' 
             }) 
          }
          return str === null ? "" : textTips(200,str.substring(0, str.length - 1));
        }
      }];
    if(search[pathname]&&search[pathname].orderFstate){
      columns[2].filteredValue = search[pathname].orderFstate;
    }
    return (
        <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
          <Row>
            <Col span={12}>
              <Search
                defaultValue={defaultValue}
                placeholder="请输入维修单号/资产编号/资产名称"
                onSearch={value =>  {this.queryHandler({'params':value,menuFstate:"myCheckList"})}}
                style={{ width: 400 }}
                enterButton="搜索"
              />
            </Col>
          </Row>
          <RemoteTable
            ref='table'
            onChange={this.changeQueryTable}
            query={this.state.query}
            url={assets.selectRrpairList}
            scroll={{x: '150%'}}
            columns={columns}
            rowKey={'RN'}
            showHeader={true}
            style={{marginTop: 10}}
            size="small"
          /> 
        </Content>
    )
  }
}
export default withRouter(connect(state => state, dispatch => ({
  setSearch: (key, value) => dispatch(search.setSearch(key, value)),
  clearSearch:(key, value) => dispatch(search.clearSearch(key, value)),
}))(MyCheckList));
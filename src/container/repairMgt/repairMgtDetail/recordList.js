 /**
 *  维修管理-维修记录-详情-操作记录
 */
import React, { Component } from 'react';
import { Row,Col,Input } from 'antd';
import assets from '../../../api/assets';
import TableGrid from '../../../component/tableGrid';

const Search = Input.Search;
const { RemoteTable } = TableGrid;

class RecordList extends Component {
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query })
  }

  render () {
    const columns = [
      {
        title: '操作员',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '操作分类',
        dataIndex: 'operType',
        width: 100
      },
      {
        title: '操作时间',
        dataIndex: 'operTime',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
      }
    ];
    return (
      <div>
        <Row>
          <Col span={12}>
            <Search
              placeholder="请输入操作分类/操作员"
              onSearch={value =>  {this.queryHandler({'params':value})}}
              style={{ width: 400 }}
              enterButton="搜索"
            />
          </Col>
        </Row>
         <RemoteTable
            ref='table'
            query={{rrpairOrderGuid:this.props.rrpairOrderGuid}}
            url={assets.selectEqOperationList}
            scroll={{x: '100%',y:  document.body.clientHeight - 381}}
            columns={columns}
            rowKey={'RN'}
            style={{marginTop: 10}}
            size="small"
          /> 
      </div>
    )
  }
}
export default RecordList 
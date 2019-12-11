 /**
 *  档案管理-资产档案-详情-操作记录
 */
import React, { Component } from 'react';
import TableGrid from '../../../component/tableGrid';
import assets from '../../../api/assets';

const { RemoteTable } = TableGrid;

class RecordList extends Component {
  render () {
    const columns = [
      {
        title: '操作分类',
        dataIndex: 'opType',
        width: 100
      },
      {
        title: '操作内容',
        dataIndex: 'opText',
        width: 100
      },
      {
        title: '操作前',
        dataIndex: 'opA',
        width: 100
      },
      {
        title: '操作结果',
        dataIndex: 'opB',
        width: 100,
      },
      {
        title: '操作员',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '操作时间',
        dataIndex: 'opTime',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'tfRemark',
        width: 100,
      }
    ];
    return (
      <div>
         <RemoteTable
            query={{ assetsRecord: this.props.assetsRecord }}
            ref='remote'
            url={assets.selectEqOperationInfoList}
            scroll={{x: '100%', y : document.body.clientHeight - 341}}
            columns={columns}
            showHeader={true}
            rowKey={'RN'}
            style={{marginTop: 10}}
            size="small"
          /> 
      </div>
    )
  }
}
export default RecordList 
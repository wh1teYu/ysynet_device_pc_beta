/**
 * 维修记录-详情-基本信息-资产配件
 */
import React, { Component } from 'react';
import assets from '../../../api/assets';
import TableGrid from '../../../component/tableGrid';
const { RemoteTable } = TableGrid;

class AssetParts extends Component {
  render () {
    const columns = [
      {
        title: '配件编号',
        dataIndex: 'assetsRecord',
        width: 100
      },
      {
        title: '配件名称',
        dataIndex: 'acceName',
        width: 100
      },
      {
        title: '型号',
        dataIndex: 'acceFmodel',
        width: 100
      },
      {
        title: '规格',
        dataIndex: 'acceSpec',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'acceNum',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'acceUnit',
        width: 100
      },
      {
        title: '价格',
        dataIndex: 'money',
        width: 100
      }
    ];
    return (
      <div>
         <RemoteTable
            query={{ rrpairOrderGuid: this.props.rrpairOrderGuid }}
            ref='remote'
            url={assets.selectRrpairFittingList}
            scroll={{x: '120%',y:400}}
            columns={columns}
            showHeader={true}
            rowKey={'rrpairFittingUseGuid'}
            style={{marginTop: 10}}
            size="small"
          /> 
      </div>
    )
  }
}
export default AssetParts 
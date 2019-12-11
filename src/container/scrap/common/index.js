import React from 'react';
import { Tooltip, Badge } from 'antd';
import moment from 'moment';
export const checkStateSel = [
  { text: '已鉴定', value: '01' },
  { text: '已完成', value: '07' },
  { text: '已关闭', value: '08' },
  { text: '待鉴定', value: '00' },
] 
const getStatus = text => {
  switch (text) {
    case '01':
      return { text: '已鉴定', value: 'processing'}
    case '07':
      return { text: '已完成', value: 'success'}
    case '08':
      return { text: '已关闭', value: 'error'}
    default:
      return { text: '待鉴定', value: 'warning'}
  }
}
export let scrapColumns = [
  { title: '报废单号', width: 200, dataIndex: 'scrapNo' },
  { title: '单据状态', width: 100, dataIndex: 'fstate', 
  filters: checkStateSel,
  onFilter: (value, record) => (record && record.fstate===value),
  render: text => {
    const status = getStatus(text);
    return(
      <Badge status={status.value} text={status.text} />
    )
  }},
  { title: '申请时间', width: 150, dataIndex: 'createDate', render: text => moment(text).format('YYYY-MM-DD')},
  { title: '申请人', width: 100, dataIndex: 'userName' },
  { title: '资产名称', width: 300, dataIndex: 'equipmentStandardName' },
  { title: '型号', width: 200, dataIndex: 'spec' },
  { title: '规格', width: 200, dataIndex: 'fmodel' },
  { title: '使用科室', width: 200, dataIndex: 'useDeptName' },
  { title: '报废原因', width: 300, dataIndex: 'scrapCause', className: 'ant-table-ellipsis', 
    render: text => <Tooltip title={text} placement="topRight">
                <span>{text}</span>
              </Tooltip> }
]
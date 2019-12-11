/**
 * @file 资产报废 - 报废管理
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import ScrapForm from '../common/scrapForm'
import { scrapColumns } from '../common';
import querystring from 'querystring';
const newColums = [
  { title: '操作', width: 100, dataIndex: 'name0', render: (text, record) => (
    record.fstate !== '01' ? 
    <Link to={`/scrap/scrapManager/${record.scrapGuid}`}>详情</Link> : 
    <Link to={`/scrap/scrapManager/execute/${record.scrapGuid}`}>执行</Link>
  )}, 
  ...scrapColumns
]
class ScrapManager extends PureComponent {
  render() {
    return (
      <ScrapForm columns={newColums} defaultParams={querystring.stringify({findType: 'GL'})}/>
    )
  }
}

export default ScrapManager;
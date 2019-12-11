/**
 * @file 资产报废 - 技术鉴定
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import ScrapForm from '../common/scrapForm'
import { scrapColumns } from '../common';
import { Link } from 'react-router-dom';
import querystring from 'querystring';
const newColums = [
  { title: '操作', width: 100, dataIndex: 'scrapGuid', render: (text, record) => (
    <Link to={`/scrap/scrapAppraisal/${text}`}>鉴定</Link>
  )},
  ...scrapColumns
]

class ScrapAppraisal extends PureComponent {
  render() {
    return (
      <ScrapForm columns={newColums} defaultParams={querystring.stringify({findType: 'JD'})}/>
    )
  }
}
export default ScrapAppraisal;
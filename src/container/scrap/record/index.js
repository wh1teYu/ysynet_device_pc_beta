/**
 * @file 资产报废 - 报废记录
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import { scrapColumns } from '../common';
import { Link } from 'react-router-dom';
import ScrapForm from '../common/scrapForm'
import querystring from 'querystring';
//import Slider from '../../../component/slider'

class ScrapRecord extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    //   isOpen: false,
    //   content: null
    }
  }
  
  render() {
    //const { isOpen, content } = this.state;
    const newColums = [
      { title: '操作', width: 100, dataIndex: 'scrapGuid', render: text => (
        <Link to={`/scrap/scrapRecord/${text}`}>详情</Link>
        //<a className='detailBtn' onClick={() => this.setState({ content: <p>{text}</p>, isOpen: true })}> 详情 </a>
      )}, 
      ...scrapColumns
    ]
    return (
      //<Slider isOpen={isOpen} content={content} closeExcludeDom={['detailBtn']} width={1000}>
        <ScrapForm columns={newColums} defaultParams={querystring.stringify({findType: 'JL'})}/>
      //</Slider>  
    )
  }
}

export default ScrapRecord;
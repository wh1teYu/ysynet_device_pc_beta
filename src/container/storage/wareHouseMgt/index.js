/*
 * @Author: yuwei - 入库管理
 * @Date: 2018-06-12 15:27:29 
* @Last Modified time: 2018-06-12 15:27:29 
 */
import React , { Component } from 'react';
import { Tabs ,  Layout} from 'antd';
import WareHouseRecord from './wareHouseRecord';
import WareHouseDetails from './wareHouseDetails';
const { Content } = Layout;
const TabPane = Tabs.TabPane;


class wareHouseMgt extends Component {
  state = {
      activeKey: '1'
  }
  render(){
    const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query ;
    const selectTab = typeof query.activeKey === 'undefined' ? '1' : query.activeKey;

    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <Tabs defaultActiveKey={selectTab}>
          <TabPane tab="入库记录" key="1">
              <WareHouseRecord router={this.props.router}/>
          </TabPane>
          <TabPane tab="入库明细" key="2">
              <WareHouseDetails router={this.props.router}/>
          </TabPane>
        </Tabs>
      </Content>
    )
  }
}
export default wareHouseMgt ;

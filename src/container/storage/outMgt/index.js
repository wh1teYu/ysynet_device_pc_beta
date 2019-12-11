/*
 * @Author: yuwei - 出库管理
 * @Date: 2018-06-12 15:27:16 
* @Last Modified time: 2018-06-12 15:27:16 
 */
import React , { Component } from 'react';
import { Tabs ,  Layout} from 'antd';
import OutRecord from './outRecord';
import OutDetails from './outDetails';
const { Content } = Layout;
const TabPane = Tabs.TabPane;


class outMgt extends Component {
  state = {
    activeKey: '1'
  }
  render(){
    const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query ;
    const selectTab = typeof query.activeKey === 'undefined' ? '1' : query.activeKey;

    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}} >
      
        <Tabs defaultActiveKey={selectTab}>
          <TabPane tab="出库记录" key="1">
              <OutRecord router={this.props.router}/>
          </TabPane>
          <TabPane tab="出库明细" key="2">
              <OutDetails router={this.props.router}/>
          </TabPane>
        </Tabs>
      </Content>
    )
  }
}
export default outMgt ;

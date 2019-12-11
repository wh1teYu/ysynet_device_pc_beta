/**
 * @file 报废 - 报废管理 - 报废详情
 */
import React, { PureComponent } from 'react';
import { Layout, Tabs } from 'antd';
import AssetsInfo from '../common/assetsInfo';  
import ScrapInfo from '../common/scrapInfo';  
import AppraisalInfo from '../common/appraisalInfo';
import ImplementInfo from '../common/implementInfo';
import querystring from 'querystring';
import { productTypeData } from '../../../constants';
import { queryScrapDetailById } from '../../../api/scrap';
const { Content } = Layout;
const TabPane = Tabs.TabPane;
class ScrapManagerDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      assetsData: {},
      scrapData: {},
      appraisalData: {},
      executeData: {}
    }
  }
  async componentDidMount() {
    const { match } = this.props;
    const data = await queryScrapDetailById({
      body: querystring.stringify({
        scrapGuid: match.params.id
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (data.status && data.result) {
      const { assetsRecord, equipmentStandardName, fmodel, spec, userName, identifyDate, 
        scrapCause, useSituation, scrapAccessory, identifyOpinion, identifyName, executeScrapOpinion,
        spAccessory, useDept, custodian, bDept, originalValue, productType } = data.result;
      const assetsData = {
        assetsRecord, equipmentStandardName, fmodel, spec, useDept, custodian, bDept, originalValue,
        productType: productTypeData[productType],
      }
      const scrapData = {
        scrapCause, useSituation, scrapAccessory
      }
      const appraisalData = {
        userName, identifyDate, identifyOpinion, identifyName
      }
      const executeData = {
        executeScrapOpinion,
        spAccessory
      }
      this.setState({ assetsData, scrapData, appraisalData, executeData })
    }
  }
  render() {
    const { assetsData, scrapData, appraisalData, executeData } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Tabs defaultActiveKey="1">
          <TabPane tab="资产信息" key="1">
            <AssetsInfo data={assetsData}/>
          </TabPane>
          <TabPane tab="报废信息" key="2">
            <ScrapInfo data={scrapData}/>
          </TabPane>
          <TabPane tab="技术鉴定" key="3">
            <AppraisalInfo data={appraisalData}/>
          </TabPane>
          <TabPane tab="报废执行" key="4">
            <ImplementInfo data={executeData}/>
          </TabPane>
        </Tabs>
      </Content>      
    )
  }
}

export default ScrapManagerDetail;
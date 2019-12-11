/**
 * @file 报废 - 报废管理 - 报废详情
 */
import React, { PureComponent } from 'react';
import { Layout, Tabs, Card , Button} from 'antd';
import AssetsInfo from '../common/assetsInfo';  
import ScrapInfo from '../common/scrapInfo';  
import AppraisalInfo from '../common/appraisalInfo';
import ImplementInfo from '../common/implementInfo';
import { withRouter } from 'react-router-dom';
import querystring from 'querystring';
import { productTypeData } from '../../../constants';
import { queryScrapDetailById , scrap } from '../../../api/scrap';
const { Content } = Layout;
const TabPane = Tabs.TabPane;
class ScrapRecordDetail extends PureComponent {
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
  printDetail = ()=>{
    console.log(scrap.printScrapInfo)
    let id = this.props.match.params.id;
    window.open(`${scrap.printScrapInfo}?scrapGuid=${id}`)
  }
  render() {
    const { assetsData, scrapData, appraisalData, executeData } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Card title='资产信息' extra={<Button type='primary' onClick={this.printDetail}>打印</Button>}>
        <AssetsInfo data={assetsData}/></Card>
        <Tabs defaultActiveKey="2">
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

export default withRouter(ScrapRecordDetail);
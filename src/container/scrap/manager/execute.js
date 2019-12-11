/**
 * @file 报废 - 报废管理 - 报废详情
 */
import React, { PureComponent } from 'react';
import { Layout, Tabs, Card, Form, Row, Col, Input, Affix, Button, message, Modal } from 'antd';
import AssetsInfo from '../common/assetsInfo';  
import ScrapInfo from '../common/scrapInfo';  
import AppraisalInfo from '../common/appraisalInfo';
import querystring from 'querystring';
import { productTypeData } from '../../../constants';
import { queryScrapDetailById, updateScrap } from '../../../api/scrap';
import PicWall from '../../../component/picWall'
const { Content } = Layout;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const formItemLayoutForOne = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
class ScrapManagerExecute extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      assetsData: {},
      scrapData: {},
      appraisalData: {},
      postFile: [],
      isLoading: false,
      scrapGuid: null, //主键
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
        scrapCause, useSituation, scrapAccessory, identifyOpinion, scrapGuid,
        identifyName, useDept, custodian, bDept, originalValue, productType } = data.result;
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
      this.setState({ assetsData, scrapData, appraisalData, scrapGuid })
    }
  }
  submitAction = (title, values, type) => {
    this.setState({ isLoading: true })
    confirm({
      title: `是否确认${title}`,
      content: `请确定是否${title}该条记录?`,
      onOk: async () => {
        const data = await updateScrap({
          body: querystring.stringify({
            ...values, updateType: type, scrapGuid: this.state.scrapGuid
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        if (data.status) {
          message.success(`${title}成功, 即将跳回至报废管理`, 1, () => {
            this.props.history.push({pathname: '/scrap/scrapManager'})
          })
        }
        this.setState({ isLoading: false })
      },
      onCancel: () => this.setState({ isLoading: false })
    });
  }
  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const postFile = this.state.postFile;
        let files = [];
        postFile.map(item => files.push(item.thumbUrl))
        this.submitAction('完成', {...values, spAccessorys: files}, 'FINISH')
      }
    });
  }
  onClose = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const postFile = this.state.postFile;
        let files = [];
        postFile.map(item => files.push(item.thumbUrl))
        this.submitAction('关闭', {...values, spAccessorys: files}, 'CLOSE')
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { assetsData, scrapData, appraisalData, isLoading } = this.state;
    return (
      <Content className='ysynet-content'>
        <Affix>
          <Row style={{marginBottom: 8}}>
            <Col span={24} style={{textAlign: 'right', padding: '5px 50px', background: '#fff'}}>
              <Button loading={isLoading} size='lg' onClick={this.onClose}>关闭</Button>
              <Button loading={isLoading} size='lg' onClick={this.onSubmit} type='primary' style={{marginLeft: 10}}>完成</Button>
            </Col>
          </Row>
        </Affix>  
        <Tabs defaultActiveKey="1" style={{background: '#fff'}}>
          <TabPane tab="资产信息" key="1">
            <AssetsInfo data={assetsData}/>
          </TabPane>
          <TabPane tab="报废信息" key="2">
            <ScrapInfo data={scrapData}/>
          </TabPane>
          <TabPane tab="技术鉴定" key="3">
            <AppraisalInfo data={appraisalData}/>
          </TabPane>
        </Tabs>
        <Card title='报废执行'>
          <Form onSubmit={this.onSubmit}>
            <Row>
              <Col span={24}>
                <FormItem label={`意见`} {...formItemLayoutForOne}>
                  {getFieldDecorator(`executeScrapOpinion`, {
                    rules: [{ required: true, message: '鉴定意见不允许为空' }],
                  })(
                    <TextArea rows={4} placeholder='请输入审批意见'/>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={`审批附件`} {...formItemLayoutForOne}>
                  <PicWall file={data => this.setState({postFile: data})}/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Content>      
    )
  }
}

export default Form.create()(ScrapManagerExecute);
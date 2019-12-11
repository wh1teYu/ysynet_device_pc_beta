/**
 * @file 资产报废 - 技术鉴定 - 详情
 */
import React, { PureComponent } from 'react';
import { Layout, Row, Col, Card, Form, Affix, Modal, Button, message,
  Tabs, Checkbox, Select, DatePicker, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import AssetsInfo from '../common/assetsInfo';  
import ScrapInfo from '../common/scrapInfo'; 
import { selectStaticDataList, queryScrapDetailById, updateScrap } from '../../../api/scrap'; 
import { getUsers } from '../../../api/common'; 
import querystring from 'querystring';
import { productTypeData } from '../../../constants';
import moment from 'moment';  
const confirm = Modal.confirm;
const { Content } = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
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
class AppraisalDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      userOption: [],
      isLoading: false,
      assetsData: {},
      scrapData: {},
      scrapGuid: null, // 主键
    }
  }
  async componentDidMount() {
    const data = await selectStaticDataList();
    const { match } = this.props;
    if (data.status && data.result) {
      this.setState({ options: data.result.rows })
    }
    const user = await getUsers();
    if (user.status && user.result) {
      this.setState({ userOption: user.result })
    }
    const listData = await queryScrapDetailById({
      body: querystring.stringify({ scrapGuid: match.params.id }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    if (listData.status && listData.result) {
      const { assetsRecord, equipmentStandardName, fmodel, spec, 
        scrapCause, useSituation, scrapAccessory, scrapGuid,
        useDept, custodian, bDept, originalValue, productType } = listData.result;
      const assetsData = {
        assetsRecord, equipmentStandardName, fmodel, spec, useDept, custodian, bDept, originalValue,
        productType: productTypeData[productType],
      }
      const scrapData = {
        scrapCause, useSituation, scrapAccessory
      }
      this.setState({ assetsData, scrapData, scrapGuid })
    }
  }
  submit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({ isLoading: true })
        confirm({
          title: '是否确认鉴定',
          content: `请确定是否完成鉴定?`,
          onOk: async () => {
            values.identifyDate = moment(values.identifyDate).format('YYYY-MM-DD');
            const data = await updateScrap({
              body: querystring.stringify({
                ...values, updateType: 'IDENTIFY', scrapGuid: this.state.scrapGuid
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            if (data.status) {
              message.success('鉴定完成, 即将跳回至鉴定选择页面', 1, () => {
                this.props.history.push({pathname: '/scrap/scrapAppraisal'})
              })
            }else{
              message.warning(data.msg)
            }
            this.setState({ isLoading: false })
          },
          onCancel: () => this.setState({ isLoading: false })
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLoading, assetsData, scrapData } = this.state;
    return (
      <Content className='ysynet-content ysynet-common-bgColor'>
        <Form onSubmit={this.submit}>  
          <Affix>
            <Row>
              <Col span={24} style={{textAlign: 'right', padding: '5px 50px', background: '#fff'}}><Button loading={isLoading} type='primary' htmlType='submit'>提交</Button></Col>
            </Row>
          </Affix>  
          <Tabs defaultActiveKey="1">
            <TabPane tab="资产信息" key="1">
              <AssetsInfo data={assetsData}/>
            </TabPane>
            <TabPane tab="报废信息" key="2">
              <ScrapInfo data={scrapData}/>
            </TabPane>
          </Tabs>
            <Card title='技术鉴定'>
              <Row>
                <Col>
                  <FormItem label={`鉴定参数`} {...formItemLayoutForOne}>
                    {getFieldDecorator(`identifyFlags`, {
                      rules: [{ required: true, message: '至少选择一项参数!' }],
                    })(
                      <Checkbox.Group>
                        <Row>
                          {
                            this.state.options.map((item, index) => (
                              <Col span={24} key={index}><Checkbox value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Checkbox></Col>
                            ))
                          }
                        </Row>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>  
                  <FormItem label={`鉴定人`} {...formItemLayout}>
                    {getFieldDecorator(`identifyUserid`)(
                      <Select>
                        {
                          this.state.userOption.map((item, index) => (
                            <Option value={item.value} key={index}>{`${item.userName}(${item.deptName})`}</Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>  
                  <FormItem label={`鉴定时间`} {...formItemLayout}>
                    {getFieldDecorator(`identifyDate`, {
                      initialValue: moment()
                    })(
                      <DatePicker />
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label={`鉴定意见`} {...formItemLayoutForOne}>
                    {getFieldDecorator(`identifyOpinion`, {
                      rules: [{ required: true, message: '鉴定意见不允许为空' }],
                    })(
                      <TextArea rows={4} placeholder='请输入鉴定意见'/>
                    )}
                  </FormItem>
                </Col>
              </Row>  
            </Card>
        </Form>
      </Content> 
    )
  }
}

export default withRouter(Form.create()(AppraisalDetail));
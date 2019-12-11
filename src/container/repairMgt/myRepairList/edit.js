/**
 * 指派维修-我的指派-指派
 */
import React, { Component } from 'react';
import { Row, Col,Collapse ,Steps,Button} from 'antd';
import styles from '../../ledger/ledgerArchives/style.css';
const Panel = Collapse.Panel;
const Step = Steps.Step;

class EditInfo extends Component {
  render () {
    return (
      <div>
        <Steps size="small" current={1}>
          <Step title="故障报修" />
          <Step title="接单维修" />
          <Step title="检查验收" />
          <Step title="关闭工单" />
        </Steps>
        <Button type="primary" style={{marginTop:10,marginBottom:10}}>提交</Button>
        <Collapse defaultActiveKey={['1','2']}>
          <Panel header="报修信息" key="1">
            <Row type="flex" style={{marginTop: 16}}  className={styles['table-row']}>
              <Col span={4} className={styles['table-span']}>资产编号</Col>
              <Col span={8} className={styles['table-span']}>{ }</Col>
              <Col span={4} className={styles['table-span']}>资产名称</Col>
              <Col span={8} className={styles['table-span']}>{ }</Col>
              <Col span={4} className={styles['table-span']}>型号</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>规格</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>资产类别</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>使用科室</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>存放地址</Col>
              <Col span={8} className={styles['table-span']}>{ }</Col>
              <Col span={4} className={styles['table-span']}>报修来源</Col>
              <Col span={8} className={styles['table-span']}>{}</Col>
              <Col span={4} className={styles['table-span']}>紧急度</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>有无备用</Col>
              <Col span={8} className={styles['table-span']}>{ }</Col>
              <Col span={4} className={styles['table-span']}>是否在保</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>是否送修</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>报修部门</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>报修时间</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>报修人</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>联系电话</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>故障现象</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>是否停用</Col>
              <Col span={8} className={styles['table-span']}>{ }</Col>
              <Col span={4} className={styles['table-span']}>故障描述</Col>
              <Col span={8} className={styles['table-span']}>{ }</Col>
              <Col span={4} className={styles['table-span']}>报修备注</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}>附件</Col>
              <Col span={8} className={styles['table-span']}>{  }</Col>
              <Col span={4} className={styles['table-span']}></Col>
              <Col span={8} className={styles['table-span']}></Col>
            </Row>
          </Panel>
          <Panel header="维修信息" key="2">
            
          </Panel>
        </Collapse>
      </div>
    )
  }
}
export default EditInfo;


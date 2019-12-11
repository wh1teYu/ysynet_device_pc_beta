/**
 * @file 工作台
 */
import React, { Component } from 'react';

import { Layout, Card, Select, Row, Col, message, Icon } from 'antd';

import workplace from '../../api/workplace';

import queryString from 'querystring';

import request from '../../utils/request';

import S from './style.css';

const { Content } = Layout;

const { Option } = Select;

class Workplace extends Component {
  state={
    matterData: [],   //待办事项
    documentData: [],   //单据类型数据
    documentColor: {},
    billList: [],       //最新单据列表
    textMap: {          //单据对应文字
      "01": "维修单",
      "02": "保养计划",
      "03": "计量台账",
      "04": "维修单",
      "05": "报废申请单"
    },
    nameMap: {
      awaitCheck: '维修验收',
      notTurned: '转科审批',
      maintainNumber: '保养到期',
      awaitDispatch: '维修派工',
      meter: '计量到期',
      awaitRepair: '等待维修',
      scrapNumber: '报废申请',
      maintenance: '维修处理'
    },
    code: ''
  };

  componentDidMount() {
    const commissionList = new Promise((resolve, reject) => {
      request(workplace.commissionList, {
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (data) => {
          if(data.status) {
            resolve(data.result[0])
          }else {
            message(data.msg);
          }
        },
        error: err => reject(err)
      });
    });
    const billTypeList = new Promise((resolve, reject) => {
      request(workplace.billTypeList, {
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (data) => {
          if(data.status) {
            resolve(data.result);
          }else {
            message(data.msg);
          }
        },
        error: err => reject(err)
      });
    });
    Promise.all([commissionList, billTypeList])
    .then((posts) => {
      let matterData = this.dataDispose(posts[0]);
      if(posts[1].length > 0) {
        this.upDateDocu(posts[1][0].code);
      };
      this.setState({
        matterData,
        documentData: posts[1],
        code: posts[1].length > 0? posts[1][0].code : ''
      });
    });
  }

  dataDispose = (data) => {
    let arr = [],
        {nameMap} = this.state;
    for (const key in data) {
      arr.push({
        name: nameMap[key],
        anotherName: key,
        num: data[key]
      });
    };
    return arr;
  }

  upDateDocu = (code) => {
    request(workplace.queryBillList, {
      body: queryString.stringify({
        code
      }),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (data) => {
        if(data.status) {
          this.setState({
            billList: data.result.rows,
            code
          });
        }else {
          message.error(data.msg);
        }
      },
      error: err => console.log(err)
    })
  }



  render() {
    let {matterData, billList, documentData, code, textMap,} = this.state;
    if(matterData.length > 0) {
      matterData = matterData.map( (item, i) => {
        return (
          <Col key={i} span={4}>
            <div className={`${S[item.anotherName]} ${S['matter-card']}`}>
              <div className={S['matter-card-img']}><img src={require(`./Icon/${item.anotherName}.png`)} alt={item.name}/></div>
              <div className={S['matter-card-text']}>
                <h1 className={S[`${item.anotherName}-text`]} >{item.num}</h1>
                <div>
                  <span>{item.name}</span>
                </div>
              </div>
            </div>
          </Col>
        )
      });
    }else {
      matterData = (<h3 style={{margin: 0, color: "rgb(36, 143, 252)"}}><Icon type="frown" />暂无待办事项</h3>)
    };
    if(billList.length> 0) {
      billList = billList.map((item, i) => {
        return (
          <Col key={i} style={{ marginBottom: 16 }} span={6}>
              <div style={{padding: 20, background: '#fff', border: '1px solid rgba(0, 0, 0, 0.2)'}}>
                <Row>
                  <Col span={18}>
                    <img alt="" src={require(`./Icon/0${code}.png`)} />
                    <span style={{paddingLeft: 10}} className={S['bill-text']}>{item.billNo}</span>
                  </Col>
                  <Col span={6} className={S['bill-text']} style={{textAlign: 'right'}}>{item.fstate}</Col>
                </Row>
                <Row style={{margin: '20px 0 14px', color: 'rgba(0, 0, 0, .8)'}}>
                  <Col span={12}>
                    <span>{textMap[code]}</span>
                  </Col>
                  <Col span={12} style={{textAlign: 'right'}}>{item.time}</Col>
                </Row>
              </div>
            </Col>
        )
      });
    }else {
      billList = (<Col span={24} style={{ textAlign: 'center' }}><span style={{fontSize: 20, color: "rgb(39, 184, 190)"}}><Icon type="frown" />该类型暂无最新单据</span></Col>);
    };

    documentData = documentData.map((item, i) => {
      return (
        <Option key={item.code} value={item.code}>{item.name}</Option>
      )
    });
    return (
      <Content>
        <Card title={<h1 style={{fontSize: 28, margin: 0}}>您好，今日的待办事项</h1>} bordered={false}>
          <Row type="flex" justify="space-around" align="middle">
            {matterData}
          </Row>
        </Card>
        <Row style={{background: '#fff', padding: '0 20px'}}>
          <Col style={{lineHeight: '40px'}} span={8}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                borderBottom: '5px solid rgb(36, 143, 252)',
                paddingBottom: 6,
              }}
            >最新单据</span>
          </Col>
          <Col style={{float: 'right'}} span={8}>
            <div className="ant-row ant-form-item" style={{marginBottom: 0}}>
                <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
                  <label>单据类型</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className="ant-form-item-control">
                    <Select
                      showSearch
                      placeholder={'请选择'}
                      style={{width: '100%'}}
                      onSelect={this.upDateDocu}
                      value = {code}
                    >
                      {documentData}
                    </Select>
                  </div>
                </div>
              </div>
          </Col>
        </Row>
        <Row style={{margin: '20px 12px'}} gutter={16}>
          {billList}
        </Row>
      </Content>
    )
  }
}

export default Workplace;
// export default withRouter(connect(state => state)(Workplace));

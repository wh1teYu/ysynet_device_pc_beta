/*
 * @Author: yuwei - 我的档案 - 效益分析
 * @Date: 2018-06-08 16:45:12 
* @Last Modified time: 2018-06-08 16:45:12 
 */

import React, { Component } from 'react';
import {  DatePicker,Card,Avatar,Modal,Row,Col,message} from 'antd';
import { Chart, Geom, Axis, Coord,Guide } from 'bizcharts';
import { withRouter } from 'react-router';
import DataAnalysis from './dataAnalysis';//数据分析
import { connect } from 'react-redux';
import { DataSet } from '@antv/data-set';
import { ledger as ledgerService } from '../../../service';
import request from '../../../utils/request';
import assets from '../../../api/assets';
import querystring from 'querystring';
import moment from 'moment';
const { MonthPicker } = DatePicker;
const { Meta } = Card;

//饼图1数据
const { Html } = Guide;
const { Text } = Guide;
const { DataView } = DataSet;
const data1 = [
  { item:'1',count: Math.random() },
  { item:'2',count: Math.random() }
  ];
  const dv1 = new DataView();
  dv1.source(data1).transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
  });
  const cols1 = {
  percent: {
    formatter: val => {
      val = (val * 100).toFixed(2) + '%';
      return val;
    }
  }  
}

const data2 = [
  { item:'1',count: Math.random() },
  { item:'2',count: Math.random() }
  ];
  const dv2 = new DataView();
  dv2.source(data2).transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
  });
  const cols2 = {
  percent: {
    formatter: val => {
      val = (val * 100).toFixed(2) + '%';
      return val;
    }
  }  
}

class LedgerArchivesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssetInfoData: {},
      yxcsData :[
        {
          "description": "开机总时长",
          "title":"0" ,
          "img": "icon_computer_a.png",
          "type": "kjzscData"
        },
        {
          "description": "故障时长",
          "title":"0" ,
          "img": "icon_fault_a.png",
          "type": "gzzscData"
        },
        {
          "description": "工作时长",
          "title":"0" ,
          "img": "icon_time_a.png",
        },
        {
          "description": "使用次数",
          "title": "0",
          "img": "icon_frequency_a.png",
        }
      ],
      xyfxData1 : [{
        "description": "总收入",
        "title": "0",
        "img": "icon_income_a.png",
        "imgHover": "icon_income_b.png",
        "type": "zsrData"
        },
        {
          "description": "总支出",
          "title":"0",
          "img": "icon_expenditure_a.png",
          "imgHover": "icon_expenditure_b.png",
          "type": "zzcData"
        }
      ],
      xyfxData2 : [
      {
        "description": "月保本量",
        "title": "0",
        "img": "icon_month_a.png",
        "imgHover": "icon_month_b.png"
      },
      {
        "description": "投资回收期(年)",
        "title": "0",
        "img": "icon_data_a.png",
        "imgHover": "icon_data_b.png"
      }],
      item:'',//区别模块
      tzlyl:0,
      lrl: 0,
      visible: false
    }
  }
  //获取id 根据id号查详情
  componentWillMount = () =>{
    this.getDetails();
    this.getData();
  }
  getData = (dataTime)=>{
    const assetsRecordGuid = this.props.match.params.id;
    const params = { assetsRecordGuid: assetsRecordGuid , dataTime :(dataTime || this.getNowTime()) };
    console.log(params)
    let options = {
      body:querystring.stringify(params),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
         //在这里对数据做处理
          const {benefitRunResult,benefitIncomeResult,benefitProfitsResult,tzsyl,lrl} =  data.result;

          this.setState({
            "yxcsData":benefitRunResult,
            "xyfxData1":benefitIncomeResult,
            "xyfxData2":benefitProfitsResult,
            "tzlyl":tzsyl,
            "lrl": lrl
          })
        }else{
          message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    }
    request(assets.selectAssetsBenefitMap,options)
  }
  getDetails = ()=>{
    const assetsRecordGuid = this.props.match.params.id;
    const { getSelectAssetsRecordDetail } = this.props;
    const params = { assetsRecordGuid: assetsRecordGuid };
    getSelectAssetsRecordDetail(assets.selectAssetsRecordDetail , querystring.stringify(params),(data) => {
      this.setState( { AssetInfoData : data.result })
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })
  }
  getNowTime = ()=>{
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth()+1 >10 ? date.getMonth()+1 : '0'+ (date.getMonth()+1);
    return `${y}-${m}`;
  }
  //选择月份
  handleChangeMonth = (e,dataTime) =>{
    this.setState({dataTime})//2018-06
    this.getData(dataTime)
 }
  //关闭弹出框
  handleCancel = (e) => {
    this.setState({
      item:[],
      visible: false,
    });
  }
  //显示弹出框
  handleDataAnalysis = (item) => {
    this.setState({
      item: item,
      visible: true,
    });
  }

  //鼠标悬停事件
  handleOnMouseOver = (img) =>{
    img.target.src = require('../../../assets/icon/'+ img.target.alt);
  }
  handleOnMouseOut = (img) =>{
    const str = img.target.alt;
    const strs = str.split('_');
    const newImg = `${strs[0]}_${strs[1]}_a.png`;
    img.target.src = require('../../../assets/icon/'+ newImg);
  }

  render() {
    const { yxcsData ,xyfxData1,xyfxData2,item,tzlyl,lrl } = this.state;
    return (
      <div>
         {
          JSON.stringify(this.state.AssetInfoData) === '{}' || this.state.AssetInfoData === null ? null 
          :
          <div>
            <Card title="资产信息" 
              extra={<div >月份:
              <MonthPicker  defaultValue={ moment(this.getNowTime(),'YYYY-MM')} onChange={this.handleChangeMonth} placeholder="请选择" />
              </div>}>
              <Row type="flex" style={{marginTop: 16}}>
                <Col span={3}>资产编号</Col>
                <Col span={5}>{ this.state.AssetInfoData.assetsRecord }</Col>
                <Col span={3}>资产名称</Col>
                <Col span={5}>{ this.state.AssetInfoData.equipmentStandardName }</Col>
                <Col span={3}>型号</Col>
                <Col span={5}>{ this.state.AssetInfoData.spec }</Col>
              </Row>
              <Row type="flex" style={{marginTop: 16}}>
                <Col span={3}>规格</Col>
                <Col span={5}>{ this.state.AssetInfoData.fmodel }</Col>
              </Row>
          </Card>
          <Card title="运行数据" >
               <Row>
                 {
                   yxcsData.map((item,index) => { 
                    return  <Col span={6} key={index}>
                              <Meta
                                avatar={<Avatar  style={{width:62,height:55,backgroundColor:'#fff',borderRadius:0}} src={require('../../../assets/icon/'+item.img)} />}
                                title={item.title}
                                description={item.description}
                                onClick={this.handleDataAnalysis.bind(this,item)}
                              />
                            </Col>
                   })
                 }
              </Row>
            </Card> 
            <Card title="效益分析">
              <Row>
                <Col span={16} style={{borderRight:'2px dashed #eee'}}>
                  <Row>
                    {
                    xyfxData1.map((item,index) => { 
                      return  <Col span={12} key={index}>
                                <Card bordered={false}>
                                  <Meta
                                  avatar={<img onMouseMove={this.handleOnMouseOver.bind(this)} onMouseOut={this.handleOnMouseOut.bind(this)} alt={item.imgHover}  style={{width:62,height:55}} src={require('../../../assets/icon/'+item.img)} />}
                                  title={item.title}
                                  description={item.description}
                                  onClick={this.handleDataAnalysis.bind(this,item)}
                                  />
                                </Card>
                              </Col>
                            })
                    }
                   {
                    xyfxData2.map((item,index) => { 
                      return  <Col span={12} key={index} style={{marginTop:'50px'}}>
                                <Card bordered={false}>
                                  <Meta
                                  avatar={<img onMouseMove={this.handleOnMouseOver.bind(this)} onMouseOut={this.handleOnMouseOut.bind(this)} alt={item.imgHover}  style={{width:62,height:55}} src={require('../../../assets/icon/'+item.img)} />}
                                  title={item.title}
                                  description={item.description}
                                  />
                                </Card>
                              </Col>
                            })
                    }
                  </Row>
                </Col>
                <Col span={8}>
                  <Col span={24}>
                    <Chart height={300} off data={dv1} scale={cols1} style={{marginTop:'-24px',marginLeft:"-50px"}}>
                      <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                      <Axis name="percent" />
                      <Guide >
                        <Html position ={[ '50%', '62%' ]} html='<div style="color:#8c8c8c;font-size:12px;text-align: center;width: 10em;">投资收益率</div>' alignX='middle' alignY='middle'/>
                        <Text content={tzlyl+"%"} top= {true} position ={[ '45%', '50%' ]} style={{fontSize:18}}/>
                      </Guide>
                      <Geom
                      type="intervalStack"
                      position="percent"
                      color='item'
                      
                      style={{lineWidth: 1,stroke: '#fff'}}
                      >
                      </Geom>
                    </Chart>
                  </Col>
                  <Col span={24}>
                     <Chart height={300}  data={dv2} scale={cols2} style={{marginTop:'-150px',marginLeft:"-50px"}}>
                      <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                      <Axis name="percent" />
                      <Guide >
                         <Html position ={[ '50%', '62%' ]} html='<div style="color:#8c8c8c;font-size:12px;text-align: center;width: 10em;">利润率</div>' alignX='middle' alignY='middle'/>
                         <Text content={lrl+"%"} top= {true} position ={[ '45%', '50%' ]} style={{fontSize:18}}/>
                      </Guide>
                      <Geom
                      type="intervalStack"
                      position="percent"
                      color='item'
                      
                      style={{lineWidth: 1,stroke: '#fff'}}
                      >
                      </Geom>
                    </Chart>
                  </Col>
                </Col>
              </Row>
               </Card>
            </div>
          
         }
          <Modal
              visible={this.state.visible}
              width='640px'
              title={item.description}
              footer={null}
              onCancel={ this.handleCancel}
              destroyOnClose={true}
            >
              <DataAnalysis item={item}/>
            </Modal>
      </div>
    )
  }
}

export default withRouter(connect(null, dispatch => ({
  getSelectAssetsRecordDetail: (url,values,success,type) => ledgerService.getInfo(url,values,success,type),
}))(LedgerArchivesDetail));
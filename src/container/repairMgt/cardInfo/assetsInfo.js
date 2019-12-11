/**
 * @file 资产信息 Card
 */
import React, { PureComponent } from 'react';
import { Row, Col, Input, Form ,message} from 'antd';
import PropTypes from 'prop-types';
import { operation as operationService } from '../../../service';
import querystring from 'querystring';
import assets from '../../../api/assets';
const { Search } = Input;
const gridStyle = {
  label: {
    span: 4,
    style: { textAlign: 'right', height: 50, lineHeight: '50px' }
  }, 
  content: {
    span: 4,
    style: { textAlign: 'left', height: 50, lineHeight: '50px' }
  }
}
class AssetsInfoForm extends PureComponent {
  static defaultProps = {
    isEdit: false,
    data: {}
  };
  static propTypes = {
    isEdit: PropTypes.bool,
    data: PropTypes.object
  };
  constructor(props) {
    super(props)
    this.state = {
      isAssets: false,
      data: this.props.data 
    }
    this.onSearch = this.onSearch.bind(this);
  }
  
  async onSearch (val) {
    let values = {
      assetsRecord: val
    }
    if(this.props.repairInput){
      values.repairInput = true;
    }
    operationService.getInfo(assets.selectRrpairAssetsRecordDetail,querystring.stringify(values),(data)=>{
      if(data.status){
        this.setState({
          data: data.result
        });
        this.props.callBack(data.result,true)
      }
      else{
        this.props.callBack( null ,false)
        this.setState({
          data: null
        });
        message.error(data.msg)
      }
    },{
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    })

  }
  switchChange = checked => {
    const params = { isAssets: !checked }
    checked ? this.setState({
      ...params
    }) : this.setState({
      ...params, data: {}
    })
    this.props.callBack({},checked)
   
  }
  
  render() {
    const { isAssets, data } = this.state;
    const { isEdit, form } = this.props;
    const { getFieldDecorator } = form;
    // console.log(data,'assetsInfodata')
    return (
      <Row type="flex">
        <Col span={4} style={{textAlign: 'right', height: 50, lineHeight: '50px' }}>资产编码/二维码：</Col>
        <Col span={12} style={{textAlign: 'left', height: 50, lineHeight: '50px' }}>
          {
            isEdit ? getFieldDecorator('assetsRecord')(
              <span>
                { data.assetsRecord }
              </span>
          ) : <Search
              placeholder="输入后点击回车"
              onSearch={this.onSearch}
              style={{ width: '80%', marginRight: 20 }}
              disabled={isAssets}
            />
          }
          {/* 无资产报修暂时取消 */}
          {/* {
            isEdit || this.props.type==="01" ? null : <Switch 
              checkedChildren="有资产" 
              unCheckedChildren="无资产" 
              defaultChecked 
              onChange={this.switchChange}
            />
          } */}

        </Col>
        <Col {...gridStyle.label}>资产名称：</Col>
        <Col {...gridStyle.content}>
        {
          getFieldDecorator('equipmentStandardName')(
            <span>{ data?data.equipmentStandardName :''}</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>型号：</Col>
        <Col {...gridStyle.content}>
        {
          getFieldDecorator('fmodel')(
            <span>{ data?data.fmodel :''}</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>规格：</Col>
        <Col {...gridStyle.content}>
        {
          getFieldDecorator('spec')(
            <span>{ data?data.spec :''}</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>资产类别：</Col>
        <Col {...gridStyle.content}>
        {
          getFieldDecorator('productType')(
            <span>{ data?data.productType === null || data.productType === undefined ? '': data.productType === "01" ? "医疗设备" : "其他" :''}</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>使用科室：</Col>
        <Col {...gridStyle.content}>
        {
          this.props.isRepair ?
            getFieldDecorator('useDept')(
              <span>{ data?data.useDept:'' }</span>
            )
          :
          getFieldDecorator('deptName')(
            <span>{ data?data.deptName:'' }</span>
          )
        }
       
        </Col>
        <Col {...gridStyle.label}>管理员：</Col>
        <Col {...gridStyle.content}>
        {
          getFieldDecorator('custodian')(
            <span>{ data?data.custodian:'' }</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>管理科室：</Col>
        <Col {...gridStyle.content}>
        {
          this.props.isRepair ?
          getFieldDecorator('bDept')(
            <span>{ data?data.bDept:'' }</span>
          )
          :
          getFieldDecorator('mDeptName')(
            <span>{ data?data.mDeptName:'' }</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>存放地址：</Col>
        <Col {...gridStyle.content}>
        {
          this.props.isRepair ?
          getFieldDecorator('address')(
            <span>{ data?data.address:'' }</span>
          )
          :
          getFieldDecorator('deposit')(
            <span>{ data?data.deposit:'' }</span>
          )
        }
        </Col>
        <Col {...gridStyle.label}>是否在保：</Col>
        <Col {...gridStyle.content}>
        {
          getFieldDecorator('guaranteeFlag')(
            <span>{ data?data.guaranteeFlag===null || data.guaranteeFlag === undefined ?  '': data.guaranteeFlag === "00" ? "出保" : "在保" :''}</span>
          )
        }
        </Col>
      </Row>
    )
  }
}
const AssetsInfo = Form.create()(AssetsInfoForm);
export default AssetsInfo;
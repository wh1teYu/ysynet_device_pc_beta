/*
 * @Author: yuwei - 新增入库
 * @Date: 2018-06-12 16:06:41 
* @Last Modified time: 2018-06-12 16:06:41 
 */

import React, { Component } from 'react'//message,
import { Layout, Form, Row, Col, Icon, Input, Button, Table, Radio, Modal, message, Select, TreeSelect } from 'antd';
// import TableGrid from '../../../component/tableGrid';
import { CommonData } from '../../../utils/tools';
import storage from '../../../api/storage';
import request from '../../../utils/request';
import queryString from 'querystring';
import { Link } from 'react-router-dom';
const { Content } = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const styles = {
  textRight: {
    textAlign: 'right'
  },
  fillRight: {
    marginRight: 8
  },
  top: {
    marginTop: 3
  }
}

class SearchForm extends Component {

  //搜索表单
  searchFrom = () => {
    let values = this.props.form.getFieldsValue();
    if (values.sendNo && values.sendNo !== '') {
      this.props.query(values)
    } else {
      message.warn('请填写送货单号！')
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label={`送货单号`} {...formItemLayout} style={styles.fillRight}>
              {getFieldDecorator(`sendNo`)(
                <Input placeholder="请输入送货单号或扫描二维码" />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <Button type='primary' style={styles.top} onClick={() => this.searchFrom()}>搜索</Button>
          </Col>
          <Col span={6}>
            <FormItem label={`越库`} {...formItemLayout} style={styles.fillRight}>
              {getFieldDecorator(`isOut`, { initialValue: '' })(
                <Radio.Group>
                  <Radio value="yes">是</Radio>
                  <Radio value="">否</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={7} style={styles.textRight}>
            <Button type='primary' style={styles.fillRight} onClick={() => this.props.submit(this.props.form.getFieldsValue())}>确认入库</Button>
            <Button type='primary' ><Link to={{ pathname: `/storage/wareHouseMgt` }}>取消</Link></Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWapper = Form.create()(SearchForm);

class AddWareHouse extends Component {

  state = {
    query: "",
    baseInfo: {},
    dataSource: [],
    treeData: []
  }

  componentDidMount() {
    this.searchStaticZc()
  }

  format = (arr) => {
    return arr.map((item) => {
      item.title = item.tfComment;
      item.value = item.tfComment;
      item.key = item.staticId;
      if (item.children.length > 0) {
        item.children = this.format(item.children);
      }
      return item
    })
  }
  //查询财务分类列表
  searchStaticZc = () => {
    request(storage.searchStaticZc, {
      body: queryString.stringify({ tfClo: 'financial' }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if (data.status) {
          let formatArr = this.format(data.result)
          console.log(formatArr)
          this.setState({
            treeData: formatArr
          })
        } else {
          message.error(data.msg)
        }
      },
      error: err => { console.log(err) }
    })
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }

  //提交表单
  submit = (values) => {
    console.log(values)
    console.log(this.state.dataSource);
    const { dataSource } = this.state;
    let toggle = false;

    for (let i = 0; i < dataSource.length; i++) {
      if (!dataSource[i].styleName) {//任意一行未选择财务分类- 则弹窗
        confirm({
          title: '当前存在产品无财务分类',
          content: '选继续操作将影响财务报表的准确性，是否继续？',
          onOk: () => {
            this.submitAjax();
          }
        })
        return
      } else {
        toggle = true;
      }
    }
    if (toggle) {
      this.submitAjax();
    }
  }

  submitAjax = () => {
    //发出请求
    let styleId = [];
    let styleName = []
    this.state.dataSource.map((item) => {
      styleId.push(item.styleId)
      styleName.push(item.styleName)
      return item
    })
    let isOut = this.refs.searchForm.getFieldsValue().isOut;
    let json = {}
    if (isOut !== '') {
      json = { isOut, sendId: this.state.baseInfo.sendId, styleId, styleName }
    } else {
      json = { sendId: this.state.baseInfo.sendId, styleId, styleName }
    }

    request(storage.insertImport, {
      body: queryString.stringify(json),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if (data.status) {
          message.success('入库成功')
          this.refs.searchForm.resetFields();
          this.setState({
            baseInfo: {},
            dataSource: []
          })
          this._configPrint(json, data.result)
        } else {
          message.error(data.msg)
        }
      },
      error: err => { console.log(err) }
    })
  }
  //打印配置
  _configPrint = (json, data) => {
    console.log(data)
    /* 
    {
     "in":{
        "storagePrintConfig":"storagePrintConfig",  --01打印，02不打印
        "InId": "InId"--入库单ID
     } ,
     "out":{
       "storagePrintConfig":"storagePrintConfig",  --01打印，02不打印
        "outId": "outId"--出库单ID
     }
   }
    */
    if (data && data.in && data.in.storagePrintConfig === "01") {//调用自动打印
      window.open(`${storage.inputImport}?InId=${data.in.InId}`)
    }
    if (data && data.out && data.out.storagePrintConfig === "01") {//调用自动打印
      window.open(`${storage.outputImport}?outId=${data.out.outId}`)
    }
  }

  query = async (values) => {
    let sendId = '';
    //查询当前baseInfo
    await request(storage.selectZCDeliveryList, {
      body: queryString.stringify(values),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if (data.status) {
          sendId = data.result.rows[0].sendId;
          this.setState({ baseInfo: data.result.rows[0] });
        } else {
          message.error(data.msg)
        }
      },
      error: err => { console.log(err) }
    })
    
    request(storage.selectZCDeliveryDetail, {
      body: queryString.stringify({ ...values, sendId }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if (data.status) {
          this.setState({ dataSource: data.result })
        } else {
          message.error(data.msg)
        }
      },
      error: err => { console.log(err) }
    })
  }

  total = () => {
    let total = 0;
    this.state.dataSource.map(item => {
      total += item.amount * item.purchasePrice;
      return item
    })
    return total.toFixed(2)
  }

  onChange = (value, label, extra, index) => {
    console.log(value, label, extra);
    const { triggerNode: { props: { children } } } = extra;
    if (!children || !children.length) {
      const { dataSource } = this.state;
      let ret = [].concat(dataSource);
      ret[index].styleName = value;
      ret[index].styleId = extra.triggerNode.props.eventKey;
      this.setState({
        dataSource: ret
      })
    } else {
      message.warn('请选择末级分类')
    }
  }
  render() {
    const { dataSource, baseInfo, treeData } = this.state;
    const columns = [
      {
        title: "产品名称",
        dataIndex: 'materialName',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'materialName')}
          />
        ),
      },
      {
        title: "品牌",
        dataIndex: 'tfBrand',
      },
      {
        title: "证件号",
        dataIndex: 'registerNo',
      },
      {
        title: "规格",
        dataIndex: 'spec',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'spec')}
          />
        ),
      },
      {
        title: "型号 ",
        dataIndex: 'fmodel',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'fmodel')}
          />
        ),
      },
      {
        title: "单位 ",
        dataIndex: 'purchaseUnit',
        render: (text, record) => (
          <EditableCell
            value={text}
            useDic={true}
            onChange={this.onCellChange(record.key, 'purchaseUnit')}
          />
        ),
      },
      {
        title: "采购单价",
        dataIndex: 'purchasePrice',
      },
      {
        title: "送货数量",
        dataIndex: 'amount',
      },
      {
        title: "生产商",
        dataIndex: 'produceName',
      },
      {
        title: "财务分类",
        dataIndex: 'styleName',
        render: (text, record, index) => (
          <TreeSelect
            showSearch
            style={{ width: 300 }}
            value={record.styleName}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择财务分类"
            onChange={(value, label, extra) => this.onChange(value, label, extra, index)}
          />
        )
      }
    ]

    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{ padding: 20 }}>
        <SearchFormWapper
          ref='searchForm'
          query={values => this.query(values)}
          submit={(values) => this.submit(values)}
        />

        <Row>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
                <label>送货单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                <div className="ant-form-item-control">
                  {baseInfo ? baseInfo.sendNo : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                <div className="ant-form-item-control">
                  {baseInfo ? baseInfo.fOrgName : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
                <label>收货科室</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                <div className="ant-form-item-control">
                  {baseInfo ? baseInfo.tDeptName : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="ant-col-8">
            <div className="ant-row ant-form-item">
              <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-4">
                <label>收货地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                <div className="ant-form-item-control">
                  {baseInfo ? baseInfo.tfAddress : ''}
                </div>
              </div>
            </div>
          </div>
        </Row>

        <Table
          bordered
          rowKey={'sendId'}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          footer={() => {
            return (
              <div>
                总金额：{this.total()}
              </div>
            )
          }} />

      </Content>
    )
  }
}

export default AddWareHouse;

class EditableCell extends Component {
  state = {
    value: this.props.value,
    editable: false,
    unitList: []
  }
  componentWillMount() {
    CommonData('UNIT', (data) => {
      this.setState({ unitList: data.rows || data })
    })
  }
  handleChange = (e) => {
    const value = e;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable, unitList } = this.state;
    const { useDic } = this.props;//TF_CLO_CODE
    const unitOption = unitList.map(item => (<Option key={item.TF_CLO_NAME} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>))
    return (
      <div className="editable-cell">
        {
          editable ?
            useDic ? (
              <span>
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  value={value}
                  style={{ width: 80 }}
                  onChange={this.handleChange}
                >
                  {unitOption}
                </Select>
                <Icon
                  type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}
                />
              </span>
            ) : (
                <Input
                  value={value}
                  onChange={(e) => this.handleChange(e.target.value)}
                  onPressEnter={this.check}
                  suffix={
                    <Icon
                      type="check"
                      className="editable-cell-icon-check"
                      onClick={this.check}
                    />
                  }
                />
              )
            : (
              <div style={{ paddingRight: 24 }}>
                {value || ' '}
                <Icon
                  type="edit"
                  className="editable-cell-icon"
                  onClick={this.edit}
                />
              </div>
            )
        }
      </div>
    );
  }
}
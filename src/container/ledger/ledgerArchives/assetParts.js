/**
 * 档案管理-资产档案-详情-基本信息-资产配件
 */
import React, { Component } from 'react';
import { Row,Col,Input,Button,message,Form,Select, Modal} from 'antd';
import assets from '../../../api/assets';
import { validMoney } from '../../../utils/tools';
import TableGrid from '../../../component/tableGrid';
import { CommonData } from '../../../utils/tools';
import request from '../../../utils/request';
import queryString from 'querystring';
const { RemoteTable } = TableGrid;
const FormItem = Form.Item;
const Option = Select.Option;
const columns = [
  {
    title: '配件编号',
    dataIndex: 'assetsRecord',
    width: 100
  },
  {
    title: '证件号',
    dataIndex: 'registerNo',
    width: 100
  },
  {
    title: '品牌',
    dataIndex: 'tfBrand',
    width: 80
  },
  {
    title: '配件名称',
    dataIndex: 'equipmentName',
    width: 100
  },
  {
    title: '型号',
    dataIndex: 'fmodel',
    width: 80
  },
  {
    title: '规格',
    dataIndex: 'spec',
    width: 80,
  },
  {
    title: '单位',
    dataIndex: 'meteringUnit',
    width: 100
  },
  {
    title: '单价',
    dataIndex: 'price',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  }
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


class AssetParts extends Component {

  state={
    visible:false,
    unitList:[],
    tfbrandList:[],
    selectedRowKeys:[]
  }

  componentWillMount (){
    CommonData('UNIT', (data) => {
      this.setState({unitList:data.rows || data })
    })
    CommonData('TF_BRAND', (data) => {
      this.setState({tfbrandList:data.rows || data })
    })
  }

  handleOk = () => {
    this.props.form.validateFields((err,values)=>{
      if(!err){
        console.log(values)
        values.meteringUnit= this.gettfCode(values.meteringUnit);
        values.assetsRecordGuid = this.props.assetsRecordGuid;
        //在此处发出请求
        request(assets.insertAssetsExtend,{
          body:queryString.stringify(values),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: data => {
            if(data.status){
              this.refs.remote.fetch();
              this.handleCancel();
            }else{
              message.error(data.msg)
            }
          },
          error: err => {console.log(err)}
        })
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible:false
    })
  }
  printTable = () => {
    //此处执行打印操作
    let json = {AssetsExtendGuid:this.state.selectedRowKeys};
    if(this.state.selectedRowKeys.length>0){
      window.open(assets.printAssetsExtendQrcode+'?'+queryString.stringify(json))
      this.setState({selectedRowKeys:[]})
    }else{
      message.warn('请选择要打印的资产')
    }
  }
  gettfCode = (val) => {
    let unitList = this.state.unitList;
    let code = unitList.filter(item=>{
      if(item.TF_CLO_CODE===val){
        return item
      }
      return null;
    });
    let CodeName = code.length>0 ? code[0].TF_CLO_NAME :''
    return CodeName
  }

  render () {
    const { getFieldDecorator } =this.props.form;
    const { visible , unitList , tfbrandList } = this.state;
    const unitOption =  unitList.map(item=>(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>))
    const tfbrandOption =  tfbrandList.map(item=>(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>))
    return (
      <div>
          <Row style={{textAlign:'right'}}>
            <Button type='primary' style={{marginRight:15}} onClick={()=>this.setState({visible:true})}>新建</Button>
            <Button type='primary' style={{marginRight:15}} onClick={()=>this.printTable()}>打印</Button>
          </Row>
         <RemoteTable
            query={{ assetsRecordGuid: this.props.assetsRecordGuid }}
            ref='remote'
            url={assets.selectAssetsExtendList}
            scroll={{x: '150%',y:400}}
            columns={columns}
            showHeader={true}
            rowKey={'assetsExtendGuid'}
            style={{marginTop: 10}}
            size="small"
            rowSelection={{
              selectedRowKeys:this.state.selectedRowKeys,
              onChange : (selectedRowKeys)=>{
                this.setState({ selectedRowKeys });
              }
            }}
          /> 
          <Modal
            width={680}
            title='填写配件'
            visible={visible}
            onOk={()=>this.handleOk()}
            onCancel={()=>this.handleCancel()}
            >
            <Form ref='modalForm'>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="配件编码"
                  >
                    {getFieldDecorator('assetsRecord')(
                    <Input placeholder="请输入，不输入则自动生成" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="证件号"
                  >
                    {getFieldDecorator('registerNo', {
                      rules: [{ required: true, message: '请输入证件号' }],
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="品牌"
                  >
                    {getFieldDecorator('tfBrand', {
                      rules: [{ required: true, message: '请选择品牌' }],
                    })(
                      <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      >
                        {tfbrandOption}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="配件名称"
                  >
                    {getFieldDecorator('equipmentName', {
                      rules: [{ required: true, message: '请选择配件名称'}],
                    })(
                    <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="型号"
                  >
                    {getFieldDecorator('fmodel', {
                      rules: [{ required: true, message: '请选择型号'}],
                    })(
                    <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="规格"
                  >
                    {getFieldDecorator('spec', {
                      rules: [{ required: true, message: '请选择规格' }],
                    })(
                    <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="单位"
                  >
                    {getFieldDecorator('meteringUnit', {
                      rules: [{ required: true, message: '请选择单位' }],
                    })(
                      <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                      >
                        {unitOption}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="单价"
                  >
                    {getFieldDecorator('price', {
                      rules: [{ required: true, message: '请输入单价' },
                      {validator: validMoney}],
                    })(
                    <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal> 
      </div>
    )
  }
}
export default Form.create()(AssetParts); 
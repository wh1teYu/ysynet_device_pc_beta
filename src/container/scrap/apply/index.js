/**
 * @file 资产报废 - 报废申请
 * @author Vania
 * @since 2018-04-08
 */
import React, { PureComponent } from 'react';
import { Layout, Row, Col, Form, Input, Select, Table, Affix,
  Button, Modal, message } from 'antd';
import { withRouter } from 'react-router-dom'  
import assets from '../../../api/assets';
import TableGrid from '../../../component/tableGrid';
import { queryScrapList, saveScrap } from '../../../api/scrap';
import PicWall from '../../../component/picWall'
import querystring from 'querystring';
import _ from 'lodash';
const confirm = Modal.confirm;
const { RemoteTable } = TableGrid;
const { Content } = Layout;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const Search = Input.Search;
const formItemLayoutForOne = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

// 资产表头
const columns = [
  { title: '资产编号', dataIndex: 'assetsRecord',  width: 100 },
  { title: '资产名称', dataIndex: 'equipmentStandardName', width: 100 },
  { title: '型号', dataIndex: 'spec', width: 100 },
  { title: '规格', dataIndex: 'fmodel', width: 100 },
  { title: '使用科室', dataIndex: 'useDept', width: 100 }
];
class ScrapApply extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      visible: false, // 报废资产弹窗
      selectedRows: [],
      selectedRowKeys: [],
      deptOption: [],
      postFile: '',
      productType: '', //资产类型
      mobile: '', //资产名称/编号
      isLoading: false,
      useDeptGuid: '', // 查询科室
      selKey:[],//选中的资产数量
    }
    this.changeInput = _.debounce(this.changeInput,300);
  }
  async componentDidMount() {
    const data = await queryScrapList();
    if (data.status) {
      this.setState({
        deptOption: data.result
      })
    }
  }
  //弹出层-提交
  handleOk = () => {
    const { selectedRows } = this.state;
    if(selectedRows && selectedRows.length){
      this.setState({ dataSource: selectedRows,selectedRowKeys:[], visible: false ,mobile:'',productType:''})
      this.refs.table.fetch({})
    }else{
       message.error('至少选择一项资产!')
    }
  }
  submit = e => {
    e.preventDefault();
    const { postFile, selKey } = this.state;
    console.log(selKey.length);
    if (!selKey.length) {
      return message.error('至少选择一项资产!')
    }
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({ isLoading: true })
        confirm({
          title: '是否确认报废',
          content: `请确定是否报废${selKey.length}项?`,
          onOk: async () => {
            const postF = [];
            if (postFile) {
              postFile.map(item => {
                console.log(item);
                return postF.push(item.thumbUrl)
              })
            }    
            const postData = {
              ...values,
              assetsGuids: selKey,
              scrapAccessorys: postF
            }
            console.log(postData)
            const data = await saveScrap({
              body: querystring.stringify({
                ...postData
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            if (data.status) {
              message.success('报废申请成功!', 1, () => {
                window.location.reload();
              })
            }
          },
          onCancel: () => this.setState({ isLoading: false })
        });
      }
    });
  }

  //关闭弹出层
  closeModal = () => {
    this.setState({visible: false,mobile:'',productType:'',selectedRowKeys:[]})
    this.refs.table.fetch({})
  }
  changeInput = (val) =>{
    console.log(val)
    this.setState({mobile:val})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource, visible, selectedRows, selectedRowKeys, productType, postFile,
      deptOption, isLoading  } = this.state;  
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys)
        this.setState({ selectedRowKeys ,selKey:selectedRowKeys  })
      },
      onSelect: (record, selected, rows) => {
        if (selected) {
          selectedRows.push(record)
        } else {
          for (let i=0;i<selectedRows.length;i++) {
            if (selectedRows[i].assetsRecordGuid === record.assetsRecordGuid) {
              selectedRows.splice(i, 1);
              break;
            }
          }
        }
        this.setState({ selectedRows })
      },
      onSelectAll: (selected, rows, changeRows) => {
        let newRows = selectedRows;
        if (selected) {
          newRows = selectedRows.concat(changeRows);
        } else {
          for (let i=0;i<changeRows.length;i++) {
            for (let j=0;j<selectedRows.length;j++) {
              if (selectedRows[j].assetsRecordGuid === changeRows[i].assetsRecordGuid) {
                selectedRows.splice(j, 1);
              }
            }
          }
          newRows = selectedRows;
        }
        this.setState({ selectedRows: newRows })
      }
    };
    const newColums = [
      { title: '操作', width: 20, dataIndex: 'name0', render: (text, record) => <a onClick={
        () => {
          for (let i=0;i<dataSource.length;i++) {
            if (dataSource[i].assetsRecordGuid === record.assetsRecordGuid) {
              if (selectedRowKeys.indexOf(record.assetsRecordGuid) >= 0) {
                selectedRowKeys.splice(i, 1);
              }
              dataSource.splice(i, 1);
              this.setState({ dataSource: [...dataSource], selectedRowKeys: [...selectedRowKeys], selectedRows: [...dataSource] })
              break;
            }
          }
        }
      }>删除</a>  }, 
      ...columns
    ]
    return (
      <Content className='ysynet-content ysynet-common-bgColor' style={{padding:24}}>
        <Form onSubmit={this.submit}>
          <Affix>
            <Row>
              <Col span={24} style={{textAlign: 'right', padding: '5px 50px', background: '#fff'}}>
                <Button loading={isLoading} type='primary' htmlType='submit'>提交</Button>
              </Col>
            </Row>
          </Affix>  
          <h3>报废信息</h3>
          <Row>
            <Col>
              <FormItem label={`使用科室`} {...formItemLayoutForOne}>
                {getFieldDecorator(`useDeptGuid`, {
                  rules: [{ required: true, message: '请选择使用科室' }],
                })(
                  <Select
                    onChange={val => {
                      if (this.refs.table) {
                        this.refs.table.fetch({
                          productType: productType,
                          mobile: this.state.mobile,
                          useDeptGuid: val,
                        })
                      }
                      this.setState({ useDeptGuid: val ,dataSource: [], selectedRows: [],selectedRowKeys: []})
                    }}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="选择科室"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      deptOption.map((item, index) => (
                        <Option value={item.value} key={item.text}>{ item.text }</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem label={`报废原因`} {...formItemLayoutForOne}>
                {getFieldDecorator(`scrapCause`, {
                  rules: [{ required: true, message: '请输入报废原因' }],
                })(
                  <TextArea placeholder="输录入报废原因" rows={4}/>
                )}
              </FormItem>
            </Col>
            <Col>  
              <FormItem label={`使用情况`} {...formItemLayoutForOne}>
                {getFieldDecorator(`useSituation`)(
                  <TextArea placeholder="请录入使用情况" rows={4}/>
                )}
              </FormItem>
            </Col>
            <Col>  
              <FormItem label={`报废附件`} {...formItemLayoutForOne}>
                <PicWall file={data => this.setState({postFile: data})} fileList={postFile}/>
              </FormItem>
            </Col>
          </Row>  
          <h3  style={{marginTop: 4}}>资产信息</h3>
          <Button style={{marginBottom: 4}} type='primary' onClick={() => this.setState({visible: true})}>选择资产</Button>
          <Table 
            dataSource={dataSource} 
            columns={newColums} 
            bordered={true} 
            size={'small'} 
            rowKey={'assetsRecordGuid'}
            pagination={false}
          />
        </Form>
        <Modal
          width={1200}        
          title="选择报废资产"
          visible={visible}
          footer={null}
          style={{top: 20}}
          onCancel={() => this.closeModal()}
        >
          <Row>
            <Col span={8}>
              选择分类：     
              <Select style={{width: 300}} value={productType} onChange={val => this.setState({productType: val})}>
                <Option value="">全部分类</Option>
                <Option value="01">通用设备</Option>
                <Option value="02">电气设备</Option>
                <Option value="03">电子产品及通信设备</Option>
                <Option value="04">仪器仪表及其他</Option>
                <Option value="05">专业设备</Option>
                <Option value="06">其他</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Search placeholder="输入资产编号/名称" value={this.state.mobile}  enterButton="查询"  
              
              onChange={(e)=>this.changeInput(e.target.value)}
              onSearch={
                val => {
                  this.setState({ mobile: val })
                  this.refs.table.fetch({
                    productType: productType,
                    mobile: val,
                    useDeptGuid: this.state.useDeptGuid
                  })
                }
              }/>     
            </Col>
            <Col span={8} style={{textAlign: 'right'}}>
              <Button type='primary' onClick={this.handleOk}>新增</Button>
            </Col>
          </Row>
          <RemoteTable
            query={{useDeptGuid: this.state.useDeptGuid}}
            ref='table'
            url={assets.selectAssetsList}
            columns={columns}
            showHeader={true}
            rowKey={'assetsRecordGuid'}
            style={{marginTop: 10}}
            size="small"
            scroll={{x: '100%'}}
            rowSelection={rowSelection}
          /> 
        </Modal>
      </Content>  
    )
  }
}

export default withRouter(Form.create()(ScrapApply));
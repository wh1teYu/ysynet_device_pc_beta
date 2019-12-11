/*
 * @Author: yuwei - 物资分类
 * @Date: 2018-06-22 09:35:41 
* @Last Modified time: 2018-06-22 09:35:41 
 */
import React, { Component } from 'react'
import { Form, Layout, Row, Col, Select, Button, Spin, Tree, Input, Icon, Modal, message, Table } from 'antd';
import querystring from 'querystring';
import request from '../../../utils/request';
import TableGrid from '../../../component/tableGrid';
import basicdata from '../../../api/basicdata';
import storage from '../../../api/storage';
import '../style.css';
const { RemoteTable } = TableGrid;
const { Option } = Select;
const { TreeNode } = Tree;
const { Content } = Layout;
const Search = Input.Search;
const FormItem = Form.Item;
const { confirm } = Modal;
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
const formItemLayoutModal = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};
const columns = [
  {
    title: '资产编号', dataIndex: 'assetsRecord', width: 350
  },
  {
    title: '资产名称', dataIndex: 'equipmentStandardName', width: 300
  },
  {
    title: '型号', dataIndex: 'fmodel', width: 300
  },
  {
    title: '规格', dataIndex: 'spec', width: 300
  },
  {
    title: '计量单位', dataIndex: 'meteringUnit', width: 300
  },
  {
    title: '注册证号', dataIndex: 'registerNo', width: 300
  },
  {
    title: '品牌',  dataIndex: 'brandName', width: 300
  },
  {
    title: '管理科室', dataIndex: 'manageDeptName', width: 300
  },
  {
    title: '使用科室', dataIndex: 'useDeptName', width: 300
  }
]

class SuppliesClassify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topClassInfo:{},
      modalProductQuery:{type:"01"},//选择产品搜索条件
      selectedProductRowKeys:[],//选择产品模态框的主键
      selectedProductRows:[],//选择产品模态框的每条信息
      visible:false,//选产品弹窗
      manageSelect:[],//管理科室下拉框
      outDeptOptions: [],//使用科室下拉框
      isLoading: false, // 是否允许操作
      isShow: false, // 是否展
      visibleSupplies: false, // 添加弹出框
      storageValue: '', // 当前选择的库房
      treeData: [], // 树的信息
      storageOptions: [], // 库房下拉框数据
      query: {type:'01',staticId:''}, // 查询条件(表格列表查询)
      tfClo: '', // 物资ID
      selectedRowKeys: [], // 页面表格选中的key
      selectedRows: [], // 页面表格选中的data
      selectedRowKeysModal: [], // 弹框表格选中的key
      selectedRowsModal: [], // 弹框表格选中的data
      selectedKeys: [], // 当前选择 TreeNode key
      selectedKeyInfo: {}, // 当前选择 TreeNode data
      hasClass: false,
      expandKeys: [], // 展开节点
      isEdit: false, // 不能编辑(用于图标修改)
      selectedGuid: '', // 当前操作的GUID
    }
  }

  componentWillMount () {
    //获取物资分类的statcId
    request(basicdata.queryStaticZcByCode,{
      body:querystring.stringify({tfClo:'material'}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: data => {  
        this.setState({
          topClassInfo:data.result
        })
        //获取资产分类列表
        this.getTreeData({tfClo:'material'});
      },
      error: err => {console.log(err)}
    })

     //管理科室下拉框
     this.getManageSelect();
     //使用科室下拉框
     this.outDeptSelect();

  }

  // 1.库房下拉切换数据
  getWarehouseDataTab = val => {
    this.setState({isLoading: true});
    request(basicdata.SEARCHTREELISTBYORGID,{
      body: querystring.stringify({storageGuid: val}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: data => {
        if (data.status) {
          this.setState({
            treeData: data.result,
            storageValue: val,
            tfClo: '',
            selectedKeys: [],
            selectedKeyInfo: {},
            hasClass: false,
            expandKeys: []
          })
        } else {
          message.error(data.msg);
        }
        this.setState({isLoading: false});
      },
      error: err => {console.log(err)}
    })

  }
  // 1.1管理科室下拉框
  getManageSelect = () => {
    request(storage.selectUseDeptList,{
      body:querystring.stringify({deptType:"01"}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
        if(data.status){
                this.setState({manageSelect:data.result})
        }else{
                message.error(data.msg)
        }
      },
      error: err => {console.log(err)}
    })
  }
  // 1.2使用科室下拉框
  outDeptSelect = () => {
    request(storage.selectUseDeptList,{
      body:querystring.stringify({deptType:"00"}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: data => {
              if(data.status){
                      this.setState({outDeptOptions:data.result})
              }else{
                      message.error(data.msg)
              }
      },
      error: err => {console.log(err)}
    })
  }
  // 2.1 一级树select
  onSelect = (selectedKeys, info) => {
    console.log(info);
    
    this.setState({
      selectedKeys, 
      selectedKeyInfo: info, 
      selectedRowKeysModal: [],
      hasClass: selectedKeys.length ? true : false,
      tfClo: selectedKeys.length ? info.node.props.tfClo : '',
      query:{type:'01',staticId:info.node.props.guId}
    })
    if(info.selected){
      if(this.refs.table){
        this.refs.table.fetch({type:'01',staticId:info.node.props.guId})
      }
    }else{
      this.setState({query:{},selectedKeyInfo:{}})
    }
  }
  // 2.2 获取树的信息
  getTreeData = json => {
    this.setState({isLoading: true});
    request(basicdata.searchStaticZc,{
      body:querystring.stringify(json),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      success: data => {
        if (data.status) {
          this.setState({treeData: data.result, isLoading: false});
        } else {
          message.error(data.msg);
          this.setState({isLoading: false});
        }
      },
      error: err => {console.log(err)}
    })
  }
  // 2.3 获取树根节点数据
  genTreeNodeData = data => {
    return data.map(item => {
      // 二级树信息
      if (item.children) {
        return(
          <TreeNode
          title={this.treeNodeTitle(item)}
          key={item.staticId}
          tfClo={item.tfClo}
          styleFlag={item.styleFlag}
          parentId={item.parentId}
          tfComment={item.tfComment}
          guId={item.staticId}
          >
            {this.genTreeNodeData(item.children)}
          </TreeNode>
        )
        // 一级树信息
      } else {
        return <TreeNode 
          {...item}
          title={this.treeNodeTitle(item)}
          key={item.staticId}
          parentId={item.parentId}
          styleFlag={item.styleFlag}
          tfClo={item.tfClo}
          tfComment={item.tfComment}
          guId={item.staticId}
        />
      }
    })
  }
  // 2.4 树节点标题
  treeNodeTitle = item => {
    const { hasClass, selectedKeys } = this.state;
    return (
      <Row className='treeNode'>
        {/* 标题 */}
        <Col title={item.tfComment} span={20} style={{whiteSpace: "nowrap"}}>{item.tfComment}</Col>
        {/* 修改 */}
        <Col span={2} style={{paddingLeft: 4}}>
          <Icon 
            type="edit" 
            style={{color: '#1890ff', marginLeft: 5}}
            onClick={this.onEdit.bind(this, item)}
            className={
              hasClass && selectedKeys.length && (item.staticId === selectedKeys[0]) ? null : 'treeNode_tool' 
            }
          />
        </Col>
        {/* 删除 */}
        <Col span={2} style={{paddingLeft: 10}}>
          <Icon 
            type="delete" 
            style={{color: '#ff4d4f'}}
            onClick={this.onDelete.bind(this, item)}
            className={
              hasClass && selectedKeys.length && (item.staticId === selectedKeys[0]) ? null : 'treeNode_tool'
            }
          />
        </Col> 
      </Row>
    )
  }
  // 2.5 Icon 修改图标
  onEdit = (item, e) => {
    console.log(item, 'item');
    e.stopPropagation();
    this.setState({
      isEdit: true,
      visibleSupplies: true,
      selectedGuid: item.staticId
    })
    this.props.form.setFieldsValue({
      tfComment: item.tfComment,
      tfClo: item.tfClo
    })
  }
  // 2.6.1 删除
  deleteAction = id => {
    confirm({
      title: '是否确定删除选中项？',
      onOk: () => {
        request(basicdata.deleteStaticInfoZc,{
          body:querystring.stringify({staticId: id}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          success: data => {
            if (data.status) {
              message.success("删除成功！");
              this.getTreeData({tfClo:'material'});
            } else {
              message.error(data.msg);
            }
          },
          error: err => {console.log(err)}
        })
      },
      onCancel() {}
    })
  }
  // 2.6 删除(Icon图标 / 5.删除类别)
  onDelete = (item, e) => {
    e ? e.stopPropagation() : item.stopPropagation();
    const fromButton = e ? false : true;
    const { selectedKeys, selectedKeyInfo } = this.state;
    if (fromButton) { // 按钮触发
      if (selectedKeys.length) {
        return this.deleteAction(selectedKeyInfo.node.props.guId);
      } else {
        return message.warn('至少选择一项');
      }
    } else {
      if (item) {
        return this.deleteAction(item.staticId);
      } else {
        return message.warn('至少选择一项');
      }
    }
  }
 
  // 3 新增/修改物资分类
  addStyleItem = e => {
    e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { isEdit } = this.state;
          const postData = {
            tfComment: values.tfComment,
            tfClo: values.tfClo,
            parentStaticId:this.state.topClassInfo.staticId, //     this.state.selectedGuid 
            staticId:this.state.topClassInfo.staticId
          }
          if (this.state.selectedKeyInfo.node) {
            postData.parentStaticId = this.state.selectedKeyInfo.node.props.guId;
          }
          let url = basicdata.insertStaticInfoZc;//新增状态
          this.setState({isEdit: false});
          if (isEdit) {//编辑状态
            postData.staticId = this.state.selectedGuid;
            url = basicdata.updateStaticInfoZc;
          } else {
            this.setState({isEdit: false});
            // this.props.form.resetFields();
          }
          request(url,{
            body:JSON.stringify(postData),
            success: data => {
              if (data.status) {
                message.success('操作成功！');
                this.setState({visibleSupplies: false});
                this.getTreeData({tfClo:'material'});
                this.props.form.resetFields();
              } else {
                message.error(data.msg);
                if(isEdit){
                  this.setState({isEdit:true})
                }
              }
            },
            error: err => {console.log(err)}
          })
        }
      })
  }
  // 4. 末级标识
  flagHandler = () => {
    const { guId } = this.state.selectedKeyInfo.node.props;
    const postData = {staticId:guId, styleFlag: 1,parentStaticId: this.state.topClassInfo.staticId};
    request(basicdata.updateStaticInfoZc,{
      body:JSON.stringify(postData),
      success: data => {
        if (data.status) {
          message.success('操作成功！');
          this.getTreeData({tfClo:'material'});
        } else {
          message.error(data.msg);
        }
      },
      error: err => {console.log(err)}
    })
  }
  // 7. 页面列表产品删除
  deleteProduct = () => {
    confirm({
      title: '是否确定删除选中项',
      onOk: () => {
        const { storageValue, tfClo, selectedRowKeys , selectedKeys } = this.state;
        if (selectedRowKeys.length) {
          request(basicdata.deleteAssetsTypeList,{
            body:querystring.stringify({type:"01",assetsRecordGuids: selectedRowKeys}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            success: data => {
              if (data.status) {
                message.success("操作成功！");
                const values = this.props.form.getFieldsValue();
                this.setState({selectedRows: [], selectedRowKeys: []});
                this.refs.table.fetch({...values, staticId: selectedKeys[0], type: '01'});
                if (this.refs.modalTable) {
                  this.refs.modalTable.fetch({tfClo, flag: '00', storageGuid: storageValue});
                }
              } else {
                message.error(data.msg);
              }
            },
            error: err => {console.log(err)}
          })
        } else {
          message.warn('至少选择一项！');
        }
      },
      onCancel() {}
    })
  }
  // 8. 页面列表查询功能
  onSearch = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { selectedKeys } = this.state;
      if(selectedKeys[0]){
        this.refs.table.fetch({...values,staticId:selectedKeys[0],type: '01'});
      }else{
        message.warn('请选择分类！')
      }
    })
  }
  //选产品变更需求
  changeClick = (router, url, state) => {
    // this.setState({visible:true})
    const { tfClo, selectedKeyInfo } = this.state;
    if (!tfClo) { return message.error('请选择物资类别！'); }
    if (!selectedKeyInfo.node.props.styleFlag) {
      return message.error('该物资类别不是末级，不能配置产品');
    } else {
      this.setState({visible:true})
    }
  }

  //选产品1. 模态框确定按钮
  getProductModalData = () => {
    const {selectedKeys , selectedProductRowKeys } = this.state;
    console.log('发出的请求内容',JSON.stringify({type:'01',staticId:selectedKeys[0],assetsRecordGuids:selectedProductRowKeys}))
    if(selectedProductRowKeys.length>0){
      request(basicdata.insertAssetsType,{
        body:querystring.stringify({type:'01',cover:"02",staticId:selectedKeys[0],assetsRecordGuids:selectedProductRowKeys}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: data => { 
          this.closeProductModal();
          this.refs.table.fetch({type:'01',staticId:selectedKeys[0]})
        },
        error: err => {console.log(err)}
      })
    }else{
      message.warn('请选择产品后再添加！')
    }
  }

  closeProductModal = ()=>{
    const { selectedKeys } = this.state;
    this.refs.tables.fetch({type:'01',staticId:selectedKeys[0]});
    this.refs.productForm.resetFields();
    this.setState({selectedProductRowKeys:[],visible:false})
  }
  //init2 - 搜索资产分类
  searchType = (val) => {
    console.log(val);
      let json = {
        searchName:val,
        staticId:this.state.topClassInfo.staticId
      }
      request(basicdata.queryStaticZcByName,{
        body:querystring.stringify(json),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: data => {
          if (data.status) {
            this.setState({treeData: data.result, isLoading: false,query:{}});
            this.props.form.resetFields()
          } else {
            message.error(data.msg);
            this.setState({isLoading: false});
          }
        },
        error: err => {console.log(err)}
      })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { visible , visibleSupplies, query , isLoading ,  selectedKeys, treeData, expandKeys, isEdit } = this.state;
    // const productModalHeader = (
    //   <Row>
    //     <Col span={12}>未选资产</Col>
    //     <Col span={12} style={{textAlign:'right'}}>
    //       <Button type='primary' style={{marginRight:15}}  onClick={()=>this.getProductModalData()}>确定</Button>
    //       <Button type='primary' onClick={()=>this.closeProductModal()}>取消</Button>
    //     </Col>
    //   </Row>
    // )
    return (
      <Layout className='classifyModule ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
        {/* 大的物资库房下拉框 */}
        <Row style={{padding: '4px 0'}}>
          <Col span={5}>
              <Search
                placeholder="请输入类别名称"
                onSearch={value => this.searchType(value)}
              />
          </Col>
        </Row>
        <Row>
          {/* 树形结构部分 */}
          <Col span={5} style={{background: '#f5f5f5', minHeight: 618, padding: '4px 0', border: '1px solid #fafafa'}}>
            <Button type="primary" onClick={() =>this.setState({visibleSupplies: true})}>添加</Button>
            <Button style={{marginLeft: 5}} onClick={this.flagHandler}>末级标识</Button>
            {/* 树形结构 */}
            <Spin spinning={isLoading}>
              <Tree 
                showLine 
                onSelect={this.onSelect} 
                autoExpandParent={false} 
                className='bgf5'
                selectedKeys={selectedKeys}
                onExpand={expandedKeys => this.setState({expandKeys: expandedKeys,selectedKeys:[],selectedKeyInfo:{}})}
                expandedKeys={expandKeys}
                >
                {this.genTreeNodeData(treeData)}
              </Tree>
            </Spin>
          </Col>
          {/* 搜索表格部分 */}
          <Col span={19} style={{padding: '0 2px'}}>
            <Content style={{background: '#fff'}}>
              <Form onSubmit={this.onSearch}>
                <Row>
                  <Col span={8}>
                    <FormItem label={`资产编号`} {...formItemLayout}>
                      {getFieldDecorator(`assetsRecord`)(<Input placeholder='请输入资产编号'/>)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={`资产名称`} {...formItemLayout}>
                      {getFieldDecorator(`assetName`)(<Input placeholder='请输入资产名称'/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
                    <FormItem label={`型号`} {...formItemLayout}>
                      {getFieldDecorator(`fmodel`)(<Input  placeholder='请输入型号'/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
                    <FormItem label={`规格`} {...formItemLayout}>
                      {getFieldDecorator(`spec`)(<Input placeholder='请输入规格'/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
                    <FormItem label={`注册证号`} {...formItemLayout}>
                      {getFieldDecorator(`registerNo`)(<Input placeholder='请输入注册证号'/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
                    <FormItem label={`品牌`} {...formItemLayout}>
                      {getFieldDecorator(`brand`)(<Input placeholder='请输入品牌'/>)}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
                    <FormItem label={`管理科室`} {...formItemLayout}>
                      {getFieldDecorator(`manageDeptGuid`,{
                        initialValue:""
                      })(
                        <Select 
                        showSearch
                        placeholder={'请选择'}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="" key={-1}>全部</Option>
                            {
                                this.state.manageSelect.map((item,index) => {
                                return <Option key={index} value={item.value}>{item.text}</Option>
                                })
                            }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
                    <FormItem label={`使用科室`} {...formItemLayout}>
                      {getFieldDecorator(`useDeptGuid`,{
                        initialValue:""
                      })(
                        <Select 
                        showSearch
                        placeholder={'请选择'}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="" key={-1}>全部</Option>
                            {
                                this.state.outDeptOptions.map((item,index) => {
                                return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                                })
                            }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType='submit'>查询</Button>
                    <Button style={{marginLeft: 5, marginRight: 25}} onClick={()=>{this.props.form.resetFields()}}>重置</Button>
                    {/* userSelect: user-select属性是css3新增的属性，用于设置用户是否能够选中文本 */}
                    <a style={{userSelect: 'none'}} onClick={()=>this.setState({isShow: !this.state.isShow})}> 
                      <Icon type={this.state.isShow ? 'up' : 'down'} /> {this.state.isShow ? '收起' : '展开'}
                    </a>
                  </Col>
                </Row>
                <Button type="primary" onClick={()=>this.changeClick()}>选产品</Button>
                <Button type="danger" style={{marginLeft: 8}} onClick={this.deleteProduct}>移出分类</Button>
              </Form>
              {
                this.state.query.staticId ? 
                <RemoteTable
                  url={basicdata.queryAssetsTypeList}
                  ref='table'
                  query={query}
                  scroll={{x: '180%'}}
                  columns={[...columns]}
                  rowKey={'assetsRecordGuid'}
                  showHeader={true}
                  rowSelection={{ onChange: ((selectedRowKeys, selectedRows) => { this.setState({selectedRowKeys, selectedRows}) }) }}
                  size="small"
                  style={{marginTop: 10}}
                >
                </RemoteTable> : 
                <Table
                  scroll={{x: '180%'}}
                  columns={[...columns]}
                  rowKey={'assetsRecordGuid'}
                  style={{marginTop: 10}}
                />
              }
            </Content>
          </Col>
        </Row>
        {/* 添加Modal表单 */}
        <Modal
          title={`新增物资分类`}
          visible={visibleSupplies}
          onOk={this.addStyleItem}
          onCancel={()=>{this.setState({visibleSupplies: false, isEdit: false});this.props.form.resetFields();}}
          >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label={`类别名称`} {...formItemLayoutModal}>
                  {getFieldDecorator('tfComment', {
                    rules: [{required: true, message: '请输入类别名称!'}, { max: 15, message: '长度不能超过15'}]
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={`类别编码`} {...formItemLayoutModal}>
                  {getFieldDecorator('tfClo', {
                    rules: [{required: true, message: '请输入类别编码!'}]
                  })(<Input disabled={isEdit} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/*选产品弹窗*/}
        <Modal
          width={980}
          // title={productModalHeader}
          title='未选资产'
          onOk={()=>this.getProductModalData()}
          onCancel={()=>this.closeProductModal()}
          visible={visible}
          maskClosable={false}
          closable={false}
          >
            <ProductFormWapper
            ref='productForm'
            manageSelect={this.state.manageSelect}
            outDeptSelect={this.state.outDeptOptions} 
            staticId={selectedKeys[0]}
            tableFetch={val => this.refs.tables.fetch(val)}
            />   
            <RemoteTable
            url={basicdata.selectAssets}
            ref='tables'
            query={this.state.modalProductQuery}
            scroll={{x: '180%'}}
            columns={columns}
            rowKey={'assetsRecordGuid'}
            showHeader={true}
            rowSelection={{ 
              selectedRowKeys:this.state.selectedProductRowKeys,
              onChange: (selectedRowKeys, selectedRows) => { 
                this.setState({
                  selectedProductRowKeys:selectedRowKeys,
                  selectedProductRows:selectedRows}) 
                }
            }}
            size="small"
            style={{marginTop: 10}}>
          </RemoteTable>
        </Modal>
        
      </Layout>
    )
  }
}

export default Form.create()(SuppliesClassify);

class ProductForm extends Component {
  state={
    isShow:false,
    manageSelect:this.props.manageSelect,
    outDeptSelect:this.props.outDeptSelect,
  }

  onSearch = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.tableFetch({...values,staticId:this.props.staticId,type: '01'});
    })
  }
  
  modalReset = () =>{
    this.props.form.resetFields();
    this.props.tableFetch({staticId:this.props.staticId,type: '01'});
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
      <Form onSubmit={this.onSearch} >
          <Row>
            <Col span={8}>
              <FormItem label={`资产编号`} {...formItemLayout}>
                {getFieldDecorator(`assetsRecord`)(<Input placeholder='请输入资产编号'/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`资产名称`} {...formItemLayout}>
                {getFieldDecorator(`assetName`)(<Input placeholder='请输入资产名称'/>)}
              </FormItem>
            </Col>
            <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
              <FormItem label={`型号`} {...formItemLayout}>
                {getFieldDecorator(`fmodel`)(<Input  placeholder='请输入型号'/>)}
              </FormItem>
            </Col>
            <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
              <FormItem label={`规格`} {...formItemLayout}>
                {getFieldDecorator(`spec`)(<Input placeholder='请输入规格'/>)}
              </FormItem>
            </Col>
            <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
              <FormItem label={`注册证号`} {...formItemLayout}>
                {getFieldDecorator(`registerNo`)(<Input placeholder='请输入注册证号'/>)}
              </FormItem>
            </Col>
            <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
              <FormItem label={`品牌`} {...formItemLayout}>
                {getFieldDecorator(`brand`)(<Input placeholder='请输入品牌'/>)}
              </FormItem>
            </Col>
            <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
              <FormItem label={`管理科室`} {...formItemLayout}>
                {getFieldDecorator(`manageDeptGuid`,{
                  initialValue:""
                })(
                  <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      <Option value="" key={-1}>全部</Option>
                      {
                          this.state.manageSelect.map((item,index) => {
                          return <Option key={index} value={item.value}>{item.text}</Option>
                          })
                      }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{display: this.state.isShow ? 'block' : 'none'}}>
              <FormItem label={`使用科室`} {...formItemLayout}>
                {getFieldDecorator(`useDeptGuid`,{
                  initialValue:""
                })(
                  <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      <Option value="" key={-1}>全部</Option>
                      {
                          this.state.outDeptSelect.map((item,index) => {
                          return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                          })
                      }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType='submit'>查询</Button>
              <Button style={{marginLeft: 5, marginRight: 25}} onClick={this.modalReset}>重置</Button>
              {/* userSelect: user-select属性是css3新增的属性，用于设置用户是否能够选中文本 */}
              <a style={{userSelect: 'none'}} onClick={()=>this.setState({isShow: !this.state.isShow})}> 
                <Icon type={this.state.isShow ? 'up' : 'down'} /> {this.state.isShow ? '收起' : '展开'}
              </a>
            </Col>
          </Row>
      </Form>
    )
  }
}
const ProductFormWapper = Form.create()(ProductForm);
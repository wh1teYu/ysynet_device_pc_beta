/**保养登记--列表*/
import React from 'react';
import { Row, Col, Input, Button ,Modal } from 'antd';
import TableGrid from '../../../component/tableGrid';
import basicdata from '../../../api/basicdata';
const { RemoteTable } = TableGrid;
const Search = Input.Search;
const url=basicdata.queryAllProject;
const columns = [
  {
    title: '序号',
    dataIndex:'RN',
    width:'10%'
  },{
  title: '设备名称',
  dataIndex: 'name',
}];
class MaintainTmpModal extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      query: {
        maintainTemplateId:''
      }
    };
  }
  
  componentWillReceiveProps = ()=>{
    this.setState({
      query: {
        maintainTemplateId: this.props.selectRow
      }
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  
  handleOk = () =>{
    //确定的时候向外发出该表单中选中的数据
    this.props.callback(this.state.selectedRowKeys);

    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query })
  }
  getChildDom(){
      return this.refs.child_inner_ref
  }
  render(){
    const { visible, loading } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return(
      <div>
        <Modal
          visible={visible}
          title="引用已有项目"
          onOk={this.props.handleOk}
          onCancel={this.props.handleCancel}
          footer={[
            <Button key="back" onClick={this.props.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
            <Row>
                <Col span={12}>
                  <Search
                      placeholder="请输入"
                      onSearch={value =>  {this.queryHandler({'maintainTypeName':value})}}
                      style={{ width: 400 }}
                      enterButton="搜索"
                  />
                </Col>
            </Row>
            <RemoteTable
              ref='table'
              url={url}
              query={this.state.query}
              scroll={{x: '100%', y : document.body.clientHeight - 110 }}
              columns={columns}
              rowKey={'id'}
              rowSelection={rowSelection}
              showHeader={true}
              style={{marginTop: 10}}
              size="small"
              onChange={this.handleChange}
            /> 
          
      </Modal>
      </div>
    )
  }
}

export default MaintainTmpModal;
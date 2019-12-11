/*借用管理-新建借出*/

import React, { Component } from 'react';

import {Layout, Button, Row, Modal, Col, Card, Table, Select, message} from 'antd';

import queryString from 'querystring';

import tableGrid from '../../../component/tableGrid';

import LoanForm from './component/loanForm';

import ModalForm from './component/modalForm';

import ledgerBorrow from '../../../api/ledgerBorrow';

import request from '../../../utils/request';

const {Content} = Layout;

const {Option} = Select;

const { RemoteTable } = tableGrid;

class Loan extends Component {
    state = {
        mgtDeptData: [],  //管理科室保存数据
        dataSource: [],         
        visible: false, 
        manageDeptGuid: '',      //选择管理科室guid
        clearOff: false, 
        selectedRows: [],
    }

    componentDidMount() {
        request(ledgerBorrow.mgtDeptList, {     //管理科室
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                let manageDeptGuid = data.result.length === 1? data.result[0].value : '';
                this.setState({ mgtDeptData: data.result, manageDeptGuid });
            },
            error: (err) => console.log(err)
        });
    }

    handleOk = () => {
        let {selectedRows} = this.state;
        this.setState({ 
            visible: false,
            clearOff: true,
            dataSource: selectedRows
        })
    }

    delete = (id) => {
        let {dataSource} = this.state;
        dataSource = dataSource.filter( (item) => item.assetsRecordGuid !== id );
        this.setState({ dataSource });
    }

    queryAsset = (query) => {
        let {manageDeptGuid} = this.state;
        for (const key in query) {
            query[key] = query[key] === undefined? '' : query[key]
        };
        query = {...query, manageDeptGuid};
        this.refs.modalTable.fetch(query);
    }

    showModal = () => {
        let {manageDeptGuid} = this.state;
        if(manageDeptGuid === '' || manageDeptGuid === undefined) {
            message.warning('请选择一个管理科室');
            return;
        }
        this.setState({
            visible: true,
            clearOff: false,
        });
        
    }

    save = () => {
        let {dataSource} = this.state;

        if(dataSource.length === 0) {
            message.warning('请选择一条资产');
            return;
        }
        this.refs.loanForm.validateFields((err, values) => {
            if(err) return;
            for (const key in values) {
                values[key] = values[key] === undefined? '' : values[key];
            };
            values.borrowType="01";
            values.estimateBack = values.estimateBack.format('YYYY-MM-DD HH:mm:ss');
            values.assetsRecordGuids = dataSource.map( (item) => item.assetsRecordGuid );
            this.saveRequest(values);
        })
    }

    saveRequest = (query) => {
        request(ledgerBorrow.addBorrow, {
            body: queryString.stringify(query),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    message.success('保存成功');
                    this.props.history.push(`/ledgerBorrow/borrowMgt`);
                }else {
                    message.error(data.msg);
                }
            },
            error: err => console.log(err)
        })
    }
    fetchSelect=(input)=>{
      request(ledgerBorrow.mgtDeptList, {     //管理科室
          body:queryString.stringify({deptName:input}),
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: (data) => {
              let manageDeptGuid = data.result.length === 1? data.result[0].value : '';
              this.setState({ mgtDeptData: data.result, manageDeptGuid });
          },
          error: (err) => console.log(err)
      });
    }

    render() {
        let {visible, dataSource, mgtDeptData, manageDeptGuid, clearOff} = this.state;
        const columns = [
            {
                title: '资产编号',
                dataIndex: 'assetsRecord'
            },
            {
                title: '资产名称',
                dataIndex: 'equipmentStandardName'
            },
            {
                title: '型号',
                dataIndex: 'fmodel'
            },
            {
                title: '规格',
                dataIndex: 'spec'
            },
            {
                title: '管理科室',
                dataIndex: 'bDeptName'
            },
            {
                title: '租赁单价',
                dataIndex: 'rentingPrice'
            },
            {
                title: '操作',
                dataIndex: 'handle',
                render: (text, record) => <a onClick={ ()=>{ this.delete(record.assetsRecordGuid) } }><span>删除</span></a>
            },
        ];
        const modalColumns = [
            {
                title: '资产编号',
                dataIndex: 'assetsRecord'
            },
            {
                title: '资产名称',
                dataIndex: 'equipmentStandardName'
            },
            {
                title: '型号',
                dataIndex: 'fmodel'
            },
            {
                title: '规格',
                dataIndex: 'spec'
            },
            {
                title: '管理科室',
                dataIndex: 'bDeptName'
            },
            {
                title: '租赁单价',
                dataIndex: 'rentingPrice'
            },
        ];
        return (
            <Content>
                <Card style={{margin: '16px 16px 0'}} bordered={false}>
                    <Row gutter={30} style={{marginBottom: 10}}>
                        <Col span={12}>
                            <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>申请信息</h3>
                        </Col>
                        <Col style={{ textAlign: 'right' }} span={12}>
                            <Button onClick={this.save} type="primary">保存</Button>
                        </Col>
                    </Row>
                    <LoanForm ref="loanForm" >
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                <label className="ant-form-item-required">管理科室</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                                <div className="ant-form-item-control">
                                    <Select
                                        showSearch
                                        onChange={(value) => { this.setState({ manageDeptGuid: value }) }}
                                        onSearch={this.fetchSelect}
                                        placeholder="请选择管理科室" 
                                        value = {manageDeptGuid}
                                        // defaultActiveFirstOption = {false}
                                        // allowClear={true}  
                                        filterOption={false}
                                    >
                                        {mgtDeptData.map( d => <Option value={d.value} key={d.text} >{d.text}</Option> )}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </LoanForm>
                </Card>
                <Card style={{ margin: '0 16px' }} bordered={false}>
                    <Row style={{marginBottom: 10}}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>借用资产信息</h3>
                    </Row>
                    <Row style={{marginBottom: 10}}>
                        <Button onClick={this.showModal} type="primary">选择资产</Button>
                    </Row>
                    <Table
                        dataSource = {dataSource}
                        bordered
                        pagination={{
                            showTotal: (total, range) => `总共${total}个项目`
                        }}
                        scroll={{x: '100%'}}
                        showHeader={true}
                        columns={columns}
                        size="small"
                        rowKey={'RN'}
                    />
                </Card>
                <Modal
                    width={1000}
                    title="添加资产"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={ () => {this.setState({ visible: false, clearOff: true })} }
                >
                    <ModalForm clearOff={clearOff} queryAsset={this.queryAsset} />
                    <RemoteTable
                        query={{ manageDeptGuid }}
                        ref="modalTable"
                        rowSelection={{
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({ selectedRows });
                            }
                        }}
                        pagination={{
                            showTotal: (total, range) => `总共${total}个项目`
                        }}
                        url={ledgerBorrow.queryAssetsList}
                        scroll={{x: '100%'}}
                        showHeader={true}
                        columns={modalColumns}
                        size="small"
                        rowKey={'RN'}
                    />
                </Modal>
            </Content>
        )
    }
};

export default Loan;
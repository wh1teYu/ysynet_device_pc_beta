import React, { Component } from 'react';
import { Row,Col,Input,Icon, Layout } from 'antd';
import TableGrid from '../../../component/tableGrid';
import { Link } from 'react-router-dom'
import user from '../../../api/user';

const { Content } = Layout;
const Search = Input.Search;
const { RemoteTable } = TableGrid;

class SystemUser extends Component {
  render() {
    const columns = [
      {
        title: '操作',
        dataIndex: 'RN',
        width: 60,
        render: (text, record) => 
          <span>
            <Link to={{pathname: `/repairMgt/repairRecord/detail`, state: { ...record } }}><Icon type="form" />详情</Link>
          </span>  
      },
      {
        title: '账号',
        dataIndex: 'userName',
        width: 200
      },
      {
        title: '用户名',
        dataIndex: 'userNo',
        width: 80
      },
      {
        title: '所属组',
        dataIndex: 'groups',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'fstate',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: '所属机构',
        dataIndex: 'orgName',
        width: 100
      }
    ];
    return (
      <Content>
          <Row>
            <Col span={12}>
              <Search
                placeholder="请输入维修单号/资产编号/资产名称"
                onSearch={value => console.log(value)}
                style={{ width: 300 }}
                enterButton="搜索"
              />
            </Col>
          </Row>
          <RemoteTable
            ref='remote'
            url={user.findOrgAdminUserList}
            scroll={{x: '1800px'}}
            columns={columns}
            rowKey={'RN'}
            style={{marginTop: 10}}
            size="small"
          /> 
        </Content>
    )
  }
}
export default SystemUser;
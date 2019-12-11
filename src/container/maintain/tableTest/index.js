import React, { PureComponent } from 'react';
import { Table } from 'antd';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: (value, row, index) => {
    const obj = { children: value, props: {} };
    if (index === 0) {
      obj.props.rowSpan = 5;
    }
    if (index === 4) {
      obj.props.rowSpan = 5;
    }
    if (index === 8) {
      obj.props.rowSpan = 5;
    }
    return obj;
  }
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Home phone',
  dataIndex: 'tel'
}, {
  title: 'Phone',
  dataIndex: 'phone',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  tel: '0571-22098909',
  phone: 18889898989,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  tel: '0571-22098333',
  phone: 18889898888,
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  tel: '0575-22098909',
  phone: 18900010002,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Jim Red',
  age: 18,
  tel: '0575-22098909',
  phone: 18900010002,
  address: 'London No. 2 Lake Park',
}, {
  key: '5',
  name: 'Jake White',
  age: 18,
  tel: '0575-22098909',
  phone: 18900010002,
  address: 'Dublin No. 2 Lake Park',
}];
class TableTest extends PureComponent {
  render() {
    return (
      <Table columns={columns} dataSource={data} bordered pagination={false}/>
    )
  }
}
export default TableTest;
import React, { PureComponent } from 'react';

class TableSettings extends PureComponent {
  render() {
    return (
      <Popconfirm placement="topLeft" title={text} onConfirm={confirm} okText="确定" cancelText="还原">
        <Button>TL</Button>
      </Popconfirm>
    )
  }
}

export default TableSettings;
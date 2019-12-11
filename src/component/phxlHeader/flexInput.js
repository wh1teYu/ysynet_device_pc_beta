import React, { Component } from 'react';
import { Icon, Select } from 'antd';
import './style.css';
const Option = Select.Option;
/**
 * @file 伸缩输入框
 */
class FlexInput extends Component {
  state = {
    width: 0
  }
  onClick = () => {
    this.setState({
      width: 200
    })
    this.refs.flexInput.focus();
  }
  onBlur = () => this.setState({width: 0})
  render() {
    const { style } = this.props;
    return (
      <div className='ysynet-flex-input-wrapper' style={style}>
        <Icon 
          type="search" 
          onClick={this.onClick}
        />
        <Select
          mode="combobox"
          style={{ width: 200, border: 'none' }}
        >
          <Option value={'1'}>搜索条件一</Option>
          <Option value={'2'}>搜索条件二</Option>
          <Option value={'3'}>搜索条件三</Option>
          <Option value={'4'}>搜索条件四</Option>
        </Select>
        {/* <input
          ref='flexInput'
          style={{width: width}}
          onBlur={this.onBlur}
          placeholder={placeholder}
          className='ysynet-flex-input'
        /> */}
      </div> 
    )
  }
}

export default FlexInput
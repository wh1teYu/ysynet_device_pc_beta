/*  巡检管理 - 巡检记录 - 表单组件  */

import React, {Component} from 'react';

import {Form, Input, Row, Col, Button, Icon, Select, DatePicker} from 'antd';

import inspectionMgt from '../../../../api/inspectionMgt';

import request from '../../../../utils/request';

import queryString from 'querystring';

const FormItem = Form.Item;

const {Option} = Select;

const {RangePicker} = DatePicker;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
}

class InspectionForm extends Component {
    state = {
        display: this.props.isShow?'block':'none',expand:this.props.isShow,
        userDeptData: []
    }
    componentDidMount() {
        request(inspectionMgt.selectUseDeptList, {
            body: queryString.stringify({deptType: "00"}),
            headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    let userDeptData = data.result;
                    userDeptData = [{text: "全部", value: ''}, ...userDeptData];
                    this.setState({ userDeptData });
                }
            },
            error: err => console.log(err)
        })
    }
    toggle = () => {
        this.props.changeQueryToggle()
        this.setState({
            display: this.state.display === 'none'? 'block' : 'none'
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.setQuery(values);
        })
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let {display, userDeptData} = this.state;
        return (
            <Form onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem label={`巡检单号`} {...formItemLayout}>
                            {getFieldDecorator(`checkNo`)(
                                <Input placeholder="请输入巡检单号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={`巡检科室`} {...formItemLayout}>
                            {getFieldDecorator(`deptGuid`)(
                                <Select
                                    showSearch
                                    placeholder="请选择巡检科室"
                                    allowClear={true}  
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    { userDeptData.map((item) => <Option key={item.value} value={item.value} >{item.text}</Option> ) }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ display }} >
                        <FormItem label={`巡检人`} {...formItemLayout}>
                            {getFieldDecorator(`checkUserName`)(
                                <Input placeholder="请输入巡检人" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ display }} >
                        <FormItem label={`巡检日期`} {...formItemLayout}>
                            {getFieldDecorator(`createTime`)(
                                <RangePicker
                                    format={'YYYY-MM-DD'}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={ display === 'none'? 8 : 16 } style={{ textAlign: 'right' }} >
                        <Button type="primary" htmlType="submit" >查询</Button>
                        <Button style={{ margin: '0 8px' }} onClick={() => { this.props.form.resetFields();this.props.setQuery({});this.props.handleReset(); }}>重置</Button>
                        <a onClick={this.toggle}>{ display === 'none'? '展开' : '收起' }<Icon type={ display === 'none'? 'down' : 'up' } /></a>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default Form.create()(InspectionForm);
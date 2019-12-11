/*  借用管理 - 新建借出 - 选择资产表单组件  */


import React, {Component} from 'react';

import {Form, Input, Row, Col, Button, Icon} from 'antd';

const FormItem = Form.Item;

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

class ModalForm extends Component {
    state = {
        display: 'none'
    }
    componentWillReceiveProps(nextProps, props) {
        if(nextProps.clearOff) {
            this.props.form.resetFields();
        }
    }
    toggle = () => {
        this.setState({
            display: this.state.display === 'none'? 'block' : 'none'
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.queryAsset(values);
        })
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let {display} = this.state;
        return (
            <Form onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem label={`资产名称`} {...formItemLayout}>
                            {getFieldDecorator(`equipmentStandardName`)(
                                <Input placeholder="请输入资产名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={`资产编号`} {...formItemLayout}>
                            {getFieldDecorator(`assetsRecord`)(
                                <Input placeholder="请输入资产编号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ display }} >
                        <FormItem label={`规格`} {...formItemLayout}>
                            {getFieldDecorator(`spec`)(
                                <Input placeholder="请输入规格" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ display }} >
                        <FormItem label={`型号`} {...formItemLayout}>
                            {getFieldDecorator(`fmodel`)(
                                <Input placeholder="请输入型号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={ display === 'none'? 8 : 16 } style={{ textAlign: 'right' }} >
                        <Button type="primary" htmlType="submit" >查询</Button>
                        <Button style={{ margin: '0 8px' }} onClick={() => { this.props.form.resetFields(); }}>重置</Button>
                        <a onClick={this.toggle}>{ display === 'none'? '展开' : '收起' }<Icon type={ display === 'none'? 'down' : 'up' } /></a>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default Form.create()(ModalForm);
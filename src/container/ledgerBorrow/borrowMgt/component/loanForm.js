/*  借用管理 - 新建借出 - 表单组件  */

import React, { Component } from 'react';

import {Row, Form, Input, Col, DatePicker, Select} from 'antd';

import ledgerBorrow from '../../../../api/ledgerBorrow';

import request from '../../../../utils/request';

import queryString from 'querystring';

const FormItem = Form.Item;

const {Option} = Select;

const {TextArea} = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
}

class LoanForm extends Component{
    state = {
        loanData: [],     //借出科室数据
    }

    componentDidMount() {
        request(ledgerBorrow.selectUseDeptList, {     //借出科室
            body: queryString.stringify({ deptType: "00" }),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                this.setState({ loanData: data.result });
            },
            error: (err) => console.log(err)
        });
    }
    fetchSelect=(input)=>{
      request(ledgerBorrow.selectUseDeptList, {     //借出科室
        body: queryString.stringify({ deptType: "00" , deptName:input}),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (data) => {
            this.setState({ loanData: data.result });
        },
        error: (err) => console.log(err)
    });
    }
    
    render() {
        const {loanData} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                <Row gutter={30}>
                    <Col span={8}>
                        {this.props.children}
                    </Col>
                    <Col span={8}>
                        <FormItem label={`借用科室`} {...formItemLayout}>
                            {getFieldDecorator(`deptGuid`, {
                                rules: [{
                                    required: true,
                                    message: '请选择借用科室'
                                }]
                            })(
                                <Select
                                    onSearch={this.fetchSelect}
                                    placeholder="请选择借用科室"
                                    showSearch
                                    filterOption={false}
                                    // optionFilterProp="children"
                                    // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {loanData.map( d => <Option value={d.value} key={d.text} >{d.text}</Option> )}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={`借用人`} {...formItemLayout}>
                            {getFieldDecorator(`borrowUserName`)(
                                <Input placeholder="请输入借用人" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col span={8} >
                        <FormItem label={`预计归还时间`} {...formItemLayout}>
                            {getFieldDecorator(`estimateBack`, {
                                rules: [{
                                    required: true,
                                    message: '请输入归还时间'
                                }]
                            })(
                                <DatePicker
                                    style={{width: '100%'}}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请输入归还时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem label={`借用原因`} {...formItemLayout}>
                            {getFieldDecorator(`borrowCause`)(
                                <TextArea rows={4}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
};

export default Form.create()(LoanForm);
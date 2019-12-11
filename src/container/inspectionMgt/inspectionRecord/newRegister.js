import React, { Component } from 'react';

import inspectionMgt from '../../../api/inspectionMgt';

import assets from '../../../api/assets';

import {FTP} from '../../../api/local';

import queryString from 'querystring';

import request from '../../../utils/request';

import {Layout, Card, Row, Col, Form, DatePicker, Select, Upload, Button, Input, Icon, message} from 'antd';

const {Content} = Layout;

const {Option} = Select;

const {TextArea} = Input;

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



class NewRegister extends Component {
    state = {
        userDeptData: [],
        checkUserData: [],
        accessoryList: [],
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
                    this.setState({ userDeptData });
                }else {
                    message.warning(data.msg);
                }
            },
            error: err => console.log(err)
        });
        request(inspectionMgt.queryUserListByOrgId, {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    let checkUserData = data.result;
                    this.setState({ checkUserData });
                }else {
                    message.warning(data.msg);
                }
            },
            error: err => console.log(err)
        });
    }

    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                values.accessoryList = this.state.accessoryList;
                values.checkDate = values.checkDate.format('YYYY-MM-DD');
                values.checkResult = values.checkResult === undefined? '' : values.checkResult;
                request(inspectionMgt.insertCheckInfo, {
                    body: queryString.stringify(values),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    success: (data) => {
                        if(data.status) {
                            message.success('保存成功');
                            this.props.history.push(`/inspectionMgt/inspectionRecord`);
                        }else {
                            message.error(data.msg);
                        }
                    },
                    error: err => console.log(err)
                })
            }
        });
    }

    handleChange = (fileListObj) => {   //上传附件
        let { fileList } = fileListObj;

        fileList = fileList.map((file) => {   //修改预览地址
          if (file.response) {
            file.url = FTP + file.response.result;
          }
          return file;
        });

        // 3. 过滤上传失败的文件
        fileList = fileList.filter((file) => {
          if (file.response) {
            return file.response.status;
          }
          return false;
        });


        let accessoryList = fileList.map(item => item.response.result);

        this.setState({accessoryList});
    }

    beforeUpload = (file) => {
        switch (file.type){
            case "application/png":
                return true;
            case "application/gif":
                return true;
            case "application/jpg":
                return true;
            case "application/jpeg":
                return true;
            case "application/pdf":
                return true;
            case "image/gif":
                return true;
            case "image/jpg":
                return true;
            case "image/png":
                return true;
            case "image/jpeg":
                return true;
            default:
                message.error('仅支持扩展名：.pdf .jpg .png .gif .jpeg！', 3);
        };
        return false;
    }

    removeFile = (file) => {
        request(assets.deleteFile, {
            body: queryString.stringify({filePath: file.response.result}),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    message.success('移除成功');
                }
            },
            error: err => console.log(err)
        })
      }

    render() {
        let {getFieldDecorator} = this.props.form;
        let {userDeptData, checkUserData} = this.state;
        const props = {
            action: assets.uploadFile,
            data: (flie)=>({uploadFile: flie}),
            onChange: this.handleChange,
            onRemove: this.removeFile,
            beforeUpload: this.beforeUpload,
            listType: "picture-card",
            multiple: true
        };
        return (
            <Content>
                <Card style={{ margin: '16px 16px 0' }}>
                    <h3 style={{ fontWeight: 'bold' }}>巡检信息</h3>
                    <Form onSubmit={this.submit}>
                        <Row>
                            <Col span={8}>
                                <FormItem label={`巡检日期`} {...formItemLayout}>
                                    {getFieldDecorator(`checkDate`, {
                                        rules: [{
                                            required:true,message:"请输入巡检日期!"
                                        }]
                                    })(
                                        <DatePicker style={{width: '100%'}} placeholder="请输入巡检日期" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={`巡检科室`} {...formItemLayout}>
                                    {getFieldDecorator(`deptGuids`, {
                                        rules: [{
                                            required:true,message:"请选择巡检科室!"
                                        }]
                                    })(
                                        <Select
                                            placeholder="请选择巡检科室"
                                            mode="multiple"
                                            style={{width: '100%'}}
                                        >
                                            {userDeptData.map( (item) => <Option key={item.value} value={item.value} >{item.text}</Option> )}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={`巡检结果`} {...formItemLayout}>
                                    {getFieldDecorator(`checkResult`, {
                                        rules: [{
                                            max: 200, message: "最多不能超过200个汉字"
                                        }]
                                    })(
                                        <TextArea rows={4} placeholder="请输入巡检结果, 不能超过200个汉字" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={`巡检人`} {...formItemLayout}>
                                    {getFieldDecorator(`checkUserIds`, {
                                        rules: [{
                                            required:true,message:"请输入巡检人!"
                                        }]
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="请输入巡检人"
                                            mode="multiple"
                                        >
                                            {checkUserData.map( (item) => <Option key={item.userId} value={item.userId} >{item.userName}</Option> )}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={`附件`} {...formItemLayout}>
                                    {getFieldDecorator(`accessoryList`)(
                                        <div>
                                            <Upload {...props} withCredentials={true}>
                                                <Button>
                                                    <Icon type="upload" /> 上传文件
                                                </Button>
                                            </Upload>
                                            <small>支持扩展名：.pdf .jpg .png .gif .jpeg</small>
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: 'center' }} span={8}>
                                <Button style={{ marginRight: 8 }} type="primary" htmlType="submit" >提交</Button>
                                <Button onClick={ () => { this.props.history.goBack(-1) } } >取消</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Content>
        )
    }
}

export default Form.create()(NewRegister);

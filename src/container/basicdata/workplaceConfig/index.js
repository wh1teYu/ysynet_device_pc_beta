/*  基础数据 - 工作台配置  */

import React, { Component } from 'react';

import {Layout, Tabs, Tree, message} from 'antd';

import _ from 'lodash';

import queryString from 'querystring';

import request from '../../../utils/request';

import basicdata from '../../../api/basicdata';

const { Content } = Layout;

const {TabPane} = Tabs;

const {TreeNode} = Tree;


class WorkplaceConfig extends Component{
    state = {
        userList: [],                                   //用户组数据
        warnKeys: [],                                   //代办默认勾选
        docuKeys: [],                                   //单据默认勾选
        handleRemind: [],                               //待办提醒
        newOrder: [],                                   //最新单据
        warnExpanded: ['代办提醒'],
        docuExpanded: ['最新单据'],
        groupId: ''
    }

    componentDidMount() {
        new Promise((resolve, reject) => {
            request(basicdata.findGroupList, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (data) => {
                    if(data.status) {
                        resolve(data.result);
                    }else {
                        message.error(data.msg);
                    }
                },
                error: err => reject(err)
            })
        }).then((data) => {
            this.setState({ userList: data.rows, groupId: data.rows[0].groupId });
            this.setList(data.rows[0].groupId);
        })

    }

    setList = (groupId) => {
        const documentTypeList = new Promise((resolve, reject) => {
            request(basicdata.documentTypeList, {
                body: queryString.stringify({
                    queryType: 'handleRemind',
                    groupId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (data) => {
                    if(data.status) {
                        let handleRemind = data.result;
                        let warnKeys = handleRemind.filter( (item) => item.tick === "01" );
                        warnKeys = warnKeys.map( item => item.code );
                        handleRemind = this.dataDispose(handleRemind);
                        resolve({ handleRemind, warnKeys })
                    }else {
                        message.error(data.msg);
                    }
                },
                error: err => reject(err)
            });
        });
        const documentTypeList2 = new Promise((resolve, reject) => {
            request(basicdata.documentTypeList, {
                body: queryString.stringify({
                    queryType: 'newOrder',
                    groupId,
                    type: '02'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (data) => {
                    if(data.status) {
                        let newOrder = data.result;
                        let docuKeys = newOrder.filter( (item) => item.tick === "01" );
                        docuKeys = docuKeys.map( item => item.code );
                        newOrder = this.dataDispose(newOrder);
                        resolve({ newOrder,  docuKeys });
                    }else {
                        message.error(data.msg);
                    }
                },
                error: err => reject(err)
            });
        });

        Promise.all([documentTypeList, documentTypeList2])
        .then((posts) => {
            let {handleRemind, warnKeys} = posts[0];
            let {newOrder,  docuKeys} = posts[1];
            this.setState({
                handleRemind,
                warnKeys,
                newOrder,
                docuKeys
            });
        })
    }

    dataDispose = (data) => {
        let d = data.map((item) => {
            return {
                title: (
                    <span>
                        {item.name}
                        <span style={{ paddingLeft: 20 }}>{item.remark}</span>
                    </span>
                ),
                key: item.code
            }
        });
        d = [
                {
                    title: data[0].queryType === "handleRemind"? '代办提醒' : '最新单据' ,
                    key: data[0].queryType === "handleRemind"? '代办提醒' : '最新单据' ,
                    children: d
                }
            ];
        return d
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    onCheck = (checkedKeys, type, e) => {
        let {groupId} = this.state;
        let codes = '';
        if(e) {
            codes = e.node.props.eventKey;
        };
        if(type === "handleRemind") {
            if(checkedKeys.length > 5) {
                message.warning('工作提醒请控制在5个以内');
                return;
            }
            this.setState({warnKeys: checkedKeys});
        }else {
            if(checkedKeys.length > 5) {
                codes = checkedKeys.filter( item => item !== "最新单据" );
                codes = _.difference(codes, this.state.docuKeys);
            }else if(checkedKeys.length === 0) {
                codes = this.state.docuKeys.filter( item => item !== "最新单据" );
            }
            this.setState({docuKeys: checkedKeys});
        };

        request(basicdata.insertOrgConfig, {
            body: queryString.stringify({
                groupId,
                queryType: type,
                codes
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (data) => {
                if(data.status) {
                    message.success('配置成功');
                }else {
                    message.eroor(data.msg);
                }
            },
            error: err => console.log(err)
        });
    }

    onExpand = (expandedKeys, key) => {
        this.setState({
            [key]: expandedKeys
        });
    }

    tabsChange = (activeKey) => {
        //切换tabs获取不同数据
        this.setState({ groupId: activeKey });
        this.setList(activeKey);
    }

    render() {
        const {userList, warnKeys, docuKeys, handleRemind, newOrder, warnExpanded, docuExpanded} = this.state;
        return (
            <Content style={{padding: 24}} className="ysynet-content ysynet-common-bgColor">
                <Tabs
                    size="large"
                    tabPosition={`left`}
                    onChange = {this.tabsChange}
                >
                    {
                        userList.map((item) => {
                            return (
                                <TabPane
                                    style={{paddingLeft: 80}}
                                    tab={item.groupName}
                                    key={item.groupId}
                                >
                                    <Tree               //代办提醒
                                        showLine
                                        checkable
                                        onExpand={(warnExpanded) => {this.onExpand(warnExpanded, 'warnExpanded')}}
                                        expandedKeys={warnExpanded}
                                        onCheck={(checkedKeys, e) => { this.onCheck(checkedKeys, 'handleRemind', e) }}
                                        checkedKeys={warnKeys}
                                    >
                                        {this.renderTreeNodes(handleRemind)}
                                    </Tree>
                                    <Tree               //最新单据
                                        showLine
                                        checkable
                                        onExpand={(docuExpanded) => {this.onExpand(docuExpanded, 'docuExpanded')}}
                                        expandedKeys={docuExpanded}
                                        onCheck={(checkedKeys, e) => { this.onCheck(checkedKeys, 'newOrder', e) }}
                                        checkedKeys={docuKeys}
                                    >
                                        {this.renderTreeNodes(newOrder)}
                                    </Tree>
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </Content>
        )
    }
};

export default WorkplaceConfig;

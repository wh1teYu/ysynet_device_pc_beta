import React, { Component } from 'react';
import { Table, message } from 'antd';
import querystring from 'querystring';
import request from '../../utils/request'
import {sortUpByKey , sortDownByKey , objCompare} from '../../utils/tools';
class RemoteTable extends Component {
  constructor(props) {
    super(props)
    this.defaultPageSize = window.screen.height >= 1080 ? 20 : 10
    this.state = {
      data: [],
      pagination:{},
      loading: false,
      searchParams: {}
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if ((nextProps.url !== this.props.url) || 
      (typeof nextProps.query === 'string' ? nextProps.query !== this.props.query : !objCompare(nextProps.query, this.props.query))) {
        this.fetch(nextProps.query, nextProps.url)
    };
    if(typeof this.props.cb !== typeof nextProps.cb && typeof nextProps.cb === 'function') {
      nextProps.cb(this.state.data);
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    const pager = this.state.pagination;
    pager.pageSize = pagination.pageSize;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const postData = Object.assign({}, this.state.searchParams, {
      pageSize: pagination.pagesize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
    this.fetch(postData);
    if(onChange && typeof onChange === 'function'){
      postData.current=pagination.current;
      onChange({...postData})
    }
  }
  fetch = (params = {...this.props.query}, url = this.props.url,catchData={...this.props.catchData}) => {
    this.setState({ loading: true, searchParams: params });
    if(url){
      delete params['current']
      delete params['toggle']
      let pagination = this.state.pagination;
      const body = querystring.stringify({
        pagesize: pagination.pageSize ?  pagination.pageSize : ( this.props.pagesize || this.defaultPageSize ),
        ...params,
        ...catchData
      }) 
      request(url,{
        body,
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(!data.status){
            message.error(data.msg);
          }
          pagination.total = data.result.records;
          pagination.showSizeChanger = true;
          pagination.pageSizeOptions=['10','20','30'];
          pagination.showQuickJumper = true;
          pagination.showTotal=(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`;
          pagination.pageSize = pagination.pageSize ?  pagination.pageSize : ( this.props.pagesize || this.defaultPageSize );
          if(!params.page) {
            pagination.current = 1;
          }else{
            pagination.current = params.page;
          }
          
          if(data.result.rows && this.props.subrowKey){
            data.result.rows.forEach(element => {
              if(element.children){
                element.children.forEach(subItem =>{
                  subItem.subKey = subItem[this.props.rowKey];
                  subItem[this.props.rowKey] = subItem[this.props.rowKey] + subItem[this.props.subrowKey] || '';
                })
              }
            });
          }
          this.setState({
            loading: false,
            data: data.result.rows || data.result,
            pagination
          });
          if(typeof this.props.callback ==='function'){//获取请求回来的数据
            this.props.callback(data)
          }
          if(this.props.sortByTime){//根据时间排序
            const { method , key } = this.props.sortByTime;
            let arr = sortDownByKey(data.result.rows || data.result,key);//默认降序
            if(method==='up'){//升序
              arr = sortUpByKey(data.result.rows || data.result,key);
            }
            this.setState({data:arr})
          }
        },
        error: () => (
          this.setState({
            loading: false,
            data: []
          })
        )
      })
    }
    else{
      this.setState({
        loading: false,
        data: []
      })
    }
  }
  componentDidMount() {
    this.fetch();
    // if(this.props.isList){
    //   this.setDomHeight()
    // }
  }
  // setDomHeight = () =>{
  //   const screenHeight = document.body.clientHeight;//当前屏幕高度
  //   const dom = document.querySelector('.ant-table');
  //   if(dom){
  //     //设置高度
  //     const T =  document.querySelector('.ant-table-wrapper').offsetTop ;
  //     const domHeight = screenHeight - T - 100 - 72;
  //     console.log('screenHeight',screenHeight)
  //     console.log('T',T)
  //     console.log('domHeight',domHeight)
  //     document.querySelector('.ant-table').querySelector('.ant-table-body').style['max-height']=domHeight+'px';
  //   }
  // }
  render () {
    const { columns, rowKey, rowClassName, 
            rowSelection, scroll, footer,showHeader,title, pagination } = this.props;   
    const _props = {
        style:this.props.style,
        columns:columns || null,
        rowKey:rowKey,
        bordered:true,
        size:this.props.size || 'normal',
        dataSource:this.state.data,
        pagination: {...this.state.pagination, ...pagination},
        loading:this.state.loading,
        onChange:this.handleTableChange,
        rowClassName:rowClassName,
        showHeader:showHeader || null,
        title:title || null,
        rowSelection:rowSelection || null,
        scroll:scroll || { x: '1300px' },
        footer:footer || null,
        expandedRowRender:this.props.expandedRowRender,
    }
    if(this.props.onExpandedRowsChange && this.props.onExpandedRowsChange){
      _props.onExpandedRowsChange = this.props.onExpandedRowsChange;
      _props.expandedRowKeys = this.props.expandedRowKeys;
    }
    return (
      <Table 
        {..._props}
      />
    )
  }
}

export default RemoteTable;
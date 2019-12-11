/**
 *  档案管理-资产档案-详情-附件信息
 */
import React, { Component } from 'react';
import { Row,Col,Input,Icon,Upload,Button ,message,Menu,Dropdown,Alert} from 'antd';
import TableGrid from '../../../component/tableGrid';
import assets from '../../../api/assets';
import styles from './style.css';
import { ledger as ledgerService } from '../../../service';
import { certCodeData } from "../../../constants";
import querystring from 'querystring';

const { RemoteTable } = TableGrid;
const Search = Input.Search;

class AccessoryInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      messageError : ""
    }
  }
  //上传前判断
  beforeUpload = () => {
    this.setState({loading: true});
  }

  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query })
  }
  //删除
  handleDelete = (certId) => {
    ledgerService.getInfo(assets.deleteAssetsFile,querystring.stringify({certId:certId}),(data) => {
      if(data.status){
        message.success("操作成功!");
        this.refs.table.fetch();
      }else{
        message.error(data.msg)
      }
    })
  }
  render () {
    const columns = [
      {
        title: '操作',
        dataIndex: 'certId',
        width: 80,
        render: (text, record) => 
          <span>
            <a  href={assets.YSYPATH+record.tfAccessoryFile} target="_blank"><Icon type="file" />查看</a>
            <span className="ant-divider" />
            <a onClick={this.handleDelete.bind(null, record.certId)}><Icon type="delete" />删除</a>
          </span>  
      },
      {
        title: '附件类型',
        dataIndex: 'certCode',
        width: 100,
        render : text => certCodeData[text].text
      },
      {
        title: '上传用户',
        dataIndex: 'createUserName',
        width: 100
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'tfRemark',
        width: 100,
      }
    ];
    const props = {
      action: assets.assetsFileUpLoad,
      showUploadList: false,
      withCredentials: true,
      beforeUpload:this.beforeUpload,
      onError:(error)=>{
        this.setState({loading: false})
        console.log(error)
      },
      onSuccess:(result)=>{
        this.setState({loading: false})
        if(result.status){
            this.refs.table.fetch();
            this.setState({
                messageError:""
            })
            message.success("上传成功")
        }
        else{
            this.setState({
                messageError:result.msg
            })
        }
    }

    };

    const menu = (
      <Menu>
        <Menu.Item>
        <Upload {...props}  data={{"certCode":"15","assetsRecordGuid":this.props.assetsRecordGuid}}>
          <a><Icon type='export'/> 资产图片</a> 
        </Upload>
        </Menu.Item>
        <Menu.Item>
        <Upload {...props} data={{"certCode":"13","assetsRecordGuid":this.props.assetsRecordGuid}}>
          <a><Icon type='export'/> 招标文件</a> 
        </Upload>
        </Menu.Item>
        <Menu.Item>
        <Upload {...props} data={{"certCode":"14","assetsRecordGuid":this.props.assetsRecordGuid}}>
          <a><Icon type='export'/> 使用说明</a> 
        </Upload>
        </Menu.Item>
        <Menu.Item>
        <Upload {...props} data={{"certCode":"12","assetsRecordGuid":this.props.assetsRecordGuid}}>
          <a><Icon type='export'/> 其他</a> 
        </Upload>
        </Menu.Item>
      </Menu>
    );
    console.log( this.state.messageError,' this.state.messageError')
    return (
      <div className='ysynet-content ysynet-common-bgColor'>
          {
              this.state.messageError === "" ? null
              :
              <Alert message="错误提示"  type="error" description={<div dangerouslySetInnerHTML={{__html:this.state.messageError}}></div>} showIcon closeText="关闭" />
          }
          <Row style={{marginTop:10}}>
            <Col span={12}>
              <Search
                placeholder="请输入附件名称/类型"
                onSearch={value =>  {this.queryHandler({'params':value})}}
                style={{ width: 300 }}
                enterButton="搜索"
              />
            </Col>
            <Col span={12} className={styles['text-align-right']}>
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button>添加附件</Button>
              </Dropdown>
    
            </Col>
          </Row>
         <RemoteTable
            loading={ this.state.loading}
            ref='table'
            showHeader={true}
            query={{ assetsRecord: this.props.assetsRecord }}
            url={assets.selectCertInfoList}
            scroll={{x: '100%', y : document.body.clientHeight - 341}}
            columns={columns}
            rowKey={'RN'}
            style={{marginTop: 10}}
            size="small"
          /> 
      </div>
    )
  }
}
export default AccessoryInfo 
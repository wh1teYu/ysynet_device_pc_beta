/**
 * 保养列表--》完成页面
 */
import React from 'react'
import AddUpKeepForm from '../addUpKeep/addForm.js';
import {  Button ,Layout,Affix ,message} from 'antd'
import moment from 'moment';
import {withRouter  } from 'react-router-dom';
import upkeep from '../../../api/upkeep';
import request from '../../../utils/request';
import { cutFtpUrl } from '../../../utils/tools';
const { Content } = Layout; 

class UpKeepFinish extends React.Component{
    state={
			formInfo:{},
      maintainGuid:'',
      dataSource:[]
    }
    clearArray=(data)=>{
      for(let i=0;i<data.length;i++){
        for(let item in data[i]){
          if(item ==='key'|| item==='levelr'||item ==='key'||item==='maintainTemplateId'
            || item ==='templateDetailGuid' || item ==='templateTypeName'
            || item ==='title'
          ){
            delete data[i][item]
          }
        }
      }
      return data
    }
    //提交数据
    handleSubmit = (fstate) =>{
			this.refs.getFormData.validateFieldsAndScroll((err, values) => {
				if (!err) {
            if(this.state.dataSource.length===0){
              message.warning('请最少添加一条项目!')
              return false
            }
						const startTime = values['maintainDate'];
						const endTime = values['endMaintainDate'];
						const nextTme = values['nextMaintainDate'];
						values.maintainDate = moment(startTime).format('YYYY-MM-DD') 
						values.endMaintainDate = moment(endTime).format('YYYY-MM-DD') 
            if(nextTme&& nextTme!=="Invalid date"){
              values.nextMaintainDate = moment(nextTme).format('YYYY-MM-DD') 
            }else{
              values.nextMaintainDate = ''
            }
            values.fstate = fstate;
            values.maintainGuid = this.state.maintainGuid;
            values.maintainOrderDetailList =this.clearArray(this.state.dataSource);//此处为下方表格附带
						//更改附件格式
            let thumburl = []
            let fileString ='';
						if(values.tfAccessoryList){
							for(let i =0;i<values.tfAccessoryList.fileList.length;i++){
                let file = values.tfAccessoryList.fileList[i] ;
                if(file.thumbUrl){
                  thumburl.push(file.thumbUrl)
                }else{
                  fileString+= (cutFtpUrl(file.url)+';')
                  thumburl.push('')
                }
							}
						}	
            values.tfAccessoryList = thumburl;
            values.tfAccessory = fileString;
						this.sendAjax(values)
				}
			});
		}
		//发出请求
		sendAjax = (value) =>{
			// console.log('will SendAjax',JSON.stringify(value))
      let options = {
        body:JSON.stringify(value),
        success: data => {
          if(data.status){
            message.success( '操作成功')
            setTimeout(()=>{
              this.props.history.push('/upkeep/upkeeplist')
            },1000)
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(upkeep.submitAssetInfo, options)
      
    }
		//获取详情数据
		componentWillMount = () =>{
			const maintainGuid = this.props.match.params.id;
			this.setState({
				maintainGuid:maintainGuid
			})
		}
    render(){
        const {formInfo , maintainGuid}  = this.state;
        return(
          <div>
            <Affix>
              <div style={{background:'#fff',padding:'10px 20px',marginBottom:10,display:'flex',alignContent:'center',justifyContent:'flex-end'}}>
                <Button type="default" onClick={()=>this.handleSubmit('02')}>作废</Button>
                <Button type="primary" style={{marginLeft:15}} onClick={()=>this.handleSubmit('01')}>完成</Button>
              </div>
            </Affix>
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
                <AddUpKeepForm  formInfo={formInfo} ref='getFormData'
                maintainGuid={maintainGuid}
                editState = {true}
                callback={dataSource=>this.setState({dataSource})}/>
            </Content>
          </div>
        )
    }
}

export default withRouter(UpKeepFinish);
/**
 * 保养计划--》完成页面
 */
import React from 'react'
import AddTaskForm from '../addUpKeep/addTaskForm.js';
import { Button ,Layout,Affix ,message} from 'antd'
import moment from 'moment';
import {withRouter  } from 'react-router-dom';
import upkeep from '../../../api/upkeep';
import request from '../../../utils/request';
import { FTP } from '../../../api/local';
const { Content } = Layout; 

class UpKeepFinish extends React.Component{
    state={
			formInfo:{},
      maintainPlanDetailId:'',
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
    formatAccessory=(fileList)=>{//obj  此处直接接收的为fileList的值
      if(fileList&&fileList.length){//保留上传时返回的 24321/的地址路径
        let retList = fileList.map(item=>{
            if(item.response){
              return item.response.result
            }else{
              return item.url.replace(FTP,'')
            }
        })
        return retList
      }else{
        return null
      }
    }
    //提交数据
    handleSubmit = (fstate) =>{
      console.log(this.state.dataSource)
			this.refs.getFormData.validateFieldsAndScroll((err, values) => {
				if (!err) {
            if(this.state.dataSource.length===0){
              message.warning('请最少添加一条项目!')
              return false
            }
            let maintainOrder ={
              maintainDate:values['maintainDate']?moment(values['maintainDate']).format('YYYY-MM-DD'):'',
              nextMaintainDate:values['nextMaintainDate']?moment(values['nextMaintainDate']).format('YYYY-MM-DD'):'',
              endMaintainDate:values['endMaintainDate']?moment(values['endMaintainDate']).format('YYYY-MM-DD'):'',
              remark:values.remark,
              tfAccessoryList:this.formatAccessory(values.tfAccessoryList),
            }
            if(values.engineerUserid){ //保养人ID
              maintainOrder.engineerUserid = values.engineerUserid
            }
            if(values.serviceId){//服务商ID
              maintainOrder.serviceId = values.serviceId
            }
            let maintainPlanDetailId = this.state.maintainPlanDetailId;
            let maintainTypes =this.clearArray(this.state.dataSource);//此处为下方表格附带
            let json ={maintainOrder,maintainPlanDetailId,maintainTypes}
            
            this.sendAjax(json)
				}
			});
		}
		//发出请求
		sendAjax = (value) =>{
      console.log("sendAjax",JSON.stringify(value))
      let options = {
        body:JSON.stringify(value),
        success: data => {
          if(data.status){
            message.success( '操作成功')
            setTimeout(()=>{
              this.props.history.push('/upkeep/plan')
            },1000)
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(upkeep.doPlanDetails, options)
      
    }
		//获取详情数据
		componentWillMount = () =>{
			const maintainPlanDetailId = this.props.match.params.id;
			this.setState({
        maintainPlanDetailId
			})
		}
    render(){
        const {formInfo , maintainPlanDetailId}  = this.state;
        return(
          <div>
            <Affix>
              <div style={{background:'#fff',padding:'10px 20px',marginBottom:10,display:'flex',alignContent:'center',justifyContent:'flex-end'}}>
                <Button type="primary" style={{marginLeft:15}} onClick={()=>this.handleSubmit('40')}>完成</Button>
              </div>
            </Affix>
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
              <AddTaskForm  
                formInfo={formInfo} 
                maintainPlanDetailId = {maintainPlanDetailId} 
                editState = {true}
                ref='getFormData'
                callback={dataSource=>this.setState({dataSource})}
                />
            </Content>
          </div>
        )
    }
}

export default withRouter(UpKeepFinish);
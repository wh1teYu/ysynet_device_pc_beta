/**
 * 保养计划--》编辑页面
 */
import React from 'react'
import AddUpKeepPlanForm from './addPlanForm.js';
import { Form, Button ,Layout,Affix ,message} from 'antd'
import moment from 'moment';
import {withRouter  } from 'react-router-dom';
import upkeep from '../../../api/upkeep';
import request from '../../../utils/request';

const { Content } = Layout; 

const WrappedAdvancedSearchForm = Form.create()(AddUpKeepPlanForm);

class UpKeepFinish extends React.Component{
    state={
      formInfo:{},
      maintainData: {},
      maintainPlanId:'',
      tfCycleType: '',// 循环 (天, 月)
      dataSource:[],
      loading: false
		}
			//提交数据
    handleSubmit = () =>{
			this.refs.getFormData.validateFieldsAndScroll((err, values) => {
				if (!err) {
            let json = {}
            if(values['loopFlag']==='00'){//单次循环
              delete values['maintainDate']
              // values.maintainDate = moment(values['maintainDate']).format('YYYY-MM-DD'); 
            }else{
              const endTime = values['endMaintainDate'];
              values.endMaintainDate = moment(endTime).format('YYYY-MM-DD');
              values.tfCycleType = this.state.tfCycleType ? this.state.tfCycleType: this.state.maintainData.tfCycleType
              delete values['Date'];//删除数据中的Date
              delete values['maintainDate'];
            }
            delete values['assetsRecord'];//删除资产编号
            values.maintainPlanId = this.state.maintainPlanId;
            values.maintainPlanName = this.state.maintainData.maintainPlanName;
            values.assetsRecordGuid = this.state.maintainData.assestRecordGuid;
            values.executeDept = this.state.maintainData.executeDept;
            json.maintainTypes =this.state.dataSource;//保养项目合集ID
            json.maintainPlan = values;
            console.log(json,'json');
						this.sendAjax(json)
				}
			});
		}
		//发出请求
		sendAjax = (value) =>{
      this.setState({ loading: true });
      let options = {
        body:JSON.stringify(value),
        success: data => {
          this.setState({ loading: false })
          if(data.status){
            message.success( '操作成功')
            setTimeout(()=>{
              this.props.history.push('/upkeep/upKeepAccount')
            },1000)
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(upkeep.updateMaintainPlan, options)
      
    }
		//获取详情数据
		componentWillMount = () =>{
			const maintainPlanId = this.props.match.params.id;
			this.setState({
				maintainPlanId:maintainPlanId
      })
      
		}
    render(){
        const {formInfo , maintainPlanId}  = this.state;
        return(
          <div>
            <Affix>
              <div style={{background:'#fff',padding:'10px 20px',marginBottom:10,display:'flex',alignContent:'center',justifyContent:'flex-end'}}>
                <Button type="primary" style={{marginLeft:15}} onClick={this.handleSubmit} loading={this.state.loading}>保存计划</Button>
              </div>
            </Affix>
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
                <WrappedAdvancedSearchForm  formInfo={formInfo} ref='getFormData'
                maintainPlanId={maintainPlanId}
                url={upkeep.selectMaintainParameterList}
                editState = {true}
                tfCycleType={(tfCycleType) => this.setState({ tfCycleType })}
                maintainData={(data) => this.setState({ maintainData: data })}
                callback={dataSource=>this.setState({dataSource})}/>
            </Content>
          </div>
        )
    }
}

export default withRouter(UpKeepFinish);
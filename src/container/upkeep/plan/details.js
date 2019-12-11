/**
 * 保养计划-》保养详情
 */
import React from 'react'
import AddTaskForm from '../addUpKeep/addTaskForm';
import { Layout } from 'antd';
import { withRouter  } from 'react-router-dom';
const { Content } = Layout; 

class UpKeepDetails extends React.Component{
    state={
        formInfo:{}
    }
    componentWillMount = () => {
        const maintainPlanDetailId = this.props.match.params.id;
        this.setState({
            maintainPlanDetailId:maintainPlanDetailId
        })
    }
    render(){
        const {formInfo , maintainPlanDetailId}  = this.state;
        return(
          <div>
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
                <AddTaskForm  
                isDetail={true}
                formInfo={formInfo} 
                maintainPlanDetailId = {maintainPlanDetailId} 
                editState = {false}
                ref='getFormData'
                />
            </Content>
          </div>
        )
    }
}

export default withRouter(UpKeepDetails);
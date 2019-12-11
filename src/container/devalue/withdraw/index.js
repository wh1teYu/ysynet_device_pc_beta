/**折旧计提--列表*/
import React from 'react';
import { message , Row, Col, Layout ,Button ,DatePicker , Modal ,Spin , Select , Alert, Form } from 'antd';
import querystring from 'querystring';
import TableGrid from '../../../component/tableGrid';
import devalue from '../../../api/devalue';
import request from '../../../utils/request';
import { depreciationState ,depreciationStateSel} from '../../../constants';
import { Link } from 'react-router-dom';
import { timeToStamp } from '../../../utils/tools';
import moment from 'moment';
const { Content } = Layout;
const { RemoteTable } = TableGrid;
const { RangePicker , MonthPicker } = DatePicker;
const { Option } = Select;  
const FormItem = Form.Item;
const sortTime = (a,b,key) =>{
  if(a[key] && b[key]){
    return timeToStamp(a[key]) - timeToStamp(b[key])
  }else{
		return false
	}
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

class WithDraw extends React.Component{

    state = {
      query:{},
      loading:false,
      EquipmentConfig:"01",
      showModal:false,//初始化弹窗
      selOptions:[],//管理科室下拉框
    }

    componentDidMount (){
      //当前登陆用户的管理科室
      request(devalue.queryManagerDeptListByUserId,{
        body:querystring.stringify({}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: data => { 
          if(data.status){
            this.setState({
              selOptions:data.result
            })
            if(data.result[0]) {
              this.refs.table.fetch({bDeptId:data.result[0].value})
              this.queryEquipmentConfig(data.result[0].value)
            };
          }
        },
        error: err => {console.log(err)}
      })
    }

    //搜索表单 - 查询 
    queryHandler = (query) => {
      let value = this.props.form.getFieldsValue();
      console.log(value)
      if(value.createDate){
        value.startCreateDate=moment(value.createDate[0]).format('YYYY-MM');
        value.endCreateDate=moment(value.createDate[1]).format('YYYY-MM');
        delete value['createDate']
      }
      this.refs.table.fetch(value);
      this.queryEquipmentConfig(value.bDeptId);
      this.setState({query:value})
    }
    //搜索表单 - 重置
    reset = () =>{
      const { selOptions } = this.state;
      this.props.form.resetFields(['createDate']);
      this.props.form.setFieldsValue({'bDeptId':selOptions?selOptions.length?selOptions[0].value:'':''})
      this.refs.table.fetch({'bDeptId':selOptions?selOptions.length?selOptions[0].value:'':''});
      this.setState({
        query:{'bDeptId':selOptions?selOptions.length?selOptions[0].value:'':''}
      })
    }
    //搜索表单 - 时间日期设置
    handlePanelChange = (value, mode) => {
		  this.props.form.setFieldsValue({createDate:value})
      this.setState({
        mode: [
          mode[0] === 'date' ? 'month' : mode[0],
          mode[1] === 'date' ? 'month' : mode[1],
        ],
      });
    }

    sendWithDraw = (record) =>{
      let json ={
        bDeptId:this.props.form.getFieldValue('bDeptId'),
        depreciationDate:record.depreciationDate,
        equipmentDepreciationGuid:record.equipmentDepreciationGuid,
      }
      console.log('ajax',json)
      let options = {
        body:querystring.stringify(json),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            setTimeout(()=>{
              this.setState({'loading':false})
              message.success('操作成功')
              this.refs.table.fetch(this.props.form.getFieldsValue());
            },2000)
          }else{
            message.error(data.msg)
            setTimeout(()=>{
              this.setState({'loading':false})
            },1000)
          }
        },
        error: err => {console.log(err)}
      }
      request(devalue.subWithDraw, options);
    }

		doWithDraw = (record)=>{
			Modal.confirm({
				title:'是否确认计提',
				content:'确认计提后可能需要等待一段时间，您确定要操作吗？',
				onOk:()=>{
					this.setState({
						'loading':true
					})
          this.sendWithDraw(record)
				},
				onCancel:()=>{
				}
			})
    }

    formatTime = (timeStr) =>{
      let timeArr = timeStr.split('-');
      let str = timeArr[0]+'-'+timeArr[1] ;
      return str;
    }

    disabledMonthtDate = (current) => {
        return current && current > moment().endOf('day');
    }

    //初始化 
    initSubmit = () => {
      let payload = this.props.form.getFieldsValue(['acctDate','bDeptId']);
      payload.acctDate = moment(payload.acctDate).format('YYYY-MM')
      request(devalue.initializeInvoiceMonth, {
        body:querystring.stringify(payload),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
              message.success('操作成功')
              this.setState({showModal:false})
              this.refs.table.fetch(this.props.form.getFieldsValue());
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      });
    }

    //查询管理科室的折旧方式
    queryEquipmentConfig = (bDeptId) => {
      const payload = { bDeptId: bDeptId ? bDeptId :this.props.form.getFieldsValue(['bDeptId'])};
      request(devalue.selectEquipmentConfig, {
        body:querystring.stringify(payload),
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            //01自然月 02会计月
            this.setState({EquipmentConfig:data.result})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      });
    }

    render(){
      const columns=[
        {
          title: '序号', 
          dataIndex: 'index', 
          width:'1%',
          render : (text,record,index)=> index+1
        },
        { title: '操作', 
        dataIndex: 'equipmentDepreciationGuid', 
        width:'5%',
        render: (text,record) =>
          <span>
            { (record.fstate==="00") ? 
              <span><a  onClick={()=>this.doWithDraw(record)}> 计提</a></span>
              :<span><Link to={{pathname:`/devalue/withdraw/details/${record.equipmentDepreciationGuid}`}}>详情</Link></span>
            }
          </span>
        },
        {
          title: '会计月',
          dataIndex: 'depreciationDate',
          width:'10%',
          render:(text) =>{
            return <span>{ this.formatTime(text) }</span>
          }
        },
        {
          title: '状态',
          dataIndex: 'fstate',
          key: 'fstate',
          width:'5%',
          filters: depreciationStateSel,
          onFilter: (value, record) => (record && record.fstate===value),
          render: text => 
            <div>
              { depreciationState[text].text }
            </div>
        },
        {
          title: '计提时间',
          width:'8%',
          dataIndex: 'createTime',
          sorter: (a, b) => sortTime(a,b,'createTime'),
          render(text, record) {
            return <span title={text}>{text}</span>
          }
        },
        {
          title: '操作员',
          dataIndex: 'createUserName',
          width:'8%',
          render(text, record) {
            return <span title={text}>{text}</span>
          }
        }
      ]
      const { loading, selOptions , showModal , EquipmentConfig } = this.state;
      const { getFieldDecorator } = this.props.form;
      const EquipmentConfigType = EquipmentConfig === "02" ? true : false ;
      return(
          <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem label='管理科室' {...formItemLayout}>
                    {getFieldDecorator('bDeptId',{
                      initialValue:selOptions?selOptions.length?selOptions[0].value:'':''
                    })(
                      <Select 
                        style={{width:'100%'}}
                        showSearch
                        placeholder={'请选择'}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input>= 0)}
                      > 
                        {
                          selOptions.map(item=><Option key={item.value} value={item.value}>{item.text}</Option>)
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label='会计月' {...formItemLayout}>
                    {getFieldDecorator('createDate')(
                      <RangePicker
                        style={{width:'100%'}}
                        format="YYYY-MM"
                        mode={['month', 'month']}
                        onPanelChange={this.handlePanelChange}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col style={{ textAlign: 'right' }} span={8}>
                  <Button type='primary' style={{marginRight:8}} onClick={this.queryHandler}>查询</Button>
                  <Button onClick={this.reset}>重置</Button>
                </Col>
              </Row>
            </Form>
            {
              !EquipmentConfigType && 
              <Button type='primary' onClick={()=>this.setState({showModal:true})}>初始化</Button>
            }
            {
              EquipmentConfigType && <Alert message="月结后才能计提折旧" closable style={{width:500,marginTop:24}} type="warning" showIcon></Alert>
            }
            <RemoteTable
              ref='table'
              query={{bDeptId:'000'}}
              url={devalue.getDevalueList}
              isList={true}
              scroll={{x: '100%'}}
              columns={columns}
              rowKey={'equipmentDepreciationGuid'}
              showHeader={true}
              // sortByTime={{method:'down',key:'depreciationDate'}}
              style={{marginTop: 10}}
              size="small"
            /> 
            <Modal
              visible={loading}
              footer={null}
              closable={false}
              style={{textAlign:'center'}}>
              <Spin tip="正在处理中..."></Spin>
            </Modal>
            <Modal 
              destroyOnClose={true}
              visible={showModal} title={'初始化月份'}
              onOk={this.initSubmit}
              onCancel={()=>this.setState({showModal:false})}>
               <FormItem label='月份' {...formItemLayout}>
                  {
                    getFieldDecorator('acctDate',{
                      rules:[{required:true,message:'请选择初始化月份！'}]
                    })(
                      <MonthPicker format={"YYYY-MM"}
                      disabledDate={this.disabledMonthtDate}/>
                    )
                  }
              </FormItem>       
            </Modal>
          </Content>
      )
    }

}
export default Form.create()(WithDraw);
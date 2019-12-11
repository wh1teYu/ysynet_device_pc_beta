/*  yuwei
 *  基础数据 - 编码规则
 */
import React , { PureComponent } from 'react';
import { Layout , Card , Form, Radio ,Input , Select , Row , Col , Tooltip , Icon , Affix, Button , message , Tag} from 'antd';
import request from '../../../utils/request';
import basicdata from '../../../api/basicdata';
import queryString from 'querystring';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Content } = Layout;
const { Option } = Select;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};
const styles ={
    'mb-middle':{
        marginBottom: 20
    },
    'buttonGap':{
        marginRight: 15
    },
    'wapper':{
        textAlign: 'right',
        padding: 15,
        background: '#fff'
    },
    'bgf':{
        background: '#fff' 
    }
}
class NumberRules extends PureComponent {

    state={
      backData:null,
      preViewData:null,
    }

    componentDidMount () {
      request(basicdata.selectCpbmConfigZc,{
        body:queryString.stringify({}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
            console.log(JSON.stringify(data))
            this.setState({backData:data.result})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      })
    }
    //处理DetailList 中的 自定义字段
    _formatDetailList = (list) =>{
      list.map((item,index)=>{
        let keys = Object.keys(item);
        keys = keys.filter(item => item ==='middleSeparator_Value'||item ==='frontSeparator_Value'||item ==='afterSeparator_Value')
        keys.map((j)=>{
          let key = j.replace('_Value','');
          item[key] = item[j]
          delete item[j]
          return j
        })
        item.fsort=index+1;
        return item
      })
      return list
    }
    _formatCpb = (obj)=>{
      if(obj['suffix']==='1'){
        obj['suffix']=obj['suffix_Value']
        delete obj['suffix_Value']
      }
      if(obj['prefix']==='1'){
        obj['prefix']=obj['prefix_Value'];
        delete obj['prefix_Value']
      }
      return obj
    }
    //预览
    _previewCode = () => {
      this.props.form.validateFieldsAndScroll((err,values)=>{
          if(!err){
              const { backData } = this.state;
              const { detailList , ...cpbmConfigZc } = values;
              let postData = { detailList:this._formatDetailList(detailList) , cpbmConfigZc:this._formatCpb(cpbmConfigZc) }
              if(backData&&backData.cpbmConfigGuid){//编辑状态参数添加cpbmConfigGuid
                postData.cpbmConfigZc.cpbmConfigGuid = backData.cpbmConfigGuid ;
              }
              console.log(JSON.stringify(postData),'postData')
              request(basicdata.previewCpbmConfigZc,{
                body:JSON.stringify(postData),
                headers: {
                  'Content-Type': 'application/json'
                },
                success: data => {
                  if(data.status){
                    console.log(JSON.stringify(data),"_previewCode")
                    this.setState({preViewData:data.result})
                  }else{
                    message.error(data.msg)
                  }
                },
                error: err => {console.log(err)}
              })
          }
      })
    }
    //保存
    onSubmit = () => {
        this.props.form.validateFieldsAndScroll((err,values)=>{
            if(!err){
                const { backData } = this.state;
                const { detailList , ...cpbmConfigZc } = values;
                let postData = { detailList:this._formatDetailList(detailList) , cpbmConfigZc:this._formatCpb(cpbmConfigZc)}
                if(backData&&backData.cpbmConfigGuid){//编辑状态参数添加cpbmConfigGuid
                  postData.cpbmConfigZc.cpbmConfigGuid = backData.cpbmConfigGuid ;
                }
                this.setState({backData:postData})
                console.log(JSON.stringify(postData),'postData')
                request(basicdata.insertCpbmConfigZc,{
                  body:JSON.stringify(postData),
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  success: data => {
                    if(data.status){
                      this.setState({backData:data.result})
                      message.success('保存成功！')
                    }else{
                      message.error(data.msg)
                    }
                  },
                  error: err => {console.log(err)}
                })
            }
        })
    }
    onReset = () => {
      let { backData } = this.state;
      let ret = JSON.parse(JSON.stringify(backData)) ;
      ret.detailList = null;
      // Object.assign(JSON.parse(JSON.stringify(backData)),{detailList:null})
      this.setState({backData:ret})
      this.props.form.resetFields();

    }
    getTemplate = () => {
        const number = this.props.form.getFieldsValue(['configAmount']).configAmount;
        let newKeys =[]
        for(let i=0;i<number;i++){
            newKeys.push(i)
        }
        const { backData } = this.state; 
        const { getFieldDecorator } = this.props.form;
        const detailList = backData?backData.detailList:null;
        // backData&&backData.detailList&&getFieldDecorator('detailList', { initialValue: backData.detailList });
        const formItems = newKeys.map((k,index)=>{
            return (
                <Card key={index} style={styles['mb-middle']}>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label={<span>
                                    长度(位)&nbsp;
                                    <Tooltip title="当实际长度大于设置长度时，系统按设置长度自动向前截取。当实际长度小于设置长度时，系统按设置长度自动向后补足">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>}
                            >
                                {getFieldDecorator(`detailList[${k}].tfLength`,{
                                  initialValue:detailList&&detailList[k]&&detailList[k].tfLength?detailList[k].tfLength:'1',
                                  rules:[{required:true,message:'请选择长度'}]
                                })(
                                    <Select>
                                        <Option value='1'>1</Option>
                                        <Option value='2'>2</Option>
                                        <Option value='3'>3</Option>
                                        <Option value='4'>4</Option>
                                        <Option value='5'>5</Option>
                                        <Option value='6'>6</Option>
                                        <Option value='7'>7</Option>
                                        <Option value='8'>8</Option>
                                        <Option value='9'>9</Option>
                                        <Option value='10'>10</Option>
                                        <Option value='11'>11</Option>
                                        <Option value='12'>12</Option>
                                        <Option value='13'>13</Option>
                                        <Option value='14'>14</Option>
                                        <Option value='15'>15</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="前分隔符"
                            >
                                {getFieldDecorator(`detailList[${k}].frontSeparator`,{
                                  initialValue:detailList&&detailList[k]&&detailList[k].frontSeparator?detailList[k].frontSeparator:''
                                })(
                                    <Select>{/*  onChange={(value)=>this.handleTmpSelectChange(value,k,'frontSeparator')} */}
                                        <Option value='1'>自定义</Option>
                                        <Option value=''>无</Option>
                                        <Option value='/'>/</Option>
                                        <Option value='-'>-</Option>
                                        <Option value='_'>_</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {
                            this.props.form.getFieldsValue([`detailList`]).detailList[k]['frontSeparator']!=='1'?
                            null:
                            (
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label=' ' colon={false}>
                                        {getFieldDecorator(`detailList[${k}].frontSeparator_Value`,{
                                            rules:[{required:true,message:'请输入字符'},{min:1,max:2,message:'请输入1-2字符'}]
                                        })(
                                            <Input placeholder='请输入前分隔符'/>
                                        )}
                                    </FormItem>
                                </Col>
                            )
                        }
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="后分隔符"
                            >
                                {getFieldDecorator(`detailList[${k}].afterSeparator`,{
                                  initialValue:detailList&&detailList[k]&&detailList[k].afterSeparator?detailList[k].afterSeparator:''
                                })(
                                    <Select >{/* onChange={(value)=>this.handleTmpSelectChange(value,k,'afterSeparator')} */}
                                        <Option value='1'>自定义</Option>
                                        <Option value=''>无</Option>
                                        <Option value='/'>/</Option>
                                        <Option value='-'>-</Option>
                                        <Option value='_'>_</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {
                            this.props.form.getFieldsValue([`detailList`]).detailList[k]['afterSeparator']==='1' &&
                            (
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label=' ' colon={false}>
                                        {getFieldDecorator(`detailList[${k}].afterSeparator_Value`,{
                                            rules:[{required:true,message:'请输入字符'},{min:1,max:2,message:'请输入1-2字符'}]
                                        })(
                                            <Input placeholder='请输入后分隔符'/>
                                        )}
                                    </FormItem>
                                </Col>
                            )
                        }
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="内容分类"
                            >
                                {getFieldDecorator(`detailList[${k}].configType`,{
                                  initialValue:detailList&&detailList[k]&&detailList[k].configType?detailList[k].configType:'',
                                  rules:[{required:true,message:'请选择内容分类'}]
                                })(
                                    <Select>{/*  onChange={(value)=>this.handleTmpSelectChange(value,k,'configType')} */}
                                        <Option value='02'>物资分类</Option>
                                        <Option value='03'>日期</Option>
                                        <Option value='04'>流水号</Option>
                                        {/* <Option value='mtype'>材料分类</Option> */}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {//物资分类
                            this.props.form.getFieldsValue([`detailList`]).detailList[k]['configType']==='02'?
                            (
                                <span>
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label='中分隔符' >
                                        {getFieldDecorator(`detailList[${k}].middleSeparator`,{
                                          initialValue:detailList&&detailList[k]&&detailList[k].middleSeparator?detailList[k].middleSeparator:''
                                        })(
                                            <Select >{/* onChange={(value)=>this.handleTmpSelectChange(value,k,'middleSeparator')} */}
                                                <Option value='1'>自定义</Option>
                                                <Option value=''>无</Option>
                                                <Option value='/'>/</Option>
                                                <Option value='-'>-</Option>
                                                <Option value='_'>_</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                {
                                    this.props.form.getFieldsValue([`detailList`]).detailList[k]['middleSeparator']!=='1'?
                                    null:
                                    (
                                        <Col span={6}>
                                            <FormItem {...formItemLayout} label=' ' colon={false}>
                                                {getFieldDecorator(`detailList[${k}].middleSeparator_Value`,{
                                                    rules:[{required:true,message:'请输入字符'},{min:1,max:2,message:'请输入1-2字符'}]
                                                })(
                                                    <Input placeholder='请输入中分隔符'/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    )
                                }
                                </span>
                            )
                            :null
                        }

                        {//日期
                            this.props.form.getFieldsValue([`detailList`]).detailList[k]['configType']==='03'?
                            (
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label='日期格式' colon={false}>
                                        {getFieldDecorator(`detailList[${k}].configValue`,{
                                          initialValue:detailList&&detailList[k]?detailList[k].configValue:''
                                        })(
                                            <Select>
                                                <Option value='yyyyMMdd'>yyyymmdd</Option>
                                                <Option value='yyMMdd'>yymmdd</Option>
                                                <Option value='yy/MM/dd'>yy/mm/dd</Option>
                                                <Option value='yy-MM-dd'>yy-mm-dd</Option>
                                                <Option value='yy_MM_dd'>yy_mm_dd</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            ):null
                        }
                        {//流水号
                            this.props.form.getFieldsValue([`detailList`]).detailList[k]['configType']==='04'?
                            (
                                <Col span={6}>
                                    <FormItem {...formItemLayout} label='起始数'>
                                        {getFieldDecorator(`detailList[${k}].num`,{
                                          initialValue:detailList&&detailList[k]?detailList[k].num:'',
                                          rules:[{required:true,message:'请输入起始数'}]
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </Col>
                            ):null
                        }
                    </Row>   
                </Card>
            )
        })
        return formItems
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { backData , preViewData } = this.state;
        console.log(backData)
        return (
            <Content className='ysynet-content ysynet-common-bgColor' style={{padding: 24}}>
                <Form>
                    <Card
                    title={
                        <FormItem
                         style={{marginBottom: 0}}
                        >
                        {getFieldDecorator('fstate',{
                            initialValue: backData&&backData.fstate?backData.fstate : '01'
                        })(
                            <RadioGroup>
                                <Radio value="01">启用规则</Radio>
                                <Radio value="00">停用规则</Radio>
                            </RadioGroup>
                        )}
                        </FormItem>
                    }
                    >
                        <Row>
                            <Col span={10}>
                                <FormItem
                                    {...formItemLayout}
                                    label="前缀"
                                >
                                    {getFieldDecorator('prefix',{
                                      initialValue:backData&&backData.prefix?backData.prefix:''
                                    })(
                                        <Select>
                                            <Option value='1'>自定义</Option>
                                            <Option value=''>无</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                this.props.form.getFieldsValue(['prefix']).prefix==='1'?
                                (
                                    <Col span={6}>
                                        <FormItem {...formItemLayout} label=' ' colon={false}>
                                            {getFieldDecorator('prefix_Value',{
                                                rules:[{required:true,message:'请输入字符'},{min:1,max:4,message:'请输入1-4字符'}]
                                            })(
                                                <Input placeholder='请输入前缀字符'/>
                                            )}
                                        </FormItem>
                                    </Col>
                                )
                                :null
                            }
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem
                                    {...formItemLayout}
                                    label="后缀"
                                >
                                    {getFieldDecorator('suffix',{
                                      initialValue:backData&&backData.suffix?backData.suffix:''
                                    })(
                                        <Select>
                                            <Option value='1'>自定义</Option>
                                            <Option value=''>无</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                this.props.form.getFieldsValue(['suffix']).suffix==='1'?
                                (
                                    <Col span={6}>
                                        <FormItem {...formItemLayout} label=' ' colon={false}>
                                            {getFieldDecorator('suffix_Value',{
                                                rules:[{required:true,message:'请输入字符'},{min:1,max:4,message:'请输入1-4字符'}]
                                            })(
                                                <Input placeholder='请输入后缀字符'/>
                                            )}
                                        </FormItem>
                                    </Col>
                                )
                                :null
                            }
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem
                                    {...formItemLayout}
                                    label="位号数"
                                >
                                    {getFieldDecorator('configAmount',{
                                      initialValue:backData&&backData.configAmount?backData.configAmount:''
                                    })(
                                        <Select>
                                            <Option value='1'>1</Option>
                                            <Option value='2'>2</Option>
                                            <Option value='3'>3</Option>
                                            <Option value='4'>4</Option>
                                            <Option value='5'>5</Option>
                                            <Option value='6'>6</Option>
                                            <Option value='7'>7</Option>
                                            <Option value='8'>8</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    
                        {this.getTemplate()}
                    </Card>
                    <Affix offsetBottom={0} style={styles.bgf}>
                        <div style={{float: 'left',padding:15}}>
                          <Button onClick={this._previewCode}>预览</Button>
                          {preViewData?preViewData.prefix?<Tag style={{marginLeft:8}}>{preViewData.prefix}</Tag>:<Tag style={{marginLeft:8}}>暂无前缀</Tag>:null } 
                          {
                            preViewData&&preViewData.detail&&preViewData.detail.map((item,index)=>(
                                <Tag key={index} style={{marginLeft:8}}>{item.value}</Tag>
                            ))
                          }
                          {preViewData?preViewData.suffix?<Tag style={{marginLeft:8}}>{preViewData.suffix}</Tag>:<Tag style={{marginLeft:8}}>暂无后缀</Tag>:null }
                        </div>              
                        <div style={styles.wapper}>
                            <Button type='primary' onClick={this.onSubmit} style={styles.buttonGap}>保存</Button>
                            <Button onClick={this.onReset}>重置</Button>
                        </div>
                    </Affix>
                </Form>
            </Content>
        )
    }
}
export default Form.create()(NumberRules);
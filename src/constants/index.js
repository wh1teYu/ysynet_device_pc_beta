import React from 'react';
import { Badge } from 'antd';
export const repairCommonDataSource = [
  {
    title: '维修单号',
    dataIndex: 'rrpairOrderNo',
    width: 160
  }, 
  {
    title: '单据状态',
    dataIndex: 'orderFstate',
    width: 100,
    filters: [
      { text: '待接修', value: '10' },
      { text: '已指派', value: '20' },
      { text: '维修中', value: '30' },
      { text: '已拒绝', value: '80' },
      { text: '关闭', value: '90' },
      { text: '作废', value: '88' },
    ],
    onFilter: (value, record) => record.orderFstate.indexOf(value) === 0,
    sorter: false,
    render: text =>  <Badge status={repairData[text].color} text={ repairData[text].text} /> 

  },
  {
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width: 180
  },
  {
    title: '资产编号',
    dataIndex: 'assetsRecord',
    width: 100
  },
  {
    title: '报修科室',
    dataIndex: 'useDeptName',
    width: 100,
  },
  {
    title: '管理员',
    dataIndex: 'custodian',
    width: 80,
  },
  {
    title: '报修人',
    dataIndex: 'rrpairUsername',
    width: 80
  },
  {
    title: '报修时间',
    dataIndex: 'createDate',
    width: 130
  }
]
export const useFstateSel =[
  { text: '正常', value: '01' },
  { text: '故障中', value: '02' },
  { text: '报废中', value: '03' },
  { text: '已报废', value: '04' },
  { text: '借出', value: '05' },
  { text: '闲置', value: '06' },
];

// ledgerData 01正常在用（启用后或科室验收通过），02故障中（保修），03报废中，04已报废，05借出，06闲置，07转科中
export const ledgerData = {
  "01": {
    text: "正常",
    color: 'green'
  },
  "02": {
    text: "故障中",
    color: 'red'
  },
  "03": {
    text: "报废中",
    color: 'gray'
  },
  "04": {
    text: "已报废",
    color: 'gray'
  },
  "05": {
    text: "借出",
    color: 'gold'
  },
  "06": {
    text: "闲置",
    color: 'blue'
  },
  "07":{
    text: "转科中",
    color: 'blue'
  },
  null :{
    text: "无",
    color: 'gold'
  }
}
export const repairData = {
  //10申请，20指派，30维修中,50待验收，80已拒绝 90已关闭 
  "10": {
    text: "待接修",
    color: 'processing'
  },
  "20": {
    text: "已指派",
    color: 'success'
  },
  "30": {
    text: "维修中",
    color: 'success'
  },
  "50": {
    text: "待验收",
    color: 'warning'
  },
  "80": {
    text: "已拒绝",
    color: 'error'
  },
  "90": {
    text: "已关闭",
    color: 'error'
  },
  "88": {
    text: "已作废",
    color: 'error'
  },
  null :{
    text: "default"
  }
}

export const selectOption = {
  urgentFlag: [//紧急度
    { text: "紧急", value: "10" },
    { text: "急", value: "20" },
    { text: "一般", value: "30" },
  ],
  rrpairSend: [//是否送修
    { text: "是", value: "00" },
    { text: "否", value: "01" },
  ],
  spare: [ // 有无备用
    { text: "有备用", value: "00" },
    { text: "无备用", value: "01" },
  ],
  guaranteeFlag: [//是否在保
    { text: "在保", value: "01" },
    { text: "出保", value: "02" },
  ],
  faultDescribe: [ // 故障现象
    { text: "部分功能失效", value: "00" },
    { text: "开机后死机", value: "01" },
    { text: "性能指标偏离", value: "03" },
    { text: "不规则或偶发故障", value: "04" },
    { text: "其他", value: "02" }
  ],
  useFstate: [ //是否停用
    { text: "是", value: "02" },
    { text: "否", value: "01" },
  ],
  offCause: [ //关闭原因
    // 00误报；01无法维修；02维修成本高，99其他 
    { text: "误报", value: "00" },
    { text: "无法维修", value: "01" },
    { text: "维修成本高", value: "02" },
    { text: "其他", value: "99" },
  ],
  //00正常使用；01报废；99其他
  followupTreatment: [ // 后续处理
    { text: "正常使用", value: "00" },
    { text: "报废", value: "01" },
    { text: "其他", value: "99" },
  ],
  repairResult: [ //维修结果
    //00完全修复；01部分修复；02未修复 
    { text: "完全修复", value: "00" },
    { text: "部分修复", value: "01" },
    { text: "未修复", value: "02" },
  ],
  repairContentType: [ // 故障类型
    { text: "暂时性故障", value: "00" },
    { text: "永久性故障", value: "01" },
    { text: "突发性故障", value: "02" },
    { text: "渐发性故障", value: "03" },
    { text: "破坏性故障", value: "04" },
    { text: "非破坏性故障", value: "05" },
    { text: "其他", value: "99" }
  ],
  repairContentTyp: [ // 故障原因
    { text: "设备老化", value: "00" },
    { text: "使用不当", value: "01" },
    { text: "缺乏维护", value: "02" },
    { text: "其他", value: "99" },
  ],
  notCause: [ // 验收不通过原因
    // 00故障未解决；01维修效果不满意；02维修服务质量差；99其他 
    { text: "故障未解决", value: "00" },
    { text: "维修效果不满意", value: "01" },
    { text: "维修服务质量差", value: "02" },
    { text: "其他", value: "99" },
  ]
}
//资产生产商国家
export const ProductCountry = [
  { text: "国产", value: "00" },
  { text: "进口", value: "01" },
]

export const faultDescribeData ={
  "00" : { text: "部分功能失效" },
  "01" : { text: "开机后死机" },
  "03" : { text: "性能指标偏离" },
  "04" : { text: "不规则或偶发故障" },
  "02" : { text: "其他" }
}  

//证件附件类别
export const certCodeData ={
  "15" : { text: "资产图片" },
  "12" : { text: "其他" },
  "13" : { text: "招标文件" },
  "14" : { text: "使用说明书 " },
  "00" : { text: "登记表"},
  "01" : { text: "验收表 "},
  "02" : { text: "合同 "},
  "03" : { text: "资产图片"},
  "04" : { text: "其他"}
  //00登记表，01验收表，02合同，03资产图片，04其他
}  

//资产类别
export const productTypeData ={
  "01" : { text: "医疗设备" }
} 

//资产经费来源
export const certSourceFunds = {
  "01": { text: '通用设备'},
  "02": { text: '自建'},
  "03": { text: '融资租入'},
  "04": { text: '接受捐赠'},
  "05": { text: '盘盈'},
  "06": { text: '其他'},
}
//资产折旧方式
export const depreciationTypeData = {
  "01": { text: '平均年限法'},
  "02": { text: '工作量法'},
  "03": { text: '双倍余额递减法'},
  "04": { text: '年数总和法'},
}

//清查记录状态
export const checkStateSel = [
  { text: '清查中', value: '0' },
  { text: '已清查', value: '1' },
] 
//清查记录状态
export const checkState = {
  "0": { text: '清查中',color: 'darkgray'},
  "1": { text: '已清查',color: 'limegreen'},
  null :{text: "",color: 'transparent'}
}
//清查记录方式
export const checkType = {
  "0": { text: '管理科室',color: 'darkgray'},
  "1": { text: '使用科室',color: 'limegreen'},
  null :{text: "asd",color: 'transparent'}
}


//清查详情 - 清查结果类型
export const checkDetailType = {
  "00": { text: '未清查',color: 'darkgray'},
  "01": { text: '已清查',color: 'limegreen'},
  "02": { text: '富余',color: 'limegreen'},
  null :{text: "",color: 'transparent'}
}
//折旧计提
export const depreciationStateSel =[
  { text: '未计提', value: '00' },
  { text: '已计提', value: '01' },
] 
export const depreciationState = {
  "00": { text: '未计提'},
  "01": { text: '已计提'},
  null :{text: ""}
}
//资金来源
export const payType = {
  "01": { text: '自筹资金'},
  "02": { text: '财政拨款'},
  "03": { text: '科研经费'},
  "04": { text: '教学资金'},
  "05": { text: '接收捐赠'},
  "06": { text: '其他'},
  null :{text: ""}
}


//保养登记
export const upkeepStateSel =[
  { text: '待完成', value: '00' },
  { text: '已完成', value: '01' },
  { text: '已作废', value: '02' },
] 
export const upkeepState = {
  "00": { text: '待完成',color: 'darkgray'},
  "01": { text: '已完成',color: 'limegreen'},
  "02": { text: '已作废',color: 'red'},
  null :{text: "",color: 'transparent'}
}
export const upkeepMainTainType = {
  "00": { text: '内保'},
  "01": { text: '外保'},
  null :{text: "未知"}
}
export const upkeepDetailsTable = {
  "00":{ text: '合格' },
  "01":{ text: '不合格' },
  "02":{ text: '保养后合格' },
  null:{text: ''}
}

export const upkeepResult =[
  { text: '合格', value: '00' },
  { text: '不合格', value: '01' },
  { text: '保养后合格', value: '02' },
]

export const upKeppModeSelect =[
  { text: '管理科室保养', value: '01' },
  { text: '临床科室保养', value: '02' },
  { text: '服务商保养', value: '03' },
]
export const upKeepMode ={
  "01":"管理科室保养",
  "02":"临床科室保养",
  "03":"服务商保养",
  "null":""
}

export const upkeepPlanStateSel =[
  { text: '草稿', value: '00' },
  { text: '待执行', value: '20' },
  { text: '执行中', value: '30' },
  { text: '已执行', value: '40' },
  { text: '已关闭', value: '80' },
] 
export const upkeepPlanState = {
  "00": { text: '草稿'},
  "20": { text: '待执行'},
  "30": { text: '执行中'},
  "40": { text: '已执行'},
  "80": { text: '已关闭'},
  null :{text: "",color: 'transparent'}
}
export const upkeepPlanLoopFlag ={
  "00":{ text: '单次' },
  "01":{ text: '循环' },
  null:{text: ''}
}

export const newPlanProductTypeSel =[
  { text: '通用设备', value: '00' },
  { text: '电气设备', value: '02' },
  { text: '电子产品及通信设备', value: '03' },
  { text: '仪器仪表及其他', value: '04' },
  { text: '专业设备', value: '05' },
  { text: '其他', value: '06' },
]

export const transferState ={
  "00":{text:"待转科"},
  "03":{text:"已转科"},
  "07":{text:"已关闭 "},
}
//保养台账状态（启停用）
export const maintaiFlag = {
  "00": { text: '停用' },
  "01": { text: "启用" }
}

// 保养模式
export const maintainModeType = {
  "01": { text: '管理科室保养' },
  "02": { text: '临床科室保养' },
  "03": { text: '服务商保养' },
  null :{text: "",color: 'transparent'}
}

//发票审核状态
export const equipmentInvoiceStatus ={
  "00":{text:"待审核"},
  "03":{text:"审核通过"},
  "05":{text:"已结账"},
  "09":{text:"审核不通过"},
}
 //设备发票查询-下拉框
export const equipmentInvoiceSelect =[
  {text:"待审核",value:"00"},
  {text:"审核通过",value:"03"},
  {text:"已结账",value:"05"},
  {text:"审核不通过",value:"09"},
]
export const deliveryStatus = {
  "00":{text:"待验收"},
  "05":{text:"验收通过"},
  "09":{text:"交易完成"}
}

//档案管理- 招标管理

export const tenderStatus = {
  "00":"未发布",
  "01":"已发布"
}
export const tenderSelect = [
  {text:"未发布",value:"00"},
  {text:"已发布",value:"01"}
]
//档案管理- 合同管理
export const contractStatus = {
  "00":"合同草稿",
  "01":"正式合同"
}
export const contractSelect = [
  {text:"合同草稿",value:"00"},
  {text:"正式合同",value:"01"}
]
export const contractTypeSelect = [
  {text:"设备",value:"01"}
]
export const contractTypeStatus = {
  "01":"设备"
}

//科室业务 -  新建申请
export const equipProcurementStatus={
  "00":"草稿",
  "10":"审批中",
  "20":"审批通过",
  "80":"审批不通过",
  "90":"作废",
}
//经费来源下拉框
export const fundsSourceSelect=[
  {text:"自筹",value:"00"},
]

export const fundsSourceStatus={
 "00":"自筹"
}

// 基础数据 - 审批配置
export const approvalSelect = [
  {text:"指定审批人",value:"01"},
  {text:"固定审批人",value:"02"},
]
export const approvalStatus ={
  "01":"指定审批人",
  "02":"固定审批人"
}

//审批管理 - 新品审批
export const allowTypeSelect = [
  {text:"新设备采购申请",value:"00"},
]
export const allowTypeStatus = {
  "00":"新设备采购申请"
}
export const approvalFstateSelect=[
  {text:"草稿",value:"00"},
  {text:"审批中",value:"10"},
  {text:"审批通过",value:"20"},
  {text:"审批不通过",value:"80"},
  {text:"作废",value:"90"},
]
export const approvalFstateStatus={
  "00":"草稿",
  "10":"审批中",
  "20":"审批通过",
  "80":"审批不通过",
  "90":"作废",
}

export const approvalOpinionStatus ={
  "00":"待审批",
  "01":"已审批",
  "02":"未通过",
}

export const yesNo = {
  "01":"是",
  "00":"否",
}

export const haveNo = {
  "01":"有",
  "00":"无",
}

//资产借用
export const borrowSelect =[
  {text:'借出中',value:"00"},
  {text:'已归还',value:"01"},
  {text:'待审核',value:"03"},
  {text:'驳回借出',value:"09"},
]
export const borrowFstate ={
  "00":"借出中",
  "01":"已归还",
  "03":"待审核",
  "09":"驳回借出"
}

//付款进度
export const PayFstateSelect = [
  {text:'待付款',value:"00"},
  {text:'付款中',value:"02"},
  {text:'已付款',value:"09"},
]
export const PayFstate ={
  "00":"待付款",
  "02":"付款中",
  "09":"已付款",
}

export const COnfigCtrlTips = {
  "01":"配置操作入库时是否打印单据",
  "02":"配置操作退货时是否打印单据",
  "03":"配置操作出库时是否打印单据",
  "04":"配置操作退库时是否打印单据",
  "05":"控制报废记录打印单据的样式（值为否，默认模版）",
  "06":"会计月需要先做月结；自然月，直接取自然月",
}
//付款计划
export const PayPlanFstate ={
  "00":"草稿",
  "03":"已发布"
}
export const PayPlanFstateSelect = [
  {text:'草稿',value:"00"},
  {text:'已发布',value:"03"}
]
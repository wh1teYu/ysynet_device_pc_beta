/*
 * @Author: yuwei - 生命周期页切 lifecycle
 * @Date: 2018-07-03 09:42:41 
* @Last Modified time: 2018-07-03 09:42:41 
 */
import React ,{ Component } from 'react'
import { Tabs , Layout} from 'antd';
import assets from '../../../api/assets';
import TableGrid from '../../../component/tableGrid';
import { repairData , upkeepMainTainType , upkeepState , transferState , payType} from '../../../constants';
const TabPane = Tabs.TabPane;
const { Content } = Layout;
const { RemoteTable } = TableGrid;

const columns_1 = [
  {
    title:'序号',
    dataIndex:'index',
    width:50,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '维修单号',
    dataIndex: 'rrpairOrderNo',
    width:100,
  },
  {
    title: '单据状态',
    dataIndex: 'orderFstate',
    width:100,
    render:(text)=>repairData[text].text
  },
  {
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width:100,
  },
  {
    title: '使用科室',
    dataIndex: 'useDeptName',
    width:100,
  },
  {
    title: '报修时间',
    dataIndex: 'createDate',
    width:100,
    render:(text)=>text?text.substr(0,11):''
  },
  {
    title: '维修时间',
    dataIndex: 'createDate2',
    width:100,
    render:(text,record)=>record.createDate?record.createDate.substr(0,11):''
  }
];
const columns_2 = [
  {
    title:'序号',
    dataIndex:'index',
    width:50,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '保养单号',
    dataIndex: 'maintainNo',
    width: 200,
  },
  {
    title: '保养单状态',
    dataIndex: 'fstate',
    width: 200,
    render:(text)=>upkeepState[text].text
  },
  {
    title: '资产名称',
    dataIndex: 'equipmentName',
    width: 100
  },
  {
    title: '使用科室',
    dataIndex: 'useDeptName',
    width: 150
  },
  {
    title: '保养类型',
    dataIndex: 'maintainType',
    width: 100,
    render:(text)=>upkeepMainTainType[text].text
  },
  {
    title: '保养开始时间',
    dataIndex: 'maintainDate',
    width: 100,
    render:(text)=>text?text.substr(0,11):''
    
  },
  {
    title: '保养结束时间',
    dataIndex: 'endMaintainDate',
    width: 100,
    render:(text)=>text?text.substr(0,11):''
  }
];
const columns_3 = [
  {
    title:'序号',
    dataIndex:'index',
    width:50,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '转科单号',
    dataIndex: 'transferNo',
    width: 200,
  },
  {
    title: '单据状态',
    dataIndex: 'fstate',
    width: 200,
    render:(text)=>transferState[text].text
  },
  {
    title: '申请时间',
    dataIndex: 'createDate',
    width: 100,
    render:(text)=>text?text.substr(0,11):''
  },
  {
    title: '申请人',
    dataIndex: 'createUserName',
    width: 150
  },
  {
    title: '转出科室',
    dataIndex: 'outDeptName',
    width: 100
  },
  {
    title: '转入科室',
    dataIndex: 'inDeptName',
    width: 100
  },
  {
    title: '转科日期',
    dataIndex: 'transferDate',
    width: 100,
    render:(text)=>text?text.substr(0,11):''
  },
  {
    title: '转科原因',
    dataIndex: 'transferOpinion',
    width: 100
  },
];
const columns_4 = [
  {
    title:'序号',
    dataIndex:'index',
    width:50,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '折旧月',
    dataIndex: 'depreciationDate',
    width: 200,
    render:(text)=>text?text.substr(0,11):''
  },
  {
    title: '资产名称',
    dataIndex: 'equipmentStandardName',
    width: 200
  },
  {
    title: '使用科室',
    dataIndex: 'useDeptName',
    width: 100
  },
  {
    title: '月折旧率',
    dataIndex: 'monthDepreciationV',
    width: 150
  },
  {
    title: '资金来源',
    dataIndex: 'payType',
    width: 100,
    render:(text)=>{
      if(text){
        return(
          <span title={payType[text].text}>  {payType[text].text}</span>
        )
      }else{
        return(
          <span> 总计 </span>
        )
      }
    }
  },
  {
    title: '月折旧金额',
    dataIndex: 'monthDepreciationPrice',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  },
  {
    title: '累计折旧金额',
    dataIndex: 'totalDepreciationPrice',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  },
  {
    title: '净值',
    dataIndex: 'carryingAmount',
    width: 100,
    render:(text)=>(text-0).toFixed(2)
  }
];

const columns_5 = [
  {
    title:'序号',
    dataIndex:'index',
    width:50,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '计量检测编号',
    dataIndex: 'recordNo',
    width: 200
  },
  {
    title: '检测日期',
    dataIndex: 'measureDate',
    width: 200
  },
  {
    title: '检测结果',
    dataIndex: 'results',
    width: 200,
    render: (text) =>{
      return text === '00' ? <span style={{ color: 'green' }}>合格</span>: text === '01'? <span style={{ color: 'red' }}>不合格</span>:''
    }
  },
  {
    title: '检定人',
    dataIndex: 'verdictUserName',
    width: 200
  }
];
const columns_6 = [
  {
    title:'序号',
    dataIndex:'index',
    width:50,
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    width: 200
  },
  {
    title: "合同名称",
    dataIndex: "contractName",
    width: 250
  },
  {
    title: '供应商名称',
    dataIndex: 'fOrgName',
    width: 200
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200
  }
];

class Lifecycle extends Component {
    render(){
      return(
        <Content className='ysynet-content ysynet-common-bgColor'>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="维修信息" key="1">
                <TabTable 
                url={assets.querySelectRrpairList} 
                columns={columns_1} 
                query={{assetsRecordGuid:this.props.match.params.id}}
                rowKey={'rrpairOrderGuid'}/>
            </TabPane>
            <TabPane tab="保养工单" key="2">
              <TabTable url={assets.querySelectMaintainOrderList} columns={columns_2} query={{assetsRecordGuid:this.props.match.params.id}}/>
            </TabPane>
            <TabPane tab="转科记录" key="3">
              <TabTable url={assets.selectTransferDetailList} columns={columns_3} query={{assetsRecordGuid:this.props.match.params.id}}/>
            </TabPane>
            <TabPane tab="折旧信息" key="4">
              <TabTable 
              url={assets.selectEquimentDepreciationPayList} 
              columns={columns_4} 
              rowKey={'guid'}
              query={{assetsRecordGuid:this.props.match.params.id}}
              subrowKey={'equipmendepreciationPayGuid'}/>
            </TabPane>
            <TabPane tab="计量信息" key="5">
              <TabTable 
              url={assets.selectMeterRecordList} 
              columns={columns_5} 
              rowKey={'recordInfoGuid'}
              query={{assetsRecordGuid:this.props.match.params.id}}
              />
            </TabPane>
            <TabPane tab="合同信息" key="6">
              <TabTable 
              url={assets.selectContractRecordList} 
              columns={columns_6} 
              rowKey={'contractId'}
              query={{assetsRecordGuid:this.props.match.params.id}}
              />
            </TabPane>
          </Tabs>
        </Content>
      )
    }
}
export default Lifecycle;

class TabTable extends Component {
  render(){
    return(
      <RemoteTable
        query={this.props.query || {}}
        url={this.props.url}
        scroll={{x: '100%', y : document.body.clientHeight - 311}}
        columns={this.props.columns || []}
        showHeader={true}
        rowKey={this.props.rowKey || 'RN'}
        style={{marginTop: 10}}
        size="small"
        subrowKey={this.props.subrowKey}
      /> 
    )
  }
}
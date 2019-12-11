/**保养登记--列表*/
import React from 'react';
import { Row, Col, Input, Layout  , Button ,Tree ,message} from 'antd';
import _ from 'lodash';
import basicdata from '../../../api/basicdata';
import request from '../../../utils/request';
import querystring from 'querystring';
import MaintainTmpTransfer from './maintainTmpTransfer';
import MaintainTmpModal from './maintainTmpModal';
import MaintainTmpQuoteModal from './maintainTmpQuoteModal';
import styles from './maintainTmp.css';
import {gData} from './mock'
const { Content } = Layout;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class inventoryCategory extends React.Component{
		state = {
			gData:[],
			query:'',
			thisOneInfo:{},
			expandedKeys: [],//展开的key
			searchValue: '',//tree搜索值
			selectDropData:[],//上级分类下拉框数据存储
			loading: false,
			modalState:'新增',
			addVisible: false,//新增弹窗显示状态
			quoteVisible: false,//引用弹窗
			addModalData:{},//新增的时候获取的数据
			queryEquipmentTmpData:[],//transfer下面的设备
			editModalData:{},//点击编辑之后的需要回显的数据
		}
		queryHandler = (query) => {
      this.setState({ query })
		}
		//引用新增中的数据
		onSelectChange = (selectedRowKeys) => {
			this.setState({ selectedRowKeys });
		}
		//展开一级Tree的时候 需要获取该内部二级项目 并展现
		onExpand = (expandedKeys) => {
			this.setState({
				expandedKeys,
				autoExpandParent: false,
			});
		}
		onChange = (e) => {
			const value = e.target.value;
			const expandedKeys = dataList.map((item) => {
				if (item.key.indexOf(value) > -1) {
					return getParentKey(item.key, gData);
				}
				return null;
			}).filter((item, i, self) => item && self.indexOf(item) === i);
			this.setState({
				expandedKeys,
				searchValue: value,
				autoExpandParent: true,
			});
		}
		
		onSelect = (selectedKeys) => {
			let b = this.findInfo(selectedKeys);
			if(b && selectedKeys.length!==0){//确定选中了对象
				if(!b.parentKey){//非第二级目录
					this.queryTwoModuleAjax(selectedKeys)
				}
			}
			console.log('selectedKeys',selectedKeys)
			this.setState({ selectedKeys ,'editModalData':b});
		}
		renderTreeNodes = (data) => {
			return data.map((item) => {
				if (item.children) {
					return (
						<TreeNode title={item.title} key={item.key} dataRef={item}>
							{this.renderTreeNodes(item.children)}
						</TreeNode>
					);
				}
				return <TreeNode {...item} />;
			});
		}

		findInfo =(selKey)=>{
			let data = _.cloneDeep(this.state.gData)
			let endInfo = {}
			_.find(data, function(o) {
				if(selKey && o.key === selKey[0]){
					endInfo = o
					return o
				}else{
					if(o.children){
						 let itemJson = _.find(o.children,function(item){
								if(item.key === selKey[0]){
										return item
									}
							})
							endInfo = itemJson
						return itemJson
					}

				}
			});
			return endInfo

		}

		componentWillMount =()=>{
			this.queryOneModuleAjax();//获取初始化的保养模板树结构
		}
		//新增交互逻辑~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		openModal = (ModalName,txt) =>{
			if(ModalName==='quoteVisible'){
				if(this.state.selectedKeys && this.state.selectedKeys.length!==0){
						let b = this.findInfo(this.state.selectedKeys);
						if(!b.parentKey){
							//如果是一级模板 则在此处打开窗口
							this.setState({
								[ModalName]: true,
								modalState:txt
							});
							// this.changeEqoteTable();//填入引用新增表格数据
						}else{
							message.warning('请选择第一级模板进行引用新增！')
						}
				}else{
					message.warning('请选择一个模板进行引用新增！')
				}
			}else{
				this.setState({
					[ModalName]: true,
					modalState:txt
				});
			}
		}
    closeModal = (ModalName) => {
      this.setState({ [ModalName]: false });
		}
		editModal = () =>{
			if(this.state.selectedKeys && this.state.selectedKeys.length!==0){
					//在此处打开窗口
					this.openModal('addVisible','编辑')

			}else{
				message.warning('请选择一个模板进行编辑！')
			}
		}
		deleteTree = () =>{
			if(this.state.selectedKeys){
				//在此处删除
				let info = this.findInfo(this.state.selectedKeys);
				if(info && info.parentKey){
					this.deleteTwoAjax(info)
				}else{
					this.deleteOneAjax(info)
				}
			}else{
				message.warning('请选择一个模板进行删除！')
			}
		}

		//删除项目
		deleteTwoAjax = (info) => {
			let FormData={
				maintainTemplateDetailId:info.key,
			}
			let options = {
				body:querystring.stringify(FormData),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
						setTimeout(() => {
							message.success('删除成功')
							this.refreshTree();//刷新树列表
						}, 1000);
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.deleteTwo,options)
		}

		deleteOneAjax =(info)=>{
			let FormData={
				maintainTemplateId:info.key,
			}
			let options = {
				body:querystring.stringify(FormData),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
						setTimeout(() => {
							message.success('删除成功')
							this.refreshTree();//刷新树列表
						}, 1000);
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.deleteOne,options)
		}

		//新增弹窗提交后的事件
		addModalSubmit = (addModalData,txt) =>{
			if(txt==="新增"){
				this.setState({ loading: true });
				this.insertMaintaintmpAjax(addModalData)
				
			}else if(txt==="编辑"){
				this.setState({ loading: true });
				if(addModalData.parentKey!==''){
					addModalData.maintainTemplateId = addModalData.parentKey
					delete addModalData['parentKey']
				}

				this.editModuleName(addModalData)
			}
		}
		//引用弹窗提交后的事件------------------------------------
		quoteModalSubmit=(ModalData)=>{
			this.setState({ loading: true });
			this.submitQuoteAjax(this.state.selectedKeys,ModalData)
		}

		//提交引用新增内容
		submitQuoteAjax = (parentKey,ModalData)=>{
			
			let FormData={
				maintainTemplateId:parentKey[0],
				maintainTypes:ModalData
			}
			let options = {
				body:JSON.stringify(FormData),
        success: data => {
          if(data.status){
						setTimeout(() => {
							message.success('新增成功')
							this.refreshTree();//刷新树列表
							this.setState({ loading: false, quoteVisible: false });
						}, 1000);
          }else{
						this.setState({ loading: false});
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.addEuoteTmpModal,options)
		}

		//获取一级下拉框以及树状结构第一级内容
		queryOneModuleAjax = (searchValue)=>{
			let options = {
        body:searchValue||'',
        success: data => {
          if(data.status){
						this.formatOneData(data.result)
						this.setState({
							'selectDropData':data.result
						})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.queryOneModule,options)
		}
		//获取二级详情信息
		queryTwoModuleAjax = (selectedKeys)=>{
			let json ={
				maintainTemplateId:selectedKeys[0]||''
			}
			let options = {
				body:querystring.stringify(json),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
						this.formatTwoData(selectedKeys[0],data.result)
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.queryTwoModule,options)
		}

		//新增一级表单内容
		insertMaintaintmpAjax=(FormData)=>{
			let options = {
				body:querystring.stringify(FormData),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
						setTimeout(() => {
							message.success('新增成功')
							this.refreshTree();//刷新树列表
							this.setState({ loading: false, addVisible: false });
						}, 1000);
          }else{
						this.setState({ loading: false});
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.addMaintainTmp,options)
		}
		//编辑模板名称 
		editModuleName =(FormData)=>{
			let options = {
				body:querystring.stringify(FormData),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
						setTimeout(() => {
							message.success('新增成功')
							this.refreshTree();//刷新树列表
							this.setState({ loading: false, addVisible: false });
						}, 1000);
          }else{
						this.setState({ loading: false});
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.editModuleName,options)
		}
		//获取transfer数据
		getTransferAjax = () =>{
			let options = {
				body:querystring.stringify(FormData),
				headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: data => {
          if(data.status){
						this.setState({
							queryEquipmentTmpData:data.result
						})
          }else{
            message.error(data.msg)
          }
        },
        error: err => {console.log(err)}
      }
      request(basicdata.queryEquipmentTmp,options)
			
		}
		//格式化一级树状结构
		formatOneData = (d)=>{
			let formatArray =	d.map((item)=>{
				let o = {
					'title':item.maintainTemplateName,
					'key':item.maintainTemplateId,
				}
				return o 
			})
			this.setState({
				gData:formatArray
			})
		}
		//格式化二级树状结构
		formatTwoData = (parentKey,d)=>{
			let tAarry = [];
			if(d.length!==0){
				for(let i=0;i<d.length;i++){
					let item ={
						key:d[i].templateDetailGuid,
						title:d[i].templateTypeName,
						parentKey:d[i].maintainTemplateId,
					}
					tAarry.push(item)
				}
				const gData = _.cloneDeep(this.state.gData);
				for(let item in gData){
					if(gData[item].key===parentKey){
						gData[item].children = tAarry;
					}
				}
			
				this.setState({
					gData:gData,
					autoExpandParent: false,
				})
			}
		}
		//刷新树结构
		refreshTree = ()=>{
			this.queryOneModuleAjax();
			//重新获取数据
			this.setState({gData:[]})
		}

    render(){

			const {selectDropData,editModalData, searchValue, expandedKeys ,addVisible, quoteVisible , loading ,selectedKeys ,gData ,modalState} = this.state;
			
			const loop = data => data.map((item) => {
					const index = item.title.indexOf(searchValue);
					const beforeStr = item.title.substr(0, index);
					const afterStr = item.title.substr(index + searchValue.length);
					const title = index > -1 ? (
						<span>
							{beforeStr}
							<span style={{ color: '#f50' }}>{searchValue}</span>
							{afterStr}
						</span>
					) : <span>{item.title}</span>;
					if (item.children) {
						return (
							<TreeNode key={item.key} title={title}>
								{loop(item.children)}
							</TreeNode>
						);
					}
					return <TreeNode key={item.key} title={title} />;
			});

			return(
					<Content className='ysynet-content ysynet-common-bgColor' style={{padding:20}}>
						<Row style={{ marginBottom: 8 }}>
								<Col span={12} >
								<Button type="primary" className={styles.marginM} onClick={()=>this.openModal('addVisible','新增')}> 新增</Button>
								<Button type="primary" className={styles.marginM} onClick={()=>this.openModal('quoteVisible')}> 引用新增</Button>
								<Button type="primary" className={styles.marginM} onClick={this.editModal}> 编辑</Button>
								<Button type="danger" className={styles.marginM}  onClick={this.deleteTree}>删除</Button>
								</Col>
						</Row>

						<Row>
							<Col span={3} >
								<Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
								<div className={styles.treeWarp}>
									<Tree
										onExpand={this.onExpand}
										expandedKeys={expandedKeys}
										autoExpandParent={true}
										onSelect={this.onSelect}
									>
										{loop(gData)}
									</Tree>
								</div>
							</Col>
							<Col span={21}>
								<MaintainTmpTransfer selectedKeys={selectedKeys}
								editModalData={editModalData}
								></MaintainTmpTransfer>
							</Col>
						</Row>
						<MaintainTmpModal
							visible={addVisible}
							loading={loading}
							selectDropData={selectDropData}
							selectRow={selectedKeys}
							modalState={modalState}
							data={editModalData}
							handleCancel={()=>this.closeModal('addVisible')}
							callback ={ (addModalData,txt)=>{this.addModalSubmit(addModalData,txt)} }></MaintainTmpModal>

						<MaintainTmpQuoteModal
							visible={quoteVisible}
							loading={loading}
							selectRow={selectedKeys}
							handleCancel={()=>this.closeModal('quoteVisible')}
							callback ={ (ModalData)=>{this.quoteModalSubmit(ModalData)} }>

						</MaintainTmpQuoteModal>


					</Content>
			)
    }
}

export default inventoryCategory;
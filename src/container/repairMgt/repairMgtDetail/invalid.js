/*
 * @Author: yuwei   -  作废信息  维修状态为作废的时候显示
 * @Date: 2018-12-28 14:47:33 
 * @Last Modified by: yuwei
 * @Last Modified time: 2018-12-28 15:00:03
 */

 import React from 'react'; 
 import { Row, Col} from 'antd';
 import styles from '../../ledger/ledgerArchives/style.css';

 class Invalid extends React.Component{

  render(){
    const { BaseInfoInfoData } = this.props;
    return(
      <div style={{padding:'0  0 30px'}}>
        <Row type="flex"  className={styles['table-row']}>
         <Col span={4} className={styles['table-span']}>作废时间</Col>
         <Col span={8} className={styles['table-span']}>{ BaseInfoInfoData.voidTime }</Col>
         <Col span={4} className={styles['table-span']}>作废操作员</Col>
         <Col span={8} className={styles['table-span']}>{ BaseInfoInfoData.voidUserName }</Col>
       </Row>
      </div>
    )
  }
 }
 export default Invalid ;


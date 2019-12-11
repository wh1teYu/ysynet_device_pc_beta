import React from 'react';
import { Button } from 'antd';
import styles from './style.css';

class NotFound extends React.Component {
  render () {
    return (
      <div className={styles['ysynet-notfound']}>
        <div className={styles['ysynet-notfound-content']}>
          <h1>404</h1>
          <div className={styles['desc']}>抱歉，你访问的页面不存在</div>
          <Button type='primary' onClick={() => {
            window.history.go(-1)
          }}>返回上一页</Button>
        </div>
      </div>
    )
  }
}
export default NotFound;
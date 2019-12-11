import React, { PureComponent } from 'react';
import { Card } from 'antd';
import styles from './style.css';
class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.closeDom = 'slider_close'
    this.state = {
      isOpen: false
    }
  }
  componentDidMount() {
    this.setState({isOpen: this.props.isOpen})
    document.querySelector('#root').addEventListener('click', (event) => {
      this.onClose(event);
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({isOpen: nextProps.isOpen})
  }
  onClose = event => {
    const { closeExcludeDom } = this.props;
    console.log(event.target.className)
    if ( (event.target.className || 
      !closeExcludeDom.includes(event.target.className))
    ) {
      this.setState({ isOpen: false })
    }
  }
  render() {
    const { content, className, width } = this.props;
    const { isOpen } = this.state;
    return (
      <div className='ysynet_slider_wrapper'>
        <div 
          id='slider_wrapper'
          className={`${styles.ysynet_slider} ${this.closeDom} ${className}`} 
          style={{width: isOpen ? width || 600 : 0}}
          onClick={e => {
            e.stopPropagation();
            console.log(e, 1111)
          }}
        >
        {
          isOpen ?          
          <Card title='侧滑'>
            详情 ：{  
              content
            }
          </Card> : null
        }
        </div>
        { this.props.children }
      </div>  
    )
  }
}

export default Slider;
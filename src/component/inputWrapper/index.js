import React, { PureComponent } from 'react';
import styles from './style.css';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';
class InputWrapper extends PureComponent {
  static defaultProps = {
    placeholder: '请输入',
    text: '',
    className: '',
    style: ''
  };
  static propTypes = {
    onEndEdit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      inputDisplay: false,
      iconDisplay: false,
      outputText: this.props.text
    }
  }
  onMouseOver = () => {
    this.setState({iconDisplay: true});
  }
  onMouseLeave = () => {
    this.setState({iconDisplay: false});
  }
  beginEdit = () => {
    this.setState({inputDisplay: true})
  }
  onBlur = (e) => {
    const { onEndEdit } = this.props;
    this.setState({inputDisplay: false, outputText: e.target.value})
    if (typeof onEndEdit === 'function') {
      onEndEdit(e.target.value)
    }
  }
  componentDidUpdate() {
    const input = document.querySelector(`#input`);
    if (input) {
      // const len = input.value.length;
        input.focus();
        // input.setSelectionRange(len, len);
    }
  }
  componentWillReceiveProps = nextProps => {
    if (nextProps.text !== this.props.text) {
      this.setState({outputText: nextProps.text})
    }
  }
  render() {
    const { placeholder, className } = this.props;
    const { inputDisplay, iconDisplay, outputText } = this.state;
    return (
      <div 
        className={`${className} ${styles.inputWrapper}`} 
        onMouseOver={this.onMouseOver} 
        onMouseLeave={this.onMouseLeave}
      >
        <span className={styles.inputText}> 
          { 
            inputDisplay ? 
            <Input 
              id='input'
              placeholder={placeholder} 
              onPressEnter={this.onBlur}
              defaultValue={outputText} 
              onBlur={this.onBlur}
            /> : outputText 
          } 
          { 
            iconDisplay && !inputDisplay ? 
            <Icon type="edit" onClick={this.beginEdit} className={styles.inputIcon}/> 
            : null 
          }
        </span>
      </div>
    )
  }
}

export default InputWrapper;
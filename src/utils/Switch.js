import React, { Component } from 'react';
import { Switch as S, Route} from 'react-router-dom';
import NotFound from '../container/common/404';

class Switch extends Component {
  render() {
    const child = [...this.props.children, <Route key={'notfound'} component={NotFound}/>];
    return (
      <S>
        { child }
      </S>  
    )
  }
}
export default Switch;
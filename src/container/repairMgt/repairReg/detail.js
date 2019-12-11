import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import AllDetail from '../repairMgtDetail';
import { operation as operationService } from '../../../service';
/**
 * @file 保修记录详情
 */
class RepairListDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rrpairOrderGuid: '',
    }
  }
  componentWillMount = () =>{
    const rrpairOrderGuid = this.props.match.params.id;
    this.setState( {rrpairOrderGuid :rrpairOrderGuid });
  }

  render() {
    return (
      <AllDetail id={this.state.rrpairOrderGuid} showPrint={'repairRegListDetail'}/>
    )
  }
}


export default withRouter(connect(null, dispatch => ({
  getSelectAssetsRecordDetail: (url,values,success) => operationService.getInfo(url,values,success)
}))(RepairListDetail));
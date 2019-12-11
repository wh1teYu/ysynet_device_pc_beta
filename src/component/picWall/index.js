import React  from 'react';
import { Upload, Icon, Modal } from 'antd';
import assets from '../../api/assets';
class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.fileList || []
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    this.props.file(fileList)
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.fileList !== nextProps.fileList) {
      this.setState({ fileList: nextProps.fileList.map((item)=>{
        if(item.url){
          let suffixArr = item.url.split('.');
          let suffix = suffixArr[suffixArr.length-1];
          if(suffix==="jpg" || suffix==="jpeg"  || suffix==="png" || suffix==="gif" || suffix==="bmp"){
            return item
          }else{
            item.thumbUrl = item.thumbUrl? item.thumbUrl: require('../../assets/fujian.png'); 
            return item
          }
        }else{
            item.thumbUrl = item.thumbUrl? item.thumbUrl: require('../../assets/fujian.png');
            return item
        }
      })})
    }
  }
  judgeIMGorAcc =  (src)=>{
      let arrStr = src.split(".");//split(",")
      let type = arrStr[arrStr.length-1];
      if(type==='jpg'||type==='png'||type==='jpeg'||type==='gif'|| type==="bmp"){
        return src
      }else{
        return ''
      }
  }
  
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    let { isAdd } = this.props;
    if (typeof isAdd === 'undefined') { isAdd = true };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={assets.picUploadUrl}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={ isAdd ? true : {showRemoveIcon:false}}
        >
          { (isAdd && fileList.length < 3) ? uploadButton : null}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} maskClosable={false}
          style={{wordBreak: 'break-all',padding:5}}>
          <img alt="" style={{ width: '100%' }} src={this.judgeIMGorAcc(previewImage)} />
          {this.judgeIMGorAcc(previewImage) ==='' ? `复制地址到地址栏查看附件：\n${previewImage}`:''}
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
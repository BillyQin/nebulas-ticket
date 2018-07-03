import React, { Component } from 'react';
import Routes from './router';
import 'antd-mobile/dist/antd-mobile.css';
import './App.less';

class App extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    // 字体使用 rem, 1rem = 100px;
    const devWidth = document.documentElement.clientWidth
    const size = ((devWidth > 768 ? 375 : devWidth) / 10.8) + 'px'
    document.documentElement.style.fontSize = size
    window.addEventListener('orientationchange', function () {
      document.documentElement.style.fontSize = size
    })
    window.addEventListener('resize', function () {
      document.documentElement.style.fontSize = size
    })
    document.getElementById("root").style.height = '100vh'

    this.getWallectInfo()
  }

  getWallectInfo = () => {
    window.postMessage({
      "target": "contentscript",
      "data": {},
      "method": "getAccount",
    }, "*");
    window.addEventListener('message', function (e) {
      if (e.data && e.data.data) {
        if (e.data.data.account) {//这就是当前钱包中的地址
          let address = e.data.data.account
          localStorage.setItem('address', address)
          // app.updateUserInfo() //小提示：获取钱包地址后，就可以调用对应的方法查询用户信息啦
        }
      }
    });
  }

  render() {
    return (
      <div className="dream-ball-wrap">
        <div className="dream-ball">
          <Routes/>
        </div>
      </div>
    );
  }
}

export default App;

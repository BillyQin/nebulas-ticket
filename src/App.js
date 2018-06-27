import React, { Component } from 'react';
import Routes from './router';

class App extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    // 字体使用 rem, 1rem = 100px;
    const devWidth = document.documentElement.clientWidth
    const size = ((devWidth > 640 ? 640 : devWidth) / 10.8) + 'px'
    document.documentElement.style.fontSize = size
    window.addEventListener('orientationchange', function () {
      document.documentElement.style.fontSize = size
    })
    window.addEventListener('resize', function () {
      document.documentElement.style.fontSize = size
    })
    document.getElementById("root").style.height = '100vh'
  }

  render() {
    return (
      <Routes/>
    );
  }
}

export default App;

import React, { Component } from 'react';
import Header from '../components/header';
import './chipIn.less';

import NebPay from 'nebpay';
const myNebPay = new NebPay();
class Buy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      whiteBall: [],
      blueBall: [],
    }
  }

  submit = () => {
    this.props.history.push('/shop')
  }

  render() {
    return (
      <div className="chipIn">
        <Header extends={
          <img onClick={()=>this.props.history.goBack()} src={require('../assets/images/back.png')} />
        }/>

        <div className="confirm">
          <div>
            <img src={require('../assets/images/ticket.png')} />
          </div>
          <button disabled={this.state.whiteBall.length !== 6 || this.state.blueBall.length !== 1}
          className="btn" onClick={()=>{this.submit()}}>
            确认
          </button>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
}

export default Buy

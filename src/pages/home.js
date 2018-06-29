import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import './home.less';
import { randomNum } from '../utils/util';
import { myNebPay, myNeb, options, contactAddr } from '../utils/neb'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballLists: [],
      num: 5,
      balance: 0
    }
  }

  componentWillMount () {
    this.getRandomNum()
    this.getContactValue()
  }

  getRandomNum = () => {
    let ballLists = []
    ballLists = ballLists.concat(randomNum())
    this.setState({ballLists})
  }

  getContactValue = () => {
    myNeb.api.getAccountState(contactAddr).then(res => {
      this.setState({balance: res.balance/Math.pow(10,18)})
    }).catch((err) => {
      console.log(err);
    });
  }

  submit = () => {
    const totalPrice = this.state.num * 0.1
    const txHash = myNebPay.call(contactAddr, totalPrice, 'buyTicket', JSON.stringify([this.state.ballLists]), options)
    console.log(txHash)
  }

  render() {
    return (
      <div className="home">
        <Header />
        <div className="banner">
          <h1>全球梦想球彩票</h1>
          <p className="sub">LOREM IPSUM</p>
          {/* <p className="intro">Lorem ipsum dolor sit amet.</p>
          <p className="intro">c,nsectetur adposcing elit.</p>
          <p className="intro">Sed vestibulum mi nec nist.</p> */}
        </div>
        <main>
          <div className="lists">
            <div className="price">
              <p>奖池</p>
              <span>{this.state.balance}NAS</span>
            </div>
            <div className="count-down-box">
              <span>距离下期开奖</span>
              <p>12:14:12</p>
            </div>
            {
              this.state.ballLists.length &&
              this.state.ballLists.map((item,key) => (
                <div className="list-item" key={key}>
                  {item.white.map((item,key)=>(
                    <div className={`ball`} key={key}>{item}</div>
                  ))}
                  <div className={`ball blue`}>{item.blue[0]}</div>
                </div>
              ))
            }
            <div className="btn-group">
              <img src={require('../assets/images/xx.png')} />
              <input type="number" onChange={(e) => {this.setState({num: e.target.value})}} defaultValue={this.state.num} />
              <div onClick={()=>this.submit()} className="base-btn">快速投注</div>
            </div>
          </div>
        </main>
        <Footer pathName='/'/>
      </div>
    )
  }
}

export default Home

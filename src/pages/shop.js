import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import './shop.less';
import { myNebPay, options, contactAddr } from '../utils/neb'

class Buy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballLists: []
    }
  }

  randomBall = (type='whiteBall') => {
    let digit = type === 'whiteBall' ? 6 : 1
    let total = type === 'whiteBall' ? 28 : 14
    let result = []
    while(result.length < digit) {
      var rand = parseInt((Math.random()*total)+1);
      rand = rand<10 ? `0${rand}`: rand.toString()
      if (result.indexOf(rand) < 0) {
        result.push(rand)
      }
    }
    return result
  }

  randomNum = () => {
    let ballLists = this.state.ballLists
    const white = this.randomBall('whiteBall')
    const blue = this.randomBall('blueBall')
    ballLists.push({"white": white, "blue": blue, "num": 5})
    this.setState({ballLists})
  }

  removeLists = (key) => {
    let ballLists = this.state.ballLists
    ballLists.splice(key, 1)
    this.setState({ballLists})
  }

  submit = () => {
    let totalPrice = 0
    this.state.ballLists.map((item) => {
      totalPrice += (item.num * 0.1)
    })
    let params = []
    this.state.ballLists.map(item => {
      params.push(JSON.stringify(item))
    })

    let txHash = myNebPay.call(contactAddr, totalPrice, 'buyTicket', JSON.stringify([this.state.ballLists]), options)

    console.log(txHash)
  }

  render() {
    return (
      <div className="shop">
        <Header />
        <div className="shop-in-title">
          <p>头奖: 100nas</p>
          <p>距离下期开奖还有：xx-xx-xx</p>
        </div>
        <div className="nums">
          <div className="lists">
          {
            this.state.ballLists.length &&
            this.state.ballLists.map((item,key) => (
              <div className="list-item" key={key}>
                {item.white.map((item,key)=>(
                  <div className={`ball`} key={key}>{item}</div>
                ))}
                <div className={`ball blue`}>{item.blue[0]}</div>
                <input type="number" defaultValue={item.num} />
                <img onClick={()=>this.removeLists(key)} src={require('../assets/images/xx.png')} />
              </div>
            ))
          }
          </div>
          <div className="btn-box">
            <div className="btn"><Link to="/chipIn">选号</Link></div>
            <div onClick={()=>this.randomNum()} className="btn">快速选号</div>
          </div>
        </div>
        <div className="confirm">
          <div>
            <img src={require('../assets/images/ticket.png')} />
          </div>
          <div className="btn" onClick={()=>{this.submit()}}>购买</div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
}

export default Buy

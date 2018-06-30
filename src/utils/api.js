'use strict';
// ticket info
var userTicketInfo = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.white = obj.white; // white ball
    this.blue = obj.blue;   // blue ball
    this.num = obj.num;    // num
    this.term = obj.term;    // term
    this.level = obj.level  // level
  } else {
    this.white = []; // white ball
    this.blue = 0;   // blue ball
    this.num = new BigNumber(0);    // num
    this.term = 0;    // term
    this.level = null  // level
  }
};

userTicketInfo.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

// history result
var historyInfo = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.white = obj.white; // white ball
    this.blue = obj.blue;   // blue ball
    this.term = obj.term;   // term
  } else {
    this.white = [];
    this.blue = [];
    this.term = 1;
  }
};

historyInfo.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var LotteryTicketContract = function () {
  LocalContractStorage.defineProperty(this, "adminAddress");
  LocalContractStorage.defineProperty(this, "minAmount");
  LocalContractStorage.defineProperty(this, "term");
  LocalContractStorage.defineProperty(this, "whiteNum");
  LocalContractStorage.defineProperty(this, "blueNum");
  LocalContractStorage.defineProperty(this, "time");

  LocalContractStorage.defineProperty(this, "contractBalance", {
    stringify: function (obj) {
      return obj.toString();
    },
    parse: function (str) {
      return new BigNumber(str);
    }
  });

  // Grand Prize
  LocalContractStorage.defineProperty(this, "grandPrize", {
    stringify: function (obj) {
      return obj.toString();
    },
    parse: function (str) {
      return new BigNumber(str);
    }
  });

  // (addr => term)
  LocalContractStorage.defineMapProperty(this, "userMoneyTermMap", {
    parse: function (str) {
      return JSON.parse(str)
    },
    stringify: function (o) {
      return JSON.stringify(o)
    }
  });

  LocalContractStorage.defineMapProperty(this, "userTicket", {
    parse: function (str) {
      return new userTicketInfo(str);
    },
    stringify: function (o) {
      return o.toString();
    }
  });

  // (addr+term) => [ticket1,ticket2]
  LocalContractStorage.defineMapProperty(this, "ticketHistoryMap", {
    parse: function (str) {
      return JSON.parse(str)
    },
    stringify: function (obj) {
      return JSON.stringify(obj)
    }
  });

  // (term) => [addr]
  LocalContractStorage.defineMapProperty(this, "ticketHistoryRecordMap", {
    parse: function (str) {
      return JSON.parse(str)
    },
    stringify: function (obj) {
      return JSON.stringify(obj)
    }
  });

  LocalContractStorage.defineMapProperty(this, "historyResult", {
    parse: function (str) {
      return new historyInfo(str);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

// save value to contract, only after height of block, users can takeout
LotteryTicketContract.prototype = {
  init: function () {
    //TODO:
    this.minAmount = 0.1;
    this.adminAddress = 'n1XSq26wvLaZ2tqYC5Y37MPr9ujQsSsSLBr';
    this.whiteNum = 6;
    this.time = new Date().getTime();
    this.timeInterval = 0;
    this.term = 1;
    this.contractBalance = new BigNumber(0);
    this.grandPrize = new BigNumber(0);
  },

  getTime: function () {
    return this.time
  },

  // user buy ticket
  buyTicket: function (tickets) {
    if (!tickets) {
      throw new Error("Bet failed.");
    }
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;

    if (value.cmp(new BigNumber(this.minAmount)) < 0) {
      throw new Error(`the minimum is ${this.minAmount} Nas`);
    }
    let key = `${from}|${this.term}`
    var userTickets = this.ticketHistoryMap.get(key)
    if (userTickets === null) {
      userTickets = []
    }
    let totalNum = 0
    tickets.map(item => {
      var whiteBall = item.white;
      var blueBall = item.blue;
      var num = item.num;
      totalNum += parseFloat(num)
      if (whiteBall.length !== this.whiteNum) {
        throw new Error("please input correct number.");
      }
      for(var i =0;i < whiteBall.length; i++){
    　　if(whiteBall.indexOf(whiteBall[i]) !== whiteBall.lastIndexOf(whiteBall[i])){
      　　throw new Error("repeat numbers，please input correct number.");
    　　}
      }

      var ticket = new userTicketInfo();
      ticket.white = whiteBall
      ticket.blue = blueBall
      ticket.term = this.term
      ticket.num = num
      userTickets.push(ticket)
    })
    if (totalNum > value.div(new BigNumber('1e18')).div(new BigNumber(this.minAmount)).toString()) {
      throw new Error("failed, please send correct nas");
    }
    let termHistory = this.ticketHistoryRecordMap.get(this.term) || []
    if (!termHistory.includes(`${from}|${this.term}`)) {
      termHistory.push(`${from}|${this.term}`)
      this.ticketHistoryRecordMap.set(this.term, termHistory)
    }

    this.ticketHistoryMap.set(key, userTickets)
    this.contractBalance = this.contractBalance.plus(value)
  },

  // user receive a prize
  userTakeOut: function () {
    var from = Blockchain.transaction.from;
    let term = this.userMoneyTermMap.get(from) || 0

    for(let i = this.term-1; i >= term; i--) {
      let key = `${from}|${term}`
      let info = this.ticketHistoryMap.get(key) || []

      if (info.length) {
        info.map(item => {
          if (item.level !== 0 && item.level !== 7) {
            let value = 0
            switch(item.level) {
              case 6: value = new BigNumber('0.2');break;
              case 5: value = new BigNumber('0.5');break;
              case 4: value = new BigNumber('5');break;
              case 3: value = new BigNumber('100');break;
              case 2: value = new BigNumber('1500');break;
              case 1: value = this.grandPrize;break;
              default: value = new BigNumber('0');break;
            }
            if (value.toString() !== '0') {
              let result = Blockchain.transfer(from, value.mul(new BigNumber('1e18')));
              if (!result) {
                throw new Error("tranfer failed.");
              }
              this.contractBalance = this.contractBalance.minus(value)
              item.level = 7
            }
          }
        })
      }
      this.ticketHistoryMap.set(key, info)
    }
    term = this.term
    this.userMoneyTermMap.set(from, term)
  },

  // query ticket
  getTicketInfo: function (term) {
    var from = Blockchain.transaction.from;
    if (term) {
      let key = `${from}|${term}`
      return this.ticketHistoryMap.get(key) || [];
    } else {
      let res = []
      for (let i = this.term; i>=(this.term-50); i--) {
        if (i === 0) {
          break
        }
        let key = `${from}|${i}`
        if (this.ticketHistoryMap.get(key)) {
          res = res.concat(this.ticketHistoryMap.get(key))
        }
      }
      return res
    }
  },

  takeOut: function (value) {
    this._verifyAdmin();
    if (!value) {
      value = 0
    }
    var from = Blockchain.transaction.from;
    var result = Blockchain.transfer(from, new BigNumber(value).mul(new BigNumber('1e18')));
    if (!result) {
      throw new Error("transfer failed.");
    }
  },

  _getResult: function (total, digit) {
    var result = []
    while(result.length < digit) {
      var rand = parseInt((Math.random()*total)+1);
      rand = rand<10?`0${rand}`:`${rand}`
      if (result.indexOf(rand) < 0) {
        result.push(rand)
      }
    }
    return result.sort((a,b) => {return a-b});
  },

  // calculate level
  _getLevelPrice: function (user, answer) {
    let whiteNum = 0
    let blueNum = 0
    for(let i = 0; i<this.whiteNum; i++) {
      let ball = user.white[i]
      if (answer.white.includes(ball) && answer.white.indexOf(ball) === answer.white.lastIndexOf(ball)) {
        whiteNum += 1
      }
    }
    if (user.blue[0] === answer.blue[0]) {
      blueNum += 1
    }

    if (blueNum === 0) {
      switch (whiteNum) {
        case 4: return 5;
        case 5: return 4;
        case 6: return 2;
        default: return 0;
      }
    } else if (blueNum === 1) {
      switch (whiteNum) {
        case 0:
        case 1:
        case 2: return 6;
        case 3: return 5;
        case 4: return 4;
        case 5: return 3;
        case 6: return 1;
        default: return 0;
      }
    }
  },

  // set time interval(ms)
  setTime: function(time) {
    this._verifyAdmin();
    this.timeInterval = parseInt(time)
    return this.timeInterval;
  },

  openLottery: function () {
    this._verifyAdmin();
    if (this.time > new Date().getTime()) {
      throw new Error("is not time");
    }
    var whileBall = this._getResult(28, 6);
    var blueBall = this._getResult(14, 1);
    var history = new historyInfo()
    history.white = whileBall
    history.blue = blueBall
    history.term = this.term
    this.historyResult.put(this.term, history);

    let total = this.ticketHistoryRecordMap.get(this.term) || []
    total.length && total.map(item => {
      let userTicket = this.ticketHistoryMap.get(item) || []
      userTicket.length && userTicket.map(i => {
        let level = this._getLevelPrice(history, i)
        i.level =level
      })
      this.ticketHistoryMap.set(item, userTicket)
    })

    this.term += 1;
    this.time = new Date().getTime() + this.timeInterval;
    this.grandPrize = this.contractBalance.mul(new BigNumber('0.38'))
  },

  // query result
  getLottery: function (num) {
    let result = []
    const term = this.term-1
    let index = num ? num : term
    for (let i = term; i > parseInt(term-index); i--) {
      result.push(this.historyResult.get(i))
    }
    return result
  },

  // query term
  getTerm: function () {
    return this.term
  },

  changeAdmin: function (address) {
    this._verifyAdmin()
    if (Blockchain.verifyAddress(address) === 87) {
      this.adminAddress = address
      return
    }
    throw new Error("this is not a user address.");
  },

  _verifyAdmin: function() {
    if (Blockchain.transaction.from != this.adminAddress) {
      throw new Error("is not admin");
    }
  }
};
module.exports = LotteryTicketContract;
'use strict';
// 下注信息
var userTicketInfo = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.white = obj.white; // 白球
    this.blue = obj.blue;   // 蓝球
    this.num = obj.num;    // 下注数量
    this.term = obj.term;    // 下注期
    this.level = obj.level
  } else {
    this.white = []; // 白球
    this.blue = 0;   // 蓝球
    this.num = new BigNumber(0);    // 下注数量
    this.term = 0;    // 下注期
    this.level = null
  }
};

userTicketInfo.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

// 历史开奖结果
var historyInfo = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.white = obj.white; // 白球
    this.blue = obj.blue;   // 蓝球
    this.term = obj.term;   // 开奖期数
  } else {
    this.white = []; // 白球
    this.blue = [];   // 蓝球
    this.term = 1;   // 开奖期数
  }
};

historyInfo.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var LotteryTicketContract = function () {
  LocalContractStorage.defineProperty(this, "adminAddress"); //管理员账户地址
  LocalContractStorage.defineProperty(this, "minAmount"); //最小投注额
  LocalContractStorage.defineProperty(this, "term"); //开奖期数
  LocalContractStorage.defineProperty(this, "whiteNum"); // 白球个数
  LocalContractStorage.defineProperty(this, "blueNum"); // 蓝球个数

  // 用户下注详情
  LocalContractStorage.defineMapProperty(this, "userTicket", {
    parse: function (str) {
      return new userTicketInfo(str);
    },
    stringify: function (o) {
      return o.toString();
    }
  });

  // 用户下注记录 (addr+term) => [ticket1,ticket2]
  LocalContractStorage.defineMapProperty(this, "ticketHistoryMap", {
    parse: function (str) {
      return JSON.parse(str)
    },
    stringify: function (obj) {
      return JSON.stringify(obj)
    }
  });

  // 历史投注记录 (term) => [addr]
  LocalContractStorage.defineMapProperty(this, "ticketHistoryRecordMap", {
    parse: function (str) {
      return JSON.parse(str)
    },
    stringify: function (obj) {
      return JSON.stringify(obj)
    }
  });

  // 历史开奖记录
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
    this.term = 1;
  },

  // 下注
  buyTicket: function (tickets) {
    console.log(tickets)
    if (!tickets) {
      throw new Error("投注失败");
    }
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;

    if (value.cmp(new BigNumber(this.minAmount)) < 0) {
      throw new Error(`最小投注额${this.minAmount}Nas`);
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
        throw new Error("请投注正确的号码");
      }
      for(var i =0;i < whiteBall.length; i++){
    　　if(whiteBall.indexOf(whiteBall[i]) !== whiteBall.lastIndexOf(whiteBall[i])){
          console.log(whiteBall[i])
      　　throw new Error("号码重复，请投注正确的号码");
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
      throw new Error("投注失败，请投注正确的金额");
    }
    let termHistory = this.ticketHistoryRecordMap.get(this.term) || []
    if (!termHistory.includes(`${from}|${this.term}`)) {
      termHistory.push(`${from}|${this.term}`)
      this.ticketHistoryRecordMap.set(this.term, termHistory)
    }

    this.ticketHistoryMap.set(key, userTickets)
  },

  // 用户兑奖
  takeout: function (term) {
    // var from = Blockchain.transaction.from;
    var result = this.getLottery(term);

    var userResult = this.getTicketInfo()
    return [result, userResult]
  },

  // 查询下注信息
  getTicketInfo: function (term) {
    var from = Blockchain.transaction.from;
    if (term) {
      let key = `${from}|${term}`
      return this.ticketHistoryMap.get(key) || [];
    } else {
      let res = []
      for (let i = 1; i<=this.term; i++) {
        let key = `${from}|${i}`
        if (this.ticketHistoryMap.get(key)) {
          res = res.concat(this.ticketHistoryMap.get(key))
        }
      }
      return res
    }
  },

  // 取钱
  takeOut: function () {
    // var amount = this.userTicket.get(from);
    var from = Blockchain.transaction.from;
    var result = Blockchain.transfer(from, this.minAmount);
    if (!result) {
      throw new Error("transfer failed.");
    }
  },

  // 获取结果
  _getResult: function (total, digit) {
    var result = []
    while(result.length < digit) {
      var rand = parseInt((Math.random()*total)+1);
      if (result.indexOf(rand) < 0) {
        result.push(rand<10?`0${rand}`:`${rand}`)
      }
    }
    return result.sort((a,b) => {return a-b});
  },

  // 获奖计算
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
        case 0,1,2: return 6;
        case 3: return 5;
        case 4: return 4;
        case 5: return 3;
        case 6: return 1;
        default: return 0;
      }
    }
  },

  // 开奖
  openLottery: function () {
    this._verifyAdmin();
    var whileBall = this._getResult(28, 6);
    var blueBall = this._getResult(14, 1);
    var history = new historyInfo()
    history.white = whileBall
    history.blue = blueBall
    history.term = this.term
    this.historyResult.put(this.term, history);

    let total = this.ticketHistoryRecordMap.get(this.term)
    total.map(item => {
      let userTicket = this.ticketHistoryMap.get(item)
      userTicket.map(i => {
        let level = this._getLevelPrice(history, i)
        console.log('level', level)
        i.level =level
      })
      this.ticketHistoryMap.set(item, userTicket)
    })

    this.term += 1;
  },

  // 查询开奖结果
  getLottery: function (num) {
    let result = []
    const term = this.term-1
    let index = num ? num : term
    for (let i = term; i > parseInt(term-index); i--) {
      result.push(this.historyResult.get(i))
    }
    return result
  },
  // 查询当前期数
  getTerm: function () {
    return this.term
  },

  _verifyAdmin: function() {
    if (Blockchain.transaction.from != this.adminAddress) {
        throw new Error("权限验证失败");
    }
  }
};
module.exports = LotteryTicketContract;
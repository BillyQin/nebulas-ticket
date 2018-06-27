'use strict';
// 下注信息
var userTicketInfo = function (text) {
  if (text) {
    var obj = JSON.parse(text);
    this.white = obj.white; // 白球
    this.blue = obj.blue;   // 蓝球
    this.num = obj.num;    // 下注数量
    this.term = obj.term;    // 下注期
  } else {
    this.white = []; // 白球
    this.blue = 0;   // 蓝球
    this.num = new BigNumber(0);    // 下注数量
    this.term = 0;    // 下注期
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
  } else {
    this.white = []; // 白球
    this.blue = 0;   // 蓝球
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

  // 用户下注记录
  LocalContractStorage.defineMapProperty(this, "ticketHistoryMap", {
    parse: function (str) {
      console.log(str)
      return str ? JSON.parse(str) : []
    },
    stringify: function (obj) {
      console.log(obj)
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
    console.log(tickets)
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
    console.log(this.historyResult.get(from))
    if (term) {
      let key = `${from}|${term}`
      return this.ticketHistoryMap.get(key);
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
        result.push(rand)
      }
    }
    return result.sort((a,b) => {return a-b});
  },

  // 开奖
  openLottery: function () {
    this._verifyAdmin();
    var whileBall = this._getResult(28, 6);
    var blueBall = this._getResult(14, 1);
    var history = new historyInfo()
    history.white = whileBall
    history.blue = blueBall
    this.historyResult.put(this.term, history);
    this.term += 1;
  },

  // 查询某期开奖结果
  getLottery: function (index) {
    if (index) {
      if (index >= this.term) {
        throw new Error("未开奖");
      }
      return this.historyResult.get(index);
    }
    return this.historyResult.get(this.term-1);
  },

  _verifyAdmin: function() {
    if (Blockchain.transaction.from != this.adminAddress) {
        throw new Error("权限验证失败");
    }
  }
};
module.exports = LotteryTicketContract;
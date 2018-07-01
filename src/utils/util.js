const randomBall = (type='whiteBall') => {
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
  return result.sort((a,b)=>{return (a-b)})
}

const randomNum = () => {
  let ballLists = []
  const white = randomBall('whiteBall')
  const blue = randomBall('blueBall')
  ballLists.push({"white": white, "blue": blue, "num": 1})
  return ballLists
}

const formatTime = (value) => {
  if (typeof value === 'string') {
    value = parseInt(value)
  }
  return value < 10 ? `0${value}`: `${value}`
}

const countDownTime = (time) => {
  var resTime = new Date(time).getTime() - new Date().getTime();   //时间差的毫秒数
  if (resTime <= 0) {
    return `00:00:00`
  }
  //计算出相差天数
  const days = Math.floor(resTime / (24*3600*1000))

  //计算出小时数
  const leave1= resTime % (24*3600*1000)    //计算天数后剩余的毫秒数
  const hours=Math.floor(leave1/(3600*1000))

  //计算相差分钟数
  const leave2= resTime % (3600*1000)        //计算小时数后剩余的毫秒数
  const minutes=Math.floor(leave2/(60*1000))

  return `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}`
}

const transTime = (time) => {
  const monthLists = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dayLists = ['Sun', 'Mon', 'Tues','Wed','Thur','Fri','Sat']

  let month = new Date(time).getMonth()
  let date = new Date(time).getDate()
  let day = new Date(time).getDay()

  return `${dayLists[day]},${monthLists[month]} ${date}`
}

export {
  randomNum,
  countDownTime,
  transTime
}
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
  return result
}

const randomNum = () => {
  let ballLists = [] // this.state.ballLists
  const white = randomBall('whiteBall')
  const blue = randomBall('blueBall')
  ballLists.push({"white": white, "blue": blue, "num": 5})
  // this.setState({ballLists})
  return ballLists
}

export {
  randomNum
}
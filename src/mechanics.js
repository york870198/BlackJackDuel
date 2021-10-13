export function deckInit() {
  const suits = ['spade', 'club', 'heart', 'diamond']
  const numbers = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
  let result = []
  let id = 1
  suits.forEach((suit)=>{
    numbers.forEach((number)=>{
      let card = {
        id,
        suit,
        number,
        isOpen: true,
        isVisible: true
      }
      result.push(card)
      id++
    })
  })
  return result
}

export function shuffle(cards = []) {
  let deck = [...cards]
  let result = []
  while(deck.length){
    let draw = deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
    result.push(draw)
  }
  return result
}

export function compare(cardA, cardB){
  const numbers = ['2','3','4','5','6','7','8','9','10','J','Q','K', 'A']
  const valueA = numbers.indexOf(cardA.number)
  const valueB = numbers.indexOf(cardB.number)
  const value = (valueA - valueB)
  if(value === 0) return 'tie'
  if(value > 0) return 'greater'
  if(value < 0) return 'lesser'
}

export function getInitialPlayer(playerHandState, opponentHandState, setStateFunc, setInfoLog) {
  const result = compare(playerHandState[1], opponentHandState[1])
  if(result === 'greater') {
    setInfoLog(state=>[...state, '對手先攻'])
    setStateFunc('opponent')
  } else {
    setInfoLog(state=>[...state, '玩家先攻'])
    setStateFunc('player')
  }
}

export function renderSuitMark(suitString) {
  const suitMark = {
    spade:'♠',
    club:'♣',
    diamond:'♦',
    heart:'♥'
  }
  return suitMark[suitString]
}

export function drawFromDeckTop(state, setStateFunc) {
  let card = [...state][0]
  setStateFunc(state => [...state].slice(1))
  return card
}

export function addCardToHand(state, setStateFunc, card) {
  setStateFunc(state=> [...state, card])
}

export function dropAllCardFromHand(setStateFunc) {
  setStateFunc([])
}

function parseCardPoint(card) {
  switch(card.number){
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      return [parseInt(card.number), parseInt(card.number)]
      break
    case '10':
    case 'J':
    case 'Q':
    case 'K':
      return [10,10]
      break
    case 'A':
      return [11,1]
    default:
      return [0]
  }
}

export function checkSum(handState, onlyCheckOpen=true) {
  let cardPoints = [];
  handState.forEach((card)=>{
    if(onlyCheckOpen && !card.isOpen) return
    if(card.number === 'A'){
      cardPoints.push(parseCardPoint(card))
    } else {
      cardPoints.unshift(parseCardPoint(card))
    }
  })
  let result = 0;
  cardPoints.forEach((point) => {
    if((result + point[0]) <=21) {
      result += point[0]
    } else {
      result += point[1]
    }
  })
  return result
}

export function openHand(playerHandState, setPlayerHandFunc, opponentHandState, setOpponentHandFunc, setPhase, setInfoLog) {
  let newPlayerHand = []
  playerHandState.forEach((card)=>{
    let newCard = {...card}
    newCard.isOpen = true
    newCard.isVisible = true
    newPlayerHand.push(newCard)
  })
  let newOpponentHand = []
  opponentHandState.forEach((card)=>{
    let newCard = {...card}
    newCard.isOpen = true
    newCard.isVisible = true
    newOpponentHand.push(newCard)
  })
  setPlayerHandFunc(newPlayerHand)
  setOpponentHandFunc(newOpponentHand)
  setInfoLog(state => [...state, `玩家的點數：${checkSum(newPlayerHand)}，對手的點數：${checkSum(newOpponentHand)}`])
  setPhase('roundOver')
}

export function actionResult(currentPlayer, setCurrentPlayer, playerHandState, opponentHandState, setPhase) {
  let playerPoint = checkSum(playerHandState)
  let opponentPoint = checkSum(opponentHandState)
  setCurrentPlayer((currentPlayer === 'opponent')? 'player' : 'opponent')
}
import React, { useState, useEffect, useCallback, useRef } from 'react'
import styles from 'styled-components'
import {
  MainBoardDiv,
  HandDiv,
  CardDiv,
  StateBoardDiv,
  CommandPanelDiv,
  InfoLogDiv,
  DeckDiv,
  ButtonDiv
} from './styledComponents'
import {
  deckInit,
  renderSuitMark,
  drawFromDeckTop,
  addCardToHand,
  shuffle,
  compare,
  getInitialPlayer,
  checkSum,
  openHand,
  actionResult,
  dropAllCardFromHand
} from './mechanics'

function StateBoardBlock({ children }) {
  return(
    <StateBoardDiv>
      {children}
    </StateBoardDiv>
  )
}

function Card({ card }) {
  return(
    <CardDiv isOpen={card.isOpen} suit={card.suit}>
      <div>{card.isVisible? renderSuitMark(card.suit) : '？'}</div>
      <div>{card.isVisible? card.number : '？'}</div>
    </CardDiv>
  )
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

function MainGame() {
  const [currentPlayer, setCurrentPlayer] = useState('')
  const [phase, setPhase] = useState('')
  const [deck, setDeck] = useState(...[shuffle([...deckInit()])])
  const [playerHand, setPlayerHand] = useState([])
  const [opponentHand, setOpponentHand] = useState([])
  const [points, setPoints] = useState({player: 0, opponent: 0})
  const [infoLog, setInfoLog] = useState(['遊戲開始'])

  useEffect(()=>{
    // phase change handler
    //console.log(`${currentPlayer} turn ${phase} phase start`)
    switch(phase){
      case 'initDraw1' :
        draw('player', false, true)
        setCurrentPlayer(phase)
        break
      case 'initDraw2' :
        draw('opponent', false, false)
        setCurrentPlayer(phase)
        break
      case 'initDraw3' :
        draw('player', true, true)
        setCurrentPlayer(phase)
        break
      case 'initDraw4' :
        draw('opponent', true, true)
        setCurrentPlayer(phase)
        break
      case 'checkInitialPlayer' :
        getInitialPlayer(playerHand, opponentHand, setCurrentPlayer, setInfoLog)
        break
      case 'action' :
        if(currentPlayer === 'opponent') {
          setTimeout(()=>{opponentBehavior(opponentHand, playerHand)}, (Math.floor(Math.random() * 1000)+500))
        }
        break
      case 'actionResult' :
        actionResult(currentPlayer, setCurrentPlayer, playerHand, opponentHand, setPhase)
        break
      case 'roundOver' : 
        if(currentPlayer !== 'over'){
          let winnerStr = ''
          if(points.player>21){
            winnerStr = '對手獲勝'
          } else if(points.opponent>21){
            winnerStr = '玩家獲勝'
          } else if(points.player === points.opponent){
            winnerStr = '不分勝負'
          } else {
            winnerStr = (points.player > points.opponent)? '玩家獲勝' : '對手獲勝'
          }
          setInfoLog(state=>[...state, winnerStr])
        }
        setCurrentPlayer('over')
        break
      case 'nextRound' :
        dropAllCardFromHand(setPlayerHand);
        dropAllCardFromHand(setOpponentHand);
        setCurrentPlayer('')
      default :
    }
  }, [phase])

  useEffect(()=>{
    //console.log(`${phase} phase over, change to ${currentPlayer} turn`)
    switch(phase){
      case '' :
        setPhase('initDraw1')
        break
      case 'initDraw1' :
        setPhase('initDraw2')
        break
      case 'initDraw2' :
        setPhase('initDraw3')
        break
      case 'initDraw3' :
        setPhase('initDraw4')
        break
      case 'initDraw4' :
        setPhase('checkInitialPlayer')
        break
      case 'checkInitialPlayer' :
        setPhase('action')
        break
      case 'action' :
        break
      case 'actionResult' :
        setPhase('action')
        break
      case 'nextRound' :
        setInfoLog(state=>[...state, `開始新的一輪`])
        setPhase('initDraw1')
      default :
    }
  },[currentPlayer])

  useEffect(()=>{
    if(phase==='roundOver') return
    setPoints({
      player:(checkSum(playerHand,false)),
      opponent:(checkSum(opponentHand, false))
    })
  }, [playerHand, opponentHand])

  useEffect(()=>{
    if(points.player > 21 || points.opponent > 21){
      let burstStr = (points.player > 21)? '玩家' : '對手'
      setInfoLog(state=>[...state, `${burstStr}的點數爆了`])
      openHand(playerHand, setPlayerHand, opponentHand, setOpponentHand, setPhase, setInfoLog)
    }
  },[points])

  useEffect(()=>{
    if(deck.length<=0){
      setInfoLog(state=>[...state, `牌堆用盡，用一副新牌重洗`])
      setDeck(...[shuffle([...deckInit()])]);
    }
  },[deck])

  useEffect(()=>{
    if(infoLog.length > 30){
      setInfoLog(state=>state.slice(10))
    }
  },[infoLog])

  function initDraw() {
    setPhase('initDraw1')
  }

  function draw(drawer, opened = true, visibility = true) {
    setInfoLog(state => {
      let drawerName = (drawer === 'player')? '玩家' : '對手'
      let isCardOpenStr = opened? '' : '蓋'
      return [...state, `${drawerName}抽一張${isCardOpenStr}牌`]
    })
    const cardDrawn = drawFromDeckTop(deck, setDeck)
    cardDrawn.isOpen = opened
    cardDrawn.isVisible = visibility
    if(drawer === 'player') {
      addCardToHand(playerHand, setPlayerHand, cardDrawn)
    } else {
      addCardToHand(opponentHand, setOpponentHand, cardDrawn)
    }
    if(currentPlayer === 'player' || currentPlayer === 'opponent') {
      setPhase('actionResult')
    }
  }

  function opponentBehavior() {
    let playerPointPredict = checkSum(playerHand)
    let decision = 'draw'
    if(points.opponent >= 18){
      decision = 'open'
    } else {
      //計算牌況差距
      if(points.opponent - playerPointPredict > 8) {
        if(Math.floor(Math.random() * points.opponent) > 8){
          decision = 'open'
        }
      }
      if(points.opponent >= 14) {
        if(Math.floor(Math.random() * points.opponent) > 12){
          decision = 'open'
        }
      }
    }
    if(decision === 'draw'){
      draw('opponent', true, true)
    } else {
      setInfoLog(state=>[...state, `對手選擇開牌`])
      openHand(playerHand, setPlayerHand, opponentHand, setOpponentHand, setPhase, setInfoLog)
    }
  }

  return (
    <MainBoardDiv>
      <HandDiv color={'purple'}>
        {opponentHand.map((card)=>(<Card card={card} key={card.id}/>))}
      </HandDiv>
      <StateBoardBlock>
        <InfoLogDiv>
          {infoLog.map((log, index)=>(<p className='hideScroll' key={'log' + index.toString()}>{log}</p>))}
          <AlwaysScrollToBottom/>
        </InfoLogDiv>
        <div>
            <DeckDiv number={deck.length}>
              <div>
                <div>剩餘</div>
                <div>{deck.length}</div>
                <div>張牌</div>
              </div>
            </DeckDiv>
          </div>
        <CommandPanelDiv>
          {(phase === 'roundOver') && <div>
            <ButtonDiv onClick={()=>{setPhase('nextRound')}}>下一輪</ButtonDiv>
          </div>}
          {(currentPlayer === 'player' && phase === 'action') && <div>
            <ButtonDiv onClick={()=>{
              setInfoLog(state=>[...state, `玩家選擇開牌`])
              openHand(playerHand, setPlayerHand, opponentHand, setOpponentHand, setPhase, setInfoLog)
            }}>開牌</ButtonDiv>
          </div>}
          {(currentPlayer === 'player' && phase === 'action') && <div>
            <ButtonDiv onClick={()=>{draw(currentPlayer)}}>抽牌</ButtonDiv>
          </div>}
        </CommandPanelDiv>
      </StateBoardBlock>
      <HandDiv>
        {playerHand.map((card)=>(<Card card={card} key={card.id}/>))}
      </HandDiv>
    </MainBoardDiv>
  )
}

function App() {
  return (
    <MainGame/>
  )
}

export default App
import styles from 'styled-components'

export const MainBoardDiv = styles.div`
  height: 98vh;
  width: 98vw;
  margin: 1vh 1vw;
  padding:20px;
  background: rgba(220, 220, 220, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`

export const HandDiv = styles.div`
  border: 2px solid ${props=>(props.color || 'blue')};
  width: 1000px;
  height: 200px;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left:10px;
  border-radius: 15px;
`

export const CardDiv = styles.div`
  border: 2px solid black;
  height: 180px;
  width: 120px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
  font-size: 36px;
  border-radius: 5px;
  background: ${props => (props.isOpen? 'white' : 'grey')};
  color: ${props => (!props.isOpen? 'white' : ((props.suit === 'spade' || props.suit === 'club')? 'black' : 'red'))};
`

export const DeckDiv = styles.div`
  position: relative;
  top: ${props => (props.number/-3)}px;
  left: ${props => (props.number/-3)}px;
  border: 2px solid black;
  box-shadow: ${props => {
    let shadows = []
    for(let i = 1; i<=props.number; i++){
      shadows.push(`${i/3}px ${i/3}px ${(i%2 === 0)? 'grey' : 'black'}`)
    }
    return shadows.join()
  }};
  height: 180px;
  width: 120px;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 20px;
  border-radius: 5px;
  background: grey;
  text-align: center;
`

export const StateBoardDiv = styles.div`
  border: 2px solid green;
  height: 400px;
  width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:20px;
  box-sizing:border-box;
`

export const CommandPanelDiv = styles.div`
  height: 360px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`

export const InfoLogDiv = styles.div`
  height: 360px;
  width: 330px;
  border: 2px solid black;
  overflow-y: scroll;
  padding-left: 16px;
  box-sizing:border-box;
  border-radius: 3px;
`

export const ButtonDiv = styles.button`
  height:70px;
  width:70px;
  border-radius: 35px;
  font-size:16px;
  font-weight: bold;
  background: ${props=>props.background || 'red'};
  color: white;
`
import { createContext, useMemo, useState, type ReactNode } from "react";
import { applyTuttoBonus, computeStats } from "../lib/compute";

export type ModeType = "+200" | "+300" | "+400" | "+500" | "+600" | "x2" | "±1000" | "Straße" | "Feuerwerk" | "Kleeblatt" | "Aussetzen"

export type GameContextStatesType = {
  //players: PlayerType[],
  //currentPlayerId: number,
  mode: ModeType,
  score: number,
  currentThrow: number[],
  previousThrow: number[],
}
export type GameContextMutationsType = {
  changeMode: (nextMode: ModeType) => void,
  addToThrow: (value: number) => void,
  removeFromThrow: (index: number) => void,
  nextThrow: () => void,
}

export const GameContext = createContext<GameContextStatesType & GameContextMutationsType>(null);

interface GameContextWrapperProps {
  children: ReactNode
}
export function GameContextWrapper({children}: GameContextWrapperProps) {
  //const [players, setPlayers] = useState<PlayerType[]>(INITIAL_PLAYERS)
  //const [currentPlayerId, setCurrentPlayerId] = useState<number>(0)
  
  const [currentThrow, setCurrentThrow] = useState<number[]>([])
  const [previousThrow, setPreviousThrow] = useState<number[]>([])
  const [mode, setMode] = useState<ModeType>("Aussetzen")

  const score = useMemo<number>(() => {
    const _throw = [...previousThrow, ...currentThrow]
    let score = 0;
    if (mode === "Straße") {
      score = _throw.length === 6 ? 2000 : 0
    } else if (mode === "±1000") {
      score = _throw.length === 6 ? 1000 : 0
    } else {
      for (let i = 1; i <= 6; ++i) {
        const count = _throw.filter(die => die === i).length
        if (i === 1) score += 1000 * Math.floor(count / 3) + 100 * (count % 3)
        else if (i === 5) score += 500 * Math.floor(count / 3) + 50 * (count % 3)
        else score += i * 100 * Math.floor(count / 3)
      }
      if (_throw.length === 6) score = applyTuttoBonus(score, mode)
    }
    // TODO: Apply bonus
    return score
  }, [currentThrow, previousThrow, mode])

  const statistics = useMemo(() => {
    // TODO: Compute stats
    console.log(computeStats(score, 6 - [...previousThrow, ...currentThrow].length, mode))
  }, [mode, previousThrow, currentThrow])

  /*const mutations = {
    nextPlayer: () => {
      setCurrentPlayerId(prev => (prev + 1) % players.length)
    },
    addDiceToAttempt: (dots: number) => {
      setAttempt(prev => {
        if (mode === "Straße") {
          const newDice = [...prev.dice.map((die, index) => index === dots - 1 ? dots : die)]
          return {...prev, dice: newDice}
        } else {
          const newDice = [...prev.dice.filter(die => die !== null), ...Array(dots === 1 || dots === 5 ? 1 : 3).fill(dots)]
          while (newDice.length < 6) {
            newDice.push(null)
          }
          return {...prev, dice: newDice}
        }        
      })
    },
    removeDiceFromAttempt: (position: number) => {
      setAttempt(prev => {
        const dots = prev.dice[position]
        if (dots === null) return prev

        if (mode === "Straße") {
          const newDice = [...prev.dice.map((die, index) => index === position ? null : die)]
          return { ...prev, dice: newDice }
        } else {
          const deleteCount = dots === 1 || dots === 5 ? 1 : 3
          const deleteStart = prev.dice.findIndex((value, index) => value === dots && index >= Math.max(0, position - deleteCount + 1))
          const newDice = [...prev.dice.filter((value, index) => value !== null && (index < deleteStart || index >= deleteStart + deleteCount))]
          while (newDice.length < 6) {
            newDice.push(null)
          }
          return { ...prev, dice: newDice}
        }
      })
    },
    changeMode: (nextMode: ModeType) => {
      const resetModes: ModeType[] = ["Straße", "Aussetzen", "Feuerwerk", "Kleeblatt"]
      setMode(prev => {
        // Reset attempt if the next or previous mode is part of the `resetModes` list. This avoids resetting the attempt
        // when switching between similar bonuses (e.g., from +200 to +500).
        if (resetModes.find(m => m === nextMode || m === prev)) {
          setAttempt(INITIAL_ATTEMPT)
        }
        return nextMode
      });      
      
    }
  }*/

  function changeMode(nextMode: ModeType) {
    const resetModes: ModeType[] = ["Straße", "Aussetzen", "Feuerwerk", "Kleeblatt"]
    setMode(prev => {
      // Reset attempt if the next or previous mode is part of the `resetModes` list. This avoids resetting the attempt
      // when switching between similar bonuses (e.g., from +200 to +500).
      if (resetModes.find(m => m === nextMode || m === prev)) {
        resetThrow()
      }
      return nextMode
    });
  }

  function resetThrow() {
    setCurrentThrow([])
    setPreviousThrow([])
  }

  function addToThrow(value: number) {
    const _throw = [...previousThrow, ...currentThrow]
    setCurrentThrow(prev => {
      if (mode === "Straße") {
        if (_throw.length === 6 || _throw.find(item => item === value)) return prev
        return [...prev, value]
      } else {
        const dice = Array(value === 1 || value === 5 ? 1 : 3).fill(value)
        console.log(_throw.length, dice.length, currentThrow, previousThrow)
        if (_throw.length + dice.length > 6) return prev
        return [...prev, ...dice]
      }
    })
  }

  function removeFromThrow(index: number) {
    console.log("remove", index)
    setCurrentThrow(prev => {
      const deleteCount = (mode === "Straße" || prev[index] === 1 || prev[index] === 5) ? 1 : 3
      const deleteStart = prev.findIndex((v, i) => v === prev[index] && i >= Math.max(0, index - deleteCount + 1))
      console.log("delete", deleteStart, deleteCount)    
      return [...prev.filter((_, i) => i < deleteStart || i >= deleteStart + deleteCount)]
    })
  }

  function nextThrow() {
    // TODO: Handle firework scenario
    console.log("NExt", [...previousThrow, ...currentThrow])
    setPreviousThrow([...previousThrow, ...currentThrow])
    setCurrentThrow([])
  }

  const states: GameContextStatesType = {mode, score, currentThrow, previousThrow}
  const mutations: GameContextMutationsType = {changeMode, addToThrow, removeFromThrow, nextThrow}

  return (
    <GameContext value={{...states, ...mutations}}>
      {children}
    </GameContext>
  )
}
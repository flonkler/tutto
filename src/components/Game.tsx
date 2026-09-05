import { createContext, useMemo, useState, type ReactNode } from "react";
import { applyTuttoBonus, computeStats } from "../lib/compute";

export type BonusType = "+200" | "+300" | "+400" | "+500" | "+600" | "x2" | "±1000" | "Straße" | "Feuerwerk" | "Kleeblatt" | "Aussetzen"
export type StatsType = {
  expectedScore: number,
  tuttoProbability: number,
  blankProbability: number,
}

type TurnType = {
  playerId: number
  bonus: BonusType,
  score: number,
  throws: number[][]
}

export type GameContextStatesType = {
  //players: PlayerType[],
  //currentPlayerId: number,
  players: string[]
  round: number
  currentTurn: TurnType | null
  currentScore: number
  turns: TurnType[]
  remainingDice: number
  canThrowAgain: boolean
  canEndTurn: boolean
}
export type GameContextMutationsType = {
  setBonus: (bonus: BonusType) => void,
  addToThrow: (value: number) => void,
  removeFromThrow: (index: number) => void,
  nextThrow: () => void,
}

export const GameContext = createContext<GameContextStatesType & GameContextMutationsType>(null);

const INITIAL_PLAYERS = ["Spieler 1", "Spieler 2"]
const INITIAL_TURN: TurnType = {
  playerId: 0,
  bonus: "Feuerwerk",
  score: 0,
  throws: [[]]
}

interface GameContextWrapperProps {
  children: ReactNode
}
export function GameContextWrapper({children}: GameContextWrapperProps) {
  const [players, setPlayers] = useState<string[]>(INITIAL_PLAYERS)
  //const [currentPlayerId, setCurrentPlayerId] = useState<number>(0)
  const [round, setRound] = useState<number>(0)
  const [currentTurn, setCurrentTurn] = useState<TurnType | null>(INITIAL_TURN)
  const [turns, setTurns] = useState<TurnType[]>([])

  const remainingDice = useMemo<number>(() => {
    if (!currentTurn) return 0
    if (currentTurn.bonus === "Aussetzen") return 0
    // Count dice (i.e., number of entries in the `throws` arrays)
    const diceCount = currentTurn.throws.reduce((prev, value) => prev + value.length, 0)
    // Compute how many dice can be added to throws. Firework bonus must be handled separately
    // because number of dice may be larger than 6.
    if (currentTurn.bonus === "Feuerwerk") {
      if (diceCount % 6 === 0) {
        if (currentTurn.throws[0].length === 0) {
          // Ensure that 6 (instead of 0) is returned if a new turn was started
          return 6
        }
        return 0
      }
      return 6 - (diceCount % 6)
    }
    return 6 - diceCount
  }, [currentTurn])

  const currentScore = useMemo<number>(() => {
    if (!currentTurn) return 0
    const baseScore = currentTurn.throws.reduce((prev, value) => {
      let score = prev
      for (let i = 1; i <= 6; ++i) {
        const count = value.filter(die => die === i).length
        if (i === 1) score += 1000 * Math.floor(count / 3) + 100 * (count % 3)
        else if (i === 5) score += 500 * Math.floor(count / 3) + 50 * (count % 3)
        else score += i * 100 * Math.floor(count / 3)
      }
      return score
    }, 0)
    if (currentTurn.bonus === "Aussetzen") return 0
    if (currentTurn.bonus === "Straße") return remainingDice === 0 ? 2000 : 0
    if (currentTurn.bonus === "±1000") return remainingDice === 0 ? 1000 : 0
    if (remainingDice === 0) return applyTuttoBonus(baseScore, currentTurn.bonus)
    return baseScore    
  }, [currentTurn, remainingDice])

  /*const statistics = useMemo<StatsType>(() => {
    // TODO: Compute stats
    return computeStats(score, remainingDice, currentTurn?.bonus ?? "Aussetzen")
  }, [currentTurn, score, remainingDice])*/

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

  // function changeMode(nextMode: BonusType) {
  //   const resetModes: BonusType[] = ["Straße", "Aussetzen", "Feuerwerk", "Kleeblatt"]
  //   setMode(prev => {
  //     // Reset attempt if the next or previous mode is part of the `resetModes` list. This avoids resetting the attempt
  //     // when switching between similar bonuses (e.g., from +200 to +500).
  //     if (resetModes.find(m => m === nextMode || m === prev)) {
  //       resetThrow()
  //     }
  //     return nextMode
  //   });
  // }

  // function resetThrow() {
  //   setCurrentThrow([])
  //   setPreviousThrow([])
  // }

  function setBonus(bonus: BonusType) {
    if (currentTurn) setCurrentTurn({ ...currentTurn, bonus })
  }

  function addToThrow(value: number) {
    if (!currentTurn) return
    const dice: number[] = []
    if (currentTurn.bonus === "Straße") {
      // Ensure that number has not already been added `throws`
      if (currentTurn.throws.find(t => t.indexOf(value) !== -1) !== undefined) return
      dice.push(value)
    } else {
      // Add single 1 or 5, or triplets of 2s, 3s, 4s or 6s
      dice.push(...Array(value === 1 || value === 5 ? 1 : 3).fill(value))
    }
    if (remainingDice < dice.length) return
    setCurrentTurn(prev => {
      if (!prev) return prev
      return {
        ...prev,
        throws: prev.throws.map((value, index) => index === 0 ? [...value, ...dice] : value)
      }
    })
  }

  function removeFromThrow(index: number) {
    setCurrentTurn(prev => {
      if (!prev) return prev
      const latestThrow = prev.throws[0]
      const deleteCount = (prev.bonus === "Straße" || latestThrow[index] === 1 || latestThrow[index] === 5) ? 1 : 3
      const deleteStart = latestThrow.findIndex((v, i) => v === latestThrow[index] && i >= Math.max(0, index - deleteCount + 1))
      return {
        ...prev,
        throws: [
          [...latestThrow.filter((_, i) => i < deleteStart || i >= deleteStart + deleteCount)],
          ...prev.throws.filter((_, i) => i > 0)
        ]
      }
    })
  }

  function nextThrow() {
    setCurrentTurn(prev => {
      if (!prev || !canThrowAgain) return prev
      return {...prev, throws: [[], ...prev.throws]}
    })
  }

  const canThrowAgain = useMemo<boolean>(() => {
    if (!currentTurn) return false
    if (currentTurn.bonus === "Aussetzen") return false
    if (currentTurn.throws[0].length === 0) return false
    if (currentTurn.bonus !== "Feuerwerk" && remainingDice === 0) return false
    return true
  }, [currentTurn, remainingDice])

  const canEndTurn = useMemo<boolean>(() => {
    if (!currentTurn) return false
    if (currentTurn.throws[0].length === 0) return true
    if (currentTurn.bonus !== "Feuerwerk" && remainingDice === 0) return true
    if (currentTurn.bonus === "Feuerwerk") return false
    if (currentTurn.bonus === "±1000") return false
    if (currentTurn.bonus === "Kleeblatt") return false
    if (currentTurn.bonus === "Straße") return false
    return true
  }, [currentTurn])

  const states: GameContextStatesType = {currentScore, round, currentTurn, players, turns, remainingDice, canEndTurn, canThrowAgain}
  const mutations: GameContextMutationsType = {setBonus, addToThrow, removeFromThrow, nextThrow}

  return (
    <GameContext value={{...states, ...mutations}}>
      {children}
    </GameContext>
  )
}
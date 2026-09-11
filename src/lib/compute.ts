import type { BonusType, StatsType } from "../components/Game.tsx";

function binom(n: number, k: number): number {
    if (k === 0) return 1;
    if (n < k) throw new Error("n must be bigger or equal k")
    if (n < 1) throw new Error("n must be positive")
    if (k < 0) throw new Error("k must be positive or zero")
    
    let numerator = 1;
    let denominator = 1;
    let i = 0
    while (i++ < k) {
        numerator *= n--;
        denominator *= i;
    }
    return numerator / denominator
}

function* allDiceCombinations(numDice: number, start: number = 1): Generator<string, void, void> {
    if (numDice === 0) return;
    for (let i = start; i <= 6; ++i) {
        yield i.toString()
        for (let suffix of allDiceCombinations(numDice - 1, i)) {
            yield `${i}${suffix}`
        }        
    }
}

const SCORE_MAPPING: Record<string, number> = {
    "1": 100, "5": 50, 
    "111": 1000, "222": 200, "333": 300, "444": 400, "555": 500, "666": 600,
}

function computeScore(combination: string): [number, number] {
    let remainder = combination.length;
    let score = 0;
    for (let match of combination.matchAll(/111|222|333|444|555|666|[15]/g)) {
        remainder -= match[0].length
        score += SCORE_MAPPING[match[0]]
    }
    return [score, remainder]
}


const allPossibleOutcomes: Record<string, number>[][] = Array(6).fill(null).map((_, i) => Array(i+2).fill(null).map(() => ({})))

for (let combination of allDiceCombinations(6)) {
    const [score, remainder] = computeScore(combination);
    const lookup = allPossibleOutcomes[combination.length - 1][remainder]
    lookup[score] = 1 + (lookup?.[score] ?? 0)
}

function computeStreetProbability(n: number) {
    if (n === 0) return 1
    let prob = 0
    for (let k = 1; k <= n; ++k) {
        prob += binom(n, k) * binom(6 - 1, n - k) * computeStreetProbability(n - k) / binom(6 + n - 1, n)
    }
    return prob
}

export function applyTuttoBonus(score: number, bonus: BonusType | null) {
    if (bonus === "+200") return score + 200
    if (bonus === "+300") return score + 300
    if (bonus === "+400") return score + 400
    if (bonus === "+500") return score + 500
    if (bonus === "+600") return score + 600
    if (bonus === "x2") return score * 2
    return score
}

export function computeStats(currentScore: number, n: number, bonus: BonusType): StatsType {
    if (n === 0) {
        return {
            expectedScore: currentScore,
            tuttoProbability: 1,
            blankProbability: 0
        }
    }
    if (bonus === "Straße") {
        let blankProbability = 0
        if (n < 6 && n > 0) blankProbability = binom(5, 5 - n) / binom(6 + n - 1, n)
        return {
            expectedScore: computeStreetProbability(n) * 2000,
            tuttoProbability: computeStreetProbability(n),
            blankProbability: blankProbability
        }
    } else if (bonus === "±1000") {
        const { blankProbability, tuttoProbability } = computeStats(0, n, "+200")
        return {
            expectedScore: tuttoProbability * 1000,
            blankProbability,
            tuttoProbability
        }
    } else {
        const N = binom(6 + n - 1, n)
        let blankProbability = 0
        let tuttoProbability = 0
        let expectedScore = 0

        let x = 0
        allPossibleOutcomes[n - 1].forEach((outcomes, remainingDice) => {
            for (const [s, count] of Object.entries(outcomes)) {
                const score = parseInt(s)
                const prob = count / N
                x += prob
                if (remainingDice === 0) {
                    // Tutto scenario: All dice count
                    tuttoProbability += prob
                    expectedScore += applyTuttoBonus(currentScore + score, bonus) * prob
                } else if (remainingDice === n) {
                    // Blanks scenario: Only blanks, no score (expect for firework mode)
                    blankProbability += prob
                    if (bonus === "Feuerwerk") expectedScore += (currentScore + score) * prob
                } else {
                    // Recursion scenario: Some dice count and player can throw again
                    expectedScore += (currentScore + score) * prob
                    tuttoProbability += prob * computeStats(0, remainingDice, bonus).tuttoProbability
                }
            }
        })
        return {
            expectedScore,
            tuttoProbability,
            blankProbability
        }
    }
}
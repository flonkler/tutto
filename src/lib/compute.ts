import { calculateObjectSize } from "./utils.ts";

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

const SCORE_MAPPING = {
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


const allPossibleOutcomes: {}[][] = Array(6).fill(null).map((_, i) => Array(i+2).fill(null).map(() => ({})))

for (let combination of allDiceCombinations(6)) {
    const [score, remainder] = computeScore(combination);
    const lookup = allPossibleOutcomes[combination.length - 1][remainder]
    lookup[score] = 1 + (lookup?.[score] ?? 0)
    //if (remainder === 6 && combination.length === 6) console.log(combination)
}

for (let i = 1; i <= 6; ++i) {
    let total = 0;
    allPossibleOutcomes[i-1].forEach(x => {
        Object.values(x).forEach((y: number) => {
            total += y
        })
    })
    console.log(total, binom(i + 6 - 1, i))
}

console.log(allPossibleOutcomes[5][0])

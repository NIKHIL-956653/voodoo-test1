// js/levels.js

// --- SAGA LEVELS (Campaign Mode - War) ---
export const SAGA_LEVELS = [
    {
        id: 1,
        name: "The Training Ground",
        rows: 6,
        cols: 6,
        blocked: [],
        setup: [],
        aiDifficulty: "easy"
    },
    {
        id: 2,
        name: "The Donut",
        rows: 8,
        cols: 8,
        blocked: [[3, 3], [3, 4], [4, 3], [4, 4]],
        setup: [{ x: 0, y: 0, owner: 1, count: 1 }],
        aiDifficulty: "medium"
    },
    {
        id: 3,
        name: "The Wall",
        rows: 5,
        cols: 8,
        blocked: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
        setup: [{ x: 7, y: 2, owner: 1, count: 2 }],
        aiDifficulty: "medium"
    },
    {
        id: 4,
        name: "Crossroads",
        rows: 7,
        cols: 7,
        blocked: [[0,0], [0,6], [6,0], [6,6]],
        setup: [{ x: 3, y: 3, owner: 1, count: 2 }],
        aiDifficulty: "hard"
    }
];

// --- BLISS LEVELS (Puzzle Mode - Constraints) ---
export const BLISS_LEVELS = [
    {
        id: 1,
        name: "One Shot Tutorial",
        rows: 3,
        cols: 3,
        blocked: [],
        setup: [
            { x: 1, y: 0, owner: 1, count: 2 },
            { x: 1, y: 2, owner: 1, count: 2 },
            { x: 0, y: 1, owner: 1, count: 2 },
            { x: 2, y: 1, owner: 1, count: 2 }
        ],
        aiDifficulty: "easy", 
        maxMoves: 1
    },
    {
        id: 2,
        name: "The Corridor",
        rows: 2,
        cols: 5,
        blocked: [],
        setup: [
            { x: 4, y: 0, owner: 1, count: 1 },
            { x: 4, y: 1, owner: 1, count: 1 }
        ],
        aiDifficulty: "easy",
        maxMoves: 2
    },
    {
        id: 3,
        name: "L-Shape Puzzle",
        rows: 4,
        cols: 4,
        blocked: [
            [1, 0], [2, 0], [3, 0], 
            [1, 1], [2, 1], [3, 1]
        ],
        setup: [
            { x: 0, y: 3, owner: 1, count: 2 } 
        ],
        aiDifficulty: "medium",
        maxMoves: 3
    },
    {
        id: 4,
        name: "Five Blast Challenge",
        rows: 7,
        cols: 7,
        blocked: [
            [2,2], [2,3], [2,4],
            [3,2],        [3,4],
            [4,2], [4,3], [4,4]
        ], 
        setup: [],
        aiDifficulty: "medium",
        maxMoves: 5
    },
    {
        id: 5,
        name: "Tiny Duel",
        rows: 4,
        cols: 3,
        blocked: [],
        setup: [
            { x: 1, y: 1, owner: 1, count: 3 } 
        ],
        aiDifficulty: "hard", 
        maxMoves: 5
    }
];
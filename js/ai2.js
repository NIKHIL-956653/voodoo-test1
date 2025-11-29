// js/ai2.js
// ADVANCED AI (USED FOR SAGA/BLISS - WALL AWARE)
import { capacity, neighbors } from "./board.js";

const jitter = (amt = 0.2) => (Math.random() * amt - amt / 2);

export function simulateBoardState(initialBoard, x, y, who, rows, cols) {
  const clone = initialBoard.map(row => row.map(c => ({ ...c })));
  if (clone[y][x].owner !== -1 && clone[y][x].owner !== who) return null;
  if (clone[y][x].isBlocked) return null; 

  clone[y][x].owner = who;
  clone[y][x].count += 1;

  const q = [];
  for (let yy = 0; yy < rows; yy++) {
    for (let xx = 0; xx < cols; xx++) {
      if (clone[yy][xx].isBlocked) continue; 
      if (clone[yy][xx].count >= capacity(xx, yy, rows, cols)) q.push([xx, yy]);
    }
  }

  let loops = 0;
  while (q.length) {
    if (loops++ > 400) break;
    const wave = [...new Set(q.map(([x, y]) => `${x},${y}`))].map(s => s.split(",").map(Number));
    q.length = 0;
    
    for (const [cx, cy] of wave) {
      const cap = capacity(cx, cy, rows, cols);
      const cell = clone[cy][cx];
      if (cell.count < cap) continue;

      cell.count -= cap;
      if (cell.count === 0) cell.owner = -1;

      for (const [nx, ny] of neighbors(cx, cy, rows, cols, clone)) {
        const n = clone[ny][nx];
        n.owner = who; 
        n.count += 1;
        if (n.count >= capacity(nx, ny, rows, cols)) q.push([nx, ny]);
      }
    }
  }
  return clone;
}

export function evaluateBoard(boardState, playerIndex, rows, cols) {
  let score = 0;
  let myOrbs = 0, oppOrbs = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = boardState[y][x];
      if (cell.isBlocked) continue;

      if (cell.owner === playerIndex) {
        myOrbs += cell.count;
        score += cell.count * 10;
        if (cell.count + 1 >= capacity(x, y, rows, cols)) score += 50;
      } else if (cell.owner !== -1) {
        oppOrbs += cell.count;
        score -= cell.count * 12;
        if (cell.count + 1 >= capacity(x, y, rows, cols)) score -= 60;
      }
    }
  }

  if (oppOrbs > 0 && myOrbs === 0) return -100000;
  if (myOrbs > 0 && oppOrbs === 0) return 100000;

  score += (myOrbs - oppOrbs) * 20;
  return score;
}

export function minimax(boardState, depth, isMaximizing, aiPlayerIndex, playersLength, rows, cols, alpha, beta) {
  const currentEval = evaluateBoard(boardState, aiPlayerIndex, rows, cols);
  if (Math.abs(currentEval) >= 100000 || depth === 0) return currentEval;

  const currentPlayer = isMaximizing ? aiPlayerIndex : (aiPlayerIndex + 1) % playersLength;
  const moves = [];
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = boardState[y][x];
      if (!c.isBlocked && (c.owner === -1 || c.owner === currentPlayer)) {
          moves.push({ x, y });
      }
    }
  }

  if (moves.length === 0) return currentEval;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      const nextBoard = simulateBoardState(boardState, m.x, m.y, currentPlayer, rows, cols);
      if (!nextBoard) continue;
      
      const ev = minimax(nextBoard, depth - 1, false, aiPlayerIndex, playersLength, rows, cols, alpha, beta);
      maxEval = Math.max(maxEval, ev);
      
      alpha = Math.max(alpha, maxEval);
      if (beta <= alpha) break; 
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      const nextBoard = simulateBoardState(boardState, m.x, m.y, currentPlayer, rows, cols);
      if (!nextBoard) continue;
      
      const ev = minimax(nextBoard, depth - 1, true, aiPlayerIndex, playersLength, rows, cols, alpha, beta);
      minEval = Math.min(minEval, ev);
      
      beta = Math.min(beta, minEval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function makeSagaAIMove(board, playerIndex, difficulty, rows, cols, playersLength) {
  const valid = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = board[y][x];
      if (!c.isBlocked && (c.owner === -1 || c.owner === playerIndex)) {
          valid.push([x, y]);
      }
    }
  }
  if (!valid.length) return null;

  if (difficulty === "easy") {
    const [x, y] = valid[Math.floor(Math.random() * valid.length)];
    return { x, y };
  } 
  
  if (difficulty === "medium") {
    const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
    const enemyPressure = (x, y) => {
      let s = 0; 
      for (const [nx, ny] of neighbors(x, y, rows, cols, board)) {
        const n = board[ny][nx]; 
        if (n.owner !== -1 && n.owner !== playerIndex) s += Math.min(n.count, 2);
      } return s;
    };
    
    let cand = [];
    for (const [x,y] of valid) {
      const cell = board[y][x];
      const cap = capacity(x, y, rows, cols);
      const nearBoom = (cell.count + 1 >= cap) ? 1 : 0;
      const centerBonus = 1 / (1 + Math.hypot(x - cx, y - cy));
      const pressure = enemyPressure(x, y) / 4;
      const ownBonus = (cell.owner === playerIndex) ? 0.15 : 0;
      const score = nearBoom * 2.5 + centerBonus * 1.2 + pressure + ownBonus + jitter(0.25);
      cand.push({ x, y, score });
    }
    
    cand.sort((a, b) => b.score - a.score || Math.random() - 0.5);
    const pickFrom = Math.min(5, cand.length);
    return cand[Math.floor(Math.random() * pickFrom)];
  } 
  
  if (difficulty === "hard") {
    const searchDepth = 3; 
    let bestMove = null;
    let bestVal = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;
    
    let candidates = valid.map(([x,y]) => ({x,y})); 
    candidates.sort(() => Math.random() - 0.5); 

    if (candidates.length > 40) return makeSagaAIMove(board, playerIndex, "medium", rows, cols, playersLength);

    for (const move of candidates) {
      const nextBoard = simulateBoardState(board, move.x, move.y, playerIndex, rows, cols);
      if (nextBoard) {
        const val = minimax(nextBoard, searchDepth - 1, false, playerIndex, playersLength, rows, cols, alpha, beta); 
        
        if (val > bestVal) {
          bestVal = val;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestVal);
      }
    }
    return bestMove || makeSagaAIMove(board, playerIndex, "easy", rows, cols, playersLength);
  }
}
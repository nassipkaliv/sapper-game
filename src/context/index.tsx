import { createContext, PropsWithChildren, useReducer } from 'react';
import { BlockState, Difficulty } from '../types';

export const MINES_EASY_GAME = 10;
export const MINES_MEDIUM_GAME = 40;
export const MINES_HARD_GAME = 99;

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

type GameStatus = 'ready' | 'play' | 'won' | 'lost';

type GameState = {
  mines: number;
  board: BlockState[][];
  mineGenerated: boolean;
  status: GameStatus;
  startMs?: number;
  endMs?: number;
};

type GameContext = {
  state: GameState;
  dispatch: React.Dispatch<Actions>;
};

type Actions =
  | {
      type: 'new game';
      payload: { difficulty: Difficulty; mines: number };
    }
  | { type: 'play'; payload: BlockState }
  | { type: 'flaged'; payload: BlockState }
  | { type: 'gameover'; payload: GameStatus };

function reset(width: number, height: number): BlockState[][] {
  return Array(height)
    .fill(0)
    .map((_, idx) => idx)
    .map((y) => {
      return Array(width)
        .fill(0)
        .map((_, idx) => idx)
        .map(
          (x): BlockState => ({
            y,
            x,
            revealed: false,
            adjacentMines: 0,
          })
        );
    });
}

function newGame(difficulty: Difficulty): BlockState[][] {
  switch (difficulty) {
    case 'medium': {
      return reset(16, 16);
    }
    case 'hard': {
      return reset(16, 30);
    }
    default:
      return reset(9, 9);
  }
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
  return Math.round(randomRange(min, max));
}

function generateMine(state: GameState, initial: BlockState) {
  function placeRandom(): boolean {
    let height = state.board.length,
      width = state.board[0].length;
    const x = randomInt(0, width - 1);
    const y = randomInt(0, height - 1);
    const block = state.board[y][x];
    if (
      Math.abs(initial.x - block.x) <= 1 &&
      Math.abs(initial.y - block.y) <= 1
    )
      return false;
    if (block.mine) return false;
    block.mine = true;
    state.board[y][x] = block;
    return true;
  }
  Array.from({ length: state.mines }, () => null).forEach(() => {
    let placed = false;
    while (!placed) placed = placeRandom();
  });
  updateNumbers(state.board);
}

function updateNumbers(board: BlockState[][]) {
  board.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return;
      getSiblings(board, block).forEach((b) => {
        if (b.mine) block.adjacentMines += 1;
      });
    });
  });
}

function getSiblings(board: BlockState[][], block: BlockState) {
  let height = board.length,
    width = board[0].length;
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;

      if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return undefined;
      return board[y2][x2];
    })
    .filter(Boolean) as BlockState[];
}

function expendZero(board: BlockState[][], block: BlockState) {
  if (block.adjacentMines) return;
  getSiblings(board, block).forEach((block) => {
    if (!block.revealed) {
      if (!block.flaged) block.revealed = true;
      expendZero(board, block);
    }
  });
}

function showAllMine(gameState: GameState) {
  gameState.board.flat().forEach((block) => {
    if (block.mine) block.revealed = true;
  });
}

const gameState: GameState = {
  mines: 10,
  board: newGame('easy'),
  mineGenerated: false,
  startMs: 0,
  endMs: 0,
  status: 'ready',
};

function gameStateReducer(state: GameState, action: Actions): GameState {
  switch (action.type) {
    case 'new game': {
      const { mines, difficulty } = action.payload;
      return {
        ...state,
        mineGenerated: false,
        status: 'ready',
        mines,
        board: newGame(difficulty),
      };
    }
    case 'play': {
      const {
        payload: { x, y, flaged },
      } = action;

      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      let block = { ...newState.board[y][x] };
      if (newState.status === 'ready') {
        newState.status = 'play';
        newState.startMs = +Date.now();
      }
      if (!newState.mineGenerated) {
        generateMine(newState, block);
        newState.mineGenerated = true;
      }
      if (newState.status !== 'play' || flaged) return newState;
      block.revealed = true;
      newState.board[y][x] = block;
      if (block.mine) {
        showAllMine(newState);
        newState.status = 'lost';
        return newState;
      }
      expendZero(newState.board, block);

      return newState;
    }
    case 'flaged': {
      const { x, y } = action.payload;
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      newState.board[y][x].flaged = !newState.board[y][x].flaged;
      return newState;
    }
    case 'gameover': {
      return {
        ...state,
        status: action.payload,
      };
    }
    default:
      return state;
  }
}

export const GameContext = createContext<GameContext>({} as GameContext);

export default function GameContextProvider({
  children,
}: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(gameStateReducer, gameState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
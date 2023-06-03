import { createContext, PropsWithChildren, useReducer } from 'react';
import { BlockState, Difficulty } from '../types';

export const MINES_EASY_GAME = 10;
export const MINES_MEDIUM_GAME = 40;
export const MINES_HARD_GAME = 99;

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
    console.log({ y, x });
    const block = state.board[y][x];
    if (initial.x - block.x <= 1 && initial.y - block.y <= 1) return false;
    if (block.mine) return false;
    block.mine = true;
    state.board[y][x] = block;
    return true;
  }
  Array.from({ length: state.mines }, () => null).forEach(() => {
    let placed = false;
    while (!placed) placed = placeRandom();
  });
}

const gameState: GameState = {
  mines: 10,
  board: newGame('easy'),
  mineGenerated: false,
  startMs: 0,
  endMs: 0,
  status: 'play',
};

type Actions =
  | {
      type: 'new game';
      payload: { difficulty: Difficulty; mines: number };
    }
  | { type: 'play'; payload: BlockState };

function gameStateReducer(state: GameState, action: Actions): GameState {
  switch (action.type) {
    case 'new game': {
      console.log('new game');
      const { mines, difficulty } = action.payload;
      return {
        ...state,
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
      if (state.status === 'ready') {
        newState.status = 'play';
        newState.startMs = +new Date();
      }
      if (!state.mineGenerated) {
        generateMine(newState, block);
        newState.mineGenerated = true;
      }
      if (state.status !== 'play' || flaged) return newState;
      block.revealed = true;
      newState.board[y][x] = block;

      return newState;
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
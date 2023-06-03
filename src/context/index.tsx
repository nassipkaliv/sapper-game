import { createContext, PropsWithChildren, useReducer } from 'react';
import { BlockState, Difficulty } from '../types';

export const MINES_EASY_GEME = 10;
export const MINES_MEDIUM_GEME = 40;
export const MINES_HARD_GEME = 99;

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

const gameState: GameState = {
  mines: 10,
  board: newGame('easy'),
  mineGenerated: false,
  status: 'play',
};

type Actions = {
  type: 'new game';
  payload: { difficulty: Difficulty; mines: number };
};

function gameStateReducer(state: GameState, action: Actions) {
  switch (action.type) {
    case 'new game': {
      const { mines, difficulty } = action.payload;
      return {
        ...state,
        mines,
        board: newGame(difficulty),
      };
    }
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
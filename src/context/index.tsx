import { createContext, PropsWithChildren, useReducer } from 'react';
import { BlockState, Difficulty } from '../types';

type GameStatus = 'ready' | 'play' | 'won' | 'lost';

type GameState = {
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

function reset(width: number, height: number, mine: number): BlockState[][] {
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
      return reset(16, 16, 40);
      break;
    }
    case 'hard': {
      return reset(16, 30, 99);
      break;
    }
    default:
      return reset(9, 9, 10);
  }
}

const gameState: GameState = {
  board: newGame('easy'),
  mineGenerated: false,
  status: 'play',
};

type Actions = { type: 'new game'; payload: Difficulty };

function gameStateReducer(state: GameState, action: Actions) {
  switch (action.type) {
    case 'new game': {
      return {
        ...state,
        board: newGame(action.payload),
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
import { useContext } from 'react';
import IconMine from '~icons/mdi/mine';
import IconTimer from '~icons/carbon/timer';

import {
  GameContext,
  MINES_EASY_GAME,
  MINES_MEDIUM_GAME,
  MINES_HARD_GAME,
} from './context';
import { Difficulty } from './types';
import Button from './components/Button';
import MineBlock from './components/MineBlock';

function App() {
  const { state, dispatch } = useContext(GameContext);
  const { board, startMs } = state;

  function handleGameMode(difficulty: Difficulty) {
    const noOfMines = {
      easy: MINES_EASY_GAME,
      medium: MINES_MEDIUM_GAME,
      hard: MINES_HARD_GAME,
    };
    dispatch({
      type: 'new game',
      payload: { difficulty, mines: noOfMines[difficulty] },
    });
  }

  return (
    <div>
      Minesweeper
      <div className="flex justify-center p-4 gap-1">
        <Button onClick={() => handleGameMode('easy')}>New Game</Button>
        <Button onClick={() => handleGameMode('easy')}>Easy</Button>
        <Button onClick={() => handleGameMode('medium')}>Medium</Button>
        <Button onClick={() => handleGameMode('hard')}>Hard</Button>
      </div>
      <div className="flex gap-10 justify-center">
        <div className="flex text-2xl gap-1 items-center font-mono">
          <IconTimer /> {startMs}
        </div>
        <div className="flex text-2xl gap-1 items-center font-mono">
          <IconMine />0
        </div>
      </div>
      <div className="overflow-auto p-5 w-full">
        {board.map((row, y) => (
          <div
            key={y}
            className="flex items-center justify-center w-max m-auto"
          >
            {row.map((block) => (
              <MineBlock key={block.x} block={block} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
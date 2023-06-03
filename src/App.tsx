import { useContext, useEffect, useState, useRef } from 'react';
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
  const [timer, setTimer] = useState(0);
  const interval = useRef(0);
  const { state, dispatch } = useContext(GameContext);
  const { board } = state;

  function handleGameMode(difficulty: Difficulty) {
    setTimer(0);
    clearInterval(interval.current);
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

  const minesLeft = board
    .flat()
    .reduce((a, b) => a - (b.flaged ? 1 : 0), state.mines);

  useEffect(() => {
    if (state.status === 'play') {
      interval.current = setInterval(() => {
        setTimer((val) => val + 1);
      }, 1000);
      return;
    }
    clearInterval(interval.current);
  }, [state.status]);

  useEffect(() => {
    if (state.status === 'lost')
      setTimeout(() => {
        alert('lost');
      }, 10);
  }, [state.status]);

  useEffect(() => {
    let blocks = board.flat();
    if (!blocks.some((block) => !block.mine && !block.revealed))
      dispatch({ type: 'gameover', payload: 'won' });
  }, [board]);

  return (
    <div className="text-center">
      <span className="dark:text-white"> Minesweeper </span>
      <div className="flex justify-center p-4 gap-1">
        <Button onClick={() => handleGameMode('easy')}>New Game</Button>
        <Button onClick={() => handleGameMode('easy')}>Easy</Button>
        <Button onClick={() => handleGameMode('medium')}>Medium</Button>
        <Button onClick={() => handleGameMode('hard')}>Hard</Button>
      </div>
      <div className="flex gap-10 justify-center dark:text-white">
        <div className="flex text-2xl gap-1 items-center font-mono">
          <IconTimer /> {timer}
        </div>
        <div className="flex text-2xl gap-1 items-center font-mono">
          <IconMine />
          {minesLeft}
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
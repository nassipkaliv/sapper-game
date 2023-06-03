import { useContext, MouseEventHandler } from 'react';
import IconMine from '~icons/mdi/mine';
import IconFlag from '~icons/mdi/flag';

import { GameContext } from '../context';
import { BlockState } from '../types';

type MineBlockProps = {
  block: BlockState;
};

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
];

export default function MineBlock({ block }: MineBlockProps) {
  const { dispatch, state } = useContext(GameContext);

  const handleRightClick: MouseEventHandler = (e) => {
    e.preventDefault();
    if (state.status !== 'play' || block.revealed) return;
    dispatch({ type: 'flaged', payload: block });
  };

  const getBlockClass = () => {
    if (block.flaged) return 'bg-gray-500';
    if (!block.revealed) return 'bg-gray-500 hover:bg-gray-400';

    return block.mine ? 'bg-red-500' : numberColors[block.adjacentMines];
  };

  return (
    <button
      onContextMenu={handleRightClick}
      onClick={() => {
        dispatch({ type: 'play', payload: block });
      }}
      className={`flex items-center justify-center min-w-8 min-h-8 border-0.5 border-gray-400 ${getBlockClass()}`}
    >
      {block.flaged && (
        <span className="text-red-400">
          <IconFlag />
        </span>
      )}
      {block.revealed &&
        (function () {
          if (block.mine) return <IconMine color="#fff" />;
          if (block.adjacentMines > 0)
            return <span>{block.adjacentMines}</span>;
        })()}
    </button>
  );
}
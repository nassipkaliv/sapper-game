import IconMine from '~icons/mdi/mine';
import { BlockState } from '../types';
import IconFlag from '~icons/mdi/flag';

type MineBlockProps = {
  block: BlockState;
};

export default function MinBlock ({ block}: MineBlockProps ) {
  return (
   <button className='flex items-center justify-center min-w-8 min-h-8 border-0.5 border-gray-400 bg-gray-500 hover:bg-gray-400'>
    {block.flaged && (
      <span className="text-red-400">
        <IconFlag />
      </span>
    )}
    {block.revealed && (block.mine ? <IconMine /> : block.adjacentMines)}
   </button>
  )
}
import IconMine from '~icons/mdi/mine';
import { BlockState } from '../types';

type MineBlockProps = {
  block: BlockState;
};

export default function MinBlock ({ block}: MineBlockProps ) {
  return (
    <button className='flex items-center justify-center min-w-8 min-h-8'>
      <IconMine />
    </button>
  )
}
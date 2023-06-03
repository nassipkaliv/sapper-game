export type BlockState = {
  x: number;
  y: number;
  revealed: boolean;
  mine?: boolean;
  flaged?: boolean;
  adjacentMines: number;
};

export type Difficulty = 'easy' | 'medium' | 'hard';
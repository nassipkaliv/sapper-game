import { PropsWithChildren } from 'react';

type ButtonProps = {
  onClick: () => void;
};

export default function Button({
  children,
  onClick,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
import React from 'react';
import clsx from 'clsx';

const styles = `bg-blue-100 border border-blue-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium hover:bg-blue-200`

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const Button: React.VFC<Props> = ({ onClick, className, children }) => {
  return (
    <button
      className={clsx(styles, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

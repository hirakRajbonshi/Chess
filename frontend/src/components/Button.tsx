import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}
export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button onClick={onClick} className="px-10 bg-gray-200 py-2 rounded-md">
      {children}
    </button>
  );
};

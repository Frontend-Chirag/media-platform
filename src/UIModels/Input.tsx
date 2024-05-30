// CustomInput.tsx
import React from 'react';

interface CustomInputProps {
  type: string;
  id: string;
  register: any; // replace with the correct type if you're using TypeScript
  className?: string;
}

const Input: React.FC<CustomInputProps> = ({ type, id, register, className }) => {
  return (
    <input
      type={type}
      id={id}
      {...register}
      className={`w-full h-[50px] fontsfamily border-none outline-none bg-neutral-100 p-2 text-lg font-bold input-shadow rounded-sm ${className}`}
    />
  );
};

export default Input;
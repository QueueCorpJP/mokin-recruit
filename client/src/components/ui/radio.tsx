import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ checked, onChange, name, value, ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <input
          type="radio"
          className="peer absolute opacity-0 w-[20px] h-[20px] cursor-pointer"
          checked={checked}
          onChange={onChange}
          name={name}
          value={value}
          ref={ref}
          {...props}
        />
        <div
          className={`
            flex w-[20px] h-[20px] justify-center items-center
            border border-[#DCDCDC] rounded-full
            peer-checked:border-[#0F9058]
            peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-[#0F9058]
          `}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="flex-shrink-0"
              style={{ aspectRatio: "1/1" }}
            >
              <circle cx="7" cy="7" r="7" fill="#0F9058" />
            </svg>
          )}
        </div>
      </div>
    );
  }
);

Radio.displayName = "Radio";

import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';

interface IUseCustomInputRangeProps {
    zoom: number;
    onZoom: (value: number) => void;
}

const CustomInputRange: React.FC<IUseCustomInputRangeProps> = ({ zoom, onZoom }) => {
    const lineRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState(false);

    const handleDrag = (e: MouseEvent | TouchEvent) => {
        if (focus) {
            const position = 'touches' in e ? e.touches[0].clientX : e.clientX;

            if (lineRef.current) {
                const { left, width } = lineRef.current.getBoundingClientRect();
                let newValue = Math.min(1, Math.max(0, (position - left) / width));

                newValue = Math.min(0.3, newValue);

                if (onZoom) {
                    onZoom(newValue);
                }
            }
        }
    };


    const handleStop = () => {
        setFocus(false);
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
        setFocus(true);
        handleDrag(e);
    };

    return (
        <div
            ref={lineRef}
            onMouseDown={handleStart}
            onMouseMove={handleDrag}
            onMouseUp={handleStop}
            onTouchStart={handleStart}
            onTouchEnd={handleStop}
            className='w-full h-[20px] flex justify-center items-center flex-col rounded-[5px] cursor-pointer '
        >
            <div className='bg-[#7eb5f9] h-[5px] w-full items-center rounded-[5px] flex relative'>
                <div
                    className={` bg-[#2f8bfc] rounded-[5px]`}
                    style={{
                        flexGrow: zoom, height: '100%',
                        width: `${zoom * 320}%`, // Adjusted width
                    }}
                ></div>
                <div
                    className={`w-[15px] h-[15px] flex justify-center items-center  rounded-full bg-[#2f8bfc] ${focus ? 'scale-[1.2]' : 'scale-[1]'}transition-transform 
               `}
                    style={{ left: `${zoom * 320}%` }}
                >
                    <div
                        className={`w-[30px] h-[30px]  flex ${focus && 'bg-[#2f8bfc3c]'} hover:bg-[#2f8bfc3c] focus:bg-[#2f8bfc3c] items-center justify-center absolute transition-all  rounded-full`} />
                </div>
            </div>
        </div>
    );
};

export default CustomInputRange;

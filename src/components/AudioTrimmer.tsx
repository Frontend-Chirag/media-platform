import React, { PureComponent, SetStateAction, createRef, useEffect, useRef, useState } from 'react';
import Progress from './Progress';

interface IUseAudioComponentProps {
    duration: number;
    setCurrentAudioSeconds: React.Dispatch<SetStateAction<number>>;
    isPlaying: boolean;
    customDuration: number;
    milliseconds: number;
    setIsHardCore: React.Dispatch<SetStateAction<boolean>>
    songTimer: number;
    currentAudioSeconds: number
}

class AudioTrimmer extends PureComponent<IUseAudioComponentProps>{

    secondsContainerRef = createRef<HTMLDivElement>();
    secondsVisualizerRef = createRef<HTMLDivElement>();

    state = {
        isSliding: false,
        positionLeft: 205,
        lastPosition: 0,
        progress: 0,
        playerLength: this.props.duration
    }


    componentDidMount(): void {
        // Event listeners for mouse and touch events
        const secondsContainer = this.secondsContainerRef.current;
        window.addEventListener('mouseup', this.onStop, { passive: false })
        window.addEventListener('touchend', this.onStop, { passive: false })
        window.addEventListener('mousemove', this.onDrag, { passive: false })
        window.addEventListener('touchmove', this.onDrag, { passive: false })

        // Event listeners for secondsContainer component interaction
        if (secondsContainer) {
            secondsContainer.addEventListener('mousedown', this.onStart);
            secondsContainer.addEventListener('touchstart', this.onStart);
         }
    }

    componentDidUpdate(prevProps: Readonly<IUseAudioComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {

        const secondsVisualizer = this.secondsVisualizerRef.current;

        if (prevProps.songTimer !== this.props.songTimer) {
            if (this.props.songTimer >= 10 && this.props.songTimer <= 14) {
                const newPlayerLength = Math.floor((this.props.duration / this.props.songTimer) * this.props.songTimer) - 10;
                this.setState({
                    playerLength: newPlayerLength,
                    positionLeft: 205,
                });
                const gapSize = this.props.songTimer - 10;
                if (secondsVisualizer) {
                    secondsVisualizer.style.gap = `${10 - gapSize}px`
                }
            } else {
                const newPlayerLength = Math.floor((this.props.duration * 15) / this.props.songTimer);

                this.setState({
                    playerLength: newPlayerLength,
                    positionLeft: 205
                })
                if (secondsVisualizer) {
                    secondsVisualizer.style.gap = `5px`
                }
            }

        };
    }

    componentWillUnmount(): void {
        // Remove event listeners on component unmount
        const secondsContainer = this.secondsContainerRef.current;
        window.removeEventListener('mouseup', this.onStop)
        window.removeEventListener('touchend', this.onStop)
        window.removeEventListener('mousemove', this.onDrag)
        window.removeEventListener('touchmove', this.onDrag)

        if (secondsContainer) {
            secondsContainer.removeEventListener('mousedown', this.onStart);
            secondsContainer.removeEventListener('touchstart', this.onStart);
        }
    }



    onDrag = (e: MouseEvent | TouchEvent) => {

        // handle dragging Event
        if (this.state.isSliding) {
            // Calculate new position based on mouse or touch position
            const position = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const secondsContainer = this.secondsContainerRef.current;
            const secondsVisualizer = this.secondsVisualizerRef.current;

            if (secondsContainer && secondsVisualizer) {
                // Calculate the current position relative to the trimmer component
                const currentPosition = position - secondsContainer.getBoundingClientRect().left;
                
                // Limit the newPosition within the secondsContainer bounds
                const newPosition = this.state.lastPosition + currentPosition;
                const minimumLimit = -(secondsVisualizer.offsetWidth - 338);
               
                // Calculate the position percentage based on the restricted position
                const restrictedPosition = Math.min(205, Math.max(minimumLimit, newPosition));
                const positionPercentage = (restrictedPosition + Math.abs(minimumLimit)) / (205 + Math.abs(minimumLimit));
                const clampedPositionPercentage = Math.max(0, positionPercentage); 

                // Calculate the index without negative values
                let index = Math.floor((this.props.duration - this.props.songTimer) - (clampedPositionPercentage * this.props.duration));
                index = Math.max(0, index); 

                this.props.setCurrentAudioSeconds(index)
                this.setState({
                    positionLeft: restrictedPosition,
                    progress: 0
                });
            }
        };
    }


    onStart = (e: MouseEvent | TouchEvent) => {
        // Handle start of dragging
        this.setState({
            isSliding: true
        });
        this.onDrag(e)
    };

    onStop = () => {
        // Handle stop of dragging
        this.setState({
            isSliding: false,
            lastPosition: this.state.positionLeft
        });
    };

    updatedProgress = (value: number) => {
        // Update progress value
        this.setState({
            progress: value
        })
    }

    render() {

        return (
            <div className="w-full h-[100px] flex flex-col gap-2 bg-white dark:bg-black px-3 " >
                <div className="w-full h-full mb-4  flex justify-start items-center relative overflow-hidden  ">
                    <div ref={this.secondsVisualizerRef} style={{ left: `${this.state.positionLeft}px` }} className=" gap-[10px] w-auto h-full top-0 flex  items-center absolute  ">
                        {Array.from({ length: this.state.playerLength }, (_, index) => (
                            <div
                                className={`w-[4px] h-[${index % 2 === 0 ? '20px' : '30px'}]  rounded-[20px]  ${(index % 2 )=== 0 ? 'bg-gray-400 dark:bg-white' : 'bg-[#2f8bfc]'}`}
                                key={index}
                            />
                        ))}
                    </div>

                    <div

                        ref={this.secondsContainerRef}
                        className="z-2  top-0  w-full h-full box-content absolute left-0  flex justify-center items-center "
                    >
                        <div className="h-[50px] w-[140px] gap-2 relative border-[2px] dark:border-white border-gray-400  bg-transparent  rounded-[5px] " >
                            <Progress
                                progress={this.state.progress}
                                setProgress={this.updatedProgress}
                                milliseconds={this.props.milliseconds}
                                isPlaying={this.props.isPlaying}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default AudioTrimmer;

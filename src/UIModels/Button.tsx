import React from 'react'

interface IButton {
    onClick?: () => void,
    type?: 'button' | 'submit' | 'reset',
    className?: string,
    disabled?: boolean,
    isLoading?: boolean,
    isBounce?: boolean,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
    style?: React.CSSProperties
    defaultString?: string,
    submitString?: string,
}

const Button: React.FC<IButton> = ({
    type,
    style,
    onClick,
    className,
    disabled,
    isLoading,
    isBounce,
    onMouseEnter,
    onMouseLeave,
    defaultString,
    submitString
}) => {
    return (
        <button
            type={type}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
             className=' custom-btn '
            onClick={onClick}
        >
        {isLoading  ? submitString : defaultString }
        </button>
    )
}

export default Button
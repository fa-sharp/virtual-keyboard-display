interface TooltipProps {
    text: string
    tooltip: string
}

export const Tooltip = ({text, tooltip}: TooltipProps) => {
    return (
        <div className="tooltip">{text}
            <span className="tooltip-text">{tooltip}</span>
        </div>
    )
}

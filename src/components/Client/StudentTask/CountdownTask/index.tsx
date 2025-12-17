import React, { memo } from 'react'
import Countdown from 'react-countdown'

const CountdownTask = ({ duration, setIsTimeout }: any) => {
    const renderer = ({ total, hours, minutes, seconds, completed }: any) => {

        let hoursRender = hours + ''
        let minutesRender = minutes + ''
        let secondsRender = seconds + ''
        if (hoursRender.length < 2) {
            hoursRender = '0' + hoursRender
        }
        if (minutesRender.length < 2) {
            minutesRender = '0' + minutesRender
        }
        if (secondsRender.length < 2) {
            secondsRender = '0' + secondsRender
        }
        if (completed) {
            // Render a completed state
            setIsTimeout(true)
            return <h2>Hết giờ!</h2>;
        } else {
            // Render a countdown
            return <h2>{hoursRender}:{minutesRender}:{secondsRender}</h2>;
        }
    };

    return (
        <div>
            <Countdown date={Date.now() + (duration || 60) * 60 * 1000} renderer={renderer} />
        </div>
    )
}

export default memo(CountdownTask)
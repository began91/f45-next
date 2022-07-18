import React from 'react';

export default function TimeCircle(props) {
    const isWork = props.isWork;
    const currentSetDuration = props.currentSetDuration;
    const setTimer = props.setTimer;

    const percentComplete = (setTimer / currentSetDuration) * 100;

    const timeStringSec = seconds => {
        return seconds >= 60
            ? new Date(seconds * 1000).toISOString().substring(14, 19)
            : seconds;
    };

    return (
        <div className="set-timer">
            <div className="time-circle-outer">
                <div
                    className="time-circle-inner"
                    style={{
                        backgroundColor: isWork ? 'green' : 'red',
                    }}
                >
                    <div className="set-time-remaining">
                        {timeStringSec(currentSetDuration - setTimer)}
                    </div>
                </div>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="200px"
                height="200px"
                style={{
                    strokeDashoffset: (percentComplete * 565) / 100,
                }}
            >
                <defs>
                    <linearGradient id="GradientColor">
                        <stop offset="0%" stopColor="aqua" />
                        <stop offset="100%" stopColor="orange" />
                    </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="90" strokeLinecap="round" />
            </svg>
        </div>
    );
}

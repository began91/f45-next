import React from 'react';
import { useTimer } from 'react-timer-hook';
import Beep from '../helpers/Beep.js';

export default function MyTimer({expiryTimestamp}) {
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart
    } = useTimer({ 
        expiryTimestamp, 
        onExpire: () => {
            console.warn('onExpire called')
            Beep();
        }
    })


    return (
        <div style={{textAlign: 'center'}}>
            <h1>react-timer-hook</h1>
            <p>Timer Demo</p>
            <div style={{fontSize: '100px'}}>
                <span>{days}</span>d
                <span>{hours}</span>h
                <span>{minutes}</span>m
                <span>{seconds}</span>s
            </div>
            <p>{isRunning ? 'Running' : "Not Running"}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
            <button onClick={()=> {
                const time = new Date();
                time.setSeconds(time.getSeconds() + 300);
                restart(time);
            }}>Restart</button>
            <button onClick={Beep}>Beep</button>
        </div>
    )
}


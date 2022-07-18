import React from 'react';
import './SetupOptions.css';

export default function SetupOptions(props) {
    
    const [view, setView] = props.useView;

    const handleViewChange = (e) => {
        setView(e.target.value)
    }

    return (
        <div id="setupOptions">
            <button className={view==='byDate' ? 'selected' : 'unselected'} value="byDate" onClick={handleViewChange}>
                Select Date
            </button>
            <button className={view==='custom' ? 'selected' : 'unselected'} value="custom" onClick={handleViewChange}>
                Custom Workout
            </button>
        </div>
    )
}
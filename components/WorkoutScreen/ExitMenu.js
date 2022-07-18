import React, { useState } from 'react';

export default function ExitMenu(props) {
    const [pendingClose, setPendingClose] = useState(false);

    return (
        <div className={`exit-container closing-${pendingClose}`}>
            {pendingClose ? (
                <>
                    End Workout?
                    <div
                        onClick={() => setPendingClose(false)}
                        id="resume-workout"
                    >
                        Resume
                    </div>
                    <div
                        onClick={() => {
                            props.endWorkout();
                            setPendingClose(false);
                        }}
                        id="stop-workout"
                    >
                        End
                    </div>
                </>
            ) : (
                <div onClick={() => setPendingClose(true)} id="end-workout">
                    &#x2715;
                </div>
            )}
        </div>
    );
}

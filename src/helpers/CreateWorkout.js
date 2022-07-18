import images from '../../public/workout-logos/workout-logos';

export default function WorkoutCreator(
    year,
    month,
    day,
    workoutStyle,
    stationList = []
) {
    let style = workoutStyle;
    let displayStyle = style;
    let stations = null;
    let pods = null;
    let laps = null;
    let sets = null;
    let timing = '';
    let misc = 'N/A';
    let timeList = [];
    let stationIndex = [];
    let timeIndex = [];
    let logo = images[style] ? images[style] : images['defaultLogo'];
    const numSets = (sets, stations, laps) => sets * stations * laps * 2 - 1;

    switch (workoutStyle) {
        case 'Abacus':
            stations = 6;
            pods = 1;
            laps = 2;
            sets = 5;
            timing =
                'Lap1 - 20/10, 22/10, 24/10, 26/10, 28/15; Lap 2 - 28/10, 26/10, 24/10, 22/10, 20/15';
            misc = 'No water breaks';
            timeList = [20, 10, 22, 10, 24, 10, 26, 10, 28, 10];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                if (i % 2 === 0) {
                    //even is workout block
                    stationIndex[i] = Math.floor(i / 10) % 6; //10 is sets*2 && 6 is stations
                    if (i < numSets / 2) {
                        timeIndex[i] = i % 10;
                    } else {
                        timeIndex[i] = 8 - (i % 10);
                    }
                } else if (i % 10 === 9) {
                    stationIndex[i] = stations + 1;
                    timeIndex[i] = 9;
                } else {
                    stationIndex[i] = stations;
                    timeIndex[i] = i % 10;
                }
            }
            break;
        case 'Afterglow':
            stations = 9; // actually 9 where you do two different workouts
            pods = 1;
            laps = 3;
            sets = 1;
            timing = '3 Laps: 60/30 60/30 30/20';
            timeList = [60, 30, 60, 30, 30, 20];
            misc =
                'Combo stations. Left exercise reps: 10-9-8-... with one rep of the right workout in between';
            //Cardio workout built with a ladder style combination sequence. Work as far down the ladder as you can. The combo stations will get your heart rate into the working zone and working up a sweat!';
            //9 stations, follow the leader. 3 laps: 60/30, 60/30, 30/20. There are two exercises at each station. You do 10 reps of the one on the right (even # above), 1 rep of the one on the left (odd # above). The 1 rep exercise is fixed. The other exercise you’ll work from 10-9-8… 1 rep.
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                // from bears
                let lap = Math.floor(i / (stations * 2));
                if (i % 2 === 0) {
                    //work sets
                    stationIndex[i] = Math.floor(i / 2) % stations;
                    timeIndex[i] = 2 * lap;
                } else {
                    //all rests are next station
                    stationIndex[i] = stations + 1; //next station
                    timeIndex[i] = 2 * lap + 1;
                }
            }
            break;
        case 'Bears':
            stations = 18;
            pods = 1;
            laps = 1;
            sets = 2;
            timing = '35/10, 55/20';
            misc = 'No water breaks';
            timeList = [35, 10, 55, 20];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                if (i % 2 === 0) {
                    //work
                    stationIndex[i] = Math.floor(i / 4);
                    timeIndex[i] = i % 4;
                } else if (i % 4 === 1) {
                    //rest 1
                    stationIndex[i] = stations;
                    timeIndex[i] = 1;
                } else {
                    //rest 2
                    stationIndex[i] = stations + 1;
                    timeIndex[i] = 3;
                }
            }
            break;
        case 'Lonestar':
            stations = 12;
            pods = 1;
            laps = 2;
            sets = 2;
            timing = '30/20 20/10';
            misc =
                'Unilateral based resistance workout with a movement twist. Pivot in the opposite direction for the second lap to promote equal strength across the body.';
            timeList = [30, 20, 20, 10];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                // from bears
                if (i % 2 === 0) {
                    stationIndex[i] = Math.floor(i / 4) % stations; //added stations modulo due to multiple laps
                    timeIndex[i] = i % 4;
                } else if (i % 4 === 1) {
                    //rest 1
                    stationIndex[i] = stations;
                    timeIndex[i] = 1;
                } else {
                    //rest 2
                    stationIndex[i] = stations + 1;
                    timeIndex[i] = 3;
                }
            }
            break;
        case 'Pegasus':
            stations = 15;
            pods = 1;
            laps = 1;
            sets = 3;
            timing = '30 resistance / 20 bodyweight / 15 rest';
            timeList = [30, 20, 15];
            misc =
                '12 resistance stations. Each set followed by one of three bodyweight workouts (stations 13, 14, & 15 below) before rest.';
            for (let i = 0; i < 9 * 12 - 1; i++) {
                timeIndex[i] = i % 3; //cycle through the three times continuously
                let setOfThree = Math.floor(i / 3) % 3;
                if (i % 3 === 0) {
                    //resistance set
                    stationIndex[i] = Math.floor(i / 9);
                } else if (i % 3 === 1) {
                    //bodyweight set
                    stationIndex[i] = setOfThree + 12;
                } else if (setOfThree === 0 || setOfThree === 1) {
                    //i%3===2 && rest set 1 + 2
                    stationIndex[i] = stations;
                } else {
                    //rest set 3
                    stationIndex[i] = stations + 1;
                }
            }
            break;
        case 'Piston':
            stations = 12;
            pods = 1;
            laps = 3;
            sets = 1;
            timing = '40/20';
            timeList = [40, 20];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                timeIndex[i] = i % 2;
                if (i % 2 === 0) {
                    stationIndex[i] = Math.floor(i / 2) % stations;
                } else {
                    stationIndex[i] = stations + 1;
                }
            }
            break;
        case 'Romans':
            stations = 9;
            pods = 3;
            laps = 2;
            sets = 2;
            timing = '35/25 two sets';
            misc =
                'Two 60 second hydration breaks in-between pods. Two laps per pod before moving to next pod.';
            timeList = [35, 25, 60];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                timeIndex[i] = i % 2; //alternating 35/25 throughout except...
                if (i % 2 === 0) {
                    //work sets
                    // 1r 1r 2r 2r 3r 3r / 1r 1r 2r 2r 3r 3r
                    // 4r 4r 5r 5r 6r 6r / 4r 4r 5r 5r 6r 6r
                    // 7r 7r 8r 8r 9r 9r / 7r 7r 8r 8r 9r 9r
                    let pod = Math.floor(i / (pods * sets * laps * 2));
                    let stationWithinPod = Math.floor(
                        (i % (pods * sets * laps)) / 4
                    );
                    // console.log('Pod: ' + pod + ' Station: '+stationWithinPod)
                    stationIndex[i] = stationWithinPod + pod * pods; //added stations modulo due to multiple laps and changed to six
                    //need that laps to occur within the pod first...
                } else if (i % (sets * 2) === 1) {
                    //rest 1
                    stationIndex[i] = stations; //stay here
                } else {
                    //rest 2
                    stationIndex[i] = stations + 1; //next station
                }

                //except...
                if ((i + 1) % (sets * laps * pods * 2) === 0) {
                    //60 sec breaks (should be 2 total)
                    timeIndex[i] = 2;
                    // stationIndex[i] = stations+1;//might change to +2 and add "next pod" later
                }
            }
            break;
        case 'T10':
            stations = 10;
            pods = 1;
            laps = 4;
            sets = 1;
            timing = '40/10';
            timeList = [40, 10];
            misc = 'Exercises alternate between cardio and strength';
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                timeIndex[i] = i % 2;
                if (i % 2 === 0) {
                    //work set
                    stationIndex[i] = Math.floor((i % (2 * stations)) / 2);
                } else {
                    //rest set
                    stationIndex[i] = stations + 1; //all next station
                }
            }
            break;
        case 'Tempest':
            stations = 4 + 7;
            pods = 4;
            laps = 1;
            sets = 1;
            timing =
                '7 min AMRAP at each 4 station pod. Seven 30 sec reels between pods';
            timeList = [7 * 60, 30, 60];
            misc =
                'Each pod rotates when ski/bike/row/bench hops station hits target (beginner/advanced). As many reps as possible.';
            timeIndex = [
                0, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1,
                1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1,
            ];
            stationIndex = [
                0, 4, 5, 6, 7, 8, 9, 10, 12, 1, 4, 5, 6, 7, 8, 9, 10, 12, 2, 4,
                5, 6, 7, 8, 9, 10, 12, 3, 4, 5, 6, 7, 8, 9, 10,
            ];
            break;
        case 'Templars':
            stations = 14;
            pods = 1;
            laps = 3;
            sets = 1;
            timing = '35/15';
            misc =
                'Partner based exercises are added into this workout for added fun!';
            timeList = [35, 15];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                //this is the same as Piston (workout is almost the same but shorter sets and 2 more stations)
                timeIndex[i] = i % 2; //simple alternating between work and rest all same timing
                if (i % 2 === 0) {
                    stationIndex[i] = Math.floor(i / 2) % stations; //changed this to 14 instead of 12
                } else {
                    stationIndex[i] = stations + 1;
                }
            }
            break;
        case 'Trackstars':
        case 'Track Stars':
            displayStyle = 'Track Stars';
            stations = 18;
            pods = 1;
            laps = 1;
            sets = 2;
            timing = '90/10 60/10';
            misc = '"You go, I go" format with partner at each station.';
            timeList = [90, 10, 60, 10];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                timeIndex[i] = i % 4; //time cycles through all four continuously
                if (i % 2 === 0) {
                    //work sets
                    stationIndex[i] = Math.floor(i / 4) % stations;
                } else {
                    //rest sets
                    stationIndex[i] = stations + ((i % 4) - 1) / 2;
                }
            }
            break;
        case 'Tripledouble':
        case 'Triple Double':
            displayStyle = 'Triple Double';
            stations = 9;
            pods = 1;
            laps = 2; //2 per pod?
            sets = 3;
            timing = '30/10 30/10 30/10';
            timeList = [30, 10, 60];
            misc = '1 minute hydration between laps.';
            stationIndex = [
                0, 9, 0, 9, 0, 10, 1, 9, 1, 9, 1, 10, 2, 9, 2, 9, 2, 10, 3, 9,
                3, 9, 3, 10, 4, 9, 4, 9, 4, 10, 5, 9, 5, 9, 5, 10, 6, 9, 6, 9,
                6, 10, 7, 9, 7, 9, 7, 10, 8, 9, 8, 9, 8, 10, 0, 9, 0, 9, 0, 10,
                1, 9, 1, 9, 1, 10, 2, 9, 2, 9, 2, 10, 3, 9, 3, 9, 3, 10, 4, 9,
                4, 9, 4, 10, 5, 9, 5, 9, 5, 10, 6, 9, 6, 9, 6, 10, 7, 9, 7, 9,
                7, 10, 8, 9, 8, 9, 8,
            ];

            timeIndex = [
                0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
                1, 0,
            ];
            break;
        case 'Westhollywood':
        case 'West Hollywood':
            displayStyle = 'West Hollywood';
            stations = 27;
            pods = 1;
            laps = 2;
            sets = 1;
            timing = 'First lap: 45/15, Second Lap: 35/15';
            timeList = [45, 35, 15];
            for (let i = 0; i < numSets(sets, stations, laps); i++) {
                let lap = Math.floor(i / (stations * 2));
                let stationWithinLap = Math.floor((i % (stations * 2)) / 2);
                if (i % 2 === 0) {
                    //work set
                    stationIndex[i] = stationWithinLap;
                    timeIndex[i] = lap;
                } else {
                    //rest set
                    timeIndex[i] = 2;
                    stationIndex[i] = Math.floor((i % 4) / 2) + stations;
                }
            }
            break;
        default:
            break;
    }

    for (let i = stationList.length; i < stations; i++) {
        stationList.push('W' + (i + 1));
    }

    stationList.push('Rest-Stay Here');
    stationList.push('Rest-Next Station');
    // stationList.push('Rest-Next Pod'); //Not sure if needed yet. will need to adjust some logic elsewhere that assumes only two things have been added to the workout list.
    let setDurationList = timeIndex.map(tI => timeList[tI]);
    let duration = setDurationList.reduce((a, b) => +a + +b, [0]);
    let durationDisplay =
        duration > 3600
            ? new Date(duration * 1000).toISOString().substring(11, 19)
            : new Date(duration * 1000).toISOString().substring(14, 19);

    return {
        date: new Date(year, month - 1, day),
        style,
        displayStyle,
        stations,
        pods,
        laps,
        sets,
        timing,
        misc,
        numSets: stationIndex.length,
        stationList,
        stationIndex,
        timeList,
        timeIndex,
        setDurationList,
        durationDisplay,
        logo,
        setStationList: function setStationList(stationList) {
            this.stationList = stationList;
        },
    };
}

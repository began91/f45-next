import logo from '../F45_logos/abacus.png';

export default function Abacus(stationList=[]) {
    // const style = 'Abacus';
    const stations = 6;
    const pods = 1;
    const laps = 2;
    const sets = 5;
    const timing = 'Lap1 - 20/10, 22/10, 24/10, 26/10, 28/15; Lap 2 - 28/10, 26/10, 24/10, 22/10, 20/15';
    const misc = 'No water breaks';

    if (stationList.length === 0) {
        for (let i=0;i<stations;i++) {
            stationList.push('W'+(i+1))
        }
    }
    
    const timeList = [20,10,22,10,24,10,26,10,28,10];

    const numSets = sets*stations*laps*2-1 //*2 assumes every staion has a rest after it. -1 removes last rest station

    let stationIndex = [];
    let timeIndex = [];
    for (let i=0;i<numSets;i++) {
        if (i%2===0) {
            //even is workout block
            stationIndex[i] = Math.floor(i/10)%6;//10 is sets*2 && 6 is stations
            if (i<numSets/2) {
                timeIndex[i] = i%10;
            } else {
                timeIndex[i] = 8-(i%10)
            }
        } else if (i%10===9) {
            stationIndex[i] = stations+1;
            timeIndex[i] = 9;
        } else {
            stationIndex[i] = stations;
            timeIndex[i] = i%10;
        }
    }

    return {
        stations,
        pods,
        laps,
        sets,
        timing,
        misc,
        numSets,
        stationList,
        stationIndex,
        timeList,
        timeIndex,
        logo
    }

}
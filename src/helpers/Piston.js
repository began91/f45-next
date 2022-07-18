import logo from '../F45_logos/piston.png';

export default function Piston(stationList=[]) {
    // const style = 'Piston';
    const stations = 12;
    const pods = 1;
    const laps = 3;
    const sets = 1;
    const timing = '40/20';
    const misc = 'N/A';
    
    // if (stationList.length === 0) {
    //     for (let i=0;i<stations;i++) {
    //         stationList.push('W'+(i+1))
    //     }
    // }
    for (let i=stationList.length;i<stations;i++) {
        stationList.push('W'+(i+1));
    }

    
    // stationList.push('Rest-Stay Here')
    // stationList.push('Rest-Next Station')

    const timeList = [40,20];

    const numSets = sets*stations*pods*laps*2-1

    let stationIndex = [];
    let timeIndex = [];
    for (let i=0;i<numSets;i++) {
        timeIndex[i] = i%2;
        if (i%2===0) {
            stationIndex[i] = Math.floor(i/2) % 12;
        } else {
            stationIndex[i] = stations+1;
        }
    }

    // let setDurationList = timeIndex.map(tI=>timeList[tI]);

    return {
        // style,
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
        // setDurationList,
        logo
    }
}
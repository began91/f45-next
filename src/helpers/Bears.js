import logo from '../F45_logos/bears.png';

export default function Bears(stationList=[]) {
    // const style = 'Bears';
    const stations = 18;
    const pods = 1;
    const laps = 1;
    const sets = 2;
    const timing = '35/10, 55/20';
    const misc = 'No water breaks';
    
    for (let i=stationList.length;i<stations;i++) {
        stationList.push('W'+(i+1));
    }
    
    // stationList.push('Rest-Stay Here')
    // stationList.push('Rest-Next Station')

    const timeList = [35,10,55,20];

    const numSets = sets*stations*pods*2-1

    let stationIndex = [];
    let timeIndex = [];
    for (let i=0;i<numSets;i++) {
        if (i%2===0) {
            stationIndex[i] = Math.floor(i/4);
            timeIndex[i] = i%4;
        } else if (i%4===1) {
            stationIndex[i] = stations;
            timeIndex[i] = 1;
        } else {
            stationIndex[i] = stations+1;
            timeIndex[i] = 3;
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
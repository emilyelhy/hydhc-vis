import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import OverviewGraph from './OverviewGraph';

export default function Overview() {
    const [oldestTime, setOldestTime] = useState(1658329200000);
    const [syncTime, setSyncTime] = useState(Date.now());
    const [timeRange, setTimeRange] = useState([oldestTime, syncTime]);

    const syncData = () => {
        setSyncTime(Date.now());
        setTimeRange([oldestTime, syncTime]);
    }

    const timestampConverter = (timestamp) => {
        var date = new Date(timestamp);
        return date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') + " " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, maxHeight: 220, minHeight: 200, position: "sticky", top: 0 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingTop: 10, backgroundColor: "#00a7b5" }}>
                    <h3 style={{ paddingLeft: 20, alignSelf: "center", color: "#ffffff" }}>Overview</h3>
                    <div style={{ paddingRight: 20 }}>
                        <Button style={{ width: "75%", fontSize: 18, backgroundColor: "#11cada", borderColor: "#11cada" }} onClick={syncData}>
                            Sunc
                        </Button>
                        <h6 style={{ fontSize: 15 }}>Recent: {timestampConverter(syncTime)}</h6>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                    <h5 style={{ marginLeft: 30, marginRight: 30 }}>Data</h5>
                    <h5 style={{ marginLeft: 30, marginRight: 30 }}>Participants</h5>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <h5 style={{ marginLeft: 30, marginRight: 30, alignSelf: "center" }}>Period</h5>
                    <div style={{width: "100%", height: "100%"}}>
                        <Slider
                            min={oldestTime}
                            max={syncTime}
                            value={timeRange}
                            onChange={(_, newValue) => setTimeRange(newValue)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={value => <div>{timestampConverter(value)}</div>}
                            style={{color: "#00a7b5", paddingTop: 0, paddingBottom: 0}}
                        />
                        <h6 style={{ textAlign: "center" }}>Selected Period: {timestampConverter(timeRange[0]) + " - " + timestampConverter(timeRange[1])}</h6>
                    </div>
                    <Button style={{ marginLeft: 30, marginRight: 30, fontSize: 18, backgroundColor: "#00a7b5", borderColor: "#00a7b5", alignSelf: "center" }} onClick={syncData}>
                        Apply
                    </Button>
                </div>
            </div>
            <div style={{ flex: 6 }}>
                <OverviewGraph></OverviewGraph>
            </div>
        </div>
    )
}
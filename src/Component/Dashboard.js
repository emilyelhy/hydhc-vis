import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import PersonalInfo from "./PersonalInfo";
import MainView from "./MainView";
import Comparison from "./Comparison";

const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SELECTIONS = ["Z", "Y", "X", "W", "V", "U", "T", "S"];
const PARTICIPANTS = ["SB01", "SB02", "SB03", "SB04", "SB04", "SB05", "SB06", "SB07", "SB08"];

export default function Dashboard() {
    const timestampConverter = (timestamp) => {
        var date = new Date(timestamp);
        return date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') + " " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };

    const [updateTime, setUpdateTime] = useState(timestampConverter(Date()));
    const [timeRange, setTimeRange] = useState([0.5, 0.7]);
    const [column, setColumn] = useState(COLUMNS[0]);
    const [selection, setSelection] = useState(SELECTIONS[0]);
    const [participant, setParticipant] = useState(PARTICIPANTS[0]);

    const updateData = () => {
        setUpdateTime(timestampConverter(Date()));
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
            <div style={{ flex: 1, minWidth: 275 }}>
                <PersonalInfo participant={participant}/>
            </div>
            <div style={{ flex: 3, display: "flex", flexDirection: "column", minWidth: 900 }}>
                <div style={{ flex: 1, backgroundColor: "#8aff3c", minHeight: 210, maxHeight: 250, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                    <h2 style={{ margin: 5 }}>Visualisation System</h2>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ flex: 1, display: "flex", justifyContent: "space-around", flexDirection: "column" }}>
                            <h5>Data Update</h5>
                            <div style={{ maxWidth: "60%", alignSelf: "center" }}>
                                <Button variant="outline-secondary" onClick={updateData} style={{ height: 30 }}>Update</Button>
                            </div>
                            <div>
                                <h6 style={{ marginTop: 8, marginBottom: 0 }}>Last update:</h6>
                                <h6>{updateTime}</h6>
                            </div>
                        </div>
                        <div style={{ flex: 3, paddingLeft: 8 }}>
                            <h5 style={{ textAlign: "start" }}>Time</h5>
                            <Slider
                                min={0}
                                max={1}
                                value={timeRange}
                                onChange={(_, newValue) => setTimeRange(newValue)}
                                valueLabelDisplay="auto"
                                step={0.05}
                            />
                            <div>
                                <h6 style={{ textAlign: "start", marginTop: 4, marginBottom: 0 }}>Selected:</h6>
                                <h6 style={{ textAlign: "start" }}>{timeRange[0] + " - " + timeRange[1]}</h6>
                            </div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <h5 style={{ textAlign: "start" }}>Column</h5>
                            <DropdownButton title={column} style={{ alignSelf: "flex-start", paddingLeft: "7%" }} variant="secondary" onSelect={(sel) => setColumn(sel)}>
                                {COLUMNS.map((c) => {
                                    return <Dropdown.Item eventKey={c} key={c} value={c}>{c}</Dropdown.Item>
                                })}
                            </DropdownButton>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <h5 style={{ textAlign: "start" }}>Selection</h5>
                            <DropdownButton title={selection} style={{ alignSelf: "flex-start", paddingLeft: "7%" }} variant="secondary" onSelect={(sel) => setSelection(sel)}>
                                {SELECTIONS.map((s) => {
                                    return <Dropdown.Item eventKey={s} key={s} value={s}>{s}</Dropdown.Item>
                                })}
                            </DropdownButton>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <h5 style={{ textAlign: "start" }}>Participant</h5>
                            <DropdownButton title={participant} style={{ alignSelf: "flex-start", paddingLeft: "7%" }} variant="secondary" onSelect={(sel) => setParticipant(sel)}>
                                {PARTICIPANTS.map((p) => {
                                    return <Dropdown.Item eventKey={p} key={p} value={p}>{p}</Dropdown.Item>
                                })}
                            </DropdownButton>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 4 }}>
                    <MainView />
                </div>
            </div>
            <div style={{ flex: 3, minWidth: 900 }}>
                <Comparison />
            </div>
        </div>
    )
}
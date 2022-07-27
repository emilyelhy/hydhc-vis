import React, { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import { components } from 'react-select';
import { default as ReactSelect } from 'react-select';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import OverviewGraph from './OverviewGraph';

const OLDESTTIME = 1658329200000;
const ALLDATATYPE_OPTION = [
    { value: "bluetooth", label: "bluetooth", count: 0 },
    { value: "wifi", label: "wifi", count: 1 },
    { value: "battery", label: "battery", count: 2 },
    { value: "data_traffic", label: "data_traffic", count: 3 },
    { value: "device_event", label: "device_event", count: 4 },
    { value: "installed_app", label: "installed_app", count: 5 },
    { value: "app_usage", label: "app_usage", count: 6 },
    { value: "call_log", label: "call_log", count: 7 },
    { value: "message", label: "message", count: 8 },
    { value: "location", label: "location", count: 9 },
    { value: "fitness", label: "fitness", count: 10 },
    { value: "physical_activity", label: "physical_activity", count: 11 },
    { value: "physical_activity_transition", label: "physical_activity_transition", count: 12 },
    { value: "survey", label: "survey", count: 13 }
];

export default function Overview() {
    const [oldestTime, setOldestTime] = useState(OLDESTTIME);
    const [syncTime, setSyncTime] = useState(Date.now());
    const [timeRange, setTimeRange] = useState([oldestTime, syncTime]);
    const [dataType, setDataType] = useState(ALLDATATYPE_OPTION);
    const [participants, setParticipants] = useState([]);
    const [dynamicParticipants, setDynamicParticipants] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [dynamicData, setDynamicData] = useState([]);

    
    useEffect(() => {
        fetchAllData();
        setOldestTime(OLDESTTIME);
    }, []);
    
    const fetchAllData = async () => {
        // set full data
        const res = await fetch("http://localhost:5000/overview/synccsv");
        const data = await res.json();
        setFullData(data.data);
        setDynamicData(data.data);
        // set participants
        const temp = [];
        let count = 0;
        data.data.forEach((d) => {
            if(!temp.some(t => t.value === d.email)) temp.push({value: d.email, label: d.email, count: count});
            count = count + 1;
        });
        setParticipants(temp);
        setDynamicParticipants(temp);
    }

    const syncData = () => {
        setSyncTime(Date.now());
    };

    const timestampConverter = (timestamp) => {
        var date = new Date(timestamp);
        return date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') + " " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };

    const handleParticipantsChange = (selected) => {
        setDynamicParticipants(selected.sort((a, b) => a.count - b.count ));
        setDynamicData(fullData.filter(d => selected.some(sel => sel.value === d.email)));
    }

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "hidden" }}>
            <div style={{ flex: 1, maxHeight: 220, minHeight: 200 }}>
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
                    <div style={{ width: "15%" }}>
                        <ReactSelect
                            options={ALLDATATYPE_OPTION}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{ Option }}
                            allowSelectAll={true}
                            placeholder={dataType.length >= 2 ? "Selected " + dataType.length : "None"}
                            controlShouldRenderValue={dataType.length < 2 ? true : false}
                            onChange={(selected) => setDataType(selected.sort((a, b) => a.count - b.count ))}
                            value={dataType}
                        />
                    </div>
                    <h5 style={{ marginLeft: 30, marginRight: 30 }}>Participants</h5>
                    <div style={{ width: "15%" }}>
                        <ReactSelect
                            options={participants}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{ Option }}
                            allowSelectAll={true}
                            placeholder={dynamicParticipants.length >= 2 ? "Selected " + dynamicParticipants.length : "None"}
                            controlShouldRenderValue={dynamicParticipants.length < 2 ? true : false}
                            onChange={(selected) => handleParticipantsChange(selected)}
                            value={dynamicParticipants}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <h5 style={{ marginLeft: 30, marginRight: 30, alignSelf: "center" }}>Period</h5>
                    <div style={{ width: "100%", height: "100%" }}>
                        <Slider
                            min={oldestTime}
                            max={syncTime}
                            value={timeRange}
                            onChange={(_, newValue) => setTimeRange(newValue)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={value => <div>{timestampConverter(value)}</div>}
                        />
                        <h6 style={{ textAlign: "center" }}>Selected Period: {timestampConverter(timeRange[0]) + " - " + timestampConverter(timeRange[1])}</h6>
                    </div>
                    <Button style={{ marginLeft: 30, marginRight: 30, fontSize: 18, backgroundColor: "#00a7b5", borderColor: "#00a7b5", alignSelf: "center" }} onClick={syncData}>
                        Apply
                    </Button>
                </div>
            </div>
            <div style={{ flex: 6, overflow: "scroll" }}>
                {fullData.length === 0 ? <></> : <OverviewGraph fullData={dynamicData} dataType={dataType} participants={dynamicParticipants}></OverviewGraph>}
            </div>
        </div>
    )
}
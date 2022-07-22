import React, { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import { components } from 'react-select';
import { default as ReactSelect } from 'react-select';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import OverviewGraph from './OverviewGraph';

const OLDESTTIME = 1658329200000;
const ALLDATATYPE_OPTION = [
    { value: "data1", label: "Data 1" },
    { value: "data2", label: "Data 2" },
    { value: "data3", label: "Data 3" },
    { value: "data4", label: "Data 4" },
    { value: "data5", label: "Data 5" },
    { value: "data6", label: "Data 6" },
    { value: "data7", label: "Data 7" },
    { value: "data8", label: "Data 8" },
    { value: "data9", label: "Data 9" },
    { value: "data10", label: "Data 10" },
    { value: "data11", label: "Data 11" },
    { value: "data12", label: "Data 12" },
    { value: "data13", label: "Data 13" },
    { value: "data14", label: "Data 14" },
    { value: "data15", label: "Data 15" },
    { value: "data16", label: "Data 16" },
    { value: "data17", label: "Data 17" },
    { value: "data18", label: "Data 18" },
    { value: "data19", label: "Data 19" },
    { value: "data20", label: "Data 20" }
];
const PARTI_OPTION = [
    { value: "parti1", label: "Participant 1" },
    { value: "parti2", label: "Participant 2" },
    { value: "parti3", label: "Participant 3" },
    { value: "parti4", label: "Participant 4" },
    { value: "parti5", label: "Participant 5" },
    { value: "parti6", label: "Participant 6" },
    { value: "parti7", label: "Participant 7" },
    { value: "parti8", label: "Participant 8" },
    { value: "parti9", label: "Participant 9" },
    { value: "parti10", label: "Participant 10" },
    { value: "parti11", label: "Participant 11" },
    { value: "parti12", label: "Participant 12" },
    { value: "parti13", label: "Participant 13" },
    { value: "parti14", label: "Participant 14" },
    { value: "parti15", label: "Participant 15" },
    { value: "parti16", label: "Participant 16" },
    { value: "parti17", label: "Participant 17" },
    { value: "parti18", label: "Participant 18" },
    { value: "parti19", label: "Participant 19" },
    { value: "parti20", label: "Participant 20" }
];

export default function Overview() {
    const [oldestTime, setOldestTime] = useState(OLDESTTIME);
    const [syncTime, setSyncTime] = useState(Date.now());
    const [timeRange, setTimeRange] = useState([oldestTime, syncTime]);
    const [dataType, setDataType] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        setOldestTime(OLDESTTIME);
        setDataType(ALLDATATYPE_OPTION);
        setParticipants(PARTI_OPTION);
    }, []);

    const syncData = () => {
        setSyncTime(Date.now());
    };

    const timestampConverter = (timestamp) => {
        var date = new Date(timestamp);
        return date.getFullYear() + "-" + String((date.getMonth() + 1)).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0') + " " + String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };

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
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                            placeholder={dataType.length >= 4 ? "Multiple" : "None"}
                            controlShouldRenderValue={dataType.length < 4 ? true : false}
                            onChange={(selected) => setDataType(selected)}
                            value={dataType}
                        />
                    </div>
                    <h5 style={{ marginLeft: 30, marginRight: 30 }}>Participants</h5>
                    <div style={{ width: "15%" }}>
                        <ReactSelect
                            options={PARTI_OPTION}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{ Option }}
                            allowSelectAll={true}
                            placeholder={participants.length >= 3 ? "Multiple" : "None"}
                            controlShouldRenderValue={participants.length < 3 ? true : false}
                            onChange={(selected) => setParticipants(selected)}
                            value={participants}
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
            <div style={{ flex: 6, overflowY: "scroll" }}>
                <OverviewGraph></OverviewGraph>
            </div>
        </div>
    )
}
import React from 'react';

export default function PersonalInfo(props) {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <div style={{flex: 1, maxHeight: 250, minHeight: 210,}}></div>
            <div style={{flex: 4, backgroundColor: "#ff3d40"}}>
                <h4>Personal Information</h4>
                <h6>{props.participant}</h6>
            </div>
        </div>
    )
}
import React from 'react';

export default function Comparison() {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <div style={{flex: 1, backgroundColor: "#00ffff", maxHeight: 250, minHeight: 210,}}>
                <h4>Setting for Comparison</h4>
            </div>
            <div style={{flex: 4, backgroundColor: "#7bbbff"}}>
                <h4>Graphs from Comparison</h4>
            </div>
        </div>
    )
}
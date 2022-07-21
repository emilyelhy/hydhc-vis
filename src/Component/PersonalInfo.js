import React, { useState, useEffect } from 'react';

export default function PersonalInfo(props) {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/personal");
            const data = await res.json();
            console.log(data);
            setData({ participant: data.participant });
        }
        fetchData();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div style={{ flex: 1, maxHeight: 250, minHeight: 210 }}></div>
            <div style={{ flex: 4, backgroundColor: "#ff3d40" }}>
                <h4>Personal Information</h4>
                <h6>{data.participant}</h6>
            </div>
        </div>
    )
}
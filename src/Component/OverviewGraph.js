import React, { useEffect, useState } from 'react';

export default function OverviewGraph() {
    const [fullData, setFullData] = useState([]);
    
    useEffect(() => {
        const fetchAllData = async () => {
            const res = await fetch("http://localhost:5000/overview/synccsv");
            const data = await res.json();
            console.log(data.data);
            setFullData(data.data);
        }
        fetchAllData();
    }, []);

    return (
        <div style={{ backgroundColor: "#7bbbff", height: 10000 }}>
            <h2>OverviewGraph</h2>
        </div>
    )
}
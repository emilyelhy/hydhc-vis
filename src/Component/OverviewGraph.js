import React, { useEffect, useState, useRef } from 'react';
import * as mui from '@mui/material';
import * as d3 from 'd3';

const SVG_WIDTH = 3300;
const MARGIN = { top: 20, right: 20, bottom: 20, left: 230 };
const ENTIRE_KEYS = [
    { internalName: 'bluetooth', displayName: "BLUETOOTH", posOffset: 91, color: "#E69138" },
    { internalName: 'wifi', displayName: "WIFI", posOffset: 33, color: "#E69138" },
    { internalName: 'battery', displayName: "BATTERY", posOffset: 70, color: "#F2BA4E" },
    { internalName: 'data_traffic', displayName: "DATA TRAFFIC", posOffset: 108, color: "#F2BA4E" },
    { internalName: 'device_event', displayName: "DEVICE EVENT", posOffset: 108, color: "#F2BA4E" },
    { internalName: 'installed_app', displayName: "INSTALLED APP", posOffset: 118, color: "#F2BA4E" },
    { internalName: 'app_usage', displayName: "APP USAGE", posOffset: 88, color: "#F2BA4E" },
    { internalName: 'call_log', displayName: "CALL LOG", posOffset: 73, color: "#5EA280" },
    { internalName: 'message', displayName: "MESSAGE", posOffset: 74, color: "#5EA280" },
    { internalName: 'location', displayName: "LOCATION", posOffset: 76, color: "#397CB2" },
    { internalName: 'fitness', displayName: "FITNESS", posOffset: 63, color: "#397CB2" },
    { internalName: 'physical_activity', displayName: "PHYSICAL ACTIVITY", posOffset: 152, color: "#397CB2" },
    { internalName: 'physical_activity_transition', displayName: "TRANSITION", posOffset: 94, color: "#397CB2" },
    { internalName: 'survey', displayName: "SURVEY", posOffset: 61, color: "#7357B9" }
];

export default function OverviewGraph(props) {
    const svgRef = useRef();
    const [fullData, setFullData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [margin, setMargin] = useState({});
    const [showData, setShowData] = useState([]);
    const [dataType, setDataType] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [svgSize, setSVGSize] = useState({ width: 3300, height: 100 });

    // for getting sync data
    useEffect(() => {
        const temp = [];
        props.dataType.forEach((d) => {
            let id = ENTIRE_KEYS.find((key) => key.internalName === d.value);
            if (id) temp.push(id);
        });
        setDataType(temp);
        setParticipants(props.participants);
        setFullData(props.fullData);
    }, [props]);

    // for setting data with required param
    useEffect(() => {
        const temp = fullData.filter(row => { return row['day'] === "23-11-21" });
        setShowData(temp);
        setSVGSize({ width: SVG_WIDTH, height: temp.length * 50 });
        setMargin(MARGIN);
        if (fullData != null) setLoading(false);
    }, [fullData]);

    // for rendering count bar chart
    useEffect(() => {
        if (!loading && svgRef.current) {
            const svg = d3.select(svgRef.current)
                .attr("height", svgSize.height - margin.top - margin.bottom)
                .attr("width", SVG_WIDTH - margin.left - margin.right)
                .attr("viewBox", [0 - margin.left, 0, svgSize.width, svgSize.height + 190]);

            const x = d3.scaleLinear();
            const y = d3.scaleBand()
                .paddingInner(0.05)
                .align(0.1)
                .domain(showData.map(d => d.email))
                .rangeRound([0, svgSize.height]);

            for (let i = 0; i < dataType.length; i++) {
                x.domain([0, d3.max(showData, d => Number(d[dataType[i].internalName]))])
                    .range([0, 70]);
                svg.selectAll("#bars")
                    .append("g")
                    .attr("class", "appended")
                    .data(showData)
                    .enter()
                    .append("rect")
                    .attr("x", x(0) + 200 * i + 10)
                    .attr("y", d => y(d.email) + margin.top + margin.bottom)
                    .attr("width", d => x(Number(d[dataType[i].internalName])))
                    .attr("height", 25)
                    .attr("fill", dataType.find((key) => key.internalName === dataType[i].internalName).color);
            }
            return () => {
                svg.selectAll("#bars > *").remove();
            }
        }
    }, [loading, svgSize, margin, showData, dataType]);

    // // for rendering all graph components other than bars
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const y = d3.scaleBand()
            .domain(participants.map(p => p.value))
            .range([0, svgSize.height]);

        // yAxis(email name)
        function yAxis(g) {
            g.attr("transform", "translate(0, 30)")
                .call(d3.axisLeft(y)
                    .tickSizeOuter(0)
                    .tickSizeInner(0)
                )
                .selectAll('text')
                .attr("x", -10)
                .style("font", "13px Roboto");
        }
        svg.append("g").call(yAxis);

        // gray horizontal lines
        for (let j = 0; j < showData.length + 2; j++) {
            svg.append('path').attr('class', 'appended')
                .attr('width', svgSize.width - margin.left - margin.right)
                .attr('stroke', '#cccccc')
                .attr('stroke-width', '0.5')
                .attr('d', 'M 20 ' + (j * 50 - 2) + ' L' + (svgSize.width - margin.left - margin.right) + ' ' + (j * 50 - 2) + 'H 10')
                .attr("transform", "translate(" + (-margin.left) + ", " + (-margin.top) + ")");
        }

        // data type label
        svg.selectAll("#data-type")
            .append("g")
            .attr("class", "appended-columnhead")
            .data(dataType.map(key => key.displayName))
            .enter()
            .append("text")
            .style("font", "16px Roboto-Black")
            .style("fill", '#4a4a4a')
            .text(d => d)
            .attr("x", (d, i) => 200 * i + 100 - (dataType.find((key) => key.displayName === d).posOffset / 2) )
            .attr("transform", "translate(0, " + (-margin.top - 10) + ")");

        // rendering text: count
        svg.selectAll("#count-label")
            .append("g")
            .data(dataType)
            .enter()
            .append("text")
            .style("font", "14px Roboto-Medium")
            .style("fill", '#4a4a4a')
            .text("COUNT")
            .attr("x", (_, i) => 20 + 200 * i + 10 )
            .attr("transform", "translate(0, " + (margin.top) + ")");

        // rendering text: value
        svg.selectAll("#value-label")
            .append("g")
            .data(dataType)
            .enter()
            .append("text")
            .style("font", "14px Roboto-Medium")
            .style("fill", '#4a4a4a')
            .text("VALUE")
            .attr("x", (_, i) => 110 + 200 * i + 10 )
            .attr("transform", "translate(0, " + (margin.top) + ")");

        // clear old graphs
        return () => {
            svg.selectAll("*").remove();
        }
    }, [showData, svgSize, margin, dataType]);

    return (
        <div className="fragment">
            {loading ?
                <mui.Backdrop sx={{ color: '#ffffff' }} open={true} >
                    <mui.CircularProgress color="inherit" />
                </mui.Backdrop>
                :
                <svg ref={svgRef} width={SVG_WIDTH}>
                    <g id="data-type"></g>
                    <g id="count-label"></g>
                    <g id="value-label"></g>
                    <g id="bars"></g>
                </svg>
            }
        </div>
    )
}
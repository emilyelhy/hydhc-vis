import React, { useEffect, useState, useRef } from 'react';
import * as mui from '@mui/material';
import * as d3 from 'd3';

const SVG_WIDTH = 3300;
const MARGIN = { top: 20, right: 20, bottom: 20, left: 230 };
const ENTIRE_KEYS = [
    'bluetooth', 'wifi', 'battery', 'data_traffic', 'device_event',
    'installed_app', 'app_usage', 'call_log', 'message', 'location',
    'fitness', 'physical_activity', 'physical_activity_transition', 'survey'];

export default function OverviewGraph() {
    const svgRef = useRef();
    const [fullData, setFullData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [margin, setMargin] = useState({});
    const [showData, setShowData] = useState([]);
    const [svgSize, setSVGSize] = useState({ width: 3300, height: 100 });

    // for getting sync data
    useEffect(() => {
        const fetchAllData = async () => {
            const res = await fetch("http://localhost:5000/overview/synccsv");
            const data = await res.json();
            setFullData(data.data);
        }
        fetchAllData();
    }, []);

    // for setting data with required param
    useEffect(() => {
        const temp = fullData.filter(row => { return row['day'] === "23-11-21" });
        setShowData(temp);
        setSVGSize({ width: SVG_WIDTH, height: temp.length * 50 });
        setLoading(false);
        setMargin(MARGIN);
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
                .domain(showData.map(d => { return d.email; }))
                .rangeRound([0, svgSize.height]);

            for (let i = 0; i < ENTIRE_KEYS.length; i++) {
                x.domain([0, d3.max(showData, d => { return Number(d[ENTIRE_KEYS[i]]); })])
                    .range([0, 70]);
                svg.selectAll("g")
                    .append("g")
                    .attr("class", "appended")
                    .data(showData)
                    .enter()
                    .append("rect")
                    .attr("x", x(0) + 200 * i + 10)
                    .attr("y", d => y(d.email) + margin.top + margin.bottom)
                    .attr("width", d => x(Number(d[ENTIRE_KEYS[i]])))
                    .attr("height", 25)
            }
        }
    }, [loading, svgSize, margin, showData]);

    // for rendering xAxis label
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("g")
            .append("g")
            .attr("class", "appended-columnhead")
            .data(ENTIRE_KEYS)
            .enter()
            .append("text")
            .style("font", "16px Roboto-Black")
            .style("fill", '#4a4a4a')
            .text(d => { return d })
            .attr("x", (d, i) => { return 200 * i + 100 - (d.length * 10 / 2) })
            .attr("transform", "translate(0, " + 0 + ")")
    })

    // for rendering email name and gray horizontal lines + clearing prev rendered graph
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const y = d3.scaleBand()
            .paddingInner(0.05)
            .align(0.1)
            .domain(showData.map(d => { return d.email; }))
            .rangeRound([0, svgSize.height]);
        // yAxis(email name)
        function yAxis(g) {
            g.attr("transform", "translate(0, " + 30 + ")")
                .attr("class", "appended-yaxis")
                .call(d3.axisLeft(y)
                    .tickSizeOuter(0)
                    .tickSizeInner(0)
                )
                .selectAll('text')
                .attr("x", -10)
                .style("font", "13px Roboto")
                .attr("transform", "translate(0, " + (0) + ")")
        }
        svg.append("g").call(yAxis);
        // gray horizontal lines
        for (let j = 0; j < showData.length + 1; j++) {
            svg.append('path').attr('class', 'appended')
                .attr('width', svgSize.width - margin.left - margin.right)
                .attr('stroke', '#cccccc')
                .attr('stroke-width', '0.5')
                .attr('d', 'M 20 ' + (j * 50 - 2) + ' L' + (svgSize.width - margin.left - margin.right) + ' ' + (j * 50 - 2) + 'H 10')
                .attr("transform", "translate(0, " + (margin.top + 10) + ")")
        }
        // clear old graphs
        return () => {
            svg.selectAll("*").remove()
        }
    }, [showData, svgSize, margin]);

    return (
        <div className="fragment">
            {loading ?
                <mui.Backdrop sx={{ color: '#ffffff' }} open={true} >
                    <mui.CircularProgress color="inherit" />
                </mui.Backdrop>
                :
                <svg ref={svgRef} width={SVG_WIDTH}>
                </svg>
            }
        </div>
    )
}
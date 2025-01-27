import './App.css'
import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

function App() {
 const [data, setData] = useState(null);
 const svgRef = useRef();

  useEffect(() => {
    async function fetchData() {
     try {
      const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
       if (response.ok) {
        const data = await response.json();
        setData(data);
       }
     } catch (error) {
      console.error('Error fetching data: ', error);
     }
    }
    fetchData();
    console.log(data)
  }, [])
  
  useEffect(() => {
   if (!data) return;

   const svg = d3.select(svgRef.current);
  
   const width = 800;
   const height = 400;
   const margin = { top: 40, right: 40, bottom: 60, left: 60};

   const dataSet = data.data.map(d => {
    return{
      date: new Date(d[0]),
      value: d[1]
    }
   })
   
   svg.attr('width', width)
   .attr('height', height)
   .style('outline', '1px solid black');

   const xScale = d3.scaleTime()
   .domain([d3.min(dataSet, d => d.date), d3.max(dataSet, d => d.date)])
   .range([margin.left, width - margin.right]);

   const yScale = d3.scaleLinear()
   .domain([0, d3.max(dataSet, d => d.value)])
   .range([height - margin.bottom, margin.top])
   
  const xAxis = d3.axisBottom(xScale)
   .ticks(10)
   .tickFormat(d3.timeFormat('%Y'));

  const yAxis = d3.axisLeft(yScale)
   .ticks(10)
   .tickFormat(d3.format('0.2s'))

   
  svg.append('g')
  .attr('transform', `translate(0, ${height - margin.bottom})`)
  .call(xAxis)
  
  svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .call(yAxis)
  
  svg.selectAll('rect')
  .data(dataSet)
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.date))
  .attr('y', d => yScale(d.value))
  .attr('width', (width - margin.left - margin.right) / dataSet.length)
  .attr('height', d => height - margin.bottom - yScale(d.value))



  }, [data])


   

  return <>
   <svg ref={svgRef}></svg>
    </>
}

export default App

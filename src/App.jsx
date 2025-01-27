import './App.css'
import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

function App() {
 const [data, setData] = useState(null);
 const svgRef = useRef();

const height = 500;
const width = 800;
const margin = { top: 20, right: 20, bottom: 40, left: 60 };  // Increased left margin

useEffect(() => {
  async function fetchData() {
    try {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
     if (response.ok) {
      const data = await response.json();
      setData(data);
     }
    } catch (err) {
      console.error(`There was an error fetching the data: ${err}`);
    }
  }
  fetchData();
}, []);

 console.log(data);

useEffect(() => {
 if (!data) return;

 const svg = d3.select(svgRef.current)
 .attr('width', width)
 .attr('height', height)
 .attr('class', 'svg-container')
  
 svg.selectAll('*').remove();  

 const dataSet  = data.data.map(item => [new Date(item[0]), item[1]]);

 // Log data to verify values
 console.log('Dataset values:', dataSet.map(d => d[1]));

 const xScale = d3.scaleTime()
  .domain([d3.min(dataSet, d => d[0]), d3.max(dataSet, d => d[0])])  
  .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
  .domain([0, 20000])  
  .range([height - margin.bottom, margin.top]);  

  // Format Y-axis with proper number formatting
  const yAxis = d3.axisLeft(yScale)
  .ticks(10)  // Set number of tick marks
  .tickFormat(d => `$${(d/1000).toFixed(1)}K`); // Convert to thousands

  // Add Y-axis to SVG
  svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .call(yAxis);

  svg.append('text')
  .attr('x', width / 2)
  .attr('y', margin.top + 20)
  .attr('text-anchor', 'middle')
  .style('font-size', '1.5em')
  .style('font-weight', 'bold')
  .style('font-family', 'Arial')
  .text('GDP in the United States (1947 - 2015)')

  svg.append('text')
  .attr('x', 45)
  .attr('y', 320)
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90, 20, 250)')
  .style('font-size', '1em')
  .style('font-weight', 'bold')

  .text("GDP in Billions of Dollars")

  // Create axes
  const xAxis = d3.axisBottom(xScale);

   // Create bars
   svg.selectAll('rect')
   .data(dataSet)
   .enter()
   .append('rect')
   .attr('x', (d) => xScale(d[0]))
   .attr('y', d => yScale(d[1]))
   .attr('width', (width - margin.right - margin.left) / dataSet.length)  
   .attr('height', d => height - margin.bottom - yScale(d[1]))  
   .attr('fill', 'green')
   .style('margin-right', '20')
   .attr('class', 'bar')
   .on('mouseover', function(event, d) {
    const date = d[0].toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const gdp = d[1].toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
     
    tooltip
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0.9)
    .html(`${date} <br> $${gdp} Billion`)
    .style('left', event.pageX + 10 + 'px')
    .style('top', event.pageY - 28 + 'px')
   })
   .on('mouseout', function() {
    tooltip.style('opacity', 0)
   })
  

   svg.append('text')
   .attr('x', width - margin.right - 335)
   .attr('y', height - margin.bottom + 40)
   .style('font-size', '0.8em')
   .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')

   svg.append('g')
   .attr('transform', `translate(0, ${height - margin.bottom})`)
   .call(xAxis);

}, [data]);
  

  return (
    <>
     <svg ref={svgRef}></svg>
    </>
  )
}

export default App

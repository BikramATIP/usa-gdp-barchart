import './App.css'
import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'

function App() {
 const [data, setData] = useState(null);
 const svgRef = useRef();

const height = 500;
const width = 800;
const padding = 60;

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

 d3.select(svgRef.current).selectAll('*').remove();
 
const dataSet  = data.data.map(item => [new Date(item[0]), item[1]]);

console.log(dataSet);

 const xScale = d3.scaleTime();


}, [data]);
  

  return (
    <>
     <svg ref={svgRef}></svg>
    </>
  )
}

export default App

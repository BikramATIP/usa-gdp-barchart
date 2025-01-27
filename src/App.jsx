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



   

  return <>
   <svg ref={svgRef}></svg>
    </>
}

export default App

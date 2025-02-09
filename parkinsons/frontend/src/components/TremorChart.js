import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const TremorChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: "tremor-chart",
        type: "line", // Change to 'bar', 'area', etc. if needed
        zoom: {
          enabled: true,      // Enable zooming
          type: 'x',          // Zoom along the x-axis
        },
        toolbar: {
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      xaxis: {
        // If your timestamps can be converted to date objects, consider using type: "datetime"
        // type: "datetime",
        categories: [], // Time intervals or timestamps will be populated here
        title: {
          text: "Time Intervals",
        },
      },
      yaxis: {
        title: {
          text: "PC1 FFT Energy",
        },
      },
      title: {
        text: "Tremor Data Visualization",
        align: "center",
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tremor data from the backend running on port 4000
        const tremorResponse = await axios.get("http://localhost:4000/api/tremor");
        const tremorData = tremorResponse.data;

        // Extract timestamps and PC1 FFT energy values from the tremor data
        const timestamps = tremorData.map(
          (data) => `${data.start_timestamp} - ${data.end_timestamp}`
        );
        const pc1EnergyValues = tremorData.map((data) => data.PC1_fft_energy);

        // Use a functional update to set the new chart data
        setChartData((prevData) => ({
          ...prevData,
          options: {
            ...prevData.options,
            xaxis: {
              ...prevData.options.xaxis,
              categories: timestamps,
            },
          },
          series: [
            {
              name: "PC1 FFT Energy",
              data: pc1EnergyValues,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching data for the chart:", error);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Tremor Data Visualization</h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line" // Change to 'bar' or 'area' if needed
        width="800"
      />
    </div>
  );
};

export default TremorChart;

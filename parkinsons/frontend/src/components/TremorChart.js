import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const TremorChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: "tremor-chart",
        type: "line",
        zoom: {
          enabled: true,
          type: 'x',
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
        categories: [],
        title: {
          text: "Time Intervals",
        },
      },
      yaxis: {
        title: {
          text: "PC1 FFT Energy for patient 1",
        },
      },
      title: {
        text: "Tremor Data Visualization",
        align: "center",
      },
      annotations: {
        xaxis: [],
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tremor data from your backend
        const tremorResponse = await axios.get("http://localhost:4000/api/tremor");
        const tremorData = tremorResponse.data;

        // Extract x-axis labels (timestamp intervals) and PC1_fft_energy values
        const timestamps = tremorData.map(
          (data) => `${data.start_timestamp} - ${data.end_timestamp}`
        );
        const pc1EnergyValues = tremorData.map((data) => data.PC1_fft_energy);

        // Find the maximum PC1_fft_energy and its index
        const maxEnergy = Math.max(...pc1EnergyValues);
        const maxIndex = pc1EnergyValues.indexOf(maxEnergy);
        // Get the category (time interval) at the index of the maximum value
        const peakCategory = timestamps[maxIndex];

        // Update the chart data, including a vertical line (annotation) at the peak
        setChartData((prevData) => ({
          ...prevData,
          options: {
            ...prevData.options,
            xaxis: {
              ...prevData.options.xaxis,
              categories: timestamps,
            },
            annotations: {
              xaxis: [
                {
                  x: peakCategory,
                  borderColor: "red",
                  strokeDashArray: 4,
                  label: {
                    borderColor: "red",
                    style: {
                      color: "#fff",
                      background: "red",
                    },
                    text: `Peak: ${maxEnergy.toFixed(2)}`,
                  },
                },
              ],
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

    fetchData(); // Runs once on component mount
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default TremorChart;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Chart from "react-apexcharts";

// const TremorChart = () => {
//   const [chartData, setChartData] = useState({
//     series: [],
//     options: {
//       chart: {
//         id: "tremor-chart",
//         type: "line", // Change to 'bar', 'area', etc. if needed
//         zoom: {
//           enabled: true,      // Enable zooming
//           type: 'x',          // Zoom along the x-axis
//         },
//         toolbar: {
//           tools: {
//             zoom: true,
//             zoomin: true,
//             zoomout: true,
//             pan: true,
//             reset: true,
//           },
//         },
//       },
//       xaxis: {
//         // If your timestamps can be converted to date objects, consider using type: "datetime"
//         // type: "datetime",
//         categories: [], // Time intervals or timestamps will be populated here
//         title: {
//           text: "Time Intervals",
//         },
//       },
//       yaxis: {
//         title: {
//           text: "PC1 FFT Energy for patient 1",
//         },
//       },
//       title: {
//         text: "Tremor Data Visualization",
//         align: "center",
//       },
//     },
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch tremor data from the backend running on port 4000
//         const tremorResponse = await axios.get("http://localhost:4000/api/tremor");
//         const tremorData = tremorResponse.data;

//         // Extract timestamps and PC1 FFT energy values from the tremor data
//         const timestamps = tremorData.map(
//           (data) => `${data.start_timestamp} - ${data.end_timestamp}`
//         );
//         const pc1EnergyValues = tremorData.map((data) => data.PC1_fft_energy);

//         // find max
//         const maxEnergy = Math.max(...pc1EnergyValues);

//         // Use a functional update to set the new chart data
//         setChartData((prevData) => ({
//           ...prevData,
//           options: {
//             ...prevData.options,
//             xaxis: {
//               ...prevData.options.xaxis,
//               categories: timestamps,
//             },
//           },
//           // annotations

//           series: [
//             {
//               name: "PC1 FFT Energy",
//               data: pc1EnergyValues,
//             },
//           ],
//         }));
//       } catch (error) {
//         console.error("Error fetching data for the chart:", error);
//       }
//     };

//     fetchData(); // Fetch data when the component mounts
//   }, []); // Empty dependency array ensures this runs only once


// return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <Chart
//         options={chartData.options}
//         series={chartData.series}
//         type="line"
//         width="100%"
//         height="100%"
//       />
//     </div>
//   );
  
// };

// export default TremorChart;

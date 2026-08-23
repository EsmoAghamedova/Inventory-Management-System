import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function MyChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: "pie",

      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],

        datasets: [
          {
            label: "pieChart",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },

      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
}

export default MyChart;

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  elements,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ cryptoName, data }) {
  const options = {
    responsive: true,
    drawTicks: false,
    pointStyle: false,
    onResize : function(chart, size) {
      chart.options.scales.x.ticks.maxTicksLimit = Math.ceil(size.width / 100);
    },
    elements: {
      line: {
        borderWidth: 1,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        
        text: `Évolution : ${cryptoName}`,
        color: 'rgba(255, 255, 255, 1)'
      },
      
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.32)',
        },
      },
      y: {
        ticks: {
          color: 'white',

        },
        grid: {
          color: 'rgba(255, 255, 255, 0.32)',
        },
      },
    },
  };

  const chartData = {
    labels: data && data.prices ? data.prices.map((price) => new Date(price[0]).toLocaleDateString()) : [],
    datasets: [
      {
        label: 'Prix',
        data: data && data.prices ? data.prices.map((price) => price[1]) : [],
        borderColor: 'rgba(238, 183, 9, 1)',
        backgroundColor: 'rgba(238, 183, 9, 0.5)',
        tension: 1,
      },
      {
        label: 'Volume Total',
        data: data && data.total_volumes ? data.total_volumes.map((volume) => volume[1]) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 1,
      },
      {
        label: 'Capitalisation',
        data: data && data.market_caps ? data.market_caps.map((caps) => caps[1]) : [],
        borderColor: 'rgba(125, 255, 34, 1)',
        backgroundColor: 'rgba(125, 255, 34, 0.5)',
        tension: 0.4,
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};

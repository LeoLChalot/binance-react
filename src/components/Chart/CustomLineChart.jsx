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

export default function LineChart({ data }) {
  let { processedData, cryptoId } = data;
  cryptoId = cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1).toLowerCase()

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Évolution des prix : ${cryptoId}`,
        color: 'rgba(238, 183, 9, 1)'
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
    labels: processedData.map(({ date }) => date),
    datasets: [
      {
        label: 'Prix de clôture',
        data: processedData.map(({ close }) => close),
        borderColor: 'rgba(238, 183, 9, 1)',
        backgroundColor: 'rgb(255, 255, 255)',
        tension: 0.4,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};

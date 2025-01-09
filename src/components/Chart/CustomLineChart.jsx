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
  console.log('LineChart data:', data); // Log data passed to LineChart

  // Options d'affichage et de mise en forme
  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution des prix (Prix de clôture)',
      },
    }
  };

  // Formattage des données du graphique
  const chartData = {
    labels: data.map(({ date }) => date), // Labels de l'axe X
    datasets: [
      {
        label: 'Prix de clôture',
        data: data.map(({ close }) => close),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};

import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartCardProps {
  title: string;
  data: number[];
  labels: string[];
  gradient?: 'green' | 'purple';
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  data, 
  labels, 
  gradient = 'green' 
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const primaryColor = gradient === 'green' ? '#00FFBF' : '#A259FF';

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: primaryColor,
        pointBorderColor: primaryColor,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: primaryColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="group p-6 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass hover:shadow-glass-hover transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-white/10 text-gray-400 hover:text-primary-green rounded-full transition-colors">1D</button>
          <button className="px-3 py-1 text-xs bg-primary-green/20 text-primary-green rounded-full">1W</button>
          <button className="px-3 py-1 text-xs bg-white/10 text-gray-400 hover:text-primary-green rounded-full transition-colors">1M</button>
          <button className="px-3 py-1 text-xs bg-white/10 text-gray-400 hover:text-primary-green rounded-full transition-colors">1Y</button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ChartCard;
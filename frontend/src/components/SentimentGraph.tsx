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

interface SentimentGraphProps {
  data: number[];
  labels: string[];
  title?: string;
}

const SentimentGraph: React.FC<SentimentGraphProps> = ({ 
  data, 
  labels, 
  title = "Market Sentiment Analysis" 
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sentiment Score',
        data,
        borderColor: '#00FFBF',
        backgroundColor: 'rgba(0, 255, 191, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00FFBF',
        pointBorderColor: '#00FFBF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#00FFBF',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
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
        backgroundColor: 'rgba(13, 13, 13, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00FFBF',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        callbacks: {
          title: (context: any) => {
            return `${context[0].label}`;
          },
          label: (context: any) => {
            const value = context.parsed.y;
            let sentiment = 'Neutral';
            if (value > 0.6) sentiment = 'Very Bullish';
            else if (value > 0.3) sentiment = 'Bullish';
            else if (value < -0.3) sentiment = 'Bearish';
            else if (value < -0.6) sentiment = 'Very Bearish';
            
            return `Sentiment: ${sentiment} (${value.toFixed(3)})`;
          },
        },
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
        min: -1,
        max: 1,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            if (value === 1) return 'Very Bullish';
            if (value === 0.5) return 'Bullish';
            if (value === 0) return 'Neutral';
            if (value === -0.5) return 'Bearish';
            if (value === -1) return 'Very Bearish';
            return value;
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="p-6 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-primary-green rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Live</span>
          <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Sentiment Legend */}
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Very Bearish</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Bearish</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span>Neutral</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary-green rounded-full"></div>
          <span>Bullish</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary-purple rounded-full"></div>
          <span>Very Bullish</span>
        </span>
      </div>
    </div>
  );
};

export default SentimentGraph;
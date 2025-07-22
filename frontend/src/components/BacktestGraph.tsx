import React, { useRef } from 'react';
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

interface BacktestGraphProps {
  twapData: number[];
  sentimentData: number[];
  hybridData: number[];
  labels: string[];
  title?: string;
}

const BacktestGraph: React.FC<BacktestGraphProps> = ({ 
  twapData, 
  sentimentData, 
  hybridData, 
  labels, 
  title = "Strategy Backtest Comparison" 
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'TWAP Strategy',
        data: twapData,
        borderColor: '#00FFBF',
        backgroundColor: 'rgba(0, 255, 191, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#00FFBF',
        pointBorderColor: '#00FFBF',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Sentiment Strategy',
        data: sentimentData,
        borderColor: '#A259FF',
        backgroundColor: 'rgba(162, 89, 255, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#A259FF',
        pointBorderColor: '#A259FF',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Hybrid Strategy',
        data: hybridData,
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: '#FF6B6B',
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
        display: true,
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00FFBF',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
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
            return `Period: ${context[0].label}`;
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const roi = ((value - 10000) / 10000 * 100).toFixed(2);
            return `${context.dataset.label}: $${value.toLocaleString()} (${roi}% ROI)`;
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
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Calculate performance metrics
  const calculateMetrics = (data: number[]) => {
    const initialValue = data[0];
    const finalValue = data[data.length - 1];
    const roi = ((finalValue - initialValue) / initialValue * 100).toFixed(2);
    const maxValue = Math.max(...data);
    const maxDrawdown = (((maxValue - Math.min(...data.slice(data.indexOf(maxValue)))) / maxValue) * 100).toFixed(2);
    
    return { roi, maxDrawdown, finalValue };
  };

  const twapMetrics = calculateMetrics(twapData);
  const sentimentMetrics = calculateMetrics(sentimentData);
  const hybridMetrics = calculateMetrics(hybridData);

  return (
    <div className="p-6 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-primary-green/20 text-primary-green rounded-full">1M</button>
          <button className="px-3 py-1 text-xs bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors">3M</button>
          <button className="px-3 py-1 text-xs bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors">1Y</button>
        </div>
      </div>
      
      <div className="h-80 w-full mb-6">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-primary-green font-medium mb-2">TWAP Strategy</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ROI:</span>
              <span className="text-white">{twapMetrics.roi}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Drawdown:</span>
              <span className="text-white">{twapMetrics.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Final Value:</span>
              <span className="text-white">${twapMetrics.finalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-primary-purple font-medium mb-2">Sentiment Strategy</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ROI:</span>
              <span className="text-white">{sentimentMetrics.roi}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Drawdown:</span>
              <span className="text-white">{sentimentMetrics.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Final Value:</span>
              <span className="text-white">${sentimentMetrics.finalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-red-400 font-medium mb-2">Hybrid Strategy</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ROI:</span>
              <span className="text-white">{hybridMetrics.roi}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Drawdown:</span>
              <span className="text-white">{hybridMetrics.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Final Value:</span>
              <span className="text-white">${hybridMetrics.finalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestGraph;
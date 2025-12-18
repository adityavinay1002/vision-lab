import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramDisplayProps {
  histograms: number[][] | null;
  title: string;
  isDark: boolean;
}

export function HistogramDisplay({ histograms, title, isDark }: HistogramDisplayProps) {
  if (!histograms) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
            No histogram data
          </div>
        </div>
      </div>
    );
  }

  const labels = Array.from({ length: 256 }, (_, i) => i.toString());

  const data = {
    labels,
    datasets: [
      {
        label: 'Red',
        data: histograms[0],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 0,
      },
      {
        label: 'Green',
        data: histograms[1],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 0,
      },
      {
        label: 'Blue',
        data: histograms[2],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#e5e7eb' : '#374151',
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          color: isDark ? '#4b5563' : '#d1d5db',
        },
      },
      y: {
        display: true,
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: 10,
          },
        },
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
        border: {
          color: isDark ? '#4b5563' : '#d1d5db',
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
        <div className="h-48">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

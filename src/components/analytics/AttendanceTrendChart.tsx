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
import { Line } from 'react-chartjs-2';

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

interface AttendanceTrendChartProps {
  data: {
    subjectId: string;
    subjectName: string;
    data: { date: string; percentage: number }[];
  }[];
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const chartData = {
    labels: data[0]?.data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: data.map((subject, index) => ({
      label: subject.subjectName,
      data: subject.data.map(d => d.percentage),
      borderColor: [
        'rgb(147, 51, 234)',  // Violet
        'rgb(59, 130, 246)',   // Blue  
        'rgb(16, 185, 129)',   // Emerald
        'rgb(251, 146, 60)',   // Amber
        'rgb(239, 68, 68)',    // Red
      ][index % 5],
      backgroundColor: [
        'rgba(147, 51, 234, 0.1)',
        'rgba(59, 130, 246, 0.1)',
        'rgba(16, 185, 129, 0.1)',
        'rgba(251, 146, 60, 0.1)',
        'rgba(239, 68, 68, 0.1)',
      ][index % 5],
      tension: 0.4,
      fill: true,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Attendance Trends Over Time',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
        title: {
          display: true,
          text: 'Attendance %',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}

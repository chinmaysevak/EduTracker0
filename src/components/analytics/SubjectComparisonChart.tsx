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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SubjectComparisonChartProps {
  data: {
    subjectId: string;
    subjectName: string;
    percentage: number;
    present: number;
    total: number;
  }[];
}

export function SubjectComparisonChart({ data }: SubjectComparisonChartProps) {
  const chartData = {
    labels: data.map(d => d.subjectName),
    datasets: [
      {
        label: 'Attendance %',
        data: data.map(d => d.percentage),
        backgroundColor: data.map((_, index) => [
          'rgba(147, 51, 234, 0.8)',  // Violet
          'rgba(59, 130, 246, 0.8)',   // Blue  
          'rgba(16, 185, 129, 0.8)',   // Emerald
          'rgba(251, 146, 60, 0.8)',   // Amber
          'rgba(239, 68, 68, 0.8)',    // Red
        ][index % 5]),
        borderColor: [
          'rgb(147, 51, 234)',  // Violet
          'rgb(59, 130, 246)',   // Blue  
          'rgb(16, 185, 129)',   // Emerald
          'rgb(251, 146, 60)',   // Amber
          'rgb(239, 68, 68)',    // Red
        ][index % 5],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Subject Performance Comparison',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const subjectData = data[dataIndex];
            return [
              `Attendance: ${subjectData.percentage.toFixed(1)}%`,
              `Classes Present: ${subjectData.present}/${subjectData.total}`,
            ];
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
          text: 'Subjects',
        },
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}

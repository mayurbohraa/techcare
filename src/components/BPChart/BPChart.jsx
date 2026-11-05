import { useEffect, useMemo, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

import './BPChart.css';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
);

const PINK = '#E66FD2';
const PURPLE = '#8C6FE6';

export default function BPChart({ labels, systolic, diastolic }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolic,
          borderColor: PINK,
          pointBackgroundColor: PINK,
          pointBorderColor: PINK,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Diastolic',
          data: diastolic,
          borderColor: PURPLE,
          pointBackgroundColor: PURPLE,
          pointBorderColor: PURPLE,
          pointRadius: 4,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    }),
    [labels, systolic, diastolic],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      animation: globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')
        .matches
        ? false
        : undefined,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: 'rgba(0,0,0,0.08)',
          borderWidth: 1,
          titleColor: '#072635',
          bodyColor: '#072635',
          padding: 10,
          displayColors: true,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label(context) {
              const label = context.dataset?.label ?? '';
              const val = context.parsed?.y;
              return `${label}: ${val ?? '—'}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#707070', font: { size: 11 } },
          border: { display: false },
        },
        y: {
          suggestedMin: 60,
          suggestedMax: 180,
          ticks: { stepSize: 20, color: '#707070', font: { size: 11 } },
          grid: { color: 'rgba(7, 38, 53, 0.06)' },
          border: { display: false },
        },
      },
      elements: {
        line: { fill: false },
        point: { hitRadius: 12 },
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data,
        options,
      });
      return;
    }

    const chart = chartRef.current;
    chart.data.labels = data.labels;
    chart.data.datasets = data.datasets;
    chart.update();
  }, [data, options]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="bp-chart">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Blood pressure history in millimeters of mercury. Values are listed below."
      />
      <table className="sr-only">
        <caption>Blood pressure history (mmHg)</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Systolic</th>
            <th scope="col">Diastolic</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={`${label}-${index}`}>
              <th scope="row">{label}</th>
              <td>{systolic[index] ?? 'Unavailable'}</td>
              <td>{diastolic[index] ?? 'Unavailable'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import React from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = React.lazy(() => import('react-apexcharts'));

interface CandleChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

export default function CandleChart({ data }: CandleChartProps) {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: 'Candlestick Chart',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  const chartSeries = [
    {
      data: data.map((item) => ({
        x: new Date(item.time),
        y: [item.open, item.high, item.low, item.close],
      })),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <React.Suspense fallback={<div>Loading...</div>}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="candlestick"
          height={350}
        />
      </React.Suspense>
    </div>
  );
}
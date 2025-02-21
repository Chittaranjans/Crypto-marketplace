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
  const candlestickOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 500,
      background: '#f9f9f9',
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

  const barOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 200,
      background: '#f9f9f9',
      foreColor: '#333',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: -1000,
              to: 0,
              color: '#f15b46',
            },
            {
              from: 1,
              to: 1000,
              color: '#0acf97',
            },
          ],
        },
        columnWidth: '10%',
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val.toFixed(2)}`,
      },
    },
    fill: {
      opacity: 0.6,
    },
  };

  const aggregateDataByDay = (data) => {
    const aggregatedData = [];
    const dailyData = {};

    data.forEach((item) => {
      const date = new Date(item.time).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { open: item.open, close: item.close };
      } else {
        dailyData[date].close = item.close;
      }
    });

    for (const date in dailyData) {
      aggregatedData.push({
        x: new Date(date),
        y: dailyData[date].close - dailyData[date].open,
      });
    }

    return aggregatedData;
  };

  const candlestickSeries = [
    {
      data: data.map((item) => ({
        x: new Date(item.time),
        y: [item.open, item.high, item.low, item.close],
      })),
    },
  ];

  const barSeries = [
    {
      data: aggregateDataByDay(data),
    },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <React.Suspense fallback={<div>Loading...</div>}>
        <Chart
          options={candlestickOptions}
          series={candlestickSeries}
          type="candlestick"
          height={500}
        />
        <Chart
          options={barOptions}
          series={barSeries}
          type="bar"
          height={200}
        />
      </React.Suspense>
    </div>
  );
}
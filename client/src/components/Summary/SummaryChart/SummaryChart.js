import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeSeriesScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  BarController,
  PieController,
  ScatterController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { enIN } from 'date-fns/locale';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

import styles from '../Summary.module.css';

const SummaryChart = (props) => {
  const { question, summary } = props;
  // console.log(question, summary);
  // const chartTypes = {
  //   text: 'Wordcloud',
  //   number: 'Scatter',
  //   range: 'Bar',
  //   date: 'Scatter',
  //   checkbox: 'Horizontal Bar',
  //   radio: 'Pie chart',
  // };

  //Internal Recharts code
  let labels = [];
  let dataValues = [];
  let chartJsx, type, data, style;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeSeriesScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    BarController,
    PieController,
    ScatterController,
    WordCloudController,
    WordElement,
    Title,
    Tooltip,
    Legend
  );

  // Generic options object
  const options = {
    // responsive: true,
    maintainAspectRatio: false,
    // layout: {
    //   padding: 5,
    // },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `${question.question}`,
        font: {
          size: 18,
        },
        padding: {
          bottom: 15,
        },
      },
    },
  };

  // Calculate value counts only if summary object has valCounts property
  if (summary.valCounts && Object.keys(summary.valCounts).length) {
    if (question.type === 'range') {
      type = 'bar';
      const numberChoices = question.choices.map(Number);
      for (
        let i = numberChoices[0];
        i <= numberChoices[1];
        i += numberChoices[2]
      ) {
        labels.push(i);
        dataValues.push(summary.valCounts[i] || 0);
      }

      options.scales = {
        y: {
          title: {
            display: true,
            text: 'Counts',
          },
          ticks: {
            precision: 0,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Values',
          },
        },
      };

      data = {
        labels,
        datasets: [
          {
            label: 'Count',
            data: dataValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
          },
        ],
      };
    }

    // checkbox, radio
    else if (question.type === 'checkbox' || question.type === 'radio') {
      labels = [...question.choices];
      dataValues = labels.map((val) => summary.valCounts[val] || 0);

      if (question.type === 'checkbox') {
        type = 'bar';
        // Horizantal bar
        options.indexAxis = 'y';
        options.scales = {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        };
      } else {
        type = 'pie';
        const sum = dataValues.reduce((prev, cur) => prev + cur, 0);
        dataValues = dataValues.map((el) => (el / sum) * 100);
        options.plugins.tooltip = {
          callbacks: {
            label: function (context) {
              return `${context.label} : ${context.raw.toFixed(2)} %`;
            },
          },
        };
        // style = { maxHeight: '600px' };
      }

      data = {
        labels,
        datasets: [
          {
            label: 'Count',
            data: dataValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
          },
        ],
      };
    }

    // Number chart type
    else if (question.type === 'number' || question.type === 'date') {
      type = 'scatter';
      if (question.type === 'number') {
        options.scales = {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
          x: {
            suggestedMin: question?.choices[0],
            suggestedMax: question?.choices[1],
            ticks: {
              precision: 0,
            },
          },
        };
      } else {
        options.scales = {
          x: {
            suggestedMin: question.choices[0],
            suggestedMax: question.choices[1],
            adapters: {
              date: {
                locale: enIN,
              },
            },
            type: 'time',
            time: {
              displayFormats: {
                day: 'dd-MM-yyyy',
              },
              unit: 'day',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        };
      }
      dataValues = Object.keys(summary.valCounts).map((key) => {
        return { x: key, y: summary.valCounts[key] };
      });

      options.elements = {
        point: {
          radius: 5,
          hoverRadius: 7,
        },
      };

      options.plugins.tooltip = {
        callbacks: {
          label: function (context) {
            return `Value : ${context.label}, Count : ${context.formattedValue}`;
          },
        },
      };
      data = {
        datasets: [
          {
            label: 'Value, Count',
            data: dataValues,
            backgroundColor: ['rgba(59, 130, 246, 0.5)'],
          },
        ],
      };
    } else if (question.type === 'text') {
      type = 'wordCloud';
      labels = [...summary.valCountsOrdered];
      dataValues = labels.map((val) => summary.valCounts[val] || 0);
      console.log(dataValues);
      const sum = dataValues.reduce((prev, cur) => prev + cur, 0);
      console.log(sum);
      dataValues = dataValues.map((el) => (el / sum) * 100);
      console.log(dataValues);
      console.log(dataValues.reduce((prev, cur) => prev + cur, 0));

      // options.color = 'rgba(59, 130, 246, 0.5)';
      // console.log(dataValues);
      data = {
        // text
        labels,
        datasets: [
          {
            label: 'Values',
            // size in pixel
            data: dataValues,
          },
        ],
      };
      // style = { maxHeight: '400px', height: '400px' };
    }
  }

  if (type && data && options)
    // if (question.type === 'text' || question.type === 'radio') {
    //   chartJsx = (
    //     <Chart
    //       type={type}
    //       options={options}
    //       data={data}
    //       style={{ maxHeight: '400px' }}
    //     />
    //   );
    // } else {
    chartJsx = (
      <div className={`${styles['chart-size']}`}>
        <Chart type={type} options={options} data={data} />
      </div>
    );
  // }

  return (
    <React.Fragment>
      {chartJsx ? chartJsx : <p>Summary Chart</p>}
    </React.Fragment>
  );
};

// // Recharts code

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//     title: {
//       display: true,
//       text: 'Chart.js Bar Chart',
//     },
//   },
// };

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

// export function App() {
//   return <Bar options={options} data={data} />;
// }

export default SummaryChart;

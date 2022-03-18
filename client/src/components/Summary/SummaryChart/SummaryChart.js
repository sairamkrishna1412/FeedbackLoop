import React from 'react';

const SummaryChart = (props) => {
  const { question } = props;
  const chartTypes = {
    text: 'Wordcloud',
    number: 'Hist',
    range: 'Bar',
    date: 'Hist or bar',
    checkbox: 'horizontal Bar',
    radio: 'Pie chart',
  };
  let labels = [];
  if (question.type === 'range') {
    const numberChoices = question.choices.map(Number);
    for (
      let i = numberChoices[0];
      i <= numberChoices[1];
      i += numberChoices[2]
    ) {
      labels.push(i);
    }
  } else if (question.type === 'checkbox' || question.type === 'radio') {
    labels = [...question.choices];
  } else if (question.type === 'number') {
    const numberChoices = question.choices.map(Number);
    labels = [];
    const range = (numberChoices[1] - numberChoices[0]) / 5;
    for (let i = numberChoices[0]; i <= numberChoices[1]; i += range) {
      labels.push(i);
    }
  }
  console.log(labels);
  return <div>SummaryChart</div>;
};

export default SummaryChart;

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { getGraph } from '../features/dashboardSlice'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const BarChart = () => {
  let token = localStorage.getItem("key");
  const dispatch = useDispatch();
  const { graphData } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (token) {
      dispatch(getGraph({token}))
    }
  }, [dispatch, token])

  let ph = [];
  let bh = [];

  graphData.forEach((graph) => {
    ph.push(graph.date);
    bh.push(graph.salesCount);
  });



    const data = {
      labels: ph,
      datasets: [
        {
          label: '# of Sales',
          data: bh,
          backgroundColor: '#FF962E',
          borderColor: '#FF962E',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return <Bar data={data} options={options} />;
};

const Progress = ({ percentage }) => {
    return (
      <CircularProgressbar  value={percentage}
      text={`${percentage}%`}
      styles={buildStyles({
        textColor: "#FF962E",
        pathColor: "#FF962E",
        trailColor: "#fff",
        textSize: "12px",
      })}
      />
    );
}

export { BarChart, Progress };

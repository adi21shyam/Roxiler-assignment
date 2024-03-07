import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
          data: [],
        }],
      });
      
    const backendUrl = "http://localhost:3000";

    const fetchChartData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/piechart?month=${month}`);
            console.log(data,"pie")
            setChartData({
                labels: [...data.map(item => item._id)],
                datasets: [
                    {
                        label: 'Category Distribution',
                        data: data.map(item => item.count),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(0, 0, 0, 0.2)',
                            'rgba(32, 237, 205, 0.2)',
                            'rgba(49, 147, 125, 0.2)',
                            // Add more colors as needed
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(0, 0, 0, 0.2)',
                            'rgba(32, 237, 205, 0.2)',
                            'rgba(49, 147, 125, 0.2)',
                            // Add more colors as needed
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [month]);

    return <Pie data={chartData} />;
};

export default PieChart;

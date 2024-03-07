import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = ({ month }) => {
    const [chartData, setChartData] = useState({});
    const backendUrl = "http://localhost:3000";

    const fetchChartData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/barchart?month=${month}`);
            console.log(data,"barChart")
            setChartData({
                labels: Object.keys(data).map(range => `Range ${range}`),
                datasets: [
                    {
                        label: 'Number of Items Sold',
                        data: Object.values(data),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [month]);

    return <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />;
};

export default BarChart;

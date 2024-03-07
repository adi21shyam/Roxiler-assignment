import { useEffect, useState } from 'react'
import Table from './components/Table'
import axios from "axios";
import './App.css'
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

function App() {
  const [month, setMonth] = useState('03'); // Default to March
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [monthName, setMonthName] = useState("March");

  const backendUrl = "http://localhost:3000";

console.log(statistics,"stats")
  useEffect(()=>{
    const fetchTransactions = async()=>{
      const {data} = await axios.get(`${backendUrl}/api/transactions?month=${month}&search=${searchTerm}&page=${currentPage}`);
      console.log(data,"dafa")
      setTransactions(data);
    };

    fetchTransactions();
  },[month,searchTerm, currentPage]);

  useEffect(()=>{
    const fetchStatistics = async ()=>{
      const {data} = await axios.get(`${backendUrl}/api/statistics?month=${month}`);
     
      setStatistics(data);
    };
    
    fetchStatistics();
  }, [month]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    setMonthName(e.target.text);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
    <div className='flex flex-col justify-center'>
    <div className='flex items-center justify-center'>
      <div className='p-4 h-36 w-36 bg-white flex justify-center rounded-full font-bold text-xl items-center'>Transaction Dashboard</div>
      </div>
      <div className='flex justify-between p-3 m-1'>
        <span className='flex justify-end p-2 m-1 bg-yellow-200 rounded-lg items-center'>
        <input type="text" placeholder="Search Transactions" className='bg-yellow-200 items-center' value={searchTerm} onChange={handleSearchChange} />
        </span>
        <span className='flex justify-end p-2 m-1 bg-yellow-200 rounded-lg items-center text-bold'>
          <select onChange={handleMonthChange} value={month} className='bg-yellow-200 items-center text-bold'>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </span>
      </div>
      <div>
        <Table transactions={transactions} />
      </div>
      <div className='flex justify-between p-3 m-1 text-base'>
        <div>
          <p>Page No.: {currentPage}</p>
        </div>
        <div className='flex gap-3 font-bold'>
          <button onClick={handlePreviousPage} className=''>Previous</button>
          <span>-</span>
          <button onClick={handleNextPage}>Next</button>
        </div>
        <div>
          <p>Per Page: {10}</p>
        </div>
        
      </div>
      <div className='flex flex-col p-2 m-6'>
        <div className='flex items-center '>
          <div className='text-xl font-bold '>Statistics - {monthName}</div>
        </div>
          <div className='flex flex-col justify-start bg-yellow-200 rounded-lg p-3 m-3 g-2 items-start w-52'>
            <p><span className='font-bold m-2'>Total Sale:</span> {statistics.totalSaleAmount}</p>
            <p><span className='font-bold m-2'>Total Sold Item:</span> {statistics.totalSoldItems}</p>
            <p><span className='font-bold m-2'>Total Not Sold Item:</span> {statistics.totalNotSoldItems}</p>
          </div>
        </div>
        <div className='m-8'>
          {/* <BarChart month={month} /> */}
          <div className='flex flex-col'>
          <div className='text-xl font-bold mb-6'>Pie Chart</div>
          <div className='h-96 w-96 items-center m-auto p-3 bg-white rounded-lg'>
           <PieChart month={month} />
          </div>

          </div>
        </div>
    </div>
    </>
  )
}

export default App

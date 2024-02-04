import React, { useEffect, useState } from 'react'
import ExpensesChart from './ExpensesChart'
import axios from 'axios';
import { monthStringFormat } from '../../../helper/homeHelper';
import loadingsvg from '../../../assets/loading.svg';
import serverErrorSvg from '../../../assets/server_error.svg';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function ExpensesAnalysis() {

    const thisMonth = { month: new Date().getMonth(), year: new Date().getFullYear() };
    const [chartLastMonth, setChartLastMonth] = useState(thisMonth);
    const [chartBoundaries, setChartBoundaries] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        let month = chartLastMonth.month === 11 ? { month: 0, year: chartLastMonth.year + 1 } : { month: chartLastMonth.month + 1, year: chartLastMonth.year };
        let boundaries = [];
        for (let i = 1; i <= 4; i++) {
            boundaries.unshift(month.year + '-' + (month.month + 1).toString().padStart(2, 0) + '-01');
            month = month.month <= 0 ? { month: 11, year: month.year - 1 } : { month: month.month - 1, year: month.year };
        }
        setChartBoundaries(boundaries);
    }, [chartLastMonth]);

    useEffect(() => {
        const fetchChartData = async (queryString) => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                if (!token) throw new Error('UnAuthorized Access!');
                const { data } = await axios.get(queryString, { headers: { "Authorization": `Bearer ${token}` } });
                let modifiedData = chartBoundaries.slice(0, chartBoundaries.length - 1).map((month) => {
                    let match = data.find((row) => row.Month.split('T')[0] === month)
                    if (match) {
                        match.Month = monthStringFormat(match.Month);
                        return match;
                    }
                    return { Month: monthStringFormat(month) };
                });
                setChartData(modifiedData);
                setIsLoading(false);
            }
            catch (error) {
                setServerError(error);
            }
        }

        if (chartBoundaries.length > 0) {
            const queryString = "/api/getChartData" + chartBoundaries.map((month, index) => index === 0 ? "?boundaries=" + month : "&boundaries=" + month).join('');
            fetchChartData(queryString);
        }
    }, [chartBoundaries]);

    function prevMonth() {
        setChartLastMonth(prevLastMonth => prevLastMonth.month <= 0 ? { month: 11, year: prevLastMonth.year - 1 } : { month: prevLastMonth.month - 1, year: prevLastMonth.year });
    }

    function nextMonth() {
        if (!nextDisable()) {
            setChartLastMonth(prevLastMonth => prevLastMonth.month >= 11 ? { month: 0, year: prevLastMonth.year + 1 } : { month: prevLastMonth.month + 1, year: prevLastMonth.year })
        }
    }

    function nextDisable() {
        return chartLastMonth.year === thisMonth.year && chartLastMonth.month >= thisMonth.month;
    }

    if (isLoading) {
        return (
          <div className='fixed z-10 w-full max-w-[1000px] mobile-h-safe left-1/2 translate-x-[-50%] overflow-hidden pb-[20px] pt-[106px] lg:pt-[144px] lg:pb-0 lg:h-[calc(100%_-_40px)] lg:translate-x-[calc(-50%_+_145px)] flex justify-center items-center'>
                <img src={loadingsvg} alt='loading' className='w-[200px]' />
          </div>
        )
      };
    
      if (serverError) {
        return (
          <div className='fixed z-10 w-full max-w-[1000px] mobile-h-safe left-1/2 translate-x-[-50%] overflow-hidden pb-[20px] pt-[106px] lg:pt-[144px] lg:pb-0 lg:h-[calc(100%_-_40px)] lg:translate-x-[calc(-50%_+_145px)] flex flex-col justify-center items-center gap-4 text-center text-xl text-theme-plum'>
            <img src={serverErrorSvg} alt='server error' className='w-[250px]' />
            <h6 className='font-bold'>Internal Server Error</h6>
            <p>Sorry! Something went wrong.</p>
          </div>
        )
      }

    return (
        <div className='fixed z-10 w-full max-w-[1000px] mobile-h-safe left-1/2 translate-x-[-50%] overflow-hidden pb-[20px] pt-[106px] lg:w-[calc(95%_-_310px)] lg:pt-[144px] lg:pb-0 lg:h-[calc(100%_-_40px)] lg:translate-x-[calc(-50%_+_145px)]'>
        <div className='h-full overflow-y-auto px-4 text-gray-600 lg:w-full'>
                <div className='h-[30px] flex justify-around items-center text-gray-500'>
                    <button className='bg-theme-light-blue text-white text-sm px-3 py-1 rounded-lg shadow-md hover:bg-theme-blue' onClick={prevMonth}>Prev</button>
                    {chartBoundaries.length > 0 && monthStringFormat(chartBoundaries[0]) + ' - ' + monthStringFormat(chartBoundaries[chartBoundaries.length - 1])}
                    <button className='bg-theme-light-blue text-white text-sm px-3 py-1 rounded-lg shadow-md disabled:bg-gray-300 hover:bg-theme-blue' onClick={nextMonth} disabled={nextDisable()}>Next</button>
                </div>
                <div className='w-full h-[calc(100%_-_30px)] max-h-[450px] text-xs sm:text-base'>
                    <ExpensesChart data={chartData} />
                </div>
            </div>
        </div>
    )
}

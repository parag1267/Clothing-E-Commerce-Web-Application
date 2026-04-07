import axios from 'axios';
import React, { useEffect, useState } from 'react'

const OrderDataFetch = () => {
    const API_KEY = "";

    const totalPages = 200;
    const [loading,setLoading] = useState(true);
    const [pages,setPages] = useState([]);
    const [currentPage,setCurrentPage] = useState(0);

    useEffect(() => {
        const fecthData = async() => {
            const page = Math.min(currentPage + 1,totalPages);
            const result = await axios.get(`${API_KEY}&page=${page}`);
            console.log(result.data);
            setPages(result.data);
            setLoading(fasle);
        }
        fecthData();
    },[currentPage])
  return {
    loading,
    pages,
    totalPages,
    currentPage,
    setCurrentPage
  }
}

export default OrderDataFetch

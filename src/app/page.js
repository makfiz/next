"use client";

import React, { useState, useEffect } from 'react';
import DatePickerComponent from "./components/DatePickerComponent";
import styles from "./page.module.css";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const day = selectedDate.getDate(); // День месяца (1-31)
    const month = selectedDate.getMonth() + 1; // Месяцы идут от 0 (январь) до 11 (декабрь), поэтому добавляем 1
    const year = selectedDate.getFullYear(); // Год

    const url = new URL('https://blumbittrackerapi.onrender.com/statistics');
    url.searchParams.set('day', day);
    url.searchParams.set('month', month);
    url.searchParams.set('year', year);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [selectedDate]);

  useEffect(() => {
  }, [statistics]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (<>
  <header>
  <DatePickerComponent 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
  </header>
    <main >
    {statistics.length>0 ? (
        <ul>
          <li style={{display:"flex", justifyContent:"space-between"}}>
              <span style={{minWidth:250}}>User:</span>
              <span>Activity:</span>
              <span>Start of activity:</span>
              <span>Last activity:</span>
          </li>
          {statistics.map((user)=>{
              const day = selectedDate.getDate().toString(); // День месяца (1-31)
              const month = (selectedDate.getMonth() + 1).toString(); // Месяцы идут от 0 (январь) до 11 (декабрь), поэтому добавляем 1
              const year = selectedDate.getFullYear().toString(); // Год
              const activity = user?.activities?.[year]?.months?.[month]?.days?.[day] || {};
              const { minutes, startOfActivity, lastActivity } = activity;
              
            return <li style={{display:"flex", justifyContent:"space-between", paddingBottom:5}}>
              <span style={{minWidth:250}}>{user.username.split("@")[0]}</span>
              <span>{(minutes/60).toFixed(1) + "h" + " " + `(${minutes})`}</span>
              <span>{startOfActivity}</span>
              <span>{lastActivity}</span>
            </li>
          })}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </main>
  </>
    
  );
}

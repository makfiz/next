'use client';

import React, { useState, useEffect } from 'react';
import DatePickerComponent from './components/DatePickerComponent';
// import styles from "./page.module.css";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

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

  useEffect(() => {}, [statistics]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <header>
        <DatePickerComponent
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </header>
      <main>
        {statistics.length > 0 ? (
          <ul>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ minWidth: 250 }}>User:</span>
              <span>Activity:</span>
              <span>Start of activity:</span>
              <span>Last activity:</span>
            </li>
            {statistics.map((user, index) => {
              const day = selectedDate.getDate().toString();
              const month = (selectedDate.getMonth() + 1).toString();
              const year = selectedDate.getFullYear().toString();
              const activity =
                user?.activities?.[year]?.months?.[month]?.days?.[day] || {};
              const {
                minutes,
                startOfActivity,
                lastActivity,
                navigation = [],
              } = activity;
              const usernameDisplay = user.username.split('@')[0];

              const isExpanded = expandedUser === user.username;

              return (
                <React.Fragment key={user.username}>
                  <li
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        minWidth: 250,
                        cursor: 'pointer',
                        color: expandedUser === user.username ? 'red' : 'blue',
                      }}
                      onClick={() =>
                        setExpandedUser(
                          expandedUser === user.username ? null : user.username
                        )
                      }
                    >
                      {usernameDisplay}
                    </span>
                    <span>
                      {(minutes / 60).toFixed(1) + 'h' + ' ' + `(${minutes})`}
                    </span>
                    <span>{startOfActivity}</span>
                    <span>{lastActivity}</span>
                  </li>
                  {isExpanded &&
                    (navigation.length > 0 ? (
                      <ul style={{ marginLeft: 20, marginBottom: 10 }}>
                        {navigation
                          .slice()
                          .reverse()
                          .map((item, idx) => (
                            <li
                              key={idx}
                              style={{
                                fontSize: '0.9rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                padding: '4px 0',
                                borderBottom: '1px solid #eee',
                              }}
                            >
                              <span>
                                {new Date(item.timestamp).toLocaleTimeString(
                                  'uk-UA',
                                  {
                                    hour12: false,
                                    timeZone: 'Europe/Kyiv',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  }
                                )}
                              </span>
                              <span style={{ fontWeight: 'bold' }}>
                                {item.title}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: 'blue',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {item.url}
                                </a>
                              </span>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <span
                        style={{
                          marginLeft: 20,
                          fontStyle: 'italic',
                          color: '#999',
                        }}
                      >
                        Empty navigation array
                      </span>
                    ))}
                </React.Fragment>
              );
            })}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </main>
    </>
  );
}

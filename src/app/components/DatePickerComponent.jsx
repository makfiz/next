"use client";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({ selectedDate, onDateChange }) => {
  // Устанавливаем сегодняшнюю дату по умолчанию
    
  return (
    <div>
      <h3>Выберите дату:</h3>
      <DatePicker
         selected={selectedDate}
         onChange={onDateChange}
        dateFormat="yyyy/MM/dd"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
      />
    </div>
  );
};

export default DatePickerComponent;
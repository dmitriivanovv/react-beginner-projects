import React, { useEffect, useRef, useState } from 'react';
import { Block } from './Block';
import './index.scss';
import axios from 'axios';

function App() {

  // const [rates, setRates] = useState({});
  const ratesRef = useRef({})

  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);



  async function getCur() {
    try {
      const response = await axios.get('https://www.cbr-xml-daily.ru/latest.js');
      // setRates(response.data.rates)
      ratesRef.current = response.data.rates
      onCangeToPrice(1);

    } catch (error) {
      console.error(error);
      alert('не удалось получить информацию')
    }
  }

  useEffect(() => {
    getCur()
  }, [])

  const onCangeFromPrice = (value) => {
    let result;

    if (fromCurrency === 'RUB') {
      result = value * ratesRef.current[toCurrency]
    } else if (toCurrency === 'RUB') {
      result = value / ratesRef.current[fromCurrency]
    } else {
      result = (value * ratesRef.current[fromCurrency]) / ratesRef.current[toCurrency]
    }

    setFromPrice(value);
    setToPrice(result.toFixed(3))
  }
  const onCangeToPrice = (value) => {

    let result;

    if (fromCurrency === 'RUB') {
      result = value / ratesRef.current[toCurrency]
    } else if (toCurrency === 'RUB') {
      result = value * ratesRef.current[fromCurrency]
    } else {
      result = (value / ratesRef.current[fromCurrency]) * ratesRef.current[toCurrency]
    }
    setToPrice(value);
    setFromPrice(result.toFixed(3))
  }

  useEffect(() => {
    onCangeFromPrice(fromPrice)
  }, [fromCurrency])

  useEffect(() => {
    onCangeToPrice(toPrice)
  }, [toCurrency])

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onCangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onCangeToPrice}
      />
    </div>
  );
}

export default App;

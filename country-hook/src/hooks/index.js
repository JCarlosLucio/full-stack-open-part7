import { useEffect, useState } from 'react';
import axios from 'axios';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  const url = `https://restcountries.eu/rest/v2/name/${name}?fullText=true`;

  useEffect(() => {
    if (!name) return;

    const fetchCountry = async () => {
      try {
        const response = await axios.get(url);
        const [data] = response.data;
        const fetchedCountry = { data, found: true };
        setCountry(fetchedCountry);
      } catch (error) {
        console.error('error fetching country', error);
        setCountry({ found: false });
      }
    };

    fetchCountry();
  }, [name, url]);

  return country;
};

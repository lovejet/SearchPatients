import React, { useEffect, useState } from 'react';
import './App.css';
import { Typography, Container, Button, Box } from '@mui/material';
import { Patient, Query } from './types';
import AutoCompleteSearchBox from './components/AutoCompleteSearchBox';
import { fetchPatients } from './services';
import PatientsTable from './components/PatientsTable';
import { BrowserRouter as Router, useSearchParams } from 'react-router-dom';

const SearchPatientsPage = () => {
  const [searchedPatients, setSearchedPatients] = useState<Patient[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<Query[]>([]);
  const [searchString, setSearchString] = useState<string>('');

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async (str: string) => {
      const data = await fetchPatients(str);

      const savedSearchQueries = window.localStorage.getItem(
        'saved_search_queries'
      );
      if (savedSearchQueries === undefined || savedSearchQueries === null) {
        window.localStorage.setItem(
          'saved_search_queries',
          JSON.stringify([str])
        );
      } else {
        const list = JSON.parse(savedSearchQueries) as string[];
        if (!list.includes(str)) {
          if (list.length >= 10) {
            list.shift();
          }
          window.localStorage.setItem(
            'saved_search_queries',
            JSON.stringify([...list, str])
          );
        }
      }

      setSearchedPatients(data);
    };

    const search = searchParams.get('search');
    if (search) {
      setSearchString(search);
      fetchData(search);
    } else {
      resetHandler();
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchString) {
      setSearchParams({ search: searchString });
    } else {
      setSuggestedQueries([]);
    }
  }, [searchString, setSearchParams]);

  const resetHandler = () => {
    setSearchString('');
    setSuggestedQueries([]);
    setSearchedPatients([]);
    setSearchParams({});
  };

  return (
    <div className='App'>
      <Typography variant='h4' mt={5} mb={12.5}>
        Search Patients
      </Typography>
      <Container
        sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
        >
          <AutoCompleteSearchBox
            suggestedQueries={suggestedQueries}
            setSuggestedQueries={setSuggestedQueries}
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <Button variant='outlined' sx={{ ml: 2 }} onClick={resetHandler}>
            Reset
          </Button>
        </Box>
        <PatientsTable searchedPatients={searchedPatients} />
      </Container>
    </div>
  );
};

function App() {
  return (
    <Router>
      <SearchPatientsPage />
    </Router>
  );
}

export default App;

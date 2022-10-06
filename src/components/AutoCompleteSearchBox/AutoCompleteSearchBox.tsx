import React, { useState, useEffect } from 'react';
import { Patient, Query } from '../../types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { fetchPatients } from '../../services';
import { useDebouncedCallback } from 'use-debounce';

export interface AutoCompleteSearchBoxProps {
  suggestedQueries: Query[];
  setSuggestedQueries: (newQueries: Query[]) => void;
  searchString: string;
  setSearchString: (newString: string) => void;
}

const AutoCompleteSearchBox = ({
  suggestedQueries,
  setSuggestedQueries,
  searchString,
  setSearchString
}: AutoCompleteSearchBoxProps) => {
  const [option, setOption] = useState<Query | string | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(searchString);
  }, [searchString]);

  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = async (text: string) => {
    setLoading(true);
    const data = await fetchPatients(text, 1, 10);
    setLoading(false);
    const savedSearchQueries = window.localStorage.getItem(
      'saved_search_queries'
    );
    let savedQueriesList = [];
    if (savedSearchQueries) {
      savedQueriesList = JSON.parse(savedSearchQueries);
    }
    setSuggestedQueries([
      ...savedQueriesList.reverse().map((v: string) => {
        return {
          type: 'saved',
          text: v
        } as Query;
      }),
      ...data.map((v: Patient) => {
        return {
          type: 'default',
          text: v.fullName
        } as Query;
      })
    ]);
  };

  const debouncedHandleChange = useDebouncedCallback(
    async (nextValue: string) => {
      handleChange(nextValue);
    },
    250
  );

  return (
    <Autocomplete
      id='patient-search-auto-complete'
      freeSolo
      loading={loading}
      sx={{ width: 300 }}
      options={suggestedQueries}
      getOptionLabel={(option: Query | string) =>
        typeof option === 'string' ? option : option.text
      }
      renderOption={(props, option) => (
        <Typography
          variant='body1'
          {...props}
          sx={{ fontStyle: option.type === 'default' ? 'normal' : 'italic' }}
          key={`${option.type}-${option.text}`}
        >
          {option.text}
        </Typography>
      )}
      isOptionEqualToValue={(option: Query, value: Query | string) => {
        return typeof value === 'string'
          ? option.text === value
          : option.text === value.text;
      }}
      value={option}
      onChange={(
        event: React.SyntheticEvent<Element, Event>,
        value: Query | string | null,
        reason: string
      ) => {
        setOption(value);
        if (value === null) {
          setSearchString('');
          return;
        }
        if (typeof value === 'string') {
          setSearchString(value);
        } else {
          setSearchString(value.text);
        }
      }}
      inputValue={inputValue}
      onInputChange={(
        event: React.SyntheticEvent<Element, Event>,
        value: string
      ) => {
        setInputValue(value);
        debouncedHandleChange(value);
      }}
      renderInput={params => (
        <TextField
          {...params}
          label='Search Patient'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password' // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

export default AutoCompleteSearchBox;

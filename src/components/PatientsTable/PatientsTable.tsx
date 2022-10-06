import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Patient } from '../../types';

export interface PatientsTableProps {
  searchedPatients: Patient[];
}

const PatientsTable = ({ searchedPatients }: PatientsTableProps) => {
  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 250 },
    { field: 'lastName', headerName: 'Last Name', width: 250 },
    { field: 'id', headerName: 'ID', width: 100 }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '400px',
        width: '600px',
        mt: 6
      }}
    >
      <DataGrid
        sx={{ height: '100%', width: '100%' }}
        rows={searchedPatients}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
};

export default PatientsTable;

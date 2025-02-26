import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const Payments = () => {

  const [mockDataInvoices, setMockDataInvoices ] = useState([])

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    const url = "http://127.0.0.1:5030/c2b/payments"
    try {
      const response = await axios.get(url)
      setMockDataInvoices(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "bill_ref_number",
      headerName: "Invoice Number",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "trans_id",
      headerName: "Transaction ID",
      flex: 1,
    },
    {
      field: "msisdn",
      headerName: "MSISDN",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          Ksh {params.row.amount}
        </Typography>
      ),
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "trans_time",
      headerName: "Transaction Time",
      flex: 1,
      renderCell: (params) => {
        const formatDate = (rawTime) => {
          if (!rawTime) return "N/A";
          const year = rawTime.substring(0, 4);
          const month = rawTime.substring(4, 6);
          const day = rawTime.substring(6, 8);
          const hours = rawTime.substring(8, 10);
          const minutes = rawTime.substring(10, 12);
          const seconds = rawTime.substring(12, 14);
          return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        };
    
        return (
          <Typography color={colors.blueAccent[300]}>
            {formatDate(params.row.trans_time)}
          </Typography>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="PAYMENTS" subtitle="Payments made by clients" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={mockDataInvoices} columns={columns} />
      </Box>
    </Box>
  );
};

export default Payments;

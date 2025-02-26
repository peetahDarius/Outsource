import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const Engineers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mockDataEngineers, setMockDataEngineers] = useState([])
  useEffect(() => {
    fetchEngineers()
  }, [])

  const fetchEngineers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/engineers/")
      setMockDataEngineers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

// const mockDataEngineers = [
//     {
//       id: 1,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "jonsnow@gmail.com",
//       age: 35,
//       phone: "(665)121-5454",
//       location: "0912 Won Street, Alabama, SY 10001",
//       city: "New York",
//       zipCode: "10001",
//       registrarId: 123512,
//     },
//     {
//       id: 2,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "cerseilannister@gmail.com",
//       age: 42,
//       phone: "(421)314-2288",
//       location: "1234 Main Street, New York, NY 10001",
//       city: "New York",
//       zipCode: "13151",
//       registrarId: 123512,
//     },
//     {
//       id: 3,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "jaimelannister@gmail.com",
//       age: 45,
//       phone: "(422)982-6739",
//       location: "3333 Want Blvd, Estanza, NAY 42125",
//       city: "New York",
//       zipCode: "87281",
//       registrarId: 4132513,
//     },
//     {
//       id: 4,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "anyastark@gmail.com",
//       age: 16,
//       phone: "(921)425-6742",
//       location: "1514 Main Street, New York, NY 22298",
//       city: "New York",
//       zipCode: "15551",
//       registrarId: 123512,
//     },
//     {
//       id: 5,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "daenerystargaryen@gmail.com",
//       age: 31,
//       phone: "(421)445-1189",
//       location: "11122 Welping Ave, Tenting, CD 21321",
//       city: "Tenting",
//       zipCode: "14215",
//       registrarId: 123512,
//     },
//     {
//       id: 6,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "evermelisandre@gmail.com",
//       age: 150,
//       phone: "(232)545-6483",
//       location: "1234 Canvile Street, Esvazark, NY 10001",
//       city: "Esvazark",
//       zipCode: "10001",
//       registrarId: 123512,
//     },
//     {
//       id: 7,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "ferraraclifford@gmail.com",
//       age: 44,
//       phone: "(543)124-0123",
//       location: "22215 Super Street, Everting, ZO 515234",
//       city: "Evertin",
//       zipCode: "51523",
//       registrarId: 123512,
//     },
//     {
//       id: 8,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "rossinifrances@gmail.com",
//       age: 36,
//       phone: "(222)444-5555",
//       location: "4123 Ever Blvd, Wentington, AD 142213",
//       city: "Esteras",
//       zipCode: "44215",
//       registrarId: 512315,
//     },
//     {
//       id: 9,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "harveyroxie@gmail.com",
//       age: 65,
//       phone: "(444)555-6239",
//       location: "51234 Avery Street, Cantory, ND 212412",
//       city: "Colunza",
//       zipCode: "111234",
//       registrarId: 928397,
//     },
//     {
//       id: 10,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "enteriredack@gmail.com",
//       age: 42,
//       phone: "(222)444-5555",
//       location: "4123 Easer Blvd, Wentington, AD 142213",
//       city: "Esteras",
//       zipCode: "44215",
//       registrarId: 533215,
//     },
//     {
//       id: 11,
//       first_name: "Jon Snow",
//       last_name: "Jon Snow",
//       email: "stevegoodmane@gmail.com",
//       age: 11,
//       phone: "(444)555-6239",
//       location: "51234 Fiveton Street, CunFory, ND 212412",
//       city: "Colunza",
//       zipCode: "1234",
//       registrarId: 92197,
//     },
//   ];

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      align: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "bio",
      headerName: "Bio",
      flex: 1,
    },
    // {
    //   field: "image",
    //   headerName: "Image",
    //   flex: 1,
    // },
  ];

  return (
    <Box m="20px">
      <Header
        title="Engineers"
        subtitle="List of Engineers."
      />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockDataEngineers}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Engineers;

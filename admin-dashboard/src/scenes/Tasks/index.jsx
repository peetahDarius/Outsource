import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [engineersList, setEngineersList] = useState([]);
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchEngineers();
    fetchClients();
  }, []);

  const fetchEngineers = async () => {
    const url = "http://127.0.0.1:8000/engineers/";
    try {
      const response = await axios.get(url);
      setEngineersList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    const url = "http://127.0.0.1:5001/clients/";
    try {
      const response = await axios.get(url);
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    const url = "http://127.0.0.1:5040/tasks/";
    try {
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Task Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={colors.blueAccent[300]}
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate(`/tasks/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "client_id",
      headerName: "Client's Name",
      flex: 1,
      renderCell: (params) => {
        const selected_client = clients.find(
          (client) => client.id === params.value
        );
        const name = selected_client
          ? `${selected_client.first_name} ${selected_client.last_name}`
          : "Unknown";
        return <Typography color={colors.greenAccent[500]}>{name}</Typography>;
      },
    },
    {
      field: "quotation_id",
      headerName: "Quotation ID",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>{params.value}</Typography>
      ),
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.blueAccent[300]}>
          Ksh {params.value}
        </Typography>
      ),
    },
    {
      field: "paid_amount",
      headerName: "Amount Received",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.blueAccent[300]}>
          Ksh {params.value}
        </Typography>
      ),
    },
    {
      field: "percentagePaid",
      headerName: "Percentage Paid",
      flex: 1,
      valueGetter: (params) => {
        const total = params.row.total_amount || 1; // Avoid division by zero
        const paid = params.row.paid_amount || 0;
        return ((paid / total) * 100).toFixed(2);
      },
      renderCell: (params) => (
        <Typography color={colors.primary[100]}>{params.value}%</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "created":
            color = "orange";
            break;
          case "scheduled":
            color = "blue";
            break;
          case "completed":
            color = "green";
            break;
          default:
            color = "gray";
        }
        return (
          <Typography style={{ color, fontWeight: "bold" }}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "engineers",
      headerName: "Engineers Assigned",
      flex: 1,
      renderCell: (params) => {
        const engineers = engineersList.filter((engineer) =>
          params.value.includes(engineer.id)
        );
        return (
          <Box sx={{ maxHeight: 50, overflowY: "auto", width: "100%" }}>
            {engineers.map((engineer) => (
              <Typography key={engineer.id} color={colors.primary[100]}>
                {`${engineer.first_name} ${engineer.last_name}`}
              </Typography>
            ))}
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TASKS" subtitle="List of tasks" />

      {/* Create Task Button */}
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/tasks/add")}
        >
          Create Task
        </Button>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
        }}
      >
        <DataGrid
          rows={tasks}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "desc" }],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Tasks;

import {
  Box,
  Typography,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for form fields
  const [taskName, setTaskName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [generatedQuotationID, setGeneratedQuotationID] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedEngineers, setSelectedEngineers] = useState([]);
  const [pendingClients, setPendingClients] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [engineersList, setEngineersList] = useState([]);

  useEffect(() => {
    fetchPendingClients();
    fetchCredentials();
    fetchEngineers();
  }, []);

  const navigate = useNavigate();

  const fetchPendingClients = async () => {
    const url = "http://127.0.0.1:5001/clients/pending";
    try {
      const response = await axios.get(url);
      setPendingClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCredentials = async () => {
    try {
      const url = "http://127.0.0.1:5020/quotation/credentials/";
      const response = await axios.get(url);
      const data = response.data;
      setPrefix(data.prefix);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEngineers = async () => {
    const url = "http://127.0.0.1:8000/engineers/";
    try {
      const response = await axios.get(url);
      setEngineersList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    const formattedNumber = String(clientId).padStart(3, "0");
    setGeneratedQuotationID(`${prefix}${formattedNumber}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      name: taskName,
      client_id: selectedClient,
      quotation_id: generatedQuotationID,
      total_amount: totalAmount,
      engineers: selectedEngineers,
    };
    const url = "http://127.0.0.0:5040/tasks/";
    try {
      const response = await axios.post(url, taskData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        navigate("/tasks");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE TASK" subtitle="Create a new task" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 4, display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <TextField
          label="Task Name"
          variant="outlined"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel id="client-select-label">Client Name</InputLabel>
          <Select
            labelId="client-select-label"
            id="client-select"
            value={selectedClient}
            label="Client Name"
            onChange={handleClientChange}
            required
          >
            {pendingClients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Display the generated quotation ID when a client is selected */}
        {selectedClient && (
          <TextField
            label="Quotation ID"
            variant="outlined"
            value={generatedQuotationID}
            InputProps={{ readOnly: true }}
            fullWidth
            required
          />
        )}
        <TextField
          label="Total Amount"
          variant="outlined"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel id="engineers-select-label">Engineers</InputLabel>
          <Select
            labelId="engineers-select-label"
            id="engineers-select"
            multiple
            value={selectedEngineers}
            required
            onChange={(e) => setSelectedEngineers(e.target.value)}
            input={<OutlinedInput label="Engineers" />}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const eng = engineersList.find(
                    (engineer) => engineer.id === id
                  );
                  return eng ? `${eng.first_name} ${eng.last_name}` : "";
                })
                .join(", ")
            }
          >
            {engineersList.map((engineer) => (
              <MenuItem key={engineer.id} value={engineer.id}>
                {engineer.first_name} {engineer.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="secondary">
          Create Task
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTask;

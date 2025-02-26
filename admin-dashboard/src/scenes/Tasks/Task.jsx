import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Task = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams(); // assume the task id is passed in the URL
  const navigate = useNavigate();

  // Task and engineers state
  const [task, setTask] = useState();
  const [engineers, setEngineers] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");

  // Modal state variables
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState(null);
  const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openEngineerDeleteSuccessModal, setOpenEngineerDeleteSuccessModal] =
    useState(false);

  // New Engineer Modal state and selection
  const [openAddEngineerModal, setOpenAddEngineerModal] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState("");

  // All engineers for selection in modal
  const [allEngineers, setAllEngineers] = useState([]);

  // Other state variables
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [loading, setLoading] = useState(null);

  const [disbursements, setDisbursements] = useState([])

  useEffect(() => {
    fetchTask();
    fetchAllEngineers();
  }, []);

  const fetchDisbursements = async (quotation_id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5050/disburse/task-per-eng/${quotation_id}/`
      );
      if (response.status === 200) {
        let data = response.data;
        // If the API returns an object, ensure we extract an array and total amount.
        if (!Array.isArray(data)) {
          // Expecting data to have properties "disbursements" and "total_amount"
          data = data || {};
        }

        setDisbursements(data || []);
      }
    } catch (error) {
      console.error("Error fetching disbursements:", error);
    }
  };

  const fetchTask = async () => {
    setLoading(true);
    const url = `http://127.0.0.1:5040/tasks/${id}`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setTask(response.data);
        setTotalAmount(response.data.total_amount);
        await fetchClient(response.data.client_id);
        await fetchEngineers(response.data);
        await fetchDisbursements(response.data.quotation_id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch only the engineers assigned to this task
  const fetchEngineers = async (taskData) => {
    const url = "http://127.0.0.1:8000/engineers/";
    try {
      const response = await axios.get(url);
      setEngineers(
        response.data.filter((engineer) =>
          taskData.engineers.includes(engineer.id)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all engineers for the modal dropdown
  const fetchAllEngineers = async () => {
    const url = "http://127.0.0.1:8000/engineers/";
    try {
      const response = await axios.get(url);
      setAllEngineers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClient = async (clientId) => {
    if (!clientId) return;
    const url = `http://127.0.0.1:5001/clients/${clientId}/`;
    try {
      const response = await axios.get(url);
      setLongitude(response.data.longitude);
      setLatitude(response.data.latitude);
    } catch (error) {
      console.error(error);
    }
  };

  // Handler for adding a new engineer via modal
  const handleConfirmAddEngineer = async () => {
    if (!selectedEngineerId) return;
    const engineerId = parseInt(selectedEngineerId, 10);
    // Prevent duplicate additions
    if (task.engineers.includes(engineerId)) {
      console.warn("Engineer already assigned");
      return;
    }
    // Create an updated list of engineer IDs
    const updatedEngineers = [...task.engineers, engineerId];
    const updatedTask = { ...task, engineers: updatedEngineers };

    const url = `http://127.0.0.1:5040/tasks/${id}`;
    try {
      const response = await axios.put(url, updatedTask, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 202) {
        setTask(updatedTask);
        setOpenAddEngineerModal(false);
        setSelectedEngineerId("");
        await fetchEngineers(updatedTask);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle the deletion of an engineer from the task.
  const handleDeleteEngineer = async (engineerId) => {
    // Remove the engineer from the local state immediately.
    setEngineers((prevEngineers) =>
      prevEngineers.filter((eng) => eng.id !== engineerId)
    );

    // Create an updated list of engineer IDs for the task.
    const remainingEngineers = task.engineers.filter((id) => id !== engineerId);

    const url = `http://127.0.0.1:5040/tasks/${id}`;
    const updatedTask = {
      ...task,
      engineers: remainingEngineers,
    };
    try {
      const response = await axios.put(url, updatedTask, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 202) {
        console.log(`Deleted engineer with id: ${engineerId}`);
        setOpenEngineerDeleteSuccessModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Open confirmation modal for deleting an engineer.
  const handleOpenDeleteModal = (engineer) => {
    setEngineerToDelete(engineer);
    setOpenDeleteModal(true);
  };

  // Confirm deletion from the modal.
  const handleConfirmDeleteEngineer = () => {
    if (engineerToDelete) {
      handleDeleteEngineer(engineerToDelete.id);
      setEngineerToDelete(null);
    }
    setOpenDeleteModal(false);
  };

  const handleCancelDeleteEngineer = () => {
    setEngineerToDelete(null);
    setOpenDeleteModal(false);
  };

  // Handler for task delete.
  const handleDeleteTask = async () => {
    const url = `http://127.0.0.1:5040/tasks/${id}`;
    try {
      const response = await axios.delete(url);
      if (response.status === 204) {
        navigate("/tasks");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameClick = (engineer) => {
    const engineerTaskId = `${task.quotation_id}-${engineer.id}`;
    console.log(task.quotation_id)
    // Navigate to the /disburse route and pass state
    navigate("/task/disburse", { state: { engineer, engineerTaskId, taskId: task.quotation_id } });
  };

  // Handler for saving updated task information.
  const handleSaveTask = async () => {
    const updatedTask = {
      ...task,
      total_amount: totalAmount,
    };
    const url = `http://127.0.0.1:5040/tasks/${id}`;
    try {
      const response = await axios.put(url, updatedTask, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 202) {
        setOpenSuccessModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // DataGrid columns for engineers table.
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          onClick={() => handleNameClick(params.row)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {params.row.first_name} {params.row.last_name}
        </Typography>
      ),
    },
    {
      field: "engineerTaskId",
      headerName: "Engineer TaskID",
      flex: 1,
      valueGetter: (params) =>
        task && task.quotation_id
          ? `${task.quotation_id}-${params.row.id}`
          : "",
    },
    {
      field: "disbursed",
      headerName: "Amount disbursed",
      flex: 1,
      valueGetter: (params) => { return disbursements[`${task.quotation_id}-${params.row.id}`] || 0; }
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleOpenDeleteModal(params.row)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (!task) return <Typography>Loading task details...</Typography>;

  return loading ? (
    <Typography>Loading task details...</Typography>
  ) : (
    <Box m="20px">
      <Header title={`Task: ${task.name}`} subtitle="Task Details" />

      {/* Task Action Button (Delete Task) */}
      <Box display="flex" justifyContent="flex-end" mb="15px" mr="20px">
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenDeleteTaskModal(true)}
        >
          Delete Task
        </Button>
      </Box>

      {/* Task Details */}
      <Box mb="20px">
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="105px">Status: </Typography>
          {task.status === "created" ? (
            <Typography
              variant="outlined"
              size="small"
              className="text-red-700 uppercase"
            >
              {task.status}
            </Typography>
          ) : task.status === "scheduled" ? (
            <Typography
              variant="outlined"
              size="small"
              className="text-green-700 uppercase "
            >
              {task.status}
            </Typography>
          ) : (
            <Typography
              variant="outlined"
              size="small"
              className="text-blue-700 uppercase"
            >
              {task.status}
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="80px">Task Name: </Typography>
          <Typography variant="outlined" size="small">
            {task.name}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="70px">Quotation ID: </Typography>
          <Typography variant="outlined" size="small">
            {task.quotation_id}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="65px">Total Amount: </Typography>
          <TextField
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="45px">Amount received: </Typography>
          <Typography variant="outlined" size="small">
            Ksh {task.paid_amount}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="36px">Amount disbursed: </Typography>
          <Typography variant="outlined" size="small">
            Ksh {disbursements.total}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt="10px">
          <Typography mr="50px">Percentage Paid: </Typography>
          <Typography variant="outlined" size="small">
            {(task.paid_amount / task.total_amount) * 100}%
          </Typography>
        </Box>
      </Box>

      {/* Delete Task Confirmation Modal */}
      <Dialog
        open={openDeleteTaskModal}
        onClose={() => setOpenDeleteTaskModal(false)}
      >
        <DialogTitle>Confirm Task Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteTaskModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTask} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Button */}
      <Box mb="20px" ml="120px">
        <Button variant="contained" color="secondary" onClick={handleSaveTask}>
          Save
        </Button>
      </Box>

      {/* Engineers Assigned Section */}
      <Box mb="20px">
        <Typography variant="h6" mb="10px">
          Engineers Assigned
        </Typography>

        {/* Button to open Add Engineer Modal */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddEngineerModal(true)}
          style={{ marginBottom: "10px" }}
        >
          Add Engineer
        </Button>

        <Box height="300px">
          <DataGrid
            rows={engineers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Box>

      {/* Google Maps Iframe */}
      <Box
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        boxShadow={3}
        height="800px"
      >
        <Typography variant="h5" mt="30px" mb="10px" color={colors.grey[100]}>
          Task Location
        </Typography>
        <Box
          component="iframe"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, borderRadius: "8px" }}
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDPTUymbyit-G9-QNt6cLHA5JaI54m00Lw&q=${latitude},${longitude}&zoom=15`}
          allowFullScreen
        />
      </Box>

      {/* Delete Engineer Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCancelDeleteEngineer}>
        <DialogTitle>Confirm Engineer Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            {engineerToDelete
              ? `${engineerToDelete.first_name} ${engineerToDelete.last_name}`
              : "this engineer"}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteEngineer} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteEngineer} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Save Success Modal */}
      <Dialog
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Task updated successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccessModal(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Engineer Delete Success Modal */}
      <Dialog
        open={openEngineerDeleteSuccessModal}
        onClose={() => setOpenEngineerDeleteSuccessModal(false)}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Engineer deleted successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEngineerDeleteSuccessModal(false)}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Engineer Modal */}
      <Dialog
        open={openAddEngineerModal}
        onClose={() => setOpenAddEngineerModal(false)}
      >
        <DialogTitle>Add Engineer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an engineer to assign to this task.
          </DialogContentText>
          <Select
            fullWidth
            value={selectedEngineerId}
            onChange={(e) => setSelectedEngineerId(e.target.value)}
          >
            {allEngineers.map((eng) => (
              <MenuItem key={eng.id} value={eng.id}>
                {eng.first_name} {eng.last_name} (ID: {eng.id})
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddEngineerModal(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmAddEngineer} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Task;

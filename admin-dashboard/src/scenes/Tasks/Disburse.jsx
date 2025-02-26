import {
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
  } from "@mui/material";
  import axios from "axios";
  import { useState, useEffect } from "react";
  import { useLocation } from "react-router-dom";
  
  const Disburse = () => {
    const [wage, setWage] = useState(0);
    const [disbursements, setDisbursements] = useState([]);
    const [totalDisbursed, setTotalDisbursed] = useState(0);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
  
    const location = useLocation();
    const { engineer, engineerTaskId, taskId } = location.state;
  
    // Fetch previous disbursements for this engineer
    const fetchDisbursements = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5050/disburse/engineer-task/${engineerTaskId}/`
        );
        if (response.status === 200) {
          let data = response.data;
          // If the API returns an object, ensure we extract an array and total amount.
          if (!Array.isArray(data)) {
            // Expecting data to have properties "disbursements" and "total_amount"
            data = data || {};
          }
          setDisbursements(data.disbursements || []);
          setTotalDisbursed(data.total_amount || 0);
        }
      } catch (error) {
        console.error("Error fetching disbursements:", error);
      }
    };
  
    useEffect(() => {
      if (engineer) {
        fetchDisbursements();
      }
    }, [engineer]);
  
    const handleDisburseClick = async () => {
      const wageValue = parseInt(wage, 10);
      if (!isNaN(wageValue)) {
        const url = "http://127.0.0.1:5050/disburse/";
        try {
          const payload = {
            task_id: taskId,
            engineer_task_id: engineerTaskId,
            amount: wageValue,
            engineer_id: engineer.id,
          };
          const response = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
          });
          if (response.status === 201) {
            // Show success modal when status is 201
            setWage(0);
            setOpenSuccessModal(true);
          } else if (response.status === 202) {
            // If status 202, immediately refresh data
            setWage(0);
            fetchDisbursements();
          }
        } catch (error) {
          console.error("Error disbursing wage:", error);
        }
      } else {
        console.warn("Please enter a valid wage.");
      }
    };
  
    return (
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mt: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Disburse Payment
        </Typography>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 2,
            pb: 1,
          }}
        >
          <Typography variant="h6">
            <strong>Name:</strong> {engineer.first_name} {engineer.last_name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <strong>Engineer TaskID:</strong> {engineerTaskId}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Phone:</strong> {engineer.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {engineer.email}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Wage"
          type="number"
          value={wage}
          onChange={(e) => setWage(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleDisburseClick}
          sx={{ py: 1.5, mb: 3 }}
        >
          Disburse
        </Button>
  
        {/* Previous Disbursements Table */}
        <Typography variant="h5" gutterBottom>
          Previous Disbursements
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Engineer TaskID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Engineer ID</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disbursements.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.task_id}</TableCell>
                  <TableCell>{row.engineer_task_id}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.engineer_id}</TableCell>
                  <TableCell>{new Date(row.created_at).toLocaleString("en-US", { timeZone: "Africa/Nairobi" })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Total Amount Section */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">
            Total Disbursed Amount: {totalDisbursed}
          </Typography>
        </Box>
  
        {/* Success Modal */}
        <Dialog
          open={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
        >
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Disbursement was successful.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenSuccessModal(false);
                // Re-fetch disbursements to update the component
                fetchDisbursements();
              }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default Disburse;
  
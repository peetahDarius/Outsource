import { 
  Box, 
  Typography, 
  useTheme, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ClientProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const client = location.state?.client;

  // Use client values for profile data (you can adjust as needed)
  const profileData = {
    first_name: client.first_name,
    last_name: client.last_name,
    message: client.message || "Welcome to your profile page!",
    email: client.email,
    phone: client.phone,
    status: client.status,
  };

  const fullName = `${profileData.first_name} ${profileData.last_name}`;

  // Use client's coordinates; fallback to Space Needle coordinates in Seattle
  const latitude = client.coordinates.latitude || "47.6205";
  const longitude = client.coordinates.longitude || "-122.3493";

  // Modal state
  const [openSMS, setOpenSMS] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);

  // Form fields state
  const [smsContent, setSmsContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  // Modal open/close handlers
  const handleSMSOpen = () => setOpenSMS(true);
  const handleSMSClose = () => setOpenSMS(false);
  const handleEmailOpen = () => setOpenEmail(true);
  const handleEmailClose = () => setOpenEmail(false);

  // Handle file attachment change
  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  // Dummy submit handlers for SMS and Email
  const handleSendSMS = async () => {
    const url = "http://127.0.0.1:5010/sms/";
    const smsData = {
      recipient_list: [profileData.phone],
      message: smsContent,
    };
    try {
      const response = await axios.post(url, JSON.stringify(smsData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    console.log("Sending SMS to", profileData.phone, "with message:", smsContent);
    setOpenSMS(false);
  };

  const handleSendEmail = async () => {
    const url = "http://127.0.0.1:8090/send-email/";
    let formData = new FormData();
    formData.append("to", profileData.email);
    formData.append("subject", emailSubject);
    formData.append("body", emailContent);
    if (attachedFile) {
      formData.append("file", attachedFile);
    }

    try {
      const response = await axios.post(url, formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    setOpenEmail(false);
  };

  return (
    <Box m="20px" sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Header title="Client" subtitle="Client Details" />

      {/* Profile Details */}
      <Box
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        boxShadow={3}
        display="flex"
        flexDirection="column"
        gap="12px"
      >
        <Typography variant="h4" color={colors.grey[100]}>
          {fullName}
        </Typography>
        <Typography variant="body1" color={colors.grey[100]}>
          Email: {profileData.email}
        </Typography>
        <Typography variant="body1" color={colors.grey[100]}>
          Phone: {profileData.phone}
        </Typography>
        <Typography variant="body1" color={colors.grey[100]}>
          Message: {profileData.message}
        </Typography>
        <Typography variant="body1" color={colors.grey[100]}>
          Status: {profileData.status}
        </Typography>
        <Box mt="20px" display="flex" gap="10px">
          <Button variant="contained" color="primary" onClick={handleSMSOpen}>
            Send SMS
          </Button>
          <Button variant="contained" color="secondary" onClick={handleEmailOpen}>
            Send Email
          </Button>
          {/* New Quotation Button */}
          <Button variant="contained" color="info" onClick={() => navigate("/quotation", { state : {client: client}})}>
            Create Quotation
          </Button>
        </Box>
      </Box>

      {/* Google Map Integration with a marker */}
      <Box
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        boxShadow={3}
        height="800px"
      >
        <Typography variant="h5" mb="10px" color={colors.grey[100]}>
          Location
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

      {/* SMS Modal */}
      <Dialog open={openSMS} onClose={handleSMSClose} fullWidth maxWidth="md">
        <DialogTitle>Send SMS</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            variant="standard"
            value={smsContent}
            onChange={(e) => setSmsContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSMSClose}>Cancel</Button>
          <Button onClick={handleSendSMS}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={openEmail} onClose={handleEmailClose} fullWidth maxWidth="md">
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            variant="standard"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Attach Document
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {attachedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Attached: {attachedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailClose}>Cancel</Button>
          <Button onClick={handleSendEmail}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientProfile;

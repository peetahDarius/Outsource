import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import Header from "../../components/Header"; // Reuse your header design
import { tokens } from "../../theme"; // Your theme tokens
import { useTheme } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// IMPORTANT: Replace with your actual API key.
const GOOGLE_MAPS_API_KEY = "AIzaSyDPTUymbyit-G9-QNt6cLHA5JaI54m00Lw";

const containerStyle = {
  width: "100%",
  height: "700px",
};

const defaultCenter = { lat: 47.6205, lng: -122.3493 };

const CreateClient = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  // Client form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Google Map and location states
  const [searchAddress, setSearchAddress] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [savedCoordinates, setSavedCoordinates] = useState(null);

  // For handling the confirmation modal on double-click
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState(null);

  // Autocomplete reference
  const [autocomplete, setAutocomplete] = useState(null);

  // Called when the map is double-clicked – open a modal to confirm saving the location.
  const handleMapDoubleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setTempCoordinates({ lat, lng });
    setOpenLocationModal(true);
  };

  // When the user confirms, save the coordinates and center the map.
  const handleSaveLocation = () => {
    setSavedCoordinates(tempCoordinates);
    setMapCenter(tempCoordinates);
    setOpenLocationModal(false);
  };

  const handleCancelLocation = () => {
    setTempCoordinates(null);
    setOpenLocationModal(false);
  };

  // Autocomplete handlers
  const onLoadAutocomplete = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(newCenter);
        setSearchAddress(place.formatted_address || place.name);
      }
    }
  };

  // When the form is submitted, collect the client data.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientData = {
      first_name: firstName,
      last_name: lastName,
      message,
      email,
      phone,
      latitude: savedCoordinates.lat,
      longitude: savedCoordinates.lng,
    };
    console.log("Creating client:", clientData);
    const url = "http://127.0.0.1:5001/clients/";
    try {
      const response = await axios.post(url, clientData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        navigate("/clients");
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box m="20px" display="flex" flexDirection="column" gap="20px">
      <Header title="Create Client" subtitle="Enter client details" />

      <Box
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        boxShadow={3}
      >
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap="16px">
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={8}
              fullWidth
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            {/* Location search using Autocomplete */}
            <LoadScript
              googleMapsApiKey={GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
            >
              <Autocomplete
                onLoad={onLoadAutocomplete}
                onPlaceChanged={onPlaceChanged}
              >
                <TextField
                  label="Search Location"
                  variant="outlined"
                  fullWidth
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                />
              </Autocomplete>

              {/* Google Map integration */}
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
                onDblClick={handleMapDoubleClick}
                options={{ disableDoubleClickZoom: true }}
              >
                {savedCoordinates && <Marker position={savedCoordinates} />}
              </GoogleMap>
            </LoadScript>

            <Button variant="contained" color="primary" type="submit">
              Create Client
            </Button>
          </Box>
        </form>
      </Box>

      {/* Location confirmation modal */}
      <Dialog open={openLocationModal} onClose={handleCancelLocation}>
        <DialogTitle>Save Location</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to save this location?
            {tempCoordinates && (
              <>
                <br />
                Latitude: {tempCoordinates.lat.toFixed(4)}, Longitude:{" "}
                {tempCoordinates.lng.toFixed(4)}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLocation}>Cancel</Button>
          <Button onClick={handleSaveLocation}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateClient;

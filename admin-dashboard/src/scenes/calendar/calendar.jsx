import { useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [loading, setLoading] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchPendingTasks();
    fetchInitialEvents();
  }, []);

  const fetchInitialEvents = async () => {
    setLoading(true);
    const url = "http://127.0.0.1:5070/schedule/";
    try {
      const response = await axios.get(url);
      setInitialEvents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTasks = async () => {
    const url = "http://127.0.0.1:5040/tasks/unscheduled/";
    try {
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Instead of prompting, we open the modal and save the selected date info.
  const handleDateClick = (selected) => {
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();
    setSelectedDateInfo(selected);
    setTaskModalOpen(true);
  };

  // When a task is selected and confirmed, add the event using the task's name.
  const handleTaskSelect = async () => {
    if (!selectedTask || !selectedDateInfo) return;

    // Construct the event object
    const eventData = {
      id: selectedTask.quotation_id, // use a unique id as needed
      title: selectedTask.name,
      start: selectedDateInfo.startStr,
      end: selectedDateInfo.endStr,
      allDay: selectedDateInfo.allDay,
      extendedProps: {
        task: selectedTask,
      },
    };

    try {
      const url = "http://127.0.0.1:5070/schedule/";
      const response = await axios.post(url, eventData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        const calendarApi = selectedDateInfo.view.calendar;
        calendarApi.addEvent(eventData);
        // Reset modal state
        setSelectedTask("");
        setSelectedDateInfo(null);
        setTaskModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEventDrop = async (info) => {
    // Construct updated event data
    const updatedEvent = {
      id: info.event._def.publicId, // The event's ID
      start: info.event.startStr, // New start date/time as a string
      end: info.event.endStr, // New end date/time as a string
      allDay: info.event.allDay, // Whether it's an all-day event
      title: info.event.title,
    };

    console.log("updated event: ", updatedEvent);

    try {
      await axios.put(
        `http://127.0.0.1:5070/schedule/${info.event._def.publicId}/`,
        updatedEvent,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Event updated in backend");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleModalClose = () => {
    setSelectedTask("");
    setSelectedDateInfo(null);
    setTaskModalOpen(false);
  };

  // Event click for FullCalendar (e.g., to delete an event)
  const handleEventClick = async (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'?`
      )
    ) {
      selected.event.remove();
      const url = `http://127.0.0.1:5070/schedule/${selected.event._def.publicId}/`;
      try {
        await axios.delete(url);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    !loading && (
      <Box m="20px">
        <Header title="Schedule" subtitle="" />

        <Box display="flex" justifyContent="space-between">
          {/* CALENDAR SIDEBAR */}
          <Box
            flex="1 1 20%"
            backgroundColor={colors.primary[400]}
            p="15px"
            borderRadius="4px"
            sx={{ overflowY: "auto", maxHeight: "75vh" }}
          >
            <Typography variant="h5">Events</Typography>
            <List>
              {currentEvents
                .slice() // Make a shallow copy to avoid mutating state directly
                .sort((a, b) => new Date(b.start) - new Date(a.start))
                .map((event) => (
                  <ListItem
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      margin: "10px 0",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Typography>
                          {formatDate(event.start, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Box>

          {/* CALENDAR */}
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop} // <-- added here
              eventsSet={(events) => {
                setCurrentEvents(events);
              }}
              events={initialEvents}
            />
          </Box>
        </Box>

        {/* Task Selection Modal */}
        <Dialog open={taskModalOpen} onClose={handleModalClose}>
          <DialogTitle>Select Task for Event</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="task-select-label">Task</InputLabel>
              <Select
                labelId="task-select-label"
                value={selectedTask}
                label="Task"
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                {tasks.map((task, index) => (
                  <MenuItem key={index} value={task}>
                    {task.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleTaskSelect} disabled={!selectedTask}>
              Select
            </Button>
          </DialogActions>
        </Dialog>

        {/* Event Details Modal */}
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
        >
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <strong>Title:</strong> {selectedEvent?.title}
            </Typography>
            <Typography variant="body1">
              <strong>Start:</strong>{" "}
              {formatDate(selectedEvent?.start, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Typography>
            <Typography variant="body1">
              <strong>End:</strong>{" "}
              {selectedEvent?.end
                ? formatDate(selectedEvent.end, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>All Day:</strong> {selectedEvent?.allDay ? "Yes" : "No"}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedEvent(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
};

export default Calendar;

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Clients from "./scenes/clients";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Engineers from "./scenes/engineers";
import ClientProfile from "./scenes/clients/ClientProfile";
import Quotation from "./scenes/clients/Quotation";
import Payments from "./scenes/payments";
import Tasks from "./scenes/Tasks";
import CreateTask from "./scenes/Tasks/CreateTask";
import Task from "./scenes/Tasks/Task";
import CreateClient from "./scenes/clients/CreateClient";
import Disburse from "./scenes/Tasks/Disburse";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/add" element={<CreateClient />} />
              <Route path="/clients/profile" element={<ClientProfile />} />
              <Route path="/quotation" element={<Quotation />} />
              <Route path="/task/disburse" element={<Disburse />} />
              <Route path="/engineers" element={<Engineers />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<Task />} />
              <Route path="/tasks/add" element={<CreateTask />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/engineers/add" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

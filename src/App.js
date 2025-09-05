import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CatalogLayout from "./layouts/catalog";
import DashboardLayout from "./layouts/dashboard";
import CatalogOnly from "./layouts/catalogOnly";
import DashboardCatalog from "./layouts/dashboardCatalog"




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CatalogLayout />} />
        <Route path="/catalogo/:tipo?" element={<CatalogOnly />} />
        <Route path="*" element={<Navigate to="/" />} />
      
  
      </Routes>
    </Router>
  );
}

export default App;

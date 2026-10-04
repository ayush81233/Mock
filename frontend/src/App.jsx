import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import SIR from "./pages/SIR";
import Documents from "./pages/Documents";
import Services from "./pages/Services";
import Search from "./pages/Search";
import Help from "./pages/Help";
import SchemeDetails from "./pages/SchemeDetails";
import "./styles/global.css";
import CitizenServices from "./pages/CitizenServices";
import DocumentDetails from "./pages/DocumentDetails";
import MockDocument from "./pages/MockDocument";
import EligibilityChecker from "./pages/EligibilityChecker";
import SchemeFinder from "./pages/SchemeFinder";


import Accessibility from "./pages/Accessibility";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";

import DocumentChecklist from "./pages/DocumentChecklist";

function App() {
  return (
    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/schemes" element={<Schemes />} />

          <Route path="/schemes/:id" element={<SchemeDetails />} />

          <Route path="/sir" element={<SIR />} />

          <Route path="/documents" element={<Documents />} />

          <Route path="/services" element={<Services />} />

          <Route path="/search" element={<Search />} />

          <Route path="/help" element={<Help />} />

          <Route path="/documents/:id" element={<DocumentDetails />} />
          
          <Route path="/documents/mock/:type" element={<MockDocument />} />

          <Route path="/citizen-services" element={<CitizenServices />} />

          <Route path="/citizen-services/scheme-finder" element={<SchemeFinder />} />


          <Route path="/citizen-services/eligibility" element={<EligibilityChecker />} />

          <Route path="/citizen-services/documents" element={<DocumentChecklist />} />

          

<Route
  path="/accessibility"
  element={<Accessibility />}
/>

<Route
  path="/contact"
  element={<Contact />}
/>

<Route
  path="/privacy"
  element={<Privacy />}
/>

<Route
  path="/disclaimer"
  element={<Disclaimer />}
/>

        </Routes>

      </MainLayout>

    </BrowserRouter>
  );
}

export default App;
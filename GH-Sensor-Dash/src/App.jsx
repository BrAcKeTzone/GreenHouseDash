import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";

const routesConfig = [
  { path: "/", element: <Dashboard /> },
  { path: "/htr", element: <History /> },
  { path: "*", element: <NotFoundPage /> },
];

function App() {
  return (
    <Router>
      <Routes>
        {routesConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<Layout>{route.element}</Layout>}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;

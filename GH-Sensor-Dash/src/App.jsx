import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout.jsx";
// import SigninPage from "./pages/SigninPage.jsx";
// import SignupPage from "./pages/SignupPage.jsx";
// import ForgotPassPage from "./pages/ForgotPassPage.jsx";
// import ControlPanel from "./pages/ControlPanel.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";

const routesConfig = [
  // { path: "/", element: <SigninPage /> },
  // { path: "/sig", element: <SignupPage /> },
  // { path: "/for", element: <ForgotPassPage /> },
  { path: "/", element: <Dashboard /> },
  { path: "/htr", element: <History /> },
  // { path: "/usr", element: <ControlPanel /> },
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

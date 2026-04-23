import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import "./i18n/index";
import Header from "./components/Layout/Header";
import LandingPage from "./pages/LandingPage";
import FormPage from "./pages/FormPage";
import ResultPage from "./pages/ResultPage";
import PublicEducationPage from "./pages/PublicEducationPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#FFF5F3" }}>
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: 32, color: "#888" }}>
              Loading...
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <LandingPage />
                </>
              }
            />
            <Route
              path="/form"
              element={
                <>
                  <Header />
                  <FormPage />
                </>
              }
            />
            <Route
              path="/result"
              element={
                <>
                  <Header />
                  <ResultPage />
                </>
              }
            />
            <Route path="/public" element={<PublicEducationPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;

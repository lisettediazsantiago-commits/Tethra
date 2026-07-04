import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Landing from "./screens/Landing";
import WhyTethra from "./screens/WhyTethra";
import Auth from "./screens/Auth";
import Onboarding from "./screens/Onboarding";
import Blueprint from "./screens/Blueprint";
import Dashboard from "./screens/Dashboard";
import ComfortMap from "./screens/ComfortMap";
import Journal from "./screens/Journal";
import Snapshot from "./screens/Snapshot";
import Sharing from "./screens/Sharing";
import Timeline from "./screens/Timeline";
import Reflect from "./screens/Reflect";
import Moments from "./screens/Moments";
import Intimacy from "./screens/Intimacy";
import SharedSpace from "./screens/SharedSpace";
import Saved from "./screens/Saved";
import CheckIn from "./screens/CheckIn";
import Safety from "./screens/Safety";
import Settings from "./screens/Settings";
import Identity from "./screens/Identity";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/why" element={<WhyTethra />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/safety" element={<Safety />} />

            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/blueprint" element={<ProtectedRoute><Blueprint /></ProtectedRoute>} />

            <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="comfort-map" element={<ComfortMap />} />
              <Route path="intimacy" element={<Intimacy />} />
              <Route path="shared" element={<SharedSpace />} />
              <Route path="saved" element={<Saved />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="journal" element={<Journal />} />
              <Route path="snapshot" element={<Snapshot />} />
              <Route path="sharing" element={<Sharing />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="reflect" element={<Reflect />} />
              <Route path="moments" element={<Moments />} />
              <Route path="settings" element={<Settings />} />
              <Route path="identity" element={<Identity />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

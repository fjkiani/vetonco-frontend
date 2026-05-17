import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { AppShell } from "./components/layout/AppShell";
import { Landing } from "./routes/Landing";
import { SignIn } from "./routes/SignIn";
import { SignUp } from "./routes/SignUp";
import { Dashboard } from "./routes/Dashboard";
import { PetNew } from "./routes/PetNew";
import { PetOverview } from "./routes/PetOverview";
import { PetAnalyze } from "./routes/PetAnalyze";
import { PetCompounds } from "./routes/PetCompounds";
import { PetDosage } from "./routes/PetDosage";
import { PetRecipe } from "./routes/PetRecipe";
import { TestHistory } from "./routes/TestHistory";
import { TestNew } from "./routes/TestNew";
import { TestDetail } from "./routes/TestDetail";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      {/* Protected — wrapped in AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets/new" element={<PetNew />} />
        <Route path="/pets/:id" element={<PetOverview />} />
        <Route path="/pets/:id/analyze" element={<PetAnalyze />} />
        <Route path="/pets/:id/compounds" element={<PetCompounds />} />
        <Route path="/pets/:id/dosage" element={<PetDosage />} />
        <Route path="/pets/:id/recipe" element={<PetRecipe />} />
        <Route path="/pets/:id/tests" element={<TestHistory />} />
        <Route path="/pets/:id/tests/new" element={<TestNew />} />
        <Route path="/pets/:id/tests/:testId" element={<TestDetail />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

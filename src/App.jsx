import { Routes, Route } from "react-router-dom";
import Login from "./features/pages/Login";
import Dashboard from "./features/pages/dashboard";
import Header from "./components/layout/Header";

function App() {
  return (
    <div className="App">
      <Header /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
export default App;


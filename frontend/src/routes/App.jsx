import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "../features/shared/layouts/MainLayout";
import Home from "../pages/root";

function App() {
  return (
     <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App

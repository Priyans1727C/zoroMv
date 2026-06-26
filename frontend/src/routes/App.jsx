import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

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

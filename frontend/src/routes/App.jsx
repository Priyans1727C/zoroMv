import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "../features/shared/layouts/MainLayout";
// import Home from "../pages/root";
import Home from "../features/home/Home";
import MovieDetails from "../features/shared/pages/CardDetails";

function App() {
  return (
     <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="movies/:id" element={<MovieDetails />} />
      </Route>
    </Routes>
  )
}

export default App

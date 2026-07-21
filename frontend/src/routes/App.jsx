import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "../features/shared/layouts/MainLayout";
// import Home from "../pages/root";
import Home from "../features/home/Home";
import MovieDetails from "../features/shared/pages/CardDetails";
import Player from "../features/shared/pages/Player";
import StickyCardStack from "../features/shared/pages/Test";

function App() {
  return (
     <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="find/:mediaType/:slug" element={<MovieDetails />} />
        <Route path="watch/:mediaType/:slug" element={<Player />} />
        <Route path="test" element={<StickyCardStack />} />
      </Route>
    </Routes>
  )
}

export default App

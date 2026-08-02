import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import TestLayout from "../features/test/TestLayout";
import Home from "../features/home/Home";
import MovieDetails from "../features/shared/pages/CardDetails";
import Player from "../features/shared/pages/Player";
import SearchPage from "../features/shared/pages/Search";
import StickyCardStack from "../features/shared/pages/Test";
import Browse from "../features/shared/pages/Browse";
import Test from "../features/shared/pages/Test";

function App() {
  return (
     <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="find/:mediaType/:slug" element={<MovieDetails />} />
        <Route path="watch/:mediaType/:slug" element={<Player />} />
        {/* <Route path="test" element={<StickyCardStack />} /> */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/browse/:category" element={<Browse />} />
      </Route>

      {/* <Route element={}> */}
        <Route path="/test" element={<Test/>} />
      {/* </Route> */}
    </Routes>
  )
}

export default App

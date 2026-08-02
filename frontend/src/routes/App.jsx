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
import ComingSoonPage from "../features/shared/components/CommingSoon";
import { Compass, Heart, User, Settings } from "lucide-react";

const COMING_SOON_ROUTES = [
  { path: "/explore", title: "Explore", icon: Compass, description: "Discovery browsing is on the way." },
  { path: "/favourites", title: "Favourites", icon: Heart, description: "Saved titles will land here soon." },
  { path: "/community", title: "Community", icon: Compass, description: "Community features are coming soon." },
  { path: "/my-list", title: "My List", icon: Heart, description: "Personal watchlists will be available soon." },
  { path: "/profile", title: "Profile", icon: User, description: "Profile pages are not live yet." },
  { path: "/settings", title: "Settings", icon: Settings, description: "Settings are still being built." },
];


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
        {COMING_SOON_ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ComingSoonPage {...route} />}
          />
        ))}
      </Route>

        <Route path="*" element={<ComingSoonPage/>} />
    </Routes>
  )
}

export default App

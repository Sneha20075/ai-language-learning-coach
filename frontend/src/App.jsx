import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar   from "./components/Navbar";
import Home     from "./pages/Home";
import About    from "./pages/About";
import Contact  from "./pages/Contact";
import JoinBeta from "./pages/JoinBeta";
import Login    from "./pages/Login";
import Signup   from "./pages/Signup";
import AIChat   from "./pages/AIChat";
import ObjectDetection from "./pages/ObjectDetection";
import Learn from "./pages/Learn";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import FloatingAI from "./components/FloatingAI";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/join-beta" element={<JoinBeta />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/ai-coach"  element={<AIChat />} />
        <Route path="/object-detection" element={<ObjectDetection />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer />
      <FloatingAI />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
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
import { ToastContainer } from "react-toastify";

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
      </Routes>
      < ToastContainer />
    </BrowserRouter>
  );
}

export default App;
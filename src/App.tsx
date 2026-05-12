import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/layout/ParticleBackground";
import Home from "@/pages/Home";
import Tools from "@/pages/Tools";
import Games from "@/pages/Games";
import Calculator from "@/pages/Calculator";
import Creative from "@/pages/Creative";
import Learn from "@/pages/Learn";
import Charts from "@/pages/Charts";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white">
        <ParticleBackground />
        <Header />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/games" element={<Games />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/creative" element={<Creative />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

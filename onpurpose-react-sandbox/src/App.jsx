import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div className="paper-grain"></div>

      {/* Scroll-to-top hidden anchor */}
      <div id="top"></div>

      <Navbar />

      <main>
        <Hero />
        <About />
        <Events />
        <Gallery />
      </main>

      <Footer />
    </>
  );
}

export default App;

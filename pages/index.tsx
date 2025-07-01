import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Resume from "../components/Resume";
import SplashCursor from "../components/SplashCursor";

<SplashCursor />;

export default function HomePage() {
  return (
    <main className="bg-black text-white scroll-smooth">
      <Hero />
      <About />
      <Projects />
      <Resume />
      <SplashCursor />
    </main>
  );
}

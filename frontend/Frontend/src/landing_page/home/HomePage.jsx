import Hero from "./Hero";

import Community from "./Community";
import HowItWorks from "./HowItWorks";

import Testimonials from "./Testimonials";
import About from "./About";
import CtaSection from "./CtaSection";
import PopularSkills from "./PopularSkills";

function HomePage() {
  return (
    <>
      <Hero />
      <Community />
      <HowItWorks />
      <PopularSkills />
      <Testimonials />
      <About />
      <CtaSection />
    </>
  );
}

export default HomePage;

import React from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Services from "./Components/Service";
import AboutMe from "./Components/About";
import Footer from "./Components/Footer";
import FAQsSection from "./Components/Question";
import TestimonialsSection from "./Components/Testimonioals";
import ContactSection from "./Components/Contact";


function App() {
  return (
    <div className="bg-[#F4F3FE] ">
      <Header />
      <Hero />
     <Services></Services>
      <AboutMe />
      <TestimonialsSection></TestimonialsSection>
      <ContactSection></ContactSection>
      <FAQsSection></FAQsSection>
      <Footer />
    </div>
  );
}

export default App;

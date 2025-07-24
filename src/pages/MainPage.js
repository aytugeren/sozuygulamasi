import React from "react";
import HeroPage from "./HeroPage";
import HowItWorksPage from "./HowItWorksPage";
import DemoPages from "./DemoPage";
import PricingPage from "./PricingPage";
import FAQPage from "./FAQPage";
import ContactFooterPage from "./ContactFooterPage";

const MainPage = () => {
  return (
    <>
    <HeroPage />
    <HowItWorksPage />
    <DemoPages />
    <PricingPage />
    <FAQPage />
    <ContactFooterPage />
    </>
  );
}

export default MainPage;
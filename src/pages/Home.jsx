import React from 'react';
import Hero from '../components/Hero';
import Artists from '../components/Artists';
import ServicesStudio from '../components/ServicesStudio';
import Socials from '../components/Socials';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Artists />
      <ServicesStudio />
      <Socials />
      <Contact />
    </>
  );
}
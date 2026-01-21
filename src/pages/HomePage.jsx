import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import TransformationSection from '../components/Home/TransformationSection';
import AboutPage from './AboutPage';
import MembershipPage from './MembershipPage';
import ServicesPage from './ServicesPage';
import TrainersPage from './TrainersPage';
import GalleryPage from './GalleryPage';
import ContactForm from '../components/Contact/ContactForm';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';

const HomePage = () => {
  return (
    <>
       
      <HeroSection />
      <TransformationSection />
      <AboutPage />
      <MembershipPage />
      <ServicesPage />
      <TrainersPage />
      <GalleryPage />   
      <ContactForm />
       
    </>
  );
};

export default HomePage;
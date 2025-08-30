import React, { useState } from 'react'
import HeroSection from '../components/HeroSection'
import EventsHeroSection from '../components/EventsHeroSection'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import InfoSection from '../components/InfoSection'
import { homeObjOne, homeObjThree } from '../components/InfoSection/Data'
import RevealBento from '../components/RevealBento'
import Footer from '../components/Footer'

const Home = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            <HeroSection/>
            <EventsHeroSection/>
            <InfoSection {...homeObjOne}/>
            <RevealBento/>
            <InfoSection {...homeObjThree}/>
            <Footer/>
        </>
    )
}

export default Home
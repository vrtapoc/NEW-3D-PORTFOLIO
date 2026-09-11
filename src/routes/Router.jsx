import React from 'react'
import HomePage from '../pages/Home/HomePage';
import AboutPage from '../pages/About/AboutPage';
import SkillsPage from '../pages/Skills/SkillsPage';
import ProjectsPage from '../pages/Projects/ProjectsPage';
import ContactsPage from '../pages/Contacts/ContactsPage';
import { Routes, Route } from 'react-router';

const Router = () => {
  return (
        <Routes>
            <Route 
            index 
            element={
                <HomePage />
            } 
            />
            <Route 
            path="about" 
            element={
                <AboutPage /> 
            } 
            />
            <Route 
            path="skills" 
            element={
                <SkillsPage />
            } 
            />
            <Route 
            path="project-experience" 
            element={
                <ProjectsPage />
            } 
            />
            <Route 
            path="contacts" 
            element={
                <ContactsPage />
            } 
            />
        </Routes>
  )
}

export default Router

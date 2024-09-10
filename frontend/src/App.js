import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeroList from './components/HeroList';
import AddHero from './components/AddHero';
import EditHero from './components/EditHero';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HeroList />} />
                    <Route path="/add-hero" element={<AddHero />} />
                    <Route path="/edit-hero/:id" element={<EditHero />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

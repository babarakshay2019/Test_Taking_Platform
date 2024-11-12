import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/SignUp';
import LogIn from './Pages/LogIn';
import DashBoard from './compontents/Dashboard'
import ViewTest from './Pages/ViewTest';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register/>} />  
        <Route path="/login" element={<LogIn/>} />  
        <Route path="/dashboard" element={<DashBoard />} />  
        <Route path="/view-test/:testId" element={<ViewTest />} />                   
        
      </Routes>
    </Router>
  );
}

export default App;

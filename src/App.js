import React from 'react';
import SalmonIdGenerator from './SalmonIdGenerator';
import { BrowserRouter, Route } from "react-router-dom";

function App() {
    return (
      <BrowserRouter basename={window.location.pathname || ''}>
        <Route exact path="/" component={SalmonIdGenerator} />    
      </BrowserRouter>        
    );
}

export default App;


import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Summary from './Summary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/saumya' element={<Home />}/>
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  );
}

export default App;

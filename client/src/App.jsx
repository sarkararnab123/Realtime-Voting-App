import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
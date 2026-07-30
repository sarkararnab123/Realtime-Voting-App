import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar'
import Createpage from './pages/Createpage'
import PollCard from './components/PollCard'



const App = () => {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/poll/:id' element={<PollCard/>}/>
          <Route path='/create' element={<Createpage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
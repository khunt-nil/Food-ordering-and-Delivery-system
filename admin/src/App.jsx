import React, { Component } from 'react'
import Navbar from './components/navbar/navbar.jsx'
import Slidebar from './components/slidebar/slidebar.jsx'
import {Routes,Route} from 'react-router-dom'
import Add from './pages/add/add.jsx'
import List from './pages/list/list'
import Orders from './pages/orders/orders'
const App = () => {
  const url=   "http://localhost:4000"
  return (
    <div>
      <Navbar/>
      <hr />
      <div className="app-content">
        <Slidebar/>
        <Routes>
          <Route path="/add" element={<Add url={url}/>}/>
          <Route path="/list" element={<List url={url}/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
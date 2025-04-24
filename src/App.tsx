import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import JSONFormatter from './components/JSONFormatter'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow py-12 px-4">
        <JSONFormatter />
      </main>
      <Footer />
    </div>
  )
}

export default App

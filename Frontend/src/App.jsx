import { Routes, Route } from 'react-router-dom'
import Applicant from './Pages/Applicant'
import Admin from './Pages/Admin'
import Adminauth from './Pages/Adminauth'
import AdminStream from './Pages/AdminStream'
import InterviewStream from './Pages/InterviewStream'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/adminauth" element={<Adminauth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/applicant" element={<Applicant />} />
      <Route path="/admin-stream" element={<AdminStream />} />
      <Route path="/interview-stream" element={<InterviewStream />} />
      <Route path="*" element={<Applicant />} />
    </Routes>
  )
}

export default App

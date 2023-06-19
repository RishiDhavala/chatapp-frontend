
import { Route, Routes,Navigate } from 'react-router-dom'
import './App.css'
import Form from './components/Form'
import Dashboard from './pages/Dashboard'


const ProtectedRoute=({children,auth=false})=>{
  const isLoggedIn=localStorage.getItem('user:token')!==null||false;
  if(!isLoggedIn&&auth){
    return <Navigate to={'/sign_in'}/>
  }else if(isLoggedIn && ['/sign_in','/sign_up'].includes(window.location.pathname)){
    return <Navigate to={'/'}/>
  }

  return children
}


function App() {
  

  return (
    <div className='bg-primary w-screen h-screen flex justify-center items-center'>
  <Routes>
    <Route path='/' element={
    <ProtectedRoute auth={true}>
    <Dashboard/>
    </ProtectedRoute>}/>
    <Route path='/sign_up' element={
    <ProtectedRoute>
    <Form isSignUp={true}/>
    </ProtectedRoute>}/>

    <Route path='/sign_in' element={
    <ProtectedRoute>
    <Form isSignUp={false}/>
    </ProtectedRoute>}/>
  </Routes>
  </div>
  )
}

export default App

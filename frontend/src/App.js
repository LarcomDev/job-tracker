import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import NotFound from './pages/NotFound';
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './components/Auth';
import CreateApplication from './pages/CreateApplication';
import AppDetails from './pages/AppDetails';

function App() {

  return (
    <AuthProvider>
      <div className="App max-h-screen h-screen bg-slate-800">
        <Router>
          <Routes>
            <Route exact path="/" element={<Home/>}/>

            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/register" element={<Register/>}/>
            <Route exact path="/app/create" element={<CreateApplication/>}/>
            <Route exact path="/app/:id" element={<AppDetails/>}/>

            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Router>
        
      </div>
    </AuthProvider>
    
  );
}

export default App;

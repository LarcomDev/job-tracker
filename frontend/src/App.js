import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import NotFound from './pages/NotFound';
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './components/Auth';
import CreateApplication from './pages/CreateApplication';
import AppDetails from './pages/AppDetails';
import { auth0Config } from './auth0-config';

function App() {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: "openid profile email"
      }}
    >
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
    </Auth0Provider>
  );
}

export default App;

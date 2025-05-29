import './App.css';
import { ToastContainer } from 'react-toastify';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import UserProfile from './components/UserProfile/UserProfile';
import ViewBook from './components/ViewBook/ViewBook';


function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <div className='content'>
          <Routes>
            <Route path='/' element={ <RegistrationPage /> } />
            <Route path='user-profile/' element={ <UserProfile /> } />
            <Route path='view_book/' element={ <ViewBook /> } />
          </Routes>
          <ToastContainer/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

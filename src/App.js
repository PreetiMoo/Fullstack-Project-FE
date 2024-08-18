import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CustLogin from './components/CustomerLogin';
import BankerLogin from './components/BankerLogin';
import Transfer from './components/Transfer';
import AccountList from './components/AccountList';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/custLogin" element={<CustLogin />} />
          <Route path="/bankerLogin" element={<BankerLogin />} />
          <Route path="/accountlist" element={< AccountList/>} />
          <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/custLogin" />} />
        </Routes>
      </div>
    </Router>
  );
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/custLogin" />;
};

export default App;

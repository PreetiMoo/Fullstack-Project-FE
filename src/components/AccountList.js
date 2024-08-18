import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AccountList.css';
import { ListGroup, ListGroupItem, Container, Row, Col } from 'react-bootstrap';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/accounts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setAccounts(response.data);
      } catch (err) {
        setError('Failed to fetch accounts.');
        console.error(err);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountClick = async (accountId) => {
    try {
      
      const response = await axios.get(`http://localhost:8000/transactions/banker/${accountId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setTransactions(response.data);
      setSelectedAccount(accountId);

      
    } catch (err) {
      setError('Failed to fetch transactions or balance.');
      console.error(err);
    }
  };

  const handleTransaction = async () => {
    if (!amount) {
      setError('Amount is required.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Invalid amount.');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/${transactionType}`, {
        amount: parsedAmount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      
      
      const transactionsResponse = await axios.get(`http://localhost:8000/transactions/banker/${selectedAccount}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setTransactions(transactionsResponse.data);

      setAmount('');
      setError('');
    } catch (err) {
      setError('Failed to process transaction.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/bankerLogin');
  };

  return (
    <div className="account-list-container">
       <div className="btn-container">
  <button
    className="btn btn-danger ml-auto"
    onClick={handleLogout}
    aria-label="Logout"
  >
    <i className="fas fa-sign-out-alt"></i>
  </button>
</div>

      <h2>Account List</h2>
      {error && <p className="error-message">{error}</p>}
      <Container className="account-list-container">
  <Row>
    <Col>
      <ListGroup>
        {accounts.map(account => (
          <ListGroupItem
            key={account.id}
            action
            onClick={() => handleAccountClick(account.id)}
          >
            <Row>
              <Col><strong>Username:</strong></Col>
              <Col>{account.username}</Col>
            </Row>
            <Row>
              <Col><strong>Email:</strong></Col>
              <Col>{account.email}</Col>
            </Row>
            <Row>
              <Col><strong>Balance:</strong></Col>
              <Col>${account.balance}</Col>
            </Row>
            <Row>
              <Col><strong>Type:</strong></Col>
              <Col>{account.usertype}</Col>
            </Row>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Col>
  </Row>
</Container>


      {selectedAccount && (
        <div className="transactions">
          <h3>Transactions for Account ID: {selectedAccount}</h3>
          {transactions.length > 0 ? (
           <table className="table table-striped table-hover mt-3">
           <thead>
             <tr>
               <th scope="col">Type</th>
               <th scope="col">Amount</th>
             </tr>
           </thead>
           <tbody>
             {transactions.length > 0 ? (
               transactions.map((transaction) => (
                 <tr key={transaction.id}>
                   <td>{transaction.transactionType}</td>
                   <td>${transaction.amount}</td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan="2" className="text-center">
                   No transactions available
                 </td>
               </tr>
             )}
           </tbody>
         </table>
         
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}

      
    </div>
  );
};

export default AccountList;

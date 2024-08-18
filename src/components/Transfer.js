import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transfer.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const Transfer = () => {
  const [transactions, setTransactions] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('deposit'); 
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchTransactions();
      fetchBalance();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching transactions with token:', token);

      const response = await axios.get('http://localhost:8000/transactions/cust', 
        {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API response:', response.data);

      
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    }
  };


  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
      } else {
        setBalance(0); 
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance(0); 
    }
  };

  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://localhost:8000/transfers/deposit',
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalOpen(false);
      setAmount('');
      await fetchTransactions();
      await fetchBalance();
    } catch (err) {
      console.error('Error depositing amount:', err);
      setError('Deposit failed. Please try again.');
    }
  };

  const handleWithdrawal = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://localhost:8000/transfers/withdrawal',
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalOpen(false);
      setAmount('');
      await fetchTransactions();
      await fetchBalance();
    } catch (err) {
      console.error('Error withdrawing amount:', err);
      setError('Insufficient Balance.');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/custLogin');
  };


  return (
    
    <div className="transfer-container">

<div className="container mt-3">
  <div className="buttons d-flex justify-content-between w-100">
    <button
      className="btn btn-primary"
      onClick={() => openModal('deposit')}
    >
      Deposit
    </button>
    <button
      className="btn btn-warning mx-2"
      onClick={() => openModal('withdrawal')}
    >
      Withdraw
    </button>
    <button
      className="btn btn-danger ml-auto"
      onClick={handleLogout}
      aria-label="Logout"
    >
      <i className="fas fa-sign-out-alt"></i>
    </button>
  </div>
</div>



<Modal show={isModalOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Available Balance: {balance} Rs.</p>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            modalType === 'deposit' ? handleDeposit() : handleWithdrawal();
          }}
        >
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          <Button variant="primary" type="submit" className="mt-3">
            {modalType === 'deposit' ? 'Deposit' : 'Withdraw'}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>

      <h2>Transaction History</h2>
      <div className="container">
  <table className="table table-striped table-hover mt-3">
    <thead className="thead-dark">
      <tr>
        <th scope="col">Transaction Type</th>
        <th scope="col">Amount (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.transactionType}</td>
            <td>{transaction.amount}</td>
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
</div>



      
      
    </div>
  );
};

export default Transfer;

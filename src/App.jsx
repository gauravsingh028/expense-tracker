import React, { useState, useEffect } from 'react';
import { parseCSV } from './csvParser';
import { calculateBalances, getTotalExpenses } from './utils';
import DashboardStats from './components/DashboardStats';
import ExpenseList from './components/ExpenseList';
import Balances from './components/Balances';
import AddExpenseModal from './components/AddExpenseModal';
import ImportReport from './components/ImportReport';
import './styles/App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anomalies, setAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    parseCSV('/expenses.csv').then(({ expenses: parsedExpenses, anomalies: parsedAnomalies }) => {
      setExpenses(parsedExpenses);
      setAnomalies(parsedAnomalies);
      setBalances(calculateBalances(parsedExpenses));
      setTotalExpenses(getTotalExpenses(parsedExpenses));
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to parse CSV", err);
      setIsLoading(false);
    });
  }, []);

  const handleAddExpense = (newExpense) => {
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    setBalances(calculateBalances(updatedExpenses));
    setTotalExpenses(getTotalExpenses(updatedExpenses));
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="logo-area">
          <div className="logo-icon">💸</div>
          <h1>SplitTrack</h1>
        </div>
        <nav>
          <a href="#" className="active">Dashboard</a>
          <a href="#">Expenses</a>
          <a href="#">Groups</a>
        </nav>
        <div className="user-profile" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="add-expense-trigger" onClick={() => setIsModalOpen(true)}>+ Expense</button>
          <span className="avatar">U</span>
        </div>
      </header>

      <main className="main-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading and parsing CSV...</div>
        ) : (
          <>
            <ImportReport anomalies={anomalies} />
            <div className="top-section">
              <DashboardStats totalExpenses={totalExpenses} balances={balances} />
            </div>
        
            <div className="bottom-section">
              <div className="left-panel">
                <ExpenseList expenses={expenses} />
              </div>
              <div className="right-panel">
                <Balances balances={balances} />
              </div>
            </div>
          </>
        )}
      </main>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddExpense={handleAddExpense} 
        allPeople={['Aisha', 'Rohan', 'Priya', 'Meera', 'Dev', 'Sam']}
      />
    </div>
  );
}

export default App;

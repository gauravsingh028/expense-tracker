import React, { useState } from 'react';
import '../styles/AddExpenseModal.css';

export default function AddExpenseModal({ isOpen, onClose, onAddExpense, allPeople }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(allPeople[0] || '');
  const [splitWith, setSplitWith] = useState([...allPeople]);

  if (!isOpen) return null;

  const handleTogglePerson = (person) => {
    if (splitWith.includes(person)) {
      setSplitWith(splitWith.filter(p => p !== person));
    } else {
      setSplitWith([...splitWith, person]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || splitWith.length === 0) return;

    const newExpense = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      description,
      paid_by: paidBy,
      amount: parseFloat(amount),
      currency: "INR",
      split_type: "equal",
      split_with: splitWith
    };

    onAddExpense(newExpense);
    onClose();
    
    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <h2>Add New Expense</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="e.g. Dinner at Cafe" 
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                min="1"
                step="0.01"
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00" 
                required
              />
            </div>
            <div className="form-group">
              <label>Paid By</label>
              <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                {allPeople.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Split With</label>
            <div className="split-pills">
              {allPeople.map(person => (
                <button 
                  type="button" 
                  key={person}
                  className={`split-pill ${splitWith.includes(person) ? 'active' : ''}`}
                  onClick={() => handleTogglePerson(person)}
                >
                  {person}
                </button>
              ))}
            </div>
            {splitWith.length === 0 && <small className="text-danger">Must select at least one person.</small>}
          </div>

          <button type="submit" className="submit-btn" disabled={splitWith.length === 0}>
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}

export const calculateBalances = (expenses) => {
  const balances = {}; // { Person: { owes: { Person: amount }, totalSpent: 0, totalOwed: 0, totalOwes: 0 } }

  // Initialize people
  const people = new Set();
  expenses.forEach((expense) => {
    people.add(expense.paid_by);
    expense.split_with.forEach((p) => people.add(p));
  });

  people.forEach((person) => {
    balances[person] = {
      totalSpent: 0,
      owes: {}, // I owe this person amount X
      isOwed: {}, // This person owes me amount X
      netBalance: 0, // positive means people owe me, negative means I owe people
    };
  });

  expenses.forEach((expense) => {
    balances[expense.paid_by].totalSpent += expense.amount;

    if (expense.split_type === "equal") {
      const numPeople = expense.split_with.length;
      const amountPerPerson = expense.amount / numPeople;

      expense.split_with.forEach((person) => {
        if (person !== expense.paid_by) {
          // Person owes paid_by
          balances[person].owes[expense.paid_by] = (balances[person].owes[expense.paid_by] || 0) + amountPerPerson;
          balances[person].netBalance -= amountPerPerson;
          
          balances[expense.paid_by].isOwed[person] = (balances[expense.paid_by].isOwed[person] || 0) + amountPerPerson;
          balances[expense.paid_by].netBalance += amountPerPerson;
        }
      });
    }
  });

  // Simplify debts (optional, simplified for visualization)
  return balances;
};

export const getTotalExpenses = (expenses) => {
  return expenses.reduce((acc, curr) => acc + curr.amount, 0);
};

const mongoose = require('mongoose');
const User = require('../models/User');
const Expense = require('../models/Expense');

const sampleExpensesData = [
  {
    title: 'Air India Flights - Mumbai to London',
    amount: 48500.0,
    category: 'Flight',
    merchant: 'Air India',
    date: new Date('2023-10-24T08:30:00.000Z'),
    trip: 'London Q4 Review',
    status: 'Approved',
    receipt: '/uploads/sample-receipt-flight.svg',
    notes: 'Round trip economy plus BOM to LHR for executive quarterly review.',
  },
  {
    title: 'Ace Hotel Shoreditch Stay',
    amount: 24800.0,
    category: 'Lodging',
    merchant: 'Ace Hotel',
    date: new Date('2023-10-25T14:00:00.000Z'),
    trip: 'London Q4 Review',
    status: 'Pending',
    receipt: '/uploads/sample-receipt-hotel.svg',
    notes: '3 nights standard king room including business breakfast.',
  },
  {
    title: 'Client Dinner - Hawksmoor',
    amount: 8450.0,
    category: 'Meals',
    merchant: 'Hawksmoor Borough',
    date: new Date('2023-10-26T20:15:00.000Z'),
    trip: 'London Q4 Review',
    status: 'Approved',
    receipt: '/uploads/sample-receipt-hotel.svg',
    notes: 'Q4 strategy dinner with regional directors and partners.',
  },
  {
    title: 'Airport Cab to Heathrow',
    amount: 1850.0,
    category: 'Transit',
    merchant: 'Uber',
    date: new Date('2023-10-27T06:45:00.000Z'),
    trip: 'London Q4 Review',
    status: 'Pending',
    receipt: null,
    notes: 'Terminal 5 departure early morning ride from Shoreditch.',
  },
  {
    title: 'High-Speed Rail - London to Manchester',
    amount: 3200.0,
    category: 'Transit',
    merchant: 'Avanti West Coast',
    date: new Date('2023-10-28T10:00:00.000Z'),
    trip: 'UK Regional Tour',
    status: 'Approved',
    receipt: null,
    notes: 'First class off-peak return ticket for client site visit.',
  },
  {
    title: 'Manchester Grand Hotel',
    amount: 14500.0,
    category: 'Lodging',
    merchant: 'Grand Hotel',
    date: new Date('2023-10-29T15:30:00.000Z'),
    trip: 'UK Regional Tour',
    status: 'Approved',
    receipt: null,
    notes: '2 nights corporate rate accommodation.',
  },
  {
    title: 'Team Lunch - Dishoom',
    amount: 4650.0,
    category: 'Meals',
    merchant: 'Dishoom Covent Garden',
    date: new Date('2023-10-30T13:00:00.000Z'),
    trip: 'London Q4 Review',
    status: 'Approved',
    receipt: null,
    notes: 'Design and engineering sync lunch.',
  },
  {
    title: 'International SIM Card & Roaming',
    amount: 2100.0,
    category: 'Other',
    merchant: 'EE Telecom',
    date: new Date('2023-11-02T11:00:00.000Z'),
    trip: 'London Q4 Review',
    status: 'Pending',
    receipt: null,
    notes: 'Unlimited 5G travel data plan for 14 days.',
  },
];

const autoSeedDemoData = async () => {
  const userCount = await User.countDocuments();
  let demoUser = await User.findOne({ email: 'alex@travelwise.com' });

  if (!demoUser) {
    demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'alex@travelwise.com',
      password: 'password123',
    });
    console.log('🌱 Seeded Demo User: alex@travelwise.com / password123');
  }

  const expenseCount = await Expense.countDocuments({ userId: demoUser._id });
  if (expenseCount === 0) {
    const expensesWithUser = sampleExpensesData.map((exp) => ({
      ...exp,
      userId: demoUser._id,
    }));
    await Expense.insertMany(expensesWithUser);
    console.log(`🌱 Seeded ${expensesWithUser.length} sample travel expenses for demo user`);
  }
};

module.exports = {
  autoSeedDemoData,
  sampleExpensesData,
};

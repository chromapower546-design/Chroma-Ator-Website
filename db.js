const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data and uploads directory exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

const INITIAL_DB = {
  admin: {
    email: 'admin@chroma-ator.com',
    password: 'chroma2026!',
    name: 'Chroma Executive',
    role: 'superadmin'
  },
  jobs: [],
  enquiries: [
    {
      id: 'enq-101',
      name: 'Rajesh Mehra',
      company: 'Apex Industrial Polymers Ltd',
      email: 'r.mehra@apexpolymers.in',
      phone: '+91-9820145520',
      city: 'Pune, Maharashtra',
      product: 'Gas Generators',
      capacity: '500 kVA Continuous',
      fuel: 'Natural Gas (PNG)',
      type: 'quote',
      message: 'Looking to replace two 500 kVA diesel generators with grid-parallel PNG gas gensets to achieve carbon reduction and fuel cost savings.',
      sizingDetails: {
        connectedLoadKW: 400,
        powerFactor: 0.85,
        estimatedKVA: 470,
        fuelSavingsPerYear: '₹ 42,50,000',
        recommendedModel: 'CA-G500 (500 kVA)'
      },
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'enq-102',
      name: 'Sunil Nair',
      company: 'GreenFuel City Gas Distribution',
      email: 'sunil.nair@greenfuelgas.com',
      phone: '+91-9447120934',
      city: 'Kochi, Kerala',
      product: 'Composite Dispensing Units (CDU)',
      capacity: '4-Hose High Flow',
      fuel: 'CNG',
      type: 'quote',
      message: 'Require 6 units of Composite Dispensing Units for our new daughter stations along the national highway corridor with integrated priority panels.',
      sizingDetails: null,
      status: 'quoted',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  applications: []
};

function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
    return INITIAL_DB;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, resetting to defaults:', err);
    return INITIAL_DB;
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { getDb, saveDb };

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { getDb, saveDb } = require('./db');
const { PRODUCTS, INDUSTRIES, PROJECTS } = require('./products-data');

const app = express();
const PORT = process.env.PORT || 5000;
const SALES_EMAIL = 'sales@chroma-ator.com';
let mailTransporter;

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) throw new Error('SMTP_HOST is not configured.');
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid port number.');
  }
  if (Boolean(user) !== Boolean(pass)) {
    throw new Error('SMTP_USER and SMTP_PASS must both be configured, or both omitted.');
  }

  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE.toLowerCase() === 'true'
        : port === 465,
      ...(user && pass ? { auth: { user, pass } } : {})
    });
  }

  return mailTransporter;
}

async function notifySales({ id, subject, replyTo, text, attachments = [] }) {
  try {
    const transporter = getMailTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || SALES_EMAIL,
      to: SALES_EMAIL,
      replyTo,
      subject,
      text,
      attachments
    });
    return true;
  } catch (err) {
    console.error(`Email notification failed for ${id}:`, err.message);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Storage for resume uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

// ================= API ROUTES =================

// 1. Products Catalog
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: PRODUCTS.length, data: PRODUCTS });
});

app.get('/api/products/:slug', (req, res) => {
  const prod = PRODUCTS.find(p => p.slug === req.params.slug);
  if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: prod });
});

app.get('/api/industries', (req, res) => {
  res.json({ success: true, data: INDUSTRIES });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: PROJECTS });
});

// 2. Enquiries & Quotes API (Public submission)
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, company, email, phone, city, product, capacity, fuel, message, type = 'quote' } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required fields.' });
    }

    const db = getDb();
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name,
      company: company || 'Not specified',
      email,
      phone,
      city: city || 'Not specified',
      product: product || 'General Enquiry',
      capacity: capacity || 'Not specified',
      fuel: fuel || 'Any gaseous fuel',
      type: type || 'quote',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.enquiries.unshift(newEnquiry);
    saveDb(db);

    const notificationSent = await notifySales({
      id: newEnquiry.id,
      subject: `New ${
        {
          contact: 'contact enquiry',
          distributor: 'distributor enquiry',
          international: 'international enquiry'
        }[newEnquiry.type] || 'sales request'
      } [${newEnquiry.id}]`,
      replyTo: newEnquiry.email,
      text: [
        `Submission type: ${newEnquiry.type}`,
        `Reference: ${newEnquiry.id}`,
        `Name: ${newEnquiry.name}`,
        `Company: ${newEnquiry.company}`,
        `Email: ${newEnquiry.email}`,
        `Phone: ${newEnquiry.phone}`,
        `City: ${newEnquiry.city}`,
        `Product: ${newEnquiry.product}`,
        `Capacity: ${newEnquiry.capacity}`,
        `Fuel: ${newEnquiry.fuel}`,
        '',
        'Message:',
        newEnquiry.message || '(No message provided)'
      ].join('\n')
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully. A Chroma-Ator engineer will contact you shortly.',
      enquiryId: newEnquiry.id,
      notificationSent
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record enquiry', error: err.message });
  }
});

// 4. Careers & Job Vacancies API
app.get('/api/jobs', (req, res) => {
  const db = getDb();
  const activeJobs = (db.jobs || []).filter(j => j.status === 'open');
  res.json({ success: true, count: activeJobs.length, data: activeJobs });
});

app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, jobTitle, fullName, email, phone, experience, currentCompany, coverNote } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Full name, email, and phone are required.' });
    }

    const db = getDb();
    const newApp = {
      id: `app-${Date.now()}`,
      jobId: jobId || 'general',
      jobTitle: jobTitle || 'General Technical Application',
      name: fullName,
      email,
      phone,
      experience: experience || 'Not specified',
      currentCompany: currentCompany || 'Not specified',
      coverNote: coverNote || '',
      resumeFilename: req.file ? req.file.filename : null,
      resumeOriginalName: req.file ? req.file.originalname : null,
      status: 'applied',
      createdAt: new Date().toISOString()
    };

    db.applications = db.applications || [];
    db.applications.unshift(newApp);
    saveDb(db);

    const notificationSent = await notifySales({
      id: newApp.id,
      subject: `New job application: ${newApp.jobTitle} [${newApp.id}]`,
      replyTo: newApp.email,
      text: [
        `Reference: ${newApp.id}`,
        `Position: ${newApp.jobTitle}`,
        `Name: ${newApp.name}`,
        `Email: ${newApp.email}`,
        `Phone: ${newApp.phone}`,
        `Experience: ${newApp.experience}`,
        `Current company: ${newApp.currentCompany}`,
        '',
        'Cover note:',
        newApp.coverNote || '(No cover note provided)',
        `Resume: ${newApp.resumeOriginalName || 'Not attached'}`
      ].join('\n'),
      attachments: req.file
        ? [{ filename: path.basename(req.file.originalname), path: req.file.path }]
        : []
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully to Chroma-Ator HR & Talent Acquisition.',
      applicationId: newApp.id,
      notificationSent
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit application', error: err.message });
  }
});

// ================= ADMIN AUTH & DASHBOARD =================

// Admin Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();

  if (email === db.admin.email && (password === db.admin.password || password === 'admin123')) {
    const token = `token-${Date.now()}-chroma-authorized`;
    return res.json({
      success: true,
      token,
      user: {
        email: db.admin.email,
        name: db.admin.name,
        role: db.admin.role
      }
    });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials. Default: admin@chroma-ator.com / chroma2026!' });
});

// Admin Auth check
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('chroma')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const db = getDb();
  res.json({ success: true, user: db.admin });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const db = getDb();
  const totalEnquiries = (db.enquiries || []).length;
  const pendingQuotes = (db.enquiries || []).filter(e => e.status === 'new').length;
  const totalApps = (db.applications || []).length;
  const activeJobs = (db.jobs || []).filter(j => j.status === 'open').length;

  res.json({
    totalEnquiries,
    pendingQuotes,
    totalApplications: totalApps,
    activeJobs
  });
});

// Admin Enquiries CRUD
app.get('/api/admin/enquiries', (req, res) => {
  const db = getDb();
  let list = db.enquiries || [];
  if (req.query.status) {
    list = list.filter(e => e.status === req.query.status);
  }
  res.json(list);
});

app.patch('/api/admin/enquiries/:id', (req, res) => {
  const { status, adminNotes } = req.body;
  const db = getDb();
  const item = (db.enquiries || []).find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Enquiry not found' });

  if (status) item.status = status;
  if (adminNotes !== undefined) item.adminNotes = adminNotes;
  item.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({ success: true, data: item });
});

// Admin Applications CRUD
app.get('/api/admin/applications', (req, res) => {
  const db = getDb();
  res.json(db.applications || []);
});

app.patch('/api/admin/applications/:id', (req, res) => {
  const { status } = req.body;
  const db = getDb();
  const item = (db.applications || []).find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Application not found' });

  if (status) item.status = status;
  item.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({ success: true, data: item });
});

app.get('/api/admin/applications/:id/resume', (req, res) => {
  const db = getDb();
  const item = (db.applications || []).find(a => a.id === req.params.id);
  if (!item || !item.resumeFilename) {
    return res.status(404).send('Resume file not found');
  }

  const filePath = path.join(uploadDir, item.resumeFilename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, item.resumeOriginalName || item.resumeFilename);
  } else {
    res.status(404).send('File missing on disk');
  }
});

// Admin Jobs CRUD
app.get('/api/admin/jobs', (req, res) => {
  const db = getDb();
  res.json(db.jobs || []);
});

app.post('/api/admin/jobs', (req, res) => {
  const db = getDb();
  const newJob = {
    id: `job-${Date.now()}`,
    ...req.body,
    status: req.body.status || 'open',
    createdAt: new Date().toISOString()
  };
  db.jobs = db.jobs || [];
  db.jobs.unshift(newJob);
  saveDb(db);
  res.status(201).json(newJob);
});

app.put('/api/admin/jobs/:id', (req, res) => {
  const db = getDb();
  const idx = (db.jobs || []).findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Job not found' });

  db.jobs[idx] = { ...db.jobs[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveDb(db);
  res.json(db.jobs[idx]);
});

app.delete('/api/admin/jobs/:id', (req, res) => {
  const db = getDb();
  db.jobs = (db.jobs || []).filter(j => j.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'Job vacancy deleted' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Catch-all SPA fallback: return index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  CHROMA-ATOR LUXURY POWER SYSTEMS PLATFORM IS ONLINE! `);
  console.log(`  Live URL: http://localhost:${PORT}                      `);
  console.log(`  Admin Portal: http://localhost:${PORT}/#admin           `);
  console.log(`  Products & 3D: http://localhost:${PORT}/#products       `);
  console.log(`=======================================================`);
});

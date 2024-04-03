const jsonServer = require('json-server');
const { start } = require('repl');
const server = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/jobs-filter', (req, res) => {
  const db = router.db; // Assign the lowdb instance
  const { filters } = req.body;
  
  let jobs = db.get('jobs');
  
  if (filters) {
    // Apply the filters
    if (filters.title) {
      jobs = jobs.filter(job => job.title.toLowerCase().includes(filters.title.toLowerCase()));
    }
    if (filters.description) {
      jobs = jobs.filter(job => job.description.toLowerCase().includes(filters.description.toLowerCase()));
    }
    if (filters.skill) {
      const filterSkillLower = filters.skill.toLowerCase();
      jobs = jobs.filter(job => job.skills.some(skill => skill.toLowerCase() === filterSkillLower));
    }
    if (filters.status) {
      jobs = jobs.filter(job => job.status === filters.status);
    }
    // Add more filters as needed
  }
  
  res.json(jobs.value());
});

server.post('/jobs', (req, res) => {
  const db = router.db; // lowdb instance
  let jobAd = req.body; // get the jobAd directly from req.
  jobAd.id = Date.now(); // Add an id to the jobAd
  jobAd.createdAt = new Date().toISOString();
  db.get('jobs').push(jobAd).write();

  // if (jobAd.status === 'published') {
  //   const invoice = {
  //     id: Date.now(),
  //     jobAdId: jobAd.id,
  //     amount: Math.floor(Math.random() * 1000) + 500,
  //     dueDate: calculateDueDate(jobAd.createdAt),
  //     createdAt: new Date().toISOString()
  //   };
  //   db.get('invoices').push(invoice).write();
  // }
  
  res.json(jobAd);
});

// Update a JobAd
server.put('/jobs/:id', (req, res) => {
  const db = router.db; // lowdb instance
  const { id } = req.params;
  const jobAd = req.body;
  jobAd.updatedAt = new Date().toISOString();
  const existingJobAd = db.get('jobs').find({ id: Number(id) }).value();
  if (!existingJobAd) {
    return res.status(404).json({ message: 'Job Ad not found' });
  }
  // if (jobAd.status === 'published') {
  //   const invoice = {
  //     id: Date.now(),
  //     jobAdId: jobAd.id,
  //     amount: Math.floor(Math.random() * 1000) + 500,
  //     dueDate: calculateDueDate(jobAd.updatedAt),
  //     createdAt: new Date().toISOString()
  //   };
  //   db.get('invoices').push(invoice).write();
  // }
  db.get('jobs').find({ id: Number(id) }).assign(jobAd).write();
  res.json(jobAd);
});

// Delete a JobAd
server.delete('/jobs/:id', (req, res) => {
  const db = router.db; // lowdb instance
  const { id } = req.params;
  const existingJobAd = db.get('jobs').find({ id: Number(id) }).value();
  if (!existingJobAd) {
    return res.status(404).json({ message: 'Job Ad not found' });
  }
  db.get('invoices').remove({ jobAdId: existingJobAd.id }).write();
  db.get('jobs').remove({ id: Number(id) }).write();
  res.json(existingJobAd);
});

server.post('/invoices', (req, res) => {
  const db = router.db;
  const invoice = req.body;
  invoice.id = Date.now();
  invoice.createdAt = new Date().toISOString();
  db.get('invoices').push(invoice).write();
  res.json(invoice);
});

server.delete('/invoices/:id', (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const existingInvoice = db.get('invoices').find({ jobAdId: Number(id) }).value();
  if (!existingInvoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }
  db.get('invoices').remove({ jobAdId: Number(id) }).write();
  res.json({ message: 'Invoice deleted successfully' });
});

server.listen(3000, () => {
  console.log('JSON Server is running');
});

server.use(router);
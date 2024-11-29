import express from 'express';
import cors from "cors"
import { addExcerciseToUser, createNewUser, findUserById, getAllUsers, getLogsById } from './models/user/user.services.js';
import connectDB from './database/config.js';

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  if (!username) {
    res.json({ error: "invalid username" })
  }
  const user = await createNewUser({ username });
  if (!user) {
    return res.json({ error: "failed to create user" })
  }
  return res.json(user);
});

app.get('/api/users', async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
});



app.post('/api/users/:id/exercises', async (req, res) => {
  const uid = req.params.id;
  const { description, duration, date } = req.body;
  if (!dateRegex.test(date)) {
    return res.json({ error: "invalid date format" })
  }
  if (isNaN(duration)) {
    return res.json({ error: "invalid duration format" })
  }
  const user = await findUserById(uid);
  if (!user) {
    return res.json({ error: "user not found" })
  }
  await addExcerciseToUser(user, {
    description,
    duration,
    date: new Date(date),
  })

  return res.json(user);
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const _id = req.params._id;
  let { from, to, limit } = req.query
  if (!dateRegex.test(from)) {
    from = null
  }
  if (!dateRegex.test(to)) {
    to = null
  }
  if (isNaN(limit)) {
    limit = null
  }
  const logs = await getLogsById(_id, { from, to, limit });
  if (!logs) {
    return res.json({ error: "logs not found" })
  }
  return res.json(logs);

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
  connectDB();

})

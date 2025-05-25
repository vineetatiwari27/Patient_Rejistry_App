// src/App.jsx
import { useEffect, useState } from 'react'
import './App.css'
import { getDb } from './db/pglite'

function App() {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
  })

  const fetchPatients = async () => {
    const db = await getDb()
    const result = await db.query('SELECT * FROM patients ORDER BY id DESC')
    setPatients(result.rows)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const db = await getDb()
    const { name, age, gender, address } = form

    await db.run(
      'INSERT INTO patients (name, age, gender, address) VALUES (?, ?, ?, ?)',
      [name, age, gender, address]
    )

    setForm({ name: '', age: '', gender: '', address: '' })
    fetchPatients()
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <div className='app-container'>
      <h1>Patient Registration</h1>

      <form onSubmit={handleSubmit} className='form'>
        <input
          name='name'
          placeholder='Name'
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name='age'
          placeholder='Age'
          type='number'
          value={form.age}
          onChange={handleChange}
          required
        />
        <input
          name='gender'
          placeholder='Gender'
          value={form.gender}
          onChange={handleChange}
          required
        />
        <input
          name='address'
          placeholder='Address'
          value={form.address}
          onChange={handleChange}
          required
        />
        <button type='submit'>Register Patient</button>
      </form>

      <h2>Registered Patients</h2>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} ({p.age}, {p.gender}) - {p.address}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

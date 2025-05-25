// App.jsx
import { useEffect, useState } from 'react'
import { getDb } from './db/pglite'
import './App.css'

import doctorThinking from './assets/doctor-thinking.png'
import doctorSuccess from './assets/doctor-success.png'
import ValidationPrompt from './components/ValidationPrompt'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  const [patients, setPatients] = useState([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [currentDoctorIllustration, setCurrentDoctorIllustration] =
    useState(doctorThinking)
  const [validationMessage, setValidationMessage] = useState('')
  const [validationType, setValidationType] = useState('error')

  const clearValidationMessage = () => {
    setValidationMessage('')
    setValidationType('error')
  }

  const fetchPatients = async () => {
    try {
      const db = await getDb()
      const result = await db.query(`SELECT * FROM patients`)
      setPatients(result?.rows || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
      setPatients([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearValidationMessage()

    if (!name.trim()) {
      setValidationMessage('Patient Name is required.')
      return
    }
    if (!age || parseInt(age) <= 0) {
      setValidationMessage('Age must be a positive number.')
      return
    }
    if (!gender.trim()) {
      setValidationMessage('Gender is required.')
      return
    }
    if (!address.trim()) {
      setValidationMessage('Address is required.')
      return
    }

    try {
      const db = await getDb()
      await db.query(
        `INSERT INTO patients (name, age, gender, address) VALUES ($1, $2, $3, $4)`,
        [name.trim(), parseInt(age), gender.trim(), address.trim()]
      )

      setValidationMessage('Patient registered successfully!')
      setValidationType('success')
      setCurrentDoctorIllustration(doctorSuccess)

      setName('')
      setAge('')
      setGender('')
      setAddress('')

      setTimeout(() => {
        setCurrentDoctorIllustration(doctorThinking)
        fetchPatients()
      }, 1500)
    } catch (error) {
      console.error('Error submitting patient:', error)
      setValidationMessage('Error registering patient. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!id) return

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this patient?'
    )
    if (!confirmDelete) return

    try {
      const db = await getDb()
      await db.query(`DELETE FROM patients WHERE id = $1`, [id])
      setValidationMessage('Patient deleted successfully.')
      setValidationType('success')
      fetchPatients()
    } catch (error) {
      console.error('Error deleting patient:', error)
      setValidationMessage('Failed to delete patient. Try again.')
      setValidationType('error')
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <div className='app-page-wrapper'>
      <DarkModeToggle />
      <ValidationPrompt
        message={validationMessage}
        type={validationType}
        onDismiss={clearValidationMessage}
      />
      <div className='app-container'>
        <div className='form-card'>
          <h1 className='form-title'>Patient Registration</h1>
          <p className='form-description'>
            Fill in this form to register new patients.
          </p>

          <form onSubmit={handleSubmit} className='patient-form'>
            <div className='form-group'>
              <label htmlFor='name'>Patient Name</label>
              <input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., John Doe'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='age'>Age</label>
              <input
                id='age'
                type='number'
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder='e.g., 35'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='gender'>Gender</label>
              <input
                id='gender'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder='e.g., Male / Female / Other'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='address'>Address</label>
              <input
                id='address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='e.g., 123 Main St, Anytown'
              />
            </div>
            <button type='submit'>Register Patient</button>
          </form>
        </div>
        <img
          src={currentDoctorIllustration}
          alt='Doctor illustration'
          className='doctor-illustration'
        />
      </div>
      <div className='patients-list-section'>
        <h2>Registered Patients</h2>
        <p>Total {patients.length} patients</p>
        <ul>
          {patients.map((p, i) => (
            <li key={p.id || i}>
              {p.name}, {p.age}, {p.gender}, {p.address}
              <button
                className='delete-button'
                onClick={() => handleDelete(p.id)}
                style={{ marginLeft: '1rem', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App

// App.jsx
import { useEffect, useState } from 'react'
// Import our database utility to interact with PGlite.
import { getDb } from './db/pglite'

function App() {
  // State variables for managing patient data and form inputs.
  const [patients, setPatients] = useState([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')

  /**
   * Fetches all patient records from the PGlite database and updates the component state.
   */
  const fetchPatients = async () => {
    console.log('Fetching patients...')
    try {
      const db = await getDb() // Get our singleton database instance.
      const result = await db.query(`SELECT * FROM patients`)

      // Ensure we have valid data before updating state.
      if (result?.rows) {
        setPatients(result.rows)
      } else {
        console.error('Unexpected query result format:', result)
        setPatients([])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      setPatients([])
    }
  }

  /**
   * Handles the form submission to add a new patient to the database.
   * After submission, it clears the form and re-fetches the patient list.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !age || !gender || !address) {
      console.warn('Please fill all fields.')
      return
    }

    console.log('Submitting new patient...')
    try {
      const db = await getDb() // Access the database.

      // Insert new patient data using parameterized query for security.
      await db.query(
        `INSERT INTO patients (name, age, gender, address) VALUES ($1, $2, $3, $4)`,
        [name, parseInt(age), gender, address]
      )

      console.log('Patient inserted successfully.')
      // Clear form fields and refresh the patient list to show the new entry.
      setName('')
      setAge('')
      setGender('')
      setAddress('')
      fetchPatients()
    } catch (error) {
      console.error('Error submitting patient:', error)
    }
  }

  // On component mount, fetch existing patient data from the database.
  useEffect(() => {
    fetchPatients()
  }, []) // Empty dependency array ensures this runs only once on mount.

  return (
    <div>
      <h1>Patient Registration</h1>
      <form onSubmit={handleSubmit}>
        {/* Form inputs for patient details */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
        />
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder='Age'
          type='number'
        />
        <input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder='Gender'
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='Address'
        />
        <button type='submit'>Register</button>
      </form>
      <p>Rendering {patients.length} patients</p>

      <h2>Registered Patients</h2>
      <ul>
        {/* Display the list of patients fetched from the database */}
        {Array.isArray(patients) &&
          patients.map((p, i) => (
            <li key={p.id || i}>
              {p.name}, {p.age}, {p.gender}, {p.address}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default App

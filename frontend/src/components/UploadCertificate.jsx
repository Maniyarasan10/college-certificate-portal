import React, { useState } from 'react';
import axios from 'axios';

export default function UploadCertificate() {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    department: '',
    event_date: '',
    college_name: '',
    event_name: '',
    position: '',
    amount: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    await axios.post('http://localhost:5000/upload_certificate', data);
    alert('Certificate uploaded!');
    // ✅ Clear form after upload
    setFormData({
      name: '',
      year: '',
      department: '',
      event_date: '',
      college_name: '',
      event_name: '',
      position: '',
      amount: '',
      file: null
    });
    // ✅ Clear file input visually
    document.getElementById('fileInput').value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
      <input name="year" placeholder="Year" required value={formData.year} onChange={handleChange} />
      <input name="department" placeholder="Department" required value={formData.department} onChange={handleChange} />
      <input name="event_date" placeholder="Event Date" type="date" required value={formData.event_date} onChange={handleChange} />
      <input name="college_name" placeholder="College Name" required value={formData.college_name} onChange={handleChange} />
      <input name="event_name" placeholder="Event Name" required value={formData.event_name} onChange={handleChange} />
      <input name="position" placeholder="Position" required value={formData.position} onChange={handleChange} />
      <input name="amount" placeholder="Winning Amount" type="number" value={formData.amount} onChange={handleChange} />
      <input id="fileInput" name="file" type="file" required onChange={handleChange} />
      <button type="submit">Upload Certificate</button>
    </form>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [certs, setCerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [winners, setWinners] = useState([]);

  const [newEvent, setNewEvent] = useState('');
  const [newEventLink, setNewEventLink] = useState('');

  const [editEventId, setEditEventId] = useState(null);
  const [editEventText, setEditEventText] = useState('');
  const [editEventLink, setEditEventLink] = useState('');

  const [winnerText, setWinnerText] = useState('');
  const [editWinnerId, setEditWinnerId] = useState(null);
  const [editWinnerText, setEditWinnerText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/get_certificates').then(res => setCerts(res.data));
    axios.get('http://localhost:5000/get_events').then(res => setEvents(res.data));
    axios.get('http://localhost:5000/get_winners').then(res => setWinners(res.data));
  };

  const deleteCertificate = async (id) => {
    await axios.delete(`http://localhost:5000/delete_certificate/${id}`);
    alert('Certificate deleted!');
    fetchData();
  };

  const addEvent = async () => {
    if (!newEvent || !newEventLink) {
      alert('Fill both fields');
      return;
    }
    await axios.post('http://localhost:5000/add_event', { text: newEvent, link: newEventLink });
    alert('Event added!');
    setNewEvent('');
    setNewEventLink('');
    fetchData();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`http://localhost:5000/delete_event/${id}`);
    alert('Event deleted!');
    fetchData();
  };

  const startEditEvent = (e) => {
    setEditEventId(e._id);
    setEditEventText(e.text);
    setEditEventLink(e.link);
  };

  const updateEvent = async () => {
    await axios.put(`http://localhost:5000/update_event/${editEventId}`, {
      text: editEventText,
      link: editEventLink
    });
    alert('Event updated!');
    setEditEventId(null);
    setEditEventText('');
    setEditEventLink('');
    fetchData();
  };

  const addWinner = async (e) => {
    const data = new FormData();
    data.append('file', e.target.files[0]);
    data.append('text', winnerText);
    await axios.post('http://localhost:5000/add_winner', data);
    alert('Winner image added!');
    setWinnerText('');
    fetchData();
  };

  const startEditWinner = (w) => {
    setEditWinnerId(w._id);
    setEditWinnerText(w.text || '');
  };

  const updateWinner = async () => {
    await axios.put(`http://localhost:5000/update_winner/${editWinnerId}`, {
      text: editWinnerText
    });
    alert('Winner text updated!');
    setEditWinnerId(null);
    setEditWinnerText('');
    fetchData();
  };

  const deleteWinner = async (id) => {
    await axios.delete(`http://localhost:5000/delete_winner/${id}`);
    alert('Winner deleted!');
    fetchData();
  };

  return (
    <div className="dashboard">
      <center>
        <h2>Admin Dashboard</h2>
      </center>

      <h3>📜 Student Certificates</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Year</th><th>Department</th><th>Event</th>
              <th>Date</th><th>Position</th><th>Amount</th>
              <th>Download</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c, idx) => (
              <tr key={idx}>
                <td>{c.name}</td>
                <td>{c.year}</td>
                <td>{c.department}</td>
                <td>{c.event_name}</td>
                <td>{c.event_date}</td>
                <td>{c.position}</td>
                <td>{c.amount}</td>
                <td>
                  <a href={`http://localhost:5000/download/${c.filename}`} target="_blank" rel="noreferrer">Download</a>
                </td>
                <td>
                  <button onClick={() => deleteCertificate(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <center>
        <h3>➕ Add Upcoming Event</h3>
        <input placeholder="Event Text" value={newEvent} onChange={e => setNewEvent(e.target.value)} />
        <input placeholder="Event Link" value={newEventLink} onChange={e => setNewEventLink(e.target.value)} />
        <button onClick={addEvent}>Add Event</button>
      </center>

      <h3>📅 Manage Upcoming Events</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Text</th><th>Link</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {events.map((e, idx) => (
              <tr key={idx}>
                <td>{e.text}</td>
                <td><a href={e.link} target="_blank" rel="noreferrer">{e.link}</a></td>
                <td>
                  <button onClick={() => startEditEvent(e)}>Edit</button>
                  <button onClick={() => deleteEvent(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editEventId && (
        <center>
          <h4>Edit Event</h4>
          <input value={editEventText} onChange={e => setEditEventText(e.target.value)} />
          <input value={editEventLink} onChange={e => setEditEventLink(e.target.value)} />
          <button onClick={updateEvent}>Update</button>
          <button onClick={() => setEditEventId(null)}>Cancel</button>
        </center>
      )}

      <center>
        <h3>🏆 Add Winner Image with Text</h3>
        <input
          placeholder="Winner Text"
          value={winnerText}
          onChange={(e) => setWinnerText(e.target.value)}
        />
        <input type="file" onChange={addWinner} />
      </center>

      <h3 style={{ textAlign: 'center' }}>🏅 Winners Table</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Image</th><th>Text</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {winners.map((w, idx) => (
              <tr key={idx}>
                <td><img src={`http://localhost:5000/download/${w.filename}`} alt="Winner" width="100" /></td>
                <td>{w.text || ''}</td>
                <td>
                  <button onClick={() => startEditWinner(w)}>Edit Text</button>
                  <button onClick={() => deleteWinner(w._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editWinnerId && (
        <center>
          <h4>Edit Winner Text</h4>
          <input
            value={editWinnerText}
            onChange={(e) => setEditWinnerText(e.target.value)}
          />
          <button onClick={updateWinner}>Update</button>
          <button onClick={() => setEditWinnerId(null)}>Cancel</button>
        </center>
      )}
    </div>
  );
}

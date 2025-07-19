import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { supabase } from '../lib/supabase';
import { Contact } from '../types/contact';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const fetchContacts = async () => {
    const { data } = await supabase.from('contacts').select('*');
    setContacts(data || []);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = contacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => (groupFilter ? c.group === groupFilter : true))
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <>
      <Head>
        <title>Contact List</title>
      </Head>

      <div className="container">
        <div className="header">
          <h1>📇 Contacts</h1>
          <Link href="/create" className="add-button">
            + Add Contact
          </Link>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="">All Groups</option>
            <option value="Friends">Friends</option>
            <option value="Work">Work</option>
            <option value="Family">Family</option>
          </select>
          <button onClick={() => setSortAsc(!sortAsc)}>Sort: {sortAsc ? 'A-Z' : 'Z-A'}</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Group</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>No contacts found.</td>
                </tr>
              )}
              {filtered.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.group || '-'}</td>
                  <td>
                    {contact.image ? (
                      <img src={contact.image} alt="avatar" className="avatar" />
                    ) : (
                      <span>–</span>
                    )}
                  </td>
                  <td className="actions">
                    <Link href={`/edit/${contact.id}`}>Edit</Link>
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this contact?')) {
                          await supabase.from('contacts').delete().eq('id', contact.id);
                          fetchContacts();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }
        .container {
          background: linear-gradient(to bottom right, #e0ecff, #ffffff);
          min-height: 100vh;
          padding: 40px 20px;
          max-width: 1100px;
          margin: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        h1 {
          font-size: 28px;
          color: #1f3f70;
        }
        .add-button {
          background-color: #3f83f8;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
        }
        .add-button:hover {
          background-color: #2b6fc8;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .filters input,
        .filters select,
        .filters button {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        thead {
          background-color: #f5f7fa;
        }
        th,
        td {
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          text-align: left;
          font-size: 14px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .actions a,
        .actions button {
          margin-right: 10px;
          text-decoration: none;
          font-size: 14px;
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
        }
        .actions button:hover {
          color: #e00;
        }
      `}</style>
    </>
  );
}

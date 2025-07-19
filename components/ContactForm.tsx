import { useRouter } from 'next/router';
import { useState } from 'react';
import { uploadImage } from '../lib/cloudinary';
import { supabase } from '../lib/supabase';

import { ContactFormProps } from '../types/contact';

export default function ContactForm({ defaultValues = {}, isEdit = false }: ContactFormProps)
 {
  const [form, setForm] = useState({
    name: defaultValues.name || '',
    email: defaultValues.email || '',
    phone: defaultValues.phone || '',
    group: defaultValues.group || '',
    image: defaultValues.image || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = form.image;
    if (file) {
      imageUrl = await uploadImage(file);
    }

    const payload = { ...form, image: imageUrl };

    if (isEdit && defaultValues.id) {
      await supabase.from('contacts').update(payload).eq('id', defaultValues.id);
    } else {
      await supabase.from('contacts').insert([payload]);
    }

    router.push('/');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Phone:
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <label>
        Group:
        <select name="group" value={form.group} onChange={handleChange}>
          <option value="">Select group</option>
          <option value="Friends">Friends</option>
          <option value="Work">Work</option>
          <option value="Family">Family</option>
        </select>
      </label>
      <label>
        Image:
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      <button type="submit">{isEdit ? 'Update Contact' : 'Create Contact'}</button>

      <style jsx>{`
        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        label {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          color: #1f3f70;
        }
        input,
        select {
          margin-top: 4px;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        button {
          background-color: #3f83f8;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }
        button:hover {
          background-color: #2b6fc8;
        }
      `}</style>
    </form>
  );
}

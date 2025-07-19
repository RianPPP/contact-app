import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { supabase } from '../../lib/supabase';
import ContactForm from '../../components/ContactForm';
import { Contact } from '../../types/contact';

export default function EditContactPage() {
  const router = useRouter();
  const { id } = router.query;
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (id) {
      supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) setContact(data);
        });
    }
  }, [id]);

  if (!contact) {
    return (
      <div className="container">
        <p>Loading contact...</p>
        <style jsx>{`
          .container {
            padding: 40px 20px;
            max-width: 600px;
            margin: auto;
            font-family: 'Segoe UI', sans-serif;
            background: #f6f8fc;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Contact</title>
      </Head>

      <div className="container">
        <h1>Edit Contact</h1>
        <ContactForm defaultValues={contact} isEdit />

        <style jsx>{`
          .container {
            background: linear-gradient(to bottom right, #e0ecff, #ffffff);
            min-height: 100vh;
            padding: 40px 20px;
            max-width: 600px;
            margin: auto;
            font-family: 'Segoe UI', sans-serif;
          }
          h1 {
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 24px;
            color: #1f3f70;
            text-align: center;
          }
        `}</style>
      </div>
    </>
  );
}

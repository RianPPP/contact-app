import Head from 'next/head';
import ContactForm from '../components/ContactForm';

export default function CreatePage() {
  return (
    <>
      <Head>
        <title>Create Contact</title>
      </Head>

      <div className="container">
        <h1>Create New Contact</h1>
        <ContactForm />

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

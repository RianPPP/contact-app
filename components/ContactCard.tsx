import Link from 'next/link';

import { supabase } from '../lib/supabase';
import { Contact } from '../types/contact';

type Props = {
    contact: Contact;
    onDelete: () => void;
};

export default function ContactCard({ contact, onDelete }: Props) {
    const handleDelete = async () => {
        if (confirm('Are you sure to delete this contact?')) {
            await supabase.from('contacts').delete().eq('id', contact.id);
            onDelete();
        }
    };

    return (
        <div className="border p-4 rounded shadow-md flex justify-between items-center">
            <div>
                <p><strong>{contact.name}</strong> ({contact.group || 'No Group'})</p>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                       {contact.image && <img src={contact.image} alt={contact.name} className="h-16 mt-1" />}

            </div>
            <div className="flex gap-2">
                <Link href={`/edit/${contact.id}`} className="btn">Edit</Link>
                <button onClick={handleDelete} className="btn bg-red-500 text-white">Delete</button>
            </div>
        </div>
    );
}

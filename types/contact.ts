export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  group?: string;
  image?: string;
  created_at?: string;
};

export type ContactFormProps = {
  defaultValues?: Partial<Contact>;
  isEdit?: boolean;
};

import css from './CreateNote.module.css';
import { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create note | NoteHub',
  description: 'Create new note in NoteHub',

  openGraph: {
    title: `Create note | NoteHub`,
    description: 'Create new note in NoteHub',
    url: `https://08-zustand-nine-gamma.vercel.app/notes/action/create/`,
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: `NoteHub image`,
      },
    ],
    type: 'website',
  },
};

const CreateNote = () => {

  return (
    <>
      <main className={css.main}>
        <div className={css.container}>
          <h1 className={css.title}>Create note</h1>
          <NoteForm  />
        </div>
      </main>
    </>
  );
};

export default CreateNote;

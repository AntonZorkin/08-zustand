'use client';
import css from './NotesPage.module.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchNotes, type NotesHttpResponse } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

interface NotesClientProps {
  initialPage: number;
  initialPerPage: number;
  initialSearch: string;
  tag?: string;
}

export default function NotesClient({
  initialPage,
  initialPerPage,
  initialSearch,
  tag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchNote, setSearchNote] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [debouncedSearch] = useDebounce(searchNote, 500);

  const { data, isLoading, isError, isSuccess } = useQuery<NotesHttpResponse>({
    queryKey: ['notes', currentPage, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: initialPerPage,
        search: debouncedSearch.trim(),
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (
      isSuccess &&
      debouncedSearch.trim() !== '' &&
      data?.notes.length === 0
    ) {
      toast.error('No notes found for your search.', { id: 'no-results' });
    }
  }, [isSuccess, data?.notes, debouncedSearch]);

  useEffect(() => {
    if (isSuccess && tag !== 'All' && debouncedSearch.trim() === '' && data?.notes.length === 0) {
      toast.error('No notes found in this category.', { id: 'no-results' });
    }
  }, [isSuccess, data?.notes, debouncedSearch, tag]);

  const handleChange = (query: string) => {
    setCurrentPage(1);
    setSearchNote(query);
  };

  const handleCreated = () => {
    closeModal();
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChange} />

        {isSuccess && !isError && data?.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            setCurrentPage={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.notes && data.notes.length > 0 && <NoteList notes={data!.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onCreated={handleCreated} />
        </Modal>
      )}
    </div>
  );
}

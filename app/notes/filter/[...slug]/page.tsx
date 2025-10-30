import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const INITIAL_PAGE = 1;
const INITIAL_PER_PAGE = 12;
const INITIAL_SEARCH = '';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0]?.toLowerCase() === 'all' ? undefined : slug?.[0];
  
  const queryClient = new QueryClient();
  
  try {
    await queryClient.prefetchQuery({
      queryKey: ['notes', INITIAL_PAGE, INITIAL_SEARCH, tag],
      queryFn: () =>
        fetchNotes({
          page: INITIAL_PAGE,
          perPage: INITIAL_PER_PAGE,
          search: INITIAL_SEARCH,
          tag,
        }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Could not fetch the list of notes. ${message}`);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={INITIAL_PAGE}
        initialPerPage={INITIAL_PER_PAGE}
        initialSearch={INITIAL_SEARCH}
        tag={tag}
      />
    </HydrationBoundary>
  );
}

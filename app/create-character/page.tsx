import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import CharacterCreator from '../components/CharacterCreator';

interface Props {
  searchParams: Promise<{ scenario?: string }>;
}

export default async function CreateCharacterPage({ searchParams }: Props) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/');
  }

  const params = await searchParams;
  const scenario = params.scenario || 'zombie-apocalypse';

  return <CharacterCreator scenario={scenario} />;
}

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import ScenarioSelector from '../components/ScenarioSelector';

export default async function SelectScenarioPage() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/');
  }

  return <ScenarioSelector />;
}

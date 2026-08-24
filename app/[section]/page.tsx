import { notFound } from 'next/navigation';
import { SectionPage } from '../components/section-page';

const sections = ['roster', 'bmi', 'fees', 'duty', 'countdown', 'readiness', 'announcements', 'gallery', 'wall-of-fame', 'raffle'];

export default function SectionRoute({ params }: { params: { section: string } }) {
  if (!sections.includes(params.section)) notFound();
  return <SectionPage section={params.section} />;
}
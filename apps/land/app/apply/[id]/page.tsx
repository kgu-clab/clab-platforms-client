import ApplyDetailContent from './ApplyDetailContent';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApplyDetailPage({ params }: Props) {
  const { id } = await params;
  return <ApplyDetailContent id={id} />;
}

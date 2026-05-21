import { CompletePage } from '../../../../../components/checkout-wizard/pages/complete'

type Props = {
  params: Promise<{ id: string }>
}

export default async function CheckoutCompletePage({ params }: Props) {
  const { id } = await params
  return <CompletePage id={id} />
}

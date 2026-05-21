import { OrderWizard } from '../../../../components/order-wizard'
import { OrderPage as OrderPageComponent } from '../../../../components/order-wizard/pages/order'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params
  return (
    <OrderWizard orderId={id}>
      <OrderPageComponent id={id} />
    </OrderWizard>
  )
}

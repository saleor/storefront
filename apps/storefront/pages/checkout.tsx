import {
  CheckoutSidebar,
  CheckoutForm,
} from '@/components'

export default function CheckoutPage() {
  return (
    <main className="min-h-screen overflow-hidden flex">
      <CheckoutForm />
      <CheckoutSidebar />
    </main>
  )
}

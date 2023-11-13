interface CartSummaryProps {
  subtotal: string;
  total: string;
}

const CartSummary = ({ subtotal, total }: CartSummaryProps) => {
  return (
    <div className="flex flex-col gap-4 items-end my-8 px-4">
      <div className="flex gap-8">
        <p className="text-sm uppercase">Suma częściowa</p>
        <p className="text-md font-bold">{subtotal}</p>
      </div>
      <div className="flex gap-8">
        <p className="text-sm uppercase">Suma</p>
        <p className="text-md font-bold">{total}</p>
      </div>
    </div>
  );
};

export default CartSummary;

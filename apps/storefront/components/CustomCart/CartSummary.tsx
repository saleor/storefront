import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

interface CartSummaryProps {
  subtotal: string;
  total: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, total }) => {
  return (
    <>
      <TableRow style={{ borderBottom: "none" }}>
        <TableCell align="right" colSpan={4} style={{ borderBottom: "none" }}>
          <p className="text-md">Suma częściowa</p>
        </TableCell>
        <TableCell align="right" style={{ borderBottom: "none" }}>
          <p className="text-md">{subtotal}</p>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="right" colSpan={4}>
          <p className="text-md">Suma</p>
        </TableCell>
        <TableCell align="right">
          <p className="text-md">{total}</p>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CartSummary;

import { useSelector } from "react-redux";

const DebugRedux = () => {
  const invoices = useSelector((state) => state.invoices);
  const products = useSelector((state) => state.products);
  const customers = useSelector((state) => state.customers);

  // console.log("INVOICES:", invoices);
  // console.log("PRODUCTS:", products);
  // console.log("CUSTOMERS:", customers);
};
export default DebugRedux;
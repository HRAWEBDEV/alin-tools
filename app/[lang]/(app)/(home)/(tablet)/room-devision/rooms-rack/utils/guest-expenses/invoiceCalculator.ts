const calculateInvoiceTotalValue = ({
 service,
 tax,
 price,
 discount,
 amount,
}: {
 service: number;
 tax: number;
 amount: number;
 price: number;
 discount: number;
}) => {
 return (
  Number(price) * Number(amount) -
  Number(discount) +
  Number(service) +
  Number(tax)
 );
};

export { calculateInvoiceTotalValue };

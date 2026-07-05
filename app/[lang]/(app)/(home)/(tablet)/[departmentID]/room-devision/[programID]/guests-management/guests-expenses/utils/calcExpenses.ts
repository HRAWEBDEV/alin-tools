const calcPercentage = ({ value, base }: { value: number; base: number }) => {
 if (base === 0) return 0;
 return Number(((value / base) * 100).toFixed(2));
};

const calcPrice = ({ value, base }: { value: number; base: number }) => {
 return Number(((value * base) / 100).toFixed(4));
};

const calculateServiceAndTax = ({
 rate,
 sValue,
 discount,
}: {
 rate: number;
 sValue: number;
 discount: number;
}) => Number((((sValue - discount) * rate) / 100).toFixed(4));

const deriveRate = ({
 price,
 sValue,
 discount,
}: {
 price: number;
 sValue: number;
 discount: number;
}) => {
 const base = sValue - discount;
 if (base === 0) return 0;
 return Number(((price / base) * 100).toFixed(2));
};

export { calcPercentage, calcPrice, calculateServiceAndTax, deriveRate };

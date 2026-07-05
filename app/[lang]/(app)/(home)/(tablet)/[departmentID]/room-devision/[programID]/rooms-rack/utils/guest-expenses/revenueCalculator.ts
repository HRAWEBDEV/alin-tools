const calculateTotalValue = ({
 sValue,
 discount,
 taxRate,
 serviceRate,
}: {
 sValue: number;
 discount: number;
 taxRate: number;
 serviceRate: number;
}) => {
 const totalPositiveValue = sValue - discount + serviceRate + taxRate;
 return Number(totalPositiveValue.toFixed(4));
};

const calculateService = ({
 serviceRate,
 sValue,
 discount,
}: {
 serviceRate: number;
 sValue: number;
 discount: number;
}) => {
 const service = ((sValue - discount) * serviceRate) / 100;
 return Number(service.toFixed(4));
};

const calculateTax = ({
 taxRate,
 sValue,
 discount,
 service,
}: {
 taxRate: number;
 sValue: number;
 discount: number;
 service: number;
}) => {
 const tax = ((sValue - discount + service) * taxRate) / 100;
 return Number(tax.toFixed(4));
};

export { calculateTax, calculateService, calculateTotalValue };

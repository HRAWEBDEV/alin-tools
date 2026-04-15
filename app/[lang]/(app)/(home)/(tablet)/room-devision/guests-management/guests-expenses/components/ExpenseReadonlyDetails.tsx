import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import DetailRow from '../../../components/DetailRow';
import { Revenue } from '../services/guestsExpensesApiActions';
import { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
import { calcPercentage, deriveRate } from '../utils/calcExpenses';

export default function ExpenseReadonlyDetails({
 dic,
 expense,
 currencyName,
}: {
 dic: GuestsExpensesDictionary;
 expense: Revenue | null;
 currencyName: string;
}) {
 const { locale } = useBaseConfig();

 const viewUnitPrice =
  expense && expense.amount > 0 ? expense.sValue / expense.amount : 0;
 const viewDiscountRate = expense
  ? calcPercentage({ value: expense.discount, base: expense.sValue })
  : 0;
 const viewServiceRate = expense
  ? deriveRate({
     price: expense.service,
     sValue: expense.sValue,
     discount: expense.discount,
    })
  : 0;
 const viewTaxRate = expense
  ? deriveRate({
     price: expense.tax,
     sValue: expense.sValue,
     discount: expense.discount,
    })
  : 0;
 return (
  expense && (
   <div className='grid sm:grid-cols-2 grid-cols-1 gap-x-10 gap-y-4 py-4'>
    <DetailRow
     wrapperClassName=''
     label={dic.fields?.date}
     value={new Date(expense.dateTimeDateTimeOffset).toLocaleDateString(locale)}
    />
    <DetailRow label={dic.fields?.currency} value={currencyName} />
    <DetailRow
     label={dic.fields?.item}
     value={expense.itemName}
     valueClassName='text-primary'
    />
    <DetailRow label={dic.fields?.room} value={expense.roomLabel} />
    <DetailRow
     label={dic.fields?.unitPrice}
     value={viewUnitPrice.toLocaleString()}
    />
    <DetailRow
     label={dic.fields?.amount}
     value={expense.amount.toLocaleString()}
    />
    <DetailRow
     label={dic.fields?.price}
     value={expense.sValue.toLocaleString()}
    />
    <DetailRow
     label={dic.fields?.discount}
     value={
      expense.discount > 0
       ? `${expense.discount.toLocaleString()} (%${viewDiscountRate})`
       : '—'
     }
    />
    <DetailRow label={dic.fields?.serviceRate} value={`%${viewServiceRate}`} />
    <DetailRow label={dic.fields?.taxRate} value={`%${viewTaxRate}`} />
    <DetailRow
     label={dic.fields?.total}
     value={expense.totalValue?.toLocaleString()}
    />
    {expense.comment && (
     <div className='sm:col-span-2 sm:border-t pt-4'>
      <DetailRow
       wrapperClassName='flex-col items-stretch'
       label={dic.fields?.comment}
       value={expense.comment}
      />
     </div>
    )}
   </div>
  )
 );
}

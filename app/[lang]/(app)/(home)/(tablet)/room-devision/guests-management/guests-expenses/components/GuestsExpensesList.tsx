'use client';

import GuestsExpenseCard from './GuestsExpensesCard';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Revenue } from '../services/guestsExpensesApiActions';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';

type Props = {
 dic: GuestsExpensesDictionary;
 expenses: Revenue[];
 isLoading: boolean;
 isFetching: boolean;
 isError: boolean;
 onSelectExpense: (expense: Revenue) => void;
};

export default function GuestsExpensesList({
 dic,
 expenses,
 isLoading,
 isFetching,
 isError,
 onSelectExpense,
}: Props) {
 if (!isLoading && !expenses.length) return <NoItemFound />;
 if (!isFetching && isError) return <UnExpectedError />;

 return (
  <div>
   {isFetching && <LinearLoading />}

   <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 pb-4'>
    {expenses.map((expense) => (
     <GuestsExpenseCard
      key={expense.id}
      expense={expense}
      dic={dic}
      onClick={() => onSelectExpense(expense)}
     />
    ))}
   </div>
  </div>
 );
}

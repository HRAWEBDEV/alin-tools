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
 isFetchingNextPage: boolean;
 isError: boolean;
 hasMore: boolean;
 onLoadMore: () => void;
 onSelectExpense: (expense: Revenue) => void;
};

export default function GuestsExpensesList({
 dic,
 expenses,
 isLoading,
 isFetching,
 isFetchingNextPage,
 isError,
 hasMore,
 onLoadMore,
 onSelectExpense,
}: Props) {
 if (!isLoading && !expenses.length) return <NoItemFound />;
 if (!isFetching && isError) return <UnExpectedError />;

 return (
  <div>
   {isFetching && !isFetchingNextPage && <LinearLoading />}

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

   {hasMore && (
    <div className='flex items-center justify-center mt-4'>
     <Button
      variant='outline'
      size='lg'
      disabled={isFetchingNextPage}
      onClick={onLoadMore}
      className='text-primary border-primary font-medium'
     >
      {isFetchingNextPage && (
       <Spinner className='text-primary mr-2 rtl:ml-2 rtl:mr-0' />
      )}
      {/* {dic.info?.loadMore || 'Load More'} */}
     </Button>
    </div>
   )}
  </div>
 );
}

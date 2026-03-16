import { ReadonlyURLSearchParams } from 'next/navigation';

type QueryValues<T extends string> = Record<T, string[] | undefined>;

type SetSearchQueryOnPathname = (
 params: SetSearchQueryOnPathnameInput,
) => SetSearchQueryOnPathnameResult;
type SetSearchQueryOnPathnameInput = {
 pathname: string;
 queryValues: GetSearchQueryValuesResult;
};
type SetSearchQueryOnPathnameResult = string;

type GetSearchQueryValues = (
 params: GetSearchQueryValuesInput,
) => GetSearchQueryValuesResult;

type GetSearchQueryValuesInput = {
 searchQuery: ReadonlyURLSearchParams;
 queryList: string[];
};
type GetSearchQueryValuesResult = {
 [key in string]?: string[];
};

const GetSearchQueryValues: GetSearchQueryValues = ({
 searchQuery,
 queryList,
}) => {
 if (!queryList.length) return {};
 const queryValue = queryList.reduce((acc, curr) => {
  const searchValues = searchQuery.getAll(curr);
  if (!searchValues.length) return acc;
  return { ...acc, [curr]: searchValues };
 }, {} as GetSearchQueryValuesResult);
 return queryValue;
};

const SetSearchQueryOnPathname: SetSearchQueryOnPathname = ({
 pathname,
 queryValues,
}) => {
 const url = new URL(pathname, new URL(window.location.href).origin);
 const queryValuesList = Object.keys(queryValues);
 if (!queryValuesList.length) return pathname;
 queryValuesList.forEach((searchKey) => {
  const searchValues = queryValues[searchKey];
  searchValues?.forEach((value) => {
   if (value) {
    url.searchParams.set(searchKey, value);
   }
  });
 });
 return url.href.replace(url.origin, '');
};

function getSearchQueries<T extends string>({
 searchQuery,
 queryList,
}: {
 searchQuery: ReadonlyURLSearchParams;
 queryList: ReadonlyArray<T>;
}): {
 [key in T as `${T}Query`]: string[];
} {
 return queryList.reduce(
  (acc, curr) => {
   const searchValues = searchQuery.getAll(String(curr));
   return {
    ...acc,
    [`${curr}Query`]: searchValues.map((item) => item && decodeURI(item)),
   };
  },
  {} as {
   [key in T as `${T}Query`]: string[];
  },
 );
}

export {
 GetSearchQueryValues as GetSearchQueryValues,
 SetSearchQueryOnPathname as SetSearchQueryOnPathname,
 getSearchQueries,
 type QueryValues as QueryValues,
 type GetSearchQueryValuesResult as GetSearchQueryValuesResult,
};

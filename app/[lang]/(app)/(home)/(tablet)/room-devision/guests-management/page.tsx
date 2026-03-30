import { getGuestsManagementDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-management/dictionary';
import { type Locale } from '@/internalization/app/localization';
import React from 'react';
import GuestsMangementWrapper from './components/GuestsMangementWrapper';
import { Metadata } from 'next';

export const generateMetadata = async (
 props: PageProps<'/[lang]/room-devision/guests-management'>,
): Promise<Metadata> => {
 const { lang } = await props.params;
 const dic = await getGuestsManagementDictionary({ locale: lang as Locale });
 return { title: dic.title };
};

export default async function page(
 props: PageProps<'/[lang]/room-devision/guests-management'>,
) {
 const { lang } = await props.params;
 const dic = await getGuestsManagementDictionary({ locale: lang as Locale });
 return <GuestsMangementWrapper dic={dic} />;
}

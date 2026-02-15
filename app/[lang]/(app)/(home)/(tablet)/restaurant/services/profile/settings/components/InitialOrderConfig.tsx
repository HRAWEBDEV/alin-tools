import React from 'react';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';

export default function InitialOrderConfigView() {
 const {
  restaurantShareDictionary: {
   components: { settings },
  },
 } = useRestaurantShareDictionary();
 return (
  <div>
   <h4>{settings.components.initialOrderConfig.title}</h4>
  </div>
 );
}

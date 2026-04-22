import {
 type OrderItem,
 type ItemProgram,
 type Tag,
} from '../services/newOrderApiActions';

type OrderItemActions =
 | { type: 'insertOrderItems'; payload: OrderItem[] }
 | {
    type: 'addOrderItems';
    payload: Pick<
     ItemProgram,
     'itemCode' | 'itemName' | 'itemID' | 'serviceRate' | 'taxRate' | 'price'
    >[];
   }
 | {
    type: 'splitShopOrderItem';
    payload: Pick<
     ItemProgram,
     'itemCode' | 'itemName' | 'itemID' | 'serviceRate' | 'taxRate' | 'price'
    > &
     Pick<OrderItem, 'id'>;
   }
 | {
    type: 'removeOrderItems';
    payload: ItemProgram['itemID'][];
   }
 | {
    type: 'increaseOrderItemsAmount';
    payload: {
     itemsIDs: ItemProgram['itemID'][];
     increaseBy: number;
    };
   }
 | {
    type: 'decreaseOrderItemsAmount';
    payload: {
     itemsIDs: ItemProgram['itemID'][];
     decreaseBy: number;
    };
   }
 | {
    type: 'removeShopOrderItems';
    payload: OrderItem['id'][];
   }
 | {
    type: 'increaseShopOrderItemAmount';
    payload: {
     id: OrderItem['id'];
     increaseBy: number;
    };
   }
 | {
    type: 'decreaseShopOrderItemsAmount';
    payload: {
     id: OrderItem['id'];
     decreaseBy: number;
    };
   }
 | {
    type: 'clearOrderItems';
   }
 | {
    type: 'addTag';
    payload: {
     id: ItemProgram['id'];
     tag: Tag;
    };
   }
 | {
    type: 'removeTag';
    payload: {
     id: ItemProgram['id'];
     tagID: number;
    };
   };

function removeOrderItems(
 orderItems: OrderItem[],
 action: {
  type: 'removeOrderItems';
  payload: ItemProgram['itemID'][];
 },
): OrderItem[] {
 return orderItems.filter((order) => {
  let removeIds = action.payload;
  if (removeIds.includes(order.itemID)) {
   removeIds = action.payload.filter((id) => id !== order.itemID);
   return false;
  }
  return true;
 });
}

function removeShopOrderItems(
 orderItems: OrderItem[],
 action: {
  type: 'removeShopOrderItems';
  payload: OrderItem['id'][];
 },
): OrderItem[] {
 return orderItems.filter((order) => {
  if (action.payload.includes(order.id)) {
   return false;
  }
  return true;
 });
}

function orderItemsReducer(state: OrderItem[], action: OrderItemActions) {
 switch (action.type) {
  // insert bulk
  case 'insertOrderItems':
   return action.payload;
  // add
  case 'addOrderItems':
   return [
    ...state,
    ...action.payload.map((item) => {
     const newOrder: OrderItem = {
      id: -Date.now(),
      orderID: 0,
      amount: 1,
      discount: 0,
      discountRate: 0,
      itemCode: item.itemCode,
      itemName: item.itemName || '',
      itemID: item.itemID,
      netValue: 0,
      price: item.price,
      sValue: 0,
      service: 0,
      serviceRate: item.serviceRate,
      tagID: null,
      tax: 0,
      taxRate: item.taxRate,
      tagComment: null,
     };
     return newOrder;
    }),
   ];
  // split shop order item
  case 'splitShopOrderItem':
   return [
    ...state,
    {
     id: -Date.now(),
     orderID: 0,
     amount: 1,
     discount: 0,
     discountRate: 0,
     itemCode: action.payload.itemCode,
     itemName: action.payload.itemName || '',
     itemID: action.payload.itemID,
     netValue: 0,
     price: action.payload.price,
     sValue: 0,
     service: 0,
     serviceRate: action.payload.serviceRate,
     tagID: null,
     tax: 0,
     taxRate: action.payload.taxRate,
     tagComment: null,
    },
   ];
  // remove
  case 'removeOrderItems':
   return removeOrderItems(state, action);
  // increase
  case 'increaseOrderItemsAmount':
   return state.map((order) => {
    let increaseIds = action.payload.itemsIDs;
    if (increaseIds.includes(order.itemID)) {
     increaseIds = action.payload.itemsIDs.filter((id) => order.itemID !== id);
     const newAmount = order.amount + action.payload.increaseBy;
     return {
      ...order,
      amount: newAmount,
     };
    }
    return order;
   });
  // decreaseOrderItemsAmount
  case 'decreaseOrderItemsAmount':
   const mustRemoveOrderIDs: number[] = [];
   const newOrderItems = state.map((order) => {
    let decreaseIds = action.payload.itemsIDs;
    if (decreaseIds.includes(order.itemID)) {
     decreaseIds = action.payload.itemsIDs.filter((id) => order.itemID !== id);
     const newAmount = order.amount - action.payload.decreaseBy;
     if (newAmount > 0) {
      // TODO should calculate prices
      return {
       ...order,
       amount: newAmount,
      };
     }
     mustRemoveOrderIDs.push(order.itemID);
     return order;
    }
    return order;
   });
   return removeOrderItems(newOrderItems, {
    type: 'removeOrderItems',
    payload: mustRemoveOrderIDs,
   });
  //  increase shop order
  case 'increaseShopOrderItemAmount':
   return state.map((order) => {
    if (order.id === action.payload.id) {
     const newAmount = order.amount + action.payload.increaseBy;
     return {
      ...order,
      amount: newAmount,
     };
    }
    return order;
   });
  //  decrease shop order
  case 'decreaseShopOrderItemsAmount':
   const mustRemoveShopOrderIDs: number[] = [];
   const newShopOrderItems = state.map((order) => {
    if (action.payload.id === order.id) {
     const newAmount = order.amount - action.payload.decreaseBy;
     if (newAmount > 0) {
      // TODO should calculate prices
      return {
       ...order,
       amount: newAmount,
      };
     }
     mustRemoveShopOrderIDs.push(order.itemID);
     return order;
    }
    return order;
   });
   return removeShopOrderItems(newShopOrderItems, {
    type: 'removeShopOrderItems',
    payload: mustRemoveShopOrderIDs,
   });
  // remove shop
  case 'removeShopOrderItems':
   return removeShopOrderItems(state, action);
  // tags
  case 'addTag':
   return state.map((order) => {
    if (order.id === action.payload.id) {
     return {
      ...order,
      tagID: action.payload.tag.id,
      tagComment: action.payload.tag.comment,
     };
    }
    return order;
   });
  case 'removeTag':
   return state.map((order) => {
    if (order.id === action.payload.id) {
     return {
      ...order,
      tagID: null,
      tagComment: null,
     };
    }
    return order;
   });
  // clear order items
  case 'clearOrderItems':
   return [];
 }
}

export type { OrderItemActions };
export { orderItemsReducer };

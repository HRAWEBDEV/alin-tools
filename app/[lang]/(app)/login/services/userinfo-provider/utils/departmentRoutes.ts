import { Departments } from './systems';
const roomDevisionRoute = 'room-devision';
const restaurantRotue = 'restaurant';

function isTheRightPath(pathname: string, departmentID: number) {
 const activeRoute = pathname.split('/').at(2);
 switch (departmentID) {
  case Departments.foodAndBeverage:
   return activeRoute === restaurantRotue;
  case Departments.roomDivision:
   return activeRoute === roomDevisionRoute;
 }
 return true;
}

export { roomDevisionRoute, restaurantRotue, isTheRightPath };

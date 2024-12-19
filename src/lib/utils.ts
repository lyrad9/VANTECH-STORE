import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import{createSearchParamsCache} from "nuqs/server"
import {parseAsInteger, parseAsString} from "nuqs/server"
import { useCartStore } from "./cart.store"
import { JsonValue } from "@prisma/client/runtime/library";
import { SchemaSafeImages, SchemaSafeProductsOrder } from "../../schemas/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const truncateText = (str: string) => {
  if (str) {
    if (str.length < 25) return str;
    return str.substring(0, 25) + "...";
  }
};
export const searchParamsCache = createSearchParamsCache({
  rating: parseAsInteger,
  page:parseAsInteger.withDefault(1),
  query:parseAsString.withDefault(""),
  search:parseAsString.withDefault(""),
  status:parseAsString.withDefault(""),
  deliveryStatus:parseAsString.withDefault(""),
  paymentStatus:parseAsString.withDefault(""),
 orderDate:parseAsString.withDefault(""),
 role:parseAsString.withDefault(""),


})


export const getStartAndEndOfPeriod = (name:"week" | "month" | "all") => {
  const today = new Date()
if(name === "week") {
  const start =  new Date(today.getFullYear(),today.getMonth(),today.getDate() - today.getDay() + 1)
  const end = new Date(start.getFullYear(),start.getMonth(), start.getDate() + 6)

return {
  start,
  end
}


}
else if(name ==="month"){
  const start =  new Date(today.getFullYear(),today.getMonth() ,1)
  const end = new Date(start.getFullYear(),start.getMonth() + 1, 0)
  return {
      start,
      end
  }
}
else{
  return {
      start:undefined,
      end:undefined,
  }
  
}
}
const ITEMS_PER_PAGE = 3
export const GetFilteredProductsCart = (currentPage:number) =>  {
    const { cart } = useCartStore()
    const offset = (currentPage - 1) * ITEMS_PER_PAGE
    const limit = offset + ITEMS_PER_PAGE
    const products = cart.slice(offset,limit)
    return products
}
export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'fr-FR',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
export const formatPrice = (amount:number) => {
  
  return new Intl.NumberFormat
  ('en-FR',{
      style:'currency',
      currency:'XAF'
  }).format(amount)

}
export const formatNumber = (nbr:number) =>{
return nbr < 10 ? "0" + nbr : nbr
}
export const ParseProducts = (products: JsonValue) => {
  const stringProducts = products as string;
  return SchemaSafeProductsOrder.parse(
    JSON.parse(JSON.stringify(stringProducts))
  );
};
export const ParseProductImages = (images: JsonValue) => {

  const stringImages = images as string;
  return SchemaSafeImages.parse(JSON.parse(JSON.stringify(stringImages)));
};
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
// display all pages without any ellipsis.
if (totalPages <= 7) {
 return Array.from({ length: totalPages }, (_, i) => i + 1);
}

// If the current page is among the first 3 pages,
// show the first 3, an ellipsis, and the last 2 pages.
if (currentPage <= 3) {
 return [1, 2, 3, '...', totalPages - 1, totalPages];
}

// If the current page is among the last 3 pages,
// show the first 2, an ellipsis, and the last 3 pages.
if (currentPage >= totalPages - 2) {
 return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
}

// If the current page is somewhere in the middle,
// show the first page, an ellipsis, the current page and its neighbors,
// another ellipsis, and the last page.
return [
 1,
 '...',
 currentPage - 1,
 currentPage,
 currentPage + 1,
 '...',
 totalPages,
];
}
export const mapStatus = ["published", "draft", "archive"]
export const MapDeliveryStatusOrder = [
  "Delivered",
  "Pending",
  "Dispatched",
  "Cancelled",
];
export const Permissions = [
  {
    id:"edit product",
    label:"edit product"

  },
  {
    id:"add product",
    label:"add product"

  },
  {
    id:"delete product",
    label:"delete product"

  },
  {
    id:"delete order",
    label:"delete order"

  },
  // "add product",
  // "delete product",
  // "edit product",
  // "delete order",
  // "change the status order"
]
export type PageProps<T = never> = {
  params:T,
  searchParams:{ [key: string]: string}
}

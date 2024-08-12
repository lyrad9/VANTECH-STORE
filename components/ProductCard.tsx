"use client";
import React, { PropsWithChildren } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/lib/truncate";
import { useRouter } from "next/navigation";
import { productsType } from "@/lib/typeProducts";
import { useCartStore } from "@/lib/cart.store";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@prisma/client";
import { Review } from "@prisma/client";
import { Rating } from "@mui/material";
import { formatPrice } from "@/lib/formatPrice";
// import { products } from "@/lib/products";
export const CardProduct = (
  product: PropsWithChildren<Product & { reviews: Review[] }>
) => {
  const Router = useRouter();

  return (
    <div className="text-muted-foreground flex flex-col w-full shadow-md rounded-md overflow-hidden  cursor-pointer ">
      <div
        onClick={() => Router.push(`/${product.id}/product`)}
        className=" w-full relative aspect-square overflow-hidden h-52"
      >
        <Image
          fill
          src={ParseImage(product.images)[0].image}
          alt={product.description!}
          className="object-contain"
        />
      </div>
      <div className="border-t grid grid-cols-1 flex-grow gap-y-4 min-h-5  bg-white text-sm p-4  ">
        <p className="font-semibold text-blue-500">{product.name}</p>
        {/* <p className="font-semibold">{truncateText(product.name)}</p> */}
        {/* <p>{product.description}</p> */}
        <div className="flex  items-center w-full flex-col justify-end">
          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center gap-1">
              <p className="font-semibold"> {formatPrice(product.price)}</p>
              <Rating value={4.5} precision={0.5} readOnly size="small" />
            </div>

            <div className="flex gap-2 ml-auto">{product.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const ToggleCartButton = ({
  product,
}: {
  product: Product & { reviews: Review[] };
}) => {
  const [cartProduct, setCartProduct] = useState({
    id:  Number(product.id),
    name: product.name,
    description: product.description,
    brand: product.brand,
    category: product.category,
    quantity: 1,
    image: ParseImage(product.images)[0].image,
    price: product.price,
  });

  const { isInCart, toggleCart } = useCartStore(
    useShallow((s) => ({
      isInCart: s.cart.some((item) => item.id === cartProduct.id),
      toggleCart: s.toggleCart,
    }))
  );
  return (
    <Button
      className=""
      variant={isInCart ? "defaultBtn" : "outline"}
      onClick={() => toggleCart(cartProduct)}
    >
      <ShoppingCart
        className={clsx(isInCart ? "text-white" : "text-blue-500")}
        size={16}
        fill={isInCart ? "white" : "none"}
      />
    </Button>
  );
};

export const ToggleLikeButton = ({
  product,
}: {
  product: Product & { reviews: Review[] };
}) => {
  // const favorites = useCartStore((s) => s.favorites)
  // const toggleFavorite = useCartStore((s) => s.toggleFavorite)
  const [cartProduct, setCartProduct] = useState({
    id: Number(product.id),
    name: product.name,
    description: product.description,
    brand: product.brand,
    category: product.category,
    quantity: 1,
    image: ParseImage(product.images)[0].image,
    price: product.price,
  });
  const { isFavorite, toggleFavorite } = useCartStore(
    useShallow((s) => ({
      isFavorite: s.favorites.some((product) => product.id === cartProduct.id),
      toggleFavorite: s.toggleFavorite,
    }))
  );
  // const isFavorite = favorites.includes(id)
  return (
    <Button variant={"outline"} onClick={() => toggleFavorite(cartProduct)}>
      <Heart
        className="text-muted-foreground"
        size={16}
        fill={isFavorite ? "blue" : "none"}
      />
    </Button>
  );
};
export const SkeletonProductsCards = () => {
  const numberSkeletonCards = 4;
  const skeletonsCards = Array.from({ length: numberSkeletonCards }, (_, i) => (
    <SkeletonCard key={i} />
  ));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-6">
      {skeletonsCards}
    </div>
  );
};
export const SkeletonCard = () => {
  return (
    <div className="flex flex-col w-full rounded-md overflow-hidden bg-slate-200">
      <Skeleton className="h-52   rounded-none" />
      <div className=" flex flex-col flex-grow gap-y-3 text-sm p-8 sm:p-4  ">
        <Skeleton className="h-5 w-full " />
        <Skeleton className="h-8 w-full " />
        <div className=" flex justify-between items-center">
          <Skeleton className="h-5 w-12  " />
          <div className="flex gap-2 ">
            <Skeleton className=" w-12 h-10 " />
            <Skeleton className="  w-12 h-10 " />
          </div>
        </div>
      </div>
    </div>
  );
};
export const ParseImage = (images: any) => {
  const safeImages: { image: string }[] = JSON.parse(
    JSON.stringify(images as string)
  );
  return safeImages;
};

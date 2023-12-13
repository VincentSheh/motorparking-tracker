import Image from "next/image";
import { stringify } from "querystring";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps<T extends React.ElementType> {
  as?: T;
  text?: any;
  pict?: string;
  alt?:string;
}

export default function Button<T extends React.ElementType = "button">({
  as,
  ...props
}: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const Component = as || "button";
  const pictUrl: any = props.pict;
  const alt: any = props.alt;

  return (
    <Component
      {...props}
      className={twMerge(
        "flex w-56 items-center justify-center gap-2 rounded-lg bg-blue-500 p-3 text-white active:bg-blue-600 disabled:bg-gray-200 md:w-60 lg:w-64 xl:w-72",
        props.className
      )}
    >
      {props.text}
      {pictUrl && <Image src={pictUrl} width="64" height="64" alt={alt} />}
    </Component>
  );
}

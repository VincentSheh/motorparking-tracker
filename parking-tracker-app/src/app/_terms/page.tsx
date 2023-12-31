import Button from "@/components/Button";
import Link from "next/link";

export default function Terms(){

  return(
    <>
    <div>
      You agree to give us A+ in this course
    </div>
    <div className="flex flex-col">

    </div>
    <Link href={"/maps"}> I agree </Link>
    <Link href={"/terms/anotherterms"}>I dont </Link>
    </>
  )
}
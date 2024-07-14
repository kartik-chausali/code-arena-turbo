import Link from "next/link";

export function SolveProblemButton({href, children}:{href:string, children:React.ReactNode}){
    return <Link href={href} className=" w-5/12 inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300 mt-3"
    prefetch={false}>
        {children}
    </Link>
}
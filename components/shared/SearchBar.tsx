"use client"

import Image from "next/image";
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Props {
    routeType: string;
}


function SearchBar({ routeType }: Props) {

    const router = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(search){
                router.push(`/${routeType}?q=` + search);
            } else {
                router.push(`/${routeType}`);
            }

        }, 300);

        return () => clearTimeout(delayDebounceFn)
    }, [search, routeType]);

  return (
    <div className="searchbar">
        <Image 
            src='assets/search-gray.svg'
            alt='Search'
            width={24}
            height={24}
            className="object-contain"
        />
        <Input 
            id="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${routeType !== "/search" ? "Search Communities" : "Search creators"}`}
            className="no-focus searchbar_input"
        />
    </div>
  )
}

export default SearchBar
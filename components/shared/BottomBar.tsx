'use client'

import Link from "next/link";
import { sidebarLinks } from '../../constants/index'
import Image from "next/image";
import { usePathname } from 'next/navigation'

interface SideBarLink {
  imgURL: string;
  route: string;
  label: string;
}

export default function BottomBar() {

  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((item: SideBarLink) => {

          // check if link is active
          const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

          return (
            <Link
              href={item.route}
              key={item.label}
              className={`bottombar_link ${isActive && 'bg-primary-500'}`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">{item.label.split(/\s+./)[0]}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
'use client'

import Link from "next/link";
import { sidebarLinks } from '../../constants/index'
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";



interface SideBarLink {
  imgURL: string;
  route: string;
  label: string;
}

export default function LeftSideBar() {

  const pathname = usePathname();
  const router = useRouter();
  const {userId} = useAuth();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((item: SideBarLink) => {

          // check if link is active
          const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

          if(item.route === '/profile'){
            item.route = `${item.route}/${userId}`
          }

          return (
            <Link
              href={item.route}
              key={item.label}
              className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{item.label}</p>
            </Link>
          )
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src='/assets/logout.svg' alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}
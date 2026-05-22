'use client'
import { ROUTE } from '@/route'
import { Show, SignInButton, SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    const {isSignedIn,user,isLoaded} = useUser();
  return (
    <nav className='flex flex-row items-center justify-between py-4 px-10 bg-white shadow-md sticky top-0 z-50 rounded-b-2xl'>
        <h1 className='flex'>
            <Image src="/logo.png" alt="Bookie Logo" width={50} height={50} className='inline-block mr-2'/>
            <span className='logo-text'>Bookie</span>
        </h1>
        <div className='flex flex-row items-center justify-between space-x-5'>
            <Link className='nav-link-base active:nav-link-active' href="/library">Library</Link>
            <Link className='nav-link-base active:nav-link-active' href={ROUTE.NEW_BOOK}>
                Add New
            </Link>
            <Show when="signed-out">
                <SignInButton mode="modal" >
                        <button  className='nav-btn active:nav-link-active bg-blue-200'>Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal" >
                        <button className='nav-btn active:nav-link-active bg-green-200'>Sign Up</button>
                </SignUpButton>
                
            </Show>
            <Show when="signed-in">
                <div className='flex items-center justify-center gap-3 border-1 border-gray-300 rounded-xl px-3 py-2'>
                    <UserButton/>
                    <span className='hidden sm:inline'>{user?.firstName} {user?.lastName}</span>
                </div>
                
            </Show>
        </div>
    </nav>
  )
}

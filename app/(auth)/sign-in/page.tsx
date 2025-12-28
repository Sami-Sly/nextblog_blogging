import SignInForm from '@/components/signin-form'
import { requireNoAuth } from '@/lib/auth-utils'
import React from 'react'
export const dynamic = "force-dynamic";

async function page() {
  // await requireNoAuth()
  
  return (
    <div className='flex justify-center items-center  w-full h-dvh '>
      <SignInForm />
    </div>
  )
}

export default page

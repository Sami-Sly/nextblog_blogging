import SignUpForm from '@/components/signup-form'
import { requireNoAuth } from '@/lib/auth-utils'
import React from 'react'
export const dynamic = "force-dynamic";

async function page() {
    // await requireNoAuth()
  return (
    <div className='flex justify-center items-center  w-full h-dvh '>
      <SignUpForm />
    </div>
  )
}

export default page

import React from 'react';
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <h1>Profile</h1>
      <Link href='/edit'>Edit profile</Link>
    </div>
  )
}

export default page
"use client";

import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners'

const loading = () => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <ClimbingBoxLoader
        color='#2f8bfc'
        loading={true}
        size={30}
      />
    </div>
  )
}

export default loading
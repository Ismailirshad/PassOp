import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
    <div className='flex bg-green-950 vh-full text-white justify-center items-center gap-5 ' >
         <div className="logo font-bold text-white text-center text-2xl">
            <span className='text-green-500'>&lt;</span>
            Pass
            <span className='text-green-500'>OP/&gt;</span>
        </div>
        <div className='p-1'>
      Created  with <FontAwesomeIcon icon={faHeart} style={{color: "#ffffff",}} /> by Irshad

        </div>
    </div>
  )
}

export default Footer

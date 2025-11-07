import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function Navbar() {
  return (
    <nav className='bg-slate-800 text-white'>
      <div className='flex justify-between px-4 py-2 items-center mycontainer'>
        <div className="logo font-bold text-white text-2xl">
          <span className='text-green-500'>&lt;</span>
          Pass
          <span className='text-green-500'>OP/&gt;</span>
        </div>
        <button className='bg-green-700 text-white font-bold gap-2 p-1 px-2 rounded-full  flex logo hover:bg-green-500'>
          <div >
            <FontAwesomeIcon icon={faGithub} />
          </div>
          Github
        </button>
      </div>
    </nav>
  )
}

export default Navbar

import React from 'react'
import Image from 'next/image'

const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400] md:w-[400]">
                    <Image src={'/marketing-left.png'} fill alt={'marketing-left'} className={'object-contain'} />
                </div>
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400] md:w-[400] hidden md:block">
                    <Image src={'/marketing-right.png'} fill alt={'marketing-left'} className={'object-contain '} />

                </div>
            </div>
        </div>
    )
}
export default Heroes

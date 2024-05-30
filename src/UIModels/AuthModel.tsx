
import AuthLoading from '@/components/AuthLoading'
import Link from 'next/link'
import Image from 'next/image';
import React from 'react'

interface IAuthModel {
    children: React.ReactNode,
    link: string,
    linkText?: string,
    linkTextTwo?: string,
    isLoading: boolean
}

const AuthModel: React.FC<IAuthModel> = ({ children, link, linkText, linkTextTwo, isLoading }) => {
    return (
        <div className='w-full h-[100vh] flex justify-center items-center bg-[#2f8bfc] fontsfamily'>
            <div className='w-full h-full p-3 bg-tranparent flex rounded-xl overflow-hidden gap-2'>
                <div style={{ width: '70%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }} className='w-[400px] gap-4 p-1 '>
                    <div style={{ gridRow: 'span 2', boxShadow: '0px 0px 8px #000' }} className='relative rounded-2xl overflow-hidden scale-1 hover:scale-[1.2]'>
                        <Image
                            src={'/51745.jpg'}
                            fill
                            alt='image'
                            className='object-cover'
                        />
                    </div>
                    <div style={{ boxShadow: '0px 0px 8px #000' }} className='relative rounded-2xl overflow-hidden'>
                        <Image
                            src={'/digital-display-with-bunny-rabbit-box-with-words-rabbit-it_177363-9306.avif'}
                            fill
                            alt='image'
                            className='object-cover'
                        />
                    </div>
                    <div style={{ boxShadow: '0px 0px 8px #000' }} className='relative rounded-2xl overflow-hidden'>
                        <Image
                            src={'/young-asian-woman-engaged-live-streaming-podcasting-using-microphones-wearing-headphonegenerated-with-ai_130181-16727.jpg'}
                            fill
                            alt='image'
                            className='object-cover'
                        />
                    </div>
                </div>
                <div style={{ width: '30%', height: '100%' }} className=' bg-black rounded-2xl p-2 relative overflow-hidden'>
                    {isLoading && <AuthLoading />}
                    <div  className='w-full h-[calc(100%-100px)] text-center'>
                        {children}
                    </div>
                    <div className='w-full h-[100px] flex justify-center border-t-[1px] border-t-[#212121] items-center gap-6' >
                        <h3 className='font-bold text-white text-xl '>{linkText}</h3>
                        <Link href={link} className='auth_right-container-link font-bold text-lg'
                        >{linkTextTwo}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthModel

{/* <a href="https://www.freepik.com/free-ai-image/close-up-cartoon-character-boy-social-media_94961497.htm#query=social%20media%20cartoon&position=9&from_view=keyword&track=ais&uuid=30e03898-e22b-4546-90b3-0bad94455532">Image by freepik</a> */ }
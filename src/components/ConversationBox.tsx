import React, { useCallback, useMemo } from 'react'
import { IUseConversationUserList } from './ConversationsUser'
import { useRouter } from 'next/navigation'
import { useUser } from '@/libs/useUser'
import { useNewMessageUserSearch } from '@/libs/useNewMessageUserSearch'
import Image from 'next/image'
import { format } from 'date-fns'

interface IUseConversationBox {
    data: IUseConversationUserList
}

const ConversationBox: React.FC<IUseConversationBox> = ({ data }) => {

    const { conversationId } = useNewMessageUserSearch();

    const router = useRouter();
    const { user } = useUser();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data._id}`)
    }, [router, data._id]);

    const lastMessage = useMemo(() => {
        const messages = data?.message || [];

        return messages[messages?.length - 1];
    }, [data?.message])

    const currentUser = useMemo(() => {
        return user?._id;
    }, [user?._id]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }

        const seenArray = lastMessage?.seen || [];

        if (!currentUser) {
            return false
        };

        return seenArray.filter((user) => user?._id === currentUser)?.length !== 0;
    }, [lastMessage, currentUser]);


    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }

        if (lastMessage?.body) {
            return lastMessage.body;
        }

        return 'Started a conversation'
    }, [lastMessage]);

    const conversationPartner = data.users.find((data) => data?._id !== user?._id);

    return (
        <div
            onClick={handleClick}
            className={`w-full h-[70px] flex justify-start items-center px-3 py-2   ${data?._id === conversationId ? 'border-r-2 bg-[#2f8bfc23] dark:bg-[#060a10] dark:hover:bg-[#0b121b] border-r-[#2f8bfc]' : 'hover:border-r-2 hover:border-r-[#2f8bfc] hover:bg-[#0b121b] '} `}>
            <div className='w-[43px] h-[43px] relative overflow-hidden rounded-full'>
                <Image
                    src={conversationPartner?.profilePicture ? conversationPartner?.profilePicture : '/profile-circle.svg'}
                    fill
                    className='object-cover'
                    alt='profile'
                />
            </div>
            <div className='flex flex-col justify-start items-start w-[calc(100%-43px)] h-full dark:text-neutral-400 text-gray-400 text-xs '>
                <div className='flex justify-start items-center'>
                    <h1 className='dark:text-white text-black fontsfamily font-semibold text-[18px] ml-4'>{conversationPartner?.name}</h1>
                    <h1 className='dark:text-neutral-500 text-gray-400 fontsfamily font-normal text-[16px] ml-2 trucate mr-1'>@{conversationPartner?.username} .</h1>
                    {lastMessage?.createdAt &&
                        format(new Date(lastMessage?.createdAt), 'p')
                    }
                </div>
                <p className={`truncate fontsfamily text-[14px] mt-[8px] ml-4 ${hasSeen ? 'text-neutral-500' : 'text-white font-medium'}`}>{lastMessageText}</p>
            </div>
        </div>
    )
}

export default ConversationBox
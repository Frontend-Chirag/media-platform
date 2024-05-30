
import ConversationsList from '@/components/ConversationsList';

import React from 'react'

const Conversations = () => {
    return (
        <div className={`w-full h-full flex pr-6 pt-1`}>
            <ConversationsList type='Conversation'/>
        </div>
    )
}

export default Conversations
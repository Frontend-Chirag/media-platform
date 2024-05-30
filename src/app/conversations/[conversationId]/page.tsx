
import ConversationsList from "@/components/ConversationsList";


interface IParams {
    conversationId: string
}

const ConversationId = ({ params }: { params: IParams }) => {

    return (
        <div className={` w-full h-full flex pr-6 pt-1`}>
            <ConversationsList type="ConversationId" id={params.conversationId} />
        </div>
    )
}

export default ConversationId;
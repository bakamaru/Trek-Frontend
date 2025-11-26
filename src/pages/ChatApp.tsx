import { useState, useEffect, useRef } from 'react';
import Chat from '../components/chat/Chat';
import { useGetAssistantDetailQuery } from '../redux/aibot/aiAssistantAPI';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { assistantName } = useParams<{ assistantName: string }>();
    const [assistantId, setAssistantId] = useState<number | null>(null);
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    // Fetch all assistants to find the one matching the name from params
    const { data: assistantDetail, isLoading, isError, error } = useGetAssistantDetailQuery(
        { aiAssistantId: assistantId || 0 },
        { skip: !assistantId }
    );

    useEffect(() => {
        try {
            const parsedId = parseInt(id);
            if (!isNaN(parsedId)) {
                setAssistantId(parsedId);
            } else {
                console.error("Invalid assistant ID in URL:", assistantName);
                // Optionally, redirect the user or display an error message
            }
        } catch (error) {
            console.error("Error parsing assistant ID:", error);
            // Optionally, redirect the user or display an error message
        }

    }, []);

    if (isLoading) {
        return <div>Loading chat configuration...</div>;
    }

    if (isError) {
        return <div>Error loading chat configuration: {(error as any).message}</div>;
    }

    // Now you have the assistantDetail, which includes configuration and parameters

    return (
        <>
            {assistantDetail && (
                <Chat assistant={assistantDetail.Data} />
            )}
        </>
    );
};

export default ChatPage;
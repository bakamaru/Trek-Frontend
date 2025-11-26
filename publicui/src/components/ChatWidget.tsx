import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TREKS_DATA, TOURS_DATA, DESTINATIONS_DATA } from '../const/constants';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const ChatWidget: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<any | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const systemInstruction = useMemo(() => {
        const trekSummary = TREKS_DATA.map(trek => `- ${trek.title} (${trek.duration}, $${trek.price}, Difficulty: ${trek.difficulty})`).join('\n');
        const tourSummary = TOURS_DATA.map(tour => `- ${tour.title} (${tour.duration}, $${tour.price}, Location: ${tour.location})`).join('\n');
        const destinationSummary = DESTINATIONS_DATA.map(dest => dest.name).join(', ');

        return `You are a friendly and knowledgeable travel assistant for Heavenly Pathways, a premier travel agency.
Your goal is to help users find the perfect trip based ONLY on the information provided to you.
Do not invent trips, treks, or destinations that are not on this list.
If a user asks about something not on the list, politely inform them it's not available and suggest an alternative from the list.

Here is the list of available treks:
${trekSummary}

Here is the list of available tours:
${tourSummary}

We operate in the following destinations: ${destinationSummary}.

Keep your answers concise and helpful. When a user asks about a specific trip, provide a brief summary of its key features like duration, price, and difficulty.
Encourage users to explore the website for full details by saying "You can find more details on our website."
Start the conversation by greeting the user and asking how you can help them plan their adventure.`;
    }, []);


    // useEffect(() => {
    //     const initializeChat = async () => {
    //         try {
    //             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    //             chatRef.current = ai.chats.create({
    //                 model: 'gemini-2.5-flash',
    //                 config: {
    //                     systemInstruction,
    //                 },
    //             });
                
    //             // Send an empty message to get the initial greeting
    //             setIsLoading(true);
    //             const response = await chatRef.current.sendMessage({ message: '' });
    //             setIsLoading(false);
    //             setMessages([{ sender: 'ai', text: response.text }]);

    //         } catch (error) {
    //             console.error("Failed to initialize Gemini chat:", error);
    //              setMessages([{ sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    //         }
    //     };
    //     initializeChat();
    // }, [systemInstruction]);

    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, isChatOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !chatRef.current) return;

        const userMessage: Message = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: inputValue });
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const openAiChat = () => {
        setShowOptions(false);
        setIsChatOpen(true);
    };

    const openWhatsApp = () => {
        // Replace with actual number
        window.open('https://wa.me/1234567890', '_blank');
        setShowOptions(false);
    };

    return (
        <>
            {/* Options Menu */}
            <div className={`fixed bottom-28 right-8 flex flex-col items-end space-y-4 transition-all duration-300 z-50 ${showOptions && !isChatOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                
                {/* AI Assistant Option */}
                <div className="flex items-center space-x-3 group">
                    <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Talk to AI Assistant
                    </span>
                    <button 
                        onClick={openAiChat}
                        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
                        aria-label="Open AI Chat"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </button>
                </div>

                {/* WhatsApp Option */}
                <div className="flex items-center space-x-3 group">
                     <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Contact via WhatsApp
                    </span>
                    <button 
                        onClick={openWhatsApp}
                        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110"
                        aria-label="Contact via WhatsApp"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    </button>
                </div>
            </div>

            {/* Main Toggle Button */}
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out ${isChatOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={toggleOptions}
                    className={`${showOptions ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-700 hover:bg-blue-800'} text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-colors duration-300`}
                    aria-label={showOptions ? "Close options" : "Open chat options"}
                >
                     <div className={`transition-transform duration-300 ${showOptions ? 'rotate-90' : 'rotate-0'}`}>
                        {showOptions ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        )}
                    </div>
                </button>
            </div>

            {/* AI Chat Window */}
            <div className={`fixed bottom-8 right-8 w-[90vw] max-w-sm h-[70vh] max-h-[40rem] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-2xl transition-all duration-300 ease-in-out origin-bottom-right z-50 ${isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 flex-shrink-0 bg-blue-700 rounded-t-lg">
                    <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                    <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-blue-700 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about your trip..."
                            className="w-full p-2.5 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-all dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-blue-700 text-white rounded-full p-2.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;
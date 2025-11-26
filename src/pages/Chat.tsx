import React, { useState, useEffect } from 'react';

// Icons from the Remix Icon set in react-icons
import {
    RiSunLine,
    RiMoonFill,
    RiCustomerService2Line,
    RiInformationLine,
    RiGalleryLine,
    RiShoppingCartLine,
    RiTeamLine,
    RiCodeSSlashLine,
    RiArrowRightUpLine
} from 'react-icons/ri';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import { useGetAssistantsQuery } from '../redux/aibot/aiAssistantAPI';

const iconMap: { [key: string]: React.ReactNode } = {
    'Customer Support': <RiCustomerService2Line size={32} />,
    'Informative': <RiInformationLine size={32} />,
    'Sales & Marketing': <RiShoppingCartLine size={32} />,
    'Internal Tools': <RiTeamLine size={32} />,
    'Developer Tools': <RiCodeSSlashLine size={32} />,
    'Photos Only': <RiGalleryLine size={32} />,
};

const BotCard = ({ bot }: { bot: any }) => (
    <div className="group bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 flex flex-col transition-all duration-300 hover:border-red-500/40 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-800 text-red-500 border border-slate-200 dark:border-zinc-700">
                {iconMap[bot.Category] || <RiCustomerService2Line size={32} />}
            </div>
            <span className="bg-red-100/50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                {bot.Category|| "assistant"}
            </span>
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-slate-100 mb-2">{bot.Name}</h3>
            <p className="text-zinc-600 dark:text-slate-400 leading-relaxed">{bot.Description}</p>
        </div>
        <a href={"/chat/app?id=" + bot.AIAssistantId} className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-slate-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all">
            Start Chat
            <RiArrowRightUpLine className="transition-transform group-hover:rotate-45" />
        </a>
    </div>
);

const ShowcasePage = () => {
    const { data: assistantsData, isLoading, isError, error } = useGetAssistantsQuery({ IsActive: true });

    if (isLoading) {
        return <div>Loading assistants...</div>;
    }

    if (isError) {
        return <div>Error loading assistants: {(error as any).message}</div>;
    }

    const activeBots = assistantsData?.Data || [];

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 text-zinc-800 dark:text-slate-300 font-sans antialiased min-h-screen">
            <Header />
            <main className="pt-20">
                <section className="py-24 sm:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Page Header */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-slate-50 sm:text-5xl lg:text-6xl tracking-tight">
                                Choose Your Assistant
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-600 dark:text-slate-400">
                                Select a pre-configured bot from our showcase to start a conversation and see what's possible.
                            </p>
                        </div>

                        {/* Bots Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activeBots.map((bot: any) => (
                                <BotCard
                                    key={bot.AIAssistantId}
                                    bot={bot}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ShowcasePage;
import React, { useState, useContext, useMemo } from 'react';
const Checkout: React.FC = () => {

    const [paymentMethod, setPaymentMethod] = useState('cc');
    
     const isPayingBalance =100;// pendingAmount !== undefined && pendingAmount > 0;

     const totalPrice =100;// useMemo(() => item ? item.price * travelers : 0, [item, travelers]);
     const amountToPay =100;// useMemo(() => isPayingBalance ? pendingAmount : totalPrice, [isPayingBalance, pendingAmount, totalPrice]);

    // State for partial payment, disabled if paying a balance
    const [isPartialPayment, setIsPartialPayment] = useState(false);
    const [partialAmountValue, setPartialAmountValue] = useState(isPayingBalance ? amountToPay : 0);

    const finalAmountToPay = isPayingBalance ? amountToPay : (isPartialPayment ? partialAmountValue : totalPrice);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        // Here, you would integrate a real payment gateway.
        // For this demo, we'll just simulate a successful payment.
        // console.log({
        //     paymentMethod,
        //     isPartialPayment: !isPayingBalance && isPartialPayment,
        //     amountPaid: finalAmountToPay,
        //     totalPrice,
        //     item: item?.title
        // });
        //navigate('/booking-confirmation');
    };

    // if (!item) {
    //     return (
    //         <div className="pt-20 h-screen flex items-center justify-center">
    //             <div className="text-center">
    //                 <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
    //                 <a href={'/'} className="text-blue-700 underline">Return to Home</a>
    //             </div>
    //         </div>
    //     );
    // }

    const handlePartialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value >= 0 && value <= totalPrice) {
            setPartialAmountValue(value);
        } else if (value > totalPrice) {
            setPartialAmountValue(totalPrice);
        } else {
            setPartialAmountValue(0);
        }
    }

    const renderPaymentForm = () => {
        switch (paymentMethod) {
            case 'cc':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name on Card</label>
                            <input type="text" id="cardName" required className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        </div>
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                            <input type="text" id="cardNumber" required placeholder="•••• •••• •••• ••••" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                                <input type="text" id="cardExpiry" required placeholder="MM / YY" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                                <input type="text" id="cardCvc" required placeholder="•••" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </div>
                        </div>
                    </div>
                );
            case 'stripe':
                return <div className="text-center p-8 border-2 border-dashed rounded-lg dark:border-gray-600"><button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">Pay with Stripe</button></div>;
            case 'wallet':
                 return <div className="text-center p-8 border-2 border-dashed rounded-lg dark:border-gray-600"><button className="bg-black text-white font-bold py-3 px-6 rounded-lg">Pay with Wallet</button></div>;
            default: return null;
        }
    }

    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-900">
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-12">Checkout</h1>
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Payment Details */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Payment Method</h2>
                            <form onSubmit={handlePayment}>
                                <div className="flex border-b dark:border-gray-700 mb-6">
                                    <button type="button" onClick={() => setPaymentMethod('cc')} className={`py-3 px-6 font-semibold text-lg transition-colors duration-300 ${paymentMethod === 'cc' ? 'border-b-4 border-blue-700 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Credit Card</button>
                                    <button type="button" onClick={() => setPaymentMethod('stripe')} className={`py-3 px-6 font-semibold text-lg transition-colors duration-300 ${paymentMethod === 'stripe' ? 'border-b-4 border-blue-700 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Stripe</button>
                                    <button type="button" onClick={() => setPaymentMethod('wallet')} className={`py-3 px-6 font-semibold text-lg transition-colors duration-300 ${paymentMethod === 'wallet' ? 'border-b-4 border-blue-700 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Wallet</button>
                                </div>
                                
                                {renderPaymentForm()}
                                
                                {!isPayingBalance && (
                                    <div className="mt-8 border-t dark:border-gray-700 pt-6">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" checked={isPartialPayment} onChange={e => setIsPartialPayment(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-800 focus:ring-blue-700" />
                                            <span className="text-gray-700 dark:text-gray-300">Pay a deposit</span>
                                        </label>
                                        {isPartialPayment && (
                                            <div className="mt-4">
                                                <label htmlFor="partialAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount to pay now (min $100)</label>
                                                <input type="number" id="partialAmount" value={partialAmountValue} onChange={handlePartialAmountChange} min="100" max={totalPrice} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                                <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">Remaining balance of ${(totalPrice - partialAmountValue).toLocaleString()} will be due later.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button type="submit" className="w-full mt-8 bg-blue-700 text-white px-6 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                                    Pay ${finalAmountToPay.toLocaleString()} Now
                                </button>
                            </form>
                        </div>
                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-4">Order Summary</h2>
                                <img src={''} alt={''} className="rounded-lg mb-4" />
                                <h3 className="text-xl font-semibold dark:text-gray-200">{"Test"}</h3>
                                <div className="space-y-3 my-4 text-gray-600 dark:text-gray-300">
                                    <p className="flex justify-between"><span>Date:</span> <strong>{new Date().toLocaleDateString()}</strong></p>
                                    <p className="flex justify-between"><span>Travelers:</span> <strong>{"2"}</strong></p>
                                    <p className="flex justify-between"><span>Price per person:</span> <strong>${100}</strong></p>
                                </div>
                                <div className="border-t dark:border-gray-700 pt-4 space-y-2">
                                     <p className="flex justify-between text-lg font-semibold text-gray-800 dark:text-gray-100">
                                        <span>Total Price:</span>
                                        <span>${totalPrice.toLocaleString()}</span>
                                    </p>
                                     {isPayingBalance && (
                                        <p className="flex justify-between text-lg font-bold text-blue-700 dark:text-blue-400">
                                            <span>Balance to Pay:</span>
                                            <span>${"100".toLocaleString()}</span>
                                        </p>
                                     )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;
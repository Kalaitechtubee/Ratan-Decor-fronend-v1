import React from "react";

const UpiPayButton = ({ amount, note }) => {
    const upiID = "kalaitechtube2001@oksbi";     // Your UPI ID
    const payeeName = "Kalaikumar";   // Payee/Business Name

    // Generate UPI Payment Link
    const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(
        payeeName
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Detect Mobile Device
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const handlePay = () => {
        if (isMobile) {
            window.location.href = upiLink;
        } else {
            alert("Please scan the QR code using any UPI-enabled application to make payment.");
        }
    };

    return (
        <div className="space-y-5 p-4">

            {/* Title */}
            <h2 className="font-bold text-xl text-gray-800">
                Secure UPI Payment
            </h2>

            {/* Mobile View – Direct Payment */}
            {isMobile ? (
                <button
                    onClick={handlePay}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium shadow"
                >
                    Proceed to Pay
                </button>
            ) : (
                /* Desktop View – QR Code */
                <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">
                        Scan to Pay
                    </h3>

                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                            upiLink
                        )}`}
                        alt="UPI QR Code"
                        className="mx-auto border rounded-lg shadow p-2"
                    />

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">UPI ID</span>
                        <div className="flex items-center gap-2">
                            <code className="text-sm font-semibold text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">{upiID}</code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(upiID);
                                    alert("UPI ID copied to clipboard!");
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Copy UPI ID"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">
                        Scan this QR using any UPI-supported payment application on your mobile device.
                    </p>
                </div>
            )}

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
                Payments are encrypted and securely processed through UPI.<br />
                No additional charges apply.
            </p>

        </div>
    );
};

export default UpiPayButton;

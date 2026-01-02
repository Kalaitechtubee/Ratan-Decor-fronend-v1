import React from "react";

const UpiPayButton = ({ amount, note }) => {
    const upiID = "vg19022005@oksbi";     // Your UPI ID
    const payeeName = "Ganesh";   // Payee/Business Name

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

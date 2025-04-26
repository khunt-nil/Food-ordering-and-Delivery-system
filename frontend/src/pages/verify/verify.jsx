import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying payment...");

    const success = searchParams.get("success") === "true";
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        if (!orderId) {
            setMessage("Invalid order.");
            return;
        }

        // ✅ Use a separate function inside useEffect (DO NOT make useEffect itself async)
        const updateOrderStatus = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/order/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId, success }),
                });
                const data = await response.json();
                if (data.success) {
                    setMessage(success ? "Payment successful! Your order is confirmed." : "Payment failed. Try again.");
                } else {
                    setMessage("Something went wrong. Please contact support.");
                }
            } catch (error) {
                setMessage("Network error. Try again later.");
            }
        };

        updateOrderStatus();

        // ✅ Return a proper cleanup function to avoid the "destroy is not a function" error
        return () => {
            console.log("Cleanup function executed"); // Optional for debugging
        };
    }, [orderId, success]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyPage;

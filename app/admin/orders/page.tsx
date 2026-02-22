import React from "react";
import OrdersPageComponent from "../components/Orders";

export default function OrdersPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0b0f" }}>
      <OrdersPageComponent />
    </div>
  );
}

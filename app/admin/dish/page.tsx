import NavbarAdmin from "../components/NavbarAdmin";
import DishAdminPage from "./Dish";

export default function DishAdmin() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0b0f" }}>
      <NavbarAdmin />
      <DishAdminPage />
    </div>
  );
}

import UsersAdminPage from "./User";
import NavbarAdmin from "../components/NavbarAdmin";
export default function UsersPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0b0f" }}>
      <NavbarAdmin />
      <UsersAdminPage />
    </div>
  );
}

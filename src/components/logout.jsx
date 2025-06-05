import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}

import { useAuth } from "../../contexts/AuthContext";

export default function RoleGuard({ roles = [], children }) {
  const { user } = useAuth();

  // إذا لم يكن دوره ضمن الأدوار المسموحة → لا تعرض شيئاً
  if (!user || !roles.includes(user.role)) {
    return null;
  }
  return children;
}
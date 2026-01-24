import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth/useAuthStore";
import { useEffect } from "react";

export const AuthLayout = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const navigate = useNavigate();

	console.log({ isAuthenticated });

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	return (
		<>
			<Outlet />
		</>
	);
};

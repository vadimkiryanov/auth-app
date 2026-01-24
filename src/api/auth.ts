import type { RegistrationData, LoginData } from "../types/auth";

const API_BASE = "http://localhost:8000/auth";

export const authApi = {
	async signUp(data: RegistrationData): Promise<Response> {
		return fetch(`${API_BASE}/sign-up`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
	},

	async signIn(data: LoginData): Promise<Response> {
		return fetch(`${API_BASE}/sign-in`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then((res) => {
			// console.log(res.json());
			return res;
		});
	},
};

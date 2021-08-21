import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "./api";

let token = Cookies.get("token");

/**
 * POST for /signup
 * @param {Object} data
 */
export const signup = async (data) => {
	return new Promise((resolve) => {
		resolve(
			axios.post("http://localhost:3001/signup", data).then((res) => {
				Cookies.set("token", res.data.token, {
					sameSite: "strict",
					secure: true,
					expires: 9999,
				});
			})
		);
	}).catch((error) => {
		console.log(error);
	});
};

/**
 * POST for /signin
 * @param {Object} data
 */
export const signin = async (data) => {
	return new Promise((resolve) => {
		resolve(
			axios.post(`http://localhost:3001/signin`, data).then((res) => {
				if (res.data.token === token) {
					Cookies.set("token", token, {
						sameSite: "strict",
						secure: true,
						expires: 9999,
					});
				} else {
					Cookies.set("token", res.data.token, {
						sameSite: "strict",
						secure: true,
						expires: 9999,
					});
				}
			})
		);
	}).catch((error) => {
		const errorMessage = "Password or Email are incorrect";
		return errorMessage;
	});
};

/**
 * Get user for /
 * @param {Object} data
 */
export const getUser = async (token) => {
	return new Promise((resolve) => {
		const response = axios.get(`${apiUrl}/user/`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		resolve(response);
	}).catch((error) => {
		console.log(error);
	});
};

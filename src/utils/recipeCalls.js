import axios from "axios";
import { apiUrl } from "./api";

/**
 * POST recipe /api/recipes
 * @param {Object} data
 */
export const postRecipe = (token, data) => {
	return new Promise((resolve) => {
		resolve(
			axios.post(`${apiUrl}/recipes`, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
		);
	}).catch((error) => {
		console.log(error);
	});
};

/**
 * GET all recipes /api/recipes
 */
export const getRecipes = () => {
	return new Promise((resolve) => {
		const response = axios.get(`${apiUrl}/recipes/`);
		resolve(response);
	}).catch((error) => {
		console.log(error);
	});
};

/**
 * GET one recipe /api/recipes/:id
 * @param {String} id
 */
export const getRecipe = (id) => {
	return new Promise((resolve) => {
		const response = axios.get(`${apiUrl}/recipes/${id}`);
		resolve(response);
	}).catch((error) => {
		console.log(error);
	});
};

/**
 * PUT update one recipe /api/recipes/:id
 * @param {String} id
 */
export const updateRecipe = (token, id, data) => {
	return new Promise((resolve) => {
		resolve(
			axios.put(`${apiUrl}/recipes/${id}`, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
		);
	}).catch((error) => {
		console.log(error);
	});
};

/**
 * DELETE one recipe /api/recipes/:id
 * @param {String} id
 */
export const deleteRecipe = (token, id) => {
	return new Promise((resolve) => {
		resolve(
			axios.delete(`${apiUrl}/recipes/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
		)
	})
	.catch((error) => {
		console.log(error)
	})
};

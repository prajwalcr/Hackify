import axios from "axios";
import {
	GET_PROJECTS,
	ADD_PROJECT,
	DELETE_PROJECT,
	PROJECTS_LOADING,
	UPDATE_PROJECT,
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

export const getProjects = () => (dispatch) => {
	dispatch(setItemsLoading());
	axios
		.get("/api/projects")
		.then((res) => {
			dispatch({
				type: GET_PROJECTS,
				payload: res.data,
			});
		})
		.catch((err) =>
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					"PROJECTS_LOAD_FAIL",
				),
			),
		);
};

export const getProject = (id) => (dispatch) => {
	dispatch(setItemsLoading());
	axios
		.get(`/api/projects/${id}`)
		.then((res) => {
			dispatch({
				type: GET_PROJECTS,
				payload: res.data,
			});
		})
		.catch((err) =>
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					"PROJECT_LOAD_FAIL",
				),
			),
		);
};

export const addProject = (project) => (dispatch, getState) => {
	axios
		.post("/api/projects", project, tokenConfig(getState))
		.then((res) => {
			dispatch({
				type: ADD_PROJECT,
				payload: res.data,
			});
		})
		.catch((err) =>
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					"PROJECT_ADD_FAIL",
				),
			),
		);
};

export const deleteProject = (id) => (dispatch, getState) => {
	axios
		.delete(`/api/projects/${id}`, tokenConfig(getState))
		.then((res) => {
			dispatch({
				type: DELETE_PROJECT,
				payload: id,
			});
		})
		.catch((err) =>
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					"PROJECT_DELETE_FAIL",
				),
			),
		);
};

export const updateProject = (project) => (dispatch, getState) => {
	if (
		project.title === "" ||
		project.coverPic === "" ||
		project.content === "<p><br></p>"
	) {
		dispatch(
			returnErrors(
				{ msg: "Project update failed" },
				400,
				"PROJECT_UPDATE_FAIL",
			),
		);
	} else {
		axios
			.put(`/api/projects/${project._id}`, project, tokenConfig(getState))
			.then((res) => {
				dispatch({
					type: UPDATE_PROJECT,
					payload: project,
				});
			})
			.catch((err) =>
				dispatch(
					returnErrors(
						err.response.data,
						err.response.status,
						"PROJECT_UPDATE_FAIL",
					),
				),
			);
	}
};

export const setItemsLoading = () => {
	return {
		type: PROJECTS_LOADING,
	};
};

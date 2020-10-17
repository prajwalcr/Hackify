import {
	ADD_PROJECT,
	DELETE_PROJECT,
	GET_PROJECTS,
	UPDATE_PROJECT,
	PROJECTS_LOADING,
} from "../actions/types";

const initialState = {
	projects: [],
	loading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_PROJECTS:
			return {
				...state,
				projects: action.payload,
				loading: false,
			};
		case DELETE_PROJECT:
			return {
				...state,
				projects: state.projects.filter(
					(project) => project._id !== action.payload
				),
				loading: false,
			};
		case ADD_PROJECT:
			return {
				...state,
				projects: [action.payload, ...state.projects],
				loading: false,
			};
		case UPDATE_PROJECT:
			const newState = state.projects.filter(
				(project) => project._id !== action.payload._id
			);
			return {
				...state,
				projects: [action.payload, ...newState],
				loading: false,
			};
		case PROJECTS_LOADING:
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}

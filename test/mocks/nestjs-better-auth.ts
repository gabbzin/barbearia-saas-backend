export const Roles = () => {
	return () => undefined;
};

export const Session = () => {
	return () => undefined;
};

export type UserSession = {
	user: {
		id: string;
		[key: string]: unknown;
	};
};

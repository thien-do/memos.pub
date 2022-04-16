import { BlogPageError } from "@/lib/blog/page/type";
import { GitHubRequest } from "../type";

export const parseGitHubBlogError = (
	request: GitHubRequest,
	error: unknown
): BlogPageError => {
	if (hasStatus(error)) {
		return {
			type: "error",
			status: error.status,
			message: getMessage(request, error),
		};
	} else {
		throw error;
	}
};

interface HasStatus {
	status: number;
}

const hasStatus = (raw: unknown): raw is HasStatus => {
	if (typeof raw !== "object") return false;
	if (raw === null) throw raw;
	if ("status" in raw) {
		return typeof (raw as HasStatus).status === "number";
	} else {
		return false;
	}
};

const get404 = (request: GitHubRequest): string => {
	const { owner, path, repo } = request;
	const paths = path === "" ? "nothing" : `no "${path}"`;
	const href = `https://github.com/${owner}/${repo}`;
	const repos = `<a target="_blank" href="${href}">${owner}/${repo}</a>`;
	return `Looks like there is ${paths} at ${repos}.`;
};

const getMessage = (request: GitHubRequest, error: HasStatus): string => {
	switch (error.status) {
		case 404:
			return get404(request);
		default:
			throw error;
	}
};

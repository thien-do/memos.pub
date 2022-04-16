// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from "next/server";
import { join as pathJoin } from "path";
import { MEMBER_PATHS } from "./path";

/*
Re-write
- thien.do to /_blog/thien-do/thien-do
- thien.do/foo.md to /_blog/thien-do/thien-do/foo.md
*/
export const rewriteMemberRequest = (req: NextRequest): null | NextResponse => {
	// When thien.do is mapped to localhost via /etc/hosts:
	// - req.nextUrl.host returns "localhost"
	// - req.headers.get("host") return "thien.do:3000" -> we want this
	const host = req.headers.get("host")?.replace(":3000", "");
	if (host === null) throw Error("Host is not defined");

	const member = MEMBER_PATHS.find((member) => member.from === host);
	if (member === undefined) return null;

	const { from, to } = member;
	const url = req.nextUrl.clone();
	const { pathname } = req.nextUrl;
	url.pathname = `/_member/${pathJoin(from, to, pathname)}`;
	return NextResponse.rewrite(url);
};
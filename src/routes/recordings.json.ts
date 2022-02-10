import { XMLParser } from 'fast-xml-parser';
import prettyBytes from 'pretty-bytes';
export async function get({ url }) {
	const parser = new XMLParser();
	let prefix = url.searchParams.get('prefix') ?? '';

	return {
		status: 200,
		body:
			(
				await fetch(`https://cdn.freshair.radio/?max-keys=30&prefix=live-recordings/rec-${prefix}`)
					.then((r) => r.text())
					.then((t) => parser.parse(t))
			)?.ListBucketResult?.Contents?.map((file) => ({
				download: `https://cdn.freshair.radio/${file.Key}`,
				name: file.Key.split('live-recordings/rec-')[1],
				size: prettyBytes(file.Size)
			})) ?? []
	};
}

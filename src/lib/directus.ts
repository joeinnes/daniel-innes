import { Directus } from '@directus/sdk';
const directus = new Directus('https://api.traist.co.uk');
const defaultQuery = {
	fields: ['*', 'files.directus_files_id'],
	sort: ['-post_date'],
	limit: 15
};
export { defaultQuery, directus };

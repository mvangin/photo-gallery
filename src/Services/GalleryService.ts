export async function getPhotos(
	page: number,
	query: string,
	color: string,
	orientation: string
) {
	const orientationString =
		orientation === 'all' ? '' : `orientation=${orientation}`;

	const colorString = color === 'all' ? '' : `color=${color}`;

	const response = await fetch(
		`https://api.unsplash.com/search/photos?page=${page}&query=${query}&${colorString}&${orientationString}&client_id=mFHuZxpw9luWkA6kk4OublSvNMMlY3oieQRlzF8ROzk`
	);

	const data = await response.json();

	return data;
}
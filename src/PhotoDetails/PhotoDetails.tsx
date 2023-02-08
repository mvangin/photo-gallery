import { Typography, Box, Button } from '@mui/material';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import React from 'react';

const PhotoDetails = () => {
	const location = useLocation();

	const photo = location.state?.photo;

	const [searchParams] = useSearchParams();
	let query = searchParams.get('query');

	if (!photo) {
		return <Box>Photo not Found.</Box>;
	}
	return (
		<>
			<Box paddingLeft="1rem" paddingTop="10px">
				<Link
					to={`/?query=${query}`}
					state={{ photo: photo }}
					style={{ textDecoration: 'none' }}
				>
					<Button variant="contained">Back</Button>
				</Link>
			</Box>

			<Box
				display="flex"
				sx={{ margin: '0 auto' }}
				maxWidth="400px"
				justifyContent="center"
				padding="3rem"
			>
				<Box>
					<img
						width="100%"
						alt={photo.alt_description}
						src={photo.urls.full}
					/>
					<Typography variant="subtitle1">
						<i>Author: {photo.user.name}</i>
					</Typography>
					<Typography variant="subtitle1">
						Likes: <strong> {photo.likes} </strong>
					</Typography>
					<Typography
						sx={{
							fontSize: '1.2rem',
						}}
						variant="subtitle2"
					>
						{photo.description}
					</Typography>
				</Box>
			</Box>
		</>
	);
};

export default PhotoDetails;

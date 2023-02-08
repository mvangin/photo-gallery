import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
	ImageList,
	ImageListItem,
	FormControl,
	Select,
	MenuItem,
	TextField,
	Box,
	InputLabel,
} from '@mui/material';
import { getPhotos } from '../Services/GalleryService';
import { Link, useSearchParams } from 'react-router-dom';
import useDebounce from '../Hooks/UseDebounce';

export interface Photo {
	id: string;
	alt_description: string;
	urls: {
		full: string;
	};
	user: {
		name: string;
	};
	likes: number;
	description: string;
}

const PhotoGrid = () => {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce<string>(query, 500);
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [page, setPage] = useState(1);
	const [color, setColor] = useState('all');
	const [orientation, setOrientation] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(1);

	const observer = useRef<IntersectionObserver | null>(null);

	const [searchParams] = useSearchParams();
	const queryParam = searchParams.get('query');

	useEffect(() => {
		if (queryParam) {
			setQuery(queryParam);
		}
	}, [queryParam]);

	useEffect(() => {
		setPhotos([]);
		setPage(1);
	}, [query, orientation, color]);

	const fetchPhotos = useCallback(async () => {
		setIsLoading(true);

		try {
			const data = await getPhotos(
				page,
				debouncedQuery,
				color,
				orientation
			);

			if (data.results) {
				setPhotos((prevPhotos) => [...prevPhotos, ...data.results]);
				setTotalPages(data.total_pages);
			}

			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}, [page, debouncedQuery, color, orientation]);

	useEffect(() => {
		fetchPhotos();
	}, [fetchPhotos]);

	const lastElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node !== null) observer.current.observe(node);
		},
		[isLoading]
	);

	const handleFilterChange = (event: {
		target: { value: string; name: string };
	}) => {
		switch (event.target.name) {
			case 'color':
				setColor(event.target.value);
				break;
			case 'orientation':
				setOrientation(event.target.value);
				break;
			default:
				break;
		}
		setPage(1);
	};

	const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	return (
		<Box padding="3rem">
			<Box display="flex" justifyContent="center">
				<TextField
					sx={{ margin: '.5rem' }}
					label="Search Photos"
					value={query}
					onChange={handleQueryChange}
				/>
				<FormControl sx={{ minWidth: 200, margin: '.5rem' }}>
					<InputLabel id="color-select-label">Photo Color</InputLabel>
					<Select
						label="Photo Color"
						id="color-select"
						labelId="color-select-label"
						name="color"
						value={color}
						onChange={handleFilterChange}
					>
						<MenuItem value="all">All</MenuItem>
						<MenuItem value="black">Black</MenuItem>
						<MenuItem value="black_and_white">
							Black And White
						</MenuItem>
						<MenuItem value="white">White</MenuItem>
						<MenuItem value="yellow">Yellow</MenuItem>
						<MenuItem value="orange">Orange</MenuItem>
						<MenuItem value="red">Red</MenuItem>
						<MenuItem value="purple">Purple</MenuItem>
						<MenuItem value="magenta">Magenta</MenuItem>
						<MenuItem value="green">Green</MenuItem>
						<MenuItem value="teal">Teal</MenuItem>
						<MenuItem value="blue">Blue</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 200, margin: '.5rem' }}>
					<InputLabel id="orientation-select-label">
						Photo Orientation
					</InputLabel>

					<Select
						label="Orientation"
						id="orientation-select"
						labelId="orientation-select-label"
						name="orientation"
						value={orientation}
						onChange={handleFilterChange}
					>
						<MenuItem value="all">All</MenuItem>
						<MenuItem value="landscape">Landscape</MenuItem>
						<MenuItem value="portrait">Portrait</MenuItem>
						<MenuItem value="squarish">Squarish</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<ImageList cols={3} gap={8}>
				{photos &&
					photos.map((photo, index) => (
						<ImageListItem key={photo.id + index}>
							<Link
								to={`/details/${photo.id}?query=${query}`}
								state={{ photo: photo }}
							>
								<img
									style={{ objectFit: 'cover' }}
									width="400"
									height="400"
									alt={photo.alt_description}
									src={photo.urls.full}
								/>
							</Link>

							<div
								className={`${
									totalPages <= page ? 'hidden' : ''
								}`}
								ref={lastElementRef}
								style={{ height: '0' }}
							></div>
						</ImageListItem>
					))}
			</ImageList>
		</Box>
	);
};

export default PhotoGrid;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PhotoDetails from './PhotoDetails/PhotoDetails';
import PhotoGrid from './PhotoGrid/PhotoGrid';
import React from 'react';

const App = () => (
	<Router>
		<Routes>
			<Route path="/" element={<PhotoGrid />} />
			<Route path="/details/:photoId" element={<PhotoDetails />} />
		</Routes>
	</Router>
);

export default App;

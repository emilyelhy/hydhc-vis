import { Route, Navigate, Routes, BrowserRouter } from 'react-router-dom';

import './App.css';

import Overview from './Component/Overview';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path="/" element={<Navigate to="/overview" />} />
					<Route path="/overview" element={<Overview />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

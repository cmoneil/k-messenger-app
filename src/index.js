import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
	ThemeProvider,
	unstable_createMuiStrictModeTheme as createTheme, //Using material ui v5 here to clean up a console error
} from '@material-ui/core/styles';

const theme = createTheme();

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);


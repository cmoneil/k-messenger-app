import React, { useEffect, useState, useCallback } from 'react';
import {
	Button,
	FormControl,
	Paper,
	TextField,
	Typography,
	makeStyles,
	Tooltip,
	Grid,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginTop: 10,
	},
	formBody: {
		marginTop: 10,
		padding: theme.spacing(1),
	},
	formControl: {
		minWidth: '100%',
	},
	button: {
		minWidth: '100%',
	},
	clearButton: {
		minWidth: '100%',
	},
	message: {
		marginTop: theme.spacing(1),
	},
	messageBody: {
		padding: theme.spacing(1),
	},
}));

const App = () => {
	const classes = useStyles();
	const [selectedGuest, setSelectedGuest] = useState(null);
	const [guestList, setGuestList] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState(null);
	const [companyList, setCompanyList] = useState([]);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [templateList, setTemplateList] = useState([]);
	const [customTemplate, setCustomTemplate] = useState();
	const [messageToDisplay, setMessageToDisplay] = useState();

	const handleGuestChange = (e, value) => {
		setSelectedGuest(value);
	};
	const handleCompanyChange = (e, value) => {
		setSelectedCompany(value);
	};

	const handleTemplateChange = (e, value) => {
		setSelectedTemplate(value);
	};
	const handleCustomTemplate = (e) => {
		setCustomTemplate(e.target.value);
	};

	const getData = ({ fileName, stateFunction }) => {
		fetch(fileName, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				stateFunction(json);
			});
	};

	useEffect(() => {
		const dataToFetch = [
			{ fileName: 'Guests.json', stateFunction: setGuestList },
			{ fileName: 'Companies.json', stateFunction: setCompanyList },
			{ fileName: 'Templates.json', stateFunction: setTemplateList },
		];

		dataToFetch.map(({ fileName, stateFunction }) =>
			getData({ fileName, stateFunction })
		);
	}, []);

	const handleClearButtonClick = () => {
		setSelectedGuest(null);
		setSelectedCompany(null);
		setSelectedTemplate(null);
		setCustomTemplate('');
		setMessageToDisplay(null);
	};

	const handleCreateMessageClick = useCallback(() => {
		const {
			firstName,
			lastName,
			reservation: { roomNumber, startTimestamp, endTimestamp },
		} = selectedGuest;

		const { company, city, timeZone } = selectedCompany;
		let { template } = selectedTemplate || {};

		if (customTemplate) {
			template = customTemplate;
		}

		const startDate = new Date(startTimestamp).toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone,
		});
		const startTime = new Date(startTimestamp).toLocaleTimeString('en-us', {
			hour: 'numeric',
			minute: 'numeric',
			timeZone,
		});
		const endDate = new Date(endTimestamp).toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone,
		});
		const endTime = new Date(endTimestamp).toLocaleTimeString('en-us', {
			hour: 'numeric',
			minute: 'numeric',
			timeZone,
		});
		const currentHour = new Date().toLocaleTimeString('en-us', {
			hour12: false,
			hour: '2-digit',
			timeZone,
		});

		let greeting = 'Good morning,';
		if (currentHour > 12) {
			greeting = 'Good afternoon,';
		}
		if (currentHour > 17) {
			greeting = 'Good evening,';
		}

		setMessageToDisplay(
			template
				.replace('Greeting', greeting)
				.replace('FirstName', firstName)
				.replace('LastName', lastName)
				.replace('RoomNumber', roomNumber)
				.replace('Company', company)
				.replace('City', city)
				.replace('StartDate', startDate)
				.replace('StartTime', startTime)
				.replace('EndDate', endDate)
				.replace('EndTime', endTime)
		);
	}, [selectedCompany, selectedTemplate, selectedGuest, customTemplate]);

	return (
		<div className={classes.root}>
			<Grid
				container
				spacing={0}
				direction='row'
				alignItems='center'
				justifyContent='center'
			>
				<Grid item xs={6}>
					<Paper className={classes.formBody}>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<FormControl className={classes.formControl}>
									<Autocomplete
										value={selectedGuest}
										options={guestList}
										getOptionSelected={(option, value) =>
											option.id === value.id
										}
										getOptionLabel={(option) =>
											`${option.firstName} ${option.lastName}`
										}
										renderInput={(params) => (
											<TextField {...params} label='Guest' variant='outlined' />
										)}
										onChange={handleGuestChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl className={classes.formControl}>
									<Autocomplete
										value={selectedCompany}
										onChange={handleCompanyChange}
										getOptionSelected={(option, value) =>
											option.id === value.id
										}
										options={companyList}
										getOptionLabel={(option) => option.company}
										renderInput={(params) => (
											<TextField
												{...params}
												label='Company'
												variant='outlined'
											/>
										)}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<FormControl className={classes.formControl}>
									<Autocomplete
										disabled={!!customTemplate}
										value={selectedTemplate}
										onChange={handleTemplateChange}
										getOptionSelected={(option, value) =>
											option.id === value.id
										}
										options={templateList}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<TextField
												{...params}
												label='Template'
												variant='outlined'
											/>
										)}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl className={classes.formControl}>
									<Tooltip title='Accepted variables are FirstName, LastName, RoomNumber, Company, City, StartDate, StartTime, EndDate, or EndTime.'>
										<TextField
											value={customTemplate || ''}
											disabled={!!selectedTemplate}
											id='customTemplate'
											label='Custom Template'
											onChange={handleCustomTemplate}
										/>
									</Tooltip>
								</FormControl>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Button
									className={classes.button}
									variant='contained'
									color='primary'
									disabled={
										!selectedGuest || !selectedCompany || !selectedTemplate
									}
									onClick={handleCreateMessageClick}
								>
									Create Message
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button
									className={classes.button}
									variant='contained'
									color='primary'
									disabled={
										!customTemplate || !selectedGuest || !selectedCompany
									}
									onClick={handleCreateMessageClick}
								>
									Create Template
								</Button>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Button
									className={classes.clearButton}
									variant='contained'
									color='primary'
									disabled={
										(!selectedTemplate || !customTemplate) &&
										(!selectedGuest || !selectedCompany || !messageToDisplay)
									}
									onClick={handleClearButtonClick}
								>
									Clear all values
								</Button>
							</Grid>
						</Grid>
					</Paper>
					<div className={classes.message}>
						{messageToDisplay && (
							<Paper className={classes.messageBody}>
								<Typography>{messageToDisplay}</Typography>
							</Paper>
						)}
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default App;

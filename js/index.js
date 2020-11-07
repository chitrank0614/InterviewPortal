function initialize() {
	showLoader();
	let currentURL = window.location.href;
	currentURL = new URL(currentURL);
	let page = currentURL.searchParams.get('page');

	if (page == 'addDetails') switchToDetailsPanel();
	else if (page == 'interview') getAllInterviews();
	else getAllInterviews();
	hideLoader();
	alert('hello');
}

function showLoader() {
	document.getElementById('loaderDiv').style.display = 'block';
}

function hideLoader() {
	document.getElementById('loaderDiv').style.display = 'none';
}

function validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function test() {
	window.alert('Working');
}

function alert(message) {
	document.getElementById('modal-body').innerHTML = message;
	document.getElementById('main-modal').style.display = 'block';
}
function alertClose() {
	document.getElementById('main-modal').style.display = 'none';
}

async function getAllInterviews() {
	showLoader();
	let response = await makeAsyncGetRequest('getAllInterviews');
	// console.log(response);
	let interviewData = response['result']['Data'];

	let interviewDivTemplate = document.getElementById('InterviewDivTemplate')
		.innerHTML;
	let interviewPillTemplate = document.getElementById('InterviewPillTemplate')
		.innerHTML;

	// console.log(interviewData);
	let replacedHTML = '';
	for (i in interviewData) {
		let modifiedHTML = interviewPillTemplate;
		modifiedHTML = modifiedHTML.replace(
			'{{interviewID}}',
			interviewData[i]['interview_id']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{interviewerEmail}}',
			interviewData[i]['interviewer_email']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{intervieweeEmail}}',
			interviewData[i]['interviewee_email']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{scheduleDate}}',
			interviewData[i]['schedule_date']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{startTime}}',
			interviewData[i]['start_time']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{endTime}}',
			interviewData[i]['end_time']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{interviewID}}',
			interviewData[i]['interview_id']
		);
		modifiedHTML = modifiedHTML.replace(
			'{{interviewID}}',
			interviewData[i]['interview_id']
		);
		replacedHTML += modifiedHTML;
	}
	interviewDivTemplate = interviewDivTemplate.replace(
		'{{replaceInterviewBoxes}}',
		replacedHTML
	);

	document.getElementById('canvas').innerHTML = interviewDivTemplate;
	hideLoader();
}

function switchToHome() {
	getAllInterviews();
}

function switchToDetailsPanel() {
	showLoader();
	let interviewAddTemplate = document.getElementById('InterviewAddTemplate')
		.innerHTML;
	interviewAddTemplate = interviewAddTemplate.replace(
		'{{functionCall}}',
		'addInterview()'
	);
	interviewAddTemplate = interviewAddTemplate.replace(
		'{{headline}}',
		'Please fill the details asked. All details are required'
	);

	document.getElementById('canvas').innerHTML = interviewAddTemplate;
	hideLoader();
}

async function addInterview() {
	showLoader();
	let interviewData = {
		interviewer_email: document.getElementById('interviewer_email').value,
		interviewer_first_name: document.getElementById('interviewer_first_name')
			.value,
		interviewer_last_name: document.getElementById('interviewer_last_name')
			.value,
		interviewer_phone_no: document.getElementById('interviewer_phone_no').value,
		interviewee_email: document.getElementById('interviewee_email').value,
		interviewee_first_name: document.getElementById('interviewee_first_name')
			.value,
		interviewee_last_name: document.getElementById('interviewee_last_name')
			.value,
		interviewee_phone_no: document.getElementById('interviewee_phone_no').value,
		interviewee_resume_link: document.getElementById('interviewee_resume_link')
			.value,
		schedule_date: String(document.getElementById('schedule_date').value),
		start_time: String(document.getElementById('start_time').value + ':00'),
		end_time: String(document.getElementById('end_time').value + ':00'),
	};

	response = await makeAsyncPostRequest('setInterview', interviewData);
	hideLoader();
	alert(response['result']['Message']);
}

async function editInterview(interview_id) {
	showLoader();
	let response = await makeAsyncGetRequest(
		'getCompleteInterviewDetails/' + interview_id
	);
	if (response['result']['Code'] != 1000) {
		hideLoader();
		alert(response['result']['Message']);
		return;
	}
	let interviewData = response['result']['Data'];
	let interviewAddTemplate = document.getElementById('InterviewAddTemplate')
		.innerHTML;
	interviewAddTemplate = interviewAddTemplate.replace(
		'{{functionCall}}',
		'updateInterview(' + interviewData['interview_id'] + ')'
	);
	interviewAddTemplate = interviewAddTemplate.replace(
		'{{headline}}',
		'Editing Interview ' +
			interviewData['interview_id'] +
			'. Please fill the details asked. All details are required'
	);
	document.getElementById('canvas').innerHTML = interviewAddTemplate;

	// console.log(interviewData);
	document.getElementById('interviewer_first_name').value =
		interviewData['interviewer_first_name'];
	document.getElementById('interviewer_last_name').value =
		interviewData['interviewer_last_name'];
	document.getElementById('interviewer_email').value =
		interviewData['interviewer_email'];
	document.getElementById('interviewer_phone_no').value =
		interviewData['interviewer_phone_no'];
	document.getElementById('interviewee_first_name').value =
		interviewData['interviewee_first_name'];
	document.getElementById('interviewee_last_name').value =
		interviewData['interviewee_last_name'];
	document.getElementById('interviewee_email').value =
		interviewData['interviewee_email'];
	document.getElementById('interviewee_phone_no').value =
		interviewData['interviewee_phone_no'];
	document.getElementById('schedule_date').value =
		interviewData['schedule_date'];
	document.getElementById('start_time').value = interviewData['start_time'];
	document.getElementById('end_time').value = interviewData['end_time'];
	hideLoader();
}

async function updateInterview(interview_id) {
	showLoader();
	let response = await makeAsyncGetRequest(
		'getCompleteInterviewDetails/' + interview_id
	);
	interviewData = {
		interview_id: interview_id,
		old_data: response['result']['Data'],
		new_data: {
			interviewer_email: document.getElementById('interviewer_email').value,
			interviewer_first_name: document.getElementById('interviewer_first_name')
				.value,
			interviewer_last_name: document.getElementById('interviewer_last_name')
				.value,
			interviewer_phone_no: document.getElementById('interviewer_phone_no')
				.value,
			interviewee_email: document.getElementById('interviewee_email').value,
			interviewee_first_name: document.getElementById('interviewee_first_name')
				.value,
			interviewee_last_name: document.getElementById('interviewee_last_name')
				.value,
			interviewee_phone_no: document.getElementById('interviewee_phone_no')
				.value,
			interviewee_resume_link: document.getElementById(
				'interviewee_resume_link'
			).value,
			schedule_date: String(document.getElementById('schedule_date').value),
			start_time: String(document.getElementById('start_time').value),
			end_time: String(document.getElementById('end_time').value),
		},
	};
	// console.log(interviewData);
	response = await makeAsyncPostRequest('updateInterview', interviewData);
	// console.log(response);
	hideLoader();
	alert(response['result']['Message']);
}

async function deleteInterview(interview_id) {
	showLoader();
	response = await makeAsyncGetRequest('deleteInterview/' + interview_id);
	hideLoader();
	alert(response['result']['Message']);
	getAllInterviews();
}

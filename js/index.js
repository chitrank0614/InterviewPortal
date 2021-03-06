// Initializing the basic conditions for the website
function initialize() {
	showLoader();
	let currentURL = window.location.href;
	currentURL = new URL(currentURL);
	let page = currentURL.searchParams.get('page');

	if (page == 'addDetails') switchToDetailsPanel();
	else if (page == 'updateDetails') {
		let interview_id = currentURL.searchParams.get('id');
		editInterview(interview_id);
	} else if (page == 'interview') getAllInterviews();
	else getAllInterviews();
	hideLoader();
}

// Toggling the loader funtion.
function showLoader() {
	document.getElementById('loaderDiv').style.display = 'block';
}

function hideLoader() {
	document.getElementById('loaderDiv').style.display = 'none';
}

// Validating the email.
function validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function test() {
	window.alert('Working');
}

// Raising modal alert when required
function alert(message) {
	document.getElementById('modal-body').innerHTML = message;
	document.getElementById('main-modal').style.display = 'block';
}
function alertClose() {
	document.getElementById('main-modal').style.display = 'none';
}

// Getting all the interviews available in the database for displaying them on the frontend.
async function getAllInterviews() {
	showLoader();
	let response = await makeAsyncGetRequest('getAllInterviews');
	// console.log(response);
	let interviewData = response['result']['Data'];

	// Obtaining the template to insert into the HTML.
	let interviewDivTemplate = document.getElementById('InterviewDivTemplate')
		.innerHTML;
	let interviewPillTemplate = document.getElementById('InterviewPillTemplate')
		.innerHTML;

	// console.log(interviewData);
	// Replacing the checkpoints in the HTML template with the particular data aboutthe interview.
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
			'{{intervieweeResumeLink}}',
			interviewData[i]['interviewee_resume_link']
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

	// Inserting the template into the webpage.
	document.getElementById('canvas').innerHTML = interviewDivTemplate;
	hideLoader();
}

function switchToHome() {
	getAllInterviews();
}

async function getAllInterviewers() {
	let response = await makeAsyncGetRequest('getAllInterviewers');
	// console.log(response['result']);
	interviewersData = response['result'];
	let selectDiv = document.getElementById('interviewers_list');
	if (interviewersData['Code'] == 1000) {
		let divText =
			"<select class='form-control' onchange='autoFillInterviewer(this)'> <option></option>";
		for (let x in interviewersData['Data']) {
			divText +=
				'<option value=' +
				interviewersData['Data'][x].interviewer_email +
				'>' +
				interviewersData['Data'][x].interviewer_email +
				'</option>';
		}
		divText += '</select>';
		selectDiv.innerHTML = divText;
	} else {
		selectDiv.innerHTML = 'No existing interviewers';
	}
}

function autoFillInterviewer(selectObject) {
	let interviewerEmail = selectObject.value;

	for (let x in interviewersData['Data'])
		if (interviewersData['Data'][x].interviewer_email == interviewerEmail) {
			document.getElementById('interviewer_first_name').value =
				interviewersData['Data'][x].interviewer_first_name;
			document.getElementById('interviewer_last_name').value =
				interviewersData['Data'][x].interviewer_last_name;
			document.getElementById('interviewer_email').value =
				interviewersData['Data'][x].interviewer_email;
			document.getElementById('interviewer_phone_no').value =
				interviewersData['Data'][x].interviewer_phone_no;
		}
}

async function getAllInterviewees() {
	let response = await makeAsyncGetRequest('getAllInterviewees');
	// console.log(response['result']);
	intervieweesData = response['result'];
	let selectDiv = document.getElementById('interviewees_list');
	if (intervieweesData['Code'] == 1000) {
		let divText =
			"<select class='form-control' onchange='autoFillInterviewee(this)'> <option></option>";
		for (let x in intervieweesData['Data']) {
			divText +=
				'<option value=' +
				intervieweesData['Data'][x].interviewee_email +
				'>' +
				intervieweesData['Data'][x].interviewee_email +
				'</option>';
		}
		divText += '</select>';
		selectDiv.innerHTML = divText;
	} else {
		selectDiv.innerHTML = 'No existing interviewees';
	}
}

function autoFillInterviewee(selectObject) {
	let intervieweeEmail = selectObject.value;
	for (let x in intervieweesData['Data'])
		if (intervieweesData['Data'][x].interviewee_email == intervieweeEmail) {
			document.getElementById('interviewee_first_name').value =
				intervieweesData['Data'][x].interviewee_first_name;
			document.getElementById('interviewee_last_name').value =
				intervieweesData['Data'][x].interviewee_last_name;
			document.getElementById('interviewee_email').value =
				intervieweesData['Data'][x].interviewee_email;
			document.getElementById('interviewee_phone_no').value =
				intervieweesData['Data'][x].interviewee_phone_no;
			let fileName = intervieweesData['Data'][x].interviewee_resume_link;
			fileName = fileName.split('/');
			fileName = fileName[fileName.length - 1];
			document.getElementById('interviewee_resume_link').innerHTML =
				fileName +
				'<a href="' +
				intervieweesData['Data'][x].interviewee_resume_link +
				'"> &nbsp&nbsp Link</a>';
		}
}

async function switchToDetailsPanel() {
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
	await getAllInterviewers();
	await getAllInterviewees();
	hideLoader();
}

// Collecting data from the form and sending a POST request to insert it into the database.
async function addInterview() {
	showLoader();

	const form = new FormData();
	form.append(
		'interviewer_email',
		document.getElementById('interviewer_email').value
	);
	form.append(
		'interviewer_first_name',
		document.getElementById('interviewer_first_name').value
	);
	form.append(
		'interviewer_last_name',
		document.getElementById('interviewer_last_name').value
	);
	form.append(
		'interviewer_phone_no',
		document.getElementById('interviewer_phone_no').value
	);
	form.append(
		'interviewee_email',
		document.getElementById('interviewee_email').value
	);
	form.append(
		'interviewee_first_name',
		document.getElementById('interviewee_first_name').value
	);
	form.append(
		'interviewee_last_name',
		document.getElementById('interviewee_last_name').value
	);
	form.append(
		'interviewee_phone_no',
		document.getElementById('interviewee_phone_no').value
	);

	var file = document.getElementById('interviewee_resume').files[0];
	if (file) {
		var reader = new FileReader();
		reader.onload = function () {
			blob = window.dataURLtoBlob(reader.result);
		};
		reader.readAsDataURL(file);
		fileName = document.getElementById('interviewee_resume').value.split('\\');
		fileName = fileName[fileName.length - 1];

		form.append('interviewee_resume', file, fileName);
	} else form.append('interviewee_resume', '');
	form.append(
		'schedule_date',
		String(document.getElementById('schedule_date').value)
	);
	form.append(
		'start_time',
		String(document.getElementById('start_time').value + ':00')
	);
	form.append(
		'end_time',
		String(document.getElementById('end_time').value + ':00')
	);

	// checking for data not to be null or undefined or empty
	for (var pair of form.entries()) {
		if (pair[0] != 'interviewee_resume' && !pair[1]) {
			hideLoader();
			alert('Some fields are either empty or have invalid values.');
			return;
		}
		// console.log(pair[0] + ', ' + pair[1]);
	}

	response = await makeAsyncPostMultiPartRequest('setInterview', form);
	getAllInterviewers();
	getAllInterviewees();
	hideLoader();
	alert(response['result']['Message']);
}

//retriving data from the server and filling in the form so that it can be editted.
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

	// Obtaining template to fill in the data in the checkpoints and insert into the HTML page.
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
	let fileName = interviewData['interviewee_resume_link'];
	fileName = fileName.split('/');
	fileName = fileName[fileName.length - 1];
	document.getElementById('interviewee_resume_link').innerHTML =
		fileName +
		'<a href="' +
		interviewData['interviewee_resume_link'] +
		'"> &nbsp&nbsp Link</a>';
	document.getElementById('schedule_date').value =
		interviewData['schedule_date'];
	document.getElementById('start_time').value = interviewData['start_time'];
	document.getElementById('end_time').value = interviewData['end_time'];

	await getAllInterviewers();
	await getAllInterviewees();

	hideLoader();
}

// Obtaining the data from the page and sending it to the server via POST request to that it can be updated.
async function updateInterview(interview_id) {
	showLoader();
	let response = await makeAsyncGetRequest(
		'getCompleteInterviewDetails/' + interview_id
	);

	const form = new FormData();
	form.append('interview_id', interview_id);
	form.append(
		'new_interviewer_email',
		document.getElementById('interviewer_email').value
	);
	form.append(
		'new_interviewer_first_name',
		document.getElementById('interviewer_first_name').value
	);
	form.append(
		'new_interviewer_last_name',
		document.getElementById('interviewer_last_name').value
	);
	form.append(
		'new_interviewer_phone_no',
		document.getElementById('interviewer_phone_no').value
	);
	form.append(
		'new_interviewee_email',
		document.getElementById('interviewee_email').value
	);
	form.append(
		'new_interviewee_first_name',
		document.getElementById('interviewee_first_name').value
	);
	form.append(
		'new_interviewee_last_name',
		document.getElementById('interviewee_last_name').value
	);
	form.append(
		'new_interviewee_phone_no',
		document.getElementById('interviewee_phone_no').value
	);

	var file = document.getElementById('interviewee_resume').files[0];
	if (file) {
		var reader = new FileReader();
		reader.onload = function () {
			blob = window.dataURLtoBlob(reader.result);
		};
		reader.readAsDataURL(file);
		fileName = document.getElementById('interviewee_resume').value.split('\\');
		fileName = fileName[fileName.length - 1];
		form.append('interviewee_resume', file, fileName);
	} else form.append('interviewee_resume', '');

	form.append(
		'new_schedule_date',
		String(document.getElementById('schedule_date').value)
	);
	form.append(
		'new_start_time',
		String(document.getElementById('start_time').value)
	);
	form.append(
		'new_end_time',
		String(document.getElementById('end_time').value)
	);
	form.append(
		'old_interviewer_email',
		response['result']['Data']['interviewer_email']
	);
	form.append(
		'old_interviewer_first_name',
		response['result']['Data']['interviewer_first_name']
	);
	form.append(
		'old_interviewer_last_name',
		response['result']['Data']['interviewer_last_name']
	);
	form.append(
		'old_interviewer_phone_no',
		response['result']['Data']['interviewer_phone_no']
	);
	form.append(
		'old_interviewee_email',
		response['result']['Data']['interviewee_email']
	);
	form.append(
		'old_interviewee_first_name',
		response['result']['Data']['interviewee_first_name']
	);
	form.append(
		'old_interviewee_last_name',
		response['result']['Data']['interviewee_last_name']
	);
	form.append(
		'old_interviewee_phone_no',
		response['result']['Data']['interviewee_phone_no']
	);

	form.append(
		'old_interviewee_resume_link',
		response['result']['Data']['interviewee_resume_link']
	);
	form.append('old_schedule_date', response['result']['Data']['schedule_date']);
	form.append('old_start_time', response['result']['Data']['start_time']);
	form.append('old_end_time', response['result']['Data']['end_time']);

	// checking for data not to be null or undefined or empty
	for (var pair of form.entries()) {
		if (pair[0] != 'interviewee_resume' && !pair[1]) {
			hideLoader();
			alert('Some fields are either empty or have invalid values.');
			return;
		}
		// console.log(pair[0] + ', ' + pair[1]);
	}

	// console.log(interviewData);
	response = await makeAsyncPostMultiPartRequest('updateInterview', form);
	// console.log(response);
	hideLoader();
	alert(response['result']['Message']);
}

// methods for deleting a scheduled interview from the database.
async function deleteInterview(interview_id) {
	showLoader();
	response = await makeAsyncGetRequest('deleteInterview/' + interview_id);
	hideLoader();
	alert(response['result']['Message']);
	getAllInterviews();
}

// function post(path, params, method = 'post') {
// 	const form = document.createElement('form');
// 	form.method = method;
// 	form.action = path;

// 	for (const key in params) {
// 		if (params.hasOwnProperty(key)) {
// 			const hiddenField = document.createElement('input');
// 			hiddenField.type = 'hidden';
// 			hiddenField.name = key;
// 			hiddenField.value = params[key];
// 			form.appendChild(hiddenField);
// 		}
// 	}

// 	document.body.appendChild(form);
// 	form.submit();
// }

// function convertPDFtoBlob(inputId) {
// 	var file = document.getElementById(inputId).files[0];
// 	var reader = new FileReader();
// 	reader.onload = function () {
// 		// console.log(reader.result);
// 		blob = window.dataURLtoBlob(reader.result);
// 		// console.log(
// 		// 	blob,
// 		// 	new File([blob], 'resume.pdf', {
// 		// 		type: 'application/pdf',
// 		// 	})
// 		// );
// 	};
// 	reader.readAsDataURL(file);
// 	return file;
// }

// async function test() {
// 	id = 2;
// 	let fileBlob = convertPDFtoBlob('testFile');
// 	const form = new FormData();
// 	form.append('docfile', fileBlob, 'resume222.pdf');
// 	form.append('rid', id);
// 	response = await makeAsyncPostMultiPartRequest('test', form);
// 	console.log(response);
// }

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from manager.models import Interview, Interviewees, Interviewers
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from string import Template
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
import random
import smtplib
import ssl

# Create your views here.


# Function to send email to the mentioned recipient.
def sendEmail(to, subject, body):
    s = smtplib.SMTP(host='smtp.gmail.com', port=587)
    s.starttls()
    serveremail = 'chitrankmishraallinone@gmail.com'  # Your email
    serverpassword = 'chitrank0614'  # Your email password
    s.login(serveremail, serverpassword)

    msg = MIMEMultipart()
    msg['From'] = serveremail
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    s.sendmail(serveremail,
               to, msg.as_string())
    del msg
    s.quit()


# Email utility function
def sendEmailUtil(to, schedule_date, start_time, end_time):

    subject = "Interview With IB Academy."
    body = """
Dear recipient,

You have an interview scheduled with InterviewBit Academy. The details for the particular are mentioned below.
Date: %s
Start Time: %s
End Time: %s

Meeting details will be shared later.

All the best.
IB Academy.
    """ % (schedule_date.date(), start_time, end_time)

    sendEmail(to, subject, body)
    output = 'Sent'
    return output


# Converting string into time format
def getIntoTimeFormat(time):
    return datetime.strptime(time, "%H:%M:%S").time()


# Converting string into date format
def getIntoDateFormat(date):
    return datetime.strptime(date, "%Y-%m-%d")


#  Checking if the interviewer already exists in the database.
def doesInterviewerExist(email):
    instance = Interviewers.objects.filter(email=email)
    if instance:
        return True
    return False


#  Checking if the interviewee already exists in the database.
def doesIntervieweeExist(email):
    instance = Interviewees.objects.filter(email=email)
    if instance:
        return True
    return False


# Adding an instance of the schema into the database Interview
def addInterview(interviewer_email, interviewee_email, schedule_date, start_time, end_time):
    instance = Interview(interviewerEmail=interviewer_email, intervieweeEmail=interviewee_email,
                         scheduleDate=schedule_date, startTime=start_time, endTime=end_time)
    instance.save()


# Removing an instance of the schema from the database Interview
def removeInterview(id):
    Interview.objects.filter(id=id).delete()


# Adding an instance of the schema into the database Interviewer
def addInterviewer(first_name, last_name, email, phone_no):
    instance = Interviewers(firstName=first_name,
                            lastName=last_name, email=email, phoneNo=phone_no)
    instance.save()


# Removing an instance of the schema from the database Interviewer
def removeInterviewer(email):
    Interviewers.objects.filter(email=email).delete()


# Adding an instance of the schema into the database Interviewee
def addInterviewee(first_name, last_name, email, phone_no, resume_link):
    instance = Interviewees(firstName=first_name, lastName=last_name,
                            email=email, phoneNo=phone_no, resumeLink=resume_link)
    instance.save()


# Removing an instance of the schema from the database Interview
def removeInterviewee(email):
    Interviewees.objects.filter(email=email).delete()


# Deleting an instance of the schema from the database Interview
def deleteInterview(request, id):
    interview_data = Interview.objects.filter(id=id)

    instance = Interview.objects.filter(
        intervieweeEmail=interview_data[0].intervieweeEmail).exclude(id=id)
    if not instance:
        removeInterviewee(interview_data[0].intervieweeEmail)

    instance = Interview.objects.filter(
        interviewerEmail=interview_data[0].interviewerEmail).exclude(id=id)
    if not instance:
        removeInterviewer(interview_data[0].interviewerEmail)

    Interview.objects.filter(id=id).delete()
    return JsonResponse({'result': {'Code': 1000, 'Message': 'Interview Deleted', "Data": None}})


# Creating an interview with the data obtained from the webpage.
@csrf_exempt
def setInterview(request):
    if(request.method == "POST"):
        json_data = json.loads(str(request.body, encoding='utf-8'))
        interviewee_email = json_data['interviewee_email']
        interviewer_email = json_data['interviewer_email']
        schedule_date = getIntoDateFormat(json_data['schedule_date'])
        start_time = getIntoTimeFormat(json_data['start_time'])
        end_time = getIntoTimeFormat(json_data['end_time'])

        # Some possible errors
        if(interviewee_email == interviewer_email):
            return JsonResponse({'result': {'Code': 1004, 'Message': 'Emails are same', "Data": None}})

        if(start_time >= end_time):
            return JsonResponse({'result': {'Code': 1004, 'Message': 'Invalid time slots', "Data": None}})

        interviewee_exists = False
        if(doesIntervieweeExist(interviewee_email)):
            interviewee_exists = True

        interviewer_exists = False
        if(doesInterviewerExist(interviewer_email)):
            interviewer_exists = True

        # Obtaining the busy slots for both the parties to check for the available slot in the database.
        booked_time_slots = ""
        if interviewee_exists:
            booked_time_slots = Interview.objects.all().filter(
                intervieweeEmail=interviewee_email, scheduleDate=schedule_date)

        if booked_time_slots:
            for slot in booked_time_slots:
                booked_start_time = slot.startTime
                booked_end_time = slot.endTime
                if ((start_time >= booked_start_time and start_time < booked_end_time) or (end_time > booked_start_time and end_time <= booked_end_time) or (start_time <= booked_start_time and end_time >= booked_end_time)):
                    return JsonResponse({'result': {'Code': 1004, 'Message': 'Time slot not available, %s is busy from %s to %s' % (slot.intervieweeEmail, slot.startTime, slot.endTime), "Data": None}})

        if interviewer_exists:
            booked_time_slots = Interview.objects.all().filter(
                interviewerEmail=interviewer_email, scheduleDate=schedule_date)

        if booked_time_slots:
            for slot in booked_time_slots:
                booked_start_time = slot.startTime
                booked_end_time = slot.endTime
                if ((start_time >= booked_start_time and start_time < booked_end_time) or (end_time > booked_start_time and end_time <= booked_end_time) or (start_time <= booked_start_time and end_time >= booked_end_time)):
                    return JsonResponse({'result': {'Code': 1004, 'Message': 'Time slot not available, %s is busy from %s to %s' % (slot.interviewerEmail, slot.startTime, slot.endTime), "Data": None}})

        # Creating an instance of the interviewee if it doesn't exists in the database.
        if not interviewee_exists:
            interviewee_first_name = json_data['interviewee_first_name']
            interviewee_last_name = json_data['interviewee_last_name']
            interviewee_phone_no = json_data['interviewee_phone_no']
            interviewee_resume_link = json_data['interviewee_resume_link']
            addInterviewee(interviewee_first_name, interviewee_last_name,
                           interviewee_email, interviewee_phone_no, interviewee_resume_link)

        # Creating an instance of the interviewer if it doesn't exists in the database.
        if not interviewer_exists:
            interviewer_first_name = json_data['interviewer_first_name']
            interviewer_last_name = json_data['interviewer_last_name']
            interviewer_phone_no = json_data['interviewer_phone_no']
            addInterviewer(interviewer_first_name, interviewer_last_name,
                           interviewer_email, interviewer_phone_no)

        # Creating an instance of the interview in the database.
        addInterview(interviewer_email, interviewee_email,
                     schedule_date, start_time, end_time)

        # Sending an interview after scheduling an interview.
        sendEmailUtil(interviewee_email, schedule_date, start_time, end_time)
        sendEmailUtil(interviewer_email, schedule_date, start_time, end_time)
        return JsonResponse({'result': {'Code': 1000, 'Message': 'Interview Added', "Data": None}})
    return JsonResponse({'result': {'Code': 1004, 'Message': 'Wrong Method', "Data": None}})


# Method to return the details about all the interviews scheduled.
def getAllInterviews(request):
    instance = Interview.objects.all()
    if instance:
        data_rows = []
        for i in instance:
            row = {}
            row['interview_id'] = i.id
            row['interviewee_email'] = i.intervieweeEmail
            row['interviewer_email'] = i.interviewerEmail
            row['schedule_date'] = i.scheduleDate
            row['start_time'] = i.startTime
            row['end_time'] = i.endTime
            data_rows.append(row)
        return JsonResponse({'result': {'Code': 1000, "Message": "Interviews Found", "Data": data_rows}})
    return JsonResponse({'result': {'Code': 1004, "Message": "Interviews Not Found", "Data": None}})


# Method to return the details about all the interviewees.
def getAllInterviewees(request):
    instance = Interviewees.objects.all()
    if instance:
        data_rows = []
        for i in instance:
            row = {}
            row['interviewee_first_name'] = i.firstName
            row['interviewee_last_name'] = i.lastName
            row['interviewee_email'] = i.email
            row['interviewee_phone_no'] = i.phoneNo
            row['interviewee_resume_link'] = i.resumeLink
            data_rows.append(row)
        return JsonResponse({'result': {'Code': 1000, "Message": "Interviewees Found", "Data": data_rows}})
    return JsonResponse({'result': {'Code': 1004, "Message": "Interviewees Not Found", "Data": None}})


# Method to return the details about all the interviewers.
def getAllInterviewers(request):
    instance = Interviewers.objects.all()
    if instance:
        data_rows = []
        for i in instance:
            row = {}
            row['interviewer_first_name'] = i.firstName
            row['interviewer_last_name'] = i.lastName
            row['interviewer_email'] = i.email
            row['interviewer_phone_no'] = i.phoneNo
            data_rows.append(row)
        return JsonResponse({'result': {'Code': 1000, "Message": "Interviewers Found", "Data": data_rows}})
    return JsonResponse({'result': {'Code': 1004, "Message": "Interviewees Not Found", "Data": None}})

# Method to return the complete details about a particular interview.


def getCompleteInterviewDetails(request, id):
    instance = Interview.objects.filter(id=id)
    if instance:
        row = {}
        row['interview_id'] = instance[0].id
        row['interviewee_email'] = instance[0].intervieweeEmail
        row['interviewer_email'] = instance[0].interviewerEmail
        row['schedule_date'] = instance[0].scheduleDate
        row['start_time'] = instance[0].startTime
        row['end_time'] = instance[0].endTime

        instance_2 = Interviewees.objects.filter(
            email=instance[0].intervieweeEmail)
        row['interviewee_first_name'] = instance_2[0].firstName
        row['interviewee_last_name'] = instance_2[0].lastName
        row['interviewee_phone_no'] = instance_2[0].phoneNo
        row['interviewee_resume_link'] = instance_2[0].resumeLink

        instance_3 = Interviewers.objects.filter(
            email=instance[0].interviewerEmail)
        row['interviewer_first_name'] = instance_3[0].firstName
        row['interviewer_last_name'] = instance_3[0].lastName
        row['interviewer_phone_no'] = instance_3[0].phoneNo

        return JsonResponse({'result': {'Code': 1000, 'Message': "Interview found", 'Data': row}})
    return JsonResponse({'result': {'Code': 1004, 'Message': "Interview doesn't exist"}})


# Method to update the interview details based on the data recieved from the webpage.
@csrf_exempt
def updateInterview(request):
    if(request.method == "POST"):
        json_data = json.loads(str(request.body, encoding='utf-8'))
        interview_id = json_data['interview_id']
        old_data = json_data['old_data']
        new_data = json_data['new_data']

        # Formating the date and time data.
        old_data['schedule_date'] = getIntoDateFormat(
            old_data['schedule_date'])
        old_data['start_time'] = getIntoTimeFormat(old_data['start_time'])
        old_data['end_time'] = getIntoTimeFormat(old_data['end_time'])

        new_data['schedule_date'] = getIntoDateFormat(
            new_data['schedule_date'])
        new_data['start_time'] = getIntoTimeFormat(new_data['start_time'])
        new_data['end_time'] = getIntoTimeFormat(new_data['end_time'])

        # Checking for basic errors.
        if(new_data['interviewee_email'] == new_data['interviewer_email']):
            return JsonResponse({'result': {'Code': 1004, 'Message': 'Emails are same', "Data": None}})

        if(new_data['start_time'] >= new_data['end_time']):
            return JsonResponse({'result': {'Code': 1004, 'Message': 'Invalid time slots', "Data": None}})

        interviewee_exists = False
        if(doesIntervieweeExist(new_data['interviewee_email'])):
            interviewee_exists = True

        interviewer_exists = False
        if(doesInterviewerExist(new_data['interviewer_email'])):
            interviewer_exists = True

        # Checking for the available time slots for both the parties to schedule an interview.
        booked_time_slots = ""
        if interviewee_exists:
            booked_time_slots = Interview.objects.all().filter(
                intervieweeEmail=new_data['interviewee_email'], scheduleDate=new_data['schedule_date']).exclude(id=interview_id)

        if booked_time_slots:
            for slot in booked_time_slots:
                booked_start_time = slot.startTime
                booked_end_time = slot.endTime
                if ((new_data['start_time'] >= booked_start_time and new_data['start_time'] < booked_end_time) or (new_data['end_time'] > booked_start_time and new_data['end_time'] <= booked_end_time) or (new_data['start_time'] <= booked_start_time and new_data['end_time'] >= booked_end_time)):
                    return JsonResponse({'result': {'Code': 1004, 'Message': 'Time slot not available, %s is busy from %s to %s' % (slot.intervieweeEmail, slot.startTime, slot.endTime), "Data": None}})

        if interviewer_exists:
            booked_time_slots = Interview.objects.all().filter(
                interviewerEmail=new_data['interviewer_email'], scheduleDate=new_data['schedule_date']).exclude(id=interview_id)

        if booked_time_slots:
            for slot in booked_time_slots:
                booked_start_time = slot.startTime
                booked_end_time = slot.endTime
                if ((new_data['start_time'] >= booked_start_time and new_data['start_time'] < booked_end_time) or (new_data['end_time'] > booked_start_time and new_data['end_time'] <= booked_end_time) or (new_data['start_time'] <= booked_start_time and new_data['end_time'] >= booked_end_time)):
                    return JsonResponse({'result': {'Code': 1004, 'Message': 'Time slot not available, %s is busy from %s to %s' % (slot.interviewerEmail, slot.startTime, slot.endTime), "Data": None}})

        # Remove Interviewee if they no longer have any interview scheduled.
        if(old_data['interviewee_email'] == new_data['interviewee_email']):
            Interviewees.objects.filter(pk=old_data['interviewee_email']).update(
                firstName=new_data['interviewee_first_name'], lastName=new_data['interviewee_last_name'], phoneNo=new_data['interviewee_phone_no'], resumeLink=new_data['interviewee_resume_link'])
        else:
            addInterviewee(new_data['interviewee_first_name'], new_data['interviewee_last_name'],
                           new_data['interviewee_email'], new_data['interviewee_phone_no'], new_data['interviewee_resume_link'])

            instance = Interview.objects.filter(
                intervieweeEmail=old_data['interviewee_email']).exclude(id=interview_id)
            if not instance:
                removeInterviewee(old_data['interviewee_email'])

        # Remove Interviewer if they no longer have any interview scheduled.
        if(old_data['interviewer_email'] == new_data['interviewer_email']):
            Interviewers.objects.filter(pk=old_data['interviewer_email']).update(
                firstName=new_data['interviewer_first_name'], lastName=new_data['interviewer_last_name'], phoneNo=new_data['interviewer_phone_no'])
        else:
            addInterviewer(new_data['interviewer_first_name'], new_data['interviewer_last_name'],
                           new_data['interviewer_email'], new_data['interviewer_phone_no'])

            instance = Interview.objects.filter(
                interviewerEmail=old_data['interviewer_email']).exclude(id=interview_id)
            if not instance:
                removeInterviewer(old_data['interviewer_email'])

        removeInterview(interview_id)

        # Adding a new instance of interview into the database.
        addInterview(new_data['interviewer_email'], new_data['interviewee_email'],
                     new_data['schedule_date'], new_data['start_time'], new_data['end_time'])

        # Sending an email with the new details for the interview.
        sendEmailUtil(new_data['interviewee_email'], new_data['schedule_date'],
                      new_data['start_time'], new_data['end_time'])
        sendEmailUtil(new_data['interviewer_email'], new_data['schedule_date'],
                      new_data['start_time'], new_data['end_time'])

        return JsonResponse({'result': {'Code': 1000, 'Message': 'Interview Updated', "Data": None}})
    return JsonResponse({'result': {'Code': 1004, 'Message': 'Wrong Method', "Data": None}})


# Random debug functions.
def home(request):
    return HttpResponse("Hello World")


def test2(request):
    json_data = json.loads(str(request.body, encoding='utf-8'))
    print(json_data['data'])


@csrf_exempt
def test(request):
    test2(request)


def jsonData(request):
    d = {'Name': 'John', 'Age': 30}
    print(json.dumps)
    return HttpResponse(json.dumps(d))

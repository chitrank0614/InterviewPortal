from django.db import models

# Create your models here.


class Interview(models.Model):
    interviewerEmail = models.CharField(max_length=200)
    intervieweeEmail = models.CharField(max_length=200)
    scheduleDate = models.DateField()
    startTime = models.TimeField()
    endTime = models.TimeField()

    def __str__(self):
        # instance = {}
        # instance['interviewerEmail'] = self.interviewerEmail
        # instance['intervieweeEmail'] = self.intervieweeEmail
        # instance['scheduleDate'] = self.scheduleDate
        # instance['startTime'] = self.startTime
        # instance['endTime'] = self.endTime
        # return instance
        return "{%s , %s , %s , %s , %s }" % (self.intervieweeEmail, self.interviewerEmail, self.scheduleDate, self.startTime, self.endTime)


class Interviewers(models.Model):
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)
    email = models.CharField(max_length=200, primary_key=True)
    phoneNo = models.CharField(max_length=200)

    def __str__(self):
        return "{%s , %s , %s , %s}" % (self.firstName, self.lastName, self.email, self.phoneNo)


class Interviewees(models.Model):
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)
    email = models.CharField(max_length=200, primary_key=True)
    phoneNo = models.CharField(max_length=200)
    resumeLink = models.CharField(max_length=1000)

    def __str__(self):
        return "{%s , %s , %s , %s , %s}" % (self.firstName, self.lastName, self.email, self.phoneNo, self.resumeLink)


class Test(models.Model):
    resume = models.FileField(upload_to='documents/%Y/%m/%d')

    def __str__(self):
        return "{%s}" % self.resume


class Test2(models.Model):
    rid = models.CharField(max_length=200)
    resume = models.FileField(upload_to='documents/%Y/%m/%d')

    def __str__(self):
        return "{%s %s}" % (self.rid, self.resume)


class Resumes(models.Model):
    intervieweeEmail = models.CharField(max_length=200)
    intervieweeResume = models.FileField(upload_to='documents/%Y/%m/%d')

    def __str__(self):
        return "{%s %s}" % (self.intervieweeEmail, self.intervieweeResume.path)

# Generated by Django 3.1.3 on 2020-11-09 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0002_interviewees_interviewers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interviewees',
            name='resumeLink',
            field=models.FileField(upload_to='documents/%Y/%m/%d'),
        ),
    ]

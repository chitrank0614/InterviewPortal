from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('test', views.test, name='test'),
    path('jsonData', views.jsonData, name='jsonData'),
    path('setInterview', views.setInterview, name='setInterview'),
    path('updateInterview', views.updateInterview, name='updateInterview'),
    path('deleteInterview/<int:id>', views.deleteInterview, name='deleteInterview'),
    path('getCompleteInterviewDetails/<int:id>', views.getCompleteInterviewDetails,
         name='getCompleteInterviewDetails'),
    path('getAllInterviews', views.getAllInterviews, name='getAllInterviews'),
    path('getAllInterviewers', views.getAllInterviewers, name='getAllInterviewers'),
    path('getAllInterviewees', views.getAllInterviewees, name='getAllInterviewees'),
    # path('<int:id>', views.index, name='index'),

]

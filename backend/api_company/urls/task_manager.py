from django.urls import re_path
from api_company.endpoint import task_manager

urlpatterns = [
    re_path(r'task-list/get', task_manager.TaskListView.as_view()),
    re_path(r'task-list/create', task_manager.TaskListView.as_view()),
    re_path(r'task-list/(?P<pk>\d+)/delete', task_manager.DeleteTaskListView.as_view()),
    re_path(r'task-list/overdue$', task_manager.GetOverDueTaskListView.as_view()),
    re_path(r'task/get', task_manager.TaskView.as_view()),
    re_path(r'task/no-due-overdue$', task_manager.GetNoDueOverDueTaskView.as_view()),
    re_path(r'task/create', task_manager.TaskView.as_view()),
    re_path(r'task/(?P<pk>\d+)/edit', task_manager.UpdateTaskView.as_view()),
    re_path(r'task/(?P<pk>\d+)/delete', task_manager.DeleteTaskView.as_view()),
]

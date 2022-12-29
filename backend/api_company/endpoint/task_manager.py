from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from api_company.models import TaskList, Task
from api_company.serializers import TaskListSerializer, TaskSerializer
from api_company import filters
from django.db.models import Q
from datetime import datetime, timedelta


class TaskListView(generics.ListCreateAPIView):
    serializer_class = TaskListSerializer

    def get_queryset(self):
        if 'user' in self.request.query_params and self.request.query_params['user']:
            user_id = self.request.query_params['user']
            task_lists = TaskList.objects.filter(user_id=user_id)
        else:
            task_lists = TaskList.objects.filter(user_id=self.request.user.id)

        if not task_lists.count():
            TaskList.objects.create(name='General tasks', user_id=self.request.user.id)
            task_lists = TaskList.objects.filter(user_id=self.request.user.id)
        return task_lists

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)


class DeleteTaskListView(generics.DestroyAPIView):
    serializer_class = TaskListSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = TaskList.objects.filter(pk=pk)
        return query


class GetNoDueOverDueTaskView(APIView):

    def post(self, request):
        time_now = datetime.now()
        from_time = time_now - timedelta(days=1)
        no_due_date_tasks = Task.objects.filter(due_date=None, user_id=self.request.user.id) \
            .filter(Q(completed=False) | Q(completed=True, completed_at__range=(from_time, time_now))).all()
        no_due_date_tasks_serializer = TaskSerializer(no_due_date_tasks, many=True)
        today = self.request.data['today']
        over_due_tasks = Task.objects.exclude(due_date=None) \
            .filter(due_date__lt=today, user_id=self.request.user.id) \
            .filter(Q(completed=False) | Q(completed=True, completed_at__range=(from_time, time_now))).all()
        over_due_tasks_serializer = TaskSerializer(over_due_tasks, many=True)
        response = {
            'noDueDateTasks': no_due_date_tasks_serializer.data,
            'overDueDateTasks': over_due_tasks_serializer.data,
        }
        return Response(response)


class GetOverDueTaskListView(APIView):

    def post(self, request):
        time_now = datetime.now()
        from_time = time_now - timedelta(days=1)
        today = self.request.data['today']
        task_list = self.request.data['task_list']
        over_due_tasks = Task.objects.exclude(due_date=None) \
            .filter(task_list=task_list, due_date__lt=today, user_id=self.request.user.id) \
            .filter(Q(completed=False) | Q(completed=True, completed_at__range=(from_time, time_now))).all()
        over_due_tasks_serializer = TaskSerializer(over_due_tasks, many=True)

        no_due_tasks = Task.objects.filter(due_date=None, task_list=task_list, user_id=self.request.user.id).all()
        no_due_tasks_serializer = TaskSerializer(no_due_tasks, many=True)

        time_specific_tasks = Task.objects.filter(task_list=task_list, due_date__gte=today,
                                                  user_id=self.request.user.id).all()
        time_specific_tasks_serializer = TaskSerializer(time_specific_tasks, many=True)

        response = {
            'noDueDateTasks': no_due_tasks_serializer.data,
            'dueDateTasks': time_specific_tasks_serializer.data,
            'overDueTasks': over_due_tasks_serializer.data
        }

        return Response(response)


class TaskView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    filterset_fields = ['id', 'task_list', 'due_date', 'due_date_field']
    filter_class = filters.EmptyFilter

    def get_queryset(self):
        task_lists = Task.objects.filter(user_id=self.request.user.id).order_by('due_date')
        return task_lists

    def perform_create(self, serializer):
        if 'user' in self.request.query_params and self.request.query_params['user']:
            user_id = self.request.query_params['user']
        else:
            user_id = self.request.user.id
        serializer.save(user_id=user_id)


class UpdateTaskView(generics.UpdateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = Task.objects.filter(pk=pk)
        return query

    def perform_update(self, serializer):
        serializer.save(user_id=self.request.user.id)


class DeleteTaskView(generics.DestroyAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = Task.objects.filter(pk=pk)
        return query

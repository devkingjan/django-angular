from rest_framework import viewsets
from django.db.models import Q
from django.core.paginator import Paginator
from api_company.models import Project, ProjectTask, ProjectTaskComment, ProjectTaskEvent, ProjectHistory, \
    ProjectTaskHistory, Member
from api_company.serializers import ProjectSerializer, ProjectTaskSerializer, ProjectTaskCommentSerializer, \
    ProjectHistorySerializer, ProjectTaskHistorySerializer, ProjectTaskEventSerializer, ProjectTaskEventViewSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)
        serializer.context['user'] = self.request.user
        project_history = dict(serializer.data)
        del project_history['id']
        del project_history['member_list']
        del project_history['tasks']
        project_history['project'] = serializer.data['id']
        project_history_serializer = ProjectHistorySerializer(data=project_history)
        project_history_serializer.is_valid(raise_exception=True)
        project_history_serializer.save()
        ProjectTaskEvent.objects.create(
            comment='created new project',
            type=ProjectTaskEvent.TYPE_CREATE_PROJECT,
            user_id=self.request.user.id,
            first_name=self.request.user.first_name,
            last_name=self.request.user.last_name,
            project_id=serializer.data['id'],
            after_project_id=project_history_serializer.data['id']
        )

    def perform_update(self, serializer):
        origin_obj = self.get_object()
        data = self.request.data
        task_types = self.check_status(data, origin_obj)
        serializer.save()
        serializer.context['user'] = self.request.user
        project_history = dict(serializer.data)
        del project_history['id']
        del project_history['member_list']
        del project_history['tasks']
        project_history['project'] = serializer.data['id']
        before_project = ProjectHistory.objects.filter(project_id=serializer.data['id']).order_by('-id').first()

        project_history_serializer = ProjectHistorySerializer(data=project_history)
        project_history_serializer.is_valid(raise_exception=True)
        project_history_serializer.save()
        for _type in task_types:
            ProjectTaskEvent.objects.create(
                comment='edit project',
                type=_type,
                user_id=self.request.user.id,
                first_name=self.request.user.first_name,
                last_name=self.request.user.last_name,
                project_id=serializer.data['id'],
                after_project_id=project_history_serializer.data['id'],
                before_project=before_project
            )

    def check_status(self, data, origin_obj):
        task_type = []
        if 'status' in data and data['status'] != origin_obj.status:
            if data['status'] == Project.STATUS_ARCHIVED:
                task_type.append(ProjectTaskEvent.TYPE_ARCHIVE_PROJECT)
            elif data['status'] == Project.STATUS_ACTIVE:
                task_type.append(ProjectTaskEvent.TYPE_RE_ACTIVE_PROJECT)

        if 'name' in data and data['name'] != origin_obj.name:
            task_type.append(ProjectTaskEvent.TYPE_EDIT_PROJECT_TITLE)

        if 'members' in data:
            members = origin_obj.members.all()
            if len(data['members']) != len(members):
                task_type.append(ProjectTaskEvent.TYPE_EDIT_PROJECT_MEMBER)
            else:
                for member in members:
                    if member.id not in data['members']:
                        task_type.append(ProjectTaskEvent.TYPE_EDIT_PROJECT_MEMBER)
                        break
        return task_type

    @action(detail=False, url_path="per-user")
    def get_project(self,    request):
        user = self.request.user
        member = Member.objects.filter(email=user.email).first()
        if 'archived' in self.request.query_params:
            projects = Project.objects.filter(Q(user_id=user.id) | Q(members=member))\
                .filter(status=self.request.query_params['archived']).distinct()
        else:
            projects = Project.objects.filter(Q(user_id=user.id) | Q(members=member)).distinct()
        serializer = ProjectSerializer(projects, many=True, context={'user': user})
        return Response(serializer.data)

    @action(detail=True, url_path="get-history")
    def get_project_history(self, request, pk):
        start_time = timezone.now()
        page = int(self.request.query_params['page'])
        per_page = int(self.request.query_params['per_page'])
        project = self.get_object()
        date_list = ProjectTaskEvent.objects.filter(project=project).order_by('-id').all()
        if page * per_page >= len(date_list):
            return Response([])
        paginator = Paginator(date_list, per_page)
        date_list = paginator.get_page(page + 1)
        history_list = []
        history = None
        end_time1 = timezone.now()
        print("!~~~~~~~~~~~~endtime 1")
        print(end_time1 - start_time)
        for event in date_list:
            serializer = ProjectTaskEventViewSerializer(event)
            if history is None:
                history = {
                    'time': event.created_at.date(),
                    'events': [serializer.data, ]
                }
                continue

            if history['time'] != event.created_at.date():
                history_list.append(history)
                history = {
                    'time': event.created_at.date(),
                    'events': [serializer.data, ]
                }
            else:
                history['events'].append(serializer.data)
        end_time2 = timezone.now()
        print("!~~~~~~~~~~~~endtime 2")
        print(end_time2 - start_time)
        if history:
            history_list.append(history)
        return Response(history_list)


class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)
        project_task_history = dict(serializer.data)
        del project_task_history['id']
        del project_task_history['member_list']
        before_project = ProjectHistory.objects.filter(project_id=serializer.data['id']).order_by('-id').first()
        before_task = ProjectTaskHistory.objects.filter(project_id=serializer.data['id']).order_by('-id').first()

        project_task_history_serializer = ProjectTaskHistorySerializer(data=project_task_history)
        project_task_history_serializer.is_valid(raise_exception=True)
        project_task_history_serializer.save()
        project_history_id = None
        project_history = ProjectHistory.objects.filter(project_id=serializer.data['project']).order_by('-id').first()
        if project_history:
            project_history_id = project_history.id
        ProjectTaskEvent.objects.create(
            comment='created new task',
            type=ProjectTaskEvent.TYPE_CREATE_TASK,
            user_id=self.request.user.id,
            first_name=self.request.user.first_name,
            last_name=self.request.user.last_name,
            project_id=serializer.data['project'],
            after_project_id=project_history_id,
            before_project=before_project,
            task_id=serializer.data['id'],
            after_task_id=project_task_history_serializer.data['id'],
            before_task=before_task
        )

    def perform_update(self, serializer):
        origin_obj = self.get_object()
        data = self.request.data
        task_types = self.check_status(data, origin_obj)
        serializer.save()
        if 'start_time' in data and 'end_time' in data and (serializer.data['start_time'] != data['start_time'] or serializer.data['end_time'] != data['end_time']):
            task_types.append(ProjectTaskEvent.TYPE_EDIT_TASK_TIMEFRAME)
        project_task_history = dict(serializer.data)
        task = ProjectTask.objects.get(pk=serializer.data['id'])
        before_project = ProjectHistory.objects.filter(project=task.project).order_by('-id').first()
        before_task = ProjectTaskHistory.objects.filter(project=task.project).order_by('-id').first()
        del project_task_history['id']
        del project_task_history['member_list']
        project_task_history_serializer = ProjectTaskHistorySerializer(data=project_task_history)
        project_task_history_serializer.is_valid(raise_exception=True)
        project_task_history_serializer.save()
        project_history_id = None
        project_history = ProjectHistory.objects.filter(project_id=serializer.data['project']).order_by('-id').first()
        if project_history:
            project_history_id = project_history.id
        for task_type in task_types:
            ProjectTaskEvent.objects.create(
                comment='edit task',
                type=task_type,
                user_id=self.request.user.id,
                first_name=self.request.user.first_name,
                last_name=self.request.user.last_name,
                project_id=serializer.data['project'],
                task_id=serializer.data['id'],
                after_project_id=project_history_id,
                after_task_id=project_task_history_serializer.data['id'],
                before_project=before_project,
                before_task=before_task
            )

    def check_status(self, data, origin_obj):
        task_type = []
        if 'status' in data and data['status'] != origin_obj.status:
            if data['status'] == 'deleted':
                task_type.append(ProjectTaskEvent.TYPE_REMOVE_TASK)
            else:
                task_type.append(ProjectTaskEvent.TYPE_EDIT_TASK_STATUS)

        if 'title' in data and data['title'] != origin_obj.title:
            task_type.append(ProjectTaskEvent.TYPE_EDIT_TASK_TITLE)

        if 'description' in data and data['description'] != origin_obj.description:
            task_type.append(ProjectTaskEvent.TYPE_EDIT_TASK_DESCRIPTION)

        if 'members' in data:
            members = origin_obj.members.all()
            if len(data['members']) != len(members):
                task_type.append(ProjectTaskEvent.TYPE_EDIT_TASK_MEMBERS)
            else:
                for member in members:
                    if member.id not in data['members']:
                        task_type.append(ProjectTaskEvent.TYPE_EDIT_TASK_MEMBERS)
                        break

        return task_type


class ProjectTaskCommentViewSet(viewsets.ModelViewSet):
    queryset = ProjectTaskComment.objects.all()
    serializer_class = ProjectTaskCommentSerializer

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)
        task = ProjectTask.objects.get(pk=serializer.data['task'])
        after_project = ProjectHistory.objects.filter(project=task.project).order_by('-id').first()
        after_task = ProjectTaskHistory.objects.filter(project=task.project).order_by('-id').first()
        ProjectTaskEvent.objects.create(
            comment=serializer.data['comment'],
            type=ProjectTaskEvent.TYPE_ADD_COMMENT,
            user_id=self.request.user.id,
            first_name=self.request.user.first_name,
            last_name=self.request.user.last_name,
            project=task.project,
            after_project=after_project,
            after_task=after_task
        )

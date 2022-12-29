import copy
from datetime import datetime, timedelta

from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api_company.models import CellCultureOption, CellCultureLine, CellCultureEvent, CellStatusHistory, \
    CellLineCurrentStatus
from api_company.serializers import CellCultureOptionSerializer, CellCultureLineSerializer, CellCultureEventSerializer, \
    CellStatusHistorySerializer, CellCultureLineOriginSerializer, CellLineCurrentStatusSerializer, CellLineRowSerializer


class CellCultureOptionView(APIView):

    def get(self, request):
        options = CellCultureOption.objects.filter(user_id=self.request.user.id).all()
        serializer = CellCultureOptionSerializer(options, many=True)
        return Response(serializer.data)

    def post(self, request):
        deleted_options = self.request.data['deleted_options']
        options = self.request.data['options']
        CellCultureOption.objects.filter(pk__in=deleted_options).delete()
        for option in options:
            if 'id' not in option:
                CellCultureOption.objects.create(
                    name=option['name'],
                    field=option['field'],
                    user_id=self.request.user.id
                )
        options = CellCultureOption.objects.filter(user_id=self.request.user.id).all()
        serializer = CellCultureOptionSerializer(options, many=True)
        return Response(serializer.data)


class CellCultureView(APIView):

    def get(self, request):

        if 'removed' in self.request.query_params:
            options = CellCultureLine.objects.filter(removed=self.request.query_params['removed'] == 'true',
                                                     user_id=self.request.user.id).all()
        elif 'from_date' in self.request.query_params:
            removed_from = self.request.query_params['from_date']
            lsat_date = datetime.now() - timedelta(int(removed_from))
            options = CellCultureLine.objects \
                .filter(Q(ended_at__range=(lsat_date, datetime.now())) | Q(removed=False)) \
                .filter(user_id=self.request.user.id).all()
        else:
            options = CellCultureLine.objects.filter(user_id=self.request.user.id).all()

        serializer = CellCultureLineSerializer(options, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = self.request.data
        data['user_id'] = self.request.user.id
        data['origin_passage_number'] = data['passage_number']
        last_cell = CellCultureLine.objects.order_by('-id').first()
        if last_cell:
            uid = 'CELL-%s' % last_cell.id
        else:
            uid = 'CELL-0'
        data['uid'] = uid
        data['user_id'] = self.request.user.id
        if data['mycoplasmas_state']:
            data['mycoplasmas_date'] = data['date_taken']
        serializer = CellCultureLineSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data['cell_line'] = serializer.data['id']
        current_serializer = CellLineCurrentStatusSerializer(data=data)
        current_serializer.is_valid(raise_exception=True)
        current_serializer.save(cell_line_id=serializer.data['id'])

        CellStatusHistory.objects.create(
            log_type=CellStatusHistory.LOG_TYPE_ADD_NEW,
            cell_line_id=serializer.data['id'],
            created_at=data['date_taken'],
            ui_event_datetime=data['updated_at']
        )
        cell_line = CellCultureLine.objects.get(pk=serializer.data['id'])
        serializer = CellCultureLineSerializer(cell_line)
        return Response(serializer.data)

    def put(self, request):
        data = self.request.data
        cell_line_id = data['id']
        date_taken_str = data['date_taken']
        try:
            date_taken = datetime.strptime(date_taken_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        except:
            date_taken = datetime.strptime(date_taken_str, '%Y-%m-%dT%H:%M:%SZ')

        cell_event = CellCultureEvent.objects.filter(cell_culture_line=cell_line_id) \
            .order_by('selected_date', 'id').first()
        if cell_event:
            latest_date = cell_event.selected_date.replace(tzinfo=None)
            if latest_date < date_taken:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Invalid date taken'})

        cell_culture_line = CellCultureLine.objects.get(pk=cell_line_id)

        serializer = CellCultureLineSerializer(cell_culture_line, data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        previous_history = CellStatusHistory.objects.filter(
            log_type=CellStatusHistory.LOG_TYPE_ADD_NEW,
            cell_line_id=serializer.data['id']
        ).first()
        previous_history.created_at = data['date_taken']
        previous_history.save()
        CellStatusHistory.objects.create(
            log_type=CellStatusHistory.LOG_TYPE_UPDATE_LINE,
            cell_line_id=serializer.data['id'],
            created_at=data['updated_at']
        )
        return Response(serializer.data)


class CellCultureEventView(APIView):

    def get(self, request):
        options = CellCultureEvent.objects.filter(user_id=self.request.user.id).all()
        serializer = CellCultureEventSerializer(options, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = self.request.data
        from_date = datetime.strptime(data['selected_date'], '%Y-%m-%dT%H:%M:%S.%fZ')

        cell_line = CellCultureLine.objects.get(pk=data['cell_culture_line'])
        cell_line_current_status = CellLineCurrentStatus.objects.filter(cell_line=data['cell_culture_line']).first()
        cell_line_current_status_service = CellLineCurrentStatusSerializer(cell_line_current_status)
        cell_line_row_data = cell_line_current_status_service.data
        del cell_line_row_data['id']
        cell_line_row_serializer = CellLineRowSerializer(data=cell_line_row_data)
        cell_line_row_serializer.is_valid(raise_exception=True)
        cell_line_row_serializer.save()

        latest_date_taken = cell_line.date_taken.replace(tzinfo=None)
        if latest_date_taken > from_date:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={
                                'detail': 'Selected date can’t precede the date that the cell line was taken into culture.'})

        if data['log_type'] == CellCultureEvent.LOG_TYPE_REMOVE_CELL_LINE:
            cell_event = CellCultureEvent.objects.filter(cell_culture_line=data['cell_culture_line']) \
                .order_by('-selected_date', '-id').first()
            if cell_event:
                latest_date = cell_event.selected_date.replace(tzinfo=None)
                if latest_date > from_date:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'detail': 'Selected date is not available'})
        serializer = CellCultureEventSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if data['log_type'] == CellCultureEvent.LOG_TYPE_PASSAGE:
            cell_line_current_status.passage_number = cell_line_current_status.passage_number + 1

        if data['log_type'] == CellCultureEvent.LOG_TYPE_ADD_MEDIUM_ADDITIVE:
            cell_line_current_status.medium_additive = data['medium_additive_text']

        if data['log_type'] == CellCultureEvent.LOG_TYPE_MYCOPLASMA_TEST:
            cell_line_current_status.mycoplasmas_state = data['mycoplasma_type']
            cell_line_current_status.mycoplasmas_date = data['selected_date']

        if data['log_type'] == CellCultureEvent.LOG_TYPE_REMOVE_CELL_LINE:
            cell_line.removed = True
            cell_line.ended_at = data['selected_date']
            cell_line.save()
            cell_line_current_status.removed = True
            cell_line_current_status.ended_at = data['selected_date']

        cell_line_current_status.save()

        last_cell_histories = CellStatusHistory.objects.filter(latest=True,
                                                             cell_line_id=serializer.data['cell_culture_line']).all()
        for last_cell_history in last_cell_histories:
            last_cell_history.latest = False
            last_cell_history.save()

        CellStatusHistory.objects.create(
            log_type=CellStatusHistory.LOG_TYPE_EVENT,
            cell_line_row_id=cell_line_row_serializer.data['id'],
            cell_event_id=serializer.data['id'],
            cell_line_id=serializer.data['cell_culture_line'],
            created_at=data['selected_date'],
            ui_event_datetime=data['updated_at'],
            latest=True
        )
        cell_line_serializer = CellCultureLineSerializer(cell_line)
        response = {
            'event': serializer.data,
            'cell': cell_line_serializer.data
        }
        return Response(response)


class CellStatusHistoryView(APIView):

    def get(self, request):
        from_date_str = self.request.query_params['from_date']
        to_date_str = self.request.query_params['to_date']
        cell_line = self.request.query_params['cell_line']

        from_date = datetime.strptime(from_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        to_date = datetime.strptime(to_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        if from_date > to_date:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Invalid date rage'})

        cell_lines_by_date = []
        while to_date >= from_date:
            start_day = to_date - timedelta(days=1)
            end_day = to_date
            cell_lines_query = CellCultureLine.objects.filter(date_taken__lte=end_day).filter(
                user_id=self.request.user.id) \
                .filter(Q(ended_at__gt=start_day) | Q(ended_at=None))
            if cell_line != '-1':
                cell_lines_query = cell_lines_query.filter(pk=cell_line)
            cell_lines = cell_lines_query.all()
            if not len(cell_lines):
                to_date = to_date - timedelta(days=1)
                continue
            serializer = CellCultureLineOriginSerializer(cell_lines, many=True)

            histories_query = CellStatusHistory.objects.filter(cell_line__user_id=self.request.user.id) \
                .filter(created_at__gt=start_day, created_at__lte=end_day).order_by('-created_at', '-id')
            if cell_line != '-1':
                histories_query = histories_query.filter(cell_line=cell_line)
            histories = histories_query.all()
            history_serializer = CellStatusHistorySerializer(histories, many=True)

            history = {
                'time': to_date,
                'cell_lines': serializer.data,
                'events': history_serializer.data
            }
            cell_lines_by_date.append(history)
            to_date = to_date - timedelta(days=1)

        return Response(cell_lines_by_date)


class DeleteHistoryView(APIView):

    def post(self, request, *args, **kwargs):
        pk = kwargs['pk']
        history = CellStatusHistory.objects.get(pk=pk)
        current_cell_line = CellLineCurrentStatus.objects.filter(cell_line=history.cell_line).first()
        previous_row_serializer = CellLineRowSerializer(history.cell_line_row)
        current_data = previous_row_serializer.data
        del current_data['id']
        CellLineCurrentStatusSerializer(current_cell_line, current_data)

        CellStatusHistory.objects.create(
            log_type=CellStatusHistory.LOG_TYPE_REMOVE,
            cell_line_row=history.cell_line_row,
            cell_event=history.cell_event,
            cell_line=history.cell_line,
            ui_event_datetime=self.request.data['updated_at'],
            created_at=history.cell_event.selected_date,
            latest=False
        )

        if int(history.log_type) == CellStatusHistory.LOG_TYPE_EVENT:
            if history.cell_event.log_type == CellCultureEvent.LOG_TYPE_REMOVE_CELL_LINE:
                history.cell_line.removed = False
                history.cell_line.ended_at = None
                history.cell_line.save()

            cell_row_serializer = CellLineRowSerializer(history.cell_line_row)
            new_current_status = cell_row_serializer.data
            del new_current_status['id']
            current_cell_line = CellLineCurrentStatus.objects.filter(cell_line=history.cell_line).first()
            new_serializer = CellLineCurrentStatusSerializer(current_cell_line, new_current_status)
            new_serializer.is_valid(raise_exception=True)
            new_serializer.save()

        history.removed = True
        history.latest = False
        history.save()
        history.cell_event.removed = True
        history.cell_event.save()
        return Response()

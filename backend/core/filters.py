from django_filters import rest_framework as filters
from core.models import User


class UserFilter(filters.FilterSet):

    class Meta:
        model = User
        fields = {
            'first_name': ['exact', 'icontains'],
            'last_name': ['exact', 'icontains'],
            'email': ['exact', 'icontains']
        }


class ParticipantFilter(filters.FilterSet):
    class Meta:
        model = Participant
        fields = {
            'raffle': ['exact'],
            'address': ['exact'],
            'poap_id': ['exact'],
        }


class RaffleFilter(filters.FilterSet):

    class Meta:
        model = Raffle
        fields = {
            'name': ['exact', 'icontains'],
            'draw_datetime': ['exact', 'gte', 'lte'],
            'end_datetime': ['exact', 'gte', 'lte'],
            'participants__address': ['exact'],
            # 'finalized': ['exact', ],
        }

        filter_overrides = {
            django_models.DateField: {
                'filter_class': DateFilter
            },
            django_models.DateTimeField: {
                'filter_class': IsoDateTimeFilter
            },
        }

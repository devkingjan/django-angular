from datetime import datetime
from authentication.models import User


def generate_uuid(user, experiment):
    regular_initial = user.initials.upper()
    regular_initial = ''.join(regular_initial.split())[:2]
    if user.user_role == User.ROLE_COMPANY_ADMIN:
        company_initial = user.initials.upper()
    elif user.user_role == User.ROLE_REGULAR_USER:
        company_initial = user.inviter.initials.upper()
    else:
        company_initial = 'IGOR'
    company_initial = ''.join(company_initial.split())[:2]
    year = datetime.now().year
    template = experiment.template.name.upper()
    template = ''.join(template.split())[:2]
    uuid = '%s-%s-%s-%s-%s' % (regular_initial, company_initial, year, template, experiment.id)
    return uuid



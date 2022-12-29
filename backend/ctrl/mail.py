import requests
from django.conf import settings
from django.template import loader
from django.core.mail import EmailMessage


def send_mail(to_mail, subject, template, params):
    from_mail = settings.DEFAULT_FROM_EMAIL
    template = loader.render_to_string(template, params)
    try:
        return requests.post(
            "https://api.mailgun.net/v3/igorlabapp.com/messages",
            auth=("api", settings.MAIL_GUN_API_KEY),
            data={
                "from": from_mail,
                "to": to_mail,
                "subject": subject,
                "html": template})
    except:
        return False



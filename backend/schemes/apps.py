import sys
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class SchemesConfig(AppConfig):
    name = 'schemes'

    def ready(self):
        if 'manage.py' not in sys.argv:
            try:
                from django.core.management import call_command
                from .models import Scheme
                if Scheme.objects.count() == 0:
                    call_command('seed_schemes')
            except Exception as exc:
                logger.error("Auto seeding schemes failed: %s", exc)


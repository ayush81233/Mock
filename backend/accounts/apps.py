import sys
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        # Auto-run database migrations on web server startup (e.g., Render deployment)
        if 'manage.py' not in sys.argv:
            try:
                from django.core.management import call_command
                call_command('migrate', interactive=False)
            except Exception as exc:
                logger.error("Auto migration on startup failed: %s", exc)


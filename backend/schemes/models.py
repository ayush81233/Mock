from django.db import models


class Scheme(models.Model):
    CATEGORY_CHOICES = [
        ("Health", "Health"),
        ("Pension", "Pension"),
    ]

    id = models.CharField(max_length=100, primary_key=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255)
    short_description = models.TextField()
    description = models.TextField()

    eligibility = models.JSONField(default=list)

    # Demo eligibility rules used by the Eligibility Checker.
    # Example:
    # {
    #     "min_age": 60,
    #     "max_income": 300000
    # }
    eligibility_rules = models.JSONField(default=dict)

    benefits = models.JSONField(default=list)
    documents = models.JSONField(default=list)
    application_process = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
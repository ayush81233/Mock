from django.core.management.base import BaseCommand
from schemes.models import Scheme


class Command(BaseCommand):
    help = "Seed demonstration government schemes into the database"

    def handle(self, *args, **kwargs):

        schemes = [
            {
                "id": "health-001",
                "category": "Health",
                "title": "National Health Support Scheme",
                "short_description": "Healthcare assistance for eligible citizens requiring support for medical treatment.",
                "description": "This demonstration scheme provides financial and healthcare assistance to eligible citizens for specified medical treatment and healthcare needs.",
                "eligibility": [
                    "Applicant must be a resident citizen.",
                    "Applicant must satisfy the applicable income criteria.",
                    "Applicant must provide the required supporting documents.",
                    "Additional conditions may apply depending on the type of assistance."
                
                ],
                "eligibility_rules": {
                    "max_income": 500000
                },
                "benefits": [
                    "Financial assistance for eligible healthcare expenses.",
                    "Support for specified medical treatments.",
                    "Access to participating healthcare facilities.",
                    "Reduced financial burden for eligible families."
                ],
                "documents": [
                    "Identity Proof",
                    "Residence Proof",
                    "Income Certificate",
                    "Bank Account Details",
                    "Medical Documents, where applicable"
                ],
                "application_process": [
                    "Check your eligibility.",
                    "Prepare the required documents.",
                    "Complete the application form.",
                    "Submit the application through the designated channel.",
                    "Track the application status."
                ]
            },

            {
                "id": "health-002",
                "category": "Health",
                "title": "Family Healthcare Assistance",
                "short_description": "Healthcare support information for eligible families.",
                "description": "A demonstration scheme providing healthcare-related assistance to eligible families based on defined eligibility conditions.",
                "eligibility": [
                    "Applicant must meet the applicable family eligibility criteria.",
                    "Applicant must provide valid identity and residence proof.",
                    "Income-related conditions may apply."
                ],
                "eligibility_rules": {
                    "max_income": 400000
                },
                "benefits": [
                    "Healthcare assistance.",
                    "Support for eligible medical expenses.",
                    "Access to applicable healthcare services."
                ],
                "documents": [
                    "Identity Proof",
                    "Residence Proof",
                    "Income Certificate",
                    "Family Details",
                    "Bank Account Details"
                ],
                "application_process": [
                    "Review the eligibility conditions.",
                    "Collect the required documents.",
                    "Fill in the application.",
                    "Submit the application.",
                    "Wait for verification and processing."
                ]
                
            },

            {
                "id": "pension-001",
                "category": "Pension",
                "title": "Senior Citizen Pension Scheme",
                "short_description": "Pension assistance information for eligible senior citizens.",
                "description": "This demonstration scheme provides information about pension assistance available to eligible senior citizens.",
                "eligibility": [
                    "Applicant must satisfy the prescribed age requirement.",
                    "Applicant must meet applicable income or social security conditions.",
                    "Applicant must be a resident citizen.",
                    "Required documents must be provided."
                ],
                "eligibility_rules": {
                    "min_age": 60,
                    "max_income": 300000
                },
                "benefits": [
                    "Regular pension assistance for eligible beneficiaries.",
                    "Financial support for senior citizens.",
                    "Support for basic living expenses."
                ],
                "documents": [
                    "Identity Proof",
                    "Age Proof",
                    "Residence Proof",
                    "Income Certificate",
                    "Bank Account Details"
                ],
                "application_process": [
                    "Check the age and eligibility requirements.",
                    "Prepare the required documents.",
                    "Complete the application form.",
                    "Submit the application to the designated authority.",
                    "Track the application status."
                ]
            },

            {
                "id": "pension-002",
                "category": "Pension",
                "title": "Social Security Pension Assistance",
                "short_description": "Social security pension information for eligible beneficiaries.",
                "description": "A demonstration scheme covering pension-related assistance for eligible citizens under applicable social security conditions.",
                "eligibility": [
                    "Applicant must satisfy the applicable eligibility conditions.",
                    "Applicant must provide identity and residence proof.",
                    "Income or household conditions may apply."
                ],
                "eligibility_rules": {
                    "min_age": 60
                    
                },
                "benefits": [
                    "Periodic financial assistance.",
                    "Social security support.",
                    "Financial assistance for eligible beneficiaries."
                ],
                "documents": [
                    "Identity Proof",
                    "Residence Proof",
                    "Income Certificate",
                    "Bank Account Details",
                    "Age Proof, where applicable"
                ],
                "application_process": [
                    "Check eligibility.",
                    "Prepare the required documents.",
                    "Submit the application.",
                    "Complete verification.",
                    "Receive the decision from the concerned authority."
                ]
            }
        ]

        for data in schemes:
            scheme, created = Scheme.objects.update_or_create(
                id=data["id"],
                defaults=data
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created: {scheme.title}"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"Updated: {scheme.title}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                "\nScheme database seeding completed successfully."
            )
        )
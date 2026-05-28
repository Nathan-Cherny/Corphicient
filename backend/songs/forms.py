from .models import *
from .serializer import *
from rest_framework import serializers
from django.db.models.fields import NOT_PROVIDED

class FormSerializer(serializers.Serializer):
    def to_representation(self, instance):
        print(self, instance)
        # Assuming 'instance' is a Django model class
        fields = []
        for field in list(instance._meta.fields) + list(instance._meta.many_to_many):
            if field.name == "id":
                continue

            field_type = "text"
            options = []
            if field.get_internal_type() in [
                "IntegerField",
                "FloatField",
                "DecimalField",
            ]:
                field_type = "number"
            elif field.get_internal_type() == "BooleanField":
                field_type = "checkbox"
            elif field.get_internal_type() == "DateTimeField":
                field_type = "datetime-local"
            elif field.get_internal_type() == "ManyToManyField":
                field_type = "select"
                related_model = field.related_model
                options = [
                    {"value": obj.pk, "label": str(obj)}
                    for obj in related_model.objects.all()
                ]

            fields.append(
                {
                    "name": field.name,
                    "label": field.verbose_name.title(),
                    "type": field_type,
                    "required": not field.blank,
                    "default": (
                        get_default(field)
                    ),
                    "max_length": getattr(field, "max_length", 0),
                    "options": options
                }
            )
        return {"fields": fields}
    
def get_default(field):
    if field.default is NOT_PROVIDED:
        return False
    if callable(field.default):
        return field.default()
    return field.default
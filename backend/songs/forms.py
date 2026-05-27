from .models import Song


def SongFormSchema(request):
    fields = []

    for field in Song._meta.fields:
        if field.name == "id": continue

        field_data = {
            "name": field.name,
            "required": not field.blank,
            "type": field.get_internal_type(),
        }

        if hasattr(field, "max_length") and field.max_length:
            field_data["max_length"] = field.max_length

        if field.choices:
            field_data["choices"] = [
                {"value": c[0], "label": c[1]} for c in field.choices
            ]

        fields.append(field_data)

    return {"fields": fields}

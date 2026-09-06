from django.db import migrations


def migrate_section_notes(apps, schema_editor):
    Section = apps.get_model("notes", "Section")
    SectionNote = apps.get_model("notes", "SectionNote")

    for section in Section.objects.all():
        for order, note in enumerate(section.notes.all()):
            SectionNote.objects.create(
                section_id=section.id,
                note_id=note.id,
                order=order,
            )


def reverse_migrate_section_notes(apps, schema_editor):
    SectionNote = apps.get_model("notes", "SectionNote")
    SectionNote.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("notes", "0005_sectionnote"),
    ]

    operations = [
        migrations.RunPython(
            migrate_section_notes,
            reverse_migrate_section_notes,
        ),
    ]
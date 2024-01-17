from project_models.models.file import File

files = File.objects.all().filter(marked_for_permanent_deletion=True)

for file in files:
    print('Deleting file:' + file.name)
    file.hard_delete()

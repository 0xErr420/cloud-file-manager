from django.db import models
from .user  import User
from .file import File

class FileShare(models.Model):
    # Description: Owner shares with one user list of Files
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE)
    files = models.ManyToManyField(File)

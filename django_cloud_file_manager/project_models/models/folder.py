from django.db import models
from .user import User

from django.db.models.signals import post_save
from django.dispatch import receiver


class Folder(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_folder = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, unique=False,
                            null=False, blank=False)

    class Meta:
        unique_together = ('owner', 'parent_folder', 'name')

    def get_full_path(self):
        if self.parent_folder:
            return f'{self.parent_folder.get_full_path()}/{self.name}'
        return self.name


@receiver(post_save, sender=User)
def create_default_folders(sender, instance, created, **kwargs):
    ''' Create default folder `Uploads` for each new user. '''
    if created:
        Folder.objects.create(name='Uploads', owner=instance)

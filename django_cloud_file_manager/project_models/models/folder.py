from django.db import models
from .user import User

from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timezone


class ActiveFolderManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False, marked_for_permanent_deletion=False)


class Folder(models.Model):
    objects = models.Manager()  # Default manager
    active_folders = ActiveFolderManager()  # Custom manager for active folders

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_folder = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, unique=False,
                            null=False, blank=False)

    deleted = models.BooleanField(default=False)
    date_deleted = models.DateTimeField(null=True, blank=True)
    marked_for_permanent_deletion = models.BooleanField(default=False)

    class Meta:
        unique_together = ('owner', 'parent_folder', 'name')

    def delete(self):
        '''Soft delete, just marks folder as deleted'''
        # TODO: make background task to actually delete marked folders after 30 days
        # Prevent deletion of default Uploads folder
        if self.name == 'Uploads' and self.parent_folder is None:
            raise ValueError("The default 'Uploads' folder cannot be deleted.")

        self.deleted = True
        self.deleted_at = timezone.now()
        self.save()

        # Soft delete all child folders
        for child_folder in Folder.objects.filter(parent_folder=self):
            child_folder.delete()

        # Soft delete all files in the folder
        from .file import File
        for file in File.objects.filter(folder=self):
            file.delete()

    def restore(self, new_parent_folder_id=None):
        # If a new parent folder is provided, validate and use it
        if new_parent_folder_id:
            new_parent_folder = Folder.objects.get(
                id=new_parent_folder_id, owner=self.owner, deleted=False)
            self.parent_folder = new_parent_folder
        # If no new parent is provided and the original parent is deleted, raise an error
        elif self.parent_folder and (self.parent_folder.deleted or self.parent_folder.marked_for_permanent_deletion):
            raise ValueError(
                "Original parent folder is deleted. Please specify a new parent folder.")

        self.deleted = False
        self.date_deleted = None
        self.save()

        # Recursively restore all child folders
        for child_folder in Folder.objects.filter(parent_folder=self, deleted=True):
            child_folder.restore()

        # Restore all files in the current folder
        from .file import File
        for file in File.objects.filter(folder=self, deleted=True):
            file.restore()

    def mark_for_permanent_delete(self):
        self.marked_for_permanent_deletion = True
        self.save()

        # Mark all child folders
        for child_folder in Folder.objects.filter(parent_folder=self):
            child_folder.mark_for_permanent_delete()

        # Mark all child files
        from .file import File
        for file in File.objects.filter(folder=self):
            file.mark_for_permanent_delete()

    def hard_delete(self, *args, **kwargs):
        '''Actually delete folder from database'''

        # Hard delete all child folders
        for child_folder in Folder.objects.filter(parent_folder=self):
            child_folder.hard_delete()

        # Hard delete all files in the folder
        from .file import File
        for file in File.objects.filter(folder=self):
            file.hard_delete()

        super(Folder, self).delete(*args, **kwargs)

    def get_full_path(self):
        if self.parent_folder:
            return f'{self.parent_folder.get_full_path()}/{self.name}'
        return self.name


@receiver(post_save, sender=User)
def create_default_folders(sender, instance, created, **kwargs):
    ''' Create default folder `Uploads` for each new user. '''
    if created:
        Folder.objects.create(name='Uploads', owner=instance)

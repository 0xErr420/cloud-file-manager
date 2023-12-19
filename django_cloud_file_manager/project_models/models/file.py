from django.db import models

from .user import User
from .folder import Folder

import uuid
import os
from datetime import timezone


class ActiveFileManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False, marked_for_permanent_deletion=False)


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<file_uid>
    return 'user_{0}/{1}'.format(instance.owner.id, instance.uid)


class File(models.Model):
    objects = models.Manager()  # Default manager
    active_files = ActiveFileManager()  # Custom manager for active files

    class Meta:
        # File names should be unique in one single folder
        unique_together = ('owner', 'folder', 'name')

    # Unique name to store in server filesystem
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    date_uploaded = models.DateTimeField(editable=False, auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)
    date_deleted = models.DateTimeField(null=True, blank=True)
    marked_for_permanent_deletion = models.BooleanField(default=False)

    # CASCADE ensures that when a user is deleted, their associated files are also deleted
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=False, blank=False)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)

    # Actual file content and properties
    content = models.FileField(upload_to=user_directory_path)
    # Max size is 2147483647 Bytes = 2,048.0 MB = 2.0 GB
    size = models.PositiveIntegerField(null=True)
    # Metadata: original date of creation/shoot
    meta_date_created = models.DateTimeField(null=True, blank=True)
    # TODO: Add metadata field?

    def save(self, *args, **kwargs):
        if not self.content:
            raise ValueError("File content cannot be empty.")

        if not self.pk:  # Check if this is a new object
            self.size = self.content.size  # Set file size

        super().save(*args, **kwargs)

    def copy(self, new_owner, new_folder=None, new_name=None):
        """
        Create a copy of the file instance.
        The physical file is not duplicated; only the database record is.
        """
        uploads_folder, created = Folder.objects.get_or_create(
            name='Uploads',
            owner=new_owner,
            parent_folder__isnull=True
        )

        file_copy = File.objects.create(
            uid=self.uid,
            owner=new_owner,
            name=new_name or self.name,
            folder=new_folder if new_folder else uploads_folder,
            content=self.content,
            size=self.size,
            meta_date_created=self.meta_date_created,
            date_uploaded=timezone.now()
        )
        return file_copy

    def delete(self):
        '''Soft delete, just marks file as deleted'''
        # TODO: make background task to actually delete marked files after 30 days
        self.deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self, new_folder_id=None):
        # If a new folder is provided, validate and use it
        if new_folder_id:
            new_folder = Folder.objects.get(
                id=new_folder_id, owner=self.owner, deleted=False)
            self.folder = new_folder
        elif self.folder and (self.folder.deleted or self.folder.marked_for_permanent_deletion):
            # If the original folder is deleted or does not exist, raise an error
            raise ValueError(
                "Original folder is deleted. Please specify a new folder.")

        self.deleted = False
        self.deleted_at = None
        self.save()

    def mark_for_permanent_delete(self):
        self.marked_for_permanent_deletion = True
        self.save()

    def hard_delete(self, *args, **kwargs):
        '''Actually delete file from database and system storage'''
        if self.content:
            file_path = self.content.path

            # Check if any other File instances reference this physical file
            other_references = File.objects.filter(
                uid=self.uid).exclude(id=self.id)
            if not other_references.exists():
                # No other references; safe to delete the physical file
                if os.path.isfile(file_path):
                    try:
                        os.remove(file_path)
                    except OSError as e:
                        # TODO: You can log the error here or send a notification
                        print(f"Error deleting file {file_path}: {e.strerror}")
                else:
                    # File does not exist in the filesystem
                    # TODO: Handle this situation appropriately, e.g., logging
                    print(
                        f"File to delete not found in filesystem: {file_path}")
        super(File, self).delete(*args, **kwargs)

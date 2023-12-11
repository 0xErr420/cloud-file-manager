from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, HttpResponseForbidden

from project_models.models.file import File
from ..serializers.file_serializers import FileSerializer, FileUploadSerializer, FileCopySerializer, FileRestoreSerializer, RecentlyDeletedFileSerializer


class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned files to a given query,
        by filtering against a `query` parameter in the URL.
        """
        queryset = File.active_files.all().filter(owner=self.request.user)

        query = self.request.query_params.get('query')
        if query is not None:
            queryset = queryset.filter(name__icontains=query)

        return queryset


class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """ Return a file for the current authenticated user. """
        return File.active_files.all().filter(owner=self.request.user)


class FileUploadView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FileCopyView(generics.UpdateAPIView):
    serializer_class = FileCopySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that the file to be copied exists and belongs to the user
        return File.active_files.all().filter(owner=self.request.user)

    def perform_create(self, serializer):
        # We pass the file_id as part of the validated data to the serializer
        serializer.save(id=self.kwargs.get('file_id'))


def file_content_view(request, file_id):
    try:
        file = File.objects.get(
            id=file_id, owner=request.user, marked_for_permanent_deletion=False)
    except File.DoesNotExist:
        return HttpResponseForbidden("You do not have permission to access this file.")

    return FileResponse(open(file.content.path, 'rb'), as_attachment=False)


def download_file_view(request, file_id):
    try:
        file = File.objects.get(
            id=file_id, owner=request.user, marked_for_permanent_deletion=False)
    except File.DoesNotExist:
        return HttpResponseForbidden("You do not have permission to access this file.")

    # Set as_attachment=True to prompt a file download
    response = FileResponse(open(file.content.path, 'rb'), as_attachment=True)
    response['Content-Disposition'] = f'attachment; filename="{file.name}"'
    return response


class FileRestoreView(generics.UpdateAPIView):
    serializer_class = FileRestoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow restoring files that belong to the user and are marked as deleted
        return File.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)


class FilePermanentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow deletion of files that belong to the user and are marked as deleted
        return File.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

    def perform_destroy(self, instance):
        instance.marked_for_permanent_deletion = True
        instance.save()


class RecentlyDeletedFilesView(generics.ListAPIView):
    serializer_class = RecentlyDeletedFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return files that are marked as soft deleted and belong to the current user
        return File.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, HttpResponseForbidden

from project_models.models.file import File
from project_models.models.folder import Folder
from ..serializers.file_serializers import FileSerializer, FileUploadSerializer, FileCopySerializer, FileRestoreSerializer, RecentlyDeletedFileSerializer


class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = File.active_files.all().filter(owner=self.request.user)

        # Optionally restricts the returned files to a given query, by filtering against a `query` parameter in the URL.
        query = self.request.query_params.get('query')
        if query is not None:
            queryset = queryset.filter(name__icontains=query)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """ Return a file for the current authenticated user. """
        return File.active_files.all().filter(owner=self.request.user)


class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    max_file_size = 2147483647  # Maximum file size in bytes (2 GB)

    def post(self, request, *args, **kwargs):
        folder_id = request.data.get('folder')
        if not folder_id:
            return Response({'message': "Folder was not specified"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            folder = Folder.objects.get(owner=self.request.user, id=folder_id)
        except Folder.DoesNotExist:
            return Response({'message': "Folder not found"},
                            status=status.HTTP_400_BAD_REQUEST)

        # 'file' is the key in the FormData
        files = request.FILES.getlist('file')
        failed_uploads = []

        for file in files:
            if file.size > self.max_file_size:
                failed_uploads.append(
                    {"filename": file.name, "message": "File size exceeds the 2 GB limit"})
                continue

            if File.objects.filter(owner=request.user, folder=folder, name=file.name, deleted=False, marked_for_permanent_deletion=False).exists():
                failed_uploads.append(
                    {"filename": file.name, "message": "File with this name already exists in specified folder"})
                continue

            serializer = FileUploadSerializer(
                data={'content': file, 'folder': folder.id, 'name': file.name}, context={'request': request})

            if serializer.is_valid():
                serializer.save()
            else:
                failed_uploads.append(
                    {"filename": file.name, "message": serializer.errors})

        return Response({
            "message": "Files successfully uploaded",
            "failed": failed_uploads
        }, status=status.HTTP_200_OK if not failed_uploads else status.HTTP_207_MULTI_STATUS)


class FileCopyView(generics.UpdateAPIView):
    serializer_class = FileCopySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # Ensure that the file to be copied exists and belongs to the user
        return File.active_files.all().filter(owner=self.request.user)

    def perform_create(self, serializer):
        # We pass the file_id as part of the validated data to the serializer
        serializer.save(id=self.kwargs.get('file_id'))


class FileContentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get(self, request, id):
        try:
            file = File.objects.get(
                id=id, owner=request.user, marked_for_permanent_deletion=False)
        except File.DoesNotExist:
            return HttpResponseForbidden("You do not have permission to access this file.")

        response = FileResponse(
            open(file.content.path, 'rb'), as_attachment=False)
        response['Content-Disposition'] = f'filename="{file.name}"'
        return response


class DownloadFileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get(self, request, id):
        try:
            file = File.objects.get(
                id=id, owner=request.user, marked_for_permanent_deletion=False)
        except File.DoesNotExist:
            return HttpResponseForbidden("You do not have permission to download this file.")

        response = FileResponse(
            open(file.content.path, 'rb'), as_attachment=True)
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response


class FileRestoreView(generics.UpdateAPIView):
    serializer_class = FileRestoreSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # Only allow restoring files that belong to the user and are marked as deleted
        return File.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except serializers.ValidationError as e:
            # Handle the error, such as returning a custom response
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FilePermanentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # Only allow deletion of files that belong to the user and are marked as deleted
        return File.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

    def perform_destroy(self, instance):
        instance.mark_for_permanent_delete()


class RecentlyDeletedFilesView(generics.ListAPIView):
    serializer_class = RecentlyDeletedFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return files that are marked as soft deleted and belong to the current user
        return File.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

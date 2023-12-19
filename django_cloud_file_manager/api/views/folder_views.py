from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response

from project_models.models.folder import Folder
from ..serializers.folder_serializers import FolderSerializer, FolderDetailSerializer, FolderUpdateSerializer, UploadsFolderDetailSerializer, FolderRestoreSerializer


class FolderListView(generics.ListCreateAPIView):
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Folder.active_folders.filter(owner=self.request.user)

        query = self.request.query_params.get('query')
        if query is not None:
            queryset = queryset.filter(name__icontains=query)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FolderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure the user can only access their own folders
        return Folder.active_folders.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return FolderUpdateSerializer
        return super().get_serializer_class()

    def perform_destroy(self, instance):
        if instance.name == 'Uploads' and instance.parent_folder is None:
            raise serializers.ValidationError(
                "The default 'Uploads' folder cannot be deleted.")
        instance.delete()


class RootFoldersView(generics.ListAPIView):
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only root folders (folders with no parent) that belong to the user
        return Folder.active_folders.filter(owner=self.request.user, parent_folder__isnull=True)


class UploadsFolderView(generics.ListAPIView):
    serializer_class = UploadsFolderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Since we're returning folder details, we only need the folder, not its files
        return Folder.objects.filter(name='Uploads', owner=self.request.user, parent_folder__isnull=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        folder = queryset.first()  # Assuming there's only one "Uploads" folder per user
        if not folder:
            return Response({"detail": "Uploads folder not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(folder)
        return Response(serializer.data)


class FolderRestoreView(generics.UpdateAPIView):
    serializer_class = FolderRestoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow restoring folders that belong to the user and are marked as deleted
        return Folder.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except serializers.ValidationError as e:
            # Handle the error, such as returning a custom response
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FolderPermanentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow deletion of folders that belong to the user and are marked as deleted
        return Folder.objects.filter(owner=self.request.user, deleted=True, marked_for_permanent_deletion=False)

    def perform_destroy(self, instance):
        instance.mark_for_permanent_delete()

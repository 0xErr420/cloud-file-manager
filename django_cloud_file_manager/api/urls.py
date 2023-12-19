from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.user_views import UserRegistrationView, ChangePasswordView
from .views.file_views import FileListView, FileDetailView, FileUploadView, FileCopyView, file_content_view, download_file_view, FileRestoreView, FilePermanentDeleteView, RecentlyDeletedFilesView
from .views.folder_views import FolderListView, FolderDetailView, RootFoldersView, UploadsFolderView, FolderRestoreView, FolderPermanentDeleteView

urlpatterns = [
    # Auth
    path('auth/register', UserRegistrationView.as_view(), name='register'),
    path('auth/change-password',
         ChangePasswordView.as_view(), name='change_password'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Files
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/<int:file_id>', FileDetailView.as_view(), name='file-detail'),
    path('files/<int:file_id>/copy', FileCopyView.as_view(), name='file-copy'),
    path('files/<int:file_id>/content',
         file_content_view, name='file-content'),
    path('files/<int:file_id>/download',
         download_file_view, name='file-download'),
    path('files/<int:file_id>/restore',
         FileRestoreView.as_view(), name='file-restore'),
    path('files/<int:file_id>/permanent-delete',
         FilePermanentDeleteView.as_view(), name='file-permanent-delete'),
    path('files/upload', FileUploadView.as_view(), name='file-upload'),
    path('files/recently-deleted', RecentlyDeletedFilesView.as_view(),
         name='recently-deleted-files'),

    # Folders
    path('folders/', FolderListView.as_view(), name='folder-list'),
    path('folders/<int:folder_id>',
         FolderDetailView.as_view(), name='folder-detail'),
    path('folders/root', RootFoldersView.as_view(), name='root-folders'),
    path('folders/uploads', UploadsFolderView.as_view(), name='uploads-folder'),
    path('folders/<int:folder_id>/restore',
         FolderRestoreView.as_view(), name='folder-restore'),
    path('folders/<int:folder_id>/permanent-delete',
         FolderPermanentDeleteView.as_view(), name='folder-permanent-delete')
]

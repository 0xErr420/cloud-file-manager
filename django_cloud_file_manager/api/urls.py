from django.urls import path

from .views.auth_views import CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView
from .views.user_views import UserRegistrationView, ChangePasswordView, CurrentUserView
from .views.file_views import FileListView, FileDetailView, FileUploadView, FileCopyView, FileContentView, DownloadFileView, FileRestoreView, FilePermanentDeleteView, RecentlyDeletedFilesView
from .views.folder_views import FolderListView, FolderDetailView, ChildFoldersView, RootFoldersView, UploadsFolderView, FolderRestoreView, FolderPermanentDeleteView

urlpatterns = [
    # Auth
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/change-password/',
         ChangePasswordView.as_view(), name='change_password'),
    path('auth/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('auth/token/refresh/',
         CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    # User
    path('account/', CurrentUserView.as_view(), name='current-user'),

    # Files
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/<int:id>/', FileDetailView.as_view(), name='file-detail'),
    path('files/<int:id>/copy/', FileCopyView.as_view(), name='file-copy'),
    path('files/<int:id>/content/',
         FileContentView.as_view(), name='file-content'),
    path('files/<int:id>/download/',
         DownloadFileView.as_view(), name='file-download'),
    path('files/<int:id>/restore/',
         FileRestoreView.as_view(), name='file-restore'),
    path('files/<int:id>/permanent-delete/',
         FilePermanentDeleteView.as_view(), name='file-permanent-delete'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/recently-deleted/', RecentlyDeletedFilesView.as_view(),
         name='recently-deleted-files'),

    # Folders
    path('folders/', FolderListView.as_view(), name='folder-list'),
    path('folders/<int:id>/',
         FolderDetailView.as_view(), name='folder-detail'),
    path('folders/<int:id>/child-folders/',
         ChildFoldersView.as_view(), name='child-folders'),
    path('folders/root/', RootFoldersView.as_view(), name='root-folders'),
    path('folders/uploads/', UploadsFolderView.as_view(), name='uploads-folder'),
    path('folders/<int:id>/restore/',
         FolderRestoreView.as_view(), name='folder-restore'),
    path('folders/<int:id>/permanent-delete/',
         FolderPermanentDeleteView.as_view(), name='folder-permanent-delete')
]

from rest_framework import serializers
from project_models.models.folder import Folder
from project_models.models.file import File
from .file_serializers import FileSerializer


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'parent_folder', 'name']

    def create(self, validated_data):
        if validated_data.get('name') == 'Uploads' and 'parent_folder' not in validated_data:
            raise serializers.ValidationError(
                "A root 'Uploads' folder cannot be created.")
        return Folder.objects.create(**validated_data)


class FolderDetailSerializer(serializers.ModelSerializer):
    files = serializers.SerializerMethodField()
    child_folders = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'parent_folder', 'name', 'files', 'child_folders']

    def get_files(self, obj):
        # Get files in the folder
        files = File.active_files.filter(folder=obj)
        return FileSerializer(files, many=True, read_only=True).data

    def get_child_folders(self, obj):
        # Get child folders of the folder
        child_folders = Folder.active_folders.filter(parent_folder=obj)
        return FolderSerializer(child_folders, many=True).data


class FolderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'parent_folder', 'name']

    # TODO: make a check for folders to not be placed in itself which will cause loops
    # def validate_parent_folder(self, value):
    #     # Prevent setting the folder as its own parent
    #     if self.instance and value == self.instance.id:
    #         raise serializers.ValidationError(
    #             "A folder cannot be its own parent.")
    #     # Prevent creating a loop in the folder structure
    #     if self.instance and self.is_descendant_of(self.instance, value):
    #         raise serializers.ValidationError(
    #             "Invalid parent folder. This would create a loop.")
    #     return value

    # def is_descendant_of(self, current_folder, parent_folder_id):
    #     """ Recursively checks if the current folder is a descendant of a given folder. """
    #     if not parent_folder_id:
    #         return False
    #     parent_folder = Folder.objects.get(id=parent_folder_id)
    #     while parent_folder:
    #         if parent_folder == current_folder:
    #             return True
    #         parent_folder = parent_folder.parent_folder
    #     return False

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.parent_folder = validated_data.get(
            'parent_folder', instance.parent_folder)
        instance.save()
        return instance


class UploadsFolderDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    files = FileSerializer(many=True, read_only=True)

    def to_representation(self, instance):
        # instance here would be the uploads_folder
        representation = super().to_representation(instance)
        representation['files'] = FileSerializer(
            instance.file_set.all(), many=True).data
        return representation


class FolderRestoreSerializer(serializers.ModelSerializer):
    new_parent_folder = serializers.IntegerField(
        write_only=True, required=False, allow_null=True)

    class Meta:
        model = Folder
        fields = ['new_parent_folder']

    def update(self, instance, validated_data):
        new_parent_folder = validated_data.get('new_parent_folder')
        try:
            instance.restore(new_parent_folder_id=new_parent_folder)
        except ValueError as e:
            raise serializers.ValidationError(str(e))
        return instance

from rest_framework import serializers
from project_models.models.folder import Folder
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
    files = FileSerializer(many=True, read_only=True)
    child_folders = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'name', 'files', 'child_folders']

    def get_child_folders(self, obj):
        # Get child folders of the folder
        child_folders = Folder.active_folders.filter(parent_folder=obj)
        return FolderSerializer(child_folders, many=True).data


class FolderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['name', 'parent_folder']

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
    new_parent_folder_id = serializers.IntegerField(
        write_only=True, required=False)

    class Meta:
        model = Folder
        fields = ['new_parent_folder_id']

    def update(self, instance, validated_data):
        new_parent_folder_id = validated_data.get('new_parent_folder_id')
        try:
            instance.restore(new_parent_folder_id=new_parent_folder_id)
        except ValueError as e:
            raise serializers.ValidationError(str(e))
        return instance

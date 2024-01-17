from rest_framework import serializers
from project_models.models.file import File
from project_models.models.folder import Folder


class FileSerializer(serializers.ModelSerializer):
    ''' Serializer for List, Query, and Get Details of Files. '''
    folder_name = serializers.CharField(source='folder.name', read_only=True)

    class Meta:
        model = File
        fields = ['id', 'name', 'folder_name', 'size',
                  'date_uploaded', 'last_modified', 'meta_date_created']


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('content', 'folder')

    def create(self, validated_data):
        # Assuming 'request.user' is available in the serializer context
        user = self.context['request'].user

        # Set additional fields like 'owner' and 'name' here
        file_instance = File(
            owner=user,
            name=validated_data['content'].name,
            content=validated_data['content'],
            folder=validated_data.get('folder')
        )
        file_instance.save()
        return file_instance


class FileCopySerializer(serializers.ModelSerializer):
    folder_id = serializers.IntegerField(write_only=True, required=False)
    new_name = serializers.CharField(
        max_length=255, required=False, write_only=True)

    class Meta:
        model = File
        fields = ['id', 'folder_id', 'new_name']

    def create(self, validated_data):
        # Retrieve the original file using the provided ID
        original_file = File.objects.get(id=validated_data.get('id'))
        folder_id = validated_data.get('folder_id')
        new_name = validated_data.get('new_name', original_file.name)

        # If a folder_id is provided, fetch that folder
        if folder_id:
            new_folder = Folder.objects.get(
                id=folder_id, owner=self.context['request'].user)
        else:
            new_folder = original_file.folder

        # Check for duplicate filenames in the target folder
        if File.objects.filter(name=new_name, folder=new_folder).exists():
            raise serializers.ValidationError(
                "A file with this name already exists in the specified folder.")

        # Call the `copy` method to create a duplicate entry
        return original_file.copy(new_owner=self.context['request'].user, new_folder=new_folder, new_name=new_name)


class FileRestoreSerializer(serializers.ModelSerializer):
    folder_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = File
        fields = ['folder_id']

    def update(self, instance, validated_data):
        new_folder_id = validated_data.get('folder_id')
        try:
            instance.restore(new_folder_id=new_folder_id)
        except ValueError as e:
            raise serializers.ValidationError(str(e))
        return instance


class RecentlyDeletedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'date_deleted',
                  'size', 'folder', 'date_uploaded']

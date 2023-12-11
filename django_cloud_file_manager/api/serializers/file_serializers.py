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
        fields = ['name', 'folder', 'content']

    def create(self, validated_data):
        # Set the owner to the user from the request context
        validated_data['owner'] = self.context['request'].user
        # Default to 'Uploads' folder if not specified
        validated_data['folder'] = validated_data.get('folder') or Folder.objects.get(
            name='Uploads', owner=validated_data['owner'])
        return super().create(validated_data)


class FileCopySerializer(serializers.ModelSerializer):
    folder_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = File
        fields = ['id', 'folder_id']

    def create(self, validated_data):
        # Retrieve the original file using the provided ID
        original_file = File.objects.get(id=validated_data.get('id'))
        folder_id = validated_data.get('folder_id')

        # If a folder_id is provided, fetch that folder
        if folder_id:
            new_folder = Folder.objects.get(
                id=folder_id, owner=self.context['request'].user)
        else:
            new_folder = Folder.objects.get(
                name='Uploads', owner=self.context['request'].user)

        # Check for duplicate filenames in the target folder
        if File.objects.filter(name=original_file.name, folder=new_folder).exists():
            raise serializers.ValidationError(
                "A file with this name already exists in the specified folder.")

        # Call the `copy` method to create a duplicate entry
        return original_file.copy(new_owner=self.context['request'].user, new_folder=new_folder)


class FileRestoreSerializer(serializers.ModelSerializer):
    folder_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = File
        fields = ['folder_id']

    def update(self, instance, validated_data):
        folder_id = validated_data.get('folder_id')
        if folder_id:
            instance.folder = Folder.objects.get(
                id=folder_id, owner=self.context['request'].user)
        else:
            # Default to 'Uploads' folder if not specified
            instance.folder = Folder.objects.get(
                name='Uploads', owner=self.context['request'].user)

        instance.deleted = False
        instance.deleted_at = None
        instance.save()
        return instance
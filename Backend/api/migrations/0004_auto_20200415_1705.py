# Generated by Django 3.0.4 on 2020-04-15 11:35

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200415_1651'),
    ]

    operations = [
        migrations.RenameField(
            model_name='blog',
            old_name='tag',
            new_name='tags',
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.UUIDField(default=uuid.UUID('2f971e26-7f0d-11ea-84c8-54bf644e2c92'), primary_key=True, serialize=False),
        ),
    ]
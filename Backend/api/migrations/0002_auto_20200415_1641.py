# Generated by Django 3.0.4 on 2020-04-15 11:11

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.UUIDField(default=uuid.UUID('e4d046f4-7f09-11ea-a4cd-54bf644e2c92'), primary_key=True, serialize=False),
        ),
    ]

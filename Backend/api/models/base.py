import uuid
from django.utils.timezone import now
from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, unique=True)
    created_on = models.DateTimeField(default=now)
    updated_on = models.DateTimeField(default=now)

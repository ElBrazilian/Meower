from django.db import models
from django.utils.timezone import now

# Create your models here.
class Mew(models.Model):
	username = models.CharField(max_length=42)
	content = models.TextField(max_length=400)
	date = models.DateTimeField(default=now,verbose_name="Date de parution")

	def __str__(self):
		return self.username
	class Meta:
		ordering = ['-date','username']
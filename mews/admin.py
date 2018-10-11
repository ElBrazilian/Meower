from django.contrib import admin
from .models import Mew
# Register your models here.
@admin.register(Mew)
class AuthorAdmin(admin.ModelAdmin):
	list_display = ['username','content','date']
# Generated by Django 2.1.1 on 2018-10-09 09:11

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mews', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='mew',
            options={'ordering': ['-date', 'username']},
        ),
        migrations.AddField(
            model_name='mew',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date de parution'),
        ),
    ]

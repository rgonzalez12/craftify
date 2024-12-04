# Generated by Django 5.1.3 on 2024-12-03 21:25

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('craftify', '0007_userextended_profile_picture_userextended_website'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='purchaseorder',
            name='items',
        ),
        migrations.AddField(
            model_name='item',
            name='seller',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='items_for_sale', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='purchaseorder',
            name='total_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='purchaseorderitem',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.01, max_digits=10),
        ),
        migrations.AlterField(
            model_name='item',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.01, max_digits=10, validators=[django.core.validators.MinValueValidator(0.01)]),
        ),
    ]
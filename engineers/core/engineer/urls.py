from django.urls import path
from . import views


urlpatterns = [
    path("", views.ListCreateEngineerView.as_view(), name="Create/List Engineers"),
    path("<int:pk>/", views.RetrieveUpdateDeleteEngineerView.as_view(), name="Retrieve Update Delete Engineer")
]

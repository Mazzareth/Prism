# art/views.py
from django.shortcuts import render, get_object_or_404
from .models import Artwork
from django.http import HttpResponse

def artwork_list(request):
    artworks = Artwork.objects.all()
    return render(request, 'art/artwork_list.html', {'artworks': artworks})

def artwork_detail(request, pk):
    artwork = get_object_or_404(Artwork, pk=pk)
    return render(request, 'art/artwork_detail.html', {'artwork': artwork})

def create_artwork(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        Artwork.objects.create(title=title, description=description)
        return HttpResponse("Artwork created successfully") # Redirect in real project
    return render(request, 'art/create_artwork.html')
from django.shortcuts import render
from django.http import Http404, HttpResponse

from .models import Mew
# Create your views here.
def parsedDate(date):
	debut = date.strftime('%a %b %d %Y at ')
	heure = int(date.strftime('%H'))+2
	debut += str(heure)
	debut += date.strftime(':%M:%S')
	return debut

def home(request):

	mews = Mew.objects.all()
	for mew in mews:
		mew.date = parsedDate(mew.date)
	return render(request,'mews/home.html',{'mews':mews})

def getMews(request):
	mews = Mew.objects.all()
	for mew in mews:
		mew.date = parsedDate(mew.date)
	return render(request,'mews/get.html',{'mews':mews})

def newMew(request):
	if request.method != 'POST':
		raise Http404 

	username = request.POST.get('username')
	content = request.POST.get('content')

	if len(username) > 3 and len(username) <= 42 and len(content) > 5 and len(content) <= 400:
		# Process to add to DB
		print('username :',username,'\ncontent : ',content)

		mew = Mew(username=username,content=content)
		mew.save()

		return HttpResponse('<h1>Done</h1>')

	else:
		return HttpResponse(status=422)
from django.shortcuts import redirect


def unauthenticated_user(view_func):
    def wrapper_func(request):
        if request.user.is_authenticated:
            return view_func(request)
        else:
            return redirect('login')
    return wrapper_func

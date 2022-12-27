from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
import braintree

# Create your views here.

gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        braintree.Environment.Sandbox,
        merchant_id="q5s78h4n9wqk2kkb",
        public_key="n9y9zhr9hwtxq42q",
        private_key="f47f2066ffec9e6edc22c315410bea52"
    )
)
#function to validate user logged in session.
def validate_uesr_session(id, token):
    UserModel = get_user_model()
    try:
        user = UserModel.objects.get(pk=id) #Getting user by using id 
        if user.session_token == token:#Checking if user's session token is equal to active token then return true
            return True
        return False
    except UserModel.DoesNotExist:
        return False

@csrf_exempt
#Function to generate token for a user
def generate_token(request,id,token):
    if not validate_uesr_session(id, token):# Checking user session
        return JsonResponse({'error':'Invalid session, Please login again'})

    return JsonResponse({'Client_Token':gateway.client_token.generate(),'Success':True})

@csrf_exempt
def process_payment(request, id ,token):
    #First checking user session:
    if not validate_uesr_session(id, token):# Checking user session
        return JsonResponse({'error':'Invalid session, Please login again'})

    nonce_from_the_client = request.POST["paymentMethodNonce"]
    amount_from_the_client = request.POST["amount"]

    result = gateway.transaction.sale(
        {
            "amount": amount_from_the_client,
            "payment_method_nonce": nonce_from_the_client,
            "options": {
                "submit_for_settlement": True
                }
      }
    )

    if result.is_success:
        return JsonResponse({
            "success":result.is_success,
            "transaction":{'id':result.transaction.id, 
                            'amount':result.transaction.amount} 
            })
    else:
        return JsonResponse({'error':True,'success':False})

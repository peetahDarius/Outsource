from urllib import response
import requests
from requests.auth import HTTPBasicAuth
import base64


class MpesaB2C:
    """This class handles M-Pesa B2C transactions: registering URLs, authorization,
    payment confirmation, URL validation, and payment simulation.

    Attributes:
        __authorization_url: Endpoint for generating authorization details.
        __register_url_endpoint: Endpoint for registering URLs.

    Models:
        _authorization: This is the method that is used to get the access token, that will be used to make requests to
            the Daraja API.
        register_url: This is the method that will be used to register your local server's endpoint. The endpoints
            provided will receive confirmation responses once a transaction has been successful.
        simulate_transaction: Method used to simulate transactions in the Daraja sandbox.
        production_urls: Method used to change the sandbox urls to production urls.
        get_set_urls: Method used to check whether the urls have been set correctly. The method checks the current set urls
    """

    __authorization_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    __disbursement_endpoint = "https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest"

    def __init__(self, consumer_key, consumer_secret):
        """Initialize the MpesaB2c instance with consumer key and secret."""

        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret

    def _authorization(self):
        """Perform a request to the authorization_url endpoint using the consumer key and secret
        to generate an access token for Daraja API requests.
        Returns:
            string: returns an access token"""
        r = requests.get(
            self.__authorization_url,
            auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret)
        )
        data = r.json()
        return data["access_token"]

    def disburse(self, originator_conversation_id, initiator_name, security_credential, command_id, amount, party_a, party_b, remarks, queue_timeout_url, result_url, occasion):
        headers = {"Authorization": "Bearer %s" % self._authorization()}
        req_data = {
            "OriginatorConversationID": originator_conversation_id,
            "InitiatorName": initiator_name,
            "SecurityCredential": security_credential,
            "CommandID": command_id,
            "Amount": amount,
            "PartyA": party_a,
            "PartyB": party_b,
            "Remarks": remarks,
            "QueueTimeOutURL": queue_timeout_url,
            "ResultURL": result_url,
            "Occassion": occasion
            }
        response = requests.post(url=self.__disbursement_endpoint, json=req_data, headers=headers)
        return response.json()
    
    @staticmethod
    def encode_password(password):
        return base64.b64encode(password.encode("utf-8"))

    @classmethod
    def production_urls(cls, authorization_url, register_urls_endpoint):
        cls.__authorization_url = authorization_url
        cls.__register_url_endpoint = register_urls_endpoint

    def get_set_urls(self):
        return {"authorization_urls": self.__authorization_url,
                "register_url_endpoint": self.__register_url_endpoint,
                "simulation_endpoint": self.__simulation_endpoint}

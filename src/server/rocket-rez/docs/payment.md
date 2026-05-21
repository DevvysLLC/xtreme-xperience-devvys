# RocketRez Payment app.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './components/PaymentForm';
import './App.css';
import { MessageType, PostMessage } from './models/types/postMessage';
import { getPaymentGatewayConfig } from './utils/apiClient';

function App() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processPaymentDto, setprocessPaymentDto] = useState<any>(null);
  const [userGuid, setUserGuid] = useState<any>(null);
  const [cartToken, setCartToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [allowSecondaryPayments, setAllowSecondaryPayments] = useState<boolean>(true);
  const [parentOrigin, setParentOrigin] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);

const ALLOWED_ORIGINS = [
  'https://staging.rocket-rez.com',
  'https://secure.rocket-rez.com',
  'http://localhost:3000',
];

// Pattern for: https://pr####.dev.aws.rocket-rez.com
const PR_ENV_REGEX = /^https:\/\/pr\d+\.dev\.aws\.rocket-rez\.com$/;

function isAllowedOrigin(origin: string) {
  return (
    ALLOWED_ORIGINS.includes(origin) ||
    PR_ENV_REGEX.test(origin)
  );
}
  // Function to send messages to parent window
  const sendMessageToParent = (message: PostMessage) => {
    if (window.parent && window.parent !== window && parentOrigin) {
      window.parent.postMessage(message, parentOrigin);
    } else if (!parentOrigin) {
        //TODO: console warn is just for dev,
        //Need something actionable
      console.warn("Parent origin not yet established, cannot send message.");
    }
  };

  //Filters out internal Stripe logs
  function containsStripeJsV3(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;

  if (obj.__stripeJsV3) return true;

  for (const key in obj) {
    if (containsStripeJsV3(obj[key])) return true;
  }

  return false;
}
  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {

       let data: any = event.data;
        if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {}
      }

      // Skip Stripe’s internal messages
      if (event.origin.includes('.stripe.com')) return;
      if (containsStripeJsV3(data)) return;

      if (!isAllowedOrigin(event.origin)) {
        console.warn(`Blocked message from unauthorized origin: ${event.origin}`);
        return;
      }

       if (!parentOrigin) {
      setParentOrigin(event.origin);
      }

       const { type, cartId, clientSecret, paymentRequest, userGuid, cartToken, paymentMethodId } = event.data;

      switch (type as MessageType) {
        case 'INIT':
          if (cartId) {
            setLoading(false);
            setIsReady(true);

            // Set authentication tokens if provided
            if (cartToken) {
              setCartToken(cartToken);
            }
            if (userGuid) {
              setUserGuid(userGuid);
            }

            // Set paymentMethodId if provided
            if (paymentMethodId) {
              setPaymentMethodId(paymentMethodId);
            }

            // Send READY message directly using event.origin because state update is async
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'READY' }, event.origin);
           }
          }
          break;

        case 'PROCESS_PAYMENT':
          if (clientSecret) {
            setClientSecret(clientSecret);
            setprocessPaymentDto(paymentRequest);
            setUserGuid(userGuid);
            setCartToken(cartToken);

            if (paymentRequest?.allowSecondaryPayments !== undefined) {
              setAllowSecondaryPayments(paymentRequest.allowSecondaryPayments);
            }
          }
          break;

        default:
          console.warn(`Unknown message type: ${type}`);
          sendMessageToParent({ type: 'UNKNOWN_MESSAGE_TYPE' });
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [parentOrigin]);

  // Send READY message when component mounts (in case parent loaded first)
  useEffect(() => {
    setTimeout(() => {
      sendMessageToParent({ type: 'READY' });
    }, 100);
  }, []);

  // Fetch gateway configuration and initialize Stripe when paymentMethodId and cartToken are available
  useEffect(() => {
    if (!paymentMethodId || !cartToken) return;

    const initializeStripe = async () => {
      try {
        const config = await getPaymentGatewayConfig(paymentMethodId, cartToken);

        const stripe = loadStripe(config.publicKey, {
          stripeAccount: config.connectedAccountId,
          apiVersion: "2022-11-15",
        });

        setStripePromise(stripe);
      } catch (error) {
        console.error("Failed to load Stripe configuration:", error);
        sendMessageToParent({
          type: 'PAYMENT_ERROR',
          error: 'Failed to initialize payment gateway'
        });
      }
    };

    initializeStripe();
  }, [paymentMethodId, cartToken]);

  return (
  clientSecret && stripePromise ? (
    <Elements
      stripe={stripePromise as any}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2c5aa0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
        },
      }}
    >
      <PaymentForm
        clientSecret={clientSecret}
        processPaymentDto={processPaymentDto}
        cartToken={cartToken}
        userGuid={userGuid}
        loading={loading}
        isReady={isReady}
        allowSecondaryPayments={allowSecondaryPayments}
        onPaymentAuthSuccess={(paymentIntentId, status) => {
          sendMessageToParent({ type: 'PAYMENT_AUTH_SUCCESS', paymentIntentId, status });
        }}
        onPaymentCaptureSuccess={(paymentIntentId, orderId, status) => {
          sendMessageToParent({ type: 'PAYMENT_SUCCESS', paymentIntentId, orderId, status });
        }}
        onPaymentCaptureError={(error) => {
          sendMessageToParent({ type: 'PAYMENT_ERROR', error });
        }}
        onPaymentAuthError={(error) => {
          sendMessageToParent({ type: 'PAYMENT_AUTH_ERROR', error });
        }}
      />
    </Elements>
  ) : (
    <div>Initializing payment gateway…</div>
  )
);
}

export default App;
```

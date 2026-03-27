require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin using your service account
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dkweb-c820f-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// M-Pesa Credentials
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackUrl = process.env.MPESA_CALLBACK_URL;

/**
 * Generate M-Pesa Access Token
 */
const getAccessToken = async () => {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating token:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Handle STK Push Request
 */
app.post('/api/mpesa/stkpush', async (req, res) => {
    const { phone, amount, orderId } = req.body;

    if (!phone || !amount) {
        return res.status(400).json({ error: 'Phone and Amount are required' });
    }

    // Format phone: 2547XXXXXXXX
    const formattedPhone = phone.startsWith('0') ? '254' + phone.slice(1) : phone;

    try {
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl, // This should be your publicly accessible backend URL
            AccountReference: orderId || 'FortuneDKOrder',
            TransactionDesc: 'FORTUNE DK Payment'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json({ status: 'success', data: response.data });

        // Store CheckoutRequestID in Firestore for later lookup by callback
        if (orderId && response.data.CheckoutRequestID) {
            await db.collection('orders').doc(orderId).update({
                checkoutRequestID: response.data.CheckoutRequestID,
                stkPushInitiatedAt: admin.firestore.FieldValue.serverTimestamp(),
                stkPushResponse: response.data // Store the full response for debugging
            }).catch(err => console.error('Firestore Update Error (STK Push):', err));
        }

    } catch (error) {
        // Log the full error response from M-Pesa if available
        console.error('STK Push Error:', error.response?.data || error.message);
        res.status(500).json({ status: 'error', message: 'Failed to initiate STK Push' });
    }
});

/**
 * Handle M-Pesa Callback
 */
app.post('/api/mpesa/callback', async (req, res) => {
    const callbackData = req.body.Body.stkCallback;
    console.log('M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));

    const checkoutRequestID = callbackData.CheckoutRequestID;

    // Find the order using the CheckoutRequestID
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.where('checkoutRequestID', '==', checkoutRequestID).limit(1).get();

    if (snapshot.empty) {
        console.log('No order found for this checkoutRequestID');
        return res.json({ ResultCode: 1, ResultDesc: 'Order Not Found' });
    }

    const orderDoc = snapshot.docs[0];

    if (callbackData.ResultCode === 0) {
        const metadata = callbackData.CallbackMetadata.Item;
        const transactionId = metadata.find(i => i.Name === 'MpesaReceiptNumber').Value;

        await orderDoc.ref.update({
            status: 'paid',
            mpesaReceipt: transactionId,
            paidAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } else {
        await orderDoc.ref.update({ status: 'failed', paymentError: callbackData.ResultDesc });
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

app.listen(PORT, () => {
    console.log(`FORTUNE DK M-Pesa Server running on port ${PORT}`);
});

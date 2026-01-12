"""
Push Notification Service using Firebase Cloud Messaging
"""

import os
from flask import current_app
from app.models.user import User

# Initialize Firebase Admin SDK if credentials exist
firebase_initialized = False

try:
    import firebase_admin
    from firebase_admin import credentials, messaging
    
    cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH')
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        firebase_initialized = True
        print("Firebase Admin SDK initialized successfully")
except Exception as e:
    print(f"Firebase initialization skipped: {e}")


def send_push_notification(user_id, title, body, data=None):
    """
    Send push notification to user via Firebase Cloud Messaging
    
    Args:
        user_id: The user ID to send notification to
        title: Notification title
        body: Notification body text
        data: Optional additional data payload
    
    Returns:
        bool: True if sent successfully, False otherwise
    """
    if not firebase_initialized:
        print(f"[NOTIFICATION] Firebase not initialized. Would send to user {user_id}: {title}")
        return False
    
    try:
        from app import db
        user = User.query.get(user_id)
        
        if not user or not user.fcm_token:
            print(f"[NOTIFICATION] User {user_id} has no FCM token")
            return False
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            data=data or {},
            token=user.fcm_token
        )
        
        response = messaging.send(message)
        print(f"[NOTIFICATION] Successfully sent message: {response}")
        return True
        
    except Exception as e:
        print(f"[NOTIFICATION] Error sending notification: {e}")
        return False


def send_notification_to_topic(topic, title, body, data=None):
    """
    Send push notification to a topic (e.g., all collectors)
    
    Args:
        topic: The topic name (e.g., 'collectors')
        title: Notification title
        body: Notification body text
        data: Optional additional data payload
    
    Returns:
        bool: True if sent successfully, False otherwise
    """
    if not firebase_initialized:
        print(f"[NOTIFICATION] Firebase not initialized. Would send to topic {topic}: {title}")
        return False
    
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            data=data or {},
            topic=topic
        )
        
        response = messaging.send(message)
        print(f"[NOTIFICATION] Successfully sent to topic: {response}")
        return True
        
    except Exception as e:
        print(f"[NOTIFICATION] Error sending to topic: {e}")
        return False

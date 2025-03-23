import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import tensorflow.keras.backend as K

def rev_loss(s_true, s_pred):
    beta = 1.0
    return beta * K.sum(K.square(s_true - s_pred))

def full_loss(y_true, y_pred):
    s_true, c_true = y_true[..., 0:3], y_true[..., 3:6]
    s_pred, c_pred = y_pred[..., 0:3], y_pred[..., 3:6]
    s_loss = rev_loss(s_true, s_pred)
    c_loss = K.sum(K.square(c_true - c_pred))
    return s_loss + c_loss

MODEL_PATH = "autoencoder.h5"
IMG_SHAPE = (128, 128, 3)

def load_autoencoder_model():
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH, custom_objects={'full_loss': full_loss, 'rev_loss': rev_loss})
        return model
    else:
        raise Exception("Model not found. Please train the model and save it as autoencoder.h5.")

def process_images(secret_image: np.ndarray, cover_image: np.ndarray, model) -> tuple:
    """
    Processes the images through the model.
    - secret_image, cover_image: NumPy arrays of shape (128, 128, 3) with values in [0,1].
    Returns: encoded_cover, decoded_secret, and difference (all as NumPy arrays).
    """
    secret_batch = np.expand_dims(secret_image, axis=0)
    cover_batch = np.expand_dims(cover_image, axis=0)
    
    outputs = model.predict([secret_batch, cover_batch])
    decoded_secret = outputs[..., 0:3][0]
    encoded_cover = outputs[..., 3:6][0]
    
    difference = np.abs(secret_image - decoded_secret)
    
    return encoded_cover, decoded_secret, difference

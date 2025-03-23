import io
import base64
from PIL import Image
import numpy as np

def numpy_to_base64(image_array: np.ndarray) -> str:
    """
    Converts a NumPy image array (float32 in [0,1]) to a base64-encoded PNG string.
    """
    image_array = (image_array * 255).astype('uint8')
    image = Image.fromarray(image_array)
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def read_imagefile(file) -> np.ndarray:
    """
    Reads an uploaded image file into a NumPy array resized to 128x128 and normalized.
    """
    image = Image.open(file)
    image = image.convert("RGB")
    image = image.resize((128, 128))
    image_array = np.array(image).astype("float32") / 255.0
    return image_array

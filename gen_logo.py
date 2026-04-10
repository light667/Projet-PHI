from PIL import Image
import sys
import os

try:
    img = Image.open('logo.png').convert("RGBA")
    data = img.getdata()
    # Convert opaque pixels to white
    new_data = []
    for item in data:
        # threshold for opacity
        if item[3] > 0:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append((255, 255, 255, 0))
    img.putdata(new_data)
    
    frontend_public = os.path.join("frontend", "public")
    if not os.path.exists(frontend_public):
        os.makedirs(frontend_public)
        
    img.save(os.path.join(frontend_public, "logo-dark.png"))
    
    # generate favicon
    favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(frontend_public, "favicon.ico"), format='ICO')
    print("Logo and favicon created successfully.")
except Exception as e:
    print(f"Error: {e}")

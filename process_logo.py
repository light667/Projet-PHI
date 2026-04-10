from PIL import Image
import os

try:
    img = Image.open('logo.png').convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Transparent background if pixel is white/very light grey
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop to bounding box to remove extra padding
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    frontend_public = os.path.join('frontend', 'public')
    out_path = os.path.join(frontend_public, 'logo.png')
    img.save(out_path)
    
    fav_path = os.path.join(frontend_public, 'favicon.png')
    img.resize((64, 64), Image.Resampling.LANCZOS).save(fav_path)
    
    print(f"Success! Saved to {out_path} and {fav_path}")

except Exception as e:
    print(f"Error processing image: {e}")

from PIL import Image

def crop_transparent_edges(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    
    if bbox:
        # Crop the image
        img_cropped = img.crop(bbox)
        
        # Optional: Make it perfectly square by adding minimal padding to the shorter side
        width, height = img_cropped.size
        max_dim = max(width, height)
        
        # Create a new transparent square image
        square_img = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
        
        # Paste the cropped image in the center
        offset = ((max_dim - width) // 2, (max_dim - height) // 2)
        square_img.paste(img_cropped, offset)
        
        # Save it back
        square_img.save(output_path)
        print("Favicon successfully cropped and squared!")
    else:
        print("Image is entirely transparent or bounding box not found.")

if __name__ == "__main__":
    crop_transparent_edges(
        "client/public/favicon.png", 
        "client/public/favicon.png"
    )

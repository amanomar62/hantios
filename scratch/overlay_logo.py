import os
from PIL import Image

def overlay_logo(dashboard_path, logo_path, output_path):
    print(f"Opening dashboard: {dashboard_path}")
    db_img = Image.open(dashboard_path).convert("RGBA")
    
    print(f"Opening logo: {logo_path}")
    logo_img = Image.open(logo_path).convert("RGBA")
    
    # Crop transparent edges of logo first to make it clean and tight
    bbox = logo_img.getbbox()
    if bbox:
        logo_img = logo_img.crop(bbox)
        print("Cropped logo transparent edges.")
        
    # Resize logo to fit the dashboard's sidebar header area
    target_width = 150
    w_percent = (target_width / float(logo_img.size[0]))
    h_size = int((float(logo_img.size[1]) * float(w_percent)))
    logo_resized = logo_img.resize((target_width, h_size), Image.Resampling.LANCZOS)
    print(f"Resized logo to {target_width}x{h_size}")
    
    # Paste logo at top-left corner of the dashboard (x=25, y=25)
    position = (25, 25)
    
    # Optional: we can paint a solid color backplate if there is background noise, 
    # but transparent overlay is cleaner.
    # Create temporary clean background area for the logo to avoid text collision
    logo_bg = Image.new("RGBA", (target_width + 20, h_size + 20), (250, 247, 242, 255)) # Cream color from index.css
    db_img.paste(logo_bg, (position[0] - 10, position[1] - 10))
    
    # Paste logo
    db_img.paste(logo_resized, position, logo_resized)
    
    # Save output
    db_img.save(output_path, "PNG")
    print(f"Successfully overlaid logo and saved to {output_path}")

if __name__ == "__main__":
    db = r"C:\Users\kapiir\.gemini\antigravity\brain\fe57fc37-d8cd-43f0-8164-32ccc65c6677\somali_hantios_dashboard_1780763410036.png"
    logo = r"c:\Users\kapiir\Desktop\hantios\client\public\logo.png"
    out = r"c:\Users\kapiir\Desktop\hantios\client\public\generated-dashboard.png"
    overlay_logo(db, logo, out)
